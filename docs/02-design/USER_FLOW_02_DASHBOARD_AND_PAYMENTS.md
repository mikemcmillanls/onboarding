# User Flow 2: Dashboard and Payment Setup

Complete documentation for the merchant dashboard and critical payment-related tasks: Individual Verification (Stripe Identity KYC), POS Configuration, and Payment Setup (bank account connection).

---

## Document Overview

This document describes the dashboard experience and the three critical tasks for payment activation:

1. **Individual Verification** - Collect identity data for Stripe Connect account creation
2. **POS Configuration** - Collect business setup data for Stripe Connect account configuration
3. **Bank Account Connection** - Enable payouts (optional - can be deferred)

**Important**: Tasks 1-2 collect data that is used later during purchase to create the Stripe Connect account. Payment processing activates 1-2 days after purchase completion.

---

## Table of Contents

1. [Merchant Dashboard](#merchant-dashboard)
2. [Task 1: Individual Verification (Stripe Identity)](#task-1-individual-verification-stripe-identity)
3. [Task 2: POS Configuration](#task-2-pos-configuration)
4. [Task 3: Payment Setup](#task-3-payment-setup)
5. [Verification Strategy: KYB vs KYC](#verification-strategy-kyb-vs-kyc)
6. [Data Flow](#data-flow)

---

## Merchant Dashboard

**Route**: `/dashboard`

**Purpose**: Post-signup hub with checklist of onboarding tasks

### Overview

The dashboard displays a 6-task checklist showing merchant setup progress. Each task is clickable and routes to a dedicated page. Tasks can be completed in any order (except blocked dependencies).

---

### Dashboard Layout

**Header**:
- Welcome message: "Welcome back, [Business Name]!"
- Overall progress indicator

**Payment Activation Flow Banner** (appears above task cards):
```
┌─────────────────────────────────────────────────────────────┐
│ [Info Banner - Light Blue Background]                       │
│                                                             │
│ 🎯 Ready to accept payments?                               │
│                                                             │
│ Complete these 3 steps to activate payment processing:    │
│   1. Verify Your Identity (10-15 minutes)                  │
│   2. Configure Your POS (2-3 minutes)                      │
│   3. Complete Your Purchase                                 │
│                                                             │
│ After purchase, we'll activate payments in 1-2 days.      │
│ You can add your bank account anytime to receive payouts. │
└─────────────────────────────────────────────────────────────┘
```

**Main Content**:
- 6 task cards in grid layout (1 col mobile, 2 cols desktop)
- Each card shows:
  - Icon with color-coded badge
  - Task title
  - Task description (updated to clarify purpose)
  - Status badge (not-started, in-progress, completed, blocked)
  - Action button ("Get Started", "Continue", "View/Edit")

---

### The 6 Dashboard Tasks

#### 1. Verify Your Identity ⭐ **Critical for Payments**

- **Route**: `/dashboard/verify`
- **Status**: Required, high priority
- **Icon**: ShieldCheck (red badge)
- **Title**: "Verify Your Identity"
- **Description**: "Complete identity verification for you and any business owners. This information will be used to activate payment processing after purchase."
- **Badge**: "Required to accept payments"
- **Time Estimate**: "10-15 minutes"
- **Note**: Business verification (KYB via TrueBiz) already completed at signup
- **Purpose**: Collect identity verification data (representatives and beneficial owners) that will be submitted to Stripe Connect when the merchant completes their purchase

#### 2. Configure Your POS ⭐ **Critical for Payments**

- **Route**: `/dashboard/pos-setup`
- **Status**: Required
- **Icon**: ShoppingCart (blue badge)
- **Title**: "Configure Your POS"
- **Description**: "Tell us about your business setup. Required to configure your payment processing and determine hardware needs."
- **Badge**: "Required to accept payments"
- **Time Estimate**: "2-3 minutes"
- **Purpose**: Collect POS configuration data (locations, registers) that will be used to configure the Stripe Connect account when the merchant completes their purchase
- **Data**: Number of locations, registers per location, e-commerce needs

#### 3. Connect Bank for Payouts ⚠️ **Optional**

- **Route**: `/dashboard/payments`
- **Status**: Optional (can be completed anytime)
- **Icon**: CreditCard (green badge)
- **Title**: "Connect Bank for Payouts"
- **Description**: "You can accept payments without this. Add your bank account to receive payouts from customer transactions."
- **Badge**: "Optional - add anytime"
- **Time Estimate**: "1-3 minutes (instant with Plaid)"
- **Purpose**: Connect bank account to receive payouts from payment processing
- **Important Note**: "You'll be able to accept payments without this step. Funds will be held securely by Stripe until you add your bank account."

#### 4. Hardware Selection

- **Route**: `/dashboard/hardware`
- **Status**: Optional
- **Purpose**: Select and order POS hardware bundles
- **Options**: Retail kits, restaurant kits, mobile kits ($899-$3,499)

#### 5. Data Import

- **Route**: `/dashboard/import`
- **Status**: Optional
- **Purpose**: Import products/customers from previous POS
- **Options**: CSV upload, start fresh, assisted migration

#### 6. Team Setup

- **Route**: `/dashboard/team`
- **Status**: Optional
- **Purpose**: Invite staff members and configure permissions

---

### Task Status System

**Not Started** (gray):
- Task has not been visited
- Shows "Get Started" button
- Gray icon badge

**In Progress** (blue):
- Task page visited or partially completed
- Shows "Continue" button
- Blue icon badge with partial fill

**Completed** (green):
- Task fully completed
- Shows green checkmark
- "View/Edit" button
- Completion timestamp stored

**Blocked** (red):
- Depends on incomplete task
- Shows warning message
- Action button disabled
- Example: "Complete Business Verification first"

---

### Data Persistence

**localStorage Keys**:
- `prequalificationData`: Account + business info from signup
- `merchantChecklistTasks`: Array of task completion status

**Task Status Calculation**:
- On dashboard load: Read from localStorage
- On task completion: Update localStorage + re-render
- Tasks show completion percentage on dashboard

---

## Task 1: Individual Verification (Stripe Identity)

**Route**: `/dashboard/verify`

**Purpose**: Collect identity verification data for business representatives and beneficial owners

**Priority**: ⭐ **CRITICAL** - Required to accept payments

**Time Estimate**: 10-15 minutes

---

### Important Notes

**What This Task Does**:
- Collects identity verification information (Stripe Identity KYC)
- Data is saved locally for use during purchase
- **No Stripe Connect account is created at this stage**

**When Stripe Account Is Created**:
- Stripe Connect account is created **during purchase** (when merchant clicks "Complete Purchase")
- Verification data collected here is submitted to Stripe at that time
- Payment processing activates 1-2 days after purchase

**Verification Type**:
- This task is specifically for **individual identity verification (KYC)** using **Stripe Identity**
- This is NOT business verification - that already happened at signup via TrueBiz

### Current Implementation

**Content**:
- Information about individual identity verification requirements for Stripe Connect
- List of required information:
  - Business representative: Full legal name, DOB, SSN, government-issued ID
  - Beneficial owners (25%+ ownership): Same information for each owner
  - Document upload: Driver's license or passport
  - Selfie/liveness check (optional but recommended)
- Security message: "Typically takes 5-10 minutes. Your information is encrypted."
- Explanation: "Required by Stripe to process payments and comply with financial regulations"

**Actions**:
- "Start Verification" button → Simulated flow (currently redirects back to dashboard after 1.5s)
- "Do This Later" button → Returns to dashboard

---

### Future Implementation with Stripe Identity

**Stripe Identity API integration** (mandatory for Stripe Connect):
- **Document verification**: Upload driver's license or passport
- **Selfie + liveness detection**: Verify person matches document photo
- **SSN validation**: Verify against government records
- **Biometric matching**: Face recognition between selfie and ID

**Verification Flow**:
1. Collect representative information
2. For each beneficial owner (25%+ ownership), collect their information
3. Upload government-issued ID for each person
4. Complete selfie/liveness check
5. Stripe verifies documents and identity (typically 5-30 minutes)
6. Return verification status: Approved / Needs Review / Rejected

**Data auto-population**: Stripe Identity results automatically populate Stripe Connect account `requirements` fields

**Real-time status tracking**: via Stripe webhooks

**Three-phase activation timeline**:
- **Phase 1 (Dashboard)**: Collect verification data → Store locally (this task)
- **Phase 2 (Purchase)**: Create Stripe account → Submit verification data → Stripe processes (1-2 days)
- **Phase 3 (Post-Purchase)**: Payment processing capability activates

**Payout capability**: Separate from payment capability - requires bank account connection (Task 3)

**Cost**: ~$2.00 per merchant ($1.50 document verification + $0.50 SSN check)

---

### Why This Is Separate from Business Verification

- **Business verification (TrueBiz)** at signup: Validates the business entity is legitimate (already completed)
- **Individual verification (Stripe Identity)** here: Validates the people behind the business (required by Stripe)
- **Stripe requirement**: Cannot bypass Stripe Identity for individual verification - it's mandatory for Stripe Connect Express accounts

### Integration Details

- See [Stripe Identity vs Trulioo Analysis](../05-integrations/STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md) for complete comparison
- See [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md) for detailed integration guide

---

## Task 2: POS Configuration

**Route**: `/dashboard/pos-setup`

**Purpose**: Collect POS configuration data for Stripe Connect account setup

**Priority**: ⭐ **CRITICAL** - Required for payment processing

**Time Estimate**: 2-3 minutes

---

### Important Notes

**What This Task Does**:
- Collects POS configuration (locations, registers, e-commerce needs)
- Data is saved locally for use during purchase
- **No Stripe Connect account is created at this stage**

**When This Data Is Used**:
- Stripe Connect account is created **during purchase**
- POS configuration collected here is used to configure the Stripe account at that time
- Determines payment routing, hardware requirements, and pricing

---

### Current Implementation

**Form Fields**:
- Number of locations (numeric input, min: 1)
- Registers per location (numeric input, min: 1)
- E-commerce integration (checkbox)

**Actions**:
- "Save Configuration" button → Saves to merchant data, returns to dashboard
- "Cancel" button → Returns to dashboard without saving

**Data Usage**:
- Stored for hardware recommendations
- Used for pricing calculations
- Affects software licensing quotes
- Required for Stripe Connect account configuration

---

### Why This Is Required for Payment Processing

**Required for Stripe Connect Account Configuration**:
- **Payment routing**: Stripe needs to know how many locations will process payments
- **Account structure**: Multi-location setup affects Stripe account configuration
- **Compliance**: Multi-location businesses have additional verification requirements

**Used for Business Operations**:
- **Hardware planning**: Determines number of terminals needed
- **Pricing**: Location count affects monthly subscription costs
- **Software licensing**: Affects how many POS licenses are needed

**Data Flow**:
1. Merchant completes this task (data saved locally)
2. Merchant completes purchase
3. POS config data sent to Stripe Connect account creation
4. Stripe configures account based on location/register count

---

## Task 3: Connect Bank for Payouts

**Route**: `/dashboard/payments`

**Purpose**: Connect bank account to receive payouts from customer payments

**Priority**: ⚠️ **OPTIONAL** - Can be completed anytime (payment processing works without this)

**Time Estimate**: 1-3 minutes (instant with Plaid), or 1-2 business days (manual verification)

---

### Important Notes

**Payment Processing vs Payouts**:
- **Payment Processing** (money in): Enabled by Tasks 1-2 + Purchase → Activates 1-2 days after purchase
- **Payouts** (money out): Enabled by this task → Bank account must be connected and verified

**You Can Accept Payments Without This**:
- Merchants can process customer payments without connecting a bank account
- Funds are held securely by Stripe until bank account is verified
- This provides faster time-to-first-transaction

**When to Complete**:
- ✅ Can be completed before purchase (proactive)
- ✅ Can be completed after purchase (deferred)
- ✅ Can be completed after first sale (as needed)
- ⚠️ Payouts won't flow until bank account is verified

---

### Current Implementation

**Form Fields**:
- Account holder name (text input)
- Bank name (text input)
- Routing number (numeric input)
- Account number (password field, masked)
- Confirm account number (password field, validation)

**Validation**:
- All fields required
- Account numbers must match
- Alert shown if mismatch

**Security Features**:
- Account numbers masked
- Security message: "We'll verify with 2 small deposits"
- Encryption badge

**Actions**:
- "Save Bank Account" button → Validates and saves
- "Do This Later" button → Returns to dashboard

---

### Future Implementation

**Two-phase payment setup**:
- **Phase 1 (Priority)**: Enable card payments capability - merchants can accept payments without bank account
- **Phase 2 (Optional)**: Enable payouts - connect bank account to receive funds

**Bank verification methods**:
- **Plaid** (recommended): Instant verification via online banking credentials (<1 minute)
- **Manual entry**: Micro-deposit verification (1-2 business days)

**Verification timing**: Payment processing activates 1-2 days after Stripe account creation; payouts held until bank account verified

**Payout settings and scheduling configuration**

---

### Why Bank Account Is Separate from Payment Capability

**Traditional Flow** (OLD):
- Merchant provides bank account
- Wait for bank verification (1-2 days)
- THEN enable payment processing
- **Problem**: Slow time-to-first-transaction

**Optimized Flow** (NEW):
- Enable payment processing immediately (after Stripe Identity)
- Merchant can accept payments day 1
- Hold payouts until bank account verified
- Payouts released once bank verified
- **Benefit**: Faster time-to-first-transaction

---

## Verification Strategy: KYB vs KYC

The application uses **two distinct verification systems** serving different purposes at different stages:

### 1. Business Verification (KYB) - TrueBiz at Signup

**When**: Page 2 of `/get-started` signup flow (BEFORE account creation)

**What**: Validates the business entity is legitimate

**Provider**: TrueBiz (business verification service via domain/URL lookup)

**Verification Checks**:
- Business website domain validation
- Business registration and legitimacy
- Address verification against business records
- Fraud detection and risk assessment
- Domain ownership validation

**Outcomes**:
- ✅ **APPROVED**: Account created, redirected to dashboard
- ⚠️ **REVIEW**: Manual review required, operations team notified
- ❌ **REJECTED**: Account creation blocked, user shown reason

**Data Collected**:
- Business name, category, website URL
- Business address (street, city, state, ZIP)
- Annual revenue range
- Number of locations

**Cost**: ~$0.50-$2.00 per verification (estimated, custom pricing)

**Why at Signup**:
- Prevent fraud before provisioning resources
- Block ineligible merchants early
- Avoid cost of creating accounts for high-risk businesses
- Meet compliance requirements upfront

---

### 2. Individual Verification (KYC) - Stripe Identity at Payment Setup

**When**: `/dashboard/verify` task page (AFTER signup, before payment processing)

**What**: Validates the people behind the business (representatives and beneficial owners)

**Provider**: Stripe Identity (required by Stripe Connect for payment processing)

**Verification Checks**:
- Government-issued ID verification (driver's license or passport)
- Selfie + liveness detection (biometric matching)
- SSN validation against government records
- Face recognition between selfie and ID photo
- Individual ownership percentage verification

**Who Gets Verified**:
- Business representative (primary contact)
- All beneficial owners with 25%+ ownership stake

**Outcomes**:
- ✅ **APPROVED**: Payment processing capability enabled (1-2 days)
- ⚠️ **NEEDS REVIEW**: Additional documentation required
- ❌ **REJECTED**: Cannot process payments, reason provided

**Data Collected**:
- Full legal name, date of birth, SSN
- Home address
- Government-issued ID (upload)
- Selfie photo (for biometric matching)

**Cost**: ~$2.00 per merchant ($1.50 document + $0.50 SSN check)

**Why Separate from Business Verification**:
- **Stripe requirement**: Cannot bypass - mandatory for Stripe Connect Express accounts
- **Different purpose**: Business legitimacy (TrueBiz) vs individual identity (Stripe Identity)
- **Financial regulations**: Required by anti-money laundering (AML) and Know Your Customer (KYC) laws
- **Auto-population**: Stripe Identity results automatically populate Stripe Connect account requirements

---

### Key Differences: Business (KYB) vs Individual (KYC)

| Aspect | Business Verification (KYB) | Individual Verification (KYC) |
|--------|----------------------------|-------------------------------|
| **Provider** | TrueBiz | Stripe Identity |
| **Timing** | At signup (Page 2) | After signup (Dashboard task) |
| **Purpose** | Validate business legitimacy | Validate individual identities |
| **What's Verified** | Business entity, website, address | People: representatives and owners |
| **Required For** | Account creation | Payment processing |
| **Can Be Bypassed** | No (but only for certain cohorts) | No - mandatory for all Stripe Connect accounts |
| **Cost** | ~$0.50-$2.00 | ~$2.00 |
| **Duration** | 5-10 seconds | 5-30 minutes |
| **Integration** | TrueBiz API | Stripe Identity API |
| **Data Captured** | Business info only | Personal info (SSN, DOB, ID) |

---

### Why Two Separate Verification Systems?

**Complementary, Not Redundant**:
- **TrueBiz (Business)**: Catches fraudulent businesses, fake websites, address mismatches
- **Stripe Identity (Individual)**: Catches identity theft, fake IDs, underage persons

**Regulatory Compliance**:
- **KYB (Know Your Business)**: Required by platform to prevent business fraud
- **KYC (Know Your Customer)**: Required by Stripe and financial regulations

**Cost Optimization**:
- **Self-Serve cohort (<$500K)**: Stripe Identity only (~$2.00/merchant)
- **Assisted cohort ($500K-$2M)**: TrueBiz + Stripe Identity (~$4.50/merchant)
- **Managed cohort ($2M+)**: Comprehensive verification + monitoring (~$9.50+/merchant)

**Cannot Replace Each Other**:
- ❌ TrueBiz **cannot** replace Stripe Identity - Stripe requires its own verification
- ❌ Stripe Identity **cannot** replace TrueBiz - it only verifies individuals, not businesses
- ✅ Both provide value in a layered security approach

---

## Data Flow

### Storage Architecture

**Client-Side Storage** (localStorage):
- Used for prototype/demo
- Persists across page reloads
- Cleared on browser cache clear

**Data Flow Diagram**:

```
User completes signup
      ↓
Dashboard loads with 6 tasks
      ↓
User clicks task
      ↓
Task page loads
      ↓
User completes form
      ↓
Data saved to localStorage
      ↓
Task marked complete
      ↓
Dashboard updates
```

---

### localStorage Keys

**`prequalificationData`** (from signup):
```typescript
{
  businessName: string;
  email: string;
  businessCategory: string;
  businessWebsite: string;
  businessAddress: { street, city, state, zipCode };
  annualRevenue: string;
  numberOfLocations: number;
  cohort: 'self-serve' | 'assisted' | 'managed';
  truebizVerification?: { status, verificationId, score, riskFlags };
  createdAt: string;
}
```

**`merchantChecklistTasks`**:
```typescript
Array<{
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  required: boolean;
  route: string;
  completedAt?: string;
}>
```

---

## Common Task Page Patterns

All task pages follow a consistent structure:

**Layout**:
- Back button to `/dashboard`
- Icon badge with color-coded task category
- Page title and description
- Form or information card
- Primary action button (red Lightspeed brand color)
- "Do This Later" secondary button

**Animations**:
- Page entrance: Fade in + slide up (Framer Motion)
- Form validation: Error messages animate in
- Button loading states: Spinner + "Processing..." text

**Responsive Design**:
- Mobile-first layouts
- Forms stack vertically on mobile
- Multi-column grids on desktop

---

## Complete Payment Activation Flow

This section shows the complete journey from signup through full payment activation.

### Timeline Overview

```
Day 0: Merchant completes signup
  ↓
  TrueBiz KYB verification (10 seconds)
  ↓
  Account created → Dashboard access
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DASHBOARD TASKS (Pre-Purchase)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Day 0-1: Merchant completes Task 1 (Individual Verification)
  ↓
  Stripe Identity KYC (5-30 minutes)
  ↓
  ✅ Verification data collected and saved locally
  ↓
Day 0-1: Merchant completes Task 2 (POS Configuration)
  ↓
  POS setup form (2-3 minutes)
  ↓
  ✅ POS config data saved locally
  ↓
Day 0-1: Merchant completes Task 3 (Bank Account) [OPTIONAL]
  ↓
  Bank account connection (1 minute with Plaid)
  ↓
  ✅ Bank info saved (or skipped for later)
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 PURCHASE FLOW (Stripe Account Creation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Day 1: Merchant completes hardware/software purchase
  ↓
  🔑 Stripe Connect account created
  ↓
  Verification data submitted to Stripe
  ↓
  POS config data submitted to Stripe
  ↓
  Bank account data submitted (if provided)
  ↓
  Stripe begins background processing
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PAYMENT ACTIVATION (Post-Purchase)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Day 2-3: Stripe completes verification
  ↓
  ✅ Payment processing capability activates
  ↓
  Merchant can accept card payments
  ↓
  (Payouts held until bank account verified)
  ↓
Day 2-4: Bank account verification completes
  ↓
  Option 1: Plaid instant verification (immediate)
  Option 2: Micro-deposits (1-2 business days)
  ↓
  ✅ Bank account verified
  ↓
  ✅ Payouts enabled
  ↓
🎉 Fully operational merchant
   - Can accept payments
   - Can receive payouts
```

### Key Phases Explained

**Phase 1: Data Collection (Dashboard Tasks)**
- **What Happens**: Merchant completes Tasks 1-3 on dashboard
- **Data Storage**: All data saved to localStorage (prototype) or database (production)
- **Stripe Account**: NOT created yet
- **Duration**: 15-20 minutes total (can be done over multiple sessions)

**Phase 2: Account Creation (During Purchase)**
- **Trigger**: Merchant clicks "Complete Purchase" button
- **What Happens**: Stripe Connect account created, verification data submitted
- **Stripe Processing**: Begins background verification (1-2 days)
- **Duration**: Immediate (account creation), 1-2 days (activation)

**Phase 3: Payment Activation (Post-Purchase)**
- **What Happens**: Stripe completes verification, enables payment processing
- **Merchant Experience**: Receives email "You can now accept payments"
- **Timeline**: 1-2 business days after purchase
- **Payouts**: Held until bank account verified (separate timeline)

### Why This Approach?

**Benefits of Pre-Collecting Data**:
- ✅ Reduces checkout friction (data already collected)
- ✅ Merchant can think about each task separately
- ✅ Verification can be completed over multiple sessions
- ✅ Prevents abandoned Stripe accounts (only create when committed via purchase)
- ✅ Better fraud signals for Stripe (verified + paid for hardware)

**Alternative Approach (Not Used)**:
- ❌ Create Stripe account immediately after Task 1 completion
- ❌ Problem: Many abandoned Stripe accounts if merchants don't complete purchase
- ❌ Problem: Merchant might not be ready to commit yet

---

## Related Documentation

**Previous Step**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md)

**Next Step**:
- [User Flow 3: Additional Setup Tasks](./USER_FLOW_03_ADDITIONAL_SETUP.md)

**Integration Details**:
- [Stripe Identity vs Trulioo Analysis](../05-integrations/STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md)
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md)
- [TrueBiz Integration Analysis](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md)

**Design Specifications**:
- [Design Specifications](./DESIGN_SPECIFICATIONS.md)
- [Component Guide](../03-implementation/COMPONENT_GUIDE.md)

---

**Last Updated**: January 2025
**Version**: Current State (Prototype + Stripe/TrueBiz Integration Planning)
**Maintainer**: Product & Engineering Teams
