# Authentication Setup with Better Auth

## Overview

The client app uses [Better Auth](https://www.better-auth.com/) for authentication, which provides:
- Email/password authentication
- Session management
- TypeScript-first API
- Drizzle ORM integration

## Features Implemented

✅ Email/password registration
✅ Email/password login
✅ Session management (7-day sessions)
✅ Protected routes (middleware)
✅ User menu with account dropdown
✅ Sign out functionality
✅ Redirect to login for protected pages

## Database Tables

Better Auth uses these tables (automatically created):
- `session` - User sessions
- `account` - Authentication accounts
- `verification` - Email verification tokens (future)

These work alongside the existing `users` table from our schema.

## Environment Variables

Add to your `.env` file:

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_CLIENT_URL="http://localhost:3000"
```

Generate a secret with:
```bash
openssl rand -base64 32
```

## Database Setup

1. **Push schema** (includes Better Auth tables):
   ```bash
   bun run db:push
   ```

2. **Seed database** (creates test users):
   ```bash
   bun run db:seed
   ```

## Test Users

After seeding, you can login with:

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

**Admin Account:**
- Email: `admin@uptownnutrition.com`
- Password: `admin123`

## Usage

### Client-Side (React Components)

```typescript
import { useSession, signOut } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome {session.user.name}!</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

### Server-Side (API Routes, Server Actions)

```typescript
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json({ user: session.user });
}
```

## Protected Routes

Routes that require authentication are defined in `middleware.ts`:

```typescript
const protectedRoutes = ["/account", "/orders"];
```

Users will be redirected to `/login` if they try to access these pages without being logged in.

## Pages

- `/login` - Sign in page
- `/signup` - Registration page
- `/account` - User account settings (protected)
- `/orders` - User order history (protected)

## Components

- `AuthForms.tsx` - Sign in and sign up forms
- `UserMenu.tsx` - User dropdown menu in header
- `Header.tsx` - Updated to show auth status

## API Routes

- `/api/auth/[...all]` - All Better Auth endpoints
  - POST `/api/auth/sign-in/email` - Email login
  - POST `/api/auth/sign-up/email` - Email registration
  - POST `/api/auth/sign-out` - Sign out
  - GET `/api/auth/get-session` - Get current session

## Configuration

See `client/lib/auth.ts` for auth configuration:

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Enable in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
});
```

## Security Features

1. **Session tokens** stored in HTTP-only cookies
2. **Password hashing** handled by Better Auth
3. **CSRF protection** built-in
4. **Session expiration** after 7 days
5. **Protected routes** via middleware

## Production Checklist

Before deploying to production:

- [ ] Set `requireEmailVerification: true`
- [ ] Set up email service (Resend, SendGrid, etc.)
- [ ] Generate strong `BETTER_AUTH_SECRET`
- [ ] Set `BETTER_AUTH_URL` to production domain
- [ ] Configure CORS for trusted origins
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up password reset flow
- [ ] Add two-factor authentication (optional)

## Email Verification (Future)

To enable email verification:

1. Configure email provider in `lib/auth.ts`:
```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  sendVerificationEmail: async ({ user, url }) => {
    // Send email with verification link
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `Click here to verify: ${url}`,
    });
  },
},
```

2. Add email service credentials to `.env`

## Troubleshooting

### "Session not found" error
- Clear cookies and try again
- Check `DATABASE_URL` is correct
- Verify auth tables exist in database

### Infinite redirect loop
- Check middleware configuration
- Verify `BETTER_AUTH_URL` matches your app URL
- Check protected routes array

### Type errors
- Run `bun install` to get latest types
- Restart TypeScript server in your editor

## Resources

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Drizzle Adapter Docs](https://www.better-auth.com/docs/adapters/drizzle)
