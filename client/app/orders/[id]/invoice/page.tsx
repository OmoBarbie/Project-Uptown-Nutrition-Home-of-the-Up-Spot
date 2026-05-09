import { getDb, schema } from '@tayo/database'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { auth } from '@/lib/auth'
import { PrintButton } from './print-button'

async function getInvoiceData(id: string, userId: string) {
  const db = getDb()

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.id, id), eq(schema.orders.userId, userId)))
    .limit(1)

  if (!order)
    return null

  const items = await db
    .select({
      id: schema.orderItems.id,
      productName: schema.orderItems.productName,
      quantity: schema.orderItems.quantity,
      unitPrice: schema.orderItems.unitPrice,
      productEmoji: schema.products.emoji,
      productDescription: schema.products.description,
    })
    .from(schema.orderItems)
    .innerJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
    .where(eq(schema.orderItems.orderId, id))

  let shippingAddress: { name?: string, street?: string, city?: string, state?: string, zipCode?: string } | null = null
  if (order.deliveryInstructions) {
    try {
      shippingAddress = JSON.parse(order.deliveryInstructions)
    }
    catch { /* plain text note */ }
  }

  return { order, items, shippingAddress }
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session)
    redirect('/login')

  const { id } = await params
  const data = await getInvoiceData(id, session.user.id)

  if (!data)
    notFound()

  const { order, items, shippingAddress } = data
  const subtotal = Number.parseFloat(order.subtotal || '0')
  const deliveryFee = Number.parseFloat(order.deliveryFee || '0')
  const tax = Number.parseFloat(order.tax || '0')
  const discount = Number.parseFloat(order.discount || '0')
  const total = Number.parseFloat(order.total || '0')

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen py-12 print:py-0 print:bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Toolbar — hidden on print */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <Link href={`/orders/${id}`} className="text-sm text-charcoal/60 hover:text-charcoal">
              ← Back to order
            </Link>
            <PrintButton />
          </div>

          {/* Invoice document */}
          <div className="border border-sand bg-background p-8 sm:p-12">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-forest-600 flex items-center justify-center">
                    <span className="text-cream font-bold text-sm">UP</span>
                  </div>
                  <span className="font-display text-2xl font-medium text-charcoal">
                    Uptown Nutrition
                  </span>
                </div>
                <p className="text-sm text-charcoal/60">Healthy treats, meals, and snacks</p>
                <p className="text-sm text-charcoal/60">4548 N Broadway, Chicago, IL 60640</p>
                <p className="text-sm text-charcoal/60">contact@uptownnutrition.com</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Invoice</p>
                <p className="font-display text-3xl font-medium text-charcoal mt-1">
                  #
                  {order.orderNumber}
                </p>
                <p className="text-sm text-charcoal/60 mt-1">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="mt-10 pt-8 border-t border-sand grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-charcoal/50 mb-2">Bill To</p>
                <p className="text-sm font-medium text-charcoal">{order.customerName}</p>
                <p className="text-sm text-charcoal/60">{order.customerEmail}</p>
                {order.customerPhone && <p className="text-sm text-charcoal/60">{order.customerPhone}</p>}
              </div>
              {shippingAddress && (shippingAddress.street || shippingAddress.city) && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-charcoal/50 mb-2">Ship To</p>
                  <p className="text-sm font-medium text-charcoal">{shippingAddress.name ?? order.customerName}</p>
                  {shippingAddress.street && <p className="text-sm text-charcoal/60">{shippingAddress.street}</p>}
                  {(shippingAddress.city || shippingAddress.state) && (
                    <p className="text-sm text-charcoal/60">
                      {shippingAddress.city}
                      {shippingAddress.state ? `, ${shippingAddress.state}` : ''}
                      {' '}
                      {shippingAddress.zipCode}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Items table */}
            <div className="mt-10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="text-left py-3 text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/50">Item</th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/50">Qty</th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/50">Price</th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/50">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.productEmoji ?? '🛒'}</span>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{item.productName}</p>
                            {item.productDescription && (
                              <p className="text-xs text-charcoal/50 line-clamp-1">{item.productDescription}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-4 text-sm text-charcoal/60">{item.quantity}</td>
                      <td className="text-right py-4 text-sm text-charcoal/60">
                        $
                        {Number.parseFloat(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="text-right py-4 text-sm font-medium text-charcoal">
                        $
                        {(Number.parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 border-t border-sand pt-8 flex justify-end">
              <dl className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">Subtotal</dt>
                  <dd className="text-charcoal">
                    $
                    {subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">Delivery</dt>
                  <dd className={deliveryFee === 0 ? 'text-forest-600' : 'text-charcoal'}>
                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">Tax (8%)</dt>
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
                <div className="flex justify-between border-t border-sand pt-3 text-base">
                  <dt className="font-semibold text-charcoal">Total</dt>
                  <dd className="font-display text-xl text-charcoal">
                    $
                    {total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t border-sand pt-8 text-center">
              <p className="text-sm text-charcoal/60">Thank you for your order!</p>
              <p className="text-xs text-charcoal/40 mt-1">Questions? contact@uptownnutrition.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
