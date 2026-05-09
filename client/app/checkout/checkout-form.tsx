'use client'

import type { CheckoutState } from './actions'
import type { CartItem } from '@/app/context/CartContext'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { startTransition, useActionState, useState } from 'react'
import { createPaymentIntent } from './actions'
import { CouponInput } from './coupon-input'

const initialState: CheckoutState = {
  success: undefined,
  message: undefined,
  errors: undefined,
}

interface CheckoutFormProps {
  cartItems: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  discount: number
  couponCode: string
  onDiscountChange: (discount: number, code: string) => void
  userEmail?: string
  userName?: string
}

function FormSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="border border-sand p-6 bg-background">
      <h2 className="font-display text-xl font-medium text-charcoal mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Field({ id, label, error, children }: { id: string, label: string, error?: string, children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

const inputCls = 'block w-full border border-sand bg-background text-charcoal px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-forest-600 transition-colors'

export function CheckoutForm({
  cartItems: _cartItems,
  subtotal,
  tax: _tax,
  deliveryFee: _deliveryFee,
  total,
  discount,
  couponCode,
  onDiscountChange,
  userEmail,
  userName,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [state, formAction] = useActionState(createPaymentIntent, initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const paymentReady = !!(state.clientSecret && stripe)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements)
      return

    if (!state.clientSecret) {
      startTransition(() => formAction(new FormData(event.currentTarget)))
      return
    }

    setIsProcessing(true)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        console.error(submitError)
        setIsProcessing(false)
        return
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: state.clientSecret!,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${state.orderId}?success=true`,
        },
      })
      if (error)
        console.error(error)
    }
    catch (err) {
      console.error('Payment error:', err)
    }
    finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="discount" value={discount} />
      <input type="hidden" name="couponCode" value={couponCode} />

      <FormSection title="Coupon Code">
        <CouponInput
          subtotal={subtotal}
          onApply={onDiscountChange}
        />
      </FormSection>

      <FormSection title="Contact Information">
        <div className="space-y-4">
          <Field id="name" label="Full Name" error={state.errors?.name?.[0]}>
            <input type="text" id="name" name="name" defaultValue={userName} required className={inputCls} />
          </Field>
          <Field id="email" label="Email" error={state.errors?.email?.[0]}>
            <input type="email" id="email" name="email" defaultValue={userEmail} required className={inputCls} />
          </Field>
          <Field id="phone" label="Phone (Optional)">
            <input type="tel" id="phone" name="phone" className={inputCls} />
          </Field>
        </div>
      </FormSection>

      {/* eslint-disable-next-line style/spaced-comment */}
      {/*<FormSection title="Delivery Address">
        <div className="space-y-4">
          <Field id="street" label="Street Address" error={state.errors?.address?.[0]}>
            <input type="text" id="street" name="street" required className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field id="city" label="City">
              <input type="text" id="city" name="city" required className={inputCls} />
            </Field>
            <Field id="state-field" label="State">
              <input type="text" id="state-field" name="state" required className={inputCls} />
            </Field>
          </div>
          <Field id="zipCode" label="ZIP Code">
            <input type="text" id="zipCode" name="zipCode" required className={inputCls} />
          </Field>
        </div>
      </FormSection> */}

      {paymentReady && (
        <FormSection title="Payment">
          <PaymentElement />
        </FormSection>
      )}

      {state.message && !state.success && (
        <div className="border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || (paymentReady && !stripe)}
        className="w-full bg-forest-600 text-cream-100 py-3.5 text-sm font-semibold tracking-wide hover:bg-forest-700 active:bg-forest-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing…' : paymentReady ? `Pay $${total.toFixed(2)}` : 'Continue to Payment'}
      </button>

      <p className="text-xs text-center text-foreground/40">
        Your payment information is secure and encrypted
      </p>
    </form>
  )
}
