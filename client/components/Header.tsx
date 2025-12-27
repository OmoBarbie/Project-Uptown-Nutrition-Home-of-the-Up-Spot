"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { UrlObject } from "url";
import { useCart } from "@/app/context/CartContext";
import { SearchModal } from "@/components/SearchModal";
import { UserMenu } from "@/app/components/UserMenu";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <PopoverButton as={Link} href={href as unknown as UrlObject} className="block w-full p-2">
      {children}
    </PopoverButton>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
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
        className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="#products">Products</MobileNavLink>
        {/*<MobileNavLink href="#features">Features</MobileNavLink>
        <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>*/}
        <MobileNavLink href="/about">About</MobileNavLink>
        <MobileNavLink href="/contact">Contact</MobileNavLink>
        <hr className="m-2 border-slate-300/40" />
        <MobileNavLink href="/cart">Cart</MobileNavLink>
      </PopoverPanel>
    </Popover>
  );
}

function ShoppingCartIcon(props: React.ComponentPropsWithoutRef<"svg">) {
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
  );
}

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
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
  );
}

export function Header() {
  const { totalItems } = useCart();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <header className="py-10 border-b border-slate-100">
        <Container>
          <nav className="relative z-50 flex justify-between items-center">
          <div className="flex items-center md:gap-x-12">
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">UP</span>
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-teal-500">u</span>
                <span className="text-pink-500">p</span>
                <span className="text-lime-500">t</span>
                <span className="text-orange-500">o</span>
                <span className="text-teal-500">w</span>
                <span className="text-pink-500">n</span>
                <span className="text-slate-700"> nutrition</span>
              </span>
            </Link>
            <div className="hidden md:flex md:gap-x-8">
              <Link
                href="/products"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
              >
                Products
              </Link>
              {/*<Link
                href="#features"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
              >
                Testimonials
              </Link>*/}
              <Link
                href="/about"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search"
              className="hidden md:block text-slate-600 hover:text-emerald-600 transition"
            >
              <SearchIcon className="h-6 w-6 stroke-current" />
            </button>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative text-slate-600 hover:text-emerald-600 transition"
            >
              <ShoppingCartIcon className="h-6 w-6 stroke-current" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
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
  );
}
