"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { StarIcon } from '@heroicons/react/20/solid'
import { useCart } from "@/app/context/CartContext";

const products = [
  // Sweet Tooth
  {
    id: 1,
    name: 'Protein Pancakes',
    price: '$10',
    rating: 5,
    reviewCount: 45,
    category: 'Sweet Tooth',
    description: '24g Protein | 6g Fiber | 250 Cal',
    image: '🥞',
    href: '#',
  },
  {
    id: 2,
    name: 'Protein Bowls - Berry',
    price: '$10',
    rating: 5,
    reviewCount: 38,
    category: 'Sweet Tooth',
    description: '24g Protein | 2g Sugar | 200 Cal',
    image: '🥣',
    href: '#',
  },
  {
    id: 3,
    name: 'Protein Bowls - Mango',
    price: '$10',
    rating: 5,
    reviewCount: 35,
    category: 'Sweet Tooth',
    description: '24g Protein | 2g Sugar | 200 Cal',
    image: '🥭',
    href: '#',
  },
  {
    id: 4,
    name: 'Protein Bowls - Chocolate',
    price: '$10',
    rating: 5,
    reviewCount: 42,
    category: 'Sweet Tooth',
    description: '24g Protein | 2g Sugar | 200 Cal',
    image: '🍫',
    href: '#',
  },
  {
    id: 5,
    name: 'Protein Waffles',
    price: '$10',
    rating: 5,
    reviewCount: 51,
    category: 'Sweet Tooth',
    description: '24g Protein | 6g Fiber | 250 Cal',
    image: '🧇',
    href: '#',
  },
  {
    id: 6,
    name: 'Protein Donuts',
    price: '$3',
    rating: 5,
    reviewCount: 67,
    category: 'Sweet Tooth',
    description: '15g Protein | 15g Carbs | 120 Cal',
    image: '🍩',
    href: '#',
  },
  {
    id: 7,
    name: 'Protein Coffee - Mocha',
    price: '$9',
    rating: 5,
    reviewCount: 29,
    category: 'Sweet Tooth',
    description: '22g Protein | 2g Sugar | 24oz',
    image: '☕',
    href: '#',
  },
  {
    id: 8,
    name: 'Protein Coffee - House Blend',
    price: '$9',
    rating: 5,
    reviewCount: 31,
    category: 'Sweet Tooth',
    description: '22g Protein | 2g Sugar | 24oz',
    image: '☕',
    href: '#',
  },
  {
    id: 9,
    name: 'Protein Oats - Oatmeal Raisin',
    price: '$9',
    rating: 5,
    reviewCount: 24,
    category: 'Sweet Tooth',
    description: '24g Protein | 2g Sugar | 100 Cal',
    image: '🥣',
    href: '#',
  },
  {
    id: 10,
    name: 'Protein Oats - Banana Caramel',
    price: '$9',
    rating: 5,
    reviewCount: 28,
    category: 'Sweet Tooth',
    description: '24g Protein | 2g Sugar | 100 Cal',
    image: '🍌',
    href: '#',
  },
  // Protein Based Snacks
  {
    id: 11,
    name: 'Lemon Bar',
    price: '$3',
    rating: 5,
    reviewCount: 33,
    category: 'Snacks',
    description: 'Protein-based snack',
    image: '🍋',
    href: '#',
  },
  {
    id: 12,
    name: 'Almond Bar',
    price: '$3',
    rating: 5,
    reviewCount: 41,
    category: 'Snacks',
    description: 'Protein-based snack',
    image: '🌰',
    href: '#',
  },
  // Popular Smoothies (selection from 30+ flavors)
  {
    id: 13,
    name: 'Pineapple Cake Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 56,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🍍',
    href: '#',
  },
  {
    id: 14,
    name: 'Coconut Cream Pie Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 48,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🥥',
    href: '#',
  },
  {
    id: 15,
    name: 'Strawberry Short Cake Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 72,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🍓',
    href: '#',
  },
  {
    id: 16,
    name: 'Almond Joy Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 61,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🍫',
    href: '#',
  },
  {
    id: 17,
    name: 'Banana Split Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 53,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🍌',
    href: '#',
  },
  {
    id: 18,
    name: 'OREO Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 84,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🍪',
    href: '#',
  },
  {
    id: 19,
    name: 'Fruity Pebbles Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 67,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🌈',
    href: '#',
  },
  {
    id: 20,
    name: 'Green n\' Vibin Smoothie',
    price: '$9',
    rating: 5,
    reviewCount: 39,
    category: 'Smoothies',
    description: '250-350 Cal | 24g Protein',
    image: '🥬',
    href: '#',
  },
  // Refreshers 32oz
  {
    id: 21,
    name: 'Watermelon Rush Refresher',
    price: '$10',
    rating: 5,
    reviewCount: 44,
    category: 'Refreshers',
    description: 'Energy, Focus, Hydration | 32oz',
    image: '🍉',
    href: '#',
  },
  {
    id: 22,
    name: 'Be My Swee-tea Refresher',
    price: '$10',
    rating: 5,
    reviewCount: 37,
    category: 'Refreshers',
    description: 'Pomegranate, Raspberry | 32oz',
    image: '🍵',
    href: '#',
  },
  {
    id: 23,
    name: 'Immuni-tea Refresher',
    price: '$10',
    rating: 5,
    reviewCount: 41,
    category: 'Refreshers',
    description: 'Orange, Immunity Essential | 32oz',
    image: '🍊',
    href: '#',
  },
  // Refreshers 24oz
  {
    id: 24,
    name: 'Pink Starburst Refresher',
    price: '$8',
    rating: 5,
    reviewCount: 58,
    category: 'Refreshers',
    description: 'Wild Berry, Strawberry | 24oz',
    image: '🌸',
    href: '#',
  },
  {
    id: 25,
    name: 'Hawaiian Punch Refresher',
    price: '$8',
    rating: 5,
    reviewCount: 49,
    category: 'Refreshers',
    description: 'Strawberry, Orange | 24oz',
    image: '🌺',
    href: '#',
  },
  {
    id: 26,
    name: 'Captain America Refresher',
    price: '$8',
    rating: 5,
    reviewCount: 52,
    category: 'Refreshers',
    description: 'Blue Raspberry, Pomegranate | 24oz',
    image: '🦸',
    href: '#',
  },
  // Combos
  {
    id: 27,
    name: 'Uptown Combo',
    price: '$14',
    rating: 5,
    reviewCount: 73,
    category: 'Combos',
    description: '24oz Refresher & 24oz Smoothie',
    image: '🎯',
    href: '#',
  },
  {
    id: 28,
    name: 'Lit Combo',
    price: '$17',
    rating: 5,
    reviewCount: 68,
    category: 'Combos',
    description: '32oz Refresher & 24oz Smoothie',
    image: '🔥',
    href: '#',
  },
  // Shots
  {
    id: 29,
    name: 'Watermelon Preworkout Shot',
    price: '$5',
    rating: 5,
    reviewCount: 34,
    category: 'Shots',
    description: 'Energy boost shot',
    image: '💪',
    href: '#',
  },
  {
    id: 30,
    name: 'Collagen Beauty Booster Shot',
    price: '$5',
    rating: 5,
    reviewCount: 47,
    category: 'Shots',
    description: 'Beauty & skin health',
    image: '✨',
    href: '#',
  },
  {
    id: 31,
    name: 'Immunity Booster Shot',
    price: '$5',
    rating: 5,
    reviewCount: 51,
    category: 'Shots',
    description: 'Immune system support',
    image: '🛡️',
    href: '#',
  },
]

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductsPage() {
  const categories = ['All', 'Sweet Tooth', 'Smoothies', 'Refreshers', 'Snacks', 'Combos', 'Shots']
  const { addItem } = useCart();

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-slate-950">
        <Container className="py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Our Full Menu
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Browse our complete selection of nutritious smoothies, protein-packed treats, and energizing refreshers
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full px-6 py-2 text-sm font-semibold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="mx-auto max-w-7xl overflow-hidden">
            <h2 className="sr-only">Products</h2>

            <div className="-mx-px grid grid-cols-2 border-l border-slate-200 dark:border-slate-700 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative border-r border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  {/* Product Image/Emoji */}
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                    {product.image}
                  </div>

                  {/* Product Info */}
                  <div className="pt-10 pb-4 text-center">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>

                    {/* Category Badge */}
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        {product.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="mt-3 flex flex-col items-center">
                      <p className="sr-only">{product.rating} out of 5 stars</p>
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              product.rating > rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700',
                              'size-5 shrink-0',
                            )}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {product.reviewCount} reviews
                      </p>
                    </div>

                    {/* Price */}
                    <p className="mt-4 text-base font-medium text-slate-900 dark:text-white">
                      {product.price}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Adding to cart:', product.name);
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          imageSrc: product.image,
                          imageAlt: product.name,
                        });
                      }}
                      className="relative z-10 mt-4 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-8 py-6">
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Over 30 Smoothie Flavors Available!
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Visit us in store to see our complete menu and daily specials
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
