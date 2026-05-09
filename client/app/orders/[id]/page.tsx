import { getDb, schema } from '@tayo/database'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { auth } from '@/lib/auth'
import { SuccessBanner } from './success-banner'

async function getOrderDetails(id: string, userId: string) {
  const db = getDb()

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.id, id), eq(schema.orders.userId, userId)))
    .limit(1)

  if (!order)
    return null

  const orderItems = await db
    .select({
      id: schema.orderItems.id,
      quantity: schema.orderItems.quantity,
      unitPrice: schema.orderItems.unitPrice,
      productId: schema.orderItems.productId,
      productName: schema.orderItems.productName,
      productEmoji: schema.products.emoji,
      productDescription: schema.products.description,
    })
    .from(schema.orderItems)
    .innerJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
    .where(eq(schema.orderItems.orderId, id))

  return { ...order, items: orderItems }
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session)
    redirect('/login')

  const { id } = await params
  const { success } = await searchParams

  const order = await getOrderDetails(id, session.user.id)

  if (!order)
    notFound()

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))

  // Drizzle returns decimal columns as strings — convert once here
  const subtotal = Number.parseFloat(order.subtotal || '0')
  const tax = Number.parseFloat(order.tax || '0')
  const deliveryFee = Number.parseFloat(order.deliveryFee || '0')
  const discount = Number.parseFloat(order.discount || '0')
  const total = Number.parseFloat(order.total || '0')
  // Stripe fee is baked into total — derive it by subtracting the other components
  const stripeFee = Math.max(0, total - (subtotal - discount + tax + deliveryFee))

  // Address was serialized as JSON into deliveryInstructions at checkout
  let shippingAddress: { name?: string, street?: string, city?: string, state?: string, zipCode?: string } | null = null
  if (order.deliveryInstructions) {
    try {
      shippingAddress = JSON.parse(order.deliveryInstructions)
    }
    catch {
      // deliveryInstructions may be a plain text note — ignore parse error
    }
  }

  const showSuccess = success === 'true'

  return (
    <>
      <Header />
      {showSuccess && <SuccessBanner />}
      <main className="relative lg:min-h-full bg-background">
        <div className="h-48 sm:h-64 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <div className="size-full bg-sand/30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl sm:text-9xl mb-2 sm:mb-4">🎉</div>
              <p className="text-lg sm:text-2xl font-display font-medium text-charcoal">Order Complete!</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <p className="text-terracotta-500 text-sm font-semibold tracking-[0.18em] uppercase">
                {order.status === 'delivered' ? 'Order delivered' : 'Payment successful'}
              </p>
              <h1 className="mt-2 font-display text-5xl sm:text-6xl font-medium text-charcoal leading-[0.92]">
                Thanks for ordering
              </h1>
              <p className="mt-4 text-foreground/60">
                We appreciate your order! Your nutrition items
                {' '}
                {order.status === 'delivered' ? 'have been delivered' : 'are being prepared'}
                .
                Check your email for confirmation.
              </p>

              <dl className="mt-16 text-sm font-medium">
                <dt className="text-charcoal">Order number</dt>
                <dd className="mt-2 text-forest-600">{order.orderNumber}</dd>
              </dl>

              {order.createdAt && (
                <dl className="mt-4 text-sm">
                  <dt className="text-charcoal/50">Placed on</dt>
                  <dd className="mt-1 text-charcoal">{formatDate(order.createdAt)}</dd>
                </dl>
              )}

              <ul
                role="list"
                className="mt-6 divide-y divide-sand border-t border-sand text-sm font-medium text-charcoal/60"
              >
                {order.items.map(item => (
                  <li key={item.id} className="flex space-x-4 sm:space-x-6 py-6">
                    <div className="size-24 flex-none bg-sand/30 flex items-center justify-center text-5xl">
                      {item.productEmoji ?? '🛒'}
                    </div>
                    <div className="flex-auto space-y-1">
                      <h3 className="text-charcoal">
                        <Link href={`/products/${item.productId}`} className="hover:text-forest-600">
                          {item.productName}
                        </Link>
                      </h3>
                      {item.productDescription && (
                        <p className="text-charcoal/50 line-clamp-2">{item.productDescription}</p>
                      )}
                      <p className="text-charcoal/50">
                        Qty:
                        {item.quantity}
                      </p>
                    </div>
                    <p className="flex-none font-medium text-charcoal">
                      $
                      {Number.parseFloat(item.unitPrice).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-6 border-t border-sand pt-6 text-sm font-medium text-charcoal/60">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-charcoal">
                    $
                    {subtotal.toFixed(2)}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd className="text-charcoal">
                    {deliveryFee === 0
                      ? (
                          <span className="text-forest-600">Free</span>
                        )
                      : (
                          `$${deliveryFee.toFixed(2)}`
                        )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt>Tax (8%)</dt>
                  <dd className="text-charcoal">
                    $
                    {tax.toFixed(2)}
                  </dd>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-terracotta-500">
                    <dt>Discount</dt>
                    <dd>
                      −$
                      {discount.toFixed(2)}
                    </dd>
                  </div>
                )}

                {stripeFee > 0 && (
                  <div className="flex justify-between">
                    <dt>Processing fee</dt>
                    <dd className="text-charcoal">
                      $
                      {stripeFee.toFixed(2)}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-sand pt-6 text-charcoal">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base font-semibold">
                    $
                    {total.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <dl className="mt-16 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-4 text-sm text-charcoal/60">
                <div>
                  <dt className="font-medium text-charcoal">Delivery Address</dt>
                  <dd className="mt-2">
                    <address className="not-italic">
                      <span className="block">{shippingAddress?.name ?? order.customerName}</span>
                      {shippingAddress?.street && (
                        <span className="block">{shippingAddress.street}</span>
                      )}
                      {(shippingAddress?.city || shippingAddress?.state) && (
                        <span className="block">
                          {shippingAddress.city}
                          ,
                          {shippingAddress.state}
                          {' '}
                          {shippingAddress.zipCode}
                        </span>
                      )}
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-charcoal">Contact</dt>
                  <dd className="mt-2 space-y-1">
                    <p>{order.customerEmail}</p>
                    {order.customerPhone && <p>{order.customerPhone}</p>}
                  </dd>
                </div>
              </dl>

              <div className="mt-16 border-t border-sand py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-forest-600 hover:text-forest-700"
                >
                  Continue Shopping
                  {' '}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              <div className="mt-2 text-right">
                <Link href="/orders" className="text-sm text-charcoal/60 hover:text-charcoal">
                  ← Back to all orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
