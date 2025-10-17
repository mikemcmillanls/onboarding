# Prototype: Three-Pillar Implementation

This document maps how the prototype demonstrates each of the three strategic pillars from the onboarding transformation strategy.

## Overview

The prototype at `/onboarding` demonstrates all three pillars of the transformation strategy:

1. **Product-Owned Front Door** - Signup flow that collects data and assigns cohorts
2. **Unified Data Flow** - Behind-the-scenes data enrichment and pre-filling
3. **Unified Purchase Experience** - Single checkout for software + hardware

**Note**: This prototype paints the picture of what the complete experience would look like, including integration points with external systems (TrueBiz, Stripe, billing platforms).

---

## Pillar 1: Product-Owned Front Door

### Where It Exists in Prototype

**Pages/Routes**:
- `/get-started` - Two-page signup flow (product-owned, no sales involvement)
  - Page 1: Account creation (name, email, password, business name, phone)
  - Page 2: Business profiling (category, website, address, revenue, locations)

**Key Components**:
- `components/get-started/account-form.tsx` - Page 1 form
- `components/get-started/business-form.tsx` - Page 2 form with revenue/location selectors

**Cohort Assignment Logic**:
- `lib/merchant-mock-data.ts:265-284` - Cohort assignment based on revenue + locations
  - Self-Serve: <$500K revenue OR <3 locations
  - Assisted: $500K-$2M revenue AND 3-10 locations
  - Managed: $2M+ revenue OR 10+ locations

**Data Collected**:
```typescript
// Page 1
{
  firstName: string
  lastName: string
  email: string
  password: string
  businessName: string
  phone: string
}

// Page 2
{
  businessCategory: string
  businessWebsite: string      // For TrueBiz verification (planned)
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  annualRevenue: string        // Dropdown: under-100k, 100k-250k, etc.
  numberOfLocations: number
}
```

### Behind the Scenes

1. **Cohort Assignment**: Automatically calculated after Page 2 submission
   - Algorithm in `lib/merchant-mock-data.ts:265-284`
   - Stored in merchant profile: `cohort: 'self-serve' | 'assisted' | 'managed'`

2. **X-Series Account Provisioning**: Account created immediately after signup completion
   - Merchant lands in dashboard with cohort-specific experience

3. **Salesforce MQL Creation**:
   - Self-Serve merchants bypass sales entirely (no MQL created)
   - Assisted/Managed trigger automatic Salesforce MQL creation

4. **TrueBiz Verification**: Integration point for business data enrichment
   - Uses `businessWebsite` field collected during signup
   - Enriches merchant profile with: EIN, business structure, verified address
   - See: `docs/05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md`

5. **Fraud Prevention**: TrueBiz verification validates business legitimacy
   - Blocks suspicious signups before account provisioning

---

## Pillar 2: Unified Data Flow

### Where It Exists in Prototype

**Dashboard Tasks** (`/dashboard`):
- Task 1: "Verify Your Identity" - Pre-filled with signup data
- Task 2: "Hardware Selection" - Pre-filled shipping address
- Task 3: "Configure Your POS" - Pre-filled business details

**Key Components**:
- `components/dashboard/task-card.tsx` - Task list component
- `app/dashboard/page.tsx` - Main dashboard orchestration

### Behind the Scenes

**Data Flow Architecture**:

```
Signup Form (Page 2)
    ↓
Merchant Profile Created
    → businessName: "Joe's Coffee Shop"
    → businessAddress: { street, city, state, zip }
    → annualRevenue: "500k-1m"
    → numberOfLocations: 4
    → cohort: "assisted"
    ↓
Dashboard Tasks Access Merchant Profile
    ↓
    ├─→ Task 1: Verify Identity (LSPay)
    │    Pre-filled: businessName, businessAddress
    │    Merchant adds: Owner SSN/DOB, bank account
    │
    ├─→ Task 2: Hardware Selection
    │    Pre-filled: shipping address (from businessAddress)
    │    Merchant adds: Device selection, quantity
    │
    └─→ Task 3: Configure POS
         Pre-filled: businessName, numberOfLocations
         Merchant adds: Register configuration, product catalog
```

