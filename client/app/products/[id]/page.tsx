import type { Metadata } from 'next'
import { getDb, schema } from '@tayo/database'
import { all } from 'better-all'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProductDetailClient } from './product-detail-client'
import { ReviewsSection } from './reviews-section'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const db = getDb()
  const product = await db.query.products.findFirst({
    where: eq(schema.products.id, id),
  })
  if (!product)
    return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description ?? `Order ${product.name} from Uptown Nutrition — fresh, nutritionist-approved and made daily in Chicago's Uptown neighborhood.`,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      title: `${product.name} — Uptown Nutrition`,
      description: product.description ?? undefined,
      url: `/products/${id}`,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const db = getDb()

  const { product, ratings } = await all({
    async product() {
      return db.query.products.findFirst({
        where: eq(schema.products.id, id),
        with: {
          category: true,
          variants: {
            where: eq(schema.productVariants.isActive, true),
            orderBy: (v, { asc }) => [asc(v.sortOrder)],
          },
        },
      })
    },
    async ratings() {
      return db.query.productRatings.findFirst({
        where: eq(schema.productRatings.productId, id),
      })
    },
  })

  if (!product || !product.isActive)
    notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'image': product.imageUrl,
    'offers': {
      '@type': 'Offer',
      'price': product.price,
      'priceCurrency': 'USD',
      'availability': product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(ratings && ratings.totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        'ratingValue': ratings.averageRating,
        'reviewCount': ratings.totalReviews,
      },
    }),
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetailClient product={product} ratings={ratings ?? null} />
        <div id="reviews">
          <ReviewsSection productId={id} ratings={ratings ?? null} />
        </div>
      </main>
      <Footer />
    </>
  )
}
