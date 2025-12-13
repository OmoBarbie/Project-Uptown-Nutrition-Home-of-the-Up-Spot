// Source: Salient's Testimonials component
// Customized with ecommerce-focused customer reviews

import { Container } from "@/components/Container";

const testimonials = [
  [
    {
      content:
        "Switching to uptown nutrition has been a game-changer for my fitness journey. The meals are delicious, perfectly portioned, and I've never felt better!",
      author: {
        name: "Sarah Chen",
        role: "Fitness Enthusiast",
        initials: "SC",
      },
    },
    {
      content:
        "The protein meals are fantastic! High quality ingredients, great taste, and the convenience saves me hours each week. Plus my energy levels are through the roof.",
      author: {
        name: "Michael Rodriguez",
        role: "Personal Trainer",
        initials: "MR",
      },
    },
  ],
  [
    {
      content:
        "I appreciate the detailed nutrition information and the freshness of every meal. It's made tracking my macros so much easier while training.",
      author: {
        name: "Emma Thompson",
        role: "Marathon Runner",
        initials: "ET",
      },
    },
    {
      content:
        "The salmon bowls are my favorite! Fresh, flavorful, and I can actually feel the difference in my recovery after workouts.",
      author: {
        name: "David Kim",
        role: "Yoga Instructor",
        initials: "DK",
      },
    },
  ],
  [
    {
      content:
        "Finally, healthy food that doesn't taste like cardboard! Every meal is restaurant-quality. I've lost 15 pounds and gained so much energy.",
      author: {
        name: "Lisa Anderson",
        role: "Busy Mom",
        initials: "LA",
      },
    },
    {
      content:
        "The protein smoothies are perfect post-workout fuel. Tastes amazing and I love that they're made with real whole foods, not artificial additives.",
      author: {
        name: "James Wilson",
        role: "Professional Athlete",
        initials: "JW",
      },
    },
  ],
];

function QuoteIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Customer Testimonials"
      className="bg-white py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Loved by Health-Conscious People
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Join thousands of customers who are fueling their bodies with
            nutritious, delicious meals every day.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-2xl bg-slate-50 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <QuoteIcon className="absolute top-6 left-6 fill-emerald-100" />
                      <blockquote className="relative">
                        <p className="text-lg tracking-tight text-slate-900">
                          {testimonial.content}
                        </p>
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
                        <div>
                          <div className="font-display text-base text-slate-900">
                            {testimonial.author.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {testimonial.author.role}
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-full bg-emerald-100">
                          <div className="h-14 w-14 flex items-center justify-center text-lg font-semibold text-emerald-600">
                            {testimonial.author.initials}
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600">15k+</div>
            <div className="mt-2 text-sm text-slate-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600">4.9/5</div>
            <div className="mt-2 text-sm text-slate-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600">98%</div>
            <div className="mt-2 text-sm text-slate-600">Would Recommend</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600">50k+</div>
            <div className="mt-2 text-sm text-slate-600">Products Sold</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
