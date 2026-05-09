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
      <div className="flex items-center justify-between border border-forest-200 bg-forest-50 px-3 py-2.5 text-sm">
        <span className="text-forest-700 font-medium">{applied}</span>
        <button
          type="button"
          onClick={() => {
            setApplied('')
            onApply(0, '')
          }}
          className="text-foreground/40 hover:text-charcoal transition-colors"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
          placeholder="COUPON CODE"
          className="flex-1 border border-sand bg-background text-charcoal px-3 py-2.5 text-sm uppercase placeholder:text-foreground/30 placeholder:normal-case focus:outline-none focus:border-forest-600 transition-colors"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending}
          className="border border-sand bg-card text-charcoal px-4 py-2.5 text-sm font-semibold hover:bg-sand transition-colors disabled:opacity-50"
        >
          {isPending ? '…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