**Implementation Details**:
- Merchant data stored in `lib/merchant-mock-data.ts`
- Each task component receives `merchant` prop with full profile
- Tasks display pre-filled data (read-only) + input fields for merchant-specific additions

### What Gets Pre-Filled

**Task 1: Verify Your Identity (LSPay Application)**:
- ✅ Business name (from signup)
- ✅ Business address (from signup)
- ✅ EIN (from TrueBiz enrichment)
- ✅ Business structure (from TrueBiz enrichment)
- ⭕ Merchant adds: Owner details (SSN, DOB), bank account

**Task 2: Hardware Selection**:
- ✅ Shipping address (from signup businessAddress)
- ✅ Contact name (from signup firstName + lastName)
- ✅ Contact phone (from signup phone)
- ⭕ Merchant adds: Device selection (terminals, printers, etc.), quantity

**Task 3: Configure Your POS**:
- ✅ Business name (from signup)
- ✅ Number of locations (from signup)
- ⭕ Merchant adds: Register names, product catalog, pricing

### Integration Points

1. **TrueBiz Enrichment**:
   - After signup, call TrueBiz API with `businessWebsite`
   - Receive: EIN, business structure (LLC, Corp, etc.), verified address
   - Store in merchant profile for pre-filling

2. **Stripe Connect Account Creation**:
   - Account created during purchase (see `USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md`)
   - Pre-filled with: Business name, address, EIN (from TrueBiz)
   - Merchant only adds: Owner details, bank account

3. **Real-Time Status Updates**:
   - LSPay approval status (pending, approved, rejected)
   - Hardware shipment tracking (ordered, shipped, delivered)
   - Display in dashboard to prevent premature setup calls

---

## Pillar 3: Unified Purchase Experience

### Where It Exists in Prototype

**Location**:
- Task 2: "Hardware Selection" includes pricing summary
- Single "Complete Purchase" button at bottom of dashboard
- Checkout modal: Shows software ($89/month) + hardware ($450) = Total

### Behind the Scenes

**Unified Purchase Flow**:

```
Dashboard → Task 2: Hardware Selection
    ↓
Merchant selects devices:
  • 2× Terminals ($200 each)
  • 1× Receipt Printer ($50)
    ↓
Pricing Summary (always visible):
┌─────────────────────────────────┐
│ Software: $89/month (Starter)   │
│ Hardware: $450 (one-time)       │
│ ─────────────────────────────   │
│ Total Today: $539               │
│ Recurring: $89/month            │
└─────────────────────────────────┘
    ↓
[Complete Purchase] button
    ↓
Checkout Modal:
  • Payment method (credit card)
  • Billing address (pre-filled)
  • Order summary
  • Terms & conditions
    ↓
Single Transaction:
  → Charge: $539 (hardware + first month)
  → Subscription: $89/month recurring
  → Hardware order: Ships in 3 days
    ↓
Confirmation:
  "✅ Purchase complete!
   Software activated.
   Hardware ships in 3 days."
```

**Technical Implementation**:

1. **Single Checkout API**:
```typescript
POST /api/purchase
{
  merchantId: string
  software: {
    plan: 'starter' | 'professional' | 'enterprise'
    monthlyPrice: number
  }
  hardware: {
    items: [
      { sku: 'terminal-x100', quantity: 2, price: 200 },
      { sku: 'printer-p50', quantity: 1, price: 50 }
    ]
    total: number
    shippingAddress: Address  // Pre-filled from signup
  }
  paymentMethod: string
}

Response:
{
  orderId: string
  subscriptionId: string
  hardwareOrderId: string
  totalCharged: number
  recurringAmount: number
  estimatedShipDate: string
}
```

2. **Billing System Integration**:
   - Software: Create Chargeify subscription
   - Hardware: Create Ecwid order
   - Single receipt: Generate combined invoice
   - Future: Migrate to unified billing system

