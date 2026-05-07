'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createCategory(formData: FormData) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  const name = (formData.get('name') as string).trim();
  const slug = (formData.get('slug') as string).trim() || slugify(name);
  const description = formData.get('description') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'on';

  const [category] = await db.insert(schema.categories).values({
    name, slug, description, imageUrl, sortOrder, isActive,
  }).returning();

  await createAuditLog(session.user.id, {
    action: 'create', entityType: 'category', entityId: category.id, changes: { name },
  });

  revalidatePath('/categories');
  redirect('/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  const name = (formData.get('name') as string).trim();
  const slug = (formData.get('slug') as string).trim() || slugify(name);
  const description = formData.get('description') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'on';

  await db.update(schema.categories)
    .set({ name, slug, description, imageUrl, sortOrder, isActive, updatedAt: new Date() })
    .where(eq(schema.categories.id, id));

  await createAuditLog(session.user.id, {
    action: 'update', entityType: 'category', entityId: id, changes: { name, slug, isActive },
  });

  revalidatePath('/categories');
  redirect('/categories');
}

export async function deleteCategory(id: string) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) redirect('/login');

  const products = await db.query.products.findMany({
    where: eq(schema.products.categoryId, id),
    columns: { id: true },
  });

  if (products.length > 0) {
    await db.update(schema.categories).set({ isActive: false }).where(eq(schema.categories.id, id));
  } else {
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
  }

  await createAuditLog(session.user.id, {
    action: 'delete', entityType: 'category', entityId: id, changes: {},
  });

  revalidatePath('/categories');
}
