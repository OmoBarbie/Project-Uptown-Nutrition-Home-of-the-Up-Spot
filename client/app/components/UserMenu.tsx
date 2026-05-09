'use client'

import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from '@/lib/auth-client'

function UserAvatar({ image, name, email, size = 28 }: { image?: string | null, name?: string | null, email?: string | null, size?: number }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : email
      ? email[0].toUpperCase()
      : '?'

  if (image) {
    return (
      // eslint-disable-next-line next/no-img-element
      <img
        src={image}
        alt={name ?? email ?? 'User'}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-1 ring-sand"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-full bg-forest-600 flex items-center justify-center text-cream-100 font-bold shrink-0 ring-1 ring-forest-500"
    >
      {initials}
    </div>
  )
}

export function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.refresh()
    router.push('/')
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current)
      clearTimeout(timeoutRef.current)
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(setIsHovering, 200, false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
    }
  }, [])

  if (isPending) {
    return <div className="h-7 w-7 animate-pulse rounded-full bg-sand" />
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-foreground/60 hover:text-forest transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="text-sm font-semibold text-cream-100 bg-forest-600 hover:bg-forest-700 px-3 py-1.5 transition-colors"
        >
          Sign up
        </Link>
      </div>
    )
  }

  const displayName = session.user.name || session.user.email?.split('@')[0] || 'Account'

  return (
    <Popover className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-2 text-foreground/70 hover:text-forest transition-colors focus:outline-none">
            <UserAvatar
              image={session.user.image}
              name={session.user.name}
              email={session.user.email}
              size={28}
            />
            <span className="hidden sm:inline text-sm font-medium">
              {displayName}
            </span>
          </PopoverButton>

          <PopoverBackdrop
            transition
            className="fixed inset-0 bg-black/10 duration-100 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
          />

          {(open || isHovering) && (
            <PopoverPanel
              static
              anchor="bottom end"
              className="mt-2 w-56 origin-top-right bg-background border border-sand shadow-lg transition duration-100 ease-out"
            >
              <div className="p-3">
                <div className="mb-3 px-3 py-2.5 bg-cream-50 border border-sand flex items-center gap-3">
                  <UserAvatar
                    image={session.user.image}
                    name={session.user.name}
                    email={session.user.email}
                    size={36}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{displayName}</p>
                    <p className="text-xs text-foreground/50 truncate">{session.user.email}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-sm text-foreground/70 hover:bg-cream-50 hover:text-forest transition-colors"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-sm text-foreground/70 hover:bg-cream-50 hover:text-forest transition-colors"
                  >
                    My Orders
                  </Link>
                  <hr className="my-1.5 border-sand" />
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </PopoverPanel>
          )}
        </>
      )}
    </Popover>
  )
}
