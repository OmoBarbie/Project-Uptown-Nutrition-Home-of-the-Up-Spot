'use client'

import type { UpdateProfileState } from './actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useOptimistic, useState, useTransition } from 'react'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { authClient, useSession } from '@/lib/auth-client'
import { updateProfile } from './actions'
import { SubmitButton } from './submit-button'

const initialState: UpdateProfileState = {
  success: undefined,
  message: undefined,
  errors: undefined,
}

function VerificationBanner({ email }: { email: string }) {
  const [sent, setSent] = useState(false)
  const [resendError, setResendError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleResend() {
    setResendError('')
    startTransition(async () => {
      const { error } = await authClient.sendVerificationEmail({ email, callbackURL: '/account' })
      if (error) {
        setResendError('Failed to send. Please try again.')
        return
      }
      setSent(true)
    })
  }

  return (
    <div className="border border-sand bg-sand/30 p-4 flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-charcoal">Please verify your email address.</p>
        {resendError && <p className="text-xs text-terracotta-600 mt-1">{resendError}</p>}
      </div>
      {sent
        ? (
            <span className="text-sm text-charcoal/60">Sent!</span>
          )
        : (
            <button
              onClick={handleResend}
              disabled={isPending}
              className="text-sm text-forest-600 underline disabled:opacity-50"
            >
              {isPending ? 'Sending…' : 'Resend email'}
            </button>
          )}
    </div>
  )
}

function AccountContent() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const [state, formAction] = useActionState(updateProfile, initialState)
  const [optimisticName, setOptimisticName] = useOptimistic(
    session?.user?.name ?? '',
    (_: string, next: string) => next,
  )

  const handleFormAction = (formData: FormData) => {
    const newName = (formData.get('name') as string)?.trim()
    if (newName)
      setOptimisticName(newName)
    formAction(formData)
  }

  const userId = session?.user?.id ?? null
  useEffect(() => {
    if (!isPending && !userId) {
      router.push('/login?callbackUrl=/account')
    }
  // eslint-disable-next-line react/exhaustive-deps
  }, [isPending, userId])

  // Refetch session when profile is updated successfully
  useEffect(() => {
    if (state.success) {
      refetch()
    }
  }, [state.success, refetch])

  if (isPending) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-sand w-1/4 mb-8"></div>
              <div className="h-4 bg-sand w-1/2 mb-4"></div>
              <div className="h-4 bg-sand w-1/3"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero section */}
        <div className="bg-background border-b border-sand pt-20 pb-12">
          <Container>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-terracotta-500" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">My account</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-medium text-charcoal leading-[0.92]">
                Account Settings
              </h1>
              <p className="mt-2 font-display text-2xl text-charcoal/50 italic">
                {optimisticName}
              </p>
              <p className="mt-3 text-foreground/60 text-base">
                Manage your profile and preferences.
              </p>
            </div>
          </Container>
        </div>

        {/* Content area */}
        <div className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <div className="space-y-8">
                {/* Email Verification Banner */}
                {!session?.user?.emailVerified && (
                  <VerificationBanner email={session.user.email} />
                )}

                {/* Success/Error Message */}
                {state.message && (
                  <div
                    className={`p-4 text-sm ${
                      state.success
                        ? 'border border-forest-600 bg-forest-50 text-forest-800'
                        : 'border border-terracotta-500 bg-terracotta-50 text-terracotta-800'
                    }`}
                  >
                    <p>{state.message}</p>
                  </div>
                )}

                {/* Profile Information */}
                <div className="border border-sand p-6 sm:p-8">
                  <h2 className="font-display text-2xl text-charcoal mb-1">
                    Profile Information
                  </h2>
                  <p className="text-sm text-charcoal/60 mb-6">
                    Your personal information and contact details.
                  </p>
                  <form action={handleFormAction}>
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                          Full name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          key={`name-${session.user.id}`}
                          defaultValue={session.user.name}
                          required
                          className="block w-full border border-sand px-3 py-2 text-sm text-charcoal bg-background focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600"
                        />
                        {state.errors?.name && (
                          <p className="mt-1 text-sm text-terracotta-600">{state.errors.name[0]}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={session.user.email}
                          disabled
                          className="block w-full border border-sand px-3 py-2 text-sm bg-sand/30 text-charcoal/40"
                        />
                        <p className="mt-1 text-xs text-charcoal/60">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          key={session.user.id}
                          defaultValue={(session.user as any).phone || ''}
                          placeholder="(555) 123-4567"
                          className="block w-full border border-sand px-3 py-2 text-sm text-charcoal bg-background focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600"
                        />
                        {state.errors?.phone && (
                          <p className="mt-1 text-sm text-terracotta-600">{state.errors.phone[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="reset"
                        className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
                      >
                        Cancel
                      </button>
                      <SubmitButton />
                    </div>
                  </form>
                </div>

                {/* Quick Links */}
                <div className="border border-sand divide-y divide-sand">
                  <div className="px-6 py-4">
                    <h2 className="font-display text-2xl text-charcoal">
                      Quick Links
                    </h2>
                  </div>
                  <Link
                    href="/orders"
                    className="block px-6 py-4 hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal">Order History</span>
                      <span className="text-forest-600">→</span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">View your past orders and reorder items</p>
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="block px-6 py-4 hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal">Saved Addresses</span>
                      <span className="text-forest-600">→</span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">Manage your delivery addresses</p>
                  </Link>
                  <Link
                    href="/account/security"
                    className="block px-6 py-4 hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal">Security</span>
                      <span className="text-forest-600">→</span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">Change password and security settings</p>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function AccountPage() {
  return <AccountContent />
}
