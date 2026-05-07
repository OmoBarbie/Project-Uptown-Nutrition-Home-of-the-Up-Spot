'use client'

import { useState, useTransition } from 'react'
import { applyCoupon } from './coupon-actions'

interface Props {
  subtotal: number
  onApply: (discount: number, code: string) => void
}

export function CouponInput({ subtotal, onApply }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [applied, setApplied] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleApply() {
    if (!code.trim())
      return
    setError('')
    startTransition(async () => {
      const result = await applyCoupon(code, subtotal)
      if ('error' in result) {
        setError(result.error)
        return
      }
      setApplied(`${result.couponCode} — ${result.type === 'percentage' ? `${result.value}% off` : `$${result.value} off`}`)
      onApply(result.discount, result.couponCode)
    })
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm">
        <span className="text-green-700">{applied}</span>
        <button
          type="button"
          onClick={() => {
            setApplied('')
            onApply(0, '')
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 border rounded-md px-3 py-2 text-sm uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending}
          className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
        >
          {isPending ? '…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}
