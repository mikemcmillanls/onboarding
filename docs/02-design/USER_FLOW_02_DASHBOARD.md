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
2. [The 6 Dashboard Tasks](#the-6-dashboard-tasks)
3. [Background: Stripe Account Creation](#background-stripe-account-creation)
4. [Task Status System](#task-status-system)
5. [Payment Activation Timeline](#payment-activation-timeline)

---

## Landing on the Dashboard

**Route**: `/dashboard`

**When**: Immediately after signup completion and TrueBiz verification approval

**Purpose**: Central hub for merchant to complete setup and activate payments

### What the Merchant Sees

**Header Section**:
- Welcome message: "Welcome back, [Business Name]!"
- Overall progress indicator (e.g., "2 of 6 tasks completed")

**Payment Activation Banner** (prominent, above task cards):
```
🎯 Ready to accept payments?

Complete these 3 steps to activate payment processing:
  1. Verify Your Identity (10-15 minutes)
  2. Configure Your POS (2-3 minutes)
  3. Complete Your Purchase

After purchase, we'll activate payments in 1-2 days.
You can add your bank account anytime to receive payouts.
```

**6 Task Cards** (grid layout):
- Each card displays:
  - Task icon with status indicator
  - Task title and description
  - Time estimate badge
  - Priority badge ("Required to accept payments" or "Optional - add anytime")
  - Action button ("Start", "Continue", or "Review")

**Visual Hierarchy**:
- Critical tasks (1-2) emphasized with red/blue badges
- Optional tasks (3-6) shown with lower visual priority
- Clear path: Identity → POS → Purchase

---

## The 6 Dashboard Tasks

### Critical Tasks (Required for Payment Processing)

#### 1. Verify Your Identity
- **Priority**: ⭐ Required to accept payments
- **Time**: 10-15 minutes
- **What**: Collect identity data for business representative and beneficial owners (25%+)
- **Why**: Trulioo handles official KYC (individual identity) and KYB (business entity) verification required by Stripe for payment processing
- **Note**: Business data was enhanced at signup via TrueBiz (data enrichment only, not official KYB)

#### 2. Configure Your POS
- **Priority**: ⭐ Required to accept payments
- **Time**: 2-3 minutes
- **What**: Specify number of locations, registers per location, e-commerce needs
- **Why**: Determines Stripe account configuration and hardware requirements

### Optional Tasks (Can Be Completed Anytime)

#### 3. Connect Bank for Payouts
- **Priority**: ⚠️ Optional - add anytime
- **Time**: 1-3 minutes (instant with Plaid)
- **What**: Connect bank account for receiving payouts
- **Why**: Enable funds transfer (merchants can accept payments without this)
- **Note**: Funds held by Stripe until bank account added

#### 4. Hardware Selection
- **Priority**: Optional
- **What**: Select and order POS hardware bundles
- **Options**: Retail kits, restaurant kits, mobile kits

#### 5. Data Import
- **Priority**: Optional
- **What**: Import products/customers from previous POS
- **Options**: CSV upload, start fresh, assisted migration

#### 6. Team Setup
- **Priority**: Optional
- **What**: Invite staff members and configure permissions

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

**During Dashboard Tasks** (data stored in YOUR database):
```typescript
// Task 1: Individual Verification - Store in YOUR DB
await db.merchant.update({
  where: { id: merchantId },
  data: {
    verificationData: {
      representative: {
        first_name, last_name, dob, ssn_last_4, address,
        relationship: { representative: true, executive: true }
      },
      beneficialOwners: [...],
      tosAcceptance: {
        date: new Date(),
        ip: request.ip,
        user_agent: request.headers['user-agent']
      }
    }
  }
});

// Task 2: POS Configuration - Store in YOUR DB
await db.merchant.update({
  where: { id: merchantId },
  data: {
    posSetupData: {
      locations, registersPerLocation, ecommerceEnabled
    }
  }
});

// NO STRIPE API CALLS YET - Just saving to your database
```

**During Purchase** (Stripe account created):
```typescript
// Merchant clicks "Complete Purchase"
async function handlePurchaseComplete(merchantId: string) {
  // 1. Process payment for hardware/software
  const payment = await processPayment(orderData);

  // 2. Retrieve all pre-collected data
  const merchant = await db.merchant.findUnique({
    where: { id: merchantId },
    include: { verificationData: true, posSetupData: true }
  });

  // 3. Create Stripe account WITH ALL DATA (< 1 second)
  const account = await stripe.accounts.create({
    type: 'custom',
    country: 'US',
    email: merchant.email,
    business_type: determineBusinessType(merchant.businessStructure),
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    },
    company: {
      name: merchant.businessName,
      phone: merchant.businessPhone,
      address: merchant.businessAddress,
      // ... all pre-collected business data
    },
    individual: merchant.verificationData.representative,
    tos_acceptance: merchant.verificationData.tosAcceptance
  });

  // 4. Create beneficial owners (if any)
  for (const owner of merchant.verificationData.beneficialOwners) {
    await stripe.accounts.createPerson(account.id, owner);
  }

  // 5. Store Stripe account ID
  await db.merchant.update({
    where: { id: merchantId },
    data: { stripeAccountId: account.id }
  });

  // 6. Verification processes in background (1-2 days)
  return { success: true, orderId: payment.orderId };
}
```

**After Purchase** (verification processing):
```typescript
// Webhook handler for verification completion
async function handleAccountUpdated(event: Stripe.Event) {
  const account = event.data.object as Stripe.Account;

  if (account.charges_enabled) {
    // Payment processing is now active!
    await notifyMerchantPaymentsActive(account.id);
  }
}
```

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
  ↓
Merchant completes Task 2: Configure Your POS (2-3 min)
  → Data SAVED to YOUR database
  ↓
Merchant optionally completes Task 3: Connect Bank for Payouts (1-3 min)
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

**Previous Step**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md)

**Payment Activation Details**:
- [User Flow 3: LSPAY Activation](./USER_FLOW_03_LSPAY.md) - Complete data requirements for payment activation
