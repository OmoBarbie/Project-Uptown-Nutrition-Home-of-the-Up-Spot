import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BookingForm } from './booking-form'

export const metadata: Metadata = {
  title: 'The Up Spot — Event Venue Chicago',
  description:
    'Rent The Up Spot at 4548 N. Broadway, Chicago for your next event. $150/hr · $75 deposit. Perfect for birthdays, baby showers, pop-up shops, photoshoots, yoga classes and more.',
  alternates: { canonical: '/upspot' },
  openGraph: {
    title: 'The Up Spot — Boutique Event Venue in Chicago\'s Uptown',
    description:
      'A boutique event space in Chicago\'s Uptown neighborhood. $150/hr. Available for birthdays, weddings, pop-ups, photoshoots, corporate events and more.',
    url: '/upspot',
  },
}

const venueJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  'name': 'The Up Spot',
  'description':
    'A boutique event space in Chicago\'s Uptown neighborhood — designed with class, elegance, and romance. Open floor plan, natural lighting, and contemporary décor for any occasion.',
  'url': 'https://uptownnutritionchicago.com/upspot',
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
  'priceRange': '$150/hour',
  'containedInPlace': {
    '@type': 'FoodEstablishment',
    'name': 'Uptown Nutrition',
    'url': 'https://uptownnutritionchicago.com',
  },
}

const capabilities = [
  { icon: '🎉', label: 'Birthdays & Celebrations' },
  { icon: '👶', label: 'Baby Showers' },
  { icon: '💒', label: 'Intimate Weddings' },
  { icon: '🛍️', label: 'Pop-Up Shops' },
  { icon: '📸', label: 'Photoshoots' },
  { icon: '🧘', label: 'Yoga & Fitness' },
  { icon: '🎨', label: 'Art Galleries' },
  { icon: '🍽️', label: 'Pop-Up Restaurants' },
  { icon: '🎓', label: 'Graduations' },
  { icon: '💼', label: 'Meetings & Conferences' },
  { icon: '🎵', label: 'Music Events' },
  { icon: '🥂', label: 'Holiday Parties' },
]

const highlights = [
  {
    number: '$150',
    unit: '/ hr',
    label: 'Hourly Rate',
    note: 'Discounts available on request',
  },
  {
    number: '$75',
    unit: '',
    label: 'Reservation Deposit',
    note: 'Non-refundable · due at confirmation',
  },
  {
    number: '24/7',
    unit: '',
    label: 'Availability',
    note: 'Events preferred to end by 2 AM',
  },
]

