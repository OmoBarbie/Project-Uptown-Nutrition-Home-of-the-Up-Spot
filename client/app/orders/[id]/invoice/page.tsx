'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

// Mock data - will be replaced with database query
function getOrderDetails(id: string) {
  const orders: Record<string, any> = {
    UN00001: {
      id: 'UN00001',
      number: 'UN00001',
      createdDate: 'December 12, 2024',
      createdDatetime: '2024-12-12',
      subtotal: 28.00,
      shipping: 0.00,
      tax: 2.80,
      total: 30.80,
      customer: {
        name: 'John Doe',
        email: 'customer@example.com',
      },
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
      products: [
        {
          id: 1,
          name: 'Protein Pancakes',
          description: 'Fluffy protein-packed pancakes',
          price: 10.00,
          quantity: 1,
          total: 10.00,
        },
        {
          id: 2,
          name: 'Strawberry Short Cake Smoothie',
          description: 'Creamy strawberry protein smoothie',
          price: 9.00,
          quantity: 2,
          total: 18.00,
        },
      ],
    },
    UN00002: {
      id: 'UN00002',
      number: 'UN00002',
      createdDate: 'December 8, 2024',
      createdDatetime: '2024-12-08',
      subtotal: 19.00,
      shipping: 0.00,
      tax: 1.90,
      total: 20.90,
      customer: {
        name: 'John Doe',
        email: 'customer@example.com',
      },
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
      products: [
        {
          id: 1,
          name: 'Watermelon Rush',
          description: 'Refreshing 32oz watermelon energy drink',
          price: 10.00,
          quantity: 1,
          total: 10.00,
        },
        {
          id: 2,
          name: 'Protein Coffee 24oz',
          description: 'High-protein iced coffee',
          price: 9.00,
          quantity: 1,
          total: 9.00,
        },
      ],
    },
  }

  return orders[id] || null
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const order = getOrderDetails(params.id)

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Invoice not found</h1>
            <Link
              href="/orders"
              className="mt-4 inline-block text-emerald-600 hover:text-emerald-500"
            >
              ← Back to orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header with print button */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/orders/${params.id}`}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ← Back to order
            </Link>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Print Invoice
            </button>
          </div>

          {/* Invoice */}
          <div className="bg-white border border-slate-200 rounded-lg p-8 sm:p-12">
            {/* Company Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">UP</span>
                  </div>
                  <span className="font-display text-xl font-bold text-slate-900">
                    Uptown Nutrition
                  </span>
                </div>
                <p className="text-sm text-slate-600">Healthy treats, meals, and snacks</p>
                <p className="text-sm text-slate-600">Los Angeles, CA</p>
                <p className="text-sm text-slate-600">contact@uptownnutrition.com</p>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-slate-900">INVOICE</h1>
                <p className="text-sm text-slate-600 mt-1">
                  #
                  {order.number}
                </p>
                <p className="text-sm text-slate-600">{order.createdDate}</p>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Bill To */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Bill To</h3>
                  <div className="mt-2 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                  </div>
                </div>

                {/* Ship To */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Ship To</h3>
                  <div className="mt-2 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}
                      ,
                      {order.shippingAddress.state}
                      {' '}
                      {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 text-sm font-semibold text-slate-900">Item</th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-900">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-900">Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.products.map((product: any) => (
                    <tr key={product.id}>
                      <td className="py-4">
                        <p className="text-sm font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-600">{product.description}</p>
                      </td>
                      <td className="text-right py-4 text-sm text-slate-600">{product.quantity}</td>
                      <td className="text-right py-4 text-sm text-slate-600">
                        $
                        {product.price.toFixed(2)}
                      </td>
                      <td className="text-right py-4 text-sm font-medium text-slate-900">
                        $
                        {product.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Subtotal</dt>
                  <dd className="font-medium text-slate-900">
                    $
                    {order.subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Shipping</dt>
                  <dd className="font-medium text-slate-900">
                    {order.shipping === 0
                      ? (
                          <span className="text-emerald-600">Free</span>
                        )
                      : (
                          `$${order.shipping.toFixed(2)}`
                        )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Tax (10%)</dt>
                  <dd className="font-medium text-slate-900">
                    $
                    {order.tax.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
                  <dt className="font-semibold text-slate-900">Total</dt>
                  <dd className="font-bold text-slate-900">
                    $
                    {order.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t border-slate-200 pt-8 text-center">
              <p className="text-sm text-slate-600">
                Thank you for your business!
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Questions? Contact us at contact@uptownnutrition.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Print styles */}
      <style jsx global>
        {`
        @media print {
          header,
          footer,
          nav,
          button {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}
      </style>
    </>
  )
}
