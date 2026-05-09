import { getAuthDb } from '@tayo/database'
import { sendResetPasswordEmail, sendVerifyEmail } from '@tayo/email'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  logger: {
    disabled: false,
    level: 'debug',
  },
  database: drizzleAdapter(getAuthDb(), {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }: { user: { email: string }, url: string }) => {
      await sendResetPasswordEmail(user.email, url)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }, url: string }) => {
      await sendVerifyEmail(user.email, url)
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false },
  },
  user: {
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'customer', input: false },
      phone: { type: 'string', required: false },
      isBanned: { type: 'boolean', required: false, defaultValue: false, input: false },
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    ...(process.env.NEXT_PUBLIC_CLIENT_URL ? [process.env.NEXT_PUBLIC_CLIENT_URL] : []),
  ],
  advanced: {
    cookiePrefix: 'tayo-client',
  },
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
