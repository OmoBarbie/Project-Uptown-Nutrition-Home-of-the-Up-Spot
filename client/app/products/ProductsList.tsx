'use client'

import { StarIcon } from '@heroicons/react/20/solid'
import { isTruthy } from '@setemiojo/utils'
import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'

interface ProductVariant {
  id: string
  name: string
  type: string
  priceModifier: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: string
  emoji: string
  category: string
  categorySlug: string
  isFeatured: boolean
  variants: ProductVariant[]
  rating: {
    average: number
    count: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface ProductsListProps {
  products: Product[]
  categories: Category[]
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(isTruthy).join(' ')
}

export function ProductsList({ products, categories: _categories }: ProductsListProps) {
  const { addItem } = useCart()

  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-terracotta-500" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Our menu</span>
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-medium text-charcoal leading-[0.92]">
          Full Menu
        </h1>
        <p className="mt-4 text-base text-foreground/60 max-w-xl">
          Browse our complete selection of nutritious smoothies, protein-packed treats, and energising refreshers.
        </p>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl overflow-hidden">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-sand sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <article
              key={product.id}
              className="group relative border-r border-b border-sand p-4 sm:p-6 hover:bg-cream-50 transition-colors grid [grid-template-rows:subgrid] [grid-row:span_10]"
              style={{
                display: 'grid',
                gridTemplateRows: 'subgrid',
                gridRow: 'span 10',
              }}
            >
              <Link href={`/products/${product.id}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
              {/* Product Image/Emoji */}
              <div className="aspect-square bg-sand/30 flex items-center justify-center text-6xl">
                {product.emoji}
              </div>

              {/* Product Name */}
              <h3 className="mt-4 text-sm font-medium text-charcoal text-center">
                {product.name}
              </h3>

              {/* Category Badge */}
              <div className="mt-1 text-center">
                <span className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Variants Badge */}
              <div className="mt-2 text-center min-h-[1.5rem]">
                {product.variants.length > 0 && (
                  <span className="text-xs text-charcoal/50 text-center">
                    {product.variants.length}
                    {' '}
                    {product.variants[0].type}
                    s
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-2 text-xs text-charcoal/60 text-center">
                {product.description}
              </p>

              {/* Rating Stars */}
              <div className="mt-3 flex justify-center">
                <p className="sr-only">
                  {product.rating.average}
                  {' '}
                  out of 5 stars
                </p>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map(rating => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating.average > rating ? 'text-yellow-400' : 'text-sand',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Review Count */}
              <p className="mt-1 text-sm text-charcoal/50 text-center">
                {product.rating.count}
                {' '}
                reviews
              </p>

              {/* Price */}
              <p className="mt-3 font-display text-lg text-charcoal text-center">
                $
                {product.price}
              </p>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addItem(product.id)
                }}
                className="relative z-10 mt-4 w-full bg-forest-600 px-4 py-2.5 text-sm font-medium text-cream hover:bg-forest-700 transition-colors"
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-16 border border-sand p-8 text-center">
        <p className="font-display text-2xl text-charcoal">Over 30 Smoothie Flavors</p>
        <p className="mt-2 text-sm text-charcoal/60">Visit us in store to see our complete menu and daily specials</p>
      </div>
    </>
  )
}
