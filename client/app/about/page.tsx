import type { Metadata } from 'next'
import { Button } from '@/components/Button'
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

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                <span className="text-slate-900 dark:text-white">About </span>
                <span className="text-teal-500">u</span>
                <span className="text-pink-500">p</span>
                <span className="text-lime-500">t</span>
                <span className="text-orange-500">o</span>
                <span className="text-teal-500">w</span>
                <span className="text-pink-500">n</span>
                <span className="text-slate-900 dark:text-white"> nutrition</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                A mother and daughter duo bringing healthy, delicious smoothies to the community for over 10 years!
              </p>
            </div>
          </Container>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
                <p>
                  We are a mother and daughter duo working together to bring healthy, delicious smoothies to the community! Our smoothie shop has been around for over ten years, and we are so proud and excited to continue offering our services to the community.
                </p>
                <p>
                  Mom is a passionate registered nurse with over 30 years and brings her health and nutrition expertise to every smoothie we offer. We believe that taking care of your health should be a priority, and we strive to make sure every smoothie is crafted with the highest standards. We offer an array of delicious flavors and ingredients and are always eager to create new recipes. We are committed to providing a pleasant experience and always look forward to welcoming new customers into our family-owned shop.
                </p>
                <p>
                  Our smoothies are nutritious with the perfect blend of natural sweetness and healthiness. The smoothies are made with the freshest fruits and vegetables for the ultimate invigorating, and energizing experience.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* What Makes Us Unique */}
        <section className="bg-slate-50 dark:bg-slate-900 py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                What Makes Us Unique
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Our smoothies + smoothie bowls provide you with:
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  21 Vitamins and Minerals
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Every smoothie is packed with essential nutrients to fuel your day and support optimal health.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">🥤</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  17-24g+ of Protein
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  High-protein smoothies to keep you satisfied and energized throughout the day.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Low Sugar (5.5g-15g)
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Natural sweetness without the guilt - perfect for maintaining healthy blood sugar levels.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Non-Dairy / Gluten Free
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Options available for all dietary needs and preferences.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">🍓</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Fresh Fruit
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Made with the freshest fruits and vegetables for maximum nutrition and flavor.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <div className="text-4xl mb-4">🚫</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  No Juice, Milk or Yogurt
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Pure whole ingredients - no fillers or unnecessary additives.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl mt-12">
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-8 text-center">
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  We believe the combination of nursing and nutrition is the perfect duo for achieving optimal health. We are always trying to learn more and experiment with different ideas to drive innovation with health and smoothie making.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Impact Stats */}
        <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
          <Container>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                A Decade of Healthy Smoothies
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Proudly serving the Uptown Chicago community for over 10 years
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  10+
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Years Serving
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  A family tradition
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                  30+
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Smoothie Flavors
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Delicious variety
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  30+
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Years Nursing
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Health expertise
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                  100%
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Family Owned
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Mother & daughter
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="bg-emerald-600 py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Come Visit Us in Uptown Chicago!
              </h2>
              <p className="mt-4 text-lg text-emerald-100">
                We opened this smoothie shop in Uptown Chicago to offer smoothies and health-related information. We&apos;re looking forward to inspiring and enabling others to gain the most out of their days.
              </p>
              <p className="mt-4 text-xl font-semibold text-white">
                If you&apos;re looking for an amazing smoothie experience then we are your girls. Come on in and let your taste buds run wild!
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                <Button href="/" color="white">
                  View Menu
                </Button>
                <Button
                  href="/contact"
                  className="bg-emerald-500 hover:bg-emerald-400"
                >
                  Find Us
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
