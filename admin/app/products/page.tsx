import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DeleteProductButton } from './delete-button';

async function getProducts() {
  const db = getDb();

  const products = await db
    .select()
    .from(schema.products)
    .orderBy(schema.products.createdAt);

  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your product inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/products/new"
            className="inline-flex items-center gap-x-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                Product
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Category
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Price
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Stock
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-2xl">
                      {product.emoji}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-slate-500 text-sm line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                    {product.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                  ${parseFloat(product.price).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                  {product.stock}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center justify-end gap-x-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="inline-flex items-center gap-x-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">No products found</p>
            <Link
              href="/products/new"
              className="mt-4 inline-flex items-center gap-x-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
