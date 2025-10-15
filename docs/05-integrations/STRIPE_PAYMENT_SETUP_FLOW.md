# Stripe Payment Setup Flow - User Experience Guide

Complete user flow for implementing the Payment Setup task within the merchant onboarding checklist using Stripe Connect Express accounts.

**Status**: Ready for Implementation
**Last Updated**: January 2025
**Priority**: Fast path to payment acceptance, bank setup can follow

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Decisions](#architecture-decisions)
3. [Flow Strategy](#flow-strategy)
4. [Merchant-Facing Steps & Data Collection](#merchant-facing-steps--data-collection)
5. [Complete User Journey](#complete-user-journey)
6. [Task Completion States](#task-completion-states)
7. [Email Notifications](#email-notifications)
8. [Important Clarifications & Questions](#important-clarifications--questions)

---

## Executive Summary

### What We're Building

A **two-phase** Payment Setup task that appears **first in the dashboard checklist** and prioritizes speed to payment acceptance:

**Phase 1: Enable Payments (Priority)**
1. Complete identity verification via Trulio (KYB/KYC)
2. Submit verification to Stripe Connect
3. Activate card payments capability
4. Merchant can immediately accept customer payments

**Phase 2: Enable Payouts (Can be deferred)**
5. Connect bank account for payouts
6. Verify bank account (1-2 days for manual, instant for Plaid)
7. Payouts begin flowing to merchant bank

### Key Decisions Made

**Priority in Dashboard**: Payment Setup is Step 1
- Appears first in checklist, before hardware or other setup
- Reason: Longest verification time (1-2 days), start early
- Allows parallel progress on other tasks while verification pending

**Verification Provider**: Trulio for KYC/KYB
- Primary: Trulio for identity and business verification
- Fallback: Stripe Identity Verification (if Trulio unavailable)
- Trulio provides: Identity docs, liveness checks, KYB validation

**Stripe Account Type**: Express Accounts
- Stripe handles ongoing compliance and updates
- White-label friendly with lower maintenance
- Mobile-optimized out of the box

**Implementation Method**: Custom API Integration
- Build our own verification UI (not Stripe-hosted)
- Full control over UX and branding
- Trulio SDK embedded in our flows
- Submit results to Stripe via API

**Account Creation Timing**: During Purchase (Step 3 in PRD)
- Collect verification info BEFORE purchase (Task #1 on dashboard)
- Create Stripe account DURING purchase (when they pay)
- Activate payments AFTER purchase (1-2 days later)
- Reduces abandoned Stripe accounts (only create when they commit)
- Better fraud signals for Stripe (verified buyer)

**Critical UX Promise**: "Start accepting payments in 1-2 days. Add bank account anytime to receive payouts."

---

## Architecture Decisions

### Verification Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ OUR APPLICATION                                             │
│                                                             │
│ Dashboard Task 1: Payment Setup                            │
│ ├─ Trulio SDK: Collect identity verification               │
│ ├─ Trulio SDK: KYB business verification                   │
│ ├─ Our UI: Bank account connection                         │
│ └─ Our UI: Payout settings                                 │
└─────────────────────────────────────────────────────────────┘
            ↓                           ↓
            ↓                           ↓
    ┌──────────────┐          ┌──────────────┐
    │    TRULIO    │          │    STRIPE    │
    │              │          │   CONNECT    │
    │ KYC/KYB      │──────────→│              │
    │ Verification │  Results  │ Express Acct │
    │              │           │              │
    └──────────────┘          └──────────────┘
```

### Why Custom Integration vs Stripe-Hosted

**Benefits of Custom UI**:
1. **Full brand control**: Seamless experience, no redirect to Stripe
2. **Unified dashboard**: All tasks in same UI pattern
3. **Better mobile UX**: Optimized specifically for our flow
4. **Trulio integration**: Can't use Trulio with Stripe-hosted
5. **Flexibility**: Can iterate UX without Stripe constraints

**Tradeoffs**:
1. **More implementation work**: Build and maintain verification UI
2. **Compliance responsibility**: Must stay updated on requirements
3. **Error handling**: Build comprehensive error states
4. **Testing complexity**: More scenarios to test

**Mitigation**:
- Use Trulio SDK for heavy lifting (identity verification)
- Stripe APIs handle most compliance automatically
- Build reusable components for verification flows

### Trulio Integration Points

**What Trulio Handles**:
- Identity document capture (driver's license, passport)
- Liveness detection (selfie verification)
- Document validation (OCR, authenticity checks)
- KYB business verification (EIN validation, business registry checks)
- Fraud detection and risk scoring

**What We Build**:
- UI wrapper around Trulio SDK
- Data collection forms (business info, ownership)
- Submission to Stripe Connect API
- Status tracking and error handling

**Fallback to Stripe Identity** (if needed):
- If Trulio unavailable or fails
- Use Stripe Identity Verification API
- Similar flow, different provider
- Stripe handles verification directly

---

## Flow Strategy

### Two-Phase Approach

**Why separate payments from payouts?**

1. **Faster Time to Value**: Merchant can start accepting payments without waiting for bank verification
2. **Reduced Friction**: Don't force bank account setup when merchant is eager to test payments
3. **Better Conversion**: Some merchants want to see the system work before connecting their bank
4. **Stripe Handles Security**: Stripe holds funds securely until bank account is verified

**How it works technically:**
- Stripe `card_payments` capability can be enabled while `external_account` is empty
- Stripe automatically holds payouts until bank account is verified
- Merchant receives clear messaging: "You can accept payments now, payouts held until bank verified"

### Task Priority: Why Payment Setup is First

**Reasoning**:
1. **Longest wait time**: Verification takes 1-2 business days
2. **Can't skip**: Required for business operation (unlike optional tasks)
3. **Blocks final activation**: Can't process real payments without this
4. **Parallel progress**: Merchant can work on other tasks while waiting

**Dashboard Checklist Order**:
1. ✅ **Payment Setup** ← STARTS HERE
2. Business Verification (auto-complete when payments approved)
3. POS Configuration
4. Hardware Selection
5. Data Import (optional)
6. Team Setup (optional)

### Task Split Decision

**Single Task (Implemented)**:
- One "Payment Setup" task with two sections
- Section A: Identity & Business Verification (Trulio) - required to complete task
- Section B: Payments Capability (Stripe) - enabled after verification
- Section C: Bank Account (optional, marked as "Add bank to receive payouts")
- Task shows as "Completed" when payments are enabled, even if bank not connected
- Badge shows "⚠️ Add bank for payouts" when payments active but no bank

---

## Merchant-Facing Steps & Data Collection

### Answer: Do We Collect 100% of Required Data?

**YES** - with the updates documented in this section, we now collect **100% of the data required** for Stripe Connect Express accounts in the US.

**Previously Missing** (now added):
1. ✅ Business representative email (now pre-filled, can edit)
2. ✅ Business representative phone (now pre-filled, can edit)
3. ✅ Business website URL or product description (new required field)
4. ✅ Terms of Service acceptance with timestamp/IP/user-agent (new checkbox)

**Already Had**:
- ✓ Identity verification (via Trulio)
- ✓ Business representative SSN last 4
- ✓ Business representative role
- ✓ Beneficial owners (25%+ owners)
- ✓ All business information
- ✓ Bank account (optional initially)

**Backend Requirements** (not visible to merchant):
- Must set relationship flags (`representative`, `executive`/`owner`)
- Must set `company.owners_provided = true` after adding all owners
- Must capture and submit ToS acceptance data

**Result**: Merchants can now complete the entire Payment Setup flow and Stripe will have everything needed to activate `card_payments` capability (with payouts held until bank account is added).

---

### What the Merchant Sees: 3 Simple Steps

From the merchant's perspective, Payment Setup has **3 steps** (with Step 3 being optional):

```
[Progress Stepper shown on every screen]
1. Verify Identity → 2. Business Details → 3. Bank Account
   (Required)        (Required)           (Optional)
```

---

### STEP 1: Verify Your Identity

**Screen**: Identity Verification Landing Page

**What Merchant Sees**:
- Explanation: "To accept payments, we need to verify your identity"
- What they'll need: Government-issued ID, well-lit area for photos
- Time estimate: ~5 minutes
- Privacy/security assurances
- Two buttons: "Start Identity Verification" | "Do This Later"

**What Merchant Does**:
Clicks "Start Identity Verification" → Trulio SDK launches

---

**Trulio SDK Flow** (7 screens, ~3-5 minutes):

**Screen 1: Welcome**
- Intro to identity verification
- What to expect

**Screen 2: Select Document Type**
- Radio buttons: Driver's License | Passport | State ID
- Select one

**Screen 3: Capture Front of ID**
- Camera activates
- Overlay shows ID outline
- Take photo of front of ID
- Can retake if blurry

**Screen 4: Capture Back of ID**
- Camera activates
- Take photo of back of ID
- Can retake if needed

**Screen 5: Take Selfie (Liveness Check)**
- Camera activates with face outline
- Follow prompts (may ask to turn head, blink, etc.)
- Verifies you're a real person, not a photo

**Screen 6: Processing**
- Animated spinner
- "Verifying your identity..."
- Takes 10-30 seconds

**Screen 7: Success**
- Green checkmark
- "Identity Verified!"
- Auto-closes, returns to our app

**Data Captured by Trulio** (automatic, no typing):
- ✓ Full legal name (from ID)
- ✓ Date of birth (from ID)
- ✓ Address (from ID)
- ✓ ID number (from ID)
- ✓ Facial biometric verification
- ✓ Document authenticity validation

**Merchant Input Required**: NONE (just take photos)

---

### STEP 2: Business Details

**Screen**: Business Verification Form

**What Merchant Sees**:
- Green success banner: "✓ Your identity has been verified"
- Message: "Now we need a few more details"
- Three sections: Business Representative | Beneficial Owners | Business Information

---

**Section A: Business Representative**

This section is **mostly pre-filled** from Trulio and signup:

| Field | Pre-filled? | Merchant Input |
|-------|-------------|----------------|
| **Full Legal Name** | ✓ Yes (from ID) | Review/confirm |
| **Date of Birth** | ✓ Yes (from ID) | Review/confirm |
| **Email Address** | ✓ Yes (from signup) | Review/confirm (can edit) |
| **Phone Number** | ✓ Yes (from signup) | Review/confirm (can edit) |
| **SSN Last 4 Digits** | ❌ No | Type 4 digits |
| **Home Address** | ✓ Yes (from ID) | Review/confirm |
| **Role in Business** | ❌ No | Select from dropdown |

**Dropdown Options for Role**:
- Owner
- CEO
- CFO
- President
- Partner
- Manager
- Other

**Merchant Input Required**:
- Email address (review/edit pre-filled value)
- Phone number (review/edit pre-filled value)
- 4 digits (SSN last 4)
- 1 dropdown selection (role)

**Note**: Email and phone are pre-filled from signup but can be edited if the representative's personal contact info differs from business contact info.

---

**Section B: Beneficial Owners**

**Question**: "Are there other owners with 25% or more ownership?"

**Option 1: Single Owner** (simplest path)
- Checkbox: ☑ "I am the only owner"
- If checked: Skip owner entry

**Option 2: Multiple Owners**
- Uncheck the box
- Form appears for each owner

**Per Owner Fields** (if multiple owners):

| Field | Input Type | Required |
|-------|-----------|----------|
| Full Name | Text input | Yes |
| Date of Birth | Date picker (MM/DD/YYYY) | Yes |
| SSN Last 4 | Number input (4 digits) | Yes |
| Ownership % | Number input (must be ≥25%) | Yes |
| Home Address | Text inputs (Street, City, State, ZIP) | Yes |

**Plus Button**: [+ Add Another Owner]

**Merchant Input Required** (per additional owner):
- Full name (typing)
- Date of birth (date picker)
- SSN last 4 (4 digits)
- Ownership % (number)
- Full address (5 fields: street, city, state, zip)

**Estimate**: ~2 minutes per additional owner

---

**Section C: Business Information**

This section combines **pre-filled data** with **required new fields**:

| Field | Pre-filled? | Merchant Input |
|-------|-------------|----------------|
| **Legal Business Name** | ✓ Yes (from signup) | Display only |
| **Business Structure** | ✓ Yes (from signup) | Display only |
| **EIN (Tax ID)** | ✓ Yes (from signup) | Display only |
| **Business Address** | ✓ Yes (from signup) | Display only |
| **Business Category** | ✓ Yes (from signup) | Display only |
| **Business Website URL** | ❌ No | Type URL (required) |
| **Product Description** | ❌ No | Type description (if no URL) |

**Website URL Field**:
- **Label**: "Business Website"
- **Placeholder**: "https://yourbusiness.com"
- **Required**: YES (for card-not-present payments)
- **Help text**: "Your website must include business info, customer service details, and refund policy"
- **Validation**: Must be valid URL format

**Product Description Field** (shown if "I don't have a website" is checked):
- **Label**: "Describe Your Business"
- **Placeholder**: "We sell handmade jewelry and accept payments at craft fairs and through Instagram..."
- **Required**: YES (if no website URL)
- **Min length**: 10 characters
- **Help text**: "Describe what you sell and how customers pay you"

**If corrections needed**: "Request Edit" button (opens support chat)

**Merchant Input Required**:
- Website URL (type/paste)
- OR Product description (if no website)

---

**Section D: Terms of Service Acceptance**

At the bottom of the form, before the submit button:

```
┌─────────────────────────────────────────────────────────────┐
│ Terms & Conditions                                          │
│                                                             │
│ By continuing, you authorize Lightspeed to share your      │
│ information with Stripe, our payment processor, for the    │
│ purpose of enabling payment processing.                    │
│                                                             │
│ ☐ I agree to Stripe's Connected Account Agreement and      │
│   Privacy Policy                                            │
│                                                             │
│ [View Stripe's Terms] [View Privacy Policy]                │
└─────────────────────────────────────────────────────────────┘
```

**What Gets Captured** (automatically, invisible to merchant):
- Acceptance timestamp (Unix time)
- IP address of the request
- User agent string (browser info)

**Merchant Input Required**:
- Check the agreement checkbox (required to proceed)

---

**Step 2 Summary**:

**Minimum Input** (single owner, all pre-filled):
- Email address: **Review/confirm**
- Phone number: **Review/confirm**
- SSN last 4 digits: **4 digits**
- Role selection: **1 dropdown**
- Website URL: **Type/paste URL**
- ToS acceptance: **1 checkbox**

**Time**: 2-3 minutes

**Maximum Input** (multiple owners, no website):
- Email address: **Review/confirm**
- Phone number: **Review/confirm**
- SSN last 4: **4 digits**
- Role selection: **1 dropdown**
- Product description: **Type paragraph** (if no website)
- Per additional owner: **10 fields** (name, DOB, SSN, address, ownership %)
- ToS acceptance: **1 checkbox**

**Time**: 8-12 minutes (depending on number of owners)

---

### STEP 3: Bank Account (Optional)

**When**: Can be done anytime after Step 2, or skipped entirely

**What Merchant Sees**:
- Info banner: "You can accept payments without this, but payouts are held until verified"
- Two options: Instant Verification (Plaid) | Manual Entry

---

**Option A: Instant Verification with Plaid** (Recommended)

**Merchant Experience**:
1. Click "Connect Instantly"
2. Plaid modal opens
3. Search for bank name
4. Enter online banking username/password
5. Plaid verifies instantly
6. Account connected (< 1 minute)

**Merchant Input**:
- Bank name (search/select)
- Online banking credentials (username + password)

**Time**: < 1 minute

---

**Option B: Manual Entry**

**Form Fields**:

| Field | Input Type | Example |
|-------|-----------|---------|
| **Account Holder Name** | Text | John Smith |
| **Bank Name** | Text | Chase Bank |
| **Routing Number** | Number (9 digits) | 021000021 |
| **Account Number** | Number (masked) | •••••••4567 |
| **Confirm Account Number** | Number (must match) | 1234567890 |
| **Account Type** | Radio buttons | ○ Checking  ○ Savings |

**Merchant Input**:
- 5 text/number fields
- 1 radio button selection

**Verification Process**:
- 2 small deposits sent (1-2 business days)
- Merchant returns to verify amounts
- Enter 2 amounts (e.g., $0.32, $0.45)

**Time**:
- Initial entry: 2-3 minutes
- Verification: 1-2 business days + 1 minute to confirm amounts

---

**Option C: Skip for Now**

- Click "Skip for Now"
- Return to dashboard
- Can add bank account later from task page
- Warning badge shown: "⚠️ Add bank for payouts"

---

## Complete Data Collection Summary

### Data Merchant Must Input

**Step 1: Identity Verification (Trulio)**
- ✅ No typing required
- 📸 Take 3 photos (ID front, ID back, selfie)
- ⏱️ Time: 3-5 minutes

**Step 2: Business Details**
- ✍️ Review/confirm email and phone (pre-filled)
- ✍️ Type SSN last 4 digits (4 characters)
- ✍️ Select role (1 dropdown)
- ✍️ Type business website URL or product description
- ✍️ Check ToS acceptance checkbox
- ✍️ If multiple owners: Full details for each (10 fields per owner)
- ⏱️ Time: 2-3 minutes (single owner) to 12 minutes (multiple owners)

**Step 3: Bank Account (Optional)**
- 🏦 Instant: Bank credentials via Plaid (< 1 minute)
- ✍️ Manual: 5 fields + verification later (3 minutes + 1-2 days)
- ⏱️ Time: < 1 minute (instant) or 3 minutes (manual)

### Total Time Estimate

**Fastest Path** (single owner, skip bank):
- Step 1: 3 minutes (photos only)
- Step 2: 3 minutes (review email/phone, 4 digits, 1 dropdown, URL, checkbox)
- **Total: ~6 minutes**

**Typical Path** (single owner, instant bank):
- Step 1: 5 minutes
- Step 2: 3 minutes
- Step 3: 1 minute (Plaid)
- **Total: ~9 minutes**

**Complex Path** (multiple owners, manual bank):
- Step 1: 5 minutes
- Step 2: 12 minutes (3 owners + product description)
- Step 3: 3 minutes (manual entry)
- **Total: ~20 minutes**

---

## Complete User Journey

### Journey Overview: Key Insight 💡

**The Payment Setup task happens in TWO separate timeframes:**

1. **BEFORE Purchase** (Phases 0-5): Collect verification information
   - Merchant provides identity and business details
   - Data is saved to our database
   - No Stripe account exists yet
   - Task shows as "Information Collected"

2. **DURING Purchase** (Phase 5.5): Create Stripe account
   - Merchant completes checkout for hardware/software
   - Our backend creates Stripe Express account
   - Submits all verification data to Stripe
   - Stripe begins background processing

3. **AFTER Purchase** (Phases 6-7): Payments activate
   - Stripe completes verification (1-2 days)
   - Payments capability enabled
   - Merchant can accept payments
   - Bank account can be added for payouts

**Why this order?**
- Reduces abandoned Stripe accounts (only create when they commit by paying)
- Better fraud signals for Stripe (merchant has paid for hardware)
- Simpler UX (verification happens automatically, merchant doesn't wait)
- Allows parallel progress (merchant configures POS while waiting for verification)

---

### Phase 0: Context - Where Merchants Come From

**Merchant has just completed signup** (`/get-started`):
- ✅ Created account (name, email, password)
- ✅ Provided business information (name, category, address, revenue, locations)
- ✅ Been assigned cohort automatically (Self-Serve, Assisted, or Managed)
- ✅ Data stored in localStorage as `prequalificationData`

**What they haven't done yet**:
- ❌ Not purchased anything (no hardware ordered)
- ❌ Not completed KYB/KYC verification
- ❌ Stripe account doesn't exist yet

**Important Context**:
According to the PRD, the merchant journey is:
1. **Sign Up** ← Just completed
2. **Set Up POS & Payments** ← About to start (but payment setup is now first task)
3. **Complete Purchase & Verification** ← Comes after configuration
4. **Get Everything Ready** ← Final setup tasks

**Current Implementation Difference**:
- Dashboard puts **Payment Setup as Task #1** (before hardware selection)
- This prioritizes verification because it takes longest (1-2 days)
- Allows merchant to work on other tasks while verification is pending

**Redirect**: Merchant lands at `/dashboard` for first time

---

### Phase 1: Dashboard - Payment Setup as First Task

**Screen: Dashboard Checklist**

Merchant lands on dashboard and sees Payment Setup as the **first task** in the checklist:

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome to Lightspeed, [Business Name]!                     │
│                                                             │
│ Let's get you ready to accept payments                     │
│                                                             │
│ [Progress: 0 of 6 tasks completed]                         │
│ [Progress bar: 0%]                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [CreditCard Icon - Orange]  [Required Badge - Red]         │
│                                                             │
│ 1. Payment Setup                                           │
│ Enable payment processing to accept customer payments      │
│                                                             │
│ Status: Action Required                                    │
│ Time: ~10 minutes + 1-2 day verification                   │
│                                                             │
│ [!] Start here - verification takes 1-2 days               │
│                                                             │
│ [Start Setup] button ← Primary CTA                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Lock Icon - Gray]  [Required Badge - Gray]                │
│                                                             │
│ 2. Business Verification                                   │
│ Verify your business information                           │
│                                                             │
│ Status: Locked                                             │
│ Will auto-complete when Payment Setup is approved          │
└─────────────────────────────────────────────────────────────┘

[Additional tasks shown below...]
```

**Click "Start Setup"** → Routes to `/dashboard/payments`

---

### Phase 2: Payment Setup Task Page - Initial State

**URL**: `/dashboard/payments`

**Important Note About Timing**:
- This task appears BEFORE the merchant has purchased anything
- No Stripe account exists yet - that will be created later during purchase
- This verification data will be collected now and used when creating the Stripe account
- Think of this as "pre-qualifying" for payments before they buy

**Full Page Layout**:

```
┌─────────────────────────────────────────────────────────────┐
│ [← Back to Dashboard]                                       │
│                                                             │
│ Payment Setup                                              │
│ Enable payment processing to accept customer payments      │
│                                                             │
│ [Info Banner - Blue]                                       │
│ Why start with this? Payment verification takes 1-2 days,  │
│ so we'll get it started now while you configure your POS.  │
│ You'll be ready to accept payments as soon as you launch!  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Progress Stepper]                                         │
│ 1. Verify Identity → 2. Business Details → 3. Bank Account│
│    (Current)         (Locked)              (Optional)      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 1: Verify Your Identity                               │
│                                                             │
│ To accept payments, we need to verify your identity. This  │
│ meets federal regulations and protects your business.      │
│                                                             │
│ [Info Card]                                                │
│ What you'll need:                                          │
│ • Government-issued ID (driver's license or passport)      │
│ • 5 minutes to complete                                    │
│ • Well-lit area for photos                                 │
│                                                             │
│ Your information is:                                       │
│ ✓ Encrypted with bank-level security                      │
│ ✓ Used only for identity verification                     │
│ ✓ Required by federal regulations                         │
│ ✓ Protected by our Privacy Policy                         │
│                                                             │
│ [Why is verification required?] ← Expandable               │
│ We're required by federal law to verify the identity of   │
│ anyone who processes payments. This protects you and your  │
│ customers from fraud and ensures secure transactions.      │
│                                                             │
│ [Start Identity Verification] ← Primary CTA                │
│ [Do This Later] ← Secondary action                         │
└─────────────────────────────────────────────────────────────┘
```

**Click "Start Identity Verification"** → Launches Trulio SDK
**Click "Do This Later"** → Returns to dashboard (task stays "not started")

---

### Phase 3: Trulio Identity Verification (Embedded in Our App)

**What Happens**: Trulio SDK modal/flow appears within our application

**Trulio SDK Flow**:

#### Screen 1: Welcome
```
[Trulio branding + Lightspeed co-brand]

Verify Your Identity

We'll guide you through a quick identity verification.
This takes about 3 minutes.

What we'll ask for:
• Government-issued photo ID
• A selfie for liveness check

[Continue] button
```

#### Screen 2: Select Document Type
```
Select Your ID Type

○ Driver's License
○ Passport
○ State ID

[Continue] button
```

#### Screen 3: Document Capture (Front)
```
[Camera view with overlay]

Capture Front of License

Position your license within the frame

Tips:
• Ensure good lighting
• Avoid glare
• Keep document flat

[Capture Photo] button
[Retake] if poor quality
```

#### Screen 4: Document Capture (Back)
```
[Camera view]

Capture Back of License

[Capture Photo] button
```

#### Screen 5: Liveness Check (Selfie)
```
[Camera view with face outline]

Take a Selfie

Position your face in the frame
Follow the on-screen instructions

This helps us verify you're a real person

[Start Liveness Check] button
```

#### Screen 6: Processing
```
[Animated spinner]

Verifying Your Identity...

This may take a few moments
Please don't close this window

• Validating document authenticity
• Checking against databases
• Verifying liveness
```

#### Screen 7: Success
```
[Green checkmark]

Identity Verified!

Your identity has been successfully verified.

Next: Business information verification

[Continue] button
```

**Trulio SDK Closes** → Returns to our app

---

### Phase 4: Business Verification in Our App

**Back to**: `/dashboard/payments`

**Progress stepper updated**: Step 1 ✓ → Step 2 (Current)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Verify Your Business                               │
│                                                             │
│ [Success Banner - Light Green]                             │
│ ✓ Your identity has been verified by Trulio                │
│                                                             │
│ Now we need a few more details to complete your payment    │
│ processing setup.                                          │
│                                                             │
│ [Info Card - Light Blue]                                   │
│ We've pre-filled what we already know from your signup    │
│ and ID verification. Please review and add any missing     │
│ information.                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Business Representative                                     │
│ The person responsible for this account                    │
│                                                             │
│ Full Legal Name:                                           │
│ [Input - pre-filled from Trulio] [John Smith__________]   │
│ [✓ Verified from ID]                                       │
│                                                             │
│ Date of Birth:                                             │
│ [Input - pre-filled from ID] [01/15/1985]                 │
│ [✓ Verified from ID]                                       │
│                                                             │
│ Social Security Number (Last 4):                          │
│ [Input with masking] [XXX-XX-1234] [Show/Hide]            │
│ [i] We only need the last 4 digits for verification       │
│                                                             │
│ Home Address:                                              │
│ [Input - pre-filled from ID]                               │
│ Street: [123 Main Street___________]                       │
│ City: [Seattle_____________]                               │
│ State: [Washington ▼]                                      │
│ ZIP: [98101]                                               │
│ [✓ Verified from ID]                                       │
│                                                             │
│ Your Role in the Business:                                 │
│ [Dropdown ▼] Owner                                         │
│ Options: Owner, CEO, CFO, President, Partner, Manager     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Beneficial Owners                                          │
│ Federal law requires us to collect information about       │
│ anyone who owns 25% or more of the business.              │
│                                                             │
│ ☑ I am the only owner (skip owner entry)                  │
│                                                             │
│ [If unchecked - Shows expandable owner entry forms]        │
│                                                             │
│ Owner 1:                                                   │
│ Full Name: [_______________]                               │
│ Date of Birth: [MM/DD/YYYY]                                │
│ SSN Last 4: [____]                                         │
│ Ownership %: [____]% (must be ≥25%)                        │
│ Home Address: [_______________]                            │
│                                                             │
│ [+ Add Another Owner] button                               │
│                                                             │
│ [i] Why we need this information                           │
│ Federal regulations require us to verify the identity of   │
│ all beneficial owners (those who own 25% or more).         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Business Information                                       │
│ (Pre-filled from signup - read-only, can request edit)     │
│                                                             │
│ Legal Business Name:                                       │
│ [Display only] Your Business LLC                          │
│                                                             │
│ Business Structure:                                        │
│ [Display only] Limited Liability Company (LLC)            │
│                                                             │
│ EIN (Tax ID):                                              │
│ [Display only] XX-XXXXXXX                                 │
│                                                             │
│ Business Address:                                          │
│ [Display only]                                             │
│ 123 Main St, Seattle, WA 98101                            │
│                                                             │
│ Business Category:                                         │
│ [Display only] Restaurant                                  │
│                                                             │
│ [Request Edit] ← if corrections needed, opens support     │
└─────────────────────────────────────────────────────────────┘

[Save Verification Information] button ← Primary CTA
[Save Progress & Do Later] button ← Secondary action
```

**What Happens When They Click "Save"**:

**Option A: Immediate Flow (Recommended)**
1. Data saved to our database
2. Trulio KYB verification initiated
3. Show "Verification Submitted" confirmation
4. Merchant can return to dashboard
5. Stripe account will be created later during purchase

**Option B: Create Stripe Account Now**
1. Data saved to our database
2. Create Stripe Express account immediately
3. Submit verification data to Stripe
4. Stripe processes in background
5. Account ID stored for later use during purchase

**Recommendation**: Option A - delay Stripe account creation until purchase
- Reduces abandoned Stripe accounts
- Better fraud signals when they commit by paying
- Simpler flow (one less integration point that can fail)

---

### Phase 5: Verification Submitted - Waiting State

**What Happens Behind the Scenes**:
- Verification data saved to our database
- Trulio KYB verification initiated (async)
- Trulio verifies EIN, business registry, fraud signals
- Results will be ready in minutes to hours
- **Important**: No Stripe account exists yet

**Merchant Experience**: They see a "saved successfully" message and can:
- Return to dashboard to work on other tasks
- Come back later to check status
- Proceed to hardware configuration

**Screen**: `/dashboard/payments` (updated)

```
┌─────────────────────────────────────────────────────────────┐
│ [Green Checkmark Icon]                                     │
│                                                             │
│ Verification Information Saved!                            │
│                                                             │
│ Great work! Your identity and business verification info  │
│ has been saved. We'll use this to activate payments when  │
│ you're ready to launch.                                    │
│                                                             │
│ [Progress Display]                                         │
│ ✓ Identity verified (Trulio)                              │
│ ✓ Business details collected                               │
│ ⏳ Verification will run when you purchase (automatic)     │
│ ⬜ Bank account (you can add this anytime)                 │
│                                                             │
│ [Info Card - Light Blue]                                   │
│ Next Steps:                                                │
│ 1. Configure your POS hardware needs                      │
│ 2. Complete your purchase                                  │
│ 3. We'll activate payments automatically                   │
│                                                             │
│ The verification process happens in the background after   │
│ purchase - typically takes 1-2 days. You can continue     │
│ setting up your system while we process!                   │
│                                                             │
│ [Continue to Dashboard] button ← Primary CTA              │
│ [Add Bank Account Now] button ← Optional                   │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard Task Card Updates**:

```
┌─────────────────────────────────────────────────────────────┐
│ [CreditCard Icon - Green]   [In Progress Badge - Blue]    │
│                                                             │
│ 1. Payment Setup                                           │
│ Enable payment processing                                  │
│                                                             │
│ Status: Information Collected ✓                            │
│ Your verification info is ready. Payments will activate   │
│ automatically after purchase.                              │
│                                                             │
│ [View Details] button                                       │
└─────────────────────────────────────────────────────────────┘
```

**Key Point**: This task is now marked as "in progress" or "partially complete" - the merchant has done their part. The actual activation happens automatically after they purchase in Step 3.

---

### Phase 5.5: During Purchase - Stripe Account Creation 🔑

**Context**: Merchant has configured their POS needs (hardware, locations, registers) and is now at checkout

**What Happens During "Complete Purchase" Flow**:

**Step 1: Merchant Clicks "Complete Purchase"**
- Reviews order (software + hardware + payment processing)
- Enters payment method (credit card)
- Confirms shipping addresses
- Clicks "Complete Purchase" button

**Step 2: Our Backend Processes Payment** (immediate)
1. Authorize credit card payment
2. Create order record
3. Send to hardware fulfillment

**Step 3: Create Stripe Connect Account** (parallel, async)
1. Retrieve stored verification data from Phase 4-5
2. Call Stripe API: Create Express account
3. Submit all verification data to Stripe:
   - Identity info (from Trulio)
   - Business details (from signup + Phase 4)
   - Business representative info
   - Beneficial owners
   - EIN, address, business structure
4. Stripe begins processing account
5. Store Stripe account ID in our database

**Step 4: Merchant Sees Order Confirmation** (immediate)
```
┌─────────────────────────────────────────────────────────────┐
│ Order Confirmed! 🎉                                         │
│                                                             │
│ Order #12345                                               │
│ Total: $3,299 (hardware) + $89/month (software)            │
│                                                             │
│ What happens next:                                         │
│ ✓ Your software account is being created                  │
│ ✓ Hardware ships within 24 hours                          │
│ ⏳ Payment processing activating (1-2 business days)       │
│                                                             │
│ You'll receive emails with:                                │
│ • Your software login credentials                          │
│ • Hardware tracking information                            │
│ • Payment processing status updates                        │
│                                                             │
│ [View Dashboard] button                                    │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard Updates**: Payment Setup task updates to show "Activating..."

```
┌─────────────────────────────────────────────────────────────┐
│ [CreditCard Icon - Blue]  [Pending Badge - Yellow]         │
│                                                             │
│ 1. Payment Setup                                           │
│ Enable payment processing                                  │
│                                                             │
│ Status: Activating Payment Processing                      │
│ ⏳ Stripe is reviewing your account (1-2 business days)    │
│                                                             │
│ [View Status] button                                        │
└─────────────────────────────────────────────────────────────┘
```

**Background Processing** (1-2 business days):
- Stripe reviews all verification data
- Trulio KYB results are checked
- Underwriting process completes
- `card_payments` capability evaluated
- Status changes: `pending` → `review` → `active` (or `rejected`)

**Webhooks We Monitor**:
- `account.updated` - Status changes
- `capability.updated` - Payment capability changes
- `account.external_account.created` - Bank account added later

---

### Phase 6: Verification Complete - Payments Enabled ⭐

**Trigger**: Stripe webhook `account.updated` with `capabilities.card_payments: active`

**Timeline**: 1-2 business days after purchase

**Email Sent**: "Great news! You can now accept payments"

**Dashboard Updates**:

```
┌─────────────────────────────────────────────────────────────┐
│ [CreditCard Icon - Green]   [Warning Badge - Orange]       │
│                                                             │
│ 1. Payment Setup                                           │
│ Card payments active                                       │
│                                                             │
│ Status: Accepting Payments ✓                               │
│ ⚠️ Add bank account to receive payouts                     │
│                                                             │
│ [Add Bank Account] button                                  │
└─────────────────────────────────────────────────────────────┘
```

**Click task card** → Routes to `/dashboard/payments`

**Payment Setup Page** (updated with new sections):

```
┌─────────────────────────────────────────────────────────────┐
│ Section A: Identity Verification                           │
│                                                             │
│ [Checkmark - Green] Verified                               │
│                                                             │
│ ✓ Identity verified via Trulio                            │
│ ✓ Business information confirmed                           │
│ ✓ Ownership structure validated                            │
│                                                             │
│ Completed: Feb 21, 2025 at 10:15 AM                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Section B: Accept Customer Payments                        │
│                                                             │
│ [Checkmark Icon - Green] Active                            │
│                                                             │
│ 🎉 You can now accept payments from customers!             │
│                                                             │
│ Supported payment methods:                                 │
│ [Icons] Visa • Mastercard • Amex • Discover               │
│ [Icons] Apple Pay • Google Pay • Contactless              │
│                                                             │
│ Your rates:                                                │
│ Card present: 2.6% + 10¢ per transaction                  │
│ Card not present: 2.9% + 30¢ per transaction              │
│                                                             │
│ [Success Banner - Light Green Background]                  │
│ 💡 Ready to test? Run a test transaction on your POS to   │
│ make sure everything works.                                │
│                                                             │
│ ⚠️ Note: Payouts are held until you connect your bank     │
│ account below. Funds are stored securely by Stripe.        │
│                                                             │
│ [Run Test Transaction] button (if hardware setup done)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Section C: Bank Account for Payouts                        │
│                                                             │
│ [Info Badge - Blue] Optional - Add When Ready              │
│                                                             │
│ Connect your bank account to receive customer payments.   │
│                                                             │
│ [Info Banner - Light Blue]                                 │
│ Good news! You can accept payments now without this step.  │
│ Your funds will be held securely until you add your bank. │
│                                                             │
│ When you're ready, we offer two ways to connect:          │
│                                                             │
│ [Option Card 1 - Recommended]                              │
│ [Zap Icon] Instant Verification (Plaid)                    │
│ Securely link your bank account instantly                 │
│ • Verify in under 1 minute                                 │
│ • No waiting for test deposits                             │
│ • Works with 12,000+ banks                                 │
│ [Connect Instantly] button                                 │
│                                                             │
│ [Option Card 2]                                            │
│ [FileText Icon] Manual Entry                               │
│ Enter routing and account numbers                         │
│ • Verification takes 1-2 business days                     │
│ • We'll send 2 small test deposits                         │
│ [Enter Manually] button                                    │
│                                                             │
│ [Skip for Now] ← Closes section, goes back to dashboard   │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 7: Bank Account Connection (Optional - Can Be Deferred)

Merchant can now:
1. **Option A**: Click "Connect Instantly" → Plaid flow (covered in existing doc)
2. **Option B**: Click "Enter Manually" → Manual bank form (covered in existing doc)
3. **Option C**: Click "Skip for Now" → Return to dashboard

**If Skip**: Task shows as "Accepting Payments" with warning badge

**If Connect**: Follow bank verification flows (manual or instant)

**If Verified**: Task shows as "Completed" with green badge

---

## Task Completion States

### State 1: Not Started

```
[CreditCard Icon - Orange]  [Required Badge - Red]

1. Payment Setup
Enable payment processing

Status: Action Required
[Start Setup] button
```

### State 2: In Progress - Identity Verification

```
[CreditCard Icon - Blue]  [Required Badge - Yellow]

1. Payment Setup
Enable payment processing

Status: In Progress
Currently: Verifying identity (Step 1 of 3)
[Continue Setup] button
```

### State 3: Verification Pending (Most Time Spent Here)

```
[CreditCard Icon - Blue]  [Pending Badge - Yellow]

1. Payment Setup
Enable payment processing

Status: Verification Pending
⏳ Typically completes in 1-2 business days
[View Status] button
```

### State 4: Payments Enabled, No Bank (Partial Complete)

```
[CreditCard Icon - Green]  [Warning Badge - Orange]

1. Payment Setup
Card payments active

Status: Accepting Payments ✓
⚠️ Add bank account to receive payouts
[Add Bank Account] button
```

### State 5: Fully Complete

```
[CreditCard Icon - Green]  [Completed Badge - Green]

1. Payment Setup
Payment processing enabled

✓ Accepting payments
✓ Payouts enabled (Daily)

Completed: Feb 21, 2025
[View Details] button
```

---

## Email Notifications

### Email 1: Verification Submitted

**Trigger**: After merchant submits business verification
**Send**: Immediately

**Subject**: Your payment verification is in progress

**Content**:
```
Hi [First Name],

Thanks for completing your business verification!

We're reviewing your information to enable payment processing
for your Lightspeed account. This typically takes 1-2 business
days.

Your Progress:
✓ Identity verified (Trulio)
✓ Business details submitted
⏳ Payment processing review (1-2 days)
⬜ Bank account for payouts

What You Can Do Now:
While you wait, continue setting up other parts of your system:
• Set up your POS hardware
• Import your product catalog
• Add team members

[Continue Setup]

We'll email you as soon as your payment processing is enabled.

Questions? Reply to this email or call us at 1-800-XXX-XXXX.

Thanks,
The Lightspeed Team
```

---

### Email 2: Payments Enabled ⭐ **KEY MILESTONE**

**Trigger**: `card_payments` capability becomes active
**Send**: Immediately when status changes

**Subject**: Great news! You can now accept payments 🎉

**Content**:
```
Hi [First Name],

Your payment processing is now enabled!

You can now accept credit card payments from your customers
on your Lightspeed POS.

Supported Payment Methods:
✓ Visa, Mastercard, Amex, Discover
✓ Apple Pay, Google Pay
✓ Contactless tap-to-pay

Your Transaction Rates:
Card present: 2.6% + 10¢
Card not present: 2.9% + 30¢
[View full rate card]

Next Step: Connect Your Bank Account
To receive payouts from customer payments, add your bank
account. This takes about 3 minutes.

[Add Bank Account]

Important: You can accept payments now, but payouts are
held securely until your bank account is verified
(typically 1-2 business days for manual entry, instant
with Plaid).

Ready to Test?
[Run Test Transaction]

Questions? We're here to help.

Thanks,
The Lightspeed Team

P.S. Already made sales? Your funds are stored securely
by Stripe and will be paid out once you verify your bank
account.
```

---

### Email 3: Reminder - Add Bank Account (Day 3)

**Trigger**: 3 days after payments enabled, no bank account added
**Send**: Once only

**Subject**: Add your bank account to receive payouts

**Content**:
```
Hi [First Name],

We noticed you haven't connected your bank account yet for
Lightspeed Payments.

Current Status:
✓ Payment processing enabled
✓ You can accept customer payments
⚠️ Bank account needed to receive payouts

Your payouts are being held securely by Stripe until you
add your bank account. Once verified, we'll release all
pending payouts.

Connect Your Bank Account:
• Instant verification (Plaid): Under 1 minute
• Manual entry: 1-2 business days

[Add Bank Account Now]

Questions? Reply to this email.

Thanks,
The Lightspeed Team
```

---

### Email 4: Payouts Enabled ⭐ **FULLY COMPLETE**

**Trigger**: Bank account verified, `payouts_enabled` becomes true
**Send**: Immediately when bank verified

**Subject**: Payouts enabled! You're ready to receive payments 💰

**Content**:
```
Hi [First Name],

Your bank account has been verified!

Bank: Chase (...4521)
Payout schedule: Daily (next business day)

You're now fully set up to:
✓ Accept customer payments
✓ Receive payouts to your bank account

Payout Details:
• First payout: [Date] (2 business days from first sale)
• Ongoing: Daily, next business day after sales
• View all payouts in your dashboard

[View Dashboard]

All pending payments will be included in your next
scheduled payout.

Ready to go live?
[Run Test Transaction]

Thanks,
The Lightspeed Team

---

Need to change your bank account or payout schedule?
[Manage Payout Settings]
```

---

## Important Clarifications & Questions

### Architecture Questions

**Q0: Account Creation Timing - When exactly do we create the Stripe account?**
- CLARIFIED: Create DURING purchase, not before
- Collect verification data in dashboard Task #1 (before purchase)
- Store data in our database
- Create Stripe account when "Complete Purchase" is clicked
- Submit stored verification data to new Stripe account
- BENEFIT: No abandoned Stripe accounts, better fraud signals
- CONSIDERATION: If purchase fails, no Stripe account was created (good!)

**Q1: Trulio vs Stripe Identity - When to use which?**
- PRIMARY: Trulio for all KYC/KYB verification
- FALLBACK: Stripe Identity if:
  - Trulio API is down
  - Trulio rejects/fails verification
  - Merchant prefers Stripe's flow
- DECISION NEEDED: Should we offer choice or auto-fallback only?

**Q2: Trulio SDK Integration - Embedded vs Redirect?**
- RECOMMENDATION: Embedded modal/iframe in our app
- REASON: Seamless UX, no full-page redirect
- CONSIDERATION: Mobile app may need native SDK integration

**Q3: Data Flow - Who stores what?**
- Trulio: Identity verification results, document images
- Our DB: Merchant profile, verification status, Stripe account ID
- Stripe: Payment capability status, bank account info
- NEVER STORE: Full SSN, full account numbers, ID images

**Q4: Custom UI Maintenance - How do we stay compliant?**
- Subscribe to Stripe API changelog for requirement updates
- Trulio handles most KYC/KYB compliance automatically
- Quarterly compliance reviews with legal team
- Automated tests for all verification paths

### Technical Questions

**Q5: Can Stripe enable payments without bank account?**
- ✅ YES - `card_payments` capability can be active while `external_account` is empty
- Stripe automatically holds payouts until bank verified
- This is a standard Stripe feature, not a workaround

**Q6: How long are funds held by Stripe?**
- No time limit - held securely until bank account verified
- Industry standard practice for fraud prevention
- Funds remain in merchant's Stripe balance, not at risk

**Q7: Can merchant see held funds?**
- YES - Visible in Stripe Dashboard as "available balance"
- Should we build this into Lightspeed dashboard? (DECISION NEEDED)
- Merchant has full transparency

**Q8: What happens if Trulio verification fails?**
- Option A: Auto-retry with Stripe Identity
- Option B: Manual review by our team
- Option C: Reject merchant (last resort)
- DECISION NEEDED: What's our fallback strategy?

### UX Questions

**Q9: Should we force bank account setup immediately?**
- RECOMMENDATION: No, allow deferral
- REASON: Better conversion, lower friction, faster to value
- TRADEOFF: Some merchants may delay bank setup longer than ideal

**Q10: Should task show "completed" if bank not connected?**
- RECOMMENDATION: Show "Accepting Payments ✓" with warning badge
- REASON: Merchant CAN accept payments (main goal achieved)
- Badge: "⚠️ Add bank for payouts" indicates next action

**Q11: Trulio UX - How much can we customize?**
- Trulio SDK has limited customization (branding colors, logo)
- Full custom UI requires Trulio API integration (more complex)
- DECISION NEEDED: SDK (faster) or API (more control)?

**Q12: Dashboard Priority - Why payment setup first?**
- VALIDATION NEEDED: Is 1-2 day wait frustrating for merchants?
- ALTERNATIVE: Show POS Configuration first, payment setup second?
- CONSIDERATION: Parallel progress vs linear completion

### Business Questions

**Q13: What % of merchants typically add bank immediately vs later?**
- NEED DATA: Industry benchmarks
- ESTIMATE: 30-40% add immediately, 60-70% defer
- Should we A/B test immediate vs deferred bank setup prompts?

**Q14: Trulio Costs - How does pricing work?**
- Per-verification pricing model
- Failed verifications - do we pay?
- Volume discounts available?
- ROI vs Stripe Identity (which is free)?

**Q15: Should we have different flows for different cohorts?**
- Self-Serve: Can defer bank setup (current flow)
- Assisted: AE encourages bank setup during call
- Managed: IC ensures bank setup as part of implementation
- RECOMMENDATION: Same flow, different support levels

### Compliance Questions

**Q16: Trulio Data Retention - How long do they store verification data?**
- Need to verify Trulio's data retention policy
- GDPR/CCPA compliance for user data
- Right to deletion requests - how to handle?

**Q17: Do we need merchant consent for Trulio verification?**
- YES - Add to terms of service
- Explicit consent before launching Trulio SDK
- Explain what Trulio will collect and verify

**Q18: Stripe + Trulio integration - Is this approved by Stripe?**
- NEED TO VERIFY: Does Stripe allow third-party KYC providers?
- Check Stripe Connect Partner requirements
- May need to be a verified Stripe Partner

**Q19: Identity verification failure - What are merchant rights?**
- Right to appeal
- Manual review process
- Timeline for appeals
- Alternative verification methods

### Testing Questions

**Q20: How do we test Trulio integration?**
- Trulio provides sandbox environment
- Test IDs and documents available
- Can we automate E2E tests with Trulio mock?

**Q21: How do we test the "payments enabled, no bank" state?**
- Use Stripe test mode
- Don't add external_account to test account
- Verify UI shows correct state
- Test that payments can still process

**Q22: Fallback to Stripe Identity - How to test?**
- Mock Trulio API failures
- Test Stripe Identity API integration separately
- E2E test for automatic fallback

---

## Implementation Priority

### Phase 1: MVP (Week 1-2)
- [ ] Trulio SDK integration (identity verification)
- [ ] Custom business verification form
- [ ] Submit verification data to Stripe Connect API
- [ ] Verification pending state UI
- [ ] Webhook handler for account.updated events
- [ ] Email notification: Verification submitted
- [ ] Email notification: Payments enabled

### Phase 2: Bank Account (Week 3)
- [ ] Bank account connection form
- [ ] Plaid integration for instant verification
- [ ] Manual entry with micro-deposit verification
- [ ] Email notifications: Reminders and bank verified
- [ ] Dashboard warning badges for no bank

### Phase 3: Polish & Fallbacks (Week 4)
- [ ] Stripe Identity fallback integration
- [ ] Comprehensive error handling
- [ ] All edge case flows (rejection, appeal, etc.)
- [ ] Analytics tracking
- [ ] A/B testing setup for CTA buttons

### Phase 4: Enhancements (Future)
- [ ] Display held balance in Lightspeed dashboard
- [ ] Payout settings configuration
- [ ] Verification status history/timeline
- [ ] Multi-language support for Trulio
- [ ] Native mobile app SDK integration

---

## Decision Log

Decisions that have been made:

1. **Task Priority**: ✅ DECIDED - Payment Setup is first task on dashboard
   - Reason: Longest wait time (1-2 days), enables parallel progress

2. **Verification Provider**: ✅ DECIDED - Trulio primary, Stripe Identity fallback
   - Trulio handles KYC/KYB, Stripe Identity as backup

3. **UI Approach**: ✅ DECIDED - Custom UI with Trulio SDK embedded
   - Our wrapper, Trulio SDK for identity, custom forms for business

4. **Account Creation Timing**: ✅ DECIDED - During purchase (not before)
   - Collect data in Task #1 (before purchase)
   - Create Stripe account when merchant clicks "Complete Purchase"
   - Reduces abandoned accounts, better fraud signals

5. **Bank Setup Timing**: ✅ DECIDED - Allow deferral after payments enabled
   - Can accept payments without bank account
   - Payouts held until bank verified
   - Warning badges shown

6. **Task Completion Definition**: ✅ DECIDED - "Completed" when payments enabled
   - Even if bank account not yet connected
   - Badge shows "⚠️ Add bank for payouts"

7. **Purchase → Activation Flow**: ✅ CLARIFIED - Three-phase approach
   - Phase 1: Collect info (Task #1, before purchase)
   - Phase 2: Create account (during purchase)
   - Phase 3: Activate payments (1-2 days after purchase)

**Still Needed**:
- [ ] Trulio SDK vs API integration method
- [ ] Automatic fallback strategy if Trulio fails
- [ ] Display held balance in dashboard (yes/no)
- [ ] Alternative task ordering (payment setup first vs second)
- [ ] Stripe Partner verification requirements
- [ ] Trulio contract and pricing finalization

---

**Document Status**: Ready for Implementation (pending final decisions)
**Next Steps**:
1. Finalize open decisions with product/legal/engineering teams
2. Verify Stripe Partner requirements for Trulio integration
3. Begin backend API development
4. Integrate Trulio SDK in frontend

**Owner**: Product + Engineering Teams
**Last Updated**: January 2025
