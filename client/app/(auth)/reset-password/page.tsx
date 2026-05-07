'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const token = searchParams.get('token')

  if (!token) {
    return (
      <div className="text-center max-w-sm">
        <p className="text-2xl font-bold text-red-600 mb-2">Invalid link</p>
        <p className="text-gray-600">
          This password reset link is invalid or has expired.
          {' '}
          <a href="/forgot-password" className="text-green-700 underline">Request a new one</a>
        </p>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    startTransition(async () => {
      const { error } = await authClient.resetPassword({ newPassword: password, token: token! })
      if (error) {
        setError(error.message ?? 'Reset failed')
        return
      }
      router.push('/login?reset=1')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Set new password</h1>
      <div>
        <label className="block text-sm font-medium mb-1">New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Set password'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p className="text-gray-500">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
