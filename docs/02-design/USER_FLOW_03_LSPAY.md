# User Flow 3: Lightspeed Payments Activation

Complete documentation for merchant identity verification and payment activation from dashboard tasks through payment processing capability.

---

## Document Overview

This document describes the merchant experience for activating Lightspeed Payments using Stripe Connect. The flow covers data collection, verification timing, and when merchants can accept payments. This is a **prototype design document** focused on user experience and data requirements, not technical implementation.

**Related Flow**: This flow begins after [User Flow 1: Signup](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) completes and the merchant lands on their dashboard.

## Verification Providers

This flow uses multiple verification providers at different stages:

### **TrueBiz** (Business Data Enhancement)
- **When**: At signup (Phase 1)
- **Purpose**: Business data enrichment and pre-population
- **What it does**:
  - Validates business website/domain exists
  - Checks business legitimacy for fraud prevention
  - Enriches business profile with additional data
- **What it's NOT**: Not the official KYC/KYB compliance verification tool

### **Trulioo** (Official KYC/KYB Verification) ✅ Primary Provider
- **When**: Dashboard tasks before purchase (Phase 2)
- **Purpose**: Official identity and business verification for regulatory compliance
- **What it verifies**:
  - **KYC**: Individual identity (representative + beneficial owners 25%+)
  - **KYB**: Business entity verification (company details, EIN, structure)
- **Status**: Currently implemented and active
- **Why**: Required by Stripe and federal regulations (Bank Secrecy Act, AML)

### **Stripe Identity** (Fallback Verification)
- **When**: If Trulioo verification fails OR country regulations require biometric liveness checks
- **Purpose**: Document verification with selfie/liveness checks as fallback option
- **What it does**:
  - Government-issued ID verification (document upload)
  - Biometric liveness checks (selfie with face matching)
  - Required for EU/UK merchants or when automated verification needs visual confirmation
- **Note**: See [Stripe Identity Integration](../05-integrations/STRIPE_IDENTITY_VERIFICATION.md) for technical details

---

## Table of Contents

