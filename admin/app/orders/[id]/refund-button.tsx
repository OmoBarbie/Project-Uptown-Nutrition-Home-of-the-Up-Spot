'use client';

import { useState, useTransition } from 'react';
import { refundOrder } from './refund-action';

export function RefundButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<'duplicate' | 'fraudulent' | 'customer_request' | 'other'>('customer_request');
  const [isPending, startTransition] = useTransition();

  function handleRefund() {
    startTransition(async () => {
      await refundOrder(orderId, reason);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200"
      >
        Refund Order
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Confirm Refund</h2>
            <p className="text-sm text-gray-600 mb-4">
              This will process a full refund via Stripe and cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as typeof reason)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="customer_request">Customer request</option>
                <option value="duplicate">Duplicate order</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border rounded-md py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={isPending}
                className="flex-1 bg-red-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
              >
                {isPending ? 'Processing…' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
