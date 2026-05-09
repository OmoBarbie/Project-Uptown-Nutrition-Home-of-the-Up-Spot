'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import { TAX_RATE } from '@/lib/constants'
import { useMounted } from '@/app/hooks/use-mounted'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useSession } from '@/lib/auth-client'
import { CheckoutForm } from './checkout-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function calcStripeFee(amount: number) {
  return Math.round((amount * 0.029 + 0.30) * 100) / 100
}

export default function CheckoutPage() {
  const { optimisticItems, subtotal } = useCart()
  const { data: session, isPending: sessionPending } = useSession()
  const router = useRouter()
  const mounted = useMounted()
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')

  const cartEmpty = optimisticItems.length === 0
  const sessionUserId = session?.user?.id ?? null

  useEffect(() => {
    if (mounted && cartEmpty)
      router.push('/cart')
  // eslint-disable-next-line react/exhaustive-deps
  }, [mounted, cartEmpty])

  useEffect(() => {
    if (mounted && !sessionPending && !sessionUserId) {
      router.push('/login?callbackUrl=/checkout')
    }
  // eslint-disable-next-line react/exhaustive-deps
  }, [mounted, sessionPending, sessionUserId])

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

  if (optimisticItems.length === 0)
    return null

  const tax = subtotal * TAX_RATE
  const deliveryFee = 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const baseTotal = afterDiscount + tax + deliveryFee
  const stripeFee = calcStripeFee(baseTotal)
  const grandTotal = baseTotal + stripeFee

  function handleDiscountChange(d: number, code: string) {
    setDiscount(d)
    setCouponCode(code)
  }

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
                  amount: Math.max(50, Math.round(grandTotal * 100)),
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
                {/* key resets form (and discards any existing PaymentIntent) when discount changes */}
                <CheckoutForm
                  key={discount}
                  cartItems={optimisticItems}
                  subtotal={subtotal}
                  tax={tax}
                  deliveryFee={deliveryFee}
                  total={grandTotal}
                  discount={discount}
                  couponCode={couponCode}
                  onDiscountChange={handleDiscountChange}
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
                        <p className="text-xs text-foreground/50 mt-0.5">
                          Qty
                          {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-charcoal shrink-0">
                        $
                        {(Number.parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand pt-4 space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="text-charcoal">
                      $
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-terracotta-500 font-medium">
                        Discount
                        {couponCode && ` (${couponCode})`}
                      </span>
                      <span className="text-terracotta-500 font-medium">
                        −$
                        {discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Tax (8%)</span>
                    <span className="text-charcoal">
                      $
                      {tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Delivery</span>
                    <span className="text-forest-600 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Processing fee (2.9% + $0.30)</span>
                    <span className="text-charcoal">
                      $
                      {stripeFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-sand">
                    <span className="font-display text-lg font-medium text-charcoal">Total</span>
                    <span className="font-display text-lg font-medium text-charcoal">
                      $
                      {grandTotal.toFixed(2)}
                    </span>
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
