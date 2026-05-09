import type { NextRequest } from 'next/server'
import { getDb, schema } from '@tayo/database'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?unsubscribe=invalid', request.url))
  }

  const db = getDb()
  const subscriber = await db.query.newsletterSubscribers.findFirst({
    where: eq(schema.newsletterSubscribers.unsubscribeToken, token),
  })

  if (!subscriber) {
    return NextResponse.redirect(new URL('/?unsubscribe=invalid', request.url))
  }

  if (subscriber.unsubscribedAt) {
    return NextResponse.redirect(new URL('/?unsubscribe=already', request.url))
  }

  await db.update(schema.newsletterSubscribers)
    .set({ unsubscribedAt: new Date() })
    .where(eq(schema.newsletterSubscribers.id, subscriber.id))

  return NextResponse.redirect(new URL('/?unsubscribe=success', request.url))
}
