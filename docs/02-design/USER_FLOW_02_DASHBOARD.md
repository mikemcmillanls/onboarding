# User Flow 2: Dashboard Experience

Documentation for the merchant dashboard - the central hub after signup where merchants complete setup tasks.

---

## Document Overview

This document describes the dashboard experience after merchant completes signup:
- What the merchant sees when they land on the dashboard
- The 6-task checklist structure
- What's happening in the background (Stripe account creation)
- Task prioritization and flow

**Critical Flow**: After signup → Dashboard with 6 tasks → Complete critical tasks → Purchase → Payments activate

---

## Table of Contents

1. [Landing on the Dashboard](#landing-on-the-dashboard)
2. [Cohort-Specific Dashboard Experiences](#cohort-specific-dashboard-experiences)
3. [The 6 Dashboard Tasks](#the-6-dashboard-tasks)
4. [Background: Stripe Account Creation](#background-stripe-account-creation)
5. [Task Status System](#task-status-system)
6. [Payment Activation Timeline](#payment-activation-timeline)

---

## Landing on the Dashboard

**Route**: `/dashboard`

**When**: Immediately after signup completion and TrueBiz verification approval

**Purpose**: Central hub for merchant to complete setup and activate payments

### What the Merchant Sees

**Header Section**:
- Welcome message: "Welcome back, [Business Name]!"
- Overall progress indicator (e.g., "2 of 5 tasks completed")

**5 Task Cards** (grid layout):
- Each card displays:
  - Task icon with status indicator
  - Task title and description
  - Time estimate badge
  - Priority badge ("Required to accept payments" or "Optional - add anytime")
  - Action button ("Start", "Continue", or "Review")

**Visual Hierarchy**:
- Critical tasks (1-2) emphasized with priority badges
- Optional tasks (3-5) shown with lower visual priority
- Clear path: Identity → POS → Purchase

**Note**: Bank account connection for payouts has been moved from a separate dashboard task to an optional final step within the identity verification flow.

**Cohort-Specific Dashboard Elements**:
- **Self-Serve**: Standard dashboard, no specialist banners
- **Assisted**: "Need help? Your specialist is available" banner with scheduling link
- **Managed**: Prominent account manager card with photo, contact info, implementation timeline

---

## Cohort-Specific Dashboard Experiences

Each cohort sees a different dashboard experience with varying levels of support and specialist engagement.

### Self-Serve Cohort

**Criteria**: <$500K revenue OR <3 locations

**Dashboard Appearance**:
- Standard dashboard layout
- No specialist banner or contact card
- Emphasis on self-service resources

**Support Options**:
- Standard support (chat, email)
- In-app help documentation
- Video tutorials and guides
- Community forum access

**Purchase Experience**:
- Standard pricing displayed
- Self-checkout flow
- No AE consultation required

**Setup Experience**:
- Self-service guides for all tasks
- Progress tracking only
- Automated help suggestions based on behavior
- Optional: Can request IC support if needed (paid upgrade)

---

### Assisted Cohort

**Criteria**: $500K-$2M revenue OR 3-10 locations

**Dashboard Appearance**:
- "Want help? Schedule a call with your specialist" banner (collapsible)
- Specialist contact card with photo, name, calendly link
- Self-serve option still available

**Support Options**:
- Standard support PLUS free IC (Implementation Consultant) support
- Can schedule IC calls via dashboard
- IC can view merchant's progress in shared view
- Priority email/chat response

**Purchase Experience**:
- Optional AE consultation before purchase
- Can negotiate pricing/terms
- Self-checkout option still available
- AE can send custom quotes

**Setup Experience**:
- Self-serve guides available
- IC can schedule onboarding session
- IC monitors progress and reaches out proactively if stalled
- Hybrid: merchant can choose self-serve or IC assistance per task

---

### Managed Cohort

**Criteria**: $2M+ revenue OR 10+ locations

**Dashboard Appearance**:
- Prominent "Your dedicated account manager" card at top
- Shows AE photo, name, direct phone, email
- "Schedule Implementation Call" button
- White-glove messaging throughout

**Support Options**:
- Dedicated account manager (AE)
- Paid implementation package included
- IC assigned for technical setup
- Priority support with SLA guarantees
- Dedicated Slack/Teams channel option

**Purchase Experience**:
- **Required**: AE consultation before purchase
- Custom negotiated pricing
- Implementation package included in quote
- Purchase cannot proceed without AE involvement

**Setup Experience**:
- IC-led implementation (not self-serve)
- Scheduled onboarding sessions
- IC completes technical tasks with merchant
- Regular check-ins and progress reviews
- Concierge-level service

---

## The 5 Dashboard Tasks

### Critical Tasks (Required for Payment Processing)

#### 1. Verify Your Identity

**Priority**: ⭐ Required to accept payments
**Time**: 10-15 minutes
**Route**: `/dashboard/verify`

**Purpose**: Collect KYC/KYB data required by Stripe for payment processing compliance.

**What's Collected**:
- Business representative information (personal identity, SSN, address)
- Business entity details (EIN, legal structure)
- Beneficial owners (if 25%+ ownership exists)
- Stripe Terms of Service acceptance
- **NEW**: Optional bank account connection for payouts (final step in verification flow)

**Note**: Business data was enhanced at signup via TrueBiz (data enrichment only). This task collects official KYC/KYB data verified by Trulioo. Bank account connection is now included as an optional final step within this verification flow.

**See**: [User Flow 3: Identity Verification](./USER_FLOW_03_LSPAY.md) for complete data requirements and UI flow.

---

#### 2. Configure Your POS

**Priority**: ⭐ Required to accept payments
**Time**: 2-3 minutes
**Route**: `/dashboard/tasks/pos-configuration`

**Purpose**: Configure locations, registers, and sales channels to determine system setup and pricing.

**What's Collected**:
- Number of locations (pre-filled from signup, editable)
- Registers per location
- E-commerce enabled (Yes/No)
- Location names (optional)

**What This Determines**:
- Stripe account capabilities (card_payments, online_payments)
- Software licensing pricing (per location + per register)
- Hardware recommendations
- X-Series location and register setup

**Task Completion**: Data saved to database, submitted to Stripe during purchase.

### Optional Tasks (Can Be Completed Anytime)

#### 3. Hardware Selection

**Priority**: Optional
**Time**: 5-10 minutes
**Route**: `/dashboard/tasks/hardware`

**Purpose**: Select POS hardware for purchase (or skip if using existing equipment).

**Options**:
- **Pre-configured bundles** ($799-$2,499): Starter, Retail, Restaurant, Enterprise
- **À la carte selection**: Build custom hardware setup
- **Skip**: Use existing hardware or software-only

**What's Available**:
- Touchscreen terminals, card readers, receipt printers
- Cash drawers, barcode scanners, kitchen displays
- Handheld order devices, iPad stands

**Shipping**: Free on orders $500+, otherwise $49. Hardware ships 5-7 days after purchase.

**Task Completion**: Hardware items added to purchase quote.

**See**: [User Flow 4: Hardware Selection](./USER_FLOW_04_PURCHASE.md#hardware-bundle-selection) for complete catalog and pricing.

#### 4. Data Import

**Priority**: Optional
**Time**: 10-30 minutes
**Route**: `/dashboard/tasks/data-import`

**Purpose**: Import products, customers, and inventory from previous POS system.

**Three Import Options**:
1. **CSV Upload** (self-service): Download templates, fill in data, upload
2. **Direct Migration** (supported systems): Connect to Square, Clover, Toast, Shopify POS, Vend
3. **Assisted Migration** (white-glove): Specialist-led migration ($299, free for Managed cohort)

**What Can Be Imported**:
- Products: Name, SKU, barcode, pricing, inventory levels, images
- Customers: Contact info, purchase history, loyalty points
- Historical sales data: Past 12 months for reporting

**Task Completion**: Imported data immediately available in X-Series POS. Can also start fresh and add products manually.

#### 5. Team Setup

**Priority**: Optional
**Time**: 3-5 minutes per team member
**Route**: `/dashboard/tasks/team`

**Purpose**: Invite staff members and configure role-based permissions.

**Pre-Defined Roles**:
- **Owner**: Full access, financial reports, billing management
- **Manager**: All locations, sales/inventory/reporting, no billing access
- **Cashier**: Location-specific, sales processing, limited reporting
- **Kitchen Staff**: Kitchen display only, order management
- **Custom**: Create role with granular 20+ permission controls

**What's Configured**:
- Employee name and email
- Role assignment
- Location access (if multi-location)
- PIN code (4-6 digits for POS login)

**PIN System**: Quick login on POS terminals - employee enters PIN, logged into register, sales tracked per employee.

**Task Completion**: Invitation sent via email. Employee accepts, creates password, downloads POS app, ready to work.

---

## Background: Stripe Account Creation

### When It Happens

**Critical Timing**: Stripe Custom account is created **DURING PURCHASE** (not at signup)

**Flow**:
```
Merchant completes signup
  ↓
TrueBiz verification approves
  ↓
Lightspeed user account created
  ↓
Redirect to dashboard
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MERCHANT COMPLETES TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Verification data collected and stored in YOUR database
  ↓
Merchant clicks "Complete Purchase"
  ↓
🔑 Stripe Custom account created WITH ALL PRE-COLLECTED DATA
  ↓
Stripe account ID stored
  ↓
Verification processing begins (1-2 days)
```

### Why Create Account During Purchase?

**Cost Optimization**:
- Only create accounts for merchants who commit (pay)
- Avoids abandoned Stripe accounts for merchants who never purchase
- 60% less operational overhead vs creating at signup

**Stripe's Official Recommendation**:
- "Only create an account when you're confident the user will actually use it"
- Purchase = strong commitment signal
- Better fraud signals for underwriting

**Data Pre-Collection Strategy**:
- Collect all verification data via dashboard tasks BEFORE purchase
- Store in YOUR database (encrypted)
- When merchant purchases, create Stripe account with ALL data at once
- Result: Zero user-facing delay, optimal cost efficiency

### What Happens in Background

**During Dashboard Tasks**:
- Task 1 (Verify Identity): Data saved to YOUR database (encrypted), includes optional bank account connection
- Task 2 (Configure POS): Data saved to YOUR database
- NO Stripe API calls yet - just storing data locally

**During Purchase**:
1. Merchant clicks "Complete Purchase"
2. System processes payment for hardware/software
3. System retrieves all pre-collected data from YOUR database
4. **🔑 Stripe Custom account created with ALL data** (< 1 second)
5. Stripe account ID stored in YOUR database
6. Order confirmed, hardware ships

**After Purchase**:
- Stripe processes verification in background (1-2 business days)
- Webhook received when `charges_enabled` = true
- Merchant notified: "Payment processing is now active!"

**See Also**: [User Flow 4: Purchase](./USER_FLOW_04_PURCHASE.md#what-happens-behind-the-scenes) - Complete technical implementation details

---

## Task Status System

**Not Started** (gray):
- Task not yet visited
- Action: "Get Started" button

**In Progress** (blue):
- Task visited or partially completed
- Action: "Continue" button

**Completed** (green):
- Task fully completed, data saved to database
- Action: "Review" button
- **Note**: Data is NOT submitted to Stripe until purchase

---

## Payment Activation Timeline

### Complete Journey: Signup to Fully Operational

```
Day 0: Signup Complete
  ↓
NO Stripe account created yet
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DASHBOARD TASKS (Data Collection)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant completes Task 1: Verify Your Identity (10-15 min)
  → Data SAVED to YOUR database (encrypted)
  → ToS acceptance captured (date, IP, user agent)
  → Optional: Bank account for payouts (if connected)
  ↓
Merchant completes Task 2: Configure Your POS (2-3 min)
  → Data SAVED to YOUR database
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 PURCHASE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant clicks "Complete Purchase"
  ↓
🔑 Stripe Custom account created WITH ALL PRE-COLLECTED DATA (< 1 second)
  ↓
Stripe account ID stored in database
  ↓
Order confirmed → Hardware ships
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ VERIFICATION PROCESSING (Background)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Stripe processes verification (1-2 business days)
  → Checks SSN against government records
  → Verifies addresses
  → Validates business entity
  ↓
Webhook: account.updated → charges_enabled = true
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PAYMENT PROCESSING ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant can accept payments
  ↓
Funds accumulate in Stripe balance
  ↓
[If bank account added]: Funds flow to bank automatically
[If no bank account]: Funds held until merchant adds bank
  ↓
🎉 Fully operational merchant
```

### Key Timing Notes

**Stripe Account Creation**: During purchase (< 1 second, invisible to merchant)

**Data Collection**: During dashboard tasks (saved to YOUR database)

**Data Submission to Stripe**: During purchase (all at once)

**Verification Processing**: 1-2 business days AFTER purchase (Stripe background processing)

**Payment Processing**: Active 1-2 days after purchase (once verification completes)

**Payouts**: Require bank account verification (instant with Plaid, or 1-2 days with micro-deposits)

---

## Related Documentation

**Previous Flow**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Account creation and cohort assignment before landing on dashboard

**Next Flows**:
- [User Flow 3: Identity Verification (LSPAY)](./USER_FLOW_03_LSPAY.md) - Detailed data requirements and UI for Task 1 (Verify Identity)
- [User Flow 4: Subscription and Hardware Purchase](./USER_FLOW_04_PURCHASE.md) - Complete purchase experience after completing required tasks

**Technical Integration Details**:
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md) - Stripe Connect account creation timing and implementation
- [Trulioo KYC/KYB Integration](../05-integrations/TRULIOO_VERIFICATION_API.md) - Identity verification provider integration

**Component References**:
- `components/dashboard/checklist-card.tsx` - Task card component implementation (see lines 16-109)
- `components/dashboard/` - Dashboard task-specific components
