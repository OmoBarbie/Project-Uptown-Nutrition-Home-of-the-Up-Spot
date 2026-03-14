"use client";

import { useState, useActionState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { createPaymentIntent, type CheckoutState } from "./actions";
import type { CartItem } from "@/app/context/CartContext";

const initialState: CheckoutState = {
  success: undefined,
  message: undefined,
  errors: undefined,
};

type CheckoutFormProps = {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  userEmail?: string;
  userName?: string;
};

export function CheckoutForm({
  cartItems,
  subtotal,
  tax,
  deliveryFee,
  total,
  userEmail,
  userName,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [state, formAction] = useActionState(createPaymentIntent, initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  // When we get a client secret, we can show the payment element
  useEffect(() => {
    if (state.clientSecret && stripe) {
      setPaymentReady(true);
    }
  }, [state.clientSecret, stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // If we don't have a client secret yet, create the payment intent first
    if (!state.clientSecret) {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
      return;
    }

    // Process the payment
    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${state.orderId}?success=true`,
        },
      });

      if (error) {
        console.error(error);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={userName}
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {state.errors?.name && (
              <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={userEmail}
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {state.errors?.email && (
              <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Delivery Address
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            {state.errors?.address && (
              <p className="mt-1 text-sm text-red-600">{state.errors.address[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {paymentReady && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm ring-1 ring-slate-900/5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Payment Information
          </h2>
          <PaymentElement />
        </div>
      )}

      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || (paymentReady && !stripe)}
        className="w-full rounded-md bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing
          ? 'Processing...'
          : paymentReady
            ? `Pay $${total.toFixed(2)}`
            : 'Continue to Payment'}
      </button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}
