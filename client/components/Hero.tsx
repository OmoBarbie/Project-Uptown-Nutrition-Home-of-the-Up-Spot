// Source: Combination of Salient's Hero headline style + Pocket's animated background
// Customized for ecommerce with product-focused messaging

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-emerald-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#hero-pattern)"
          />
        </svg>
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Free shipping on orders over $50
          </div>

          {/* Main headline */}
          <h1 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Fuel Your Body{" "}
            <span className="relative whitespace-nowrap text-emerald-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-emerald-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">with Real Food</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Delicious, nutritious meals and snacks made with whole ingredients.
            From protein-packed meals to wholesome treats, every bite supports
            your health and wellness journey.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Button href="#products">
              Browse Collection
            </Button>
            <Button href="#how-it-works" variant="outline" color="slate">
              Learn More
            </Button>
          </div>

          {/* Social proof - Brand logos */}
          <div className="mt-20">
            <p className="font-display text-base text-slate-900">
              Trusted by thousands of health-conscious individuals
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-8 opacity-60 grayscale">
              {/* Placeholder for brand logos */}
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded bg-slate-200" />
                <div className="h-12 w-24 rounded bg-slate-200" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-12 w-12 rounded bg-slate-200" />
                <div className="h-12 w-24 rounded bg-slate-200" />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-12 w-12 rounded bg-slate-200" />
                <div className="h-12 w-24 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
