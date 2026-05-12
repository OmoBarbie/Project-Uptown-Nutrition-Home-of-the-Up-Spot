import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { apiRatelimit, authRatelimit } from '@/lib/rate-limit'

const protectedRoutes = ['/account', '/orders']

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? '127.0.0.1'
  )
}

async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getIp(request)

  // Rate limit auth endpoints
  if (pathname.startsWith('/api/auth')) {
    const { success, reset } = await authRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } },
      )
    }
  }
  // Rate limit public API endpoints
  else if (pathname.startsWith('/api/')) {
    const { success, reset } = await apiRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } },
      )
    }
  }

  // Auth guard for protected routes — cookie prefix must match auth.ts cookiePrefix
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r))
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('tayo-client.session_token')?.value
    if (!sessionToken) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export default middleware

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
