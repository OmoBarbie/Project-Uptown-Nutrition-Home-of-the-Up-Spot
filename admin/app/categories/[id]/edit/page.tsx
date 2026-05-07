import { notFound } from 'next/navigation';
import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { CategoryForm } from '../../category-form';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const category = await db.query.categories.findFirst({ where: eq(schema.categories.id, id) });
  if (!category) notFound();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
