# Auth Completions Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.
> **Depends on:** plan-01-email-package (must be done first)

**Goal:** Enable email verification and password reset via Better Auth plugins, add the pages, and wire transactional emails.

**Architecture:** Better Auth has built-in `emailVerification` and `forgetPassword` plugin support. We enable them in `auth.ts`, create 4 new pages in the `(auth)` route group, and trigger order emails from existing server actions.

**Tech Stack:** Better Auth v1.4+, `@tayo/email`, Next.js App Router

---

### Task 1: Enable email verification in client auth

**Files:**
- Modify: `client/lib/auth.ts`

- [ ] Update `client/lib/auth.ts` — add `emailVerification` to the config:

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { getDb, schema } from '@tayo/database';
import { sendVerifyEmail, sendResetPasswordEmail } from '@tayo/email';

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerifyEmail(user.email, url);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  user: {
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'customer', input: false },
      phone: { type: 'string', required: false },
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_CLIENT_URL || '',
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
```

- [ ] Commit:
```bash
git add client/lib/auth.ts
git commit -m "feat(auth): enable email verification and password reset"
```

---

### Task 2: Verify email page

**Files:**
- Create: `client/app/(auth)/verify-email/page.tsx`

- [ ] Create `client/app/(auth)/verify-email/page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    authClient.verifyEmail({ query: { token } })
      .then(({ error }) => {
        if (error) { setStatus('error'); return; }
        setStatus('success');
        setTimeout(() => router.push('/account'), 2000);
      })
      .catch(() => setStatus('error'));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-sm">
        {status === 'loading' && <p className="text-gray-600">Verifying your email…</p>}
        {status === 'success' && (
          <>
            <p className="text-2xl font-bold text-green-700 mb-2">Email verified!</p>
            <p className="text-gray-600">Redirecting to your account…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-2xl font-bold text-red-600 mb-2">Verification failed</p>
            <p className="text-gray-600">The link may have expired. <a href="/login" className="text-green-700 underline">Go to login</a></p>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/(auth)/verify-email/page.tsx
git commit -m "feat(client): add email verification page"
```

---

### Task 3: Forgot password page

**Files:**
- Create: `client/app/(auth)/forgot-password/page.tsx`

- [ ] Create `client/app/(auth)/forgot-password/page.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });
      if (error) { setError(error.message ?? 'Something went wrong'); return; }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-2xl font-bold mb-2">Check your email</p>
          <p className="text-gray-600">We sent a reset link to <strong>{email}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
          {isPending ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-sm text-center"><a href="/login" className="text-green-700 underline">Back to login</a></p>
      </form>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add client/app/(auth)/forgot-password/page.tsx
git commit -m "feat(client): add forgot password page"
```

---

### Task 4: Reset password page

**Files:**
- Create: `client/app/(auth)/reset-password/page.tsx`

- [ ] Create `client/app/(auth)/reset-password/page.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get('token') ?? '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError('');
    startTransition(async () => {
      const { error } = await authClient.resetPassword({ newPassword: password, token });
      if (error) { setError(error.message ?? 'Reset failed'); return; }
      router.push('/login?reset=1');
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
          {isPending ? 'Saving…' : 'Set password'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] Add "Forgot password?" link to login page `client/app/(auth)/login/page.tsx` — find the form's submit button and add below it:
```tsx
<p className="text-sm text-center mt-2">
  <a href="/forgot-password" className="text-green-700 underline">Forgot password?</a>
</p>
```

- [ ] Commit:
```bash
git add client/app/(auth)/reset-password/page.tsx client/app/(auth)/login/page.tsx
git commit -m "feat(client): add reset password page and forgot password link"
```

---

### Task 5: Order confirmation email

**Files:**
- Modify: `client/app/checkout/actions.ts`

- [ ] In `client/app/checkout/actions.ts`, import and call `sendOrderConfirmation` inside `confirmOrder()` after setting status to `confirmed`. Find the `confirmOrder` function and add after the DB update:

```ts
import { sendOrderConfirmation } from '@tayo/email';

// Inside confirmOrder(), after updating order status:
const fullOrder = await db.query.orders.findFirst({
  where: eq(schema.orders.id, orderId),
  with: { orderItems: { with: { product: true } } },
});

if (fullOrder?.customerEmail) {
  await sendOrderConfirmation(fullOrder.customerEmail, {
    orderNumber: fullOrder.orderNumber,
    items: fullOrder.orderItems.map((i) => ({
      name: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    subtotal: fullOrder.subtotal,
    tax: fullOrder.tax,
    deliveryFee: fullOrder.deliveryFee,
    total: fullOrder.total,
    deliveryAddress: fullOrder.customerName ?? '',
  });
}
```

- [ ] Commit:
```bash
git add client/app/checkout/actions.ts
git commit -m "feat(client): send order confirmation email on checkout"
```

---

### Task 6: Order status update email from admin

**Files:**
- Modify: `admin/app/orders/[id]/order-status-form.tsx`

- [ ] In the order status form server action (or wherever status is updated), add email trigger for `out_for_delivery` and `delivered` statuses:

```ts
import { sendOrderStatusUpdate } from '@tayo/email';

// After updating order status in DB:
if (['out_for_delivery', 'delivered'].includes(newStatus)) {
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, orderId) });
  if (order?.customerEmail) {
    await sendOrderStatusUpdate(order.customerEmail, order.orderNumber, newStatus);
  }
}
```

- [ ] Commit:
```bash
git add admin/app/orders/[id]/order-status-form.tsx
git commit -m "feat(admin): send email on order status update"
```

---

### Task 7: Unverified banner on account page

**Files:**
- Modify: `client/app/account/page.tsx`

- [ ] Add at the top of the account page content (after fetching session):

```tsx
{!session?.user?.emailVerified && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between mb-6">
    <p className="text-sm text-yellow-800">Please verify your email address.</p>
    <button
      onClick={() => authClient.sendVerificationEmail({ email: session.user.email, callbackURL: '/account' })}
      className="text-sm text-yellow-700 underline"
    >
      Resend email
    </button>
  </div>
)}
```

- [ ] Commit:
```bash
git add client/app/account/page.tsx
git commit -m "feat(client): show unverified email banner on account page"
```
