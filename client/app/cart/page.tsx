"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { optimisticItems, removeItem, updateQuantity, isPending, subtotal } = useCart();
  return (
    <>
      <Header />
      <main className="bg-white dark:bg-slate-950">
        <Container>
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Shopping Cart</h1>

            {optimisticItems.length === 0 ? (
              // Empty State
              <div className="mt-12 text-center">
                <ShoppingBagIcon className="mx-auto h-24 w-24 text-slate-300 dark:text-slate-700" />
                <h3 className="mt-6 text-lg font-medium text-slate-900 dark:text-white">Your cart is empty</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Start adding some delicious items to your cart!
                </p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            ) : (
              <form className="mt-12">
                <div>
                  <h2 className="sr-only">Items in your shopping cart</h2>

                  <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700 border-t border-b border-slate-200 dark:border-slate-700">
                    {optimisticItems.map((product, productIdx) => (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="shrink-0">
                        <div className="size-24 sm:size-32 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-5xl sm:text-6xl">
                          {product.imageSrc}
                        </div>
                      </div>

                      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div>
                          <div className="flex justify-between sm:grid sm:grid-cols-2">
                            <div className="pr-6">
                              <h3 className="text-sm">
                                <Link href="/products" className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white">
                                  {product.name}
                                </Link>
                              </h3>
                              {product.flavor && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.flavor}</p>}
                              {product.size && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.size}</p>}
                            </div>

                            <p className="text-right text-sm font-medium text-slate-900 dark:text-white">{product.price}</p>
                          </div>

                          <div className="mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block">
                            <div className="inline-grid w-full max-w-16 grid-cols-1">
                              <select
                                name={`quantity-${productIdx}`}
                                value={product.quantity}
                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                                aria-label={`Quantity, ${product.name}`}
                                disabled={isPending}
                                className="col-start-1 row-start-1 appearance-none rounded-md bg-white dark:bg-slate-800 py-1.5 pr-8 pl-3 text-base text-slate-900 dark:text-white outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-600 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 dark:focus:outline-emerald-500 sm:text-sm/6 disabled:opacity-50"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                              </select>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-slate-500 dark:text-slate-400 sm:size-4"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              disabled={isPending}
                              className="ml-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 sm:mt-3 sm:ml-0 disabled:opacity-50"
                            >
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500 dark:text-green-400" />
                          <span>Available for pickup</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order summary */}
              <div className="mt-10 sm:ml-32 sm:pl-6">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:p-6 lg:p-8 ring-1 ring-slate-200 dark:ring-slate-700">
                  <h2 className="sr-only">Order summary</h2>

                  <div className="flow-root">
                    <dl className="-my-4 divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-slate-600 dark:text-slate-400">Subtotal</dt>
                        <dd className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-slate-600 dark:text-slate-400">Tax (10%)</dt>
                        <dd className="font-medium text-slate-900 dark:text-white">${(subtotal * 0.1).toFixed(2)}</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-base font-medium text-slate-900 dark:text-white">Order total</dt>
                        <dd className="text-base font-medium text-slate-900 dark:text-white">${(subtotal * 1.1).toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-md border border-transparent bg-emerald-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950 focus:outline-hidden disabled:opacity-50"
                  >
                    Checkout
                  </button>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  <p>
                    or{' '}
                    <Link href="/products" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300">
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </form>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
