import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { OrderStatusForm } from './order-status-form';
import { RefundButton } from './refund-button';

async function getOrderDetails(id: string) {
  const db = getDb();

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, id))
    .limit(1);

  if (!order) {
    return null;
  }

  // Fetch order items with product details
  const orderItems = await db
    .select({
      id: schema.orderItems.id,
      quantity: schema.orderItems.quantity,
      price: schema.orderItems.unitPrice,
      productId: schema.orderItems.productId,
      productName: schema.products.name,
      productEmoji: schema.products.emoji,
      productDescription: schema.products.description,
    })
    .from(schema.orderItems)
    .innerJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
    .where(eq(schema.orderItems.orderId, id));

  return {
    ...order,
    items: orderItems,
  };
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

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderDetails(id);

  if (!order) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Address is stored as JSON in deliveryInstructions (shippingAddress column unused)
  const shippingAddress = order.deliveryInstructions
    ? (() => { try { return JSON.parse(order.deliveryInstructions as string) } catch { return null } })()
    : null;
  const paymentMethod = order.paymentMethod ? JSON.parse(order.paymentMethod as string) : null;

  // Convert string amounts to numbers
  const subtotal = parseFloat(order.subtotal || '0');
  const discount = parseFloat(order.discount || '0');
  const tax = parseFloat(order.tax || '0');
  const shipping = parseFloat(order.deliveryFee || '0');
  const total = parseFloat(order.total || '0');

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Order {order.orderNumber}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-x-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors] || 'bg-slate-100 text-slate-800'}`}>
              Payment: {order.paymentStatus}
            </span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-800'}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
            {order.paymentStatus === 'succeeded' && order.status !== 'refunded' && (
              <RefundButton orderId={order.id} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
            <ul className="divide-y divide-slate-200">
              {order.items.map((item) => (
                <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-x-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-3xl">
                      {item.productEmoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{item.productName}</div>
                      <div className="text-sm text-slate-500">{item.productDescription}</div>
                      <div className="text-sm text-slate-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium text-slate-900">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-slate-200 pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 font-medium">Discount</span>
                  <span className="font-medium text-emerald-600">−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-medium text-slate-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-900">Contact Information</dt>
                <dd className="mt-2 text-sm text-slate-600">
                  <div>{order.customerName}</div>
                  <div>{order.customerEmail}</div>
                  <div>{order.customerPhone}</div>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-900">Shipping Address</dt>
                <dd className="mt-2 text-sm text-slate-600">
                  {shippingAddress ? (
                    <address className="not-italic">
                      <div>{shippingAddress.name || order.customerName}</div>
                      <div>{shippingAddress.street}</div>
                      <div>
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                      </div>
                    </address>
                  ) : (
                    <div>No shipping address</div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update Order Status</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Payment Information */}
          {paymentMethod && (
            <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Method</span>
                  <span className="font-medium text-slate-900">{paymentMethod.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Card</span>
                  <span className="font-medium text-slate-900">•••• {paymentMethod.last4}</span>
                </div>
                {order.paymentIntentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment ID</span>
                    <span className="font-mono text-xs text-slate-900">{order.paymentIntentId.slice(0, 20)}...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Timeline</h2>
            <div className="space-y-3 text-sm">
              {order.createdAt && (
                <div>
                  <div className="font-medium text-slate-900">Order Placed</div>
                  <div className="text-slate-600">{formatDate(order.createdAt)}</div>
                </div>
              )}
              {order.confirmedAt && (
                <div>
                  <div className="font-medium text-slate-900">Order Confirmed</div>
                  <div className="text-slate-600">{formatDate(order.confirmedAt)}</div>
                </div>
              )}
              {order.completedAt && (
                <div>
                  <div className="font-medium text-slate-900">Completed</div>
                  <div className="text-slate-600">{formatDate(order.completedAt)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