1. [Verification Providers](#verification-providers)
2. [Key Architecture Principles](#key-architecture-principles)
3. [User Journey Overview](#user-journey-overview)
4. [Data Collection (Dashboard Tasks)](#data-collection-dashboard-tasks)
5. [Verification Processing (After Purchase)](#verification-processing-after-purchase)
6. [Verification Error Handling](#verification-error-handling-what-merchants-see)
7. [Timeline Expectations](#timeline-expectations)
8. [Related Documentation](#related-documentation)

---

## Key Architecture Principles

**Critical Design Decision: "Option B" - Collect Data First, Create Account at Purchase**

1. **Account Created During Purchase**: Stripe account is created WHEN merchant completes purchase, not at signup
2. **Data Pre-Collection**: Identity data is collected via dashboard tasks BEFORE purchase and stored securely
3. **Bulk Submission**: At purchase, Stripe account is created with all pre-collected data at once
4. **Background Verification**: Identity verification processes in background AFTER purchase (1-2 business days)
5. **Payment Activation**: Payments activate automatically when verification completes

**Why This Approach?**
- **Cost Optimization**: Only create Stripe accounts for merchants who actually purchase (60% reduction in abandoned accounts)
- **Better UX**: Merchant can purchase immediately after data collection (no waiting for verification)
- **Stripe's Recommendation**: "Only create an account when you're confident the user will actually use it"

---

## User Journey Overview

This document focuses on the **identity verification** portion of the merchant onboarding journey. For complete end-to-end flow, see:
- [User Flow 1: Signup](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Before this flow
- [User Flow 2: Dashboard](./USER_FLOW_02_DASHBOARD.md) - Parallel to this flow (all 6 tasks)
- [User Flow 4: Purchase](./USER_FLOW_04_PURCHASE.md) - After this flow

```
┌─────────────────────────────────────────────────────────────┐
│ PREREQUISITE: Signup Complete (see USER_FLOW_01)           │
├─────────────────────────────────────────────────────────────┤
│ • Merchant lands on dashboard                               │
│ • Sees 6 tasks (verification is Tasks 1-2)                  │
│ • NO STRIPE ACCOUNT CREATED YET                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Business Representative (KYC Data Collection)      │
├─────────────────────────────────────────────────────────────┤
│ • Merchant completes identity verification form             │
│ • Personal information (name, DOB, SSN last 4)              │
│ • Home address                                              │
│ • Role in business (owner/executive)                        │
│ • ToS acceptance                                            │
│                                                             │
│ → Data SAVED to YOUR database (encrypted)                   │
│ → ToS acceptance captured (date, IP, user agent)            │
│ → NO verification happens yet                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Business Entity (KYB Data Collection)             │
├─────────────────────────────────────────────────────────────┤
│ • Merchant confirms/edits business details                  │
│ • Legal name, structure, EIN                                │
│ • Business address and contact info                         │
│ • Product description                                       │
│                                                             │
│ → Data SAVED to YOUR database                               │
│ → NO verification happens yet                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Beneficial Owners (Conditional - If Applicable)    │
├─────────────────────────────────────────────────────────────┤
│ • Only if multi-member LLC, partnership, or corporation     │
│ • Add all co-owners with 25%+ ownership                     │
│ • Name, DOB, address, SSN last 4, ownership %               │
│                                                             │
│ → Data SAVED to YOUR database                               │
│ → Tasks 1-2 now complete, ready to purchase                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ NEXT: Purchase Flow (see USER_FLOW_04)                     │
├─────────────────────────────────────────────────────────────┤
│ • Merchant selects subscription and hardware                │
│ • Completes checkout                                        │
│ • 🔑 Stripe account created WITH all pre-collected data      │
│ • Order confirmed                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ VERIFICATION PROCESSING (Background - This Document)       │
├─────────────────────────────────────────────────────────────┤
│ • Trulioo KYC: Verifies individuals (1-2 business days)     │
│ • Trulioo KYB: Verifies business entity                     │
│ • Stripe processes results                                  │
│ • Webhook: charges_enabled = true                           │
│ • Payment processing activates                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Collection (Dashboard Tasks)

**Route**: `/dashboard` → Task #1 and Task #2

**Purpose**: Collect identity and business information required for payment processing

**Duration**: 15-20 minutes total

**Critical Note**: Data is collected and stored securely in Lightspeed database. NO Stripe account is created during this phase. Stripe account creation happens at purchase.

---

### Step 1: Business Representative Information (Task #1)

**Dashboard Task**: "Verify Your Identity"

**Estimated Time**: 10-15 minutes

**Verification Provider**: Trulioo (runs after purchase, not during this step)

**Why Required**: Federal law (Bank Secrecy Act, AML) and Stripe require verified identity of the business representative

---

#### What Merchant Sees

**Form Title**: "Verify Your Identity"

**Instructions**: "To accept payments, we need to verify your identity. This is required by federal law."

**Form Sections**:
1. Personal Information
2. Home Address
3. Role in Business
4. Terms & Agreements

---

#### Data Collected

| Field | Pre-filled? | User Action | Why Required |
|-------|-------------|-------------|--------------|
| **Personal Information** |
| First Name | No | Enter | Federal KYC requirement (Bank Secrecy Act) |
| Last Name | No | Enter | Federal KYC requirement |
| Email | Yes (from signup) | Confirm/Edit | Contact for verification issues |
| Your Personal Phone | Yes (from business phone) | Confirm/Edit | Your personal contact number for verification issues (pre-filled with business phone for convenience) |
| Date of Birth | No | Enter (MM/DD/YYYY) | Age verification (18+) and identity check |
| **Home Address** |
| Street Address | No | Enter | Identity verification via credit bureaus |
| City | No | Enter | Identity verification |
| State | No | Select dropdown | Identity verification |
| ZIP Code | No | Enter (5 digits) | Identity verification |
| **Identity Verification** |
| SSN Last 4 | No | Enter (4 digits) | Identity verification (full SSN not required unless verification fails) |
| **Role in Business** |
| Title/Role | No | Select dropdown | Determines authority level and relationship to business |
|  |  | Options: Business Owner, CEO, CFO, President, Partner | Federal law requires representative must be an owner OR executive |
| Ownership % | Conditional | Enter if owner | Required for owners, determines beneficial owner status |
| **Terms & Agreements** |
| ToS Acceptance | No | Check box + timestamp | Legal requirement for Stripe processing |

**ToS Acceptance Checkbox**:
```
☐ I agree to Stripe's Connected Account Agreement and authorize
  Lightspeed to share my information with Stripe for payment processing.

  [Link: View Stripe Connected Account Agreement]
```

**Backend Note - ToS Acceptance Capture**:
When merchant checks this box, the system must capture:
- Acceptance timestamp (ISO 8601 format)
- IP address of the user
- User agent string (browser/device info)

This data is required by Stripe and must be submitted when creating the Stripe account during purchase.

---

#### Validation Rules

- **Age**: Must be 18+ years old (calculated from DOB)
- **SSN Last 4**: Exactly 4 digits, numbers only
- **Address**: Must be valid US address
- **Email**: Valid email format
- **Phone**: Valid US phone number (10 digits)
- **Ownership %**: If owner selected, percentage required (1-100)
- **ToS**: Must be checked to proceed

**Important**: We initially collect only the last 4 digits of SSN. If Stripe verification fails, the merchant will be prompted to provide the full 9-digit SSN through a secure form. If verification still cannot be completed automatically, merchants may be asked to complete document verification with Stripe Identity (photo ID upload + selfie). Full SSN is also required when merchant reaches $500K lifetime processing volume.

---

#### What Happens After Submission

1. **Data Saved**: Information stored securely in Lightspeed database (encrypted)
2. **ToS Captured**: Acceptance timestamp, IP address, and browser info recorded
3. **Task Status**: Changes from "Not Started" → "Completed"
4. **Next Step**: Merchant can proceed to Task #2 (Business Entity Information)
5. **No Verification Yet**: Trulioo identity verification runs AFTER purchase, not now

**Backend Note - Representative Relationship Mapping**:
When Stripe account is created during purchase, the Title/Role selection must be mapped to Stripe's relationship flags:
- "Business Owner" or "Partner" → `relationship.owner = true` + `relationship.representative = true`
- "CEO", "CFO", or "President" → `relationship.executive = true` + `relationship.representative = true`
- At least one of `owner` or `executive` must be true (federal requirement)

---

### Step 2: Business Entity Information (Task #2)

**Dashboard Task**: "Configure Your Business"

**Estimated Time**: 3-5 minutes

**Verification Provider**: Trulioo (runs after purchase, not during this step)

**Why Required**: Stripe and federal regulations require verification of business entity (IRS, state records)

---

#### What Merchant Sees

**Form Title**: "Business Entity Information"

**Instructions**: "Provide your official business details as they appear on tax documents."

**Form Sections**:
1. Business Details
2. Business Location
3. Business Description

---

#### Data Collected

| Field | Pre-filled? | User Action | Why Required |
|-------|-------------|-------------|--------------|
| **Business Details** |
| Legal Business Name | Yes (from signup) | Confirm/Edit | IRS and state verification |
| Business Structure | Yes (from signup) | Confirm/Edit | Determines ownership requirements |
|  |  | Options: Sole Proprietorship, Single-Member LLC, Multi-Member LLC, Corporation, Partnership, Non-Profit | |
| EIN | No | Enter (9 digits) | IRS business verification (not required for sole proprietors) |
| Business Phone | Yes (from signup) | Confirm/Edit | Primary business contact |
| Customer Support Phone | Yes (from business phone) | Confirm/Edit | Phone number for customer inquiries and disputes (required by Stripe for card payments) |
| **Business Location** |
| Street Address | Yes (from signup) | Confirm/Edit | Legal registered address |
| City | Yes (from signup) | Confirm/Edit | Business verification |
| State | Yes (from signup) | Confirm/Edit | Business verification |
| ZIP Code | Yes (from signup) | Confirm/Edit | Business verification |
| **Business Description** |
| Business Website | Yes (from signup) | Confirm/Edit | Required for card-not-present processing |
| Product Description | No | Enter (textarea) | What you sell - Stripe uses for risk assessment. **REQUIRED if no business website** (at least one must be provided) |
| Business Category | Yes (from signup) | Confirm/Edit | Determines processing rates (MCC code) |

---

#### Business Structure Guidance

The system shows helpful guidance based on selected structure:

**Sole Proprietorship**:
- "You'll use your SSN instead of EIN"
- "Skip EIN field"
- "You're the only owner - no need to add co-owners"

**Single-Member LLC**:
- "EIN required (9 digits)"
- "You're the only owner - no need to add co-owners"

**Multi-Member LLC, Partnership, Corporation**:
- "EIN required (9 digits)"
- "⚠️ Next step: You'll need to add co-owners with 25%+ ownership"

---

#### Validation Rules

- **EIN**: Exactly 9 digits, numbers only (unless sole proprietor)
- **Business Address**: Must be valid US address
- **Business Website**: Valid URL format (http/https), OR can enter "None" if no website
- **Product Description**: Minimum 10 characters, describe what you sell/provide
- **Website OR Product Description**: At least one MUST be provided (Stripe requirement for card processing)
  - If website provided → Product description optional but recommended
  - If no website → Product description REQUIRED
- **Business Phone**: Valid US phone number (10 digits)
- **Customer Support Phone**: Valid US phone number (10 digits), can be same as business phone

---

#### What Happens After Submission

1. **Data Saved**: Information stored securely in Lightspeed database
2. **Conditional Routing**:
   - **If Sole Proprietor or Single-Member LLC**: Task #2 complete → Ready to purchase
   - **If Multi-Member Structure**: Redirected to Step 3 (Add Co-Owners)
3. **Task Status**: Changes to "Completed" (or "In Progress" if co-owners needed)
4. **No Verification Yet**: Trulioo business verification runs AFTER purchase

---

### Step 3: Beneficial Owners (Conditional - Multi-Member Businesses Only)

**Dashboard Task**: "Add Co-Owners" (Part of Task #2)

**Estimated Time**: 5-10 minutes per owner

**When Required**: Only if business structure is Multi-Member LLC, Partnership, or Corporation

**Why Required**: Federal law (Bank Secrecy Act) requires verification of all individuals owning 25%+ of business

---

#### What Merchant Sees

**Conditional Display**: This step only appears if merchant selected multi-member structure in Step 2.

**Form Title**: "Add Co-Owners"

**Instructions**: "Federal law requires us to verify anyone who owns 25% or more of your business."

**First Question**:
```
Does anyone else own 25% or more of this business?

○ No, I'm the sole owner (skip this step)
○ Yes, I need to add co-owners
```

**If "Yes" selected**: Show form to add each co-owner

---

#### Data Collected (Per Co-Owner)

| Field | Pre-filled? | User Action | Why Required |
|-------|-------------|-------------|--------------|
| First Name | No | Enter | Identity verification |
| Last Name | No | Enter | Identity verification |
| Date of Birth | No | Enter (MM/DD/YYYY) | Age and identity verification |
| Home Address | No | Enter full address | Identity verification |
| SSN Last 4 | No | Enter (4 digits) | Identity verification |
| Ownership % | No | Enter (25-100) | Determines who needs verification |

**Note**: Email and phone are optional for co-owners (only required for main representative)

---

#### UI Flow

1. **Add First Co-Owner**: Form appears with "Co-Owner #1"
2. **Add Additional Owners**: "Add Another Co-Owner" button appears after saving each one
3. **Validation**: System ensures ownership percentages add up correctly
4. **Confirmation**: "I've added all owners with 25%+ ownership" checkbox

**Example Ownership Scenarios**:
- **50/50 Partnership**: Add 1 co-owner at 50% (you're the other 50%)
- **Three Equal Partners**: Add 2 co-owners at 33% each (you're the third at 34%)
- **Majority Owner**: If you own 75%, only list if someone else owns 25%+

---

#### What Happens After Submission

1. **Data Saved**: All co-owner information stored securely
2. **Ownership Validated**: System checks that percentages are valid
3. **Task Complete**: Task #2 status changes to "Completed"
4. **Ready to Purchase**: "Complete Purchase" button unlocks
5. **No Verification Yet**: Owner verification runs AFTER purchase via Trulioo

---

## What Happens After Data Collection Complete

**Ready to Purchase**: When merchants complete Tasks 1-2 (and Task 3 if multi-member business), they can proceed to purchase. See [User Flow 4: Purchase](./USER_FLOW_04_PURCHASE.md) for the complete checkout and order fulfillment experience.

**Stripe Account Creation**: The Stripe Custom account is created DURING the purchase checkout flow (not during these verification tasks). All data collected here is stored securely in your database and submitted to Stripe when the merchant completes their purchase.

**Verification Processing**: After purchase completes and the Stripe account is created, Trulioo processes KYC/KYB verification in the background (1-2 business days). Merchants receive email updates on verification status.

---

## Verification Processing (After Purchase)

**When Verification Begins**: Immediately after merchant completes purchase and Stripe account is created with pre-collected data

**Duration**: 1-2 business days (background processing)

**What's Being Verified**:

### Trulioo KYC (Individual Identity Verification)
- Checks SSN against government records
- Validates addresses via credit bureaus
- Confirms age (18+ requirement)
- Verifies identity matches provided information

**Who Gets Verified**:
- Business representative (always)
- All beneficial owners with 25%+ ownership (if applicable)

### Trulioo KYB (Business Entity Verification)
- Checks EIN against IRS records
- Validates business registration with state
- Confirms legal structure (LLC, Corp, etc.)
- Verifies business address

### Stripe Processing
- Reviews verification results for compliance
- Assesses risk profile
- Enables payment capabilities when approved

---

## Verification Status Updates

**What Merchants See During Verification**:

Merchants can track verification status in their dashboard. See [User Flow 4: Post-Purchase Experience](./USER_FLOW_04_PURCHASE.md#post-purchase-experience) for complete details on:
- Order tracking
- Verification status updates
- Hardware shipping notifications
- Email alerts

---

## Payment Activation

**When Payments Activate**: After Stripe processes successful verification (typically 1-2 business days)

**What Happens**:
1. System receives Stripe webhook: `account.updated`
2. Status changes: `charges_enabled = true`
3. Email sent to merchant: "You're approved to accept payments!"
4. Hardware ships to configured locations
5. Merchant can immediately accept payments when hardware arrives

**Note**: Merchants can accept payments WITHOUT a bank account. Funds accumulate safely in Stripe balance until they add bank account details. See [User Flow 2: Task 3 - Bank Account](./USER_FLOW_02_DASHBOARD.md#task-3-connect-bank-for-payouts) for details.

---

## Verification Error Handling (What Merchants See)

If verification fails or requires additional information, merchants see clear guidance in their dashboard:

### Common Verification Issues

| Issue | What Merchant Sees | Action Required |
|-------|-------------------|-----------------|
| Name mismatch | "The name provided doesn't match our records" | Re-enter correct legal name |
| Address mismatch | "Address doesn't match the document provided" | Update address or upload different document |
| DOB mismatch | "Date of birth doesn't match" | Correct DOB or upload government ID |
| SSN verification failed (Last 4) | "We need your full Social Security Number to verify your identity" | Enter full 9-digit SSN (secure form) |
| SSN verification failed (Full) | "We need to verify your identity with a photo ID" | Upload government ID via Stripe Identity (document + selfie verification) |
| Unclear document | "Document image is unclear or incomplete" | Upload clearer photo |
| Expired document | "Please provide a current, unexpired document" | Upload valid, unexpired document |
| EIN verification failed | "We couldn't verify your business entity" | Upload IRS Letter 147C or Articles of Incorporation |

### Error Recovery Flow (Merchant Experience)

1. **Email Alert**: "Action required on your Lightspeed account"
2. **Dashboard Banner**: Shows error message with clear action needed
3. **Guided Fix**: Form or upload button to resolve the issue
4. **Resubmission**: Merchant fixes and resubmits
5. **Verification Retry**: Trulioo/Stripe re-verifies (usually within 24 hours)
6. **Resolution**: Merchant notified when approved

---

## Timeline Expectations

### Typical US Merchant Journey (End-to-End)

| Phase | Time | What Merchant Experiences |
|-------|------|---------------------------|
| **Signup** | 5-10 minutes | Complete signup form, TrueBiz verifies business, lands on dashboard |
| **Data Collection** | 10-20 minutes | Complete Tasks 1-2 (identity + business info) |
| **Purchase** | 5-10 minutes | Review quote, complete purchase, order confirmed |
| **Verification** | 1-2 business days | Background processing (Trulioo + Stripe), status updates via email |
| **Approval** | — | Email: "You're approved!" - Payments activated |
| **Hardware Ships** | 3-5 business days | Tracking number sent, hardware in transit |
| **Setup & Go Live** | 1-2 hours | Merchant sets up POS, starts accepting payments |
| **Total Time to Live** | **~4-8 business days** | **Ready to accept payments** |

---

### Best Case Timeline (Low-Risk, Perfect Data)

- **Day 1**: Signup + data collection + purchase (30 minutes total)
- **Day 1** (1 hour later): Verification approved (low-risk merchant)
- **Day 2**: Hardware ships overnight
- **Day 3**: Hardware arrives, merchant goes live
- **Total**: 2-3 business days to live

---

### Delayed Timeline (Verification Issues)

- **Day 1**: Signup + data collection + purchase
- **Day 2**: Verification error - document upload required
- **Day 3-5**: Merchant uploads ID, manual review
- **Day 6**: Approved, hardware ships
- **Day 9-11**: Hardware arrives, merchant goes live
- **Total**: 2-3 weeks to live

---

### Critical Success Factors

**For Fast Approval** (1-2 days):
- ✓ Accurate data entry (name, address, SSN match records)
- ✓ Current residential address (no PO boxes)
- ✓ Business registered with state/IRS
- ✓ No fraud signals or high-risk indicators
- ✓ Complete beneficial owner information (if applicable)

**Factors That Slow Approval**:
- ✗ Name/address mismatches
- ✗ Incomplete owner information
- ✗ High-risk business category
- ✗ New business with no history
- ✗ Multiple verification attempts

---

## Related Documentation

**Previous Flows**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Signup, business data collection, and cohort assignment
- [User Flow 2: Dashboard Experience](./USER_FLOW_02_DASHBOARD.md) - Dashboard Task 1 initiates this verification flow

**Next Flow**:
- [User Flow 4: Subscription and Hardware Purchase](./USER_FLOW_04_PURCHASE.md) - Purchase flow after verification data is collected

**Related Dashboard Tasks**:
- [Task 1: Verify Your Identity](./USER_FLOW_02_DASHBOARD.md#1-verify-your-identity) - Dashboard entry point for this verification flow
- [Task 2: Configure Your POS](./USER_FLOW_02_DASHBOARD.md#2-configure-your-pos) - Required before purchase
- [Task 3: Connect Bank for Payouts](./USER_FLOW_02_DASHBOARD.md#3-connect-bank-for-payouts) - Optional, for receiving payouts

**Technical Integration References**:
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md) - Complete Stripe Connect Custom account implementation
- [Trulioo KYC/KYB Integration](../05-integrations/TRUEBIZ_VERIFICATION_API.md) - Primary identity verification provider
- [Stripe Identity Verification](../05-integrations/STRIPE_IDENTITY_VERIFICATION.md) - Fallback verification with document upload and liveness checks
- [Stripe Custom Accounts Documentation](https://docs.stripe.com/connect/custom-accounts) - Official Stripe docs
- [Required Verification Information](https://docs.stripe.com/connect/required-verification-information) - Stripe data requirements
- [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification) - Stripe verification processing
- [Testing Verification](https://docs.stripe.com/connect/testing-verification) - Test mode verification flows

---

**Document Status**: Prototype Design Specification
**Last Updated**: January 2025
**Audience**: Product managers, designers, stakeholders
**For Implementation Details**: See technical documentation in `/docs/05-integrations/`
