import type { Metadata } from 'next'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Products />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
