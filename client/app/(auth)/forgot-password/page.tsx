'use client'

import { useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: '/reset-password',
      })
      if (error) {
        setError(error.message ?? 'Something went wrong')
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-2xl font-bold mb-2">Check your email</p>
          <p className="text-gray-600">
            We sent a reset link to
            {` `}
            <strong>{email}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
          {isPending ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-sm text-center"><a href="/login" className="text-green-700 underline">Back to login</a></p>
      </form>
    </div>
  )
}
