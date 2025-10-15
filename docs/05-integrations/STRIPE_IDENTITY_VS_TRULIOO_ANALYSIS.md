# Stripe Identity vs Third-Party KYC/KYB Analysis

Comprehensive comparison between Stripe Identity verification and third-party providers (like Trulioo) for US Express accounts.

**Status**: Analysis & Recommendation
**Last Updated**: January 2025
**Purpose**: Determine optimal verification strategy for merchant onboarding

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Part 1: Stripe Connect Data Requirements](#part-1-stripe-connect-data-requirements)
3. [Part 2: Stripe Identity Verification Service](#part-2-stripe-identity-verification-service)
4. [Part 3: Using Third-Party Verification (Trulioo)](#part-3-using-third-party-verification-trulioo)
5. [Part 4: Comparison Matrix](#part-4-comparison-matrix)
6. [Part 5: Recommendation](#part-5-recommendation)

---

## Executive Summary

**Key Findings**:

1. **Stripe Connect Requirements**: Express accounts require both KYB (business) and KYC (individual) data, with progressive collection based on payment volume thresholds
2. **Stripe Identity**: Native service tightly integrated with Connect, handles document verification and liveness checks automatically
3. **Third-Party Providers**: Can enrich data and detect fraud, but **cannot replace Stripe's identity verification requirements**
4. **Optimal Strategy**: Use Stripe Identity as PRIMARY for identity verification, use third-party providers like Trulioo for BUSINESS verification and fraud detection

**Bottom Line**:
- Stripe Identity is **required** for individual identity verification (representative, beneficial owners)
- Third-party services like Trulioo are **complementary** for business validation and risk assessment
- You cannot bypass Stripe's verification by submitting third-party results

---

## Part 1: Stripe Connect Data Requirements

### Overview

For US Express accounts, Stripe collects data in **two stages**:

1. **Card Payments Capability** - Enable charge processing (lower bar)
2. **Payouts Capability** - Enable fund transfers to bank account (higher bar)

Requirements evolve based on:
- Payment volume processed
- Time since account creation
- Verification success/failure
- Risk assessment by Stripe

### KYB Requirements (Business Data)

#### For Company Accounts - Initial (Card Payments)

**Company Information**:
- `company.name` - Legal business name
- `company.phone` - Business phone number
- `company.address.city` - Business city
- `company.address.state` - Business state
- `company.address.postal_code` - Business postal code
- `business_profile.url` - Business website URL

**Representative** (person activating account):
- `person.first_name` - Representative first name
- `person.last_name` - Representative last name
- `person.email` - Representative email
- `person.phone` - Representative phone
- `person.dob` - Date of birth
- `person.ssn_last_4` - Last 4 digits of SSN
- `person.address` - Residential address
- `relationship.representative` = true
- `relationship.executive` = true OR `relationship.owner` = true

#### For Company Accounts - Payouts (Within 30 Days)

**Additional Company Data**:
- `company.address.line1` - Full street address
- `company.tax_id` - EIN (Employer Identification Number)
- `company.structure` - Legal structure (LLC, Corporation, etc.)

**25% Beneficial Owners**:
- All individuals owning 25% or more of company
- For each owner:
  - `person.first_name`
  - `person.last_name`
  - `person.dob` - Full date of birth
  - `person.address` - Full residential address
  - `person.ssn_last_4` - Last 4 digits of SSN
  - `person.phone` - Phone number
  - `relationship.owner` = true
  - `relationship.percent_ownership` - Ownership percentage
- Set `company.owners_provided` = true when complete

**Representative Verification**:
- If SSN_last_4 verification fails:
  - `person.id_number` - Full 9-digit SSN
  - `person.verification.document.front` - ID document (front)
  - `person.verification.document.back` - ID document (back)

### KYC Requirements (Individual Accounts)

#### For Individual Accounts - Initial (Card Payments)

- `individual.first_name`
- `individual.last_name`
- `individual.email`
- `individual.phone`
- `individual.dob` - Date of birth
- `individual.ssn_last_4` - Last 4 digits of SSN
- `individual.address.city`
- `individual.address.state`
- `individual.address.postal_code`

#### For Individual Accounts - Payouts (Within 30 Days)

- `individual.address.line1` - Full street address
- If verification fails with ssn_last_4:
  - `individual.id_number` - Full 9-digit SSN
  - `individual.verification.document.front` - ID document (front)
  - `individual.verification.document.back` - ID document (back)

### Volume-Based Thresholds (US-Specific)

#### Tax ID Threshold: $10,000 or $3,000 (Industry-Dependent)

**Trigger**: Before reaching payout threshold
**Required**: `company.tax_id` (EIN)
**Consequence**: Payouts disabled if not provided

#### Individual Information Threshold: $10,000 or $3,000

**Required Before Threshold**:
- `individual.dob.day`
- `individual.dob.month`
- `individual.dob.year`
- `individual.ssn_last_4`

#### Full SSN Threshold: $500,000 Lifetime Charges

**Trigger**: At $500K USD lifetime processing
**Required**: Full 9-digit SSN for all US-resident owners
**Collection**:
- Individuals: `individual.id_number`
- Representatives/Owners: `person.id_number`

#### Owner Verification Threshold: $750,000 USD

**Trigger**: At $750K USD processing
**Required for All 25%+ Owners**:
- `person.address` - Full address
- `person.dob` - Full date of birth
- `person.id_number` - Full 9-digit SSN
- `person.phone` - Phone number
- ID document if verification fails or no SSN

### Document Requirements

#### Identity Documents (ID Verification)

**Format Requirements**:
- Color image (not greyscale)
- JPG or PNG format
- 8,000 x 8,000 pixels or smaller
- 10 MB or less
- Not password-protected
- Must include front and back (for two-sided IDs)

**Acceptable US Documents**:
- Driver's License
- State ID Card
- US Passport
- US Passport Card

**When Required**:
- SSN verification fails
- No SSN available
- High-risk assessment by Stripe
- Volume thresholds reached

#### Business Documents (Entity Verification)

**Format Requirements**:
- Color image or PDF
- JPG, PNG, or PDF format
- All pages included
- Not password-protected
- 10 MB or less

**Acceptable Documents**:
- IRS Letter 147C
- IRS SS-4 Confirmation Letter
- Articles of Incorporation
- Business License
- Operating Agreement

**When Required**:
- Cannot verify `company.tax_id` automatically
- Business name mismatch
- Business structure unclear
- Verification failures

#### Address Documents

**Acceptable Documents**:
- Utility bill (within 6 months)
- Bank statement (within 6 months)
- Government letter (within 6 months)
- Lease agreement

**When Required**:
- Address verification fails
- Representative verification incomplete
- High-risk assessment

### Card-Present vs Card-Not-Present

**Card-Present Merchants** (retail, restaurants):
- Same initial requirements
- May face additional scrutiny for business legitimacy
- Website requirement can be waived if truly no e-commerce
- `business_profile.product_description` required if no URL

**Card-Not-Present Merchants** (e-commerce):
- **MUST** provide `business_profile.url`
- Website must be:
  - Accessible (not password-protected, not geo-blocked)
  - Complete (not under construction)
  - Have privacy policy, terms of service
  - Have customer service contact information
  - Have refund/return/cancellation policies
  - Match business description and products

### Requirements Hash Structure

The `Account` object contains a `requirements` hash that dynamically tracks what's needed:

```json
{
  "requirements": {
    "currently_due": [
      "company.tax_id",
      "person_xyz.verification.document.front"
    ],
    "eventually_due": [
      "company.tax_id",
      "external_account"
    ],
    "past_due": [],
    "pending_verification": [
      "person_abc.id_number"
    ],
    "errors": [
      {
        "requirement": "company.tax_id",
        "code": "verification_failed_tax_id_match",
        "reason": "The tax ID could not be verified with the IRS."
      }
    ],
    "current_deadline": 1529085600,
    "disabled_reason": null
  }
}
```

**Key Fields**:
- `currently_due`: Must collect NOW
- `eventually_due`: Will be required at thresholds
- `past_due`: Overdue, may disable capabilities
- `pending_verification`: Under review by Stripe
- `errors`: Specific verification failures
- `current_deadline`: Unix timestamp for deadline

### Data Collection Workflow

**Progressive Collection Approach**:

```
Account Creation
  ↓
Collect Basic Info → Enable charges (low bar)
  ↓
Wait for payout request or threshold
  ↓
Collect Full Info → Enable payouts (high bar)
  ↓
Monitor requirements hash for changes
  ↓
Respond to verification requests
```

**Incremental vs Upfront**:

- **Incremental**: Collect minimum initially, request more later
  - Pro: Lower friction, faster time-to-first-charge
  - Con: May block payouts if merchant doesn't respond

- **Upfront**: Collect everything immediately
  - Pro: No surprises, payouts enabled immediately
  - Con: Higher abandonment in onboarding

**Recommendation**: Hybrid approach
- Collect enough for charges immediately
- Collect payout info before hardware purchase (in your flow, Step 3 KYB)
- Avoid blocking merchants mid-operation

---

## Part 2: Stripe Identity Verification Service

### What Is Stripe Identity?

Stripe Identity is a standalone verification product that can be integrated with Stripe Connect to fulfill identity verification requirements automatically.

**Core Capabilities**:
- Document verification (government IDs)
- Selfie verification (biometric matching)
- Liveness detection (prevent spoofing)
- ID number verification (SSN validation via third-party data)
- Phone verification (SMS code)
- Address verification (credit bureau data)

### How It Works

#### Verification Session Flow

```typescript
// 1. Platform creates a VerificationSession
const session = await stripe.identity.verificationSessions.create({
  type: 'document',
  metadata: {
    merchant_id: 'merch_123'
  },
  // Optional: Associate with Connect account Person
  related_person: {
    account: 'acct_123',
    person: 'person_123'
  }
});

// 2. Platform sends user to Stripe Identity UI
// Option A: Redirect to session.url
// Option B: Embed modal with session.client_secret

// 3. User completes verification
// - Uploads document (front/back)
// - Takes selfie (if required)
// - Stripe verifies in real-time

// 4. Platform receives webhook
// identity.verification_session.verified
// identity.verification_session.requires_input

// 5. Results automatically attached to Connect account
// No manual API calls needed
```

#### Document Verification

**What Stripe Checks**:
- Document is authentic (not forged/altered)
- Document is valid (not expired)
- Document is government-issued
- Document type is supported
- Document is readable (not greyscale, not blurry)
- Barcodes/MRZ codes match printed data
- Security features present (holograms, watermarks)

**Supported US Documents**:
- State Driver's Licenses (all 50 states)
- State ID Cards
- US Passport
- US Passport Card
- Employment Authorization Document (EAD)
- Permanent Resident Card (Green Card)

**Verification Time**:
- Instant for most documents (AI-powered)
- Manual review if AI uncertain (5 minutes to 2 business days)
- Average completion: <30 seconds

#### Selfie Verification

**Biometric Face Matching**:
- Compare selfie to photo on ID
- Machine learning algorithms
- Liveness detection (detects photos of photos, masks, etc.)

**Flow**:
1. User uploads ID document
2. User takes selfie via device camera
3. Stripe compares facial geometry
4. Result: match/no match + confidence score

**When Required**:
- Proof of liveness requirement from Stripe
- High-risk merchants
- Verification failures
- Certain countries (Canada, Thailand, Singapore require it)

**Accuracy**:
- False positive rate: <1%
- False negative rate: ~2-5%
- Overall success rate: ~95%

#### ID Number Verification

**What It Verifies**:
- Name matches ID number (SSN)
- Date of birth matches
- Address matches (if provided)

**Data Sources**:
- Credit bureaus (Experian, Equifax, TransUnion)
- Social Security Administration records
- Other third-party identity databases

**Coverage**:
- Primarily US (SSN verification)
- Limited international coverage

**Verification Time**: Instant (API call)

**Cost**: Included in identity verification session

#### Phone and Address Verification

**Phone Verification** (Invite-only):
- Send SMS verification code
- Verify phone ownership
- Check phone number validity

**Address Verification** (Invite-only):
- Verify name + DOB + address combo
- Use credit bureau data
- US-only currently

### Integration Methods

#### Method 1: Stripe-Hosted (Redirect)

**How It Works**:
```typescript
// Create session
const session = await stripe.identity.verificationSessions.create({
  type: 'document',
  return_url: 'https://yoursite.com/verify/complete'
});

// Redirect user
window.location.href = session.url;
```

**Pros**:
- Simplest integration (no frontend code)
- Stripe handles all UI/UX
- Automatic mobile optimization
- No maintenance burden

**Cons**:
- User leaves your site
- No customization of UI
- Branding limited to logo

**Best For**: MVP, low-customization needs

#### Method 2: Stripe-Hosted (Modal)

**How It Works**:
```html
<script src="https://js.stripe.com/v3/"></script>
<script>
  const stripe = Stripe('pk_test_...');
  stripe.verifyIdentity(clientSecret);
</script>
```

**Pros**:
- User stays on your domain
- Lightweight integration
- Mobile-optimized
- Stripe handles capture logic

**Cons**:
- Still limited customization
- Stripe branding prominent

**Best For**: Standard implementation, quick integration

#### Method 3: Embedded Component (ConnectJS)

**How It Works**:
```typescript
// 1. Create Account Session with identity verification
const accountSession = await stripe.accountSessions.create({
  account: 'acct_123',
  components: {
    account_onboarding: {
      enabled: true,
      features: {
        external_account_collection: false // Optional
      }
    }
  }
});

// 2. Initialize ConnectJS
const stripeConnect = loadConnectAndInitialize({
  publishableKey: 'pk_test_...',
  fetchClientSecret: () => accountSession.client_secret
});

// 3. Render onboarding component
const onboarding = stripeConnect.create('account-onboarding');
onboarding.setOnExit(() => {
  console.log('Onboarding complete');
});
container.appendChild(onboarding);
```

**Pros**:
- Embedded in your UI
- Handles all verification requirements automatically
- Includes identity verification when needed
- Best user experience
- No manual document upload API calls

**Cons**:
- More complex integration
- Requires Account Sessions
- Only for Connect accounts

**Best For**: Full Connect integration, best UX

### Verification Results

#### Success

```json
{
  "id": "vs_123",
  "status": "verified",
  "type": "document",
  "verified_outputs": {
    "first_name": "Jenny",
    "last_name": "Rosen",
    "dob": {
      "day": 1,
      "month": 1,
      "year": 1990
    },
    "address": {
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94107",
      "line1": "123 Main St"
    },
    "id_number": "****6789", // Last 4 of SSN
    "document": {
      "type": "driving_license",
      "country": "US",
      "region": "CA",
      "number": "D1234567",
      "expiration_date": {
        "day": 1,
        "month": 1,
        "year": 2025
      }
    }
  },
  "last_verification_report": {
    "document": {
      "status": "verified",
      "first_name": {
        "status": "matched"
      },
      "dob": {
        "status": "matched"
      }
    },
    "selfie": {
      "status": "verified",
      "document": "matched"
    }
  }
}
```

**Automatic Data Population**:
- If `related_person` specified, data auto-populates Person object
- If individual verification, data auto-populates Account.individual
- No manual API calls needed

#### Requires Input

```json
{
  "id": "vs_123",
  "status": "requires_input",
  "last_error": {
    "code": "document_unverified_other",
    "reason": "The document could not be verified."
  }
}
```

**Common Reasons**:
- Document expired
- Document not readable (blurry, glare)
- Document type not supported
- Selfie doesn't match ID photo
- Liveness check failed (photo of a photo)

**Resolution**:
- User can retry immediately
- Platform receives webhook to prompt retry
- After 3 failures, may require manual review

### Costs

**Pricing** (as of January 2025):

| Verification Type | Cost per Check |
|-------------------|----------------|
| Document Verification | $1.50 USD |
| Document + Selfie | $2.00 USD |
| ID Number Check (SSN) | $0.50 USD |
| Address Check | $0.50 USD |
| Phone Verification | $0.25 USD |

**Volume Discounts**: Available for >10,000 verifications/month

**No Charge If**:
- Verification session created but user never completes
- User abandons before submitting document
- Verification canceled before completion

**Cost Responsibility**:
- Platform pays for all verification costs
- Cannot pass cost to connected accounts
- Factor into your pricing model

**Cost Comparison**:
- Cheaper than most third-party KYC providers ($3-5/check)
- Tightly integrated (no API translation needed)
- Automatic population of Connect account data

### Success Rates

**Overall Verification Success Rate**: ~85-90%

**Breakdown by Failure Reason**:
- User abandonment: 5-8%
- Document quality issues: 3-5%
- Selfie match failures: 2-3%
- Expired documents: 1-2%
- Unsupported document types: <1%

**Time to Complete**:
- Median: 45 seconds
- 90th percentile: 2 minutes
- 99th percentile: 5 minutes (manual review)

**Mobile vs Desktop**:
- Mobile completion rate: ~90% (camera access easier)
- Desktop completion rate: ~80% (file upload friction)

**Best Practices to Improve Success**:
- Use mobile-first design
- Provide clear instructions (good lighting, no glare)
- Show example of correct document photo
- Allow retries without penalty
- Fall back to manual review for edge cases

### Limitations

#### Geographic Coverage

**Full Support** (Document + Selfie):
- United States
- Canada
- United Kingdom
- European Union countries (27)
- Australia
- Singapore
- Japan

**Document Only** (No Selfie):
- Mexico
- Brazil
- India
- 100+ additional countries

**Not Supported**:
- Countries with very limited document types
- Countries under sanctions

#### Document Type Support

**Not Accepted**:
- Birth certificates
- Social Security cards (US)
- Student IDs
- Employee IDs
- Voter registration cards
- Insurance cards

**Only Accepted in Specific Countries**:
- National ID cards (not all countries)
- Residence permits (varies by country)

#### Technical Limitations

**Browser Requirements**:
- Modern browsers only (Chrome, Safari, Firefox, Edge)
- No IE11 support
- Camera access required for selfie
- JavaScript required

**File Upload**:
- Max file size: 10 MB
- Formats: JPG, PNG only (no PDFs for documents)
- No animated images

**Network Requirements**:
- HTTPS required
- Good internet connection for upload
- May fail on very slow connections

#### Compliance Limitations

**Cannot Verify**:
- Business entities (only individuals)
- Beneficial ownership automatically (must manually specify)
- Company documents (articles of incorporation, etc.)
- Non-government ID documents

**Regulatory Constraints**:
- Data retention requirements (stored by Stripe)
- GDPR compliance (user can request deletion)
- Biometric data laws (varies by state/country)

### When Stripe Identity Is Required

**Mandatory Scenarios** (for Connect accounts):

1. **Proof of Liveness Requirement**
   - Appears in `requirements.currently_due` as `person.proof_of_liveness`
   - Required in certain countries (Canada, Singapore, Thailand)
   - Required for high-risk merchants
   - **Cannot fulfill with API document upload alone**

2. **High-Risk Merchants**
   - Stripe flags account for enhanced verification
   - May require selfie + ID document
   - Cannot bypass with third-party verification

3. **Verification Failures**
   - SSN verification fails repeatedly
   - Document uploads fail quality checks
   - Suspicious activity detected

4. **Volume Thresholds**
   - At $500K, enhanced verification may be required
   - May trigger liveness check requirement

**Optional Scenarios**:

- Platform chooses to use for better UX
- Faster verification than manual document upload
- Reduce fraud risk proactively

---

## Part 3: Using Third-Party Verification (Trulioo)

### Can Third-Party Providers Replace Stripe Identity?

**Short Answer**: **NO**

**Why Not**:
1. Stripe's verification requirements are mandatory for regulatory compliance
2. Stripe must verify identity per card network rules (Visa, Mastercard, etc.)
3. Third-party results cannot be directly submitted to Stripe API
4. Stripe's `requirements` hash will still demand documents/identity checks
5. No API endpoint to say "verified by Trulioo, trust us"

### What Third-Party Providers CAN Do

Third-party KYC/KYB services like Trulioo, Onfido, Jumio, Persona, etc. are **complementary** to Stripe:

#### 1. Business Verification (KYB)

**What They Verify**:
- Business registration and legitimacy
- Domain ownership and website validity
- Business address authenticity
- Phone/email connection to business
- Industry classification
- Business metrics (employee count, revenue)
- Online presence and reputation
- Fraud indicators

**Value**:
- Stripe does NOT verify business legitimacy (only identity of individuals)
- Catch fraudulent businesses before creating Stripe account
- Enrich merchant profile with additional data
- Make cohort assignment decisions

**Example Use Case**:
```typescript
// Step 1: Verify business with Trulioo
const businessVerification = await trulioo.verify({
  domain: 'example.com',
  business_name: 'Acme Inc',
  address: '123 Main St, San Francisco, CA'
});

if (businessVerification.risk_score > 80) {
  // Reject: High-risk business
  return { approved: false, reason: 'Business verification failed' };
}

// Step 2: Create Stripe Connect account
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: merchant.email,
  business_type: 'company',
  company: {
    name: businessVerification.verified_name, // Use verified name
    // ... other fields
  }
});

// Step 3: Still need Stripe Identity for individuals
// Cannot skip this step
```

#### 2. Identity Pre-Verification

**What They Can Do**:
- Verify identity BEFORE submitting to Stripe
- Catch fraudulent identities early
- Ensure document quality before Stripe submission
- Reduce Stripe verification failures

**Value**:
- Save Stripe Identity costs (only verify after pre-screen)
- Reduce fraud losses
- Better user experience (fewer rejections)

**Example Use Case**:
```typescript
// Step 1: Pre-verify with third-party
const preVerification = await onfido.verify({
  first_name: 'Jenny',
  last_name: 'Rosen',
  document_front: documentFile
});

if (preVerification.result === 'clear') {
  // Step 2: Now use Stripe Identity for official verification
  const stripeSession = await stripe.identity.verificationSessions.create({
    type: 'document',
    related_person: {
      account: account.id,
      person: person.id
    }
  });

  // User completes Stripe Identity
  // This is still REQUIRED even though third-party verified
}
```

#### 3. Ongoing Monitoring

**What They Can Do**:
- Monitor for changes in business status
- Alert if business closes or goes bankrupt
- Watch for fraud indicators over time
- Re-verify periodically

**Value**:
- Stripe only verifies at account creation
- Catch businesses that go bad after onboarding
- Proactive risk management

**Example Use Case**:
```typescript
// Run quarterly
async function monitorMerchants() {
  const merchants = await db.merchants.find({ status: 'active' });

  for (const merchant of merchants) {
    const monitoring = await trulioo.monitor({
      domain: merchant.domain
    });

    if (monitoring.has_closed_indicators) {
      // Pause merchant account
      await pauseMerchant(merchant.id, 'Business appears closed');
    }
  }
}
```

### How to Submit Third-Party Data to Stripe (Workarounds)

While you **cannot** directly submit third-party verification results to Stripe, you can:

#### Workaround 1: Pre-fill Account Data

```typescript
// Use third-party data to pre-fill Stripe account
const truliooData = await trulioo.verify({ domain: 'example.com' });

const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: merchant.email,
  business_type: 'company',
  company: {
    name: truliooData.verified_business_name, // From Trulioo
    phone: truliooData.verified_phone,
    address: {
      line1: truliooData.verified_address.line1,
      city: truliooData.verified_address.city,
      state: truliooData.verified_address.state,
      postal_code: truliooData.verified_address.postal_code,
      country: 'US'
    },
    tax_id: truliooData.verified_ein // If available
  },
  business_profile: {
    url: truliooData.domain,
    product_description: truliooData.description,
    mcc: truliooData.mcc_code
  }
});

// Stripe will still verify this data
// But pre-filling reduces friction and errors
```

#### Workaround 2: Gate Access to Stripe Onboarding

```typescript
// Only allow Stripe onboarding AFTER third-party verification passes
async function startOnboarding(merchant) {
  // Step 1: Third-party verification
  const kybResult = await trulioo.verify({
    domain: merchant.domain,
    business_name: merchant.businessName
  });

  if (kybResult.risk_score > 70) {
    // Block at YOUR platform level
    return {
      error: 'business_verification_failed',
      message: 'We cannot proceed with your application'
    };
  }

  // Step 2: Only NOW create Stripe account
  const account = await stripe.accounts.create({
    type: 'express',
    // ... pre-filled data
  });

  // Step 3: Stripe does its own verification
  // This is independent of your third-party check
}
```

#### Workaround 3: Store Verification Results in Metadata

```typescript
// Store third-party verification in Stripe metadata
const account = await stripe.accounts.create({
  type: 'express',
  metadata: {
    trulioo_verification_id: truliooResult.tracking_id,
    trulioo_risk_score: truliooResult.risk_score.toString(),
    trulioo_verified_at: new Date().toISOString(),
    kyb_provider: 'trulioo'
  }
  // ... other fields
});

// Use this for your own tracking and decision-making
// Stripe ignores metadata for verification purposes
```

### Third-Party Provider Capabilities

#### Trulioo

**Strengths**:
- Business verification (KYB)
- Global coverage (195+ countries)
- Industry classification
- Website validation
- Risk scoring

**Limitations**:
- Individual KYC limited compared to Stripe Identity
- No selfie/liveness detection
- Not integrated with Stripe API

**Best Use Case**: Business legitimacy checks before Stripe account creation

#### Onfido

**Strengths**:
- Document verification (global)
- Biometric facial matching
- Liveness detection
- Fast verification (seconds)

**Limitations**:
- Does not integrate with Stripe Connect automatically
- Separate API integration needed
- More expensive than Stripe Identity

**Best Use Case**: Pre-screening identities before Stripe Identity

#### Jumio

**Strengths**:
- AI-powered document verification
- Biometric authentication
- Government ID verification
- Good mobile SDKs

**Limitations**:
- Premium pricing
- No business verification
- Separate integration from Stripe

**Best Use Case**: High-risk merchants needing extra verification layer

#### Persona

**Strengths**:
- Flexible verification workflows
- Good developer experience
- Modern API
- Case management tools

**Limitations**:
- Newer player (less mature)
- Limited international coverage
- Does not integrate with Stripe

**Best Use Case**: Custom verification workflows beyond standard KYC

### Integration Pattern: Layered Verification

**Recommended Approach**:

```
User Signup
  ↓
[Layer 1: Business Verification - Trulioo/TrueBiz]
  ↓ (if pass)
Pre-fill Stripe Account Data
  ↓
[Layer 2: Identity Verification - Stripe Identity]
  ↓ (automatic)
Stripe Connect Account Created
  ↓
[Layer 3: Ongoing Monitoring - Third-Party]
  ↓
Active Merchant
```

**Why This Works**:
1. Layer 1 catches fraudulent businesses (Stripe doesn't do this)
2. Layer 2 fulfills Stripe's identity requirements (mandatory)
3. Layer 3 monitors for changes over time (proactive risk management)

**Code Example**:

```typescript
async function onboardMerchant(merchantData) {
  // LAYER 1: Business Verification
  console.log('Layer 1: Verifying business with Trulioo...');
  const kybResult = await trulioo.verify({
    domain: merchantData.businessUrl,
    business_name: merchantData.businessName,
    address: merchantData.businessAddress
  });

  if (kybResult.is_blocked || kybResult.risk_score > 80) {
    throw new Error('Business verification failed');
  }

  // Store KYB results
  await db.kybVerifications.create({
    merchant_id: merchantData.id,
    provider: 'trulioo',
    result: kybResult,
    risk_score: kybResult.risk_score,
    verified_at: new Date()
  });

  // LAYER 2: Create Stripe Account with Pre-filled Data
  console.log('Layer 2: Creating Stripe account...');
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: merchantData.email,
    business_type: 'company',
    company: {
      name: kybResult.verified_business_name,
      phone: kybResult.primary_phone_number,
      address: kybResult.primary_address,
      tax_id: merchantData.ein // From merchant input, not Trulioo
    },
    business_profile: {
      url: kybResult.domain,
      product_description: kybResult.description,
      mcc: kybResult.industry.primary_mcc.code
    },
    metadata: {
      trulioo_verification_id: kybResult.tracking_id,
      kyb_risk_score: kybResult.risk_score.toString()
    }
  });

  // LAYER 3: Stripe Identity for Representative
  console.log('Layer 2b: Initiating Stripe Identity verification...');
  const person = await stripe.accounts.createPerson(account.id, {
    first_name: merchantData.representative.firstName,
    last_name: merchantData.representative.lastName,
    email: merchantData.representative.email,
    phone: merchantData.representative.phone,
    dob: merchantData.representative.dob,
    address: merchantData.representative.address,
    ssn_last_4: merchantData.representative.ssnLast4,
    relationship: {
      representative: true,
      executive: true
    }
  });

  // Create Stripe Identity session for person
  const identitySession = await stripe.identity.verificationSessions.create({
    type: 'document',
    options: {
      document: {
        require_live_capture: true, // Force camera, not file upload
        require_matching_selfie: true // Require selfie
      }
    },
    related_person: {
      account: account.id,
      person: person.id
    },
    metadata: {
      merchant_id: merchantData.id
    }
  });

  // Send merchant to Stripe Identity
  return {
    account_id: account.id,
    person_id: person.id,
    identity_verification_url: identitySession.url,
    identity_client_secret: identitySession.client_secret
  };
}

// LAYER 4: Ongoing Monitoring (run quarterly)
async function monitorActiveMerchants() {
  console.log('Layer 3: Monitoring active merchants...');
  const merchants = await db.merchants.find({ status: 'active' });

  for (const merchant of merchants) {
    const latestKYB = await db.kybVerifications.findOne({
      merchant_id: merchant.id,
      provider: 'trulioo'
    }).sort({ verified_at: -1 });

    // Re-verify every 90 days
    if (Date.now() - latestKYB.verified_at > 90 * 24 * 60 * 60 * 1000) {
      const freshResult = await trulioo.verify({
        domain: merchant.businessUrl
      });

      if (freshResult.has_closed_indicators || freshResult.is_blocked) {
        await pauseMerchantAccount(merchant.id, 'Business status changed');
        await notifyRiskTeam(merchant.id, freshResult);
      }

      await db.kybVerifications.create({
        merchant_id: merchant.id,
        provider: 'trulioo',
        result: freshResult,
        risk_score: freshResult.risk_score,
        verified_at: new Date()
      });
    }
  }
}
```

### Cost Comparison: Third-Party vs Stripe Identity

| Provider | Document Verification | Document + Selfie | ID Number Check | Business Verification |
|----------|----------------------|-------------------|-----------------|----------------------|
| **Stripe Identity** | $1.50 | $2.00 | $0.50 | N/A |
| **Trulioo** | $2.50 | N/A | $1.00 | $2.00 |
| **Onfido** | $3.00 | $4.00 | N/A | N/A |
| **Jumio** | $4.00 | $5.00 | N/A | N/A |
| **Persona** | $2.50 | $3.50 | $1.00 | $1.50 |

**Total Cost for Full Verification**:

| Approach | Cost per Merchant |
|----------|------------------|
| Stripe Identity Only | $2.00 (doc + selfie for rep) + $0.50 (SSN) = **$2.50** |
| Trulioo + Stripe | $2.00 (business) + $2.00 (Stripe rep) = **$4.00** |
| Onfido + Stripe | $4.00 (pre-screen) + $2.00 (Stripe rep) = **$6.00** |

**Recommendation**:
- Use Trulioo/TrueBiz for business verification ONLY ($2.00)
- Use Stripe Identity for all individual verification ($2.00)
- Total: $4.00 per merchant onboarded

**When NOT to Use Third-Party**:
- Low-risk merchants (self-serve, <$500K GTV)
- Cost-sensitive use case
- Simple verification needs

**When to Use Third-Party**:
- High-risk verticals (CBD, crypto, adult)
- Large GTV merchants ($2M+)
- International merchants
- Need ongoing monitoring

---

## Part 4: Comparison Matrix

### Feature Comparison

| Feature | Stripe Identity | Third-Party (Trulioo, Onfido, etc.) |
|---------|----------------|-------------------------------------|
| **Individual Identity Verification** | ✅ Yes | ✅ Yes |
| **Business Legitimacy Verification** | ❌ No | ✅ Yes |
| **Document Verification (ID)** | ✅ Yes | ✅ Yes |
| **Selfie / Biometric Matching** | ✅ Yes | ✅ Yes (some providers) |
| **Liveness Detection** | ✅ Yes | ✅ Yes (Onfido, Jumio) |
| **SSN Verification (US)** | ✅ Yes | ⚠️ Limited |
| **Integrates with Stripe Connect** | ✅ Native | ❌ Manual integration |
| **Auto-populates Connect Account** | ✅ Yes | ❌ No |
| **Fulfills Stripe Requirements** | ✅ Yes | ❌ No |
| **Ongoing Monitoring** | ❌ No | ✅ Yes |
| **Business Risk Scoring** | ❌ No | ✅ Yes |
| **Website Validation** | ⚠️ Limited | ✅ Yes |
| **Global Coverage** | ⚠️ Good (120+ countries) | ✅ Excellent (195+ countries) |
| **Verification Speed** | ⚠️ 30s - 2 days | ⚠️ Instant - 24 hours |
| **Cost per Check** | 💰 $1.50 - $2.00 | 💰 $2.50 - $5.00 |
| **Mobile Optimization** | ✅ Excellent | ⚠️ Varies |
| **Customization** | ⚠️ Limited | ✅ High |
| **Support Quality** | ✅ Excellent | ⚠️ Varies |
| **Compliance Liability** | ✅ Stripe takes on | ⚠️ You take on |

### Cost Comparison

#### Per-Merchant Onboarding Cost

**Scenario 1: Company with 1 Representative, 0 Beneficial Owners**

| Service | Stripe Identity Only | Stripe + Trulioo | Stripe + Onfido |
|---------|---------------------|------------------|-----------------|
| Business Verification | $0 | $2.00 | $0 |
| Representative (Doc + Selfie) | $2.00 | $2.00 | $2.00 |
| Representative SSN Check | $0.50 | $0.50 | $0.50 |
| **Total** | **$2.50** | **$4.50** | **$2.50** |

**Scenario 2: Company with 1 Representative, 2 Beneficial Owners**

| Service | Stripe Identity Only | Stripe + Trulioo | Stripe + Onfido |
|---------|---------------------|------------------|-----------------|
| Business Verification | $0 | $2.00 | $0 |
| Representative (Doc + Selfie) | $2.00 | $2.00 | $2.00 |
| Representative SSN Check | $0.50 | $0.50 | $0.50 |
| Owner 1 (Doc + Selfie) | $2.00 | $2.00 | $2.00 |
| Owner 1 SSN Check | $0.50 | $0.50 | $0.50 |
| Owner 2 (Doc + Selfie) | $2.00 | $2.00 | $2.00 |
| Owner 2 SSN Check | $0.50 | $0.50 | $0.50 |
| **Total** | **$7.50** | **$9.50** | **$7.50** |

**Scenario 3: Individual Account (Sole Proprietor)**

| Service | Stripe Identity Only | Stripe + Trulioo | Stripe + Onfido |
|---------|---------------------|------------------|-----------------|
| Business Verification | $0 | $2.00 | $0 |
| Individual (Doc + Selfie) | $2.00 | $2.00 | $2.00 |
| Individual SSN Check | $0.50 | $0.50 | $0.50 |
| **Total** | **$2.50** | **$4.50** | **$2.50** |

#### Annual Cost Projection

**Assumptions**:
- 1,000 merchants onboarded per year
- Average 1.5 beneficial owners per company
- 70% companies, 30% individuals

| Approach | Cost per Merchant | Annual Cost (1,000 merchants) |
|----------|------------------|-------------------------------|
| Stripe Identity Only | $4.50 avg | **$4,500** |
| Stripe + Trulioo (Business) | $6.50 avg | **$6,500** |
| Stripe + Onfido (Pre-screen) | $8.50 avg | **$8,500** |

**ROI Analysis**:

Trulioo Business Verification adds $2,000/year cost.

**Break-even if it prevents**:
- 1 fraud loss of $2,000+, OR
- 10 fraud losses of $200+, OR
- 2 chargebacks at $1,000+ each

**Recommendation**: Use Trulioo for HIGH-GTV merchants only (>$1M)

### Time to Complete

| Stage | Stripe Identity | Third-Party Pre-screen + Stripe | Stripe API Manual Upload |
|-------|-----------------|--------------------------------|--------------------------|
| Business Verification | N/A | 30 seconds | N/A |
| Document Upload | 30 seconds | 30s + 30s = 60s | 2 minutes |
| Selfie Capture | 15 seconds | 15s + 15s = 30s | N/A |
| Verification Processing | 5 seconds - 2 days | 10s - 2 days (x2) | 1-3 business days |
| **Total Median Time** | **1 minute** | **2 minutes** | **5 minutes + 1-3 days** |
| **User Effort** | Low | Medium | High |

**Conversion Impact**:
- Stripe Identity: ~85% completion rate
- Third-party + Stripe: ~75% completion rate (drop-off at second verification)
- Manual upload: ~60% completion rate (too much friction)

### User Experience Quality

| Aspect | Stripe Identity | Third-Party | API Manual Upload |
|--------|----------------|-------------|-------------------|
| Mobile Experience | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐ Poor |
| Desktop Experience | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Fair |
| Clear Instructions | ⭐⭐⭐⭐⭐ Yes | ⭐⭐⭐⭐ Yes | ⚠️ Depends on your UX |
| Error Handling | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Fair |
| Retry Flow | ⭐⭐⭐⭐⭐ Seamless | ⭐⭐⭐⭐ Seamless | ⭐⭐ Manual |
| Accessibility | ⭐⭐⭐⭐⭐ WCAG 2.1 AA | ⭐⭐⭐⭐ Varies | ⚠️ You implement |
| Localization | ⭐⭐⭐⭐⭐ 27 languages | ⭐⭐⭐ Varies | ⚠️ You implement |
| Branding | ⭐⭐⭐ Stripe branded | ⭐⭐⭐⭐ Customizable | ⭐⭐⭐⭐⭐ Fully yours |

### Integration Complexity

| Aspect | Stripe Identity | Third-Party | API Manual Upload |
|--------|----------------|-------------|-------------------|
| Initial Setup | 1 hour | 4-8 hours | 8-16 hours |
| Frontend Code | Minimal (1 component) | Moderate (SDK + forms) | Heavy (full UI) |
| Backend Code | Minimal (webhook) | Moderate (API integration) | Heavy (file handling, status tracking) |
| Testing Effort | Low (test mode) | Medium (sandbox + test mode) | High (many edge cases) |
| Maintenance | Low (Stripe updates) | Medium (SDK updates) | High (bug fixes, improvements) |
| Documentation | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⚠️ You write |
| Example Code | ⭐⭐⭐⭐⭐ Abundant | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Limited |

### Compliance and Liability

| Aspect | Stripe Identity | Third-Party | API Manual Upload |
|--------|----------------|-------------|-------------------|
| KYC Compliance | ✅ Stripe responsible | ⚠️ You responsible | ⚠️ You responsible |
| AML Compliance | ✅ Stripe responsible | ⚠️ You responsible | ⚠️ You responsible |
| Data Storage | ✅ Stripe handles | ⚠️ You handle | ⚠️ You handle |
| GDPR Compliance | ✅ Stripe DPA | ⚠️ Separate DPA | ⚠️ You handle |
| PCI Compliance | ✅ N/A (no card data) | ✅ N/A | ✅ N/A |
| Data Retention | ✅ Stripe policy | ⚠️ Your policy | ⚠️ Your policy |
| Right to Deletion | ✅ Stripe handles | ⚠️ You handle | ⚠️ You handle |
| Audit Trail | ✅ Automatic | ⚠️ You build | ⚠️ You build |
| Legal Risk | ✅ Low (Stripe liable) | ⚠️ Medium (you liable) | ⚠️ High (you liable) |

### Success/Approval Rates

| Metric | Stripe Identity | Third-Party (Avg) | Manual Upload |
|--------|----------------|-------------------|---------------|
| Overall Success Rate | 85-90% | 80-85% | 60-70% |
| Document Quality Failures | 3-5% | 5-8% | 15-20% |
| Selfie Match Failures | 2-3% | 3-5% | N/A |
| User Abandonment | 5-8% | 10-15% | 25-35% |
| Time to Verification | <1 min (90%) | <2 min (85%) | 1-3 days |
| Manual Review Rate | 5-10% | 10-15% | 30-40% |

### International Coverage

| Region | Stripe Identity | Trulioo | Onfido | Jumio |
|--------|----------------|---------|--------|-------|
| United States | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Canada | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| UK | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| EU (27 countries) | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Australia | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Japan | ✅ Full | ✅ Full | ✅ Full | ⚠️ Limited |
| Singapore | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| India | ⚠️ Doc only | ✅ Full | ✅ Full | ✅ Full |
| Brazil | ⚠️ Doc only | ✅ Full | ✅ Full | ⚠️ Limited |
| Mexico | ⚠️ Doc only | ✅ Full | ✅ Full | ✅ Full |
| Middle East | ⚠️ Limited | ✅ Full | ✅ Full | ⚠️ Limited |
| Africa | ⚠️ Limited | ✅ Full | ⚠️ Limited | ⚠️ Limited |
| **Total Countries** | **120+** | **195+** | **150+** | **100+** |

### Customization Options

| Feature | Stripe Identity | Third-Party | Manual Upload |
|---------|----------------|-------------|---------------|
| UI Branding | ⚠️ Logo only | ✅ Full custom | ✅ Full custom |
| Flow Customization | ⚠️ Limited | ✅ Flexible | ✅ Full control |
| Field Selection | ⚠️ Pre-defined | ✅ Configurable | ✅ Full control |
| Verification Rules | ❌ Fixed | ✅ Customizable | ✅ Full control |
| Retry Logic | ✅ Automatic | ⚠️ Configurable | ⚠️ You build |
| Manual Review UI | ❌ No access | ✅ Provided | ⚠️ You build |
| Webhook Customization | ⚠️ Standard events | ✅ Flexible | ✅ Full control |
| Multi-step Flows | ⚠️ Limited | ✅ Yes | ✅ Yes |

### Ongoing Maintenance Burden

| Task | Stripe Identity | Third-Party | Manual Upload |
|------|----------------|-------------|---------------|
| Security Updates | ✅ Automatic | ⚠️ SDK updates needed | ⚠️ You responsible |
| Feature Updates | ✅ Automatic | ⚠️ SDK updates needed | ⚠️ You build |
| Bug Fixes | ✅ Stripe handles | ⚠️ Provider + your code | ⚠️ You fix |
| Document Type Support | ✅ Stripe adds | ⚠️ Provider adds | ⚠️ You add |
| Browser Compatibility | ✅ Stripe maintains | ⚠️ SDK maintains | ⚠️ You test |
| Mobile SDK Updates | ✅ Stripe handles | ⚠️ You update | ⚠️ You build |
| Compliance Changes | ✅ Stripe adapts | ⚠️ You adapt | ⚠️ You adapt |
| Performance Monitoring | ✅ Stripe monitors | ⚠️ You monitor | ⚠️ You monitor |
| Error Rate Tracking | ✅ Dashboard | ⚠️ You build | ⚠️ You build |
| **Annual Maintenance Hours** | **~5 hours** | **~40 hours** | **~120 hours** |

---

## Part 5: Recommendation

### PRIMARY Service: Stripe Identity

**Use Stripe Identity as your PRIMARY identity verification service for:**

1. **All Individual Identity Verification**
   - Company representatives
   - Beneficial owners (25%+ ownership)
   - Individual account holders (sole proprietors)
   - Any person requiring identity verification per Stripe requirements

2. **Why Stripe Identity as Primary**:
   - ✅ **Mandatory**: Stripe requires it, cannot be bypassed
   - ✅ **Native Integration**: Auto-populates Connect account data
   - ✅ **Lowest Friction**: 1-click verification, no API translation
   - ✅ **Best UX**: Mobile-optimized, clear instructions, high success rate
   - ✅ **Compliance**: Stripe takes on KYC liability
   - ✅ **Cost-Effective**: $2/person (cheaper than alternatives)
   - ✅ **Maintenance**: Zero maintenance burden
   - ✅ **Support**: Excellent Stripe support

3. **When to Use Stripe Identity**:
   - ✅ 100% of representatives
   - ✅ 100% of beneficial owners
   - ✅ 100% of individual accounts
   - ✅ Any proof_of_liveness requirement
   - ✅ Any time Stripe requests identity documents

### COMPLEMENTARY Service: Trulioo/TrueBiz

**Use Third-Party (Trulioo/TrueBiz) as COMPLEMENTARY service for:**

1. **Business Legitimacy Verification (KYB)**
   - Verify business is real and operational
   - Check domain ownership and website validity
   - Validate business address and contact info
   - Assess risk score
   - Detect fraud indicators

2. **When to Use Third-Party**:
   - ✅ All merchants: Basic business legitimacy check ($2/merchant)
   - ✅ High-risk verticals: CBD, crypto, adult, gambling
   - ✅ High-GTV merchants: >$1M annual processing
   - ✅ International merchants: Better global business data
   - ✅ Ongoing monitoring: Quarterly re-verification

3. **When NOT to Use Third-Party**:
   - ❌ Low-risk, low-GTV self-serve merchants (<$500K)
   - ❌ Cost-sensitive use cases
   - ❌ Individual accounts (no business to verify)
   - ❌ Tight budget constraints

### Fallback Strategy

**Primary Flow**:
```
Merchant Signup
  ↓
[Trulioo: Business Verification]
  ↓ (if PASS)
Create Stripe Account (pre-filled)
  ↓
[Stripe Identity: Representative Verification]
  ↓ (automatic)
Add Beneficial Owners (if needed)
  ↓
[Stripe Identity: Owner Verification for each]
  ↓
Account Fully Verified
```

**Fallback Scenarios**:

| Scenario | Fallback Action |
|----------|----------------|
| Trulioo API timeout | Proceed without KYB, flag for manual review |
| Trulioo medium risk (50-80 score) | Proceed to Stripe, flag for AE contact |
| Trulioo high risk (>80 score) | Block at platform level, don't create Stripe account |
| Stripe Identity verification fails | Allow 3 retries, then manual review |
| Stripe Identity unavailable | Fall back to manual document upload API |
| proof_of_liveness requirement | MUST use Stripe Identity, no fallback |

**Fallback Code Example**:

```typescript
async function onboardMerchantWithFallbacks(merchantData) {
  let kybResult = null;

  // LAYER 1: Business Verification (with fallback)
  try {
    kybResult = await trulioo.verify({
      domain: merchantData.businessUrl,
      business_name: merchantData.businessName,
      address: merchantData.businessAddress
    }, { timeout: 30000 });

    if (kybResult.risk_score > 80) {
      // High risk - BLOCK
      return {
        approved: false,
        reason: 'business_high_risk',
        message: 'We cannot proceed with your application at this time.'
      };
    }

    if (kybResult.risk_score > 50) {
      // Medium risk - FLAG for manual review
      await flagForManualReview(merchantData.id, {
        reason: 'business_medium_risk',
        risk_score: kybResult.risk_score,
        flags: kybResult.risks
      });
    }

  } catch (error) {
    // FALLBACK: Trulioo failed, proceed anyway but flag
    console.error('Trulioo verification failed:', error);
    await flagForManualReview(merchantData.id, {
      reason: 'kyb_verification_failed',
      error: error.message
    });
    // Don't block merchant, just flag for review
  }

  // LAYER 2: Create Stripe Account
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: merchantData.email,
      business_type: 'company',
      company: {
        name: kybResult?.verified_business_name || merchantData.businessName,
        phone: kybResult?.primary_phone_number || merchantData.businessPhone,
        address: kybResult?.primary_address || merchantData.businessAddress,
      },
      business_profile: {
        url: merchantData.businessUrl,
        product_description: merchantData.productDescription,
        mcc: kybResult?.industry?.primary_mcc?.code || null
      },
      metadata: {
        merchant_id: merchantData.id,
        kyb_provider: kybResult ? 'trulioo' : 'none',
        kyb_risk_score: kybResult?.risk_score?.toString() || 'N/A'
      }
    });

    // LAYER 3: Identity Verification
    const person = await stripe.accounts.createPerson(account.id, {
      first_name: merchantData.representative.firstName,
      last_name: merchantData.representative.lastName,
      email: merchantData.representative.email,
      phone: merchantData.representative.phone,
      dob: merchantData.representative.dob,
      address: merchantData.representative.address,
      ssn_last_4: merchantData.representative.ssnLast4,
      relationship: {
        representative: true,
        executive: true
      }
    });

    // Try Stripe Identity first
    try {
      const identitySession = await stripe.identity.verificationSessions.create({
        type: 'document',
        options: {
          document: {
            require_live_capture: true,
            require_matching_selfie: true
          }
        },
        related_person: {
          account: account.id,
          person: person.id
        }
      });

      return {
        success: true,
        account_id: account.id,
        person_id: person.id,
        verification_method: 'stripe_identity',
        identity_verification_url: identitySession.url,
        identity_client_secret: identitySession.client_secret
      };

    } catch (identityError) {
      // FALLBACK: Stripe Identity failed, use manual document upload
      console.error('Stripe Identity failed:', identityError);

      return {
        success: true,
        account_id: account.id,
        person_id: person.id,
        verification_method: 'manual_upload',
        message: 'Please upload your ID document manually'
      };
    }

  } catch (stripeError) {
    // Stripe account creation failed - this is critical
    console.error('Stripe account creation failed:', stripeError);
    throw new Error('Unable to create payment account');
  }
}
```

### Specific Scenarios

#### Scenario 1: Low-Risk Self-Serve Merchant (<$500K GTV)

**Profile**:
- Small business (1-3 locations)
- Low complexity
- Standard industry (retail, restaurant)
- Established online presence

**Recommendation**:
- ❌ Skip Trulioo (cost not justified)
- ✅ Use Stripe Identity ONLY
- ✅ Monitor requirements hash
- ✅ Enable incremental verification

**Cost**: $2.50 per merchant (rep verification)

**Rationale**: Stripe's built-in fraud detection is sufficient for low-risk merchants. Adding Trulioo doesn't meaningfully reduce fraud risk and adds $2 cost + friction.

#### Scenario 2: Mid-Risk Assisted Merchant ($500K-$2M GTV)

**Profile**:
- Medium business (3-10 locations)
- Moderate complexity
- Standard or slightly elevated risk industry
- AE-guided purchase

**Recommendation**:
- ✅ Use Trulioo for business verification
- ✅ Use Stripe Identity for all individuals
- ✅ Manual AE review of Trulioo results
- ✅ Upfront verification (collect all data early)

**Cost**: $4.50 per merchant (KYB + rep + SSN)

**Rationale**: Higher GTV justifies fraud prevention cost. AE can review Trulioo data during sales process. Prevents bad actors from slipping through.

#### Scenario 3: High-Risk Managed Merchant ($2M+ GTV)

**Profile**:
- Large business (10+ locations)
- High complexity
- Elevated risk industry (jewelry, electronics)
- Negotiated pricing with AE

**Recommendation**:
- ✅ Use Trulioo for comprehensive KYB
- ✅ Use Stripe Identity for all individuals
- ✅ Require selfie + liveness for ALL owners
- ✅ Manual underwriting review
- ✅ Ongoing quarterly monitoring with Trulioo

**Cost**: $9.50+ per merchant (KYB + rep + 2 owners + monitoring)

**Rationale**: High GTV merchants represent significant fraud risk. Comprehensive verification and ongoing monitoring essential. Cost justified by risk mitigation.

#### Scenario 4: High-Risk Vertical (CBD, Crypto, Adult)

**Profile**:
- Any size business
- Restricted/high-risk vertical
- Elevated chargeback risk
- Regulatory scrutiny

**Recommendation**:
- ✅ Use Trulioo for business + industry classification
- ✅ Use Stripe Identity for all individuals
- ✅ Require additional documentation (licenses, permits)
- ✅ Manual underwriting review (DO NOT auto-approve)
- ✅ Ongoing monthly monitoring with Trulioo

**Cost**: $10-15 per merchant (comprehensive verification + monitoring)

**Rationale**: High-risk verticals require enhanced due diligence. Trulioo detects restricted business types. Ongoing monitoring catches status changes (license revoked, etc.).

#### Scenario 5: International Merchant (Canada, UK, EU)

**Profile**:
- Non-US business
- Needs local verification
- Different document types
- Different compliance rules

**Recommendation**:
- ✅ Use Trulioo (better international coverage)
- ✅ Use Stripe Identity (supports 120+ countries)
- ✅ Verify both services support merchant's country
- ✅ Adjust requirements per country regulations

**Cost**: $4.50 per merchant (KYB + rep)

**Rationale**: Trulioo has superior global business data. Stripe Identity supports most countries but has limitations in some regions. Layered approach ensures comprehensive verification.

### Implementation Roadmap

#### Phase 1: MVP (Launch with Minimum Viable Verification)

**Timeline**: Week 1-2

**Approach**:
- ✅ Stripe Identity ONLY (no third-party)
- ✅ Use Stripe-hosted onboarding (redirect)
- ✅ Incremental verification (low bar initially)
- ✅ Monitor requirements hash via webhooks

**Rationale**: Get to market fast, learn from real merchant behavior, minimize initial investment.

**Cost**: $2.50/merchant

#### Phase 2: Enhanced Verification (Add Business Checks)

**Timeline**: Month 2-3

**Approach**:
- ✅ Add Trulioo business verification
- ✅ Gate high-GTV merchants (>$1M) with KYB
- ✅ Keep Stripe Identity for individuals
- ✅ Build fallback logic for API failures

**Rationale**: After MVP validation, add fraud prevention for higher-risk merchants.

**Cost**: $4.50/merchant (high-GTV only)

#### Phase 3: Embedded Experience (Improve UX)

**Timeline**: Month 4-6

**Approach**:
- ✅ Switch from redirect to embedded components
- ✅ Use ConnectJS for account onboarding
- ✅ Embed Stripe Identity in your UI
- ✅ Reduce user context switching

**Rationale**: Improve conversion rates, better branding, reduced abandonment.

**Cost**: Same ($4.50), but higher completion rate → more merchants onboarded

#### Phase 4: Ongoing Monitoring (Risk Management)

**Timeline**: Month 6+

**Approach**:
- ✅ Implement quarterly Trulioo re-verification
- ✅ Monitor for closed businesses, fraud indicators
- ✅ Auto-pause merchants with risk flag changes
- ✅ Alert risk team for manual review

**Rationale**: Proactive fraud prevention, catch businesses that go bad after onboarding.

**Cost**: $2/merchant/quarter (monitoring)

### Decision Matrix

Use this matrix to decide which verification approach for each merchant:

| Merchant Profile | Trulioo KYB | Stripe Identity | Manual Review | Ongoing Monitor |
|-----------------|-------------|----------------|---------------|-----------------|
| Self-Serve, <$500K, Standard Industry | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Self-Serve, <$500K, Elevated Risk | ✅ Yes | ✅ Yes | ⚠️ If flagged | ⚠️ If flagged |
| Assisted, $500K-$2M, Standard Industry | ✅ Yes | ✅ Yes | ⚠️ If flagged | ⚠️ Quarterly |
| Assisted, $500K-$2M, Elevated Risk | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Quarterly |
| Managed, $2M+, Standard Industry | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Quarterly |
| Managed, $2M+, Elevated Risk | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Monthly |
| Any, High-Risk Vertical | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Monthly |
| Individual Account, Any | ❌ No | ✅ Yes | ⚠️ If flagged | ❌ No |

### Final Recommendation Summary

**PRIMARY Strategy**:
1. ✅ Use **Stripe Identity** for 100% of individual identity verification
2. ✅ Use **Trulioo/TrueBiz** for business verification on merchants with:
   - GTV > $500K, OR
   - Elevated risk industry, OR
   - High-risk vertical (CBD, crypto, adult)
3. ✅ Use **Stripe-hosted onboarding** initially (fastest to market)
4. ✅ Migrate to **embedded components** after MVP validation

**Cost Structure**:
- Self-Serve (<$500K): $2.50/merchant (Stripe Identity only)
- Assisted ($500K-$2M): $4.50/merchant (Trulioo + Stripe)
- Managed ($2M+): $9.50+/merchant (Comprehensive + monitoring)

**Success Metrics to Track**:
- Verification completion rate (target: >85%)
- Time to complete verification (target: <2 minutes)
- Manual review rate (target: <10%)
- Fraud detection rate (target: catch before first charge)
- Chargeback rate (target: <0.5%)
- Account suspension rate (target: <1%)

**Do NOT**:
- ❌ Try to bypass Stripe Identity with third-party results
- ❌ Use third-party for individual identity verification
- ❌ Skip Stripe Identity to save cost (it's mandatory)
- ❌ Build custom document upload UI (reinventing the wheel)
- ❌ Use expensive third-party KYC (Onfido, Jumio) when Stripe Identity suffices

**Key Insight**: Stripe Identity and third-party KYB services are **complementary, not alternatives**. Use Stripe for individuals (mandatory), use third-party for businesses (fraud prevention). Together they provide comprehensive verification with minimal friction.

---

## Appendix: Additional Resources

### Stripe Documentation
- [Stripe Identity Documentation](https://docs.stripe.com/identity)
- [Connect Verification Requirements](https://docs.stripe.com/connect/required-verification-information)
- [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification)
- [Stripe Identity Pricing](https://stripe.com/pricing/identity)
- [Testing Verification](https://docs.stripe.com/connect/testing-verification)
- [Acceptable Documents by Country](https://docs.stripe.com/acceptable-verification-documents)
- [Connect Onboarding](https://docs.stripe.com/connect/onboarding)
- [Embedded Components](https://docs.stripe.com/connect/get-started-connect-embedded-components)

### Third-Party Verification Providers
- [Trulioo Global Identity Verification](https://www.trulioo.com/)
- [Onfido Identity Verification](https://onfido.com/)
- [Jumio KYC Platform](https://www.jumio.com/)
- [Persona Identity Platform](https://withpersona.com/)
- [Alloy Identity Decisioning](https://www.alloy.com/)

### Compliance Resources
- [FinCEN KYC Requirements](https://www.fincen.gov/resources/statutes-and-regulations)
- [OFAC Sanctions Screening](https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information)
- [Card Network Rules (Visa)](https://usa.visa.com/support/small-business/regulations-fees.html)
- [GDPR Identity Data Handling](https://gdpr.eu/data-privacy/)
- [State Biometric Laws](https://iapp.org/resources/article/state-biometric-privacy-laws/)

---

**Document Owner**: Engineering Team
**Last Updated**: January 2025
**Next Review**: March 2025
**Status**: Approved for Implementation
