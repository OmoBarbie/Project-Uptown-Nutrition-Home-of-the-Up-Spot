import { getDb, schema } from '@tayo/database'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { auth } from '@/lib/auth'

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready for Pickup', value: 'ready_for_pickup' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'delivered' || status === 'completed') {
    return (
      <span className="bg-forest-600 text-cream text-xs uppercase tracking-wider px-2 py-0.5">
        {status.replace(/_/g, ' ')}
      </span>
    )
  }
  if (status === 'out_for_delivery' || status === 'preparing' || status === 'confirmed') {
    return (
      <span className="bg-terracotta-500 text-cream text-xs uppercase tracking-wider px-2 py-0.5">
        {status.replace(/_/g, ' ')}
      </span>
    )
  }
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <span className="bg-sand text-charcoal/50 text-xs uppercase tracking-wider px-2 py-0.5">
        {status.replace(/_/g, ' ')}
      </span>
    )
  }
  // pending / ready_for_pickup / default
  return (
    <span className="border border-sand text-charcoal/60 text-xs uppercase tracking-wider px-2 py-0.5">
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  if (!session) {
    redirect('/login')
  }

  const { status } = await searchParams
  const activeStatus = status ?? ''

  const db = getDb()

  const conditions = [eq(schema.orders.userId, session.user.id)]
  if (activeStatus) {
    conditions.push(eq(schema.orders.status, activeStatus as any))
  }

  const orders = await db.query.orders.findMany({
    with: {
      items: {
        with: { product: true },
        limit: 3,
      },
    },
    where: and(...conditions),
    orderBy: desc(schema.orders.createdAt),
  })

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero section */}
        <div className="bg-background border-b border-sand pt-20 pb-12">
          <Container>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                Your account
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium text-charcoal leading-[0.92]">
              Order history
            </h1>
            <p className="mt-4 text-foreground/60 max-w-xl">
              Check the status of recent orders, manage returns, and reorder your favourite items.
            </p>
          </Container>
        </div>

        {/* Status filter tabs */}
        <div className="border-b border-sand sticky top-0 bg-background z-10">
          <Container>
            <div className="flex overflow-x-auto gap-0 -mb-px">
              {STATUS_TABS.map((tab) => {
                const isActive = activeStatus === tab.value
                return (
                  <Link
                    key={tab.value}
                    href={tab.value ? `?status=${tab.value}` : '/orders'}
                    className={
                      isActive
                        ? 'whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 border-forest-600 text-forest-600'
                        : 'whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 border-transparent text-charcoal/60 hover:text-charcoal'
                    }
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </div>
          </Container>
        </div>

        {/* Orders list */}
        <div className="py-12">
          <Container>
            {orders.length === 0
              ? (
                  <div className="border border-sand py-24 text-center">
                    <h2 className="font-display text-4xl sm:text-5xl font-medium text-charcoal mb-4">
                      No orders yet
                    </h2>
                    <p className="text-foreground/60 mb-8">
                      {activeStatus
                        ? `You have no ${activeStatus.replace(/_/g, ' ')} orders.`
                        : 'You haven\'t placed any orders yet.'}
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center px-6 py-3 bg-forest-600 text-cream hover:bg-forest-700 transition-colors text-sm font-medium"
                    >
                      Start shopping →
                    </Link>
                  </div>
                )
              : (
                  <div className="divide-y divide-sand border border-sand">
                    {orders.map(order => (
                      <div key={order.id} className="p-6 sm:p-8 hover:bg-cream-50 transition-colors">
                        {/* Order header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-charcoal/50 mb-1">
                              Order #
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-charcoal/60">
                              <time dateTime={String(order.createdAt)}>
                                {formatDate(order.createdAt)}
                              </time>
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={order.status} />
                            <div className="text-right">
                              {Number.parseFloat(order.discount || '0') > 0 && (
                                <p className="text-xs text-terracotta-500 font-medium">
                                  −$
                                  {Number.parseFloat(order.discount!).toFixed(2)}
                                  {' '}
                                  discount
                                </p>
                              )}
                              <span className="font-display text-xl text-charcoal">
                                $
                                {Number.parseFloat(order.total || '0').toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items preview */}
                        {order.items.length > 0 && (
                          <div className="space-y-2 mb-6">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center gap-3 text-sm">
                                <span className="text-lg">{item.product?.emoji ?? '🛒'}</span>
                                <span className="text-charcoal flex-1">
                                  {item.productName}
                                </span>
                                <span className="text-charcoal/60">
                                  x
                                  {item.quantity}
                                </span>
                                <span className="text-charcoal/60">
                                  $
                                  {Number.parseFloat(item.unitPrice).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions row */}
                        <div className="flex items-center gap-6 border-t border-sand pt-4">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-sm font-medium text-forest-600 hover:text-forest-700"
                          >
                            View order →
                          </Link>
                          <Link
                            href={`/orders/${order.id}/invoice`}
                            className="text-sm text-charcoal/60 hover:text-charcoal"
                          >
                            Invoice
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  )
}
