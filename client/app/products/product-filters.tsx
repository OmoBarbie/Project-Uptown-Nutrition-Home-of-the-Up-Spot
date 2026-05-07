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
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <input
        type="search"
        defaultValue={currentQ}
        placeholder="Search products…"
        onChange={(e) => {
          const v = e.target.value
          const timer = setTimeout(updateParam, 300, 'q', v)
          return () => clearTimeout(timer)
        }}
        className="border rounded-md px-3 py-2 text-sm w-52"
      />

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => updateParam('category', '')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${!currentCategory ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => updateParam('category', c.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentCategory === c.slug ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <select
        value={currentSort}
        onChange={e => updateParam('sort', e.target.value)}
        className="border rounded-md px-2 py-2 text-sm ml-auto"
      >
        <option value="">Sort: Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  )
}