export default function UpSpotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueJsonLd) }}
      />
      <Header />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-forest-950 overflow-hidden">
        {/* Diagonal warm panel */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 40px, oklch(0.97 0.012 85 / 0.06) 40px, oklch(0.97 0.012 85 / 0.06) 41px)',
          }}
        />

        <Container className="relative pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Headline */}
            <div className="animate-reveal">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-terracotta-400" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-400">
                  4548 N. Broadway · Chicago
                </span>
              </div>

              <h1 className="font-display font-medium text-cream-100 leading-[0.88]">
                <span className="block text-[clamp(2rem,6vw,5.5rem)]">The</span>
                <span className="block text-[clamp(2rem,6vw,5.5rem)] italic text-terracotta-400">Up Spot</span>
              </h1>

              <p className="mt-6 text-base leading-[1.75] text-cream-100/55 max-w-[26rem]">
                A boutique event space in Chicago&apos;s Uptown neighborhood — designed
                with class, elegance, and romance. Open floor plan, natural lighting,
                and contemporary décor for any occasion.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#booking"
                  className="inline-block px-8 py-4 bg-terracotta-500 text-cream-100 text-sm font-semibold tracking-widest uppercase hover:bg-terracotta-400 transition-colors"
                >
                  Book the Space
                </a>
                <a
                  href="tel:312-899-6358"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cream-100/60 hover:text-cream-100 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  312-899-6358
                </a>
              </div>
            </div>

            {/* Right — Stat tiles */}
            <div className="grid grid-cols-1 gap-0 border border-cream-100/10 animate-reveal-delay-1">
              {highlights.map((h, i) => (
                <div
                  key={h.label}
                  className={`px-8 py-7 border-b border-cream-100/10 last:border-b-0 flex items-center gap-6 ${i % 2 === 0 ? '' : 'bg-cream-100/[0.03]'}`}
                >
                  <div className="shrink-0">
                    <span className="font-display text-4xl font-medium italic text-terracotta-400">
                      {h.number}
                    </span>
                    {h.unit && (
                      <span className="font-display text-xl text-terracotta-400/70">{h.unit}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream-100">{h.label}</div>
                    <div className="mt-0.5 text-xs text-cream-100/35">{h.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── About the Space ──────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background border-b border-sand">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Left — copy */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                  The Space
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[0.92] mb-6">
                Built for
                <br />
                <em>Every Occasion</em>
              </h2>
              <p className="text-sm leading-[1.8] text-foreground/55">
                The Up Spot is a versatile storefront venue at the heart of Chicago&apos;s
                Uptown neighborhood. Whether you&apos;re hosting an intimate gathering or a
                full-scale event, our open floor plan and contemporary décor adapt to your vision.
              </p>
              <p className="mt-4 text-sm leading-[1.8] text-foreground/55">
                Standard tables and chairs are included with every rental. Additional furniture
                and setup pieces are available for hire. Discounts available upon request.
              </p>

              <div className="mt-8 space-y-3 text-sm text-foreground/55">
                <div className="flex items-start gap-3">
                  <svg className="h-4 w-4 text-forest-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <a
                    href="https://www.google.co.uk/maps/place/The+Up+Spot+Home+Of+Uptown+Nutrition/@41.9647329,-87.6599204,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-forest transition-colors"
                  >
                    4548 N. Broadway, Chicago IL 60640
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-forest-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Open 24/7 · Events preferred to conclude by 2 AM</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-forest-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>
                    <a href="tel:312-899-6358" className="hover:text-forest transition-colors">312-899-6358</a>
                    {' · '}
                    <a href="tel:630-251-8059" className="hover:text-forest transition-colors">630-251-8059</a>
                  </span>
                </div>
              </div>
            </div>

            {/* Right — capabilities grid */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 border-l border-t border-sand">
              {capabilities.map(cap => (
                <div
                  key={cap.label}
                  className="border-r border-b border-sand px-3 py-4 sm:px-5 sm:py-6 flex items-center gap-2 sm:gap-3 group hover:bg-cream-200 transition-colors"
                >
                  <span className="text-2xl">{cap.icon}</span>
                  <span className="text-sm font-medium text-charcoal leading-tight">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Pricing ──────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream-200 border-b border-sand">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-14">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                  Pricing
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[0.92]">
                Transparent,
                <br />
                <em>Simple Rates</em>
              </h2>
            </div>
            <p className="text-sm leading-[1.75] text-foreground/55">
              Straightforward hourly pricing with no hidden fees.
              Discounts available for longer bookings — just ask.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 border-l border-t border-sand">
            {/* Base rate */}
            <div className="border-r border-b border-sand p-5 sm:p-8 col-span-1">
              <div className="text-xs tracking-[0.18em] uppercase text-foreground/40 mb-3">Base Rate</div>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium italic text-forest-600">
                $150
                <span className="text-3xl text-foreground/40">/hr</span>
              </div>
              <p className="mt-3 text-sm text-foreground/55 leading-relaxed">
                Standard tables and chairs included. Additional furniture available to hire.
              </p>
            </div>

            {/* Deposit */}
            <div className="border-r border-b border-sand p-5 sm:p-8 col-span-1">
              <div className="text-xs tracking-[0.18em] uppercase text-foreground/40 mb-3">Deposit</div>
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium italic text-terracotta-500">
                $75
              </div>
              <p className="mt-3 text-sm text-foreground/55 leading-relaxed">
                Non-refundable reservation deposit due at confirmation. Secures your date.
              </p>
            </div>

            {/* Example packages */}
            <div className="border-r border-b border-sand p-5 sm:p-8 col-span-1">
              <div className="text-xs tracking-[0.18em] uppercase text-foreground/40 mb-4">Example Totals</div>
              <div className="space-y-3">
                {[
                  { hours: 2, total: 300 },
                  { hours: 3, total: 450 },
                  { hours: 4, total: 600 },
                  { hours: 6, total: 900 },
                ].map(({ hours, total }) => (
                  <div key={hours} className="flex justify-between text-sm">
                    <span className="text-foreground/55">
                      {hours}
                      {' '}
                      hours
                    </span>
                    <span className="font-semibold text-charcoal">
                      $
                      {total}
                      {' '}
                      + deposit
                    </span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-foreground/40 border-t border-sand">
                  Discounts available upon request
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Map ──────────────────────────────────────── */}
      <section className="h-56 sm:h-72 lg:h-96 border-b border-sand">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2968.3583636399887!2d-87.6599204!3d41.9647329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fd3cd5ae291c9%3A0x8101be963dd71ec!2sThe%20Up%20Spot%20Home%20Of%20Uptown%20Nutrition!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="The Up Spot Location"
        />
      </section>

      {/* ── Booking Form ─────────────────────────────── */}
      <section id="booking" className="py-20 sm:py-28 bg-background">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left — context */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                  Reserve
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-medium text-charcoal leading-[0.92] mb-6">
                Book
                <br />
                <em>The Space</em>
              </h2>
              <p className="text-sm leading-[1.8] text-foreground/55">
                Fill out the form and we&apos;ll reach out within 24 hours to confirm
                availability and collect your $75 deposit. Payment processing is
                coming soon — for now, we&apos;ll follow up directly.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="border border-sand p-5">
                  <div className="text-xs tracking-[0.15em] uppercase text-foreground/40 mb-2">What happens next</div>
                  <ol className="space-y-2 text-foreground/60">
                    <li className="flex gap-3">
                      <span className="font-display italic text-terracotta-500 shrink-0">1.</span>
                      Submit your request below
                    </li>
                    <li className="flex gap-3">
                      <span className="font-display italic text-terracotta-500 shrink-0">2.</span>
                      We confirm availability within 24 hrs
                    </li>
                    <li className="flex gap-3">
                      <span className="font-display italic text-terracotta-500 shrink-0">3.</span>
                      $75 deposit secures your date
                    </li>
                    <li className="flex gap-3">
                      <span className="font-display italic text-terracotta-500 shrink-0">4.</span>
                      Remaining balance due on the day
                    </li>
                  </ol>
                </div>

                <div className="border border-sand p-5">
                  <div className="text-xs tracking-[0.15em] uppercase text-foreground/40 mb-2">Questions?</div>
                  <p className="text-foreground/55 leading-relaxed">
                    Call us at
                    {' '}
                    <a href="tel:312-899-6358" className="text-forest hover:underline">312-899-6358</a>
                    {' or '}
                    <a href="tel:630-251-8059" className="text-forest hover:underline">630-251-8059</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-2">
              <BookingForm />
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
