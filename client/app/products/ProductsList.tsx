"use client";

import { StarIcon } from '@heroicons/react/20/solid';
import { useCart } from "@/app/context/CartContext";

type ProductVariant = {
  id: string;
  name: string;
  type: string;
  priceModifier: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  emoji: string;
  category: string;
  categorySlug: string;
  isFeatured: boolean;
  variants: ProductVariant[];
  rating: {
    average: number;
    count: number;
  };
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type ProductsListProps = {
  products: Product[];
  categories: Category[];
};

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function ProductsList({ products, categories }: ProductsListProps) {
  const { addItem } = useCart();
  const allCategories = ['All', ...categories.map(c => c.name)];

  return (
    <>
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
        {allCategories.map((category) => (
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

        <div className="-mx-px grid grid-cols-2 auto-rows-auto border-l border-slate-200 dark:border-slate-700 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative border-r border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors grid [grid-template-rows:subgrid] [grid-row:span_10]"
              style={{
                display: 'grid',
                gridTemplateRows: 'subgrid',
                gridRow: 'span 10',
              }}
            >
              {/* Product Image/Emoji */}
              <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {product.emoji}
              </div>

              {/* Product Name */}
              <h3 className="mt-6 text-sm font-medium text-slate-900 dark:text-white text-center">
                {product.name}
              </h3>

              {/* Category Badge */}
              <div className="mt-2 text-center">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {product.category}
                </span>
              </div>

              {/* Variants Badge */}
              <div className="mt-2 text-center min-h-[1.5rem]">
                {product.variants.length > 0 && (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {product.variants.length} {product.variants[0].type}s
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 text-center">
                {product.description}
              </p>

              {/* Rating Stars */}
              <div className="mt-3 flex justify-center">
                <p className="sr-only">{product.rating.average} out of 5 stars</p>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating.average > rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Review Count */}
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center">
                {product.rating.count} reviews
              </p>

              {/* Price */}
              <p className="mt-4 text-base font-medium text-slate-900 dark:text-white text-center">
                ${product.price}
              </p>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem({
                    id: parseInt(product.id),
                    name: product.name,
                    price: `$${product.price}`,
                    imageSrc: product.emoji,
                    imageAlt: product.name,
                  });
                }}
                className="relative z-10 mt-4 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
              >
                Add to Cart
              </button>
            </article>
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
    </>
  );
}
