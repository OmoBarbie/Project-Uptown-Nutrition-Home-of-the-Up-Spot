'use client'

import { useState, useTransition } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const result = await subscribeToNewsletter(email)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      }
      else {
        setMessage({ type: 'success', text: 'You\'re subscribed! Check your inbox for a welcome email.' })
        setEmail('')
      }
    })
  }

  return (
    <div>
      <p className="text-sm text-cream-100/40 mb-6 leading-relaxed">
        Exclusive menu items, nutrition tips, and special offers —
        delivered to your inbox.
      </p>
      <form className="flex gap-0" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 min-w-0 bg-cream-100/8 border border-cream-100/15 px-4 py-3 text-sm text-cream-100 placeholder:text-cream-100/25 focus:outline-none focus:border-terracotta-400 transition-colors"
          required
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-terracotta-500 text-cream-100 text-sm font-semibold tracking-wide hover:bg-terracotta-400 transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {isPending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-xs ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}
      {!message && (
        <p className="mt-3 text-xs text-cream-100/25">
          We respect your privacy. Unsubscribe anytime.
        </p>
      )}
    </div>
  )
}
