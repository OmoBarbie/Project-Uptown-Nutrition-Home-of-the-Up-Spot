import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { CategoryForm } from '../../category-form';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const category = await db.query.categories.findFirst({ where: eq(schema.categories.id, id) });
  if (!category) notFound();
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/categories" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14 }} />
          Back to Categories
        </Link>
        <h1 className="page-title">Edit Category</h1>
      </div>
      <div className="card-padded" style={{ maxWidth: 560 }}>
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
