'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    () => searchParams.get('token') ? 'loading' : 'error',
  )

  useEffect(() => {
    let cancelled = false
    const token = searchParams.get('token')
    if (!token) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>
    authClient.verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (cancelled)
          return
        if (error) {
          setStatus('error')
          return
        }
        setStatus('success')
        timeoutId = setTimeout(() => router.push('/account'), 2000)
      })
      .catch(() => {
        if (!cancelled)
          setStatus('error')
      })
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [searchParams, router])

  return (
    <div className="text-center max-w-sm">
      {status === 'loading' && <p className="text-gray-600">Verifying your email…</p>}
      {status === 'success' && (
        <>
          <p className="text-2xl font-bold text-green-700 mb-2">Email verified!</p>
          <p className="text-gray-600">Redirecting to your account…</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="text-2xl font-bold text-red-600 mb-2">Verification failed</p>
          <p className="text-gray-600">
            The link may have expired.
            {' '}
            <a href="/login" className="text-green-700 underline">Go to login</a>
          </p>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p className="text-gray-500">Loading…</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
