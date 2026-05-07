# Email Package Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans`.

**Goal:** Create `@tayo/email` workspace with Resend + React Email templates used by both client and admin apps.

**Architecture:** New Bun workspace at `/email`. Exports typed `send*` helpers. Templates are React Email components. Both `client` and `admin` import from `@tayo/email`.

**Tech Stack:** `resend`, `@react-email/components`, React Email, TypeScript, Bun workspaces

---

### Task 1: Create email workspace

**Files:**
- Create: `email/package.json`
- Create: `email/tsconfig.json`
- Modify: `package.json` (root) — add `"email"` to workspaces

- [ ] Create `email/package.json`:

```json
{
  "name": "@tayo/email",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.31",
    "react": "^19.2.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19"
  }
}
```

- [ ] Create `email/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

- [ ] Add `"email"` to root `package.json` workspaces array:

```json
"workspaces": ["admin", "client", "components", "database", "email"]
```

- [ ] Install deps: `bun install`

- [ ] Commit:
```bash
git add email/package.json email/tsconfig.json package.json bun.lock
git commit -m "chore: add @tayo/email workspace"
```

---

### Task 2: Resend client + send helpers

**Files:**
- Create: `email/src/index.ts`
- Create: `email/src/send.ts`

- [ ] Create `email/src/index.ts`:

```ts
import { Resend } from 'resend';

let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set');
    client = new Resend(key);
  }
  return client;
}

export const FROM = process.env.RESEND_FROM_EMAIL ?? 'Tayo <no-reply@tayo.store>';
```

- [ ] Create `email/src/send.ts`:

```ts
import { getResend, FROM } from './index';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { VerifyEmailTemplate } from './templates/verify-email';
import { ResetPasswordTemplate } from './templates/reset-password';
import { OrderStatusUpdateEmail } from './templates/order-status-update';
import { RefundNotificationEmail } from './templates/refund-notification';

export async function sendVerifyEmail(to: string, url: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Verify your Tayo account',
    react: VerifyEmailTemplate({ url }),
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Reset your Tayo password',
    react: ResetPasswordTemplate({ url }),
  });
}

export async function sendOrderConfirmation(to: string, order: {
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: string }[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Order confirmed — #${order.orderNumber}`,
    react: OrderConfirmationEmail(order),
  });
}

export async function sendOrderStatusUpdate(to: string, orderNumber: string, status: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Your order #${orderNumber} has been ${status}`,
    react: OrderStatusUpdateEmail({ orderNumber, status }),
  });
}

export async function sendRefundNotification(to: string, orderNumber: string, amount: string, reason: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Refund processed for order #${orderNumber}`,
    react: RefundNotificationEmail({ orderNumber, amount, reason }),
  });
}
```

- [ ] Commit:
```bash
git add email/src/index.ts email/src/send.ts
git commit -m "feat(email): add Resend client and typed send helpers"
```

---

### Task 3: Email templates

**Files:**
- Create: `email/src/templates/verify-email.tsx`
- Create: `email/src/templates/reset-password.tsx`
- Create: `email/src/templates/order-confirmation.tsx`
- Create: `email/src/templates/order-status-update.tsx`
- Create: `email/src/templates/refund-notification.tsx`

- [ ] Create `email/src/templates/verify-email.tsx`:

```tsx
import { Html, Head, Body, Container, Text, Button, Preview } from '@react-email/components';

export function VerifyEmailTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Tayo account</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Verify your email</Text>
          <Text>Click the button below to verify your Tayo account.</Text>
          <Button href={url} style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 6, display: 'inline-block' }}>
            Verify Email
          </Button>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Link expires in 24 hours. If you didn't create an account, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] Create `email/src/templates/reset-password.tsx`:

```tsx
import { Html, Head, Body, Container, Text, Button, Preview } from '@react-email/components';

export function ResetPasswordTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Tayo password</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Reset your password</Text>
          <Text>Click the button below to choose a new password.</Text>
          <Button href={url} style={{ background: '#16a34a', color: '#fff', padding: '12px 24px', borderRadius: 6, display: 'inline-block' }}>
            Reset Password
          </Button>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Link expires in 1 hour. If you didn't request this, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] Create `email/src/templates/order-confirmation.tsx`:

```tsx
import { Html, Head, Body, Container, Text, Preview, Hr } from '@react-email/components';

interface Props {
  orderNumber: string;
  items: { name: string; quantity: number; unitPrice: string }[];
  subtotal: string;
  tax: string;
  deliveryFee: string;
  total: string;
  deliveryAddress: string;
}

export function OrderConfirmationEmail({ orderNumber, items, subtotal, tax, deliveryFee, total, deliveryAddress }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Order #{orderNumber} confirmed</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Order Confirmed!</Text>
          <Text>Order #{orderNumber}</Text>
          <Hr />
          {items.map((item, i) => (
            <Text key={i}>{item.quantity}x {item.name} — ${item.unitPrice}</Text>
          ))}
          <Hr />
          <Text>Subtotal: ${subtotal}</Text>
          <Text>Tax: ${tax}</Text>
          <Text>Delivery: ${deliveryFee}</Text>
          <Text style={{ fontWeight: 700 }}>Total: ${total}</Text>
          <Hr />
          <Text style={{ color: '#6b7280' }}>Delivering to: {deliveryAddress}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] Create `email/src/templates/order-status-update.tsx`:

```tsx
import { Html, Head, Body, Container, Text, Preview } from '@react-email/components';

export function OrderStatusUpdateEmail({ orderNumber, status }: { orderNumber: string; status: string }) {
  const messages: Record<string, string> = {
    out_for_delivery: 'Your order is on its way!',
    delivered: 'Your order has been delivered. Enjoy!',
  };
  return (
    <Html>
      <Head />
      <Preview>Update on order #{orderNumber}</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Order Update</Text>
          <Text>Order #{orderNumber}</Text>
          <Text>{messages[status] ?? `Status updated to: ${status}`}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] Create `email/src/templates/refund-notification.tsx`:

```tsx
import { Html, Head, Body, Container, Text, Preview } from '@react-email/components';

export function RefundNotificationEmail({ orderNumber, amount, reason }: { orderNumber: string; amount: string; reason: string }) {
  return (
    <Html>
      <Head />
      <Preview>Refund processed for order #{orderNumber}</Preview>
      <Body style={{ fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>Refund Processed</Text>
          <Text>A refund of ${amount} for order #{orderNumber} has been processed.</Text>
          <Text style={{ color: '#6b7280' }}>Reason: {reason.replace('_', ' ')}</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Funds typically appear in 5-10 business days.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] Commit:
```bash
git add email/src/templates/
git commit -m "feat(email): add React Email templates"
```

---

### Task 4: Wire @tayo/email into client and admin

**Files:**
- Modify: `client/package.json` — add `@tayo/email` dependency
- Modify: `admin/package.json` — add `@tayo/email` dependency

- [ ] Add to `client/package.json` dependencies:
```json
"@tayo/email": "workspace:*"
```

- [ ] Add to `admin/package.json` dependencies:
```json
"@tayo/email": "workspace:*"
```

- [ ] Add to `.env.example` and both apps' env:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Tayo <no-reply@yourdomain.com>
```

- [ ] Remove from `.env.example`:
```
# Remove these lines:
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

- [ ] Run `bun install` to link workspace

- [ ] Commit:
```bash
git add client/package.json admin/package.json .env.example bun.lock
git commit -m "chore: wire @tayo/email into client and admin"
```
