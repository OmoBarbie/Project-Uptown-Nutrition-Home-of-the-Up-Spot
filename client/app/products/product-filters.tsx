'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
  currentQ: string
  currentCategory: string
  currentSort: string
}

export function ProductFilters({ categories, currentQ, currentCategory, currentSort }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    }
    else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => router.push(`/products?${params.toString()}`))
  }, [router, searchParams])

  return (
    <div className="flex flex-wrap gap-4 items-center mb-8 border-b border-sand pb-6">
      <input
        type="search"
        defaultValue={currentQ}
        placeholder="Search products…"
        onChange={(e) => {
          const v = e.target.value
          const timer = setTimeout(updateParam, 300, 'q', v)
          return () => clearTimeout(timer)
        }}
        className="border border-sand px-3 py-2 text-sm w-52 focus:outline-none focus:ring-1 focus:ring-forest-600"
      />

      <div className="flex gap-0 overflow-x-auto">
        <button
          onClick={() => updateParam('category', '')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${!currentCategory ? 'border-forest-600 text-forest-600' : 'border-transparent text-charcoal/60 hover:text-charcoal hover:border-sand'}`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => updateParam('category', c.slug)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${currentCategory === c.slug ? 'border-forest-600 text-forest-600' : 'border-transparent text-charcoal/60 hover:text-charcoal hover:border-sand'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <select
        value={currentSort}
        onChange={e => updateParam('sort', e.target.value)}
        className="border border-sand px-2 py-2 text-sm ml-auto bg-background focus:outline-none focus:ring-1 focus:ring-forest-600"
      >
        <option value="">Sort: Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  )
}
