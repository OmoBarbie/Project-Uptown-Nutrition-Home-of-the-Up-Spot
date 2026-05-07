'use client'

import type { UrlObject } from 'node:url'
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import { range } from '@setemiojo/utils'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

import Link from 'next/link'
import { useState } from 'react'
import { UserMenu } from '@/app/components/UserMenu'
import { useCart } from '@/app/context/CartContext'
import { Container } from '@/components/Container'

const SearchModal = dynamic(() =>
  import('@/components/SearchModal').then(m => m.SearchModal), { ssr: false })

function MobileNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <PopoverButton
      as={Link}
      href={href as unknown as UrlObject}
      className="block w-full py-3 px-2 text-sm font-medium text-foreground/80 hover:text-forest transition-colors border-b border-sand last:border-0"
    >
      {children}
    </PopoverButton>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-foreground"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0',
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0',
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-2 bg-background border border-sand shadow-xl data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <div className="px-4 py-2">
          <MobileNavLink href="/products">Products</MobileNavLink>
          <MobileNavLink href="/upspot">The Up Spot</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
          <MobileNavLink href="/cart">Cart</MobileNavLink>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

function ShoppingCartIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

export function Header() {
  const { totalItems } = useCart()
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <>
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Announcement ticker */}
      <div className="bg-forest-600 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee">
          {range(4).map(i => (
            <span key={i} className="inline-flex items-center gap-6 px-8 text-xs tracking-[0.18em] uppercase text-cream-100 font-medium">
              <span>Fresh Daily</span>
              <span className="text-terracotta-300">·</span>
              <span>Nutritionist Approved</span>
              <span className="text-terracotta-300">·</span>
              <span>Chicago-Made</span>
              <span className="text-terracotta-300">·</span>
              <span>Free Delivery $50+</span>
              <span className="text-terracotta-300">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-sand">
        <Container>
          <nav className="relative flex h-16 justify-between items-center">
            {/* Logo + nav */}
            <div className="flex items-center gap-x-10">
              <Link
                href="/"
                aria-label="Home"
                className="flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded-full bg-forest-600 flex items-center justify-center shrink-0 group-hover:bg-forest-700 transition-colors">
                  <span className="text-cream-100 text-[10px] font-bold tracking-wider">
                    UP
                  </span>
                </div>
                <span className="font-display text-base font-semibold tracking-[0.15em] uppercase text-charcoal group-hover:text-forest transition-colors">
                  Uptown Nutrition
                </span>
              </Link>

              <div className="hidden md:flex md:gap-x-8">
                {[
                  { href: '/products', label: 'Products' },
                  { href: '/upspot', label: 'The Up Spot' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm font-medium text-foreground/60 hover:text-forest transition-colors tracking-wide"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-x-4 md:gap-x-5">
              <button
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search"
                className="hidden md:block text-foreground/50 hover:text-forest transition-colors"
              >
                <SearchIcon className="h-5 w-5 stroke-current" />
              </button>

              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="relative text-foreground/50 hover:text-forest transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5 stroke-current" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-terracotta-500 text-cream-100 text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <div className="hidden md:block">
                <UserMenu />
              </div>

              <div className="-mr-1 md:hidden">
                <MobileNavigation />
              </div>
            </div>
          </nav>
        </Container>
      </header>
    </>
  )
}
