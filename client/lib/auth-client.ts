'use client'

import { createAuthClient } from 'better-auth/react'
import { mergeGuestCart } from '@/app/actions/cart'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
  fetchOptions: {
    onSuccess: async (ctx) => {
      const url = ctx.response.url ?? ''
      if (!url.endsWith('/sign-in/email'))
        return
      try {
        const sessionId = document.cookie
          .split('; ')
          .find(r => r.startsWith('cart_session_id='))
          ?.split('=')[1]
        const session = ctx.data as { user?: { id: string } }
        if (sessionId && session?.user?.id) {
          await mergeGuestCart(session.user.id, sessionId)
        }
      }
      catch (e) {
        console.error('[auth-client] mergeGuestCart failed silently:', e)
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession, $Infer } = authClient
