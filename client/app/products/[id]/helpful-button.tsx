'use client'

import { useState, useTransition } from 'react'
import { markReviewHelpful } from './actions'

interface Props {
  reviewId: string
  initialCount: number
  initialVoted: boolean
  isLoggedIn: boolean
}

export function HelpfulButton({ reviewId, initialCount, initialVoted, isLoggedIn }: Props) {
  const [isPending, startTransition] = useTransition()
  const [voted, setVoted] = useState(initialVoted)
  const [count, setCount] = useState(initialCount)

  function handleClick() {
    if (voted || isPending || !isLoggedIn)
      return
    // Optimistic update immediately — persists after transition
    setVoted(true)
    setCount(c => c + 1)
    startTransition(async () => {
      const result = await markReviewHelpful(reviewId, true)
      if (result?.error) {
        // Revert on failure
        setVoted(false)
        setCount(c => c - 1)
      }
    })
  }

  if (!isLoggedIn) {
    return (
      <span className="text-xs text-charcoal/40 mt-2 block">
        {count > 0 ? `${count} found this helpful` : ''}
      </span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={voted || isPending}
      className={`text-xs mt-2 flex items-center gap-1.5 transition-colors ${
        voted ? 'text-forest-600 cursor-default' : 'text-charcoal/50 hover:text-forest-600'
      } disabled:opacity-60`}
    >
      <span>👍</span>
      <span>
        {voted ? 'Helpful' : 'Found this helpful'}
        {count > 0 && ` (${count})`}
      </span>
    </button>
  )
}
