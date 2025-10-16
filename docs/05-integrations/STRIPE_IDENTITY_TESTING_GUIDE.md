# Stripe Identity Testing Guide

Complete guide for testing Stripe Identity integration in sandbox mode.

---

## Quick Start

### 1. Set Up Stripe Test Credentials

1. Sign up for Stripe test account at https://dashboard.stripe.com/register
2. Navigate to **Developers** > **API Keys** (https://dashboard.stripe.com/test/apikeys)
3. Copy your test credentials and add to `.env.local`:

```bash
# Replace with your actual test keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. For webhook testing, install Stripe CLI:

```bash
# macOS (via Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

5. Authenticate Stripe CLI:

```bash
stripe login
```

6. Start webhook forwarding in a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

7. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

---

## Testing Flow

### Step 1: Navigate to Verification Flow

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click **Get Started** to begin signup
4. Complete signup flow (Pages 1 & 2)
5. Click through dashboard to **/dashboard/verify**
6. Complete Step 1 (Personal Info)
7. Proceed to **Step 2 (Verify Your Identity)**

### Step 2: Launch Stripe Identity

On Step 2, you should see:
- Blue callout box with "Quick verification with ID scan"
- **"Scan My ID"** button
- Manual entry form fields below (as fallback)

Click **"Scan My ID"** button.

**Expected behavior**:
- Button shows loading spinner
- API call to `/api/stripe/identity/create-session`
- Page redirects to Stripe hosted verification page

---

## Test Scenarios

### Test Case 1: Successful US Driver's License Verification

**Goal**: Test full successful verification with address auto-population.

1. On Stripe verification page, select **Document type**: Driver's License
2. Click **Use test document**
3. Select **US Driver's License (Success)**
4. On selfie step, click **Use test image**
5. Complete verification

**Expected Results**:
- ✅ Redirects back to Step 2 with `session_id` in URL
- ✅ Green success banner: "Identity verified successfully!"
- ✅ Address fields auto-populated:
  - Street: `123 Main Street`
  - City: `Springfield`
  - State: `IL`
  - ZIP: `62701`
- ✅ SSN Last 4 auto-populated: `6789`
- ✅ All fields remain editable
- ✅ No validation errors
- ✅ "Scan My ID" button is hidden (verification complete)

**Verify in webhook logs**:
```
✅ Verification verified: vs_1xxxxxxxxxxxxx
Verified data available: { name: 'Jane Doe', address: {...}, dob: {...} }
```

---

### Test Case 2: US Passport Verification

**Goal**: Test alternative document type.

1. Click **"Scan My ID"** button
2. Select **Document type**: Passport
3. Click **Use test document**
4. Select **US Passport (Success)**
5. Complete selfie verification

**Expected Results**:
- ✅ Same successful flow as Test Case 1
- ✅ Address auto-populated from passport
- ✅ Fields editable

---

### Test Case 3: Verification Requires Input (Unclear Document)

**Goal**: Test fallback to manual entry when ID scan fails.

1. Click **"Scan My ID"** button
2. Select **Document type**: Driver's License
3. Click **Use test document**
4. Select **US Driver's License (Requires Input)**
5. Complete flow

**Expected Results**:
- ⚠️ Amber warning banner: "Additional information needed"
- ⚠️ Message: "We couldn't automatically verify your ID. Please enter your information manually below."
- ⚠️ Fields remain empty
- ✅ Manual entry form available
- ✅ User can enter address manually

**Verify in webhook logs**:
```
⚠️ Verification requires input: vs_1xxxxxxxxxxxxx
Last error: {...}
```

---

### Test Case 4: Verification Canceled

**Goal**: Test user canceling verification mid-flow.

1. Click **"Scan My ID"** button
2. On Stripe verification page, click **Cancel** or close tab
3. Return to verify page

**Expected Results**:
- ❌ Gray info banner: "Verification canceled"
- ❌ Message: "No problem! You can enter your information manually below or try scanning your ID again."
- ✅ Fields remain empty
- ✅ Manual entry form available
- ✅ Can retry by clicking "Scan My ID" again

**Verify in webhook logs**:
```
❌ Verification canceled: vs_1xxxxxxxxxxxxx
```

---

### Test Case 5: Manual Entry Fallback

**Goal**: Test that manual entry still works without using Stripe Identity.

1. On Step 2, scroll past "Scan My ID" button
2. Enter address manually:
   - Street: `456 Oak Ave`
   - City: `Portland`
   - State: `OR`
   - ZIP: `97201`
   - SSN Last 4: `1234`
3. Click **Continue**

**Expected Results**:
- ✅ Validation passes
- ✅ Proceeds to Step 3
- ✅ No Stripe Identity API calls made
- ✅ Manual entry works independently

---

## Available Test Documents

Stripe provides these test documents in sandbox mode:

### US Documents (Success)
- **US Driver's License (Success)**
  - Name: Jane Doe
  - Address: 123 Main Street, Springfield, IL 62701
  - DOB: 1990-01-01
  - ID Number: D1234567 (last 4: 4567)

- **US Passport (Success)**
  - Name: John Smith
  - Address: 456 Elm Street, Portland, OR 97201
  - DOB: 1985-05-15
  - Passport Number: P87654321

### Test Failure Scenarios
- **US Driver's License (Requires Input)** - Triggers `requires_input` status
- **US Driver's License (Low Quality)** - Triggers document quality error
- **Expired Document** - Triggers expiration error

### International Documents
- **UK Driver's Licence (Success)**
- **Canadian Passport (Success)**
- **Australian Driver's Licence (Success)**

Full list: https://stripe.com/docs/identity/test-mode

---

## Debugging

### Check API Logs

**Backend logs** (terminal running `npm run dev`):
```
Created Stripe Identity session: vs_1xxxxxxxxxxxxx
Retrieved Stripe Identity session: vs_1xxxxxxxxxxxxx Status: verified
✅ Stripe Identity verification successful - fields auto-populated
```

**Browser console** (DevTools):
```
POST /api/stripe/identity/create-session 200 (OK)
GET /api/stripe/identity/retrieve-session?session_id=vs_1xxxxxxxxxxxxx 200 (OK)
✅ Stripe Identity verification successful - fields auto-populated
```

**Stripe webhook logs** (terminal running `stripe listen`):
```
2025-10-16 14:23:45 --> identity.verification_session.verified [evt_1xxxxxxxxxxxxx]
✅ Verification verified: vs_1xxxxxxxxxxxxx
Merchant ID: temp-merchant-1729108980123
Email: user@example.com
Verified data available: { name: 'Jane Doe', address: {...} }
```

---

### Common Issues

**Issue 1: "STRIPE_SECRET_KEY is not set"**
- **Cause**: Missing environment variable
- **Fix**: Add `STRIPE_SECRET_KEY=sk_test_...` to `.env.local` and restart dev server

**Issue 2: "Missing Stripe signature" in webhook**
- **Cause**: `STRIPE_WEBHOOK_SECRET` not configured or Stripe CLI not running
- **Fix**:
  1. Start Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
  2. Copy webhook secret to `.env.local`
  3. Restart dev server

**Issue 3: Redirect loop after verification**
- **Cause**: `session_id` not being removed from URL
- **Fix**: Check that `window.history.replaceState` is executing in `handleStripeIdentityReturn`

**Issue 4: Fields not auto-populating**
- **Cause**: Stripe API not returning verified data, or data mapping incorrect
- **Fix**: Check browser console for API response:
  ```javascript
  // Verify data structure matches:
  {
    status: 'verified',
    verifiedData: {
      address: { line1, city, state, postal_code },
      id_number: 'D12346789'
    }
  }
  ```

**Issue 5: API version mismatch**
- **Cause**: Stripe SDK version doesn't match API version
- **Fix**: Update `lib/stripe.ts`:
  ```typescript
  apiVersion: '2025-01-27.bastion'  // Use latest stable version
  ```

---

## Production Readiness Checklist

Before deploying to production:

- [ ] Replace test Stripe keys with live keys
- [ ] Set up production webhook endpoint in Stripe dashboard
- [ ] Add webhook signature verification (already implemented)
- [ ] Test with real ID documents (not test documents)
- [ ] Verify webhook delivery and retry logic
- [ ] Add error monitoring (Sentry, Datadog, etc.)
- [ ] Add analytics tracking for verification success rate
- [ ] Implement database persistence for verification results
- [ ] Add rate limiting on API routes
- [ ] Document which countries/document types are supported
- [ ] Train support team on verification failure scenarios
- [ ] Set up alerts for high failure rates

---

## Cost Estimation

**Sandbox (Test Mode)**: FREE unlimited verifications

**Production Pricing**:
- Document verification: **$2.00 per verification**
- Includes:
  - Document capture and OCR
  - Liveness detection (selfie matching)
  - Data extraction (name, DOB, address, ID number)
  - Verification result storage

**Example Monthly Costs**:
- 100 merchants/month: $200
- 500 merchants/month: $1,000
- 1,000 merchants/month: $2,000

**Note**: Only charged for successful verifications. Failed attempts or cancelations are not charged.

---

## Next Steps

1. ✅ Complete all 5 test scenarios above
2. ✅ Verify webhook logs match expected behavior
3. ✅ Test error handling (network failures, API errors)
4. ⏭️ Implement database persistence for verification results
5. ⏭️ Add verification status to merchant dashboard
6. ⏭️ Implement retry logic for failed verifications
7. ⏭️ Add admin panel to view verification results

---

## Related Documentation

- [Stripe Identity Implementation Plan](./STRIPE_IDENTITY_IMPLEMENTATION_PLAN.md) - Complete implementation architecture
- [Stripe Identity vs Trulioo Analysis](./STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md) - Comparison and decision rationale
- [Stripe Identity API Documentation](https://stripe.com/docs/identity) - Official Stripe docs
- [Stripe Test Mode Guide](https://stripe.com/docs/testing) - Testing best practices
