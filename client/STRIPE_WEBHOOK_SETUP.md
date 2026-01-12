# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks for local development and production.

## What Are Webhooks?

Webhooks are how Stripe notifies your app about payment events (successful payments, refunds, etc.). They're essential for:
- Confirming orders after successful payments
- Handling failed payments
- Processing refunds
- Updating order statuses

## Local Development Setup

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### 3. Forward Webhooks to Local Server

```bash
# Start your Next.js dev server first
bun run dev

# In a new terminal, forward webhooks
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

### 4. Copy Webhook Secret

The CLI will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy this secret and add it to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

### 5. Test the Webhook

Trigger a test event:
```bash
stripe trigger payment_intent.succeeded
```

Check your terminal logs to see if the webhook was received.

## Production Setup

### 1. Deploy Your App

Make sure your app is deployed to production (Vercel, etc.).

### 2. Create Webhook Endpoint in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`

5. Click **"Add endpoint"**

### 3. Get Webhook Signing Secret

1. Click on your newly created webhook endpoint
2. Click **"Reveal"** under "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to your production environment variables:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
   ```

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Order confirmed, payment succeeded |
| `payment_intent.payment_failed` | Order payment failed |
| `payment_intent.canceled` | Order cancelled |
| `charge.refunded` | Order refunded |

## Testing Webhooks

### Test with Stripe CLI

```bash
# Successful payment
stripe trigger payment_intent.succeeded

# Failed payment
stripe trigger payment_intent.payment_failed

# Canceled payment
stripe trigger payment_intent.canceled

# Refund
stripe trigger charge.refunded
```

### Test with Real Payments

Use Stripe test cards:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

**Decline:**
- Card: `4000 0000 0000 0002`

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct
2. Verify signing secret matches
3. Check server logs for errors
4. Ensure webhook endpoint is publicly accessible (production)

### Signature Verification Fails

1. Make sure you're using the raw request body
2. Verify the signing secret is correct
3. Check the Stripe-Signature header is being passed

### Events Not Processing

1. Check database connection
2. Verify order exists with the payment_intent_id
3. Review server logs for specific errors

## Security Notes

- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Never skip signature verification
- ✅ Keep webhook secrets secure
- ✅ Log all webhook events for debugging

## Monitoring

Monitor your webhooks in the Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View **Recent events** tab
4. Check success/failure rates

## Need Help?

- Stripe Webhook Docs: https://stripe.com/docs/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Test Mode: https://dashboard.stripe.com/test/webhooks
- Production: https://dashboard.stripe.com/webhooks
