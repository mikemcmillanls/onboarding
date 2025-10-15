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

### **Stripe Identity** (Future Alternative)
- **Status**: Not yet implemented
- **Purpose**: Could replace Trulioo for identity verification in the future
- **Note**: Stripe's built-in identity verification API (document upload, selfie, liveness checks)

---

## Table of Contents

1. [Verification Providers](#verification-providers)
2. [Key Architecture Principles](#key-architecture-principles)
3. [User Journey Overview](#user-journey-overview)
4. [Phase 1: Signup](#phase-1-signup-no-stripe-account-created)
5. [Phase 2: Data Collection](#phase-2-data-collection-dashboard-tasks)
6. [Phase 3: Purchase & Verification](#phase-3-purchase-and-verification)
7. [Phase 4: Bank Account Setup](#phase-4-bank-account-setup-optional)
8. [Timeline Expectations](#timeline-expectations)
9. [Related Documentation](#related-documentation)

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

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: SIGNUP (Immediate - NO Stripe account yet)        │
├─────────────────────────────────────────────────────────────┤
│ • Merchant completes signup form                            │
│ • TrueBiz business verification (KYB)                       │
│ • Create Lightspeed user account                            │
│ • Assign cohort (self-serve/assisted/managed)               │
│ • Redirect to dashboard with verification task              │
│ • NO STRIPE ACCOUNT CREATED YET                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: DATA COLLECTION (Dashboard Tasks - Before Purchase)│
├─────────────────────────────────────────────────────────────┤
│ Step 1: Business Representative Collection (KYC)           │
│         → Data SAVED to YOUR database (encrypted)           │
│         → ToS acceptance captured (date, IP, user agent)    │
│ Step 2: Business Entity Information (KYB)                  │
│         → Data SAVED to YOUR database                       │
│ Step 3: Beneficial Owners (if 25%+ ownership exists)       │
│         → Data SAVED to YOUR database                       │
│ Step 4: Location Confirmation                              │
│         → Data SAVED to YOUR database                       │
│                                                             │
│ ALL DATA STORED IN YOUR DATABASE - No Stripe API calls yet │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: PURCHASE FLOW (Stripe account created HERE)       │
├─────────────────────────────────────────────────────────────┤
│ • Merchant completes Tasks 1-2 (data collection)            │
│ • Merchant configures POS (locations, registers)            │
│ • Merchant selects hardware bundles                         │
│ • Merchant clicks "Complete Purchase"                       │
│ • Process payment for hardware/software                     │
│                                                             │
│ 🔑 CREATE STRIPE ACCOUNT WITH ALL PRE-COLLECTED DATA        │
│   → stripe.accounts.create() with complete profile          │
│   → stripe.accounts.createPerson() for rep + owners         │
│   → All in one transaction (< 1 second)                     │
│   → Store Stripe account ID in database                     │
│                                                             │
│ • Order confirmed → Hardware ships                          │
│ • Verification processes in background (1-2 days)           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: VERIFICATION (Background - After Purchase)        │
├─────────────────────────────────────────────────────────────┤
│ • Stripe processes verification (1-2 business days)          │
│ • Checks SSN against government records                      │
│ • Verifies addresses and business entity                     │
│ • Webhook: account.updated → charges_enabled = true         │
│ • Payment processing activates                               │
│ • Merchant can accept payments                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: BANK ACCOUNT (Optional - Anytime)                 │
├─────────────────────────────────────────────────────────────┤
│ • Merchant adds bank account for payouts                    │
│ • Micro-deposit verification (1-2 days) or instant (Plaid)  │
│ • payouts_enabled becomes true                              │
│ • Funds flow to bank account                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Signup (NO Stripe Account Created)

**Route**: `/get-started` → `/dashboard`

**Purpose**: Capture basic business information and route merchant to dashboard

**Duration**: 5-10 minutes

---

### What Happens

1. **Merchant Completes Signup Form**
   - See [User Flow 1: Signup](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) for complete signup flow

2. **TrueBiz Business Verification (Automatic)**
   - Validates business legitimacy via website domain
   - Fraud detection and risk assessment
   - Returns: APPROVED / REVIEW / REJECTED

3. **Lightspeed Account Created** (If TrueBiz approves)
   - User account created in Lightspeed database
   - Cohort assigned (Self-Serve / Assisted / Managed)
   - **Important**: NO Stripe account created yet

4. **Merchant Redirected to Dashboard**
   - Sees Task #1: "Verify Your Identity" (not started)
   - Sees Task #2: "Configure Your POS" (not started)
   - Cannot purchase until these tasks complete

---

### Data Captured During Signup

| Field | Source | Pre-filled Later? | Why Required |
|-------|--------|-------------------|--------------|
| Business Name | Signup form | Yes → Step 2 | Required for Stripe company account |
| Email | Signup form | Yes → Step 1 | Primary contact and account identifier |
| Business Phone | Signup form | Yes → Step 2 | Required for payment processing |
| Business Website | Signup form | Yes → Step 2 | Required for card-not-present transactions |
| Business Structure | Signup form | Yes → Step 2 | Determines verification requirements |
| Business Address | Signup form | Yes → Step 2 | Required for legal entity verification |
| Business Category | Signup form | Yes → Step 2 | Determines MCC code (processing rates) |
| Annual Revenue | Signup form | No (cohort only) | Cohort assignment |
| Number of Locations | Signup form | No (config only) | Configuration planning |

---

### What Merchant Sees

**Dashboard After Signup**:
```
Welcome, [Business Name]!

Complete these tasks to activate payments:

Task 1: Verify Your Identity              ⭕ Not Started
        Provide representative information
        Estimated time: 10-15 minutes

Task 2: Configure Your POS                ⭕ Not Started
        Set up locations and hardware
        Estimated time: 5-10 minutes

[Button: Complete Purchase] 🔒 Locked
Complete Tasks 1-2 to unlock purchase
```

---

## Phase 2: Data Collection (Dashboard Tasks)

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
| Phone | Yes (from signup) | Confirm/Edit | Contact for verification issues |
| Date of Birth | No | Enter (MM/DD/YYYY) | Age verification (18+) and identity check |
| **Home Address** |
| Street Address | No | Enter | Identity verification via credit bureaus |
| City | No | Enter | Identity verification |
| State | No | Select dropdown | Identity verification |
| ZIP Code | No | Enter (5 digits) | Identity verification |
| **Identity Verification** |
| SSN Last 4 | No | Enter (4 digits) | Identity verification (full SSN not required unless verification fails) |
| **Role in Business** |
| Title/Role | No | Select dropdown | Determines authority level |
|  |  | Options: Business Owner, CEO, CFO, Other | |
| Ownership % | Conditional | Enter if owner | Required for owners, determines beneficial owner status |
| **Terms & Agreements** |
| ToS Acceptance | No | Check box + timestamp | Legal requirement for Stripe processing |

**ToS Acceptance Checkbox**:
```
☐ I agree to Stripe's Connected Account Agreement and authorize
  Lightspeed to share my information with Stripe for payment processing.

  [Link: View Stripe Connected Account Agreement]
```

---

#### Validation Rules

- **Age**: Must be 18+ years old (calculated from DOB)
- **SSN Last 4**: Exactly 4 digits, numbers only
- **Address**: Must be valid US address
- **Email**: Valid email format
- **Phone**: Valid US phone number (10 digits)
- **Ownership %**: If owner selected, percentage required (1-100)
- **ToS**: Must be checked to proceed

---

#### What Happens After Submission

1. **Data Saved**: Information stored securely in Lightspeed database (encrypted)
2. **ToS Captured**: Acceptance timestamp, IP address, and browser info recorded
3. **Task Status**: Changes from "Not Started" → "Completed"
4. **Next Step**: Merchant can proceed to Task #2 (Business Entity Information)
5. **No Verification Yet**: Trulioo identity verification runs AFTER purchase, not now

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
| **Business Location** |
| Street Address | Yes (from signup) | Confirm/Edit | Legal registered address |
| City | Yes (from signup) | Confirm/Edit | Business verification |
| State | Yes (from signup) | Confirm/Edit | Business verification |
| ZIP Code | Yes (from signup) | Confirm/Edit | Business verification |
| **Business Description** |
| Business Website | Yes (from signup) | Confirm/Edit | Required for card-not-present processing |
| Product Description | No | Enter (textarea) | What you sell - Stripe uses for risk assessment |
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
- **Website**: Valid URL format, or can enter "None" if no website
- **Phone**: Valid US phone number (10 digits)
- **Product Description**: Minimum 10 characters, describe what you sell/provide

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

### Step 4: Location Configuration (Optional for Phase 2)

**Dashboard Task**: "Configure Your Locations" (Separate from payment verification)

**Estimated Time**: 2-5 minutes

**Purpose**: Configure POS locations and hardware needs (not required for payment verification)

**Note**: This step is for Lightspeed X-Series configuration, NOT for Stripe verification. Stripe verification is at the account level - all locations use the same Stripe account.

---

#### What Merchant Sees

**Form Title**: "Configure Your Locations"

**Instructions**: "Tell us about your store locations so we can configure your POS system."

---

#### Data Collected

| Field | Pre-filled? | User Action | Purpose |
|-------|-------------|-------------|---------|
| Number of Locations | Yes (from signup) | Confirm/Edit | Software licensing |
| **For Each Location** | | | |
| Location Name | No | Enter (e.g., "Main Street Store") | Internal reference |
| Street Address | No | Enter | Hardware shipping address |
| City | No | Enter | Hardware shipping |
| State | No | Select | Hardware shipping |
| ZIP Code | No | Enter | Hardware shipping |
| Registers per Location | No | Enter (number) | Hardware and license planning |

---

#### Why This Data?

- **Not for Stripe**: Stripe doesn't need location-specific data (verification is account-level)
- **Software Licensing**: Determines number of POS licenses needed
- **Hardware Shipping**: Where to send POS terminals and equipment
- **System Configuration**: Pre-configure X-Series with location structure

---

#### What Happens After Submission

1. **Data Saved**: Location information stored in Lightspeed database
2. **Quote Generated**: System calculates software + hardware costs based on locations
3. **Ready to Purchase**: Purchase button unlocks (if Tasks 1-2 also complete)
4. **Future Use**: Shipping addresses used when hardware is ready to ship

---

## Phase 3: Purchase and Verification

**Route**: `/dashboard` → `/checkout` → Background verification

**Purpose**: Merchant completes purchase, Stripe account created, verification processes automatically

**Duration**: 5 minutes (purchase) + 1-2 business days (verification)

---

### Purchase Gate Requirements

Before merchant can click "Complete Purchase", these must be true:

| Requirement | Status Needed | User Message if Blocked |
|-------------|---------------|-------------------------|
| Task #1: Representative Data | Complete | "Please complete Task 1: Verify Your Identity" |
| Task #2: Business Entity Data | Complete | "Please complete Task 2: Configure Your Business" |
| ToS Acceptance | Checked | "Please accept Stripe's Connected Account Agreement" |
| Beneficial Owners (if required) | Complete | "Please add all co-owners with 25%+ ownership" |
| Location Configuration | Complete | "Please configure at least one location" |

---

### Dashboard States

**Before Tasks Complete**:
```
Task 1: Verify Your Identity        ⭕ Not Started
Task 2: Configure Your Business     ⭕ Not Started

[Button: Complete Purchase] 🔒 Locked
Complete Tasks 1-2 to unlock
```

**After Tasks Complete**:
```
Task 1: Verify Your Identity        ✓ Complete
Task 2: Configure Your Business     ✓ Complete

[Button: Complete Purchase] ✓ Ready
Review and complete your order
```

**After Purchase (Verification in Progress)**:
```
Task 1: Verify Your Identity        ✓ Complete
Task 2: Configure Your Business     ✓ Complete

Order Status: ✓ Purchase Complete
Verification Status: ⏳ In Progress (1-2 business days)

What's happening:
• Your identity and business are being verified
• Hardware will ship once verification completes
• You'll receive email updates on progress
```

**After Verification Completes**:
```
Order Status: ✓ Purchase Complete
Verification Status: ✓ Approved
Hardware Status: 📦 Shipped

✓ You're approved to accept payments!
Next: Set up your POS hardware when it arrives
```

---

### What Happens Behind the Scenes (After Purchase)

**Step 1: Purchase Complete** (Immediate)
- Merchant pays for software + hardware via standard payment processing
- Order confirmation displayed
- Confirmation email sent

**Step 2: Stripe Account Creation** (< 1 second, automatic)
- System retrieves all pre-collected data from database
- Stripe Custom account created with complete profile
- Representative and beneficial owners added
- ToS acceptance submitted
- Stripe account ID stored in database

**Step 3: Identity Verification Begins** (Background, 1-2 business days)
- **Trulioo KYC**: Verifies individual identities (representative + owners)
  - Checks SSN against government records
  - Validates addresses via credit bureaus
  - Confirms age and identity
- **Trulioo KYB**: Verifies business entity
  - Checks EIN against IRS records
  - Validates business registration
  - Confirms legal structure
- **Stripe Processing**: Processes verification results
  - Reviews for compliance
  - Assesses risk profile
  - Enables payment capabilities

**Step 4: Verification Complete** (Webhook notification)
- System receives Stripe webhook: `account.updated`
- Status changes: `charges_enabled = true`
- Email sent to merchant: "You're approved to accept payments!"
- Hardware shipping triggered

**Step 5: Hardware Ships** (After verification)
- Ships to location addresses
- Tracking number sent via email
- Estimated delivery: 3-5 business days

**Step 6: Payments Ready** (When hardware arrives)
- Merchant sets up POS terminals
- Can immediately accept payments
- Funds accumulate in Stripe balance
- Payouts held until bank account added (optional)

---

## Phase 4: Bank Account Setup (Optional)

**Route**: `/dashboard` → "Add Bank Account" task

**Purpose**: Enable payouts so merchant can receive funds from transactions

**When**: Anytime - before purchase, after purchase, or after first sale

**Duration**: 2-3 minutes + 1-2 days verification (or instant with Plaid)

**Important**: Merchants can accept payments WITHOUT a bank account. Funds accumulate in Stripe balance until bank account is verified.

---

### What Merchant Sees

**Dashboard Task** (Optional, appears after payment approval):
```
Task: Add Bank Account for Payouts    ⭕ Not Started (Optional)
      Connect your bank to receive funds
      Estimated time: 2 minutes
```

**Form Title**: "Add Bank Account"

**Instructions**: "Connect your bank account to receive payouts from sales. You can accept payments without this, but funds will be held until you add a bank account."

---

### Data Collected

| Field | Pre-filled? | User Action | Why Required |
|-------|-------------|-------------|--------------|
| Account Holder Name | No | Enter (person or business name) | Must match bank records |
| Account Holder Type | No | Select: Individual or Company | Determines verification requirements |
| Bank Name | No | Enter (e.g., "Chase", "Wells Fargo") | For display purposes only |
| Routing Number | No | Enter (9 digits) | Identifies bank |
| Account Number | No | Enter (4-17 digits) | Identifies account |
| Confirm Account Number | No | Re-enter for validation | Prevents typos |

---

### Validation Rules

- **Routing Number**: Exactly 9 digits, numbers only
- **Account Number**: 4-17 digits (varies by bank), numbers only
- **Account Numbers**: Must match exactly
- **Account Holder Name**: Must match business name or individual name on account

---

### Verification Methods

**Option 1: Micro-Deposit Verification** (Standard, 1-2 business days)

1. **Submit Bank Info**: Merchant enters routing and account numbers
2. **Stripe Sends Deposits**: Stripe sends 2 small deposits (e.g., $0.32, $0.45) to the account
3. **Wait 1-2 Days**: Deposits appear in merchant's bank account
4. **Confirm Amounts**: Merchant returns to dashboard and enters the two deposit amounts
5. **Verification Complete**: Stripe verifies → payouts enabled automatically

**Option 2: Instant Verification via Plaid** (Immediate, if available)

1. **Click "Verify Instantly"**: Merchant chooses instant verification option
2. **Redirect to Plaid**: Merchant redirected to Plaid authentication
3. **Log into Bank**: Merchant logs into their bank via Plaid
4. **Confirm Ownership**: Plaid confirms account ownership
5. **Verification Complete**: Immediately verified → payouts enabled right away

---

### What Happens After Verification

- **Payouts Enabled**: `payouts_enabled = true` in Stripe
- **Automatic Payouts**: Funds transfer automatically (default: daily, 2-day delay)
- **Email Notification**: "Bank account verified - payouts enabled!"
- **Dashboard Update**: Task status changes to "Complete"

---

### Why This Is Optional

- **Can Accept Payments Without Bank**: Merchant can process transactions immediately
- **Funds Held Safely**: Funds accumulate in Stripe balance until bank account verified
- **Flexible Timing**: Merchant can add bank account whenever convenient
- **No Pressure**: Can start selling before setting up payouts

---

## Verification Error Handling (What Merchants See)

If verification fails or requires additional information, merchants see clear guidance in their dashboard:

### Common Verification Issues

| Issue | What Merchant Sees | Action Required |
|-------|-------------------|-----------------|
| Name mismatch | "The name provided doesn't match our records" | Re-enter correct legal name |
| Address mismatch | "Address doesn't match the document provided" | Update address or upload different document |
| DOB mismatch | "Date of birth doesn't match" | Correct DOB or upload government ID |
| SSN verification failed | "We couldn't verify your identity automatically" | Upload government ID document |
| Unclear document | "Document image is unclear or incomplete" | Upload clearer photo |
| Expired document | "Please provide a current, unexpired document" | Upload valid, unexpired document |

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

**Next Flow**:
- [User Flow 2: Dashboard](./USER_FLOW_02_DASHBOARD.md) - Dashboard overview and task management

**Previous Flow**:
- [User Flow 1: Signup](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Signup and cohort assignment

**Technical References** (for engineering team):
- [Stripe Custom Accounts Documentation](https://docs.stripe.com/connect/custom-accounts)
- [Required Verification Information](https://docs.stripe.com/connect/required-verification-information)
- [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification)
- [Testing Verification](https://docs.stripe.com/connect/testing-verification)
- [Trulioo Integration Documentation](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md)

---

**Document Status**: Prototype Design Specification
**Last Updated**: January 2025
**Audience**: Product managers, designers, stakeholders
**For Implementation Details**: See technical documentation in `/docs/05-integrations/`
