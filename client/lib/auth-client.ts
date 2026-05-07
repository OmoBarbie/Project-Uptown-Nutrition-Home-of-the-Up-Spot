'use client'

import { createAuthClient } from 'better-auth/react'
import { mergeGuestCart } from '@/app/actions/cart'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
  fetchOptions: {
    onSuccess: async (ctx) => {
      // Merge guest cart after sign-in
      if (ctx.response.url?.includes('/sign-in')) {
        const sessionId = document.cookie
          .split('; ')
          .find(r => r.startsWith('cart_session_id='))
          ?.split('=')[1]
        if (sessionId) {
          const session = ctx.data as { user?: { id: string } }
          if (session?.user?.id) {
            await mergeGuestCart(session.user.id, sessionId)
          }
        }
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession, $Infer } = authClient
