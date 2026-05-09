/**
 * Creates (or resets) the admin user so it can log in via Better Auth.
 *
 * Better Auth stores passwords in the `account` table — not `users.password_hash`.
 * Uses dynamic imports so DATABASE_URL is patched BEFORE any db/auth module loads.
 *
 * Usage: bun run create-admin
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Step 1: load env vars BEFORE any database/auth module is imported
config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local') })

// Step 2: strip channel_binding — breaks neon-serverless WebSocket pool
// in Node.js script environments (works fine in edge/serverless)
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/[&?]channel_binding=[^&]*/g, '')
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uptownnutrition.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = 'Admin User'

async function createAdmin() {
  // Step 3: dynamic imports so database singleton picks up the patched URL
  const [{ getDb, schema }, { eq }, { auth }] = await Promise.all([
    import('@tayo/database'),
    import('drizzle-orm'),
    import('../lib/auth'),
  ])

  const db = getDb()

  console.log(`\n👤 Creating admin user: ${ADMIN_EMAIL}\n`)

  // Remove any existing user + account rows so we start fresh
  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, ADMIN_EMAIL))
    .limit(1)

  if (existing) {
    console.log('  Found existing user — removing stale rows...')
    await db.delete(schema.account).where(eq(schema.account.userId, existing.id))
    await db.delete(schema.users).where(eq(schema.users.id, existing.id))
  }

  // Better Auth's server API hashes the password and inserts both
  // the `users` row and the `account` (credential) row atomically
  const result = await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
  })

  if (!result?.user?.id) {
    console.error('  ❌ signUpEmail returned no user:', result)
    process.exit(1)
  }

  // Promote to admin (Better Auth defaults to the role configured as defaultValue)
  await db
    .update(schema.users)
    .set({ role: 'admin', emailVerified: true })
    .where(eq(schema.users.id, result.user.id))

  console.log(`  ✅ Admin created successfully`)
  console.log(`     ID:       ${result.user.id}`)
  console.log(`     Email:    ${ADMIN_EMAIL}`)
  console.log(`     Password: ${ADMIN_PASSWORD}`)
  console.log(`     Role:     admin\n`)

  process.exit(0)
}

createAdmin().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
