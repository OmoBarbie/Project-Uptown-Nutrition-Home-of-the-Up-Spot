'use client'

import { useState } from 'react'
import { useCart } from '@/app/context/CartContext'

interface Props {
  productId: string
  variantId: string | null
  maxQuantity: number
}

export function AddToCartButton({ productId, variantId, maxQuantity }: Props) {
  const { addItem, isPending } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    await addItem(productId, variantId, quantity)
    setAdded(true)
    setTimeout(setAdded, 2000, false)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-md">
        <button
          type="button"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          −
        </button>
        <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={isPending || maxQuantity === 0}
        onClick={handleAdd}
        className="flex-1 bg-green-600 text-white py-2 px-6 rounded-md font-medium disabled:opacity-50 hover:bg-green-700 transition-colors"
      >
        {isPending ? 'Adding…' : added ? 'Added!' : maxQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
