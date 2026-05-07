'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Container } from '@/components/Container'

const products = [
  {
    category: 'Sweet Tooth',
    description:
      'Delicious high-protein treats that satisfy your cravings while fueling your body with quality nutrition.',
    items: [
      {
        id: 1,
        name: 'Protein Pancakes',
        price: '$10',
        image: '🥞',
        features: ['24g Protein', '6g Fiber', '250 Cal'],
      },
      {
        id: 2,
        name: 'Protein Bowls',
        price: '$10',
        image: '🥣',
        features: ['24g Protein', '2g Sugar', 'Berry/Mango/Chocolate'],
      },
    ],
  },
  {
    category: 'Smoothies',
    description:
      'Protein-packed smoothies in 30+ delicious flavors. Perfect for post-workout or a healthy meal replacement.',
    items: [
      {
        id: 17,
        name: 'Strawberry Short Cake',
        price: '$9',
        image: '🍓',
        features: ['250–350 Cal', '9–14g Sugar', '24g Protein'],
      },
      {
        id: 18,
        name: 'Almond Joy',
        price: '$9',
        image: '🥥',
        features: ['10–15g Carbs', 'Coconut & Almond', '24g Protein'],
      },
    ],
  },
  {
    category: 'Refreshers',
    description:
      'Energizing refreshers for focus, hydration and energy. Available in 24oz and 32oz sizes.',
    items: [
      {
        id: 21,
        name: 'Watermelon Rush',
        price: '$10',
        image: '🍉',
        features: ['32oz', 'Energy Boost', 'Hydration'],
      },
      {
        id: 24,
        name: 'Pink Starburst',
        price: '$8',
        image: '🌸',
        features: ['24oz', 'Wild Berry', 'Focus & Energy'],
      },
    ],
  },
  {
    category: 'Protein Snacks',
    description:
      'Protein-based snacks perfect for on-the-go nutrition. Delicious treats that support your fitness goals.',
    items: [
      {
        id: 7,
        name: 'Protein Donuts',
        price: '$3',
        image: '🍩',
        features: ['15g Protein', '15g Carbs', '120 Cal'],
      },
      {
        id: 9,
        name: 'Protein Coffee 24oz',
        price: '$9',
        image: '☕',
        features: ['22g Protein', '2g Sugar', 'Mocha/House Blend'],
      },
    ],
  },
]

export function Products() {
  const [tabOrientation, setTabOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal')

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="products"
      aria-label="Featured Products"
      className="relative overflow-hidden bg-cream-200 border-t border-sand py-20 sm:py-32"
    >
      <Container className="relative">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">
                Our menu
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-charcoal leading-[0.92]">
              Our Nutrition
              <br />
              <em>Menu</em>
            </h2>
          </div>
          <p className="text-sm leading-[1.75] text-foreground/55">
            Carefully crafted meals and snacks across all categories. Each item
            is prepared fresh with whole ingredients and balanced nutrition in
            mind.
          </p>
        </div>

        <TabGroup
          className="grid grid-cols-1 items-center gap-y-2 pt-4 sm:gap-y-6 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              {/* Tab list */}
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-4">
                <TabList className="relative z-10 flex gap-x-0 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:flex-col lg:whitespace-normal">
                  {products.map((product, productIndex) => (
                    <div
                      key={product.category}
                      className={clsx(
                        'group relative px-5 py-2.5 lg:px-6 lg:py-5 cursor-pointer transition-colors',
                        selectedIndex === productIndex
                          ? 'border-b-2 border-forest-600 lg:border-b-0 lg:border-l-2 lg:bg-background'
                          : 'border-b-2 border-transparent lg:border-b-0 lg:border-l-2 lg:border-sand hover:lg:bg-background/50',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg font-medium focus:outline-none',
                            selectedIndex === productIndex
                              ? 'text-forest-600'
                              : 'text-foreground/50 hover:text-foreground/80',
                          )}
                        >
                          <span className="absolute inset-0" />
                          {product.category}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-1.5 hidden text-xs leading-relaxed lg:block',
                          selectedIndex === productIndex
                            ? 'text-foreground/60'
                            : 'text-foreground/40 group-hover:text-foreground/50',
                        )}
                      >
                        {product.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>

              {/* Tab panels */}
              <TabPanels className="lg:col-span-8 lg:pl-10">
                {products.map(product => (
                  <TabPanel key={product.category} unmount={false}>
                    <div className="relative sm:px-0 lg:hidden mb-6">
                      <p className="text-sm text-foreground/55 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {product.items.map(item => (
                        <div
                          key={item.name}
                          className="group relative bg-background border border-sand p-4 sm:p-6 hover:border-forest-600 transition-colors duration-200"
                        >
                          {/* Emoji */}
                          <div className="text-5xl mb-5">{item.image}</div>

                          <h4 className="font-display text-xl font-semibold text-charcoal">
                            {item.name}
                          </h4>

                          <p className="mt-1.5 font-display text-2xl font-medium italic text-terracotta-500">
                            {item.price}
                          </p>

                          {/* Feature tags */}
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {item.features.map(feature => (
                              <span
                                key={feature}
                                className="inline-block px-2.5 py-1 bg-forest-50 text-forest-700 text-[0.7rem] font-medium tracking-wide border border-forest-100"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <Link
                            href="/products"
                            className="mt-6 block w-full bg-forest-600 text-cream-100 py-2.5 text-sm font-semibold tracking-wide text-center hover:bg-forest-700 active:bg-forest-900 transition-colors"
                          >
                            Order Now →
                          </Link>

                          {/* Hover accent */}
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-forest-600 transition-all duration-300 group-hover:w-full" />
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
