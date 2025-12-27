"use client";

import { useSession } from "@/lib/auth-client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import Link from "next/link";

export default function SecurityPage() {
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
                  Security Settings
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Manage your password and security preferences.
                </p>
              </div>
              <Link
                href="/account"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                ← Back to account
              </Link>
            </div>

            <div className="mt-10 space-y-8">
              {/* Change Password */}
              <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                  <h2 className="text-base font-semibold leading-7 text-slate-900">
                    Change Password
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Update your password to keep your account secure.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-slate-900">
                        Current Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-slate-900">
                        New Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-slate-900">
                        Confirm New Password
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-6 mt-6">
                      <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
