'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateOrderStatus } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Updating...' : 'Update Status'}
    </button>
  );
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const updateOrderStatusWithId = updateOrderStatus.bind(null, orderId);
  const [state, formAction] = useActionState(updateOrderStatusWithId, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.success && (
        <div className="rounded-md bg-green-50 p-3">
          <p className="text-sm text-green-800">{state.message}</p>
        </div>
      )}

      {state.message && !state.success && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-900 mb-2">
          Order Status
        </label>
        <select
          name="status"
          id="status"
          defaultValue={currentStatus}
          className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton />
    </form>
  );
}
