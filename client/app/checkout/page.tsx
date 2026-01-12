"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { useCart } from "@/app/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./checkout-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { optimisticItems, subtotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && optimisticItems.length === 0) {
      router.push('/cart');
    }
  }, [mounted, optimisticItems.length, router]);

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (optimisticItems.length === 0) {
    return null;
  }

  const tax = subtotal * 0.08;
  const deliveryFee = subtotal >= 50 ? 0 : 5;
  const total = subtotal + tax + deliveryFee;

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-slate-950 min-h-screen">
        <Container className="py-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: Math.round(total * 100),
                    currency: 'usd',
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <CheckoutForm
                    cartItems={optimisticItems}
                    subtotal={subtotal}
                    tax={tax}
                    deliveryFee={deliveryFee}
                    total={total}
                    userEmail={session?.user.email}
                    userName={session?.user.name}
                  />
                </Elements>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Order Summary
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {optimisticItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="text-4xl">{item.imageSrc}</div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                            {item.name}
                          </h3>
                          {(item.flavor || item.size) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.flavor || item.size}
                            </p>
                          )}
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Tax (8%)</span>
                      <span className="text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                      <span className="text-slate-900 dark:text-white">
                        {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    {subtotal < 50 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                      </p>
                    )}
                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-900 dark:text-white">Total</span>
                      <span className="text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
