# User Flows Index

Complete navigation guide for Lightspeed X-Series merchant onboarding user flow documentation.

---

## Quick Navigation

| Flow | Description | Key Topics | Duration |
|------|-------------|------------|----------|
| **[Flow 1: Signup](#user-flow-1-signup-and-provisioning)** | Account creation and provisioning | Marketing → 2-page signup → TrueBiz verification → Cohort assignment | 5-10 min |
| **[Flow 2: Dashboard](#user-flow-2-dashboard-experience)** | Dashboard and 6 setup tasks | 6 task cards, cohort experiences, data pre-collection | 30-45 min |
| **[Flow 3: Verification](#user-flow-3-identity-verification-lspay)** | KYC/KYB data collection (Task 1) | Representative info, beneficial owners, Stripe requirements | 10-15 min |
| **[Flow 4: Purchase](#user-flow-4-subscription-and-hardware-purchase)** | Complete purchase experience | Software licensing, hardware bundles, checkout, Stripe account creation | 10-20 min |

---

## User Flow 1: Signup and Provisioning

**File**: [USER_FLOW_01_SIGNUP_AND_PROVISIONING.md](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md)

**Purpose**: Document the complete signup journey from marketing website through TrueBiz verification and account provisioning.

### What's Covered

#### Marketing & Signup (Pages 1-2)
- Marketing landing page (`/`)
- 2-page signup flow (`/get-started`)
  - **Page 1**: Account creation (business name, email, password)
  - **Page 2**: Business information (category, website, phone, structure, address, revenue, locations)

#### TrueBiz Business Data Enhancement
- Business website validation and enrichment
- Fraud detection and risk assessment
- **NOT official KYB** - that's handled by Trulioo in Flow 3
- Outcomes: APPROVE / REVIEW / REJECT

#### Cohort Assignment
- **Self-Serve**: <$500K revenue OR <3 locations
- **Assisted**: $500K-$2M revenue OR 3-10 locations
- **Managed**: $2M+ revenue OR 10+ locations
- Revenue range mapping table

#### Account Provisioning
- Lightspeed X-Series account creation
- Data transfer and initial configuration
- Redirect to dashboard

#### First Dashboard Landing
- Welcome header and progress indicator
- Payment activation banner (3 steps to activate)
- 6 task cards preview
- Cohort-specific elements (specialist banners)

### Key User Journey
```
Marketing Page → Get Started → Page 1 (Account) → Page 2 (Business) →
TrueBiz Verification (5-10s) → Cohort Assignment → Provisioning → Dashboard
```

### When to Reference This
- Designing signup forms and validation
- Understanding cohort assignment logic
- Implementing TrueBiz business data enhancement
- Setting up initial dashboard state

---

## User Flow 2: Dashboard Experience

**File**: [USER_FLOW_02_DASHBOARD.md](./USER_FLOW_02_DASHBOARD.md)

**Purpose**: Document the merchant dashboard - the central hub where merchants complete 6 setup tasks before purchase.

### What's Covered

#### Landing on Dashboard
- Welcome message and progress indicator
- Payment activation banner (3-step path)
- 6 task cards with status indicators
- Visual hierarchy (critical vs optional tasks)

#### Cohort-Specific Dashboard Experiences
- **Self-Serve**: Standard dashboard, no specialist banner
- **Assisted**: Optional AE consultation banner, free IC support
- **Managed**: Dedicated account manager card, white-glove messaging

#### The 6 Dashboard Tasks

**Critical Tasks (Required for Payment Processing)**:
1. **Verify Your Identity** (10-15 min)
   - Collect KYC/KYB data for Stripe
   - See [Flow 3](#user-flow-3-identity-verification-lspay) for complete details

2. **Configure Your POS** (2-3 min)
   - Locations, registers per location, e-commerce toggle
   - Determines Stripe capabilities and hardware needs
   - **Complete UI flow, data table, validation rules**

**Optional Tasks (Can Be Completed Anytime)**:
3. **Connect Bank for Payouts** (1-3 min)
   - Plaid instant verification vs manual micro-deposits
   - Payout schedule and timing
   - **Merchants can accept payments without this**
   - **Complete UI flow, two connection methods**

4. **Hardware Selection** (5-10 min)
   - Pre-configured bundles ($799-$2,499)
   - À la carte hardware options
   - Shipping and delivery details
   - **Complete bundle details and pricing**

5. **Data Import** (10-30 min)
   - Three options: CSV upload, direct migration, assisted migration
   - Supported POS systems (Square, Clover, Toast, Shopify, Vend)
   - **Complete data types and validation**

6. **Team Setup** (3-5 min per member)
   - Team roles and permissions table
   - PIN code system for POS login
   - Invitation flow and employee onboarding
   - **Complete roles, permissions matrix, UI flow**

#### Background: Stripe Account Creation
- **CRITICAL**: Account created **DURING PURCHASE** (not at signup)
- Data pre-collection strategy explained
- Why create account during purchase (cost optimization)
- What happens in background (simplified, no code)

#### Task Status System
- Not Started (gray) → In Progress (blue) → Completed (green)
- Action buttons change per status

#### Payment Activation Timeline
- Complete journey from signup to fully operational
- 1-2 days for verification processing after purchase
- Bank account optional for accepting payments

### Key User Journey
```
Land on Dashboard → Complete Task 1 (Verify) → Complete Task 2 (Configure POS) →
[Optional: Tasks 3-6] → Ready to Purchase (Flow 4)
```

### When to Reference This
- Implementing dashboard task cards
- Understanding data pre-collection strategy
- Designing cohort-specific experiences
- Planning Stripe account creation timing

---

## User Flow 3: Identity Verification (LSPAY)

**File**: [USER_FLOW_03_LSPAY.md](./USER_FLOW_03_LSPAY.md)

**Purpose**: Document the complete KYC/KYB data collection flow for Stripe Connect Custom account verification (Dashboard Task 1).

### What's Covered

#### User Journey Overview
- Entry point: Dashboard Task 1 "Verify Your Identity"
- Exit point: Return to dashboard, task marked complete
- **Purpose**: Collect all required data for Stripe verification
- **Note**: Data stored in YOUR database, submitted to Stripe during purchase

#### Step 1: Business Representative Information
- Personal identity data (first name, last name, DOB, SSN last 4)
- Personal phone and home address
- Title/Role dropdown (determines relationship flags)
- **Critical**: Support Phone field (required by Stripe)
- Complete data table with pre-fill mapping

#### Step 2: Business Entity Information
- Business legal structure confirmation
- Federal EIN (Employer Identification Number)
- Product description for Stripe
- Business address confirmation
- **Critical**: Support Phone (customer service contact)
- Complete data table and validation rules

#### Step 3: Beneficial Owners (Conditional)
- Required if 25%+ ownership exists
- Collect same personal data as representative
- Can add multiple owners
- Smart detection and prompting

#### Terms of Service Acceptance
- Stripe Connected Account Agreement
- ToS capture requirements (timestamp, IP, user agent)
- Checkbox with link to full terms

#### Verification Processing
- Data saved to YOUR database (encrypted)
- No Stripe API calls until purchase
- Task marked "Completed" in dashboard

#### Error Handling
- SSN verification failure → Request full 9-digit SSN
- Full SSN verification failure → Upload government ID
- EIN verification failure → Manual review or correction
- Missing data → Clear error messages

### What This Flow Does NOT Include
- Stripe account creation (happens during purchase in Flow 4)
- Bank account setup (that's Task 3 in Flow 2)
- POS configuration (that's Task 2 in Flow 2)
- Trulioo KYC/KYB processing (happens after purchase)

### Key User Journey
```
Dashboard → Task 1: Verify Identity → Step 1 (Representative) →
Step 2 (Business) → [If needed: Step 3 (Owners)] → ToS → Complete → Return to Dashboard
```

### When to Reference This
- Implementing verification forms
- Understanding Stripe data requirements
- Designing error handling for verification failures
- Planning data pre-collection and storage

---

## User Flow 4: Subscription and Hardware Purchase

**File**: [USER_FLOW_04_PURCHASE.md](./USER_FLOW_04_PURCHASE.md)

**Purpose**: Document the complete purchase experience from readiness verification through order confirmation and fulfillment.

### What's Covered

#### Purchase Prerequisites
- Gate requirements: Tasks 1-2 must be complete
- Dashboard locked/unlocked states
- Task 3 (Bank Account) NOT required for purchase

#### Software Licensing Selection
- Three tiers: Retail ($69/mo), Restaurant ($99/mo), Enterprise ($149/mo)
- Per-location and per-register pricing
- Add-on modules: E-Commerce, Analytics, Loyalty, Multi-Currency, API Access
- Live calculation as selections change

#### Hardware Bundle Selection
- Pre-configured bundles: Starter ($799), Retail ($1,299), Restaurant ($1,899), Multi-Location ($2,499)
- À la carte hardware options
- Shipping information and timing
- Skip hardware option

#### Quote Review (Cohort-Specific)
- **Self-Serve**: Standard pricing, self-checkout
- **Assisted**: Optional AE consultation, can negotiate
- **Managed**: AE-negotiated pricing, implementation package included

#### Checkout Flow
- Step 1: Review order summary (editable)
- Step 2: Payment information (card details)
- Step 3: Final review and submit

#### What Happens Behind the Scenes
- **🔑 CRITICAL**: Stripe Custom account created when "Complete Purchase" clicked
- System retrieves all pre-collected data from YOUR database
- Creates Stripe account with complete profile (< 1 second)
- Order processing begins
- Verification processes in background

#### Order Confirmation
- Confirmation screen with order number
- What's next timeline (4 steps)
- Confirmation email with tracking

#### Post-Purchase Experience
- Dashboard order status tracker widget
- Verification processing (1-2 business days)
- Verification complete → Payments activated
- Hardware shipped with tracking
- Hardware delivered → Setup support
- Cohort-specific setup assistance

### Key User Journey
```
Dashboard (Ready to Purchase) → Software Selection → Hardware Selection →
Quote Review → Checkout → Payment → Submit [Stripe Account Created] →
Confirmation → Verification (1-2 days) → Payments Active → Hardware Ships → Delivered
```

### When to Reference This
- Implementing purchase flow UI
- Understanding Stripe account creation timing
- Designing cohort-specific quote experiences
- Planning post-purchase communication

---

## Flow Sequence & Dependencies

### Complete Merchant Journey
```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW 1: SIGNUP & PROVISIONING (5-10 min)                           │
├─────────────────────────────────────────────────────────────────────┤
│ Marketing → 2-Page Signup → TrueBiz → Cohort Assignment → Dashboard│
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW 2: DASHBOARD EXPERIENCE (30-45 min)                           │
├─────────────────────────────────────────────────────────────────────┤
│ Landing → 6 Task Cards → Complete Tasks 1-2 (required) → Ready     │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
                  ┌──────────────────────┐
                  │ FLOW 3: VERIFICATION │
                  │ (Task 1 - 10-15 min) │
                  └──────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW 4: PURCHASE (10-20 min)                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Software → Hardware → Quote → Checkout → [Stripe Account Created]  │
│ → Confirmation → Verification (1-2 days) → Payments Active         │
└─────────────────────────────────────────────────────────────────────┘
```

### Critical Dependencies

**Flow 1 → Flow 2**:
- Account must be created and provisioned before dashboard access
- Cohort assignment determines dashboard experience
- Business data from signup pre-fills dashboard tasks

**Flow 2 → Flow 3**:
- Task 1 on dashboard initiates Flow 3
- Business phone from signup pre-fills personal phone in Flow 3
- Business address pre-fills home address in Flow 3

**Flow 2 (Task 1 + Task 2) → Flow 4**:
- Tasks 1-2 must be completed to unlock purchase
- Verification data from Task 1 used during purchase
- POS configuration from Task 2 determines pricing

**Flow 4 (During Purchase)**:
- Stripe Custom account created with data from Flow 3 (Task 1)
- Verification processing begins (1-2 days)
- Hardware shipment held until verification completes

### Optional Tasks (Flow 2)
- **Task 3 (Bank Account)**: Can be completed before OR after purchase
- **Tasks 4-6 (Hardware, Data, Team)**: Can be completed anytime, not required for purchase

---

## Document Organization Principles

### Topic Isolation
Each flow document focuses on ONE primary topic:
- **FLOW_01**: Signup and initial account creation
- **FLOW_02**: Dashboard experience and task overview
- **FLOW_03**: Identity verification data collection (Task 1 deep dive)
- **FLOW_04**: Purchase experience and fulfillment

### Cross-Referencing Strategy
- Each flow has "Related Documentation" section at end
- Links to prerequisite flows (what comes before)
- Links to subsequent flows (what comes next)
- Links to related tasks in other flows
- Links to technical integration docs

### What's NOT Duplicated
- **Signup data collection**: Only in FLOW_01 (not repeated in FLOW_03)
- **Cohort experiences**: Only in FLOW_02 (not repeated in other flows)
- **Purchase flow**: Only in FLOW_04 (removed from FLOW_03)
- **Bank account setup**: Only in FLOW_02 Task 3 (removed from FLOW_03)
- **Backend implementation**: Removed from FLOW_02, referenced in FLOW_04

### When Content Appears in Multiple Flows
- **Brief mention + cross-reference** instead of full duplication
- Example: FLOW_02 mentions Task 1 briefly, FLOW_03 has complete details
- Example: FLOW_01 shows first dashboard landing, FLOW_02 has complete dashboard docs

---

## Quick Reference: Where to Find Topics

| Topic | Primary Location | Also Mentioned In |
|-------|------------------|-------------------|
| **Signup Forms** | FLOW_01 | — |
| **TrueBiz Verification** | FLOW_01 | FLOW_03 (comparison to Trulioo) |
| **Cohort Assignment Logic** | FLOW_01 | — |
| **Cohort Dashboard Experiences** | FLOW_02 | FLOW_01 (preview), FLOW_04 (purchase differences) |
| **Dashboard Task Cards** | FLOW_02 | FLOW_01 (first landing preview) |
| **Task 1: Verify Identity (Overview)** | FLOW_02 | — |
| **Task 1: Complete UI/Data (Deep Dive)** | FLOW_03 | — |
| **Task 2: Configure POS** | FLOW_02 | FLOW_04 (affects pricing) |
| **Task 3: Bank Account** | FLOW_02 | FLOW_04 (post-purchase option) |
| **Tasks 4-6: Hardware/Data/Team** | FLOW_02 | — |
| **Stripe Account Creation Timing** | FLOW_02 (strategy), FLOW_04 (implementation) | FLOW_03 (when data is used) |
| **Data Pre-Collection Strategy** | FLOW_02 | FLOW_03, FLOW_04 |
| **KYC/KYB Data Requirements** | FLOW_03 | FLOW_02 (Task 1 overview) |
| **Trulioo Verification** | FLOW_03 | FLOW_04 (post-purchase processing) |
| **Software Licensing** | FLOW_04 | — |
| **Hardware Bundles** | FLOW_04 | FLOW_02 (Task 4 overview) |
| **Purchase Prerequisites** | FLOW_04 | FLOW_02 (gate requirements) |
| **Post-Purchase Experience** | FLOW_04 | — |
| **Verification Processing** | FLOW_04 | FLOW_03 (data submitted during purchase) |

---

## For Designers

### UI/UX Design References

**Signup Flow (FLOW_01)**:
- 2-page wizard pattern with client-side state
- Real-time validation on blur
- Progress indicator at top
- Trust signals throughout

**Dashboard (FLOW_02)**:
- Grid layout with 6 task cards
- Status indicators (gray → blue → green)
- Payment activation banner (prominent)
- Cohort-specific banners and cards

**Verification Forms (FLOW_03)**:
- Multi-step form with navigation
- Smart field pre-filling from signup
- Inline validation and error messages
- Conditional sections (beneficial owners)

**Purchase Flow (FLOW_04)**:
- Tiered pricing cards with comparisons
- Live calculation displays
- Order summary with edit options
- Cohort-specific quote experiences

### Design System References
- [Design Specifications](./DESIGN_SPECIFICATIONS.md) - Visual design and UI patterns
- [UI Copy Reference](./UI_COPY.md) - Microcopy and messaging guidelines

---

## For Developers

### Implementation Order
1. **Start with FLOW_01**: Signup forms and account creation
2. **Then FLOW_02**: Dashboard shell and task cards
3. **Then FLOW_03**: Verification form (Task 1 implementation)
4. **Then FLOW_04**: Purchase flow and Stripe integration
5. **Finally**: Complete remaining tasks (2-6) in FLOW_02

### Key Technical Integrations
- **TrueBiz** (FLOW_01): Business data enhancement at signup
- **Trulioo** (FLOW_03): KYC/KYB verification after purchase
- **Stripe Connect** (FLOW_04): Custom account creation during purchase
- **Plaid** (FLOW_02 Task 3): Bank account instant verification

### Component References
- `components/get-started/` - Signup flow components (FLOW_01)
- `components/dashboard/checklist-card.tsx` - Task card component (FLOW_02)
- `components/dashboard/` - Task-specific components (FLOW_02)
- Verification form components referenced in FLOW_03
- Purchase flow components referenced in FLOW_04

---

## For Product Managers

### User Flow Metrics to Track
- **FLOW_01**: Signup completion rate, TrueBiz approval rate, cohort distribution
- **FLOW_02**: Task completion rates per task, time to complete required tasks
- **FLOW_03**: Verification form abandonment, error rates, pre-fill accuracy
- **FLOW_04**: Purchase conversion rate, verification approval rate, time to payments active

### Critical User Paths
1. **Self-Serve Path** (fastest): Signup → Dashboard → Tasks 1-2 → Purchase → Active (1-3 days total)
2. **Assisted Path** (guided): Signup → Dashboard → Tasks 1-2 → AE Consultation → Purchase → Active (3-5 days)
3. **Managed Path** (white-glove): Signup → AE Engagement → Custom Quote → Purchase → Implementation → Active (7-14 days)

### Optimization Opportunities
- **Reduce signup friction**: Minimize required fields in FLOW_01 Page 1
- **Increase task completion**: Show time estimates and progress in FLOW_02
- **Reduce verification errors**: Better pre-filling in FLOW_03
- **Increase purchase conversion**: Clear value prop and easy editing in FLOW_04

---

## Document Maintenance

### When to Update This Index
- New user flow document added
- Major structural changes to existing flows
- New sections added to flows
- Cross-references change

### When to Update Individual Flow Docs
- UI/UX changes to screens
- New data fields required
- Integration requirements change
- Error handling updates

### Version History
- **January 2025**: Initial index created after 4-flow reorganization
- Previous state: 5 separate flow documents with significant overlap
- Reorganization: Created FLOW_04, refactored FLOW_03, expanded FLOW_02

---

**Document Status**: Complete Navigation Index
**Last Updated**: January 2025
**Maintained By**: Product team
**For Questions**: Review individual flow documents or contact product team
