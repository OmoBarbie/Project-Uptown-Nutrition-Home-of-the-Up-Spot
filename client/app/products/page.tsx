import { range } from '@setemiojo/utils'
import { getDb, schema } from '@tayo/database'
import { all } from 'better-all'
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProductFilters } from './product-filters'
import { ProductsList } from './ProductsList'

const PAGE_SIZE = 12

interface SearchParams {
  q?: string
  category?: string
  sort?: string
  page?: string
}

export const metadata = {
  title: 'Menu & Products',
  description:
    'Browse Uptown Nutrition\'s full menu — protein smoothies, refreshers, bowls, protein snacks and more. Fresh daily at 4548 N Broadway, Chicago.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Menu — Uptown Nutrition',
    description:
      'Protein smoothies, refreshers, bowls and snacks made fresh daily in Chicago\'s Uptown neighborhood.',
    url: '/products',
  },
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q, category, sort, page } = await searchParams
  const db = getDb()
  const currentPage = Math.max(1, Number.parseInt(page ?? '1'))
  const offset = (currentPage - 1) * PAGE_SIZE

  const conditions: ReturnType<typeof eq>[] = [eq(schema.products.isActive, true)]

  if (q) {
    conditions.push(
      or(
        ilike(schema.products.name, `%${q}%`),
        ilike(schema.products.description, `%${q}%`),
      ) as ReturnType<typeof eq>,
    )
  }

  if (category) {
    const cat = await db.query.categories.findFirst({ where: eq(schema.categories.slug, category) })
    if (cat)
      conditions.push(eq(schema.products.categoryId, cat.id))
  }

  let orderBy
  if (sort === 'price_asc')
    orderBy = asc(schema.products.price)
  else if (sort === 'price_desc')
    orderBy = desc(schema.products.price)
  else if (sort === 'newest')
    orderBy = desc(schema.products.createdAt)
  else orderBy = desc(schema.products.isFeatured)

  const { categories, totalResult, productRatings, products } = await all({
    async categories() {
      return db.query.categories.findMany({
        where: eq(schema.categories.isActive, true),
        orderBy: (c, { asc }) => [asc(c.sortOrder)],
      })
    },
    async totalResult() {
      return db.select({ total: count() }).from(schema.products).where(and(...conditions))
    },
    async productRatings() {
      return db.query.productRatings.findMany()
    },
    async products() {
      return db.query.products.findMany({
        where: and(...conditions),
        with: {
          category: true,
          variants: {
            where: eq(schema.productVariants.isActive, true),
            orderBy: (variants, { asc }) => [asc(variants.sortOrder)],
          },
        },
        orderBy,
        limit: PAGE_SIZE,
        offset,
      })
    },
  })

  const total = totalResult[0].total

  const ratingsMap = new Map(productRatings.map(r => [r.productId, r]))

  const productsWithRatings = products.map((product) => {
    const rating = ratingsMap.get(product.id)
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      emoji: product.emoji,
      category: product.category.name,
      categorySlug: product.category.slug,
      isFeatured: product.isFeatured,
      variants: product.variants.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        priceModifier: v.priceModifier,
      })),
      rating: rating ? { average: rating.averageRating, count: rating.totalReviews } : { average: 0, count: 0 },
    }
  })

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const categoryFilters = categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-slate-950">
        <Container className="py-16">
          <ProductFilters
            categories={categoryFilters}
            currentQ={q ?? ''}
            currentCategory={category ?? ''}
            currentSort={sort ?? ''}
          />
          <ProductsList products={productsWithRatings} categories={categoryFilters} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {range(1, totalPages + 1).map((p) => {
                const params = new URLSearchParams({
                  ...(q && { q }),
                  ...(category && { category }),
                  ...(sort && { sort }),
                  page: String(p),
                })
                return (
                  <a
                    key={p}
                    href={`/products?${params}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${p === currentPage ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {p}
                  </a>
                )
              })}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
