# Stripe Identity Setup - Quick Start

This guide will help you set up and test Stripe Identity integration for ID verification in sandbox mode.

## What Was Implemented

Stripe Identity has been integrated into **Step 2 of the verification flow** (`/dashboard/verify`). Users can now:

- **Scan their ID** (driver's license, passport, or state ID) to automatically fill address and SSN
- **Verify identity** with selfie matching and liveness detection
- **Fallback to manual entry** if verification fails or is canceled

### Key Features

✅ One-click ID scanning with "Scan My ID" button
✅ Auto-populates address fields from scanned ID
✅ Auto-populates SSN last 4 digits
✅ Supports 120+ country documents
✅ Liveness detection prevents fake IDs
✅ Manual entry fallback always available
✅ Real-time status updates via webhooks

---

## Quick Setup (5 minutes)

### 1. Get Stripe Test Credentials

1. Sign up for Stripe: https://dashboard.stripe.com/register
2. Go to **Developers** > **API Keys**: https://dashboard.stripe.com/test/apikeys
3. Copy your **Secret key** (starts with `sk_test_`)
4. Copy your **Publishable key** (starts with `pk_test_`)

### 2. Add Credentials to `.env.local`

Edit `.env.local` in the project root:

```bash
# Stripe Test Mode Credentials
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhook secret (get this in step 3)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 3. Set Up Webhooks (Optional but Recommended)

**Option A: Use Stripe CLI (Recommended for local testing)**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Forward webhooks (keep this running)
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Copy the webhook signing secret (whsec_...) to .env.local
```

**Option B: Skip webhooks for now**

Webhooks are optional for testing. The integration will work without them, but you won't see real-time webhook logs.

### 4. Restart Dev Server

```bash
npm run dev
```

---

## Testing the Integration

### Test Flow

1. Go to http://localhost:3000
2. Click **Get Started** and complete signup
3. Navigate to **Dashboard** > Click **Verify Your Identity**
4. Complete Step 1 (Personal Info)
5. On **Step 2**, click **"Scan My ID"** button

You'll be redirected to Stripe's hosted verification page.

### Using Test Documents

On the Stripe verification page:

1. Select document type: **Driver's License**
2. Click **Use test document**
3. Select **US Driver's License (Success)**
4. For selfie, click **Use test image**
5. Complete verification

**Result**: You'll be redirected back to Step 2 with address fields auto-populated:
- Street: `123 Main Street`
- City: `Springfield`
- State: `IL`
- ZIP: `62701`
- SSN Last 4: `6789`

---

## File Structure

### Backend API Routes

```
app/api/stripe/
├── identity/
│   ├── create-session/route.ts   # Create verification session
│   └── retrieve-session/route.ts # Get verification results
└── webhooks/route.ts              # Handle Stripe events
```

### Frontend Integration

```
app/dashboard/verify/page.tsx      # Step 2 with Stripe Identity button
lib/stripe.ts                       # Stripe SDK initialization
```

### Documentation

```
docs/05-integrations/
├── STRIPE_IDENTITY_IMPLEMENTATION_PLAN.md  # Complete architecture
└── STRIPE_IDENTITY_TESTING_GUIDE.md        # Detailed testing guide
```

---

## Troubleshooting

### Error: "STRIPE_SECRET_KEY is not set"

**Solution**: Add `STRIPE_SECRET_KEY` to `.env.local` and restart server:

```bash
npm run dev
```

### Error: "Missing Stripe signature"

**Solution**: Either:
1. Add `STRIPE_WEBHOOK_SECRET` to `.env.local`, OR
2. Comment out webhook signature verification (for testing only)

### Fields not auto-populating after verification

**Check browser console**:
1. Open DevTools > Console
2. Look for: `✅ Stripe Identity verification successful - fields auto-populated`
3. If error, check API response structure

---

## Next Steps

- [ ] Complete all test scenarios in [Testing Guide](./docs/05-integrations/STRIPE_IDENTITY_TESTING_GUIDE.md)
- [ ] Test with different document types (passport, state ID)
- [ ] Test failure scenarios (canceled, requires_input)
- [ ] Verify webhook logs match expected behavior
- [ ] Test manual entry fallback

---

## Production Deployment

Before going live:

1. Replace test keys with **live keys** from Stripe dashboard
2. Set up production webhook endpoint
3. Test with real ID documents (not test documents)
4. Add error monitoring (Sentry, Datadog)
5. Implement database persistence for verification results

---

## Documentation

- **[Testing Guide](./docs/05-integrations/STRIPE_IDENTITY_TESTING_GUIDE.md)** - Complete testing scenarios
- **[Implementation Plan](./docs/05-integrations/STRIPE_IDENTITY_IMPLEMENTATION_PLAN.md)** - Architecture details
- **[Stripe Identity Docs](https://stripe.com/docs/identity)** - Official Stripe documentation

---

## Cost

- **Sandbox (Test Mode)**: FREE unlimited verifications
- **Production**: $2.00 per successful verification

---

## Support

If you encounter issues:

1. Check [Testing Guide](./docs/05-integrations/STRIPE_IDENTITY_TESTING_GUIDE.md) troubleshooting section
2. Review Stripe logs: https://dashboard.stripe.com/test/logs
3. Check webhook events: https://dashboard.stripe.com/test/webhooks
4. Review API logs in terminal running `npm run dev`
