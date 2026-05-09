'use client'

import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'
import { TAX_RATE } from '@/lib/constants'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function CartPage() {
  const { optimisticItems, removeItem, updateQuantity, isPending, subtotal } = useCart()
  return (
    <>
      <Header />
      <main className="bg-background">
        <Container>
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

            {/* Page heading */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-terracotta-500" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-terracotta-500">Your Order</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-medium text-charcoal leading-[0.92]">
              Shopping Cart
            </h1>

            {optimisticItems.length === 0
              ? (
                  <div className="mt-16 text-center">
                    <ShoppingBagIcon className="mx-auto h-20 w-20 text-foreground/20" />
                    <h3 className="mt-6 font-display text-2xl font-medium text-charcoal">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-foreground/60">
                      Start adding some delicious items to your cart!
                    </p>
                    <div className="mt-8">
                      <Link
                        href="/products"
                        className="inline-flex items-center bg-forest-600 text-cream-100 px-6 py-3 text-sm font-semibold hover:bg-forest-700 transition-colors focus:outline-none"
                      >
                        Browse Products
                      </Link>
                    </div>
                  </div>
                )
              : (
                  <form className="mt-12">
                    <div>
                      <h2 className="sr-only">Items in your shopping cart</h2>

                      <ul role="list" className="divide-y divide-sand border-t border-b border-sand">
                        {optimisticItems.map(product => (
                          <li key={product.id} className="flex py-6 sm:py-10">
                            <div className="shrink-0">
                              <div className="size-24 sm:size-32 bg-card border border-sand flex items-center justify-center text-5xl sm:text-6xl">
                                {product.imageSrc}
                              </div>
                            </div>

                            <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                              <div>
                                <div className="flex justify-between sm:grid sm:grid-cols-2">
                                  <div className="pr-6">
                                    <h3 className="text-sm">
                                      <Link href="/products" className="font-medium text-charcoal hover:text-forest-600 transition-colors">
                                        {product.name}
                                      </Link>
                                    </h3>
                                  </div>

                                  <p className="text-right text-sm font-medium text-charcoal">{product.price}</p>
                                </div>

                                <div className="mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block">
                                  <div className="inline-grid w-full max-w-16 grid-cols-1">
                                    <select
                                      name={`quantity-${product.id}`}
                                      value={product.quantity}
                                      onChange={e => updateQuantity(product.id, Number.parseInt(e.target.value))}
                                      aria-label={`Quantity, ${product.name}`}
                                      disabled={isPending}
                                      className="col-start-1 row-start-1 appearance-none border border-sand bg-background text-charcoal py-1.5 pr-8 pl-3 text-sm focus:outline-none focus:border-forest-600 transition-colors disabled:opacity-50"
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
                                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-foreground/40 sm:size-4"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeItem(product.id)}
                                    disabled={isPending}
                                    className="ml-4 text-sm font-medium text-foreground/40 hover:text-charcoal transition-colors sm:mt-3 sm:ml-0 disabled:opacity-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              <p className="mt-4 flex space-x-2 text-sm text-foreground/60">
                                <span className="text-forest-600">✓</span>
                                <span>Available for pickup</span>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order summary */}
                    <div className="mt-10 sm:ml-32 sm:pl-6">
                      <div className="bg-card border border-sand px-4 py-6 sm:p-6 lg:p-8">
                        <h2 className="font-display text-lg font-medium text-charcoal mb-4">Order Summary</h2>

                        <div className="flow-root">
                          <dl className="-my-4 divide-y divide-sand text-sm">
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-foreground/60">Subtotal</dt>
                              <dd className="font-medium text-charcoal">
                                $
                                {subtotal.toFixed(2)}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-foreground/60">
                                Tax (
                                {(TAX_RATE * 100).toFixed(0)}
                                %)
                              </dt>
                              <dd className="font-medium text-charcoal">
                                $
                                {(subtotal * TAX_RATE).toFixed(2)}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-base font-semibold text-charcoal">Order total</dt>
                              <dd className="text-base font-semibold text-charcoal">
                                $
                                {(subtotal * (1 + TAX_RATE)).toFixed(2)}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link
                          href="/checkout"
                          className="block w-full bg-forest-600 text-cream-100 px-4 py-4 text-base font-semibold text-center hover:bg-forest-700 transition-colors focus:outline-none"
                        >
                          Proceed to Checkout
                        </Link>
                      </div>

                      <div className="mt-6 text-center text-sm text-foreground/50">
                        <p>
                          or
                          {' '}
                          <Link href="/products" className="font-medium text-forest-600 hover:text-forest-700 transition-colors">
                            Continue Shopping →
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
  )
}
