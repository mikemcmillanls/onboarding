# User Flow 4: Subscription and Hardware Purchase

Complete documentation for the merchant purchase experience from readiness verification through order confirmation and fulfillment.

---

## Document Overview

This document describes the merchant purchase flow for Lightspeed X-Series subscription and hardware. The flow covers purchase prerequisites, software licensing, hardware selection, checkout, and post-purchase experience. This is a **prototype design document** focused on user experience and purchase flow, not technical implementation.

**Related Flow**: This flow begins when merchants complete required dashboard tasks and are ready to purchase. See [User Flow 2: Dashboard](./USER_FLOW_02_DASHBOARD.md) for task completion requirements.

---

## Table of Contents

1. [Purchase Prerequisites](#purchase-prerequisites)
2. [Software Licensing Selection](#software-licensing-selection)
3. [Hardware Bundle Selection](#hardware-bundle-selection)
4. [Quote Review (Cohort-Specific)](#quote-review-cohort-specific)
5. [Checkout Flow](#checkout-flow)
6. [Order Confirmation](#order-confirmation)
7. [Post-Purchase Experience](#post-purchase-experience)
8. [Related Documentation](#related-documentation)

---

## Purchase Prerequisites

**Route**: `/dashboard` → Purchase button becomes available

**Purpose**: Ensure merchant has completed all required setup tasks before purchasing

**Critical**: Merchants cannot purchase until prerequisites are met

---

### Purchase Gate Requirements

Before merchant can click "Complete Purchase", these conditions must be true:

| Requirement | Status Check | User Message if Blocked |
|-------------|--------------|-------------------------|
| **Task #1: Identity Verification** | Data collected and saved | "Please complete Task 1: Verify Your Identity" |
| **Task #2: POS Configuration** | At least 1 location configured | "Please complete Task 2: Configure Your POS" |
| **Terms of Service** | Stripe ToS accepted during Task 1 | "Please accept Terms of Service in Task 1" |
| **Beneficial Owners** (if applicable) | All 25%+ owners added | "Please add all co-owners with 25%+ ownership" |

**Note**: Task #3 (Bank Account) is NOT required for purchase - merchants can add this later to receive payouts.

---

### Dashboard State When Ready to Purchase

**Before Prerequisites Met**:
```
Task 1: Verify Your Identity        ⭕ Not Started
Task 2: Configure Your POS          ⭕ Not Started

[Button: Complete Purchase] 🔒 Locked
Complete Tasks 1-2 to unlock purchase
```

**After Prerequisites Met**:
```
Task 1: Verify Your Identity        ✓ Complete
Task 2: Configure Your POS          ✓ Complete

[Button: Complete Purchase] ✓ Ready
Review your quote and complete your order
```

---

## Software Licensing Selection

**Route**: `/dashboard/purchase` or `/checkout`

**Purpose**: Select X-Series subscription tier and add-ons based on business needs

**Duration**: 2-5 minutes

---

### Base Subscription Tiers

All tiers include core POS functionality. Pricing scales by number of locations and registers.

#### Retail Tier
**Best for**: Retail stores, boutiques, specialty shops

**Included Features**:
- Product catalog and inventory management
- Sales processing and returns
- Customer management
- Basic reporting
- Payment processing integration

**Base Pricing**: $69/month per location (first register included)
- Additional registers: +$29/month each

---

#### Restaurant Tier
**Best for**: Restaurants, cafes, bars, food service

**Included Features**:
- Everything in Retail tier, plus:
- Table management and floor plans
- Kitchen display system (KDS)
- Course timing and modifications
- Split checks and tab management
- Server performance tracking

**Base Pricing**: $99/month per location (first register included)
- Additional registers: +$39/month each

---

#### Enterprise Tier
**Best for**: Multi-location businesses, franchises

**Included Features**:
- Everything in Restaurant tier, plus:
- Multi-location management dashboard
- Centralized reporting and analytics
- Employee management across locations
- Custom user roles and permissions
- Advanced inventory controls

**Base Pricing**: $149/month per location (first register included)
- Additional registers: +$49/month each

---

### Add-On Modules

Optional features that can be added to any tier:

| Add-On | Monthly Cost | Description |
|--------|--------------|-------------|
| **E-Commerce** | +$29/month | Online store integration, synchronized inventory |
| **Advanced Analytics** | +$49/month | Custom reports, predictive analytics, business intelligence |
| **Loyalty Program** | +$39/month | Customer rewards, points tracking, promotional campaigns |
| **Multi-Currency** | +$19/month | Accept and process multiple currencies |
| **API Access** | +$99/month | Custom integrations, developer access |

---

### What Merchant Sees

**Page Title**: "Choose Your Subscription"

**Instructions**: "Select the plan that fits your business. You can upgrade or add features anytime."

**Selection Flow**:
1. **Choose Base Tier**: Retail / Restaurant / Enterprise
2. **Confirm Locations**: Pre-filled from Task 2, allow edit
3. **Confirm Registers**: Pre-filled from Task 2, allow edit
4. **Select Add-Ons**: Optional checkboxes for each module
5. **Review Monthly Total**: Live calculation as selections change

**Example Calculation**:
```
Restaurant Tier                              $99/month
  Location: Main Street Cafe
  Registers: 3 (1 included, 2 additional)    +$78/month

Add-ons:
  E-Commerce                                  +$29/month
  Loyalty Program                             +$39/month

Monthly Subscription Total:                   $245/month
```

---

## Hardware Bundle Selection

**Route**: `/dashboard/purchase` or `/checkout`

**Purpose**: Select POS hardware based on business type and needs

**Duration**: 3-7 minutes

---

### Pre-Configured Bundles

#### Retail Starter Bundle - $799
**Best for**: Small retail stores, 1-2 registers

**Includes**:
- 1x Lightspeed Register (iPad Stand + Card Reader)
- 1x Receipt Printer (thermal, USB)
- 1x Cash Drawer (5-bill, 5-coin)
- 1x Barcode Scanner (handheld, wireless)
- Cables and setup guides

---

#### Restaurant Starter Bundle - $1,299
**Best for**: Small restaurants, cafes, 1-3 registers

**Includes**:
- 2x Lightspeed Register (iPad Stand + Card Reader)
- 1x Kitchen Display System (tablet + stand)
- 1x Receipt Printer (thermal, USB)
- 1x Cash Drawer (5-bill, 5-coin)
- Cables and setup guides

---

#### Multi-Location Bundle - $2,499
**Best for**: Multiple locations or large single location

**Includes**:
- 4x Lightspeed Register (iPad Stand + Card Reader)
- 2x Receipt Printer (thermal, USB)
- 2x Cash Drawer (5-bill, 5-coin)
- 2x Barcode Scanner (handheld, wireless)
- Network router and cabling
- Priority setup support

---

### A La Carte Hardware

Merchants can also purchase individual hardware items:

| Hardware | Price | Description |
|----------|-------|-------------|
| **Lightspeed Register** | $299 | iPad stand + integrated card reader |
| **Receipt Printer** | $249 | Thermal printer, USB or Ethernet |
| **Cash Drawer** | $149 | 5-bill, 5-coin capacity, lock & key |
| **Barcode Scanner** | $99 | Handheld wireless scanner |
| **Kitchen Display** | $399 | Tablet + stand for kitchen orders |
| **Customer Display** | $199 | Shows transaction to customer |
| **Mobile Card Reader** | $49 | Bluetooth card reader for mobile POS |
| **Label Printer** | $299 | For product labels and tags |

---

### What Merchant Sees

**Page Title**: "Select Your Hardware"

**Instructions**: "Choose a bundle or select individual items. Hardware ships after verification completes (1-2 business days)."

**Selection Options**:
1. **Pre-Configured Bundles** (radio button selection)
2. **Custom Selection** (checkboxes for individual items with quantity selectors)
3. **Skip Hardware** (option for merchants with existing equipment)

**Hardware Summary**:
```
Bundle: Restaurant Starter Bundle             $1,299
  - 2x Lightspeed Register
  - 1x Kitchen Display System
  - 1x Receipt Printer
  - 1x Cash Drawer

Additional Items:
  - Barcode Scanner (Qty: 1)                  +$99

Hardware Total:                               $1,398
```

**Shipping Information**:
- Ships to location addresses configured in Task 2
- Estimated delivery: 3-5 business days after verification
- Free standard shipping included
- Expedited shipping available: +$99

---

## Quote Review (Cohort-Specific)

**Purpose**: Review complete order before checkout

**Experience varies by cohort** - See [User Flow 1: Cohort Assignment](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md#cohort-assignment)

---

### Self-Serve Cohort Experience

**Route**: `/checkout/review`

**Flow**: Fully automated, standard pricing, self-checkout

**What Merchant Sees**:
```
Your Order Summary

Lightspeed X-Series Subscription
  Restaurant Tier - 1 Location, 3 Registers   $245/month

Hardware (one-time)
  Restaurant Starter Bundle                    $1,299
  Additional Barcode Scanner                   +$99

  Subtotal:                                    $1,398
  Sales Tax (8.5%):                            +$119
  Shipping:                                    FREE

  Hardware Total:                              $1,517

First Month Charges:
  Monthly subscription (prorated)              $245
  Hardware                                     $1,517

  Total Due Today:                             $1,762

Recurring Monthly (after first month):         $245/month

[Button: Proceed to Checkout]
```

---

### Assisted Cohort Experience

**Route**: `/checkout/review` with specialist contact option

**Flow**: Self-checkout available, optional AE consultation

**What Merchant Sees**:
```
Your Order Summary

[Same pricing display as Self-Serve]

💬 Want to discuss your quote?
   Schedule a call with your Account Executive
   [Button: Schedule Consultation]

   Or continue with self-checkout below
   [Button: Proceed to Checkout]
```

**If merchant schedules consultation**:
- AE reviews quote with merchant
- Can adjust pricing, bundles, or subscription tier
- Can offer promotional discounts
- Quote saved for later purchase

---

### Managed Cohort Experience

**Route**: Custom quote provided by AE (not self-service)

**Flow**: AE-negotiated pricing, custom implementation package

**What Merchant Sees**:
```
Your Custom Quote

Prepared by: [AE Name]
Quote ID: #LS-2025-001234
Valid Until: [Date, 30 days]

Lightspeed X-Series Subscription
  Enterprise Tier - 5 Locations                Custom Pricing
  Implementation Package included              [Negotiated]
  Dedicated Account Manager                    Included

Hardware Package (one-time)
  Custom Multi-Location Setup                  [Negotiated]

  Total Monthly Subscription:                  $[Custom]
  Total Hardware Cost:                         $[Custom]
  Total Due Today:                             $[Custom]

Implementation Includes:
  ✓ On-site setup and training (2 days)
  ✓ Data migration from previous POS
  ✓ Custom workflow configuration
  ✓ 90-day dedicated support

Questions? Contact your AE: [Name, Phone, Email]

[Button: Accept Quote & Proceed to Checkout]
```

---

## Checkout Flow

**Route**: `/checkout`

**Purpose**: Collect payment information and complete purchase

**Duration**: 3-5 minutes

**Critical**: This is when Stripe Custom account is created with all pre-collected verification data

---

### Checkout Page Structure

**Page Title**: "Complete Your Purchase"

**Progress Indicator**:
```
○ Review Order → ● Payment → ○ Confirmation
```

---

### Step 1: Review Order Summary

Pre-filled from previous selections, allow final edits:

**Order Summary**:
- Monthly subscription details
- Hardware items and quantities
- Shipping addresses (from Task 2 locations)
- Total charges

**Edit Options**:
- "Edit Subscription" link → Returns to software selection
- "Edit Hardware" link → Returns to hardware selection
- "Change Shipping" link → Update location addresses

---

### Step 2: Payment Information

**Section Title**: "Payment Method"

**What Merchant Sees**:

**Payment Method** (for this purchase):
```
[Card payment form]
Card Number:     [________________]
Expiration:      [MM/YY]
CVV:             [___]
ZIP Code:        [_____]

✓ Save this card for future monthly charges
```

**Billing Address**:
```
[ ] Same as business address

[If different]
Street:    [_______________________]
City:      [____________]
State:     [__]  ZIP: [_____]
```

**Recurring Billing Authorization**:
```
☐ I authorize Lightspeed to charge my payment method $[amount]/month
  for my subscription, starting [date]. I can cancel anytime.
```

---

### Step 3: Final Review & Submit

**What Merchant Sees**:

**Order Summary**:
```
Subscription:  $245/month (starting [date])
Hardware:      $1,517 (one-time)

Total Due Today: $1,762
```

**Terms & Conditions**:
```
☐ I agree to the Lightspeed Terms of Service and Hardware Warranty
  [Link: View Terms]
```

**Submit Button**:
```
[Button: Complete Purchase]
```

---

### What Happens Behind the Scenes (When Submit Clicked)

**Step 1: Process Payment** (Immediate)
- Charge payment method for hardware + first month
- Generate order ID and receipt
- Store payment method for recurring billing

**Step 2: Create Stripe Custom Account** (< 1 second, automatic)
- **🔑 CRITICAL: This is when Stripe account is created**
- System retrieves all pre-collected data from database:
  - Business representative information (from Task 1)
  - Business entity details (from Task 1)
  - Beneficial owners (if applicable, from Task 1)
  - ToS acceptance timestamp (from Task 1)
- Create Stripe Custom account with complete profile
- Add representative and beneficial owners as persons
- Submit ToS acceptance with captured timestamp
- Store Stripe account ID in database
- **Note**: Account created in "restricted" state, verification processes in background

**Step 3: Order Fulfillment Initiated** (Background)
- Order sent to warehouse for processing
- Verification begins (Trulioo KYC/KYB checks)
- Hardware shipment held until verification completes (1-2 days)

**Step 4: Confirmation Displayed** (Immediate)
- Show order confirmation screen
- Send confirmation email
- Redirect to order tracking page

---

## Order Confirmation

**Route**: `/checkout/confirmation` or `/dashboard/orders/[orderId]`

**Purpose**: Confirm successful purchase and set expectations

---

### What Merchant Sees

**Page Title**: "Order Confirmed!"

**Confirmation Message**:
```
✓ Your order has been received!

Order Number: #LS-2025-001234
Order Date: [Date]
Total Charged: $1,762

Confirmation email sent to: [email]
```

**Order Summary**:
```
Lightspeed X-Series Subscription
  Restaurant Tier - 1 Location, 3 Registers
  Monthly: $245/month (first charge today)
  Next charge: [Date, 30 days from now]

Hardware
  Restaurant Starter Bundle           $1,299
  Barcode Scanner                     +$99

  Shipping to:
    Main Street Cafe
    123 Main Street
    San Francisco, CA 94102
```

**What's Next?**:
```
📋 Step 1: Identity Verification (In Progress)
    We're verifying your business and identity information.
    This typically takes 1-2 business days.
    Status: Processing...

📦 Step 2: Hardware Ships
    Your hardware will ship once verification completes.
    Estimated shipping: [Date, 3-5 days after verification]

⚡ Step 3: Payments Activated
    You'll be able to accept payments once verification completes.
    We'll send you an email when you're approved.

💰 Step 4: Connect Bank Account (Optional)
    Add your bank account anytime to receive payouts.
    You can accept payments before adding a bank account.
```

**Action Buttons**:
```
[Button: View Order Details]
[Button: Return to Dashboard]
[Button: Contact Support]
```

---

### Confirmation Email

**Subject**: "Your Lightspeed Order Confirmation - #LS-2025-001234"

**Email Content**:
```
Hi [Business Name],

Thank you for your order! We're excited to help you grow your business.

ORDER SUMMARY
Order #: LS-2025-001234
Total: $1,762

Subscription: $245/month (first charge included)
Hardware: $1,517 (one-time)

WHAT'S NEXT?

1. Verification (1-2 business days)
   We're verifying your business information. You'll receive an email
   when this is complete.

2. Hardware Ships (3-5 business days after verification)
   Tracking number will be sent to this email.

3. Setup & Go Live
   When hardware arrives, follow our setup guide to start selling.

NEED HELP?
- Track your order: [Link]
- Setup guides: [Link]
- Contact support: support@lightspeed.com | (555) 123-4567

Thanks,
The Lightspeed Team
```

---

## Post-Purchase Experience

**Route**: `/dashboard` with order tracking widget

**Purpose**: Keep merchant informed of progress and next steps

---

### Dashboard After Purchase

**New Widget**: Order Status Tracker (appears at top of dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│ Order #LS-2025-001234                                       │
├─────────────────────────────────────────────────────────────┤
│ ✓ Order Placed              [Date]                          │
│ ⏳ Verification Processing   (1-2 business days)             │
│ ○ Hardware Shipping          (After verification)           │
│ ○ Delivery                   (Estimated: [Date])            │
├─────────────────────────────────────────────────────────────┤
│ [Button: View Order Details] [Button: Contact Support]      │
└─────────────────────────────────────────────────────────────┘
```

---

### Verification Processing (1-2 Business Days)

**What Merchant Sees**:
```
Order Status: Verification Processing

We're verifying your identity and business information with our
verification partner. This typically takes 1-2 business days.

What we're checking:
  ⏳ Personal identity verification
  ⏳ Business entity verification
  ⏳ Banking compliance checks

We'll email you as soon as verification is complete.
```

**Email Updates During Verification**:
- Day 1 morning: "We received your order and verification is processing"
- If issues: "Action needed: [specific issue]"
- When approved: "You're approved! Hardware is shipping"

---

### Verification Complete - Payments Activated

**Dashboard Update**:
```
✓ Verification Complete!

Order Status: Hardware Shipping

Your identity and business have been verified. You're approved to
accept payments!

✓ Payment processing: ACTIVE
✓ Hardware shipped: [Date]
○ Bank account: Not yet connected (optional)

Tracking Number: [1Z999AA10123456784]
Estimated Delivery: [Date]

[Button: Track Shipment] [Button: Add Bank Account]
```

**Email Notification**:
```
Subject: You're Approved to Accept Payments! 🎉

Hi [Business Name],

Great news! Your verification is complete and you're approved to accept
payments with Lightspeed.

✓ Payment Processing: Active
✓ Hardware Status: Shipped (tracking below)

NEXT STEPS

1. Track Your Hardware
   Tracking #: [1Z999AA10123456784]
   Estimated Delivery: [Date]
   [Track Shipment Button]

2. Connect Your Bank Account (Optional)
   Add your bank account to receive payouts from sales.
   You can accept payments without this - funds will be held safely
   until you add your bank account.
   [Add Bank Account Button]

3. Prepare for Hardware Arrival
   Review our Quick Start Guide: [Link]
   Download setup checklist: [Link]

Questions? We're here to help!
Support: support@lightspeed.com | (555) 123-4567

The Lightspeed Team
```

---

### Hardware Delivered

**Dashboard Update**:
```
✓ Hardware Delivered!

Order Status: Ready for Setup

Your hardware has been delivered. Follow our Quick Start Guide to
set up your POS system.

✓ Verification: Approved
✓ Hardware: Delivered [Date]
✓ Payment Processing: Active
○ Bank Account: Not connected (optional)

[Button: Quick Start Guide] [Button: Schedule Setup Call]
```

**What's Included in Delivery**:
- All hardware items from order
- Quick Start Guide (printed)
- Setup checklist
- Support contact card
- Cable organizers and mounting supplies

---

### Setup Support

**Available Resources**:

1. **Quick Start Guide** (printed + online)
   - Unboxing checklist
   - Hardware assembly instructions
   - iPad app download and login
   - First sale walkthrough

2. **Video Tutorials**
   - Hardware setup (5 min)
   - Creating your first product (3 min)
   - Processing your first sale (4 min)
   - End of day closing (3 min)

3. **Live Support**
   - Chat support (in dashboard)
   - Phone support: (555) 123-4567
   - Email support: support@lightspeed.com
   - Setup assistance (free for first 30 days)

4. **Cohort-Specific Support**:
   - **Self-Serve**: Standard support (chat, email, phone)
   - **Assisted**: Free IC consultation (1 hour)
   - **Managed**: Dedicated account manager + on-site setup (2 days)

---

## Related Documentation

**Previous Flows**:
- [User Flow 1: Signup and Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Account creation and cohort assignment
- [User Flow 2: Dashboard Experience](./USER_FLOW_02_DASHBOARD.md) - Dashboard tasks and prerequisites for purchase
- [User Flow 3: Identity Verification (LSPAY)](./USER_FLOW_03_LSPAY.md) - Verification data requirements and processing

**Next Steps**:
- After hardware setup, merchants can begin accepting payments
- Bank account connection enables automatic payouts (see [User Flow 2: Task 3](./USER_FLOW_02_DASHBOARD.md#task-3-connect-bank-for-payouts))
- Additional dashboard tasks (data import, team setup) can be completed anytime

**Technical References** (for engineering team):
- [Stripe Account Creation Strategy](../05-integrations/STRIPE_ACCOUNT_CREATION_STRATEGY.md)
- [Order Fulfillment Integration](../05-integrations/ORDER_FULFILLMENT.md)
- [Hardware Provisioning](../05-integrations/HARDWARE_PROVISIONING.md)

---

**Document Status**: Prototype Design Specification
**Last Updated**: January 2025
**Audience**: Product managers, designers, stakeholders
**For Implementation Details**: See technical documentation in `/docs/05-integrations/`