3. **AE Commission Tracking**:
   - Record full transaction value (software + hardware)
   - Update "Closed Won" definition in Salesforce
   - Trigger commission calculation: Software MRR + Hardware one-time

### Prototype Demonstrates

**Current Split Experience** (What we're replacing):
1. Merchant completes signup
2. Lands in dashboard, starts tasks
3. Task 1: LSPay application (separate form)
4. Exits to hardware store (separate checkout)
5. Returns to dashboard to complete setup
6. Two receipts, two confirmation emails

**New Unified Experience** (What prototype demonstrates):
1. Merchant completes signup (collects all data once)
2. Lands in dashboard, sees all 5 tasks
3. Task 1: LSPay pre-filled (adds only owner details)
4. Task 2: Hardware selection (sees pricing summary)
5. [Complete Purchase] - Single checkout
6. One receipt, clear next steps

---

## Data Optimization Behind the Scenes

### Data Storage

**Merchant Profile Structure** (`lib/merchant-mock-data.ts`):

```typescript
interface Merchant {
  id: string
  email: string
  businessName: string
  phone: string

  // Signup data (Page 2)
  businessCategory: string
  businessWebsite: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  annualRevenue: string
  numberOfLocations: number

  // Derived data
  cohort: 'self-serve' | 'assisted' | 'managed'
  onboardingStatus: 'not-started' | 'in-progress' | 'completed'

  // Task completion tracking
  tasks: {
    verifyIdentity: { status: 'pending' | 'in-progress' | 'completed', completedAt?: string }
    hardwareSelection: { status: 'pending' | 'in-progress' | 'completed', completedAt?: string }
    configurePOS: { status: 'pending' | 'in-progress' | 'completed', completedAt?: string }
    dataImport: { status: 'pending' | 'in-progress' | 'completed', completedAt?: string }
    teamSetup: { status: 'pending' | 'in-progress' | 'completed', completedAt?: string }
  }

  // Added after TrueBiz enrichment
  enrichedData?: {
    ein: string
    businessStructure: 'sole-proprietor' | 'llc' | 'corporation' | 's-corp' | 'partnership'
    verifiedAddress: Address
    businessVerificationStatus: 'verified' | 'pending' | 'failed'
  }
}
```

### Data Flow Optimizations

1. **Single Source of Truth**:
   - Merchant profile created once at signup
   - All tasks read from same profile
   - No duplicate data entry across tasks

2. **Pre-filling Logic**:
   - Task components receive `merchant` prop
   - Display read-only pre-filled fields
   - Merchant only fills missing information

3. **Progress Tracking**:
   - Task completion stored in merchant profile
   - Dashboard shows real-time progress (0 of 5 complete)
   - Can resume where they left off

4. **TrueBiz Enrichment Pipeline**:
```typescript
// After signup completion
POST /api/merchants/enrich
{
  merchantId: string
  businessWebsite: string
}

// TrueBiz API call
TrueBiz.verify(businessWebsite)
  → Returns: { ein, businessStructure, verifiedAddress }

// Update merchant profile
merchant.enrichedData = {
  ein: truebizResponse.ein,
  businessStructure: truebizResponse.businessStructure,
  verifiedAddress: truebizResponse.verifiedAddress,
  businessVerificationStatus: 'verified'
}

// Now available for pre-filling in Task 1 (LSPay)
```

5. **Stripe Connect Pre-filling**:
```typescript
// When merchant clicks "Complete Purchase"
// Create Stripe Connect account with pre-filled data
stripe.accounts.create({
  type: 'express',
  business_profile: {
    name: merchant.businessName,
    url: merchant.businessWebsite,
    mcc: getMccFromCategory(merchant.businessCategory)
  },
  business_type: merchant.enrichedData.businessStructure,
  company: {
    address: merchant.enrichedData.verifiedAddress,
    tax_id: merchant.enrichedData.ein,
    name: merchant.businessName
  }
})

// Merchant only needs to add:
// - Owner details (SSN, DOB)
// - Bank account (for payouts)
```

6. **Hardware Order Pre-filling**:
```typescript
// Hardware checkout form
{
  shippingAddress: merchant.businessAddress,  // Pre-filled
  contactName: `${merchant.firstName} ${merchant.lastName}`,  // Pre-filled
  contactPhone: merchant.phone,  // Pre-filled
  contactEmail: merchant.email,  // Pre-filled

  // Merchant only selects devices
  items: [/* selected hardware */]
}
```

---

## Key Pillar Locations Summary

### Pillar 1: Product-Owned Front Door

| What | Where in Prototype |
|------|--------------------|
| Two-page signup | `/get-started` |
| Account creation form | `components/get-started/account-form.tsx` |
| Business profiling form | `components/get-started/business-form.tsx` |
| Cohort assignment logic | `lib/merchant-mock-data.ts:265-284` |
| Revenue dropdown options | `lib/merchant-mock-data.ts:101-109` |
| TrueBiz verification | Integration point (see `TRUEBIZ_INTEGRATION_ANALYSIS.md`) |

---

### Pillar 2: Unified Data Flow

| What | Where in Prototype |
|------|--------------------|
| Merchant profile storage | `lib/merchant-mock-data.ts` |
| Dashboard task list | `app/dashboard/page.tsx` |
| Task 1: Verify Identity | `components/dashboard/task-card.tsx` |
| Task 2: Hardware Selection | `components/dashboard/task-card.tsx` |
| Task 3: Configure POS | `components/dashboard/task-card.tsx` |
| Pre-filling logic | Components receive `merchant` prop |
| TrueBiz enrichment | Integration point for data enrichment |
| Stripe Connect pre-fill | Integration point for payment setup |

---

### Pillar 3: Unified Purchase Experience

| What | Where in Prototype |
|------|--------------------|
| Pricing summary display | Dashboard shows software + hardware pricing |
| Single checkout button | "Complete Purchase" button in dashboard |
| Unified purchase API | `/api/purchase` endpoint |
| Combined billing | Chargeify + Ecwid integration point |
| AE commission tracking | Salesforce integration point |

---

## Prototype Demonstration Flow

### Self-Serve Merchant Example

**Step 1: Signup** (Pillar 1)
1. Navigate to `/get-started`
2. Page 1: Enter account details
3. Page 2: Select revenue "under-100k", 1 location
4. Cohort assigned: Self-Serve
5. Redirect to `/dashboard`

**Step 2: Dashboard Tasks** (Pillar 2)
1. Dashboard displays: "Your Setup Progress: 0 of 5 tasks complete"
2. Task 1: "Verify Your Identity"
   - Business name pre-filled: "Joe's Coffee Shop"
   - Business address pre-filled
   - Merchant adds: Owner SSN/DOB, bank account
3. Task 2: "Hardware Selection"
   - Shipping address pre-filled
   - Merchant selects: 1× Terminal, 1× Printer
4. See pricing summary: $89/month + $250 hardware

**Step 3: Purchase** (Pillar 3)
1. Click "Complete Purchase"
2. Checkout modal shows: $339 total ($250 hardware + $89 first month)
3. Single transaction completes
4. Confirmation: "Software activated! Hardware ships in 3 days."

**Result**: Merchant completes signup → purchase → activation in <15 minutes (vs. 33 days today)

---

## Related Documentation

- [Three-Pillar Strategy One-Pager](./ONBOARDING_TRANSFORMATION_ONE_PAGER_V3.md) - Strategic vision
- [User Flow 1: Signup and Provisioning](../02-design/USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Detailed signup flow
- [User Flow 2: Dashboard and Payments](../02-design/USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md) - Dashboard task structure
- [Revenue Cohort Mapping](./REVENUE_COHORT_MAPPING.md) - Cohort assignment rules
- [TrueBiz Integration Analysis](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md) - Data enrichment plan
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md) - Payment integration details

---

**Document Status**: Prototype mapping (current state + planned features)
**Last Updated**: 2025-10-17
**Prototype Location**: `/onboarding`
**Next Steps**: Implement Pillar 3 (unified purchase), integrate TrueBiz enrichment
