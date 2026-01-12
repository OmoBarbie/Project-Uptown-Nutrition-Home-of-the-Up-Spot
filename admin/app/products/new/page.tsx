import { ProductForm } from '../product-form';
import { createProduct } from '../actions';
import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { asc } from 'drizzle-orm';

export default async function NewProductPage() {
  const db = getDb();
  const categories = await db.select().from(schema.categories).where(schema.categories.isActive).orderBy(asc(schema.categories.sortOrder));

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a new product for your store
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-lg p-6">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
