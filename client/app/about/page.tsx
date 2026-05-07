import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the mother and daughter duo behind Uptown Nutrition — 10+ years bringing healthy protein smoothies and nutritionist-approved meals to Chicago\'s Uptown neighborhood.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Uptown Nutrition — Our Story',
    description:
      'A mother and daughter duo with 30+ years of nursing expertise bringing fresh, nutritious smoothies to Uptown Chicago for over a decade.',
    url: '/about',
  },
}

const uniquePoints = [
  { emoji: '💪', title: '21 Vitamins & Minerals', body: 'Every smoothie is packed with essential nutrients to fuel your day and support optimal health.' },
  { emoji: '🥤', title: '17–24g+ Protein', body: 'High-protein smoothies to keep you satisfied and energized throughout the day.' },
  { emoji: '🍯', title: 'Low Sugar (5–15g)', body: 'Natural sweetness without the guilt — perfect for maintaining healthy blood sugar levels.' },
  { emoji: '🌾', title: 'Non-Dairy / Gluten Free', body: 'Options available for all dietary needs and preferences.' },
  { emoji: '🍓', title: 'Fresh Fruit', body: 'Made with the freshest fruits and vegetables for maximum nutrition and flavor.' },
  { emoji: '🚫', title: 'No Juice, Milk or Yogurt', body: 'Pure whole ingredients — no fillers or unnecessary additives.' },
]

const stats = [
  { value: '10+', label: 'Years Serving', sub: 'A family tradition' },
  { value: '30+', label: 'Smoothie Flavors', sub: 'Delicious variety' },
  { value: '30+', label: 'Years Nursing', sub: 'Health expertise' },
  { value: '100%', label: 'Family Owned', sub: 'Mother & daughter' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background border-b border-sand pt-20 pb-16 sm:pt-24 sm:pb-20">
          <Container>
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Our story</span>
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-medium text-charcoal leading-[0.92] mb-6">
                About Uptown
                <br />
                <em>Nutrition</em>
              </h1>
              <p className="text-lg text-foreground/60 leading-relaxed max-w-xl">
                A mother and daughter duo bringing healthy, delicious smoothies to the Uptown Chicago community for over 10 years.
              </p>
            </div>
          </Container>
        </section>

        {/* Story */}
        <section className="py-16 sm:py-24 bg-background">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal leading-tight sticky top-24">
                  Our Story
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-5 text-base text-foreground/70 leading-relaxed">
                <p>
                  We are a mother and daughter duo working together to bring healthy, delicious smoothies to the community. Our smoothie shop has been around for over ten years, and we are so proud and excited to continue offering our services to the community.
                </p>
                <p>
                  Mom is a passionate registered nurse with over 30 years and brings her health and nutrition expertise to every smoothie we offer. We believe that taking care of your health should be a priority, and we strive to make sure every smoothie is crafted with the highest standards.
                </p>
                <p>
                  Our smoothies are nutritious with the perfect blend of natural sweetness and healthiness, made with the freshest fruits and vegetables for the ultimate invigorating and energizing experience.
                </p>
                <blockquote className="border-l-2 border-terracotta-500 pl-5 mt-6">
                  <p className="font-display text-xl italic font-medium text-charcoal">
                    "We believe the combination of nursing and nutrition is the perfect duo for achieving optimal health."
                  </p>
                </blockquote>
              </div>
            </div>
          </Container>
        </section>

        {/* Unique points grid */}
        <section className="bg-card border-y border-sand py-16 sm:py-24">
          <Container>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">What we offer</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal">
                What Makes Us Unique
              </h2>
            </div>

            <div className="grid gap-px bg-sand sm:grid-cols-2 lg:grid-cols-3">
              {uniquePoints.map(({ emoji, title, body }) => (
                <div key={title} className="bg-background p-6 sm:p-8">
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Stats */}
        <section className="py-16 sm:py-24 bg-background">
          <Container>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-charcoal mb-3">
                A Decade of Healthy Smoothies
              </h2>
              <p className="text-foreground/60">Proudly serving Uptown Chicago for over 10 years</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 border border-sand divide-x divide-y divide-sand lg:divide-y-0">
              {stats.map(({ value, label, sub }) => (
                <div key={label} className="text-center py-10 px-6">
                  <div className="font-display text-5xl font-medium text-forest-600 mb-1">{value}</div>
                  <div className="text-sm font-semibold text-charcoal mb-1">{label}</div>
                  <div className="text-xs text-foreground/50">{sub}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-forest-600 py-16 sm:py-20">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-cream-100 mb-4">
                Come Visit Us in Uptown Chicago!
              </h2>
              <p className="text-forest-100 text-base leading-relaxed mb-3">
                We opened this smoothie shop in Uptown Chicago to offer smoothies and health-related information — inspiring and enabling others to gain the most out of their days.
              </p>
              <p className="font-display text-xl italic text-cream-100 mb-8">
                "If you're looking for an amazing smoothie experience then we are your girls."
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/products" className="bg-cream-100 text-forest-700 px-6 py-3 text-sm font-semibold tracking-wide hover:bg-white transition-colors">
                  View Menu
                </Link>
                <Link href="/contact" className="border border-cream-100/40 text-cream-100 px-6 py-3 text-sm font-semibold tracking-wide hover:bg-forest-500 transition-colors">
                  Find Us
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
