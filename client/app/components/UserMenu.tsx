"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverBackdrop
} from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    window.location.href = "/";
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isPending) {
    return (
      <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <Popover className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition focus:outline-none data-[hover]:text-emerald-600">
            <UserCircleIcon className="h-6 w-6" />
            <span className="hidden sm:inline text-sm font-semibold">
              {session.user.name}
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
              className="mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition duration-100 ease-out"
            >
              <div className="p-3">
                <div className="mb-3 px-3 py-2 bg-slate-50 rounded-md">
                  <p className="text-sm font-medium text-slate-900">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {session.user.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition"
                  >
                    My Orders
                  </Link>
                  <hr className="my-2 border-slate-200" />
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            </PopoverPanel>
          )}
        </>
      )}
    </Popover>
  );
}
