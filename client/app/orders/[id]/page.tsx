import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { SuccessBanner } from './success-banner';

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
      price: schema.orderItems.price,
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

export default async function OrderDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { success?: string };
}) {
  const order = await getOrderDetails(params.id);

  if (!order) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const statusText = {
    pending: 'Payment pending',
    confirmed: 'Order confirmed',
    preparing: 'Preparing order',
    ready_for_pickup: 'Ready for pickup',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };

  const showSuccess = searchParams.success === 'true';

  // Parse JSON fields
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress as string) : null;
  const paymentMethod = order.paymentMethod ? JSON.parse(order.paymentMethod as string) : null;

  // Convert string amounts to numbers
  const subtotal = parseFloat(order.subtotal || '0');
  const tax = parseFloat(order.tax || '0');
  const shipping = parseFloat(order.deliveryFee || '0');
  const total = parseFloat(order.total || '0');

  return (
    <>
      <Header />
      {showSuccess && <SuccessBanner />}
      <main className="relative lg:min-h-full bg-white">
        <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <div className="size-full bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-4">🎉</div>
              <p className="text-2xl font-bold text-emerald-700">Order Complete!</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1 className="text-sm font-medium text-emerald-600">
                {order.status === 'delivered' ? 'Order delivered' : 'Payment successful'}
              </h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Thanks for ordering
              </p>
              <p className="mt-2 text-base text-slate-600">
                We appreciate your order! Your delicious nutrition items {order.status === 'delivered' ? 'have been delivered' : 'are being prepared'}. Check your email for confirmation and tracking details.
              </p>

              <dl className="mt-16 text-sm font-medium">
                <dt className="text-slate-900">Order number</dt>
                <dd className="mt-2 text-emerald-600">{order.orderNumber}</dd>
              </dl>

              <ul
                role="list"
                className="mt-6 divide-y divide-slate-200 border-t border-slate-200 text-sm font-medium text-slate-600"
              >
                {order.items.map((item) => (
                  <li key={item.id} className="flex space-x-6 py-6">
                    <div className="size-24 flex-none rounded-md bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-5xl">
                      {item.productEmoji}
                    </div>
                    <div className="flex-auto space-y-1">
                      <h3 className="text-slate-900">
                        <Link href={`/products/${item.productId}`} className="hover:text-emerald-600">
                          {item.productName}
                        </Link>
                      </h3>
                      <p className="text-slate-500">{item.productDescription}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="flex-none font-medium text-slate-900">${parseFloat(item.price).toFixed(2)}</p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-6 border-t border-slate-200 pt-6 text-sm font-medium text-slate-600">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-slate-900">${order.subtotal.toFixed(2)}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-slate-900">
                    {order.shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${order.shipping.toFixed(2)}`
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt>Tax (10%)</dt>
                  <dd className="text-slate-900">${order.tax.toFixed(2)}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-slate-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base font-semibold">${order.total.toFixed(2)}</dd>
                </div>
              </dl>

              <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-900">Shipping Address</dt>
                  <dd className="mt-2">
                    <address className="not-italic">
                      <span className="block">{shippingAddress?.name || order.customerName}</span>
                      <span className="block">{shippingAddress?.street}</span>
                      <span className="block">
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
                      </span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Payment Information</dt>
                  <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                    {paymentMethod && (
                      <>
                        <div className="flex-none">
                          <svg width={36} height={24} viewBox="0 0 36 24" aria-hidden="true" className="h-6 w-auto">
                            <rect rx={4} fill="#10b981" width={36} height={24} />
                            <path
                              d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                              fill="#fff"
                            />
                          </svg>
                          <p className="sr-only">{paymentMethod.type}</p>
                        </div>
                        <div className="flex-auto">
                          <p className="text-slate-900">Ending with {paymentMethod.last4}</p>
                          <p>
                            Expires {paymentMethod.expiryMonth} / {paymentMethod.expiryYear}
                          </p>
                        </div>
                      </>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-16 border-t border-slate-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>

              <div className="mt-6 text-right">
                <Link
                  href="/orders"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  ← Back to all orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
