"use client";

import { useSession, authClient } from "@/lib/auth-client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { updateProfile, type UpdateProfileState } from "./actions";
import { SubmitButton } from "./submit-button";

const initialState: UpdateProfileState = {
  success: undefined,
  message: undefined,
  errors: undefined,
};

function AccountContent() {
  const { data: session, isPending, refetch } = useSession();
  const [state, formAction] = useActionState(updateProfile, initialState);

  // Refetch session when profile is updated successfully
  useEffect(() => {
    if (state.success) {
      // Force session refetch to get updated user data
      refetch();
    }
  }, [state.success, refetch]);

  if (isPending) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-16">
          <Container>
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Account Settings
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your account information and preferences.
            </p>

            <div className="mt-10 space-y-8">
              {/* Email Verification Banner */}
              {!session?.user?.emailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between mb-6">
                  <p className="text-sm text-yellow-800">Please verify your email address.</p>
                  <button
                    onClick={() => authClient.sendVerificationEmail({ email: session.user.email, callbackURL: '/account' })}
                    className="text-sm text-yellow-700 underline"
                  >
                    Resend email
                  </button>
                </div>
              )}

              {/* Success/Error Message */}
              {state.message && (
                <div
                  className={`rounded-md p-4 ${
                    state.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <p className="text-sm font-medium">{state.message}</p>
                </div>
              )}

              {/* Profile Information */}
              <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
                <form action={formAction}>
                  <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-base font-semibold leading-7 text-slate-900">
                          Profile Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Your personal information and contact details.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            key={`name-${session.user.id}`}
                            defaultValue={session.user.name}
                            required
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        {state.errors?.name && (
                          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={session.user.email}
                            disabled
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 bg-slate-50 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">
                          Phone number
                        </label>
                        <div className="mt-2">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            key={session.user.id}
                            defaultValue={(session.user as any).phone || ""}
                            placeholder="(555) 123-4567"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        {state.errors?.phone && (
                          <p className="mt-1 text-sm text-red-600">{state.errors.phone[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="reset"
                        className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <SubmitButton />
                    </div>
                  </div>
                </form>
              </div>

              {/* Quick Links */}
              <div className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
                <div className="px-4 py-6 sm:p-8">
                  <h2 className="text-base font-semibold leading-7 text-slate-900 mb-4">
                    Quick Links
                  </h2>
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="block px-4 py-3 rounded-md hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">Order History</span>
                        <span className="text-sm text-slate-600">→</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">View your past orders and reorder items</p>
                    </Link>
                    <Link
                      href="/account/addresses"
                      className="block px-4 py-3 rounded-md hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">Saved Addresses</span>
                        <span className="text-sm text-slate-600">→</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Manage your delivery addresses</p>
                    </Link>
                    <Link
                      href="/account/security"
                      className="block px-4 py-3 rounded-md hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">Security</span>
                        <span className="text-sm text-slate-600">→</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Change password and security settings</p>
                    </Link>
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

export default function AccountPage() {
  return <AccountContent />;
}
