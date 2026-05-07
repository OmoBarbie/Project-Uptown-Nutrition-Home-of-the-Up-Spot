# Rate Limiting Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Add Upstash rate limiting to both client and admin middleware — 5 req/15min on auth routes, 60 req/min on public APIs.

**Architecture:** `@upstash/ratelimit` + `@upstash/redis` added to both apps. Rate limit logic runs inside existing `middleware.ts` files using IP from request headers.

**Tech Stack:** `@upstash/ratelimit`, `@upstash/redis`, Next.js middleware

---

### Task 1: Install dependencies

**Files:**
- Modify: `client/package.json`
- Modify: `admin/package.json`

- [ ] Add to `client/package.json` dependencies:
```json
"@upstash/ratelimit": "^2.0.0",
"@upstash/redis": "^1.34.0"
```

- [ ] Add to `admin/package.json` dependencies:
```json
"@upstash/ratelimit": "^2.0.0",
"@upstash/redis": "^1.34.0"
```

- [ ] Add to `.env.example`:
```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxx
```

- [ ] Run `bun install`

- [ ] Commit:
```bash
git add client/package.json admin/package.json .env.example bun.lock
git commit -m "chore: add Upstash rate limiting deps"
```

---

### Task 2: Rate limit helper

**Files:**
- Create: `client/lib/rate-limit.ts`
- Create: `admin/lib/rate-limit.ts`

Both files are identical. Create each:

- [ ] Create `client/lib/rate-limit.ts`:

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

export const authRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:auth',
});

export const apiRatelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'rl:api',
});
```

- [ ] Create `admin/lib/rate-limit.ts` with identical content.

- [ ] Commit:
```bash
git add client/lib/rate-limit.ts admin/lib/rate-limit.ts
git commit -m "feat: add Upstash rate limit helpers"
```

---

### Task 3: Wire into client middleware

**Files:**
- Modify: `client/middleware.ts`

- [ ] Replace contents of `client/middleware.ts`:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRatelimit, apiRatelimit } from '@/lib/rate-limit';

const protectedRoutes = ['/account', '/orders'];

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIp(request);

  // Rate limit auth endpoints
  if (pathname.startsWith('/api/auth')) {
    const { success, reset } = await authRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }
  }

  // Rate limit public API endpoints
  if (pathname.startsWith('/api/')) {
    const { success, reset } = await apiRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }
  }

  // Auth guard for protected routes
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    if (!sessionToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] Commit:
```bash
git add client/middleware.ts
git commit -m "feat(client): add Upstash rate limiting to middleware"
```

---

### Task 4: Wire into admin middleware

**Files:**
- Modify: `admin/lib/proxy.ts`

- [ ] Open `admin/lib/proxy.ts` and locate the exported middleware function. Add rate limiting at the top of the function before existing auth checks:

```ts
import { authRatelimit, apiRatelimit } from '@/lib/rate-limit';

// Add inside the middleware function, before existing logic:
const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

if (pathname.startsWith('/api/auth')) {
  const { success, reset } = await authRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
    );
  }
}

if (pathname.startsWith('/api/')) {
  const { success, reset } = await apiRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
    );
  }
}
```

- [ ] Commit:
```bash
git add admin/lib/proxy.ts
git commit -m "feat(admin): add Upstash rate limiting to middleware"
```

---

### Task 5: Verify

- [ ] Run `bun run build --filter client` — should compile with no errors
- [ ] Run `bun run build --filter admin` — should compile with no errors
- [ ] If Upstash env vars are missing, builds still succeed (runtime error only when limits are hit)
