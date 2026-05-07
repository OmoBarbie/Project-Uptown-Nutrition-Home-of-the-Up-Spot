import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

// Temporary mock data - will be replaced with database queries
const orders = [
  {
    id: 'UN00001',
    number: 'UN00001',
    href: '/orders/UN00001',
    invoiceHref: '/orders/UN00001/invoice',
    createdDate: 'Dec 12, 2024',
    createdDatetime: '2024-12-12',
    deliveredDate: 'December 14, 2024',
    deliveredDatetime: '2024-12-14',
    status: 'delivered',
    total: '$28.00',
    products: [
      {
        id: 1,
        name: 'Protein Pancakes',
        description:
          'Fluffy protein-packed pancakes made with whole grain flour and whey protein. A delicious breakfast that keeps you full and energized all morning.',
        href: '/products/protein-pancakes',
        price: '$10.00',
        imageSrc: '🥞',
        imageAlt: 'Protein pancakes',
        quantity: 1,
      },
      {
        id: 2,
        name: 'Strawberry Short Cake Smoothie',
        description:
          'A creamy strawberry smoothie with hints of vanilla cake. High in protein and perfect for post-workout recovery.',
        href: '/products/strawberry-short-cake',
        price: '$9.00',
        imageSrc: '🍓',
        imageAlt: 'Strawberry smoothie',
        quantity: 2,
      },
    ],
  },
  {
    id: 'UN00002',
    number: 'UN00002',
    href: '/orders/UN00002',
    invoiceHref: '/orders/UN00002/invoice',
    createdDate: 'Dec 8, 2024',
    createdDatetime: '2024-12-08',
    deliveredDate: 'December 10, 2024',
    deliveredDatetime: '2024-12-10',
    status: 'delivered',
    total: '$19.00',
    products: [
      {
        id: 1,
        name: 'Watermelon Rush',
        description:
          'A refreshing 32oz watermelon energy drink that provides hydration and a natural energy boost without the crash.',
        href: '/products/watermelon-rush',
        price: '$10.00',
        imageSrc: '🍉',
        imageAlt: 'Watermelon refresher',
        quantity: 1,
      },
      {
        id: 2,
        name: 'Protein Coffee 24oz',
        description:
          'High-protein iced coffee in Mocha flavor. Get your caffeine and protein in one delicious drink.',
        href: '/products/protein-coffee',
        price: '$9.00',
        imageSrc: '☕',
        imageAlt: 'Protein coffee',
        quantity: 1,
      },
    ],
  },
]

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Order history
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Check the status of recent orders, manage returns, and reorder your favorite items.
              </p>
            </div>
          </Container>

          <div className="mt-16">
            <h2 className="sr-only">Recent orders</h2>
            <Container>
              <div className="mx-auto max-w-2xl space-y-8 lg:max-w-4xl">
                {orders.length === 0
                  ? (
                      <div className="text-center py-12">
                        <p className="text-slate-600">You haven't placed any orders yet.</p>
                        <Link
                          href="/products"
                          className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-500"
                        >
                          Start shopping →
                        </Link>
                      </div>
                    )
                  : (
                      orders.map(order => (
                        <div
                          key={order.number}
                          className="border-t border-b border-slate-200 bg-white shadow-sm sm:rounded-lg sm:border"
                        >
                          <h3 className="sr-only">
                            Order placed on
                            {' '}
                            <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                          </h3>

                          <div className="flex items-center border-b border-slate-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                            <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                              <div>
                                <dt className="font-medium text-slate-900">Order number</dt>
                                <dd className="mt-1 text-slate-600">{order.number}</dd>
                              </div>
                              <div className="hidden sm:block">
                                <dt className="font-medium text-slate-900">Date placed</dt>
                                <dd className="mt-1 text-slate-600">
                                  <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                                </dd>
                              </div>
                              <div>
                                <dt className="font-medium text-slate-900">Total amount</dt>
                                <dd className="mt-1 font-medium text-slate-900">{order.total}</dd>
                              </div>
                            </dl>

                            <div className="flex justify-end lg:hidden">
                              <Menu as="div" className="relative">
                                <MenuButton className="relative flex items-center text-slate-400 hover:text-slate-500">
                                  <span className="absolute -inset-2" />
                                  <span className="sr-only">
                                    Options for order
                                    {order.number}
                                  </span>
                                  <EllipsisVerticalIcon aria-hidden="true" className="size-6" />
                                </MenuButton>

                                <MenuItems
                                  transition
                                  className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                  <div className="py-1">
                                    <MenuItem>
                                      <a
                                        href={order.href}
                                        className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900 data-focus:outline-hidden"
                                      >
                                        View
                                      </a>
                                    </MenuItem>
                                    <MenuItem>
                                      <a
                                        href={order.invoiceHref}
                                        className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900 data-focus:outline-hidden"
                                      >
                                        Invoice
                                      </a>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </Menu>
                            </div>

                            <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                              <a
                                href={order.href}
                                className="flex items-center justify-center rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-hidden"
                              >
                                <span>View Order</span>
                                <span className="sr-only">{order.number}</span>
                              </a>
                              <a
                                href={order.invoiceHref}
                                className="flex items-center justify-center rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-hidden"
                              >
                                <span>View Invoice</span>
                                <span className="sr-only">
                                  for order
                                  {order.number}
                                </span>
                              </a>
                            </div>
                          </div>

                          {/* Products */}
                          <h4 className="sr-only">Items</h4>
                          <ul role="list" className="divide-y divide-slate-200">
                            {order.products.map(product => (
                              <li key={product.id} className="p-4 sm:p-6">
                                <div className="flex items-center sm:items-start">
                                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 sm:size-40 flex items-center justify-center">
                                    <span className="text-5xl sm:text-8xl">{product.imageSrc}</span>
                                  </div>
                                  <div className="ml-6 flex-1 text-sm">
                                    <div className="font-medium text-slate-900 sm:flex sm:justify-between">
                                      <h5 className="text-base">{product.name}</h5>
                                      <p className="mt-2 sm:mt-0 text-emerald-600 font-semibold">{product.price}</p>
                                    </div>
                                    <p className="hidden text-slate-600 sm:mt-2 sm:block">{product.description}</p>
                                    <p className="mt-1 text-slate-500">
                                      Qty:
                                      {product.quantity}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-6 sm:flex sm:justify-between">
                                  <div className="flex items-center">
                                    <CheckCircleIcon aria-hidden="true" className="size-5 text-emerald-500" />
                                    <p className="ml-2 text-sm font-medium text-slate-600">
                                      Delivered on
                                      {' '}
                                      <time dateTime={order.deliveredDatetime}>{order.deliveredDate}</time>
                                    </p>
                                  </div>

                                  <div className="mt-6 flex items-center divide-x divide-slate-200 border-t border-slate-200 pt-4 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                                    <div className="flex flex-1 justify-center pr-4">
                                      <a
                                        href={product.href}
                                        className="whitespace-nowrap text-emerald-600 hover:text-emerald-500"
                                      >
                                        View product
                                      </a>
                                    </div>
                                    <div className="flex flex-1 justify-center pl-4">
                                      <button className="whitespace-nowrap text-emerald-600 hover:text-emerald-500">
                                        Buy again
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
              </div>
            </Container>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
