# Stripe Identity Verification Integration

Complete technical documentation for Stripe Identity as a fallback verification provider for merchant identity verification.

---

## Document Overview

This document describes the Stripe Identity integration as a **fallback verification method** when Trulioo automated verification fails or when country-specific regulations require biometric liveness checks.

**Related Documentation**:
- [Stripe Payment Setup Flow](./STRIPE_PAYMENT_SETUP_FLOW.md) - Primary Stripe Connect integration
- [User Flow 3: Identity Verification](../02-design/USER_FLOW_03_LSPAY.md) - Merchant experience
- [Trulioo Integration](./TRUEBIZ_VERIFICATION_API.md) - Primary KYC/KYB provider

---

## Table of Contents

1. [Overview](#overview)
2. [When Stripe Identity is Used](#when-stripe-identity-is-used)
3. [Three-Tier Verification Strategy](#three-tier-verification-strategy)
4. [Country-Specific Liveness Requirements](#country-specific-liveness-requirements)
5. [Technical Implementation](#technical-implementation)
6. [Verification Session Flow](#verification-session-flow)
7. [Webhook Integration](#webhook-integration)
8. [Error Handling](#error-handling)
9. [Cost Analysis](#cost-analysis)

---

## Overview

**Stripe Identity** is Stripe's built-in identity verification service that provides:
- Document verification (government-issued IDs from 80+ countries)
- Selfie verification with liveness detection (face geometry matching)
- Biometric fraud prevention (presentation attack detection)
- Automated and manual review workflows

**Role in Architecture**: Tier 3 fallback verification provider (not primary)

**Use Cases**:
1. Trulioo verification fails after full SSN retry
2. Country regulations require biometric liveness checks (EU, UK, etc.)
3. High-risk merchant signals detected
4. Manual review determines document upload needed

---

## When Stripe Identity is Used

### Primary Provider: Trulioo (85% of merchants)

Trulioo handles automated KYC/KYB verification using:
- SSN against government records
- Address validation via credit bureaus
- Business entity verification (EIN, state registration)

**Cost**: ~$1-2 per verification
**Speed**: 1-2 business days (automated)

### Fallback Provider: Stripe Identity (10-15% of merchants)

Stripe Identity handles cases where Trulioo cannot verify:
- Data mismatches (name, address, DOB inconsistencies)
- Insufficient SSN match (even with full 9 digits)
- Country requires biometric verification
- New business with no credit history

**Cost**: ~$2-3 per verification session
**Speed**: 1-2 hours (automated), 24-48 hours (manual review)

---

## Three-Tier Verification Strategy

### Tier 1: Trulioo Automated (Primary)

```
Purchase Complete → Stripe Account Created
  ↓
Trulioo KYC/KYB API Call
  ↓
• SSN Last 4, Name, Address, DOB
• Business EIN, Legal Name, Address
  ↓
SUCCESS (85%) → charges_enabled = true ✅
  ↓
FAIL → Proceed to Tier 2
```

**Success Rate**: ~85%
**Processing Time**: 1-2 business days
**Cost**: $1-2 per merchant

---

### Tier 2: Trulioo + Full SSN (First Fallback)

```
Tier 1 Verification Failed
  ↓
Send Email: "We need your full Social Security Number"
  ↓
Dashboard Prompt: Secure form for 9-digit SSN
  ↓
Merchant Enters Full SSN
  ↓
Retry Trulioo Verification with Full SSN
  ↓
SUCCESS (10%) → charges_enabled = true ✅
  ↓
FAIL → Proceed to Tier 3
```

**Success Rate**: ~10% (of those who failed Tier 1)
**Processing Time**: 1-2 business days after SSN submission
**Cost**: No additional charge (same Trulioo session)

---

### Tier 3: Stripe Identity + Liveness (Final Fallback)

```
Tier 2 Verification Failed OR Country Requires Liveness
  ↓
Create Stripe Identity Verification Session
  ↓
Send Email: "Please upload your government-issued ID"
  ↓
Dashboard: "Complete Identity Verification" button
  ↓
Merchant Redirected to Stripe Identity Hosted Page
  ↓
• Upload Photo ID (driver's license, passport, national ID)
• Take Selfie with Liveness Detection
• Biometric Consent (if country requires)
  ↓
Stripe Identity Processing
  ↓
• Automated Document Validation (80%+)
• Manual Review if Needed (20%)
  ↓
SUCCESS (5%) → charges_enabled = true ✅
  ↓
FAIL → Manual Operations Review Required
```

**Success Rate**: ~5% (of those who failed Tier 2) + ~3-5% (country-mandated liveness)
**Processing Time**: 1-2 hours (automated), 24-48 hours (manual review)
**Cost**: $2-3 per verification session

---

## Country-Specific Liveness Requirements

### Countries Requiring Biometric Consent

**EU Member States** (GDPR Article 9 - Biometric Data):
```typescript
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
];
```

**Other Regulated Countries**:
```typescript
const LIVENESS_REQUIRED_COUNTRIES = [
  ...EU_COUNTRIES,
  'GB',  // UK (GDPR retained post-Brexit)
  'AU',  // Australia (Privacy Act 1988)
  'CA'   // Canada (PIPEDA - case-by-case basis)
];
```

### Routing Logic

```typescript
async function determineVerificationProvider(merchant: Merchant): Promise<Provider> {
  const countryCode = merchant.businessAddress.country;

  // Check if country mandates biometric verification
  if (LIVENESS_REQUIRED_COUNTRIES.includes(countryCode)) {
    // Skip Trulioo, go directly to Stripe Identity with liveness
    return 'stripe_identity';
  }

  // Default: Start with Trulioo (Tier 1)
  return 'trulioo';
}
```

### Biometric Consent UI

**For EU/UK/Regulated Countries**:
```html
<div class="biometric-consent">
  <h3>Biometric Verification Required</h3>
  <p>
    [Country] law requires biometric verification for payment processing.
    We will collect and process your facial biometric data to verify your identity.
  </p>

  <label>
    <input type="checkbox" name="biometric_consent" required />
    I consent to the use of biometric technology (facial recognition)
    to verify my identity, as required by [Country] law.
  </label>

  <a href="/legal/biometric-privacy">Learn about your privacy rights</a>
</div>
```

**Backend Capture**:
```typescript
{
  biometric_consent: {
    granted: true,
    timestamp: '2025-10-15T14:32:10Z',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0...',
    country_code: 'DE',
    legal_basis: 'gdpr_article_9_explicit_consent'
  }
}
```

---

## Technical Implementation

### Creating a Verification Session

**When to Create**:
1. Trulioo Tier 2 fails
2. Country requires liveness (automatic routing)
3. High-risk fraud signals detected
4. Manual operations review determines document needed

**API Call** (Backend):
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createIdentityVerificationSession(
  merchantId: string,
  stripeAccountId: string,
  reason: string
): Promise<Stripe.Identity.VerificationSession> {

  const merchant = await getMerchant(merchantId);

  const session = await stripe.identity.verificationSessions.create({
    type: 'document',

    // Enable liveness check (selfie verification)
    options: {
      document: {
        require_matching_selfie: true,      // Require selfie to match ID photo
        require_live_capture: true,         // Prevent pre-recorded videos
        allowed_types: [
          'driving_license',
          'passport',
          'id_card'
        ]
      }
    },

    // Metadata for tracking
    metadata: {
      merchant_id: merchantId,
      lightspeed_account_id: merchant.lightspeedAccountId,
      stripe_account_id: stripeAccountId,
      verification_tier: 'tier_3_identity',
      reason: reason,  // 'trulioo_failed' OR 'country_regulation' OR 'high_risk'
      previous_attempts: '2'  // Track retry count
    },

    // Return URL after completion
    return_url: `${process.env.APP_URL}/dashboard/verification/complete`
  });

  // Store session ID in database
  await storeVerificationSession(merchantId, session.id, session.url);

  // Send notification to merchant
  await sendVerificationRequestEmail(merchant, session.url);

  return session;
}
```

---

### Session Configuration Options

**Basic Document Verification** (no liveness):
```typescript
{
  type: 'document',
  options: {
    document: {
      require_matching_selfie: false,  // No selfie required
      allowed_types: ['driving_license', 'passport', 'id_card']
    }
  }
}
```

**Document + Liveness** (recommended):
```typescript
{
  type: 'document',
  options: {
    document: {
      require_matching_selfie: true,   // Require selfie
      require_live_capture: true,      // Liveness detection
      allowed_types: ['driving_license', 'passport', 'id_card']
    }
  }
}
```

**ID Number Verification** (for supported countries):
```typescript
{
  type: 'id_number',
  options: {
    id_number: {
      // For merchants outside US who need SSN equivalent verification
    }
  }
}
```

---

## Verification Session Flow

### Step 1: Session Creation (Backend)

```typescript
// Triggered by Trulioo failure webhook or country routing
const session = await createIdentityVerificationSession(
  merchantId,
  stripeAccountId,
  'trulioo_verification_failed'
);

// session.url = "https://verify.stripe.com/start/test_YWNjdF8..."
```

---

### Step 2: Merchant Notification

**Email Template**:
```
Subject: Action Required: Upload Government ID

Hi [Business Name],

We need to verify your identity to activate payment processing.
Please upload a government-issued photo ID.

This is required by federal law and takes about 3-5 minutes.

[Upload ID Now] → Redirects to session.url

Why we need this:
• Federal regulations require identity verification
• Your data is secure and encrypted
• One-time verification

Questions? Contact support@lightspeed.com
```

**Dashboard UI**:
```tsx
<Alert variant="warning">
  <AlertTitle>Action Required: Identity Verification</AlertTitle>
  <AlertDescription>
    We need to verify your identity with a government-issued ID to
    activate payment processing.
  </AlertDescription>
  <Button onClick={() => window.location.href = session.url}>
    Complete Verification
  </Button>
</Alert>
```

---

### Step 3: Merchant Completes Verification (Stripe Hosted)

**Stripe Identity Hosted Flow**:
1. Merchant clicks link → Redirected to `session.url`
2. **Biometric Consent** (if required by country):
   - Explanation of biometric data usage
   - Consent checkbox
   - Privacy rights link
3. **Document Upload**:
   - Select ID type (driver's license, passport, national ID)
   - Upload front + back photos (or camera capture)
   - Real-time validation (blur detection, expiry check)
4. **Selfie + Liveness Check**:
   - Camera opens for selfie
   - Follow prompts: turn head, blink, etc.
   - Liveness detection prevents photo/video spoofing
5. **Submission**:
   - "Verification submitted" confirmation
   - Redirect to `return_url`

---

### Step 4: Processing & Results

**Automated Verification** (80% of sessions):
- Stripe AI validates document authenticity
- Face geometry matching (selfie vs ID photo)
- Result: `verified` or `requires_input`
- Time: 1-2 hours

**Manual Review** (20% of sessions):
- Human reviewer checks document
- Validates liveness check results
- Result: `verified` or `canceled`
- Time: 24-48 hours

---

## Webhook Integration

### Webhook Events to Monitor

```typescript
const IDENTITY_WEBHOOK_EVENTS = [
  'identity.verification_session.verified',
  'identity.verification_session.requires_input',
  'identity.verification_session.canceled',
  'identity.verification_session.processing'
];
```

---

### Event Handler: Verified

```typescript
stripe.webhooks.on('identity.verification_session.verified', async (event) => {
  const session = event.data.object as Stripe.Identity.VerificationSession;

  const merchantId = session.metadata.merchant_id;
  const stripeAccountId = session.metadata.stripe_account_id;

  // Update merchant verification status
  await updateMerchantVerification(merchantId, {
    status: 'verified',
    provider: 'stripe_identity',
    session_id: session.id,
    verified_at: new Date(),
    verification_tier: 'tier_3'
  });

  // Update Stripe Connected Account with verified person data
  const verifiedData = session.verified_outputs;
  await stripe.accounts.updatePerson(
    stripeAccountId,
    session.metadata.person_id,
    {
      // Update person with verified document data
      id_number_provided: true,
      verification: {
        document: {
          front: verifiedData.id_number,
          back: verifiedData.id_number
        }
      }
    }
  );

  // Enable charges on Stripe account
  // (Stripe may auto-enable based on verification requirements met)

  // Notify merchant
  await sendVerificationSuccessEmail(merchantId);

  // Log event
  console.log(`✅ Merchant ${merchantId} verified via Stripe Identity`);
});
```

---

### Event Handler: Requires Input

```typescript
stripe.webhooks.on('identity.verification_session.requires_input', async (event) => {
  const session = event.data.object;
  const merchantId = session.metadata.merchant_id;

  // Determine what input is needed
  const lastError = session.last_error;

  // Common reasons:
  // - document_unverified_other (unclear photo, glare, blur)
  // - document_expired
  // - selfie_face_mismatch (face doesn't match ID)
  // - selfie_document_missing_photo (ID has no photo)

  // Update merchant status
  await updateMerchantVerification(merchantId, {
    status: 'requires_input',
    error_code: lastError?.code,
    error_message: lastError?.reason
  });

  // Send email with specific guidance
  await sendVerificationErrorEmail(merchantId, {
    issue: lastError?.reason,
    action: 'Please upload a clearer photo of your ID and retake your selfie.'
  });

  // Dashboard shows error with retry button
  console.log(`⚠️ Merchant ${merchantId} verification requires input: ${lastError?.reason}`);
});
```

---

### Event Handler: Canceled

```typescript
stripe.webhooks.on('identity.verification_session.canceled', async (event) => {
  const session = event.data.object;
  const merchantId = session.metadata.merchant_id;

  // Update status
  await updateMerchantVerification(merchantId, {
    status: 'failed',
    provider: 'stripe_identity',
    failure_reason: 'verification_canceled',
    canceled_at: new Date()
  });

  // Trigger manual operations review
  await createManualReviewTask({
    merchant_id: merchantId,
    reason: 'stripe_identity_verification_canceled',
    priority: 'high',
    notes: 'Merchant failed automated verification. Manual review required.'
  });

  // Notify merchant - manual review team will contact them
  await sendManualReviewNotificationEmail(merchantId);

  console.log(`❌ Merchant ${merchantId} verification canceled - manual review required`);
});
```

---

## Error Handling

### Common Verification Issues

| Error Code | Reason | Merchant Action | System Action |
|------------|--------|-----------------|---------------|
| `document_unverified_other` | Document unclear, glare, blur | Upload clearer photo | Allow retry with guidance |
| `document_expired` | ID is expired | Upload current, valid ID | Allow retry |
| `selfie_face_mismatch` | Face doesn't match ID photo | Retake selfie in good lighting | Allow retry (max 3 attempts) |
| `selfie_document_missing_photo` | ID has no photo | Upload different ID type (passport, driver's license) | Allow retry |
| `document_type_not_supported` | ID type not accepted | Upload driver's license or passport | Show supported types |
| `consent_declined` | Merchant declined biometric consent | Cannot proceed (required by country law) | Manual review/alternative path |

---

### Retry Logic

```typescript
async function handleVerificationFailure(
  session: Stripe.Identity.VerificationSession
): Promise<void> {

  const merchantId = session.metadata.merchant_id;
  const attempts = parseInt(session.metadata.previous_attempts || '0');

  // Allow up to 3 retry attempts
  if (attempts < 3) {
    // Create new session with incremented attempt count
    await createIdentityVerificationSession(
      merchantId,
      session.metadata.stripe_account_id,
      'retry_after_failure',
      attempts + 1
    );

    // Send email with specific guidance based on error
    await sendRetryGuidanceEmail(merchantId, session.last_error);

  } else {
    // Max attempts reached - escalate to manual review
    await createManualReviewTask({
      merchant_id: merchantId,
      reason: 'stripe_identity_max_retries_exceeded',
      priority: 'urgent',
      notes: `Merchant failed verification after ${attempts} attempts. Last error: ${session.last_error?.reason}`
    });

    // Notify merchant - support team will contact them
    await sendManualReviewNotificationEmail(merchantId);
  }
}
```

---

## Cost Analysis

### Verification Cost Comparison

| Provider | Use Case | Cost per Verification | Success Rate | Avg. Time |
|----------|----------|----------------------|--------------|-----------|
| **Trulioo** (Tier 1) | Automated KYC/KYB | $1-2 | 85% | 1-2 days |
| **Trulioo** (Tier 2) | + Full SSN | $0 (same session) | +10% | 1-2 days |
| **Stripe Identity** (Tier 3) | Document + Liveness | $2-3 | +5% | 1-48 hours |
| **Manual Review** | Failed all tiers | $0 (internal ops) | 100% | 2-5 days |

---

### Total Cost Model (per 1,000 merchants)

**Scenario: US-based merchants**

```
Tier 1 (Trulioo):
  850 merchants × $1.50 = $1,275

Tier 2 (Full SSN):
  100 merchants × $0 = $0

Tier 3 (Stripe Identity):
  50 merchants × $2.50 = $125

Manual Review:
  0 merchants × $0 = $0 (ideally)

Total Cost: $1,400 per 1,000 merchants
Average: $1.40 per merchant
```

**Scenario: EU-based merchants (liveness required)**

```
Tier 1 (Skip - country requires liveness):
  0 merchants × $1.50 = $0

Tier 3 (Stripe Identity with liveness):
  950 merchants × $2.50 = $2,375

Manual Review:
  50 merchants × $0 = $0

Total Cost: $2,375 per 1,000 merchants
Average: $2.38 per merchant
```

---

### Cost Optimization Strategies

1. **Geographic Routing**:
   - US/Canada/AU: Start with Trulioo (cheaper, 85% success)
   - EU/UK: Route directly to Stripe Identity (required anyway)

2. **Risk-Based Routing**:
   - Low-risk merchants: Trulioo only
   - High-risk signals: Skip to Stripe Identity immediately

3. **Batch Processing**:
   - Queue verification sessions
   - Process during off-peak hours for better rates (if applicable)

---

## Related Documentation

**Integration Docs**:
- [Stripe Payment Setup Flow](./STRIPE_PAYMENT_SETUP_FLOW.md) - Primary Stripe Connect integration
- [Trulioo Verification API](./TRUEBIZ_VERIFICATION_API.md) - Primary KYC/KYB provider
- [Stripe Verification Requirements](./STRIPE_VERIFICATION_REQUIREMENTS.md) - Required data fields

**User Flows**:
- [User Flow 3: Identity Verification](../02-design/USER_FLOW_03_LSPAY.md) - Merchant experience
- [User Flow 4: Purchase](../02-design/USER_FLOW_04_PURCHASE.md) - When verification begins

**External References**:
- [Stripe Identity Documentation](https://docs.stripe.com/identity)
- [Verification Checks](https://docs.stripe.com/identity/verification-checks)
- [Testing Verification](https://docs.stripe.com/identity/testing)

---

**Document Status**: Technical Specification
**Last Updated**: January 2025
**Audience**: Engineering team, backend developers
**Implementation Status**: Planned (not yet implemented)
