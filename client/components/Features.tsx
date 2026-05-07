import { Container } from '@/components/Container'

const features = [
  {
    name: 'Fresh Daily Preparation',
    description:
      'All meals and snacks are prepared fresh daily with the highest quality ingredients. No preservatives or artificial additives.',
    icon: TruckIcon,
  },
  {
    name: 'Satisfaction Guarantee',
    description:
      'Love it or your money back. We\'re committed to your complete satisfaction with every order.',
    icon: ReturnIcon,
  },
  {
    name: 'Nutritionist Approved',
    description:
      'Every menu item is designed by certified nutritionists to ensure optimal macro and micronutrient balance.',
    icon: HeartIcon,
  },
  {
    name: 'Quality Ingredients',
    description:
      'We source only premium, whole-food ingredients. Organic when possible, always fresh and nutritious.',
    icon: CheckBadgeIcon,
  },
  {
    name: 'Macro Tracking Made Easy',
    description:
      'Detailed nutrition information for every meal helps you stay on track with your health goals.',
    icon: LeafIcon,
  },
  {
    name: 'Flexible Meal Plans',
    description:
      'Customize your meal plan to fit your lifestyle, dietary preferences, and fitness goals.',
    icon: GiftIcon,
  },
]

function TruckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  )
}

function ReturnIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  )
}

function HeartIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  )
}

function CheckBadgeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  )
}

function LeafIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.6C17.31 4.55 14.78 3 12 3z"
      />
    </svg>
  )
}

function GiftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  )
}

export function Features() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="bg-background py-20 sm:py-32 border-t border-sand"
    >
      <Container>
        {/* Section header — editorial two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                Why us
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[0.92]">
              Why Choose
              <br />
              <em>Uptown Nutrition</em>
            </h2>
          </div>
          <p className="text-sm leading-[1.75] text-foreground/55">
            We're committed to making healthy eating easy, delicious, and
            accessible for everyone in Chicago and beyond.
          </p>
        </div>

        {/* Features grid — editorial with number watermarks */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-sand"
        >
          {features.map((feature, i) => (
            <li
              key={feature.name}
              className="relative p-5 sm:p-8 border-r border-b border-sand group hover:bg-cream-200 transition-colors duration-200 overflow-hidden"
            >
              {/* Decorative number watermark */}
              <span className="absolute top-3 right-4 font-display text-6xl sm:text-8xl font-semibold text-sand leading-none select-none group-hover:text-cream-300 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>

              <feature.icon className="relative h-6 w-6 text-forest-600" />

              <h3 className="relative mt-6 font-display text-xl font-semibold text-charcoal">
                {feature.name}
              </h3>

              <p className="relative mt-3 text-sm leading-[1.7] text-foreground/55">
                {feature.description}
              </p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-forest-600 transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
