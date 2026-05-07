'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useSession } from '@/lib/auth-client'
import { CheckoutForm } from './checkout-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { optimisticItems, subtotal } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && optimisticItems.length === 0) router.push('/cart')
  }, [mounted, optimisticItems.length, router])

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-16">
          <Container>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-sand w-1/4" />
              <div className="h-4 bg-sand w-1/2" />
            </div>
          </Container>
        </main>
        <Footer />
      </>
    )
  }

  if (optimisticItems.length === 0) return null

  const tax = subtotal * 0.08
  const deliveryFee = subtotal >= 50 ? 0 : 5
  const total = subtotal + tax + deliveryFee

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <Container className="py-12 sm:py-16">
          {/* Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                Secure Checkout
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-charcoal">
              Complete Your Order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Checkout form */}
            <div className="lg:col-span-3">
              <Elements
                stripe={stripePromise}
                options={{
                  mode: 'payment',
                  amount: Math.round(total * 100),
                  currency: 'usd',
                  appearance: {
                    theme: 'flat',
                    variables: {
                      colorPrimary: '#3d7a5e',
                      colorBackground: '#f5f0e8',
                      colorText: '#2a2118',
                      colorDanger: '#dc2626',
                      borderRadius: '0px',
                      fontFamily: 'DM Sans, sans-serif',
                    },
                    rules: {
                      '.Input': { border: '1px solid #d4c9b8', padding: '10px 12px' },
                      '.Input:focus': { border: '1px solid #3d7a5e', boxShadow: 'none' },
                      '.Label': { fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.03em' },
                    },
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

            {/* Order summary */}
            <aside className="lg:col-span-2">
              <div className="border border-sand p-6 sticky top-24">
                <h2 className="font-display text-2xl font-medium text-charcoal mb-5">Order Summary</h2>

                <div className="divide-y divide-sand">
                  {optimisticItems.map(item => (
                    <div key={item.id} className="flex gap-4 py-4">
                      <div className="text-3xl w-10 shrink-0">{item.imageSrc}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">{item.name}</p>
                        <p className="text-xs text-foreground/50 mt-0.5">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-charcoal shrink-0">
                        ${(Number.parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand pt-4 space-y-2 mt-2">
                  {[
                    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                    { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
                    { label: 'Delivery', value: deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`, highlight: deliveryFee === 0 },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-foreground/60">{label}</span>
                      <span className={highlight ? 'text-forest-600 font-semibold' : 'text-charcoal'}>{value}</span>
                    </div>
                  ))}

                  {subtotal < 50 && (
                    <p className="text-xs text-terracotta-500 px-3 py-2 bg-terracotta-500/8">
                      Add ${(50 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}

                  <div className="flex justify-between pt-3 border-t border-sand">
                    <span className="font-display text-lg font-medium text-charcoal">Total</span>
                    <span className="font-display text-lg font-medium text-charcoal">${total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="mt-5 text-xs text-foreground/40 text-center">🔒 Secured by Stripe</p>
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
