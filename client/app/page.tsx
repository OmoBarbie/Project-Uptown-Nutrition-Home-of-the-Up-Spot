import type { Metadata } from 'next'
import { getDb, schema } from '@tayo/database'
import { desc, eq } from 'drizzle-orm'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import type { FeaturedCategory } from '@/components/Products'
import { Products } from '@/components/Products'
import { Testimonials } from '@/components/Testimonials'

export const metadata: Metadata = {
  title: 'Uptown Nutrition — Fresh Smoothies & Nutrition Bar Chicago',
  description:
    'Chicago\'s premier nutrition bar serving fresh protein smoothies, bowls, refreshers and snacks daily. 10+ years in Uptown Chicago at 4548 N Broadway. Nutritionist-approved, family-owned.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Uptown Nutrition — Fresh Smoothies & Nutrition Bar Chicago',
    description:
      'Chicago\'s premier nutrition bar serving fresh protein smoothies, bowls, refreshers and snacks daily. 10+ years in Uptown Chicago.',
    url: '/',
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  'name': 'Uptown Nutrition',
  'description':
    'Chicago\'s premier nutrition bar serving fresh protein smoothies, bowls, refreshers and healthy snacks made daily.',
  'url': 'https://uptownnutritionchicago.com',
  'telephone': ['312-899-6358', '630-251-8059'],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '4548 N Broadway',
    'addressLocality': 'Chicago',
    'addressRegion': 'IL',
    'postalCode': '60640',
    'addressCountry': 'US',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 41.9647329,
    'longitude': -87.6599204,
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      'opens': '07:00',
      'closes': '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Sunday'],
      'opens': '08:00',
      'closes': '17:00',
    },
  ],
  'priceRange': '$',
  'servesCuisine': ['Smoothies', 'Healthy Food', 'Protein Bowls'],
  'hasMap': 'https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z',
  'sameAs': [
    'https://www.instagram.com/UPTOWNNUTRITIONCHI',
    'https://www.facebook.com/UPTOWNNUTRITIONCHI',
  ],
}

function buildFeatures(product: {
  calories: number | null
  protein: number | null
  carbs: number | null
  fiber: number | null
  sugar: number | null
}): string[] {
  const features: string[] = []
  if (product.calories) features.push(`${product.calories} Cal`)
  if (product.protein) features.push(`${product.protein}g Protein`)
  if (product.carbs) features.push(`${product.carbs}g Carbs`)
  if (product.fiber) features.push(`${product.fiber}g Fiber`)
  if (product.sugar) features.push(`${product.sugar}g Sugar`)
  return features
}

export default async function Home() {
  const db = getDb()

  const featuredProducts = await db.query.products.findMany({
    where: eq(schema.products.isActive, true),
    with: { category: true },
    orderBy: [desc(schema.products.isFeatured), desc(schema.products.createdAt)],
    limit: 16,
  })

  // Group by category, max 4 categories, 2 products each
  const categoryMap = new Map<string, FeaturedCategory>()
  for (const product of featuredProducts) {
    const catId = product.category.id
    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        category: product.category.name,
        categorySlug: product.category.slug,
        description: product.category.description ?? '',
        items: [],
      })
    }
    const group = categoryMap.get(catId)!
    if (group.items.length < 2) {
      group.items.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: `$${Number(product.price).toFixed(0)}`,
        emoji: product.emoji ?? '🥗',
        stockQuantity: product.stockQuantity,
        features: buildFeatures(product),
      })
    }
    if (categoryMap.size >= 4 && group.items.length >= 2) continue
  }

  const categories = Array.from(categoryMap.values()).filter(c => c.items.length > 0).slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Products categories={categories} />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
