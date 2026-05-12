import { getDb, schema } from '@tayo/database'
import { and, eq, isNotNull } from 'drizzle-orm'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Sale — Uptown Nutrition',
  description: 'Save on Uptown Nutrition favourites — grab these deals before they\'re gone.',
  alternates: { canonical: '/products/sale' },
}

export default async function SalePage() {
  const db = getDb()
  const products = await db.query.products.findMany({
    where: and(eq(schema.products.isActive, true), isNotNull(schema.products.compareAtPrice)),
    with: { category: true },
    orderBy: (p, { desc }) => [desc(p.isFeatured)],
  })

  return (
    <>
      <Header />
      <main>
        <Container className="py-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Limited time</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-medium text-charcoal leading-[0.92]">Sale</h1>
            <p className="mt-4 text-base text-foreground/60 max-w-xl">
              Reduced prices on selected items. In-store pickup only.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 border border-sand">
              <p className="text-charcoal/60">No sale items right now — check back soon.</p>
              <Link href="/products" className="mt-4 inline-block text-sm font-medium text-forest-600 hover:underline">Browse the full menu</Link>
            </div>
          ) : (
            <div className="-mx-px grid grid-cols-2 border-l border-sand sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {products.map(product => (
                <article key={product.id} className="border-r border-b border-sand p-4 sm:p-6 hover:bg-cream-50 transition-colors">
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square bg-sand/30 flex items-center justify-center text-6xl mb-4">
                      {product.emoji ?? '🥤'}
                    </div>
                    <h3 className="text-sm font-medium text-charcoal text-center">{product.name}</h3>
                    <p className="mt-1 text-xs text-charcoal/60 text-center uppercase tracking-wide">{product.category.name}</p>
                    <div className="mt-3 text-center">
                      <span className="text-charcoal/40 line-through text-sm mr-2">${product.compareAtPrice}</span>
                      <span className="font-display text-lg text-terracotta-600">${product.price}</span>
                    </div>
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
