'use client';

import { useTransition } from 'react';
import { markCashPaymentReceived } from '../actions';

export function CashPaymentButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markCashPaymentReceived(orderId);
      if (!result.success) alert(result.message);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
    >
      {isPending ? 'Confirming...' : 'Mark as Paid'}
    </button>
  );
}
