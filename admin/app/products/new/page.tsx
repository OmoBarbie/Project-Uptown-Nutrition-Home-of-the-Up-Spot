import { ProductForm } from '../product-form';
import { createProduct } from '../actions';
import { getDb, schema } from '@tayo/database';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { asc, eq } from 'drizzle-orm';

export default async function NewProductPage() {
  const db = getDb();
  const categories = await db.select().from(schema.categories).where(eq(schema.categories.isActive, true)).orderBy(asc(schema.categories.sortOrder));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/products" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14 }} />
          Back to Products
        </Link>
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Create a new product for your store</p>
      </div>

      <div className="card-padded">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
