import { getDb, schema } from '@tayo/database'
import { and, desc, eq, inArray, sql, sum } from 'drizzle-orm'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Best Sellers — Uptown Nutrition',
  description: 'The most popular items on the Uptown Nutrition menu, ranked by units sold.',
  alternates: { canonical: '/products/best-sellers' },
}

const QUALIFYING_STATUSES = ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'completed'] as const

export default async function BestSellersPage() {
  const db = getDb()

  // Aggregate total units sold per product from qualifying orders
  const salesByProduct = await db
    .select({
      productId: schema.orderItems.productId,
      totalSold: sum(schema.orderItems.quantity).mapWith(Number),
    })
    .from(schema.orderItems)
    .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
    .where(inArray(schema.orders.status, [...QUALIFYING_STATUSES]))
    .groupBy(schema.orderItems.productId)
    .orderBy(desc(sql`sum(${schema.orderItems.quantity})`))
    .limit(20)

  const productIds = salesByProduct.map(r => r.productId)

  const products = productIds.length > 0
    ? await db.query.products.findMany({
        where: and(eq(schema.products.isActive, true), inArray(schema.products.id, productIds)),
        with: { category: true },
      })
    : []

  // Re-sort to match aggregation order
  const salesMap = new Map(salesByProduct.map(r => [r.productId, r.totalSold]))
  const sorted = products.sort((a, b) => (salesMap.get(b.id) ?? 0) - (salesMap.get(a.id) ?? 0))

  return (
    <>
      <Header />
      <main>
        <Container className="py-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Customer favourites</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-medium text-charcoal leading-[0.92]">Best Sellers</h1>
            <p className="mt-4 text-base text-foreground/60 max-w-xl">
              Our most popular items, ranked by total units sold.
            </p>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-24 border border-sand">
              <p className="text-charcoal/60">No sales data yet — be the first to order.</p>
              <Link href="/products" className="mt-4 inline-block text-sm font-medium text-forest-600 hover:underline">Browse the full menu</Link>
            </div>
          ) : (
            <div className="-mx-px grid grid-cols-2 border-l border-sand sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {sorted.map((product, i) => (
                <article key={product.id} className="border-r border-b border-sand p-4 sm:p-6 hover:bg-cream-50 transition-colors">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square bg-sand/30 flex items-center justify-center text-6xl mb-4 relative">
                      {product.emoji ?? '🥤'}
                      {i < 3 && (
                        <span className="absolute top-2 left-2 text-xs font-bold bg-terracotta-500 text-cream px-1.5 py-0.5">
                          #{i + 1}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-charcoal text-center">{product.name}</h3>
                    <p className="mt-1 text-xs text-charcoal/60 text-center uppercase tracking-wide">{product.category.name}</p>
                    <p className="mt-3 font-display text-lg text-charcoal text-center">${product.price}</p>
                    <p className="mt-1 text-xs text-charcoal/40 text-center">{salesMap.get(product.id) ?? 0} sold</p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
