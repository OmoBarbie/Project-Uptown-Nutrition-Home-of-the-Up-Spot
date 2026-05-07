'use server'

import { getDb, schema } from '@tayo/database'
import { eq } from 'drizzle-orm'

export async function applyCoupon(code: string, subtotal: number): Promise<
  { discount: number, couponCode: string, type: string, value: string } | { error: string }
> {
  if (!code.trim())
    return { error: 'Please enter a coupon code' }

  const db = getDb()
  const coupon = await db.query.coupons.findFirst({
    where: eq(schema.coupons.code, code.toUpperCase().trim()),
  })

  if (!coupon)
    return { error: 'Invalid coupon code' }
  if (!coupon.isActive)
    return { error: 'This coupon is no longer active' }

  const value = Number.parseFloat(coupon.value)
  const discount = coupon.type === 'percentage'
    ? Math.min(subtotal * (value / 100), subtotal)
    : Math.min(value, subtotal)

  return {
    discount: Math.round(discount * 100) / 100,
    couponCode: coupon.code,
    type: coupon.type,
    value: coupon.value,
  }
}
