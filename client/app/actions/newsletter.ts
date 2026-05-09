'use server'

import { getDb, schema } from '@tayo/database'
import { sendNewsletterWelcome } from '@tayo/email'
import { eq } from 'drizzle-orm'

export async function subscribeToNewsletter(email: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address' }
  }

  const db = getDb()

  const existing = await db.query.newsletterSubscribers.findFirst({
    where: eq(schema.newsletterSubscribers.email, email.toLowerCase()),
  })

  if (existing) {
    if (!existing.unsubscribedAt) {
      return { error: 'This email is already subscribed' }
    }
    // Re-subscribe: clear the unsubscribedAt timestamp
    await db.update(schema.newsletterSubscribers)
      .set({ unsubscribedAt: null })
      .where(eq(schema.newsletterSubscribers.id, existing.id))
  }
  else {
    await db.insert(schema.newsletterSubscribers).values({ email: email.toLowerCase() })
  }

  const subscriber = await db.query.newsletterSubscribers.findFirst({
    where: eq(schema.newsletterSubscribers.email, email.toLowerCase()),
  })

  if (subscriber) {
    const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://localhost:3000'
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
    try {
      await sendNewsletterWelcome(email, unsubscribeUrl)
    }
    catch {
      // Don't fail the subscription if email send fails
    }
  }

  return { success: true }
}
