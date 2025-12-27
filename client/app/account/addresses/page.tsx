"use client";

import { useSession } from "@/lib/auth-client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import Link from "next/link";

export default function AddressesPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null; // Middleware will redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Saved Addresses
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Manage your delivery addresses for faster checkout.
                </p>
              </div>
              <Link
                href="/account"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                ← Back to account
              </Link>
            </div>

            <div className="mt-10">
              <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl p-8 text-center">
                <p className="text-slate-600">No saved addresses yet.</p>
                <button className="mt-4 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                  Add New Address
                </button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
