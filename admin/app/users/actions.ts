'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createAuditLog } from '@/lib/audit';

export async function updateUserRole(userId: string, formData: FormData) {
  const role = formData.get('role') as 'customer' | 'admin' | 'super_admin';
  if (!role || !['customer', 'admin', 'super_admin'].includes(role)) throw new Error('Invalid role');

  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session || session.user.role !== 'super_admin') throw new Error('Unauthorized');

  await db.update(schema.users).set({ role, updatedAt: new Date() }).where(eq(schema.users.id, userId));
  await createAuditLog(session.user.id, {
    action: 'update',
    entityType: 'user',
    entityId: userId,
    changes: { after: { role } },
  });
  revalidatePath('/users');
}

export async function toggleBan(userId: string, isBanned: boolean) {
  const db = getDb();
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error('Unauthorized');

  await db.update(schema.users).set({ isBanned, updatedAt: new Date() }).where(eq(schema.users.id, userId));
  await createAuditLog(session.user.id, {
    action: 'update',
    entityType: 'user',
    entityId: userId,
    changes: { after: { isBanned } },
  });
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}
