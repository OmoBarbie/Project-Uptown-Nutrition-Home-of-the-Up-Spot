'use client'

import Link from 'next/link'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useSession } from '@/lib/auth-client'

export default function AddressesPage() {
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
                  Saved Addresses
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
              <div className="border border-sand p-12 text-center">
                <h2 className="font-display text-2xl text-charcoal mb-2">No saved addresses</h2>
                <p className="text-sm text-charcoal/60 mb-6">
                  Manage your delivery addresses for faster checkout.
                </p>
                <button className="bg-forest-600 text-cream px-4 py-2.5 text-sm font-medium hover:bg-forest-700 transition-colors">
                  Add New Address
                </button>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  )
}
