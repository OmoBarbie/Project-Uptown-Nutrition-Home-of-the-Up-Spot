'use server';

import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCoupon(formData: FormData) {
  const db = getDb();
  const code = (formData.get('code') as string).toUpperCase().trim();
  const type = formData.get('type') as 'flat' | 'percentage';
  const value = formData.get('value') as string;

  if (!code || !type || !value) throw new Error('All fields required');

  await db.insert(schema.coupons).values({ code, type, value, isActive: true });
  revalidatePath('/coupons');
  redirect('/coupons');
}

export async function toggleCoupon(id: string, isActive: boolean) {
  const db = getDb();
  await db.update(schema.coupons).set({ isActive, updatedAt: new Date() }).where(eq(schema.coupons.id, id));
  revalidatePath('/coupons');
}
