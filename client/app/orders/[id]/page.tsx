import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

// Mock data - will be replaced with database query
const getOrderDetails = (id: string) => {
  const orders: Record<string, any> = {
    'UN00001': {
      id: 'UN00001',
      number: 'UN00001',
      status: 'delivered',
      createdDate: 'Dec 12, 2024',
      createdDatetime: '2024-12-12',
      deliveredDate: 'December 14, 2024',
      deliveredDatetime: '2024-12-14',
      trackingNumber: '51547878755545848512',
      subtotal: 28.00,
      shipping: 0.00, // Free shipping
      tax: 2.80,
      total: 30.80,
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
      paymentMethod: {
        type: 'Visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '25',
      },
      products: [
        {
          id: 1,
          name: 'Protein Pancakes',
          href: '/products/protein-pancakes',
          price: '$10.00',
          quantity: 1,
          imageSrc: '🥞',
          imageAlt: 'Protein pancakes',
          description: 'Fluffy protein-packed pancakes',
        },
        {
          id: 2,
          name: 'Strawberry Short Cake Smoothie',
          href: '/products/strawberry-short-cake',
          price: '$9.00',
          quantity: 2,
          imageSrc: '🍓',
          imageAlt: 'Strawberry smoothie',
          description: 'Creamy strawberry protein smoothie',
        },
      ],
    },
    'UN00002': {
      id: 'UN00002',
      number: 'UN00002',
      status: 'delivered',
      createdDate: 'Dec 8, 2024',
      createdDatetime: '2024-12-08',
      deliveredDate: 'December 10, 2024',
      deliveredDatetime: '2024-12-10',
      trackingNumber: '41234567890123456789',
      subtotal: 19.00,
      shipping: 0.00,
      tax: 1.90,
      total: 20.90,
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
      paymentMethod: {
        type: 'Visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '25',
      },
      products: [
        {
          id: 1,
          name: 'Watermelon Rush',
          href: '/products/watermelon-rush',
          price: '$10.00',
          quantity: 1,
          imageSrc: '🍉',
          imageAlt: 'Watermelon refresher',
          description: 'Refreshing 32oz watermelon energy drink',
        },
        {
          id: 2,
          name: 'Protein Coffee 24oz',
          href: '/products/protein-coffee',
          price: '$9.00',
          quantity: 1,
          imageSrc: '☕',
          imageAlt: 'Protein coffee',
          description: 'High-protein iced coffee',
        },
      ],
    },
  };

  return orders[id] || null;
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderDetails(params.id);

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
            <p className="mt-2 text-slate-600">The order you're looking for doesn't exist.</p>
            <Link
              href="/orders"
              className="mt-4 inline-block text-emerald-600 hover:text-emerald-500"
            >
              ← Back to orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
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
                <dt className="text-slate-900">Tracking number</dt>
                <dd className="mt-2 text-emerald-600">{order.trackingNumber}</dd>
              </dl>

              <ul
                role="list"
                className="mt-6 divide-y divide-slate-200 border-t border-slate-200 text-sm font-medium text-slate-600"
              >
                {order.products.map((product: any) => (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="size-24 flex-none rounded-md bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-5xl">
                      {product.imageSrc}
                    </div>
                    <div className="flex-auto space-y-1">
                      <h3 className="text-slate-900">
                        <Link href={product.href} className="hover:text-emerald-600">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-slate-500">{product.description}</p>
                      <p className="text-slate-500">Qty: {product.quantity}</p>
                    </div>
                    <p className="flex-none font-medium text-slate-900">{product.price}</p>
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
                      <span className="block">{order.shippingAddress.name}</span>
                      <span className="block">{order.shippingAddress.street}</span>
                      <span className="block">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Payment Information</dt>
                  <dd className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                    <div className="flex-none">
                      <svg width={36} height={24} viewBox="0 0 36 24" aria-hidden="true" className="h-6 w-auto">
                        <rect rx={4} fill="#10b981" width={36} height={24} />
                        <path
                          d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                          fill="#fff"
                        />
                      </svg>
                      <p className="sr-only">{order.paymentMethod.type}</p>
                    </div>
                    <div className="flex-auto">
                      <p className="text-slate-900">Ending with {order.paymentMethod.last4}</p>
                      <p>
                        Expires {order.paymentMethod.expiryMonth} / {order.paymentMethod.expiryYear}
                      </p>
                    </div>
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
