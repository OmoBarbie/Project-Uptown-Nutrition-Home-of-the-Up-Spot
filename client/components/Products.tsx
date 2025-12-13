// Source: Salient's PrimaryFeatures component with tab interface
// Customized for product showcase with categories

'use client'

import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { useCart } from '@/app/context/CartContext'

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
        features: ['250-350 Cal', '9-14g Sugar', '24g Protein'],
      },
      {
        id: 18,
        name: 'Almond Joy',
        price: '$9',
        image: '🥥',
        features: ['10-15g Carbs', 'Coconut & Almond', '24g Protein'],
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
  const [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )
  const { addItem } = useCart()

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
      className="relative overflow-hidden bg-white pt-20 pb-28 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Our Nutrition Menu
          </h2>
          <p className="mt-6 text-lg tracking-tight text-slate-700">
            Carefully crafted meals and snacks across all categories. Each item is
            prepared fresh with whole ingredients and balanced nutrition in mind.
          </p>
        </div>

        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {products.map((product, productIndex) => (
                    <div
                      key={product.category}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === productIndex
                          ? 'bg-white lg:bg-emerald-600/10 lg:ring-1 lg:ring-emerald-600/20 lg:ring-inset'
                          : 'hover:bg-slate-100 lg:hover:bg-slate-50',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg data-selected:not-data-focus:outline-hidden',
                            selectedIndex === productIndex
                              ? 'text-emerald-600 lg:text-emerald-600'
                              : 'text-slate-600 hover:text-slate-900 lg:text-slate-900',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {product.category}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === productIndex
                            ? 'text-slate-700'
                            : 'text-slate-600 group-hover:text-slate-700',
                        )}
                      >
                        {product.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>

              <TabPanels className="lg:col-span-7">
                {products.map((product) => (
                  <TabPanel key={product.category} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <p className="relative mx-auto max-w-2xl text-base text-slate-600 sm:text-center">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                      {product.items.map((item) => (
                        <div
                          key={item.name}
                          className="group relative overflow-hidden rounded-2xl bg-slate-50 p-6 shadow-md hover:shadow-xl transition-all duration-200"
                        >
                          <div className="text-6xl mb-4">{item.image}</div>
                          <h4 className="font-display text-xl font-semibold text-slate-900">
                            {item.name}
                          </h4>
                          <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {item.price}
                          </p>
                          <ul className="mt-4 space-y-2">
                            {item.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center text-sm text-slate-600"
                              >
                                <svg
                                  className="mr-2 h-4 w-4 text-emerald-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                imageSrc: item.image,
                                imageAlt: item.name,
                              })
                            }}
                            className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                          >
                            Add to Cart
                          </button>
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
