# Stripe Identity Integration - Implementation Plan

**Status**: Planning - Sandbox Testing
**Purpose**: Replace manual address input with Stripe Identity document verification + liveness detection
**Target**: Step 2 of verify flow (`/dashboard/verify`)

---

## Table of Contents

1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Proposed Architecture](#proposed-architecture)
4. [Implementation Phases](#implementation-phases)
5. [Technical Requirements](#technical-requirements)
6. [Testing Strategy](#testing-strategy)
7. [Cost Analysis](#cost-analysis)

---

## Overview

### Goal

Replace the manual home address and SSN input in Step 2 of the verification flow with Stripe Identity's automated document verification that:

1. **Scans government-issued IDs** from 120+ countries
2. **Extracts data automatically**: Name, DOB, address, ID number
3. **Performs liveness detection**: Selfie matching to prevent fraud
4. **Auto-populates form fields**: Eliminates manual data entry
5. **Improves conversion**: Faster, more user-friendly experience

### Benefits

- **Reduced friction**: No manual typing of address (5 fields eliminated)
- **Higher accuracy**: OCR extraction vs manual entry (fewer typos)
- **Better security**: Liveness detection prevents ID photo spoofing
- **Improved UX**: Mobile-optimized camera capture flow
- **Faster completion**: ~45 seconds vs ~2 minutes for manual entry
- **Fraud prevention**: Biometric matching catches fake IDs

---

## Current State Analysis

### Step 2: Manual Address & SSN Input

**Current Flow**:
```
Step 1: Basic Info (Name, Email, Phone, DOB)
  ↓
Step 2: Manual Address Entry  ← THIS IS WHAT WE'RE REPLACING
  - Street Address (text input)
  - City (text input)
  - State (dropdown - 50 states)
  - ZIP Code (text input)
  - SSN Last 4 (password input)
  ↓
Step 3: Your Role + ToS
```

**Problems with Current Approach**:
- **High friction**: 5 separate form fields to complete
- **Error-prone**: Manual typing leads to typos (especially addresses)
- **Slow**: Takes ~2 minutes to complete Step 2
- **No fraud prevention**: Can enter fake addresses
- **Mobile pain**: Typing addresses on mobile is tedious
- **No identity verification**: Just collecting self-reported data

### Data Collected in Step 2 (Current)

```typescript
interface Step2Data {
  homeAddress: {
    street: string;      // Manual input
    city: string;        // Manual input
    state: string;       // Dropdown selection
    zipCode: string;     // Manual input (5 digits)
  };
  ssnLast4: string;      // Manual input (4 digits, password field)
}
```

### Data Available from Stripe Identity

```typescript
interface StripeIdentityVerifiedOutputs {
  // Personal Info
  first_name: string;
  last_name: string;
  dob: {
    day: number;
    month: number;
    year: number;
  };

  // Address (EXACTLY what we need for Step 2!)
  address: {
    line1: string;        // Street address
    line2?: string;       // Apt/Unit (optional)
    city: string;         // City
    state: string;        // State code (e.g., "CA")
    postal_code: string;  // ZIP code
    country: string;      // Country code (e.g., "US")
  };

  // ID Information
  id_number: string;      // Last 4 of SSN (full SSN if available)

  // Document Details
  document: {
    type: 'driving_license' | 'passport' | 'id_card';
    number: string;         // License/ID number
    expiration_date: { day, month, year };
    issuing_country: string;
    issuing_state?: string;
  };
}
```

**Perfect Match!** Stripe Identity provides EXACTLY the data we need for Step 2.

---

## Proposed Architecture

### High-Level Flow

```
Step 1: Basic Info (unchanged)
  ↓
Step 2: Stripe Identity Verification (NEW)
  ├─ User clicks "Verify with ID" button
  ├─ Backend creates Stripe Identity session
  ├─ User redirected to Stripe hosted page
  ├─ User uploads ID document (or takes photo)
  ├─ User takes selfie for liveness check
  ├─ Stripe processes verification (~30 seconds)
  ├─ User redirected back to app
  ├─ Data auto-populated in form
  └─ User reviews and continues
  ↓
Step 3: Your Role + ToS (unchanged)
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (/dashboard/verify - Step 2)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ "Verify with ID" Button                               │  │
│  │ ↓                                                      │  │
│  │ POST /api/stripe/identity/create-session              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend API Route (/api/stripe/identity/create-session)    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Get merchant data from localStorage                │  │
│  │ 2. Create Stripe Identity VerificationSession         │  │
│  │    - type: 'document'                                 │  │
│  │    - require_live_capture: true                       │  │
│  │    - require_matching_selfie: true                    │  │
│  │ 3. Return session.url and session.client_secret       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Stripe Identity Hosted Page                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Select document type (License/Passport/ID)         │  │
│  │ 2. Upload/capture front + back of ID                  │  │
│  │ 3. Take selfie with liveness detection                │  │
│  │ 4. Stripe verifies document + face match              │  │
│  │ 5. Redirect to return_url with session_id             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend Webhook (/api/stripe/webhooks)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Event: identity.verification_session.verified          │  │
│  │ 1. Extract verified_outputs from session              │  │
│  │ 2. Store in localStorage or database                  │  │
│  │ 3. Send success signal to frontend                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend - Step 2 (Auto-populated)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ homeAddress.street = verified_outputs.address.line1    │  │
│  │ homeAddress.city = verified_outputs.address.city       │  │
│  │ homeAddress.state = verified_outputs.address.state     │  │
│  │ homeAddress.zipCode = verified_outputs.address.postal  │  │
│  │ ssnLast4 = verified_outputs.id_number (last 4)         │  │
│  │                                                        │  │
│  │ [Fields are read-only with ✓ Verified badge]          │  │
│  │ [Continue button enabled]                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Backend API Setup (Week 1)

**Goal**: Create API endpoints for Stripe Identity session management

#### Task 1.1: Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

#### Task 1.2: Environment Variables

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Task 1.3: Create Session API Route

**File**: `/app/api/stripe/identity/create-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, email, firstName, lastName, dateOfBirth } = body;

    // Create Stripe Identity Verification Session
    const session = await stripe.identity.verificationSessions.create({
      type: 'document',

      // Enable liveness + selfie matching
      options: {
        document: {
          require_live_capture: true,        // Camera capture (not file upload)
          require_matching_selfie: true,     // Selfie must match ID photo
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
        email: email,
        source: 'onboarding_step_2'
      },

      // Return URL after completion
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/verify?step=2&session_id={VERIFICATION_SESSION_ID}`
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      clientSecret: session.client_secret
    });

  } catch (error: any) {
    console.error('Stripe Identity session creation failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### Task 1.4: Create Webhook Handler

**File**: `/app/api/stripe/webhooks/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'identity.verification_session.verified':
      await handleVerificationVerified(event.data.object);
      break;

    case 'identity.verification_session.requires_input':
      await handleVerificationRequiresInput(event.data.object);
      break;

    case 'identity.verification_session.canceled':
      await handleVerificationCanceled(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleVerificationVerified(session: Stripe.Identity.VerificationSession) {
  console.log('✅ Verification verified:', session.id);

  const merchantId = session.metadata.merchant_id;
  const verifiedData = session.verified_outputs;

  // Store verified data (implement your storage logic)
  // For now, we'll rely on the frontend fetching it via retrieve API

  console.log('Verified data:', {
    name: `${verifiedData?.first_name} ${verifiedData?.last_name}`,
    dob: verifiedData?.dob,
    address: verifiedData?.address,
    id_number: verifiedData?.id_number
  });
}

async function handleVerificationRequiresInput(session: Stripe.Identity.VerificationSession) {
  console.log('⚠️ Verification requires input:', session.id);
  console.log('Last error:', session.last_error);

  // TODO: Notify user to retry with clearer photo
}

async function handleVerificationCanceled(session: Stripe.Identity.VerificationSession) {
  console.log('❌ Verification canceled:', session.id);

  // TODO: Notify user that verification failed
}
```

#### Task 1.5: Create Retrieve Session API Route

**File**: `/app/api/stripe/identity/retrieve-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    const session = await stripe.identity.verificationSessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      status: session.status,
      verified_outputs: session.verified_outputs,
      last_error: session.last_error
    });

  } catch (error: any) {
    console.error('Failed to retrieve session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

### Phase 2: Frontend Integration (Week 1-2)

**Goal**: Update Step 2 UI to launch Stripe Identity and auto-populate fields

#### Task 2.1: Add Stripe Identity State

Update `/app/dashboard/verify/page.tsx`:

```typescript
// Add to component state
const [stripeIdentitySessionId, setStripeIdentitySessionId] = useState<string | null>(null);
const [stripeIdentityStatus, setStripeIdentityStatus] = useState<'pending' | 'processing' | 'verified' | 'failed' | null>(null);
const [isLaunchingStripeIdentity, setIsLaunchingStripeIdentity] = useState(false);
```

#### Task 2.2: Add Launch Stripe Identity Function

```typescript
const launchStripeIdentity = async () => {
  try {
    setIsLaunchingStripeIdentity(true);

    // Create verification session
    const response = await fetch('/api/stripe/identity/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: 'temp-merchant-id', // Get from your state
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create verification session');
    }

    // Store session ID
    setStripeIdentitySessionId(data.sessionId);
    setStripeIdentityStatus('pending');

    // Redirect to Stripe Identity hosted page
    window.location.href = data.url;

  } catch (error) {
    console.error('Failed to launch Stripe Identity:', error);
    alert('Failed to start verification. Please try again.');
  } finally {
    setIsLaunchingStripeIdentity(false);
  }
};
```

#### Task 2.3: Handle Return from Stripe Identity

```typescript
// Add useEffect to detect return from Stripe
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const step = urlParams.get('step');

  if (sessionId && step === '2') {
    // User returned from Stripe Identity
    handleStripeIdentityReturn(sessionId);
  }
}, []);

const handleStripeIdentityReturn = async (sessionId: string) => {
  try {
    setStripeIdentityStatus('processing');

    // Fetch verification results
    const response = await fetch(`/api/stripe/identity/retrieve-session?session_id=${sessionId}`);
    const data = await response.json();

    if (data.status === 'verified' && data.verified_outputs) {
      // Auto-populate form fields
      const outputs = data.verified_outputs;

      setFormData(prev => ({
        ...prev,
        firstName: outputs.first_name || prev.firstName,
        lastName: outputs.last_name || prev.lastName,
        dateOfBirth: outputs.dob
          ? `${outputs.dob.year}-${String(outputs.dob.month).padStart(2, '0')}-${String(outputs.dob.day).padStart(2, '0')}`
          : prev.dateOfBirth,
        homeAddress: {
          street: outputs.address?.line1 || '',
          city: outputs.address?.city || '',
          state: outputs.address?.state || '',
          zipCode: outputs.address?.postal_code || ''
        },
        ssnLast4: outputs.id_number?.slice(-4) || ''
      }));

      setStripeIdentityStatus('verified');
      setStripeIdentitySessionId(sessionId);

      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/verify?step=2');

    } else if (data.status === 'requires_input') {
      setStripeIdentityStatus('failed');
      alert(`Verification failed: ${data.last_error?.reason || 'Unknown error'}. Please try again.`);
    }

  } catch (error) {
    console.error('Failed to retrieve verification results:', error);
    setStripeIdentityStatus('failed');
  }
};
```

#### Task 2.4: Update Step 2 UI

Replace manual address input with Stripe Identity button:

```tsx
{currentStep === 2 && (
  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your identity</h2>
      <p className="text-gray-600">Scan your government-issued ID to verify your address and identity</p>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">

      {/* Stripe Identity Status */}
      {stripeIdentityStatus === null && (
        <>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Quick ID Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                We'll scan your driver's license, passport, or government ID to automatically verify your address and identity.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Takes less than 1 minute</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Works with driver's licenses, passports, and ID cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Bank-level encryption and security</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>No manual typing required</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={launchStripeIdentity}
            disabled={isLaunchingStripeIdentity}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
          >
            {isLaunchingStripeIdentity ? 'Loading...' : 'Verify with ID Document'}
          </Button>

          <div className="text-center">
            <button
              onClick={() => {/* TODO: Show manual entry fallback */}}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Enter address manually instead
            </button>
          </div>
        </>
      )}

      {/* Processing State */}
      {stripeIdentityStatus === 'processing' && (
        <div className="text-center space-y-4 py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Verifying your ID document...</p>
        </div>
      )}

      {/* Verified State - Show extracted data */}
      {stripeIdentityStatus === 'verified' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Identity Verified</p>
              <p className="text-sm text-green-700">Your information has been extracted and verified.</p>
            </div>
          </div>

          {/* Display extracted data (read-only) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.homeAddress.street} readOnly className="bg-gray-50" />
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <div className="flex items-center gap-2">
                  <Input value={formData.homeAddress.city} readOnly className="bg-gray-50" />
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <div className="flex items-center gap-2">
                  <Input value={formData.homeAddress.state} readOnly className="bg-gray-50" />
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ZIP Code</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.homeAddress.zipCode} readOnly className="bg-gray-50" />
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>SSN Last 4</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.ssnLast4} type="password" readOnly className="bg-gray-50" />
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStripeIdentityStatus(null)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Verify with a different ID
            </button>
          </div>
        </div>
      )}

    </div>
  </motion.div>
)}
```

---

### Phase 3: Testing Strategy

#### Test Case 1: Successful Verification (US Driver's License)

**Steps**:
1. Navigate to `/dashboard/verify`
2. Complete Step 1 with test data
3. Click "Verify with ID Document" in Step 2
4. Upload Stripe test document: [Test Driver's License](https://docs.stripe.com/identity/testing#test-images)
5. Take selfie with test face image
6. Verify redirect back to app
7. Confirm address fields are auto-populated
8. Verify green checkmarks appear next to fields
9. Click Continue to Step 3

**Expected Result**:
- All address fields populated correctly
- SSN last 4 extracted from test ID
- Fields marked as verified (read-only)
- Can proceed to Step 3

#### Test Case 2: Successful Verification (US Passport)

**Steps**: Same as above but use test passport document

**Expected Result**: Same as Test Case 1

#### Test Case 3: Verification Failed (Document Unclear)

**Use**: Stripe test document that triggers `requires_input` error

**Expected Result**:
- Error message displayed
- Option to retry with clearer photo
- Can retry verification

#### Test Case 4: Verification Canceled

**Steps**: Start verification but close browser before completion

**Expected Result**:
- Can restart verification
- No data populated
- Option to enter manually

#### Test Case 5: Manual Entry Fallback

**Steps**: Click "Enter address manually instead" link

**Expected Result**:
- Shows manual form fields (current Step 2 UI)
- Can complete without Stripe Identity

---

### Phase 4: Stripe Test Mode Setup

#### Step 1: Get Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test)
2. Navigate to Developers → API Keys
3. Copy:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

#### Step 2: Create Webhook Endpoint

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.com/api/stripe/webhooks`
4. Select events:
   - `identity.verification_session.verified`
   - `identity.verification_session.requires_input`
   - `identity.verification_session.canceled`
5. Copy webhook signing secret: `whsec_...`

#### Step 3: Test with Stripe CLI (Local Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# This will output a webhook signing secret like: whsec_...
# Add this to your .env.local file
```

#### Step 4: Test Documents

Stripe provides test images that trigger different verification outcomes:

**Test Driver's License** (Success):
- Download: https://stripe.com/files/docs/identity/test-id-front.jpg
- Status: Will verify successfully
- Extracts: Name, DOB, Address, ID number

**Test Passport** (Success):
- Download: https://stripe.com/files/docs/identity/test-passport.jpg
- Status: Will verify successfully

**Test Selfie**:
- Download: https://stripe.com/files/docs/identity/test-selfie.jpg
- Status: Matches test documents

**Failed Document** (Triggers `requires_input`):
- Use any blurry/unclear image
- Status: Will fail with error

---

## Cost Analysis

### Stripe Identity Pricing (Sandbox = Free)

**Test Mode**:
- ✅ **FREE**: Unlimited verifications in test mode
- ✅ No charges for development/testing

**Production Pricing** (when you go live):
- **Document Verification**: $1.50 per check
- **Document + Selfie**: $2.00 per check
- **ID Number Verification**: $0.50 per check

### Cost Comparison

| Approach | Cost per Merchant | User Experience | Fraud Prevention |
|----------|------------------|-----------------|------------------|
| **Manual Entry** (Current) | $0 | ⭐⭐ Poor | ❌ None |
| **Stripe Identity** (New) | $2.00 | ⭐⭐⭐⭐⭐ Excellent | ✅ Liveness + OCR |

**ROI Calculation**:
- Cost: $2.00 per merchant
- Fraud prevented: 1-2% of merchants (fake addresses/IDs)
- Average fraud loss: $500-$2,000 per incident
- Break-even: Preventing 1 fraud case per 250-1,000 merchants

**Recommendation**: Worth the cost for:
- Reduced fraud
- Better UX (higher conversion)
- Faster onboarding (less abandonment)

---

## Next Steps

### To Start Testing Today:

1. **Set up Stripe test account** (if not done):
   ```bash
   # Go to https://dashboard.stripe.com/register
   # Sign up for test account
   ```

2. **Add API keys to .env.local**:
   ```env
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Create API routes** (Phase 1 tasks above)

4. **Update verify page** (Phase 2 tasks above)

5. **Test with Stripe CLI**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   npm run dev
   ```

6. **Test verification flow**:
   - Navigate to http://localhost:3000/dashboard/verify
   - Complete Step 1
   - Click "Verify with ID Document" in Step 2
   - Upload test document from Stripe docs
   - Verify data auto-populates

---

## Related Documentation

- [Stripe Identity Documentation](https://docs.stripe.com/identity)
- [Testing Stripe Identity](https://docs.stripe.com/identity/testing)
- [Stripe Identity Test Images](https://docs.stripe.com/identity/testing#test-images)
- [Verification Session API](https://docs.stripe.com/api/identity/verification_sessions)
- [STRIPE_IDENTITY_VERIFICATION.md](./STRIPE_IDENTITY_VERIFICATION.md) - Three-tier verification strategy
- [STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md](./STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md) - Full comparison analysis

---

**Document Status**: Implementation Plan - Ready for Development
**Last Updated**: January 2025
**Next Review**: After Phase 1 completion
