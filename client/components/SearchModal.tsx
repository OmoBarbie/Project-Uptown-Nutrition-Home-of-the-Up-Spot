'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import { useCart } from '@/app/context/CartContext'

interface Product {
  id: number
  name: string
  price: string
  category: string
  description: string
  image: string
}

const allProducts: Product[] = [
  // Sweet Tooth
  { id: 1, name: 'Protein Pancakes', price: '$10', category: 'Sweet Tooth', description: '24g Protein | 6g Fiber | 250 Cal', image: '🥞' },
  { id: 2, name: 'Protein Bowls - Berry', price: '$10', category: 'Sweet Tooth', description: '24g Protein | 2g Sugar | 200 Cal', image: '🥣' },
  { id: 3, name: 'Protein Bowls - Mango', price: '$10', category: 'Sweet Tooth', description: '24g Protein | 2g Sugar | 200 Cal', image: '🥭' },
  { id: 4, name: 'Protein Bowls - Chocolate', price: '$10', category: 'Sweet Tooth', description: '24g Protein | 2g Sugar | 200 Cal', image: '🍫' },
  { id: 5, name: 'Protein Waffles', price: '$10', category: 'Sweet Tooth', description: '24g Protein | 6g Fiber | 250 Cal', image: '🧇' },
  { id: 6, name: 'Protein Donuts', price: '$3', category: 'Sweet Tooth', description: '15g Protein | 15g Carbs | 120 Cal', image: '🍩' },
  { id: 7, name: 'Protein Coffee - Mocha', price: '$9', category: 'Sweet Tooth', description: '22g Protein | 2g Sugar | 24oz', image: '☕' },
  { id: 8, name: 'Protein Coffee - House Blend', price: '$9', category: 'Sweet Tooth', description: '22g Protein | 2g Sugar | 24oz', image: '☕' },
  { id: 9, name: 'Protein Oats - Oatmeal Raisin', price: '$9', category: 'Sweet Tooth', description: '24g Protein | 2g Sugar | 100 Cal', image: '🥣' },
  { id: 10, name: 'Protein Oats - Banana Caramel', price: '$9', category: 'Sweet Tooth', description: '24g Protein | 2g Sugar | 100 Cal', image: '🍌' },
  // Snacks
  { id: 11, name: 'Lemon Bar', price: '$3', category: 'Snacks', description: 'Protein-based snack', image: '🍋' },
  { id: 12, name: 'Almond Bar', price: '$3', category: 'Snacks', description: 'Protein-based snack', image: '🌰' },
  // Smoothies
  { id: 13, name: 'Pineapple Cake Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🍍' },
  { id: 14, name: 'Coconut Cream Pie Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🥥' },
  { id: 15, name: 'Strawberry Short Cake Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🍓' },
  { id: 16, name: 'Almond Joy Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🍫' },
  { id: 17, name: 'Banana Split Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🍌' },
  { id: 18, name: 'OREO Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🍪' },
  { id: 19, name: 'Fruity Pebbles Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🌈' },
  { id: 20, name: 'Green n\' Vibin Smoothie', price: '$9', category: 'Smoothies', description: '250-350 Cal | 24g Protein', image: '🥬' },
  // Refreshers
  { id: 21, name: 'Watermelon Rush Refresher', price: '$10', category: 'Refreshers', description: 'Energy, Focus, Hydration | 32oz', image: '🍉' },
  { id: 22, name: 'Be My Swee-tea Refresher', price: '$10', category: 'Refreshers', description: 'Pomegranate, Raspberry | 32oz', image: '🍵' },
  { id: 23, name: 'Immuni-tea Refresher', price: '$10', category: 'Refreshers', description: 'Orange, Immunity Essential | 32oz', image: '🍊' },
  { id: 24, name: 'Pink Starburst Refresher', price: '$8', category: 'Refreshers', description: 'Wild Berry, Strawberry | 24oz', image: '🌸' },
  { id: 25, name: 'Hawaiian Punch Refresher', price: '$8', category: 'Refreshers', description: 'Strawberry, Orange | 24oz', image: '🌺' },
  { id: 26, name: 'Captain America Refresher', price: '$8', category: 'Refreshers', description: 'Blue Raspberry, Pomegranate | 24oz', image: '🦸' },
  // Combos
  { id: 27, name: 'Uptown Combo', price: '$14', category: 'Combos', description: '24oz Refresher & 24oz Smoothie', image: '🎯' },
  { id: 28, name: 'Lit Combo', price: '$17', category: 'Combos', description: '32oz Refresher & 24oz Smoothie', image: '🔥' },
  // Shots
  { id: 29, name: 'Watermelon Preworkout Shot', price: '$5', category: 'Shots', description: 'Energy boost shot', image: '💪' },
  { id: 30, name: 'Collagen Beauty Booster Shot', price: '$5', category: 'Shots', description: 'Beauty & skin health', image: '✨' },
  { id: 31, name: 'Immunity Booster Shot', price: '$5', category: 'Shots', description: 'Immune system support', image: '🛡️' },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const { addItem } = useCart()

  const filteredProducts = query === ''
    ? []
    : allProducts.filter((product) => {
        const searchQuery = query.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchQuery)
          || product.category.toLowerCase().includes(searchQuery)
          || product.description.toLowerCase().includes(searchQuery)
        )
      })

  const handleAddToCart = (product: Product) => {
    addItem(String(product.id))
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-3xl transform divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                  placeholder="Search products..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {query !== '' && (
                <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                  {filteredProducts.length === 0
                    ? (
                        <div className="py-14 px-6 text-center text-sm sm:px-14">
                          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                          <p className="mt-4 font-semibold text-slate-900 dark:text-white">No products found</p>
                          <p className="mt-2 text-slate-500 dark:text-slate-400">
                            We couldn't find anything with that term. Please try again.
                          </p>
                        </div>
                      )
                    : (
                        <ul className="space-y-2">
                          {filteredProducts.map(product => (
                            <li key={product.id} className="group">
                              <div className="flex items-center gap-4 rounded-lg bg-slate-50 dark:bg-slate-800 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                <div className="flex-shrink-0 text-4xl">{product.image}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {product.description}
                                  </p>
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mt-2">
                                    {product.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                    {product.price}
                                  </span>
                                  <button
                                    onClick={() => {
                                      handleAddToCart(product)
                                      onClose()
                                    }}
                                    className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                </div>
              )}

              {query === '' && (
                <div className="py-14 px-6 text-center text-sm sm:px-14">
                  <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">Search our menu</p>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Find your favorite smoothies, protein meals, refreshers, and more
                  </p>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
