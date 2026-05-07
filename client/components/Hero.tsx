import Link from 'next/link'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Geometric background accents */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Warm panel on the right */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[45%] bg-cream-200"
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        />
        {/* Thin vertical rule lines */}
        <div className="absolute top-0 bottom-0 right-[45%] w-px bg-sand" />
        <div className="absolute top-20 bottom-20 right-[35%] w-px bg-sand/50" />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 items-stretch min-h-[88vh]">
          {/* Left: Headline (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-center pt-16 pb-12 lg:py-24 lg:pr-16 animate-reveal">
            {/* Kicker */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                Chicago&apos;s Nutrition Bar
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-medium text-charcoal leading-[0.88]">
              <span className="block text-[clamp(2.25rem,6vw,6.5rem)]">Fuel</span>
              <span className="block text-[clamp(2.25rem,6vw,6.5rem)] italic text-forest-600">
                Your Body
              </span>
              <span className="block text-[clamp(2.25rem,6vw,6.5rem)]">With Real</span>
              <span className="block text-[clamp(2.25rem,6vw,6.5rem)] text-terracotta-500">
                Food.
              </span>
            </h1>

            {/* Body */}
            <p className="mt-8 text-[0.9375rem] leading-[1.7] text-foreground/60 max-w-[26rem] animate-reveal-delay-1">
              Delicious, nutritious meals and smoothies made fresh daily.
              From protein-packed bowls to wholesome treats — every bite
              supports your wellness journey.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex items-center gap-5 animate-reveal-delay-2">
              <Button href="/products" color="forest">
                Browse Menu
              </Button>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-forest transition-colors group"
              >
                Our Story
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Stats block (2 cols) — desktop only */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-center gap-0 pl-10 animate-reveal-delay-1">
            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-0 border border-sand">
              {[
                {
                  value: '15k+',
                  label: 'Happy Customers',
                  bg: 'bg-forest-600',
                  text: 'text-cream-100',
                  sub: 'text-cream-100/60',
                  italic: true,
                },
                {
                  value: '4.9★',
                  label: 'Average Rating',
                  bg: 'bg-terracotta-500',
                  text: 'text-cream-100',
                  sub: 'text-cream-100/60',
                  italic: true,
                },
                {
                  value: '$50',
                  label: 'Free Delivery Over',
                  bg: 'bg-cream-200',
                  text: 'text-charcoal',
                  sub: 'text-charcoal/50',
                  italic: false,
                },
                {
                  value: '50k+',
                  label: 'Items Sold',
                  bg: 'bg-amber-warm',
                  text: 'text-charcoal',
                  sub: 'text-charcoal/50',
                  italic: false,
                },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} p-7`}>
                  <div
                    className={`font-display text-4xl font-medium ${stat.text} ${stat.italic ? 'italic' : ''}`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`mt-1.5 text-[0.65rem] tracking-[0.18em] uppercase ${stat.sub}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Address callout */}
            <div className="border border-t-0 border-sand px-7 py-5 bg-background">
              <div className="text-[0.65rem] tracking-[0.18em] uppercase text-foreground/40 mb-2">
                Visit Us
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-charcoal hover:text-forest transition-colors"
              >
                4548 N Broadway, Chicago
              </a>
              <div className="mt-1 text-xs text-foreground/40">
                Mon–Sat 7am–7pm · Sun 8am–5pm
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats strip */}
        <div className="lg:hidden border-t border-sand py-6 grid grid-cols-3 gap-0">
          {[
            { value: '15k+', label: 'Customers', color: 'text-forest-600' },
            { value: '4.9★', label: 'Rating', color: 'text-terracotta-500' },
            { value: '$50+', label: 'Free Delivery', color: 'text-charcoal' },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center border-r border-sand last:border-0 px-2 sm:px-4"
            >
              <div
                className={`font-display text-2xl sm:text-3xl font-medium italic ${stat.color}`}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider text-foreground/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
