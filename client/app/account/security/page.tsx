'use client'

import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useSession } from '@/lib/auth-client'

export default function SecurityPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-sand w-1/4 mb-8"></div>
              <div className="h-4 bg-sand w-1/2 mb-4"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    )
  }

  if (!session) {
    return null // Middleware will redirect
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
              <div className="flex items-start justify-between">
                <h1 className="font-display text-5xl sm:text-6xl font-medium text-charcoal leading-[0.92]">
                  Security
                </h1>
                <Link
                  href="/account"
                  className="text-sm text-charcoal/60 hover:text-charcoal mt-2"
                >
                  ← Account
                </Link>
              </div>
            </div>
          </Container>
        </div>

        {/* Content area */}
        <div className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <div className="space-y-8">
                {/* Change Password */}
                <div className="border border-sand p-6 sm:p-8">
                  <h2 className="font-display text-2xl text-charcoal mb-1">
                    Change Password
                  </h2>
                  <p className="text-sm text-charcoal/60 mb-6">
                    Update your password to keep your account secure.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="block w-full border border-sand px-3 py-2 text-sm text-charcoal bg-background focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="block w-full border border-sand px-3 py-2 text-sm text-charcoal bg-background focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-charcoal/60 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="block w-full border border-sand px-3 py-2 text-sm text-charcoal bg-background focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-x-6 mt-6">
                      <button
                        type="button"
                        className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-forest-600 text-cream px-4 py-2.5 text-sm font-medium hover:bg-forest-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
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
