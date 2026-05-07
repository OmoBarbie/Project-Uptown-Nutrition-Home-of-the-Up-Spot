import { Container } from '@/components/Container'

const testimonials = [
  {
    content:
      'Switching to Uptown Nutrition has been a game-changer for my fitness journey. The meals are delicious, perfectly portioned, and I\'ve never felt better!',
    author: { name: 'Sarah Chen', role: 'Fitness Enthusiast', initials: 'SC' },
  },
  {
    content:
      'The protein meals are fantastic! High quality ingredients, great taste, and the convenience saves me hours each week. Plus my energy levels are through the roof.',
    author: {
      name: 'Michael Rodriguez',
      role: 'Personal Trainer',
      initials: 'MR',
    },
  },
  {
    content:
      'I appreciate the detailed nutrition information and the freshness of every meal. It\'s made tracking my macros so much easier while training.',
    author: { name: 'Emma Thompson', role: 'Marathon Runner', initials: 'ET' },
  },
  {
    content:
      'The salmon bowls are my favorite! Fresh, flavorful, and I can actually feel the difference in my recovery after workouts.',
    author: { name: 'David Kim', role: 'Yoga Instructor', initials: 'DK' },
  },
  {
    content:
      'Finally, healthy food that doesn\'t taste like cardboard! Every meal is restaurant-quality. I\'ve lost 15 pounds and gained so much energy.',
    author: { name: 'Lisa Anderson', role: 'Busy Mom', initials: 'LA' },
  },
  {
    content:
      'The protein smoothies are perfect post-workout fuel. Tastes amazing and I love that they\'re made with real whole foods, not artificial additives.',
    author: {
      name: 'James Wilson',
      role: 'Professional Athlete',
      initials: 'JW',
    },
  },
]

function QuoteMarkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 36 28" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M11.086 27.292c-1.904 0-3.597-.476-5.081-1.428-1.484-1.01-2.674-2.408-3.567-4.19C1.496 19.892 1 17.82 1 15.558c0-2.08.356-4.10 1.07-6.06.773-1.96 1.872-3.77 3.297-5.44A23.29 23.29 0 0 1 10.26.59L14.63 5.99C12.09 7 9.95 8.35 8.39 10.07c-1.48 1.66-2.23 3.09-2.23 4.28 0 .535.149 1.13.446 1.784.356.595 1.041 1.22 2.052 1.873 1.485.953 2.497 1.963 3.032 3.032.595 1.011.893 2.17.893 3.478 0 2.02-.773 3.626-2.32 4.814-1.485 1.188-3.39 1.784-5.707 1.784zm21.408 0c-1.904 0-3.597-.476-5.081-1.428-1.484-1.01-2.674-2.408-3.567-4.19-0.832-1.784-1.248-3.807-1.248-6.069 0-2.08.356-4.10 1.07-6.06.773-1.96 1.872-3.77 3.297-5.44A23.29 23.29 0 0 1 32.038.59L36 5.99c-2.555 1.01-4.695 2.35-6.256 4.07-1.484 1.66-2.23 3.09-2.23 4.28 0 .535.149 1.13.446 1.784.356.595 1.041 1.22 2.052 1.873 1.485.953 2.497 1.963 3.032 3.032.595 1.011.893 2.17.893 3.478 0 2.02-.773 3.626-2.32 4.814-1.485 1.188-3.39 1.784-5.707 1.784z" />
    </svg>
  )
}

const stats = [
  { value: '15k+', label: 'Happy Customers' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '98%', label: 'Would Recommend' },
  { value: '50k+', label: 'Items Sold' },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Customer Testimonials"
      className="bg-forest-950 py-20 sm:py-32"
    >
      <Container>
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-terracotta-400" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-400">
                What they say
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-cream-100 leading-[0.92]">
              Loved by
              <br />
              <em>Real People</em>
            </h2>
          </div>
          <p className="text-sm leading-[1.75] text-cream-100/40 max-w-xs">
            Join thousands fueling their bodies with nutritious, delicious
            meals every day.
          </p>
        </div>

        {/* Testimonials grid — flush with 1px separator lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-cream-100/10">
          {/* eslint-disable react/no-array-index-key */}
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-5 sm:p-8 border-r border-b border-cream-100/10 hover:bg-forest-900 transition-colors duration-200 group"
            >
              <QuoteMarkIcon className="h-7 w-auto text-terracotta-500/50 mb-6 group-hover:text-terracotta-500/80 transition-colors" />

              <blockquote className="font-display text-[1.0625rem] italic leading-[1.7] text-cream-100/80">
                &ldquo;
                {testimonial.content}
                &rdquo;
              </blockquote>

              <div className="mt-6 pt-5 border-t border-cream-100/10 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-amber-warm flex items-center justify-center shrink-0">
                  <span className="text-[0.65rem] font-bold text-charcoal">
                    {testimonial.author.initials}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream-100">
                    {testimonial.author.name}
                  </div>
                  <div className="text-xs text-cream-100/40">
                    {testimonial.author.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-0 grid grid-cols-2 md:grid-cols-4 border-l border-t border-cream-100/10">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="px-4 py-6 sm:px-8 sm:py-10 border-r border-b border-cream-100/10 text-center"
            >
              <div className="font-display text-4xl font-medium italic text-terracotta-400">
                {stat.value}
              </div>
              <div className="mt-2 text-[0.65rem] tracking-[0.18em] uppercase text-cream-100/35">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
