import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { EyeIcon } from '@heroicons/react/24/outline';

async function getOrders() {
  const db = getDb();

  const orders = await db
    .select()
    .from(schema.orders)
    .orderBy(schema.orders.createdAt);

  return orders;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready_for_pickup: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-slate-100 text-slate-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  succeeded: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-orange-100 text-orange-800',
};

export default async function OrdersPage() {
  const orders = await getOrders();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage and track customer orders
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                Order Number
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Customer
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Total
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Payment
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                  {order.orderNumber}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  <div>
                    <div className="font-medium text-slate-900">{order.customerName}</div>
                    <div className="text-slate-500">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                  ${parseFloat(order.total).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors] || 'bg-slate-100 text-slate-800'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-800'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-x-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
