# User Flow Diagrams: Merchant Onboarding

## Document Overview

This document provides visual representations of the merchant onboarding user flows, including decision trees, state transitions, and navigation patterns.

---

## Table of Contents

1. [Complete Onboarding Flow (High-Level)](#complete-onboarding-flow-high-level)
2. [Step 1: Signup Flow with Cohort Routing](#step-1-signup-flow-with-cohort-routing)
3. [Step 2: Configuration Flow](#step-2-configuration-flow)
4. [Step 3: Checkout & Verification Flow](#step-3-checkout--verification-flow)
5. [Step 4: Setup Checklist Flow](#step-4-setup-checklist-flow)
6. [Specialist Integration Touchpoints](#specialist-integration-touchpoints)
7. [Error & Edge Case Flows](#error--edge-case-flows)

---

## Complete Onboarding Flow (High-Level)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MERCHANT ONBOARDING JOURNEY                       │
│                          "4 Simple Steps"                                │
└─────────────────────────────────────────────────────────────────────────┘

ENTRY POINT
  ↓
  [Marketing Website] → "Get Started" button
  [Pricing Page] → "Start Free Trial" or "Buy Now"
  [Sales Call] → Signup link
  ↓
  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: SIGN UP & TELL US ABOUT YOUR BUSINESS                          │
│ Time: 3-5 minutes                                                        │
│ Pages: 2                                                                 │
└─────────────────────────────────────────────────────────────────────────┘
  ↓
  Page 1: Account Creation
    - Name, email, password
    - Business name, category
    - Revenue range, location count
  ↓
  Page 2: Business Details
    - Legal name, structure, EIN
    - Business address
  ↓
  [Processing: KYB Verification]
  ↓
  ↓─────────────┬───────────────┬──────────────────┐
  ↓             ↓               ↓                  ↓
  Auto-Approved  High-Value      Needs Review      Rejected
  (70%+)        (Assisted/       (Manual Review)   (Ineligible)
                Managed)
  ↓             ↓               ↓                  ↓
  Continue →    Specialist →    Waiting →         End Flow
                Introduction    Email when         (Contact Sales)
  ↓             ↓               approved
  └─────────────┴───────────────┘
                ↓
                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: SET UP YOUR POS & PAYMENTS                                     │
│ Time: 10-20 minutes                                                      │
│ Pages: 1 (unified dashboard)                                            │
└─────────────────────────────────────────────────────────────────────────┘
  ↓
  [Specialist Banner] ← Shown for Assisted/Managed cohorts only
  ↓
  Software Configuration
    - Number of locations
    - Registers per location
    - Add-ons (eCommerce, etc.)
  ↓
  Hardware Selection
    - Recommended packages OR
    - Existing hardware check OR
    - Custom item selection
  ↓
  [Real-time Quote Update]
  ↓
  Continue to Checkout
  ↓
  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: COMPLETE PURCHASE & VERIFICATION                               │
│ Time: 5 minutes                                                          │
│ Pages: 1 (multi-section form)                                           │
└─────────────────────────────────────────────────────────────────────────┘
  ↓
  Review Order Summary
  ↓
  Payment Information
    - Credit card OR bank transfer
  ↓
  Billing & Shipping Address
  ↓
  Identity Verification (KYC)
    - Business representative details
    - Business owners (if applicable)
  ↓
  Terms & Consent
  ↓
  Complete Purchase
  ↓
  [Processing: Payment, KYC, Provisioning]
  ↓
  ↓─────────────┬─────────────────┐
  ↓             ↓                 ↓
  Success       Payment Declined  KYC Review
  ↓             ↓                 Needed
  Confirmation  Retry             ↓
  Screen        Different Card    Upload Docs
  ↓             ↓                 ↓
  └─────────────┴─────────────────┘
                ↓
                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: GET EVERYTHING READY                                           │
│ Time: 2-5 days                                                           │
│ Pages: 1 (checklist dashboard)                                          │
└─────────────────────────────────────────────────────────────────────────┘
  ↓
  [Specialist Banner] ← Optional for Assisted, Required for Managed
  ↓
  Task Checklist:
  ✅ 1. Account Created (auto)
  ✅ 2. Software Activated (auto)
  ⏳ 3. Hardware Shipped → ✅ Delivered
  ⬜ 4. Set Up Hardware (manual)
  ⬜ 5. Connect Bank Account (manual, critical)
  ⬜ 6. Import Data (manual, optional)
  ↓
  All Critical Tasks Complete
  ↓
  Run Test Transaction
  ↓
  ✅ Test Successful
  ↓
  [Celebration Screen]
  ↓
  Go Live!
  ↓
EXIT TO ACTIVE MERCHANT STATE
  ↓
  [X-Series Dashboard]
```

---

## Step 1: Signup Flow with Cohort Routing

### Page 1: Account Creation

```
ENTRY
  ↓
┌─────────────────────────────────────┐
│    Create Your Account (Page 1)     │
├─────────────────────────────────────┤
│ Step 1 of 4: Account Setup          │
│ Progress: [●○○○]                     │
├─────────────────────────────────────┤
│ Form Fields:                         │
│ • First Name                         │
│ • Last Name                          │
│ • Email                              │
│ • Phone                              │
│ • Password (with strength meter)    │
│ • Business Name                      │
│ • Business Category (dropdown)      │
│ • Annual Revenue (radio cards)      │
│ • Number of Locations (radio cards) │
├─────────────────────────────────────┤
│ [Continue] button                    │
│ "Already have an account? Sign in"  │
└─────────────────────────────────────┘
  ↓
  Validation on Submit
  ↓
  ↓───────┬────────┐
  ↓       ↓        ↓
  Valid   Errors   Cancel/Back
  ↓       ↓        ↓
  Next    Show     Exit
  Page    Errors   Flow
          Focus
          First
```

### Page 2: Business Details

```
FROM PAGE 1
  ↓
┌─────────────────────────────────────┐
│   Tell Us About Your Business       │
│            (Page 2 of 2)             │
├─────────────────────────────────────┤
│ Step 1 of 4: Account Setup          │
│ Progress: [●●○○] Page 2 of 2         │
├─────────────────────────────────────┤
│ [Info Banner]                        │
│ "Your information is secure. We use │
│ this to verify your business."      │
├─────────────────────────────────────┤
│ Form Fields:                         │
│ • Legal Business Name                │
│ • Business Structure (dropdown)     │
│ • Tax ID (EIN or SSN)               │
│ • Business Address (autocomplete)   │
│   - Street, City, State, ZIP        │
│ • Business Phone                     │
├─────────────────────────────────────┤
│ [Back] [Submit Application]         │
└─────────────────────────────────────┘
  ↓
  Submit
  ↓
┌─────────────────────────────────────┐
│      Processing Screen               │
├─────────────────────────────────────┤
│ [Spinner Animation]                  │
│ "Verifying your business..."         │
│ "This usually takes a few seconds"   │
│                                      │
│ Progress:                            │
│ • Checking business details          │
│ • Verifying payment eligibility      │
│ • Setting up your account            │
└─────────────────────────────────────┘
  ↓
  KYB API Response (2-10 seconds)
  ↓
  ↓──────────┬──────────────┬──────────────┬──────────┐
  ↓          ↓              ↓              ↓          ↓
  AUTO-      HIGH-VALUE     NEEDS          REJECTED   API
  APPROVED   MERCHANT       REVIEW                    ERROR
  (70%+)     (15%)          (10%)          (5%)       ↓
  ↓          ↓              ↓              ↓          Retry
```

### Outcome States

#### Auto-Approved

```
┌─────────────────────────────────────┐
│ [✓ Green Checkmark Animation]       │
│                                      │
│ Great! You're approved for           │
│ Lightspeed Payments                  │
│                                      │
│ "Your business qualifies for         │
│ payment processing."                 │
│                                      │
│ [Info Card: What happens next?]      │
│ 1. Choose software & hardware        │
│ 2. Complete purchase                 │
│ 3. Get set up & take payments        │
│                                      │
│ [Continue to Setup] ──────────────┐  │
└────────────────────────────────────┼──┘
                                     ↓
                                   STEP 2
```

#### High-Value Merchant (Assisted/Managed)

```
┌─────────────────────────────────────┐
│ [✓ Success Badge]                    │
│                                      │
│ Great news! You qualify for          │
│ dedicated support                    │
│                                      │
│ "Based on your business size, we're  │
│ assigning a payment specialist."     │
│                                      │
│ [Specialist Card]                    │
│ Your specialist will contact you     │
│ within 2 hours                       │
│                                      │
│ [Schedule a Call] ──────────────┐    │
│                                 ↓    │
│ "Prefer to continue on your     Calendar
│ own? Continue to setup" ────┐   Picker
│                             ↓        │
└─────────────────────────────┼────────┘
                              ↓
                           STEP 2
                        (Self-Serve)
```

#### Needs Review

```
┌─────────────────────────────────────┐
│ [⏳ Clock Icon - Orange]             │
│                                      │
│ We're reviewing your application     │
│                                      │
│ "This usually takes 1-2 hours        │
│ during business hours."              │
│                                      │
│ [Info Card: What's happening?]       │
│ "We review applications to ensure    │
│ we can support your business type."  │
│                                      │
│ Expected response: Within 2 hours    │
│ We'll email you at [email]           │
│                                      │
│ ☐ Send me a text when approved       │
│                                      │
│ [Got it] ────────────────────────┐   │
│ "Questions? Chat with us"        ↓   │
└──────────────────────────────────┼───┘
                                   ↓
                            LOGIN PAGE
                            (Waiting State)
```

#### Rejected

```
┌─────────────────────────────────────┐
│ [⊗ X Icon - Red, sympathetic]        │
│                                      │
│ We can't approve your application    │
│ right now                            │
│                                      │
│ [Specific reason shown here]         │
│ "We don't currently support          │
│ [business category] for payment      │
│ processing."                         │
│                                      │
│ [Info Card]                          │
│ "You can still use Lightspeed POS"   │
│ with a different payment processor.  │
│ [View compatible processors]         │
│                                      │
│ [Contact Sales] ─────────────────┐   │
│ "Back to homepage"               ↓   │
└──────────────────────────────────┼───┘
                                   ↓
                            CONTACT FORM
                            or HOMEPAGE
```

---

## Step 2: Configuration Flow

### Unified Setup Dashboard

```
FROM STEP 1 (APPROVED)
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ Step 2 of 4: Set Up Your POS & Payments                              │
│ Progress: [●●○○]                                                      │
├───────────────────────────────────────────────────────────────────────┤
│ [SPECIALIST BANNER] ← Only if Assisted/Managed                        │
│ "Your specialist [Name] is ready to help"                            │
│ [Call me now] [Schedule a call]                                      │
├────────────────────────────────────┬──────────────────────────────────┤
│ LEFT: Configuration (60%)          │ RIGHT: Quote Summary (40%)       │
│                                    │ [Sticky on scroll]               │
├────────────────────────────────────┤                                  │
│ [SOFTWARE SETUP CARD]              │ Your Quote                       │
│                                    │                                  │
│ How many locations? [1] [+][-]     │ Software (monthly)               │
│ Registers per location? [1] [+][-] │ • 1 location × $X = $Y           │
│                                    │ • 1 register × $X = $Y           │
│ Add-ons:                           │ Subtotal: $X/month               │
│ ☐ I need eCommerce                 │                                  │
│                                    │ Hardware (one-time)              │
│ [View other add-ons] ▼             │ • Essential Package × 1 = $Y     │
│                                    │ Subtotal: $X                     │
├────────────────────────────────────┤                                  │
│ [HARDWARE SETUP CARD]              │ Lightspeed Payments              │
│                                    │ $0 setup + 2.6% + 10¢            │
│ [Recommended Packages] [Existing]  │                                  │
│                                    │ ─────────────────────            │
│ [Package Card 1]                   │ $X due today                     │
│ [Package Card 2] ← Selected        │ $Y/month starting [date]         │
│ [Package Card 3]                   │                                  │
│                                    │ [Continue to Checkout] ─────┐    │
│ Quantity: [1] [+][-]               │                             ↓    │
│                                    │ "Save quote for later"      STEP 3
│                                    │ "Need help? Chat with us"        │
└────────────────────────────────────┴──────────────────────────────────┘
```

### Hardware Selection Flow

#### Recommended Packages Tab

```
┌─────────────────────────────────────────────────────────────┐
│ [Recommended Packages] [I have existing hardware]            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Grid/List Toggle] View as: [Grid] [List]                   │
│                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐   │
│ │ Essential      │ │ Complete       │ │ Multi-Register │   │
│ │ Package        │ │ Package        │ │ Package        │   │
│ │ [MOST POPULAR] │ │ [BEST VALUE]   │ │                │   │
│ │                │ │                │ │                │   │
│ │ [Image]        │ │ [Image]        │ │ [Image]        │   │
│ │                │ │                │ │                │   │
│ │ What's         │ │ What's         │ │ What's         │   │
│ │ included:      │ │ included:      │ │ included:      │   │
│ │ • POS Terminal │ │ • POS Terminal │ │ • 2 POS        │   │
│ │ • Payment      │ │ • Payment      │ │   Terminals    │   │
│ │   Terminal     │ │   Terminal     │ │ • 2 Payment    │   │
│ │ • Receipt      │ │ • Receipt      │ │   Terminals    │   │
│ │   Printer      │ │   Printer      │ │ • 2 Printers   │   │
│ │                │ │ • Cash Drawer  │ │ • 2 Cash       │   │
│ │                │ │ • Barcode      │ │   Drawers      │   │
│ │                │ │   Scanner      │ │                │   │
│ │                │ │                │ │                │   │
│ │ $X one-time    │ │ $Y one-time    │ │ $Z one-time    │   │
│ │ or $Y/mo       │ │ or $Y/mo       │ │ or $Y/mo       │   │
│ │ financing      │ │ financing      │ │ financing      │   │
│ │                │ │                │ │                │   │
│ │ ○ Select       │ │ ◉ Select       │ │ ○ Select       │   │
│ │                │ │                │ │                │   │
│ │ [Customize]    │ │ [Customize]    │ │ [Customize]    │   │
│ │ [Details ▼]    │ │ [Details ▼]    │ │ [Details ▼]    │   │
│ └────────────────┘ └────────────────┘ └────────────────┘   │
│                                                              │
│ Selection: Complete Package (selected)                       │
│ Need multiple packages? Qty: [1] [+][-]                     │
│ Total: 1 package = $Y                                        │
└─────────────────────────────────────────────────────────────┘
  ↓
  Selection updates quote in real-time
```

#### Existing Hardware Tab

```
┌─────────────────────────────────────────────────────────────┐
│ [Recommended Packages] [I have existing hardware]            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Check your hardware compatibility                            │
│ "Tell us what you have and we'll verify it works"           │
│                                                              │
│ [Device Entry 1]                                             │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Device type: [iPad/Tablet       ▼]                     │  │
│ │ Make/model: [iPad Pro 11-inch, 2023 ___________]       │  │
│ │ [Autocomplete suggestions shown as type]               │  │
│ │ [Check Compatibility]                                  │  │
│ └────────────────────────────────────────────────────────┘  │
│   ↓ (After check)                                            │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [✓ Green] Great! iPad Pro 11-inch works               │  │
│ │ "You'll need to download the Lightspeed app"          │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ [+ Add another device]                                       │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [⚠ Yellow] You'll need a payment terminal              │  │
│ │ Recommended: [Verifone P400]                           │  │
│ │ [Add to cart] ─────────────────────────────────────┐   │  │
│ └────────────────────────────────────────────────────┼───┘  │
└──────────────────────────────────────────────────────┼──────┘
                                                        ↓
                                        Adds to quote summary
```

### Gating: KYB Pending

```
┌───────────────────────────────────────────────────────────┐
│ Quote Summary                                              │
├───────────────────────────────────────────────────────────┤
│ Software: $X/month                                         │
│ Hardware: $Y one-time                                      │
│ Payments: 2.6% + 10¢                                       │
│ ─────────────────                                          │
│ $Z due today + $X/month                                    │
│                                                            │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ [⏳ Clock Icon]                                      │   │
│ │ We're finalizing your payment processing approval   │   │
│ │ "Usually 1-2 hours. Configure your setup now."      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ [Continue to Checkout] ← DISABLED                          │
│  ↑                                                         │
│  Tooltip: "Waiting for business verification"             │
│                                                            │
│ [Save quote for later]                                     │
└───────────────────────────────────────────────────────────┘

When KYB completes:
  ↓
  [Email notification]
  "Your payment processing is approved! Complete your purchase."
  ↓
  Button becomes enabled
  [Continue to Checkout] ← ENABLED ─────────────────────┐
                                                         ↓
                                                      STEP 3
```

---

## Step 3: Checkout & Verification Flow

```
FROM STEP 2 (CONFIGURED + KYB APPROVED)
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ Step 3 of 4: Complete Purchase                                        │
│ Progress: [●●●○]                                                      │
├───────────────────────────────────────────────────────────────────────┤
│ [SECTION 1: ORDER REVIEW]                                             │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ Review your order                                               │  │
│ │                                                                 │  │
│ │ [▼] Software Subscription - $X/month                            │  │
│ │     [Expandable - shows breakdown when clicked]                 │  │
│ │                                                                 │  │
│ │ [▼] Hardware & Equipment - $Y one-time                          │  │
│ │     [Expandable - shows itemized list]                          │  │
│ │                                                                 │  │
│ │ [▼] Lightspeed Payments - $0 setup + 2.6% + 10¢               │  │
│ │     [Expandable - shows rate card]                              │  │
│ │                                                                 │  │
│ │ ═══════════════════════════════════════                         │  │
│ │ Total due today: $Z                                             │  │
│ │ Then $X/month starting [date]                                   │  │
│ │                                                                 │  │
│ │ "Need to change something? Edit configuration"                  │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [SECTION 2: PAYMENT INFORMATION]                                      │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [🔒] Your payment information is encrypted and secure           │  │
│ │ [SSL] [PCI Compliant]                                           │  │
│ │                                                                 │  │
│ │ [Credit Card] [ACH/Bank Transfer]                               │  │
│ │                                                                 │  │
│ │ Card number: [________________] [VISA icon detected]            │  │
│ │ Expiration: [MM/YY]  CVV: [___]                                 │  │
│ │ Name on card: [____________________]                            │  │
│ │                                                                 │  │
│ │ ☑ Save this card for future billing                             │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [SECTION 3: BILLING & SHIPPING]                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ Billing address                                                 │  │
│ │ ☑ Same as business address                                      │  │
│ │ [123 Main St, City, State ZIP - Read-only with Edit link]      │  │
│ │                                                                 │  │
│ │ ─────────────                                                   │  │
│ │                                                                 │  │
│ │ Shipping address                                                │  │
│ │ ☑ Ship to business address                                      │  │
│ │ [123 Main St, City, State ZIP - Read-only with Edit link]      │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [SECTION 4: IDENTITY VERIFICATION]                                    │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [🛡️ Shield Icon] Identity verification required                 │  │
│ │ "To comply with payment processing regulations..."              │  │
│ │ [Why is this required?] ← Opens modal                           │  │
│ │                                                                 │  │
│ │ Business representative                                         │  │
│ │ "The person responsible for this account"                       │  │
│ │                                                                 │  │
│ │ Full legal name: [______________________]                       │  │
│ │ Date of birth: [MM] [DD] [YYYY]                                 │  │
│ │ Social Security: [___-__-____] [Show/Hide]                      │  │
│ │ Home address: [________________________]                        │  │
│ │ Your role: [Owner ▼]                                            │  │
│ │                                                                 │  │
│ │ [If applicable: Business owners section]                        │  │
│ │ "Anyone who owns 25% or more"                                   │  │
│ │ [+ Add owner]                                                   │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [SECTION 5: TERMS & CONSENT]                                          │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ ☑ I agree to the Lightspeed Terms of Service [Read]            │  │
│ │ ☑ I agree to the Payments Processing Agreement [Read]          │  │
│ │ ☑ I acknowledge the Privacy Policy [Read]                       │  │
│ │ ☑ I authorize verification and credit check                     │  │
│ └─────────────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────────────┤
│ [STICKY BOTTOM BAR]                                                   │
│ Total: $Z due today + $X/month                                        │
│                                                                       │
│ [Complete Purchase] ← LARGE BUTTON ───────────────────────────────┐   │
│                                                                    ↓   │
│ [🔒] Secure | [💰] 30-day guarantee | [💬] Support available       ↓   │
│                                                                    ↓   │
│ "Questions? Call 1-800-XXX-XXXX or chat"                          ↓   │
└────────────────────────────────────────────────────────────────────┼───┘
                                                                     ↓
                                                            SUBMIT & PROCESS
```

### Processing Flow

```
AFTER "COMPLETE PURCHASE" CLICKED
  ↓
┌───────────────────────────────────────┐
│ [Full-page overlay - can't dismiss]   │
│                                       │
│ [Large Spinner Animation]             │
│                                       │
│ Processing your order...              │
│ "Please don't close this page"        │
│                                       │
│ ✓ Verifying payment...                │
│ ⋯ Activating your account...          │
│ ⋯ Preparing your hardware...          │
│                                       │
│ "Usually takes 10-30 seconds"         │
└───────────────────────────────────────┘
  ↓
  API Calls (Parallel):
  - Process payment
  - Create X-Series account
  - Submit hardware order
  - Submit KYC data
  - Activate Payments (payout hold)
  ↓
  ↓──────────┬─────────────┬──────────────┐
  ↓          ↓             ↓              ↓
  SUCCESS    PAYMENT       KYC            API
             DECLINED      REVIEW         ERROR
                          NEEDED
```

### Success: Confirmation Screen

```
SUCCESS PATH
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ [✓ Large Green Checkmark - Animated]                                  │
│                                                                       │
│ Order confirmed! Here's what happens next                            │
│                                                                       │
│ Order #123456                                                         │
│ Confirmation sent to [email@business.com]                            │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [Timeline - Vertical]                                           │  │
│ │                                                                 │  │
│ │ [✓] Software account activated                                  │  │
│ │     "Login credentials sent to your email"                      │  │
│ │     [Access your dashboard] ← Secondary button                  │  │
│ │                                                                 │  │
│ │ [📦] Hardware shipping to [address]                             │  │
│ │     "Expected delivery: Oct 15-17"                              │  │
│ │     "We'll email tracking info within 24 hours"                 │  │
│ │                                                                 │  │
│ │ [🛡️] Payment processing activating                              │  │
│ │     "Ready in 24-48 hours"                                      │  │
│ │     "You'll be able to accept payments soon"                    │  │
│ │                                                                 │  │
│ │ [✓] Next: Get everything ready                                  │  │
│ │     "We'll guide you through setup"                             │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [💡 Info Card - Light Blue]                                      │  │
│ │ While you wait...                                               │  │
│ │ "Explore your dashboard and familiarize yourself with           │  │
│ │ Lightspeed. Start adding products and locations."               │  │
│ │ [Explore Lightspeed] ← Opens X-Series                           │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [Go to Setup Checklist] ← LARGE PRIMARY BUTTON ───────────────────┐  │
│                                                                    ↓  │
│ "Download confirmation (PDF)" | "Need help? Contact support"      ↓  │
└────────────────────────────────────────────────────────────────────┼──┘
                                                                     ↓
                                                                  STEP 4
```

### Error Paths

#### Payment Declined

```
┌───────────────────────────────────────┐
│ [Modal Overlay]                        │
├───────────────────────────────────────┤
│ [⚠️ Yellow Warning Icon]               │
│                                       │
│ Payment unsuccessful                  │
│                                       │
│ "Your card was declined.              │
│ Try another payment method?"          │
│                                       │
│ [If reason available]                 │
│ Reason: Insufficient funds            │
│                                       │
│ [Try another card] ──────────────┐    │
│                                  ↓    │
│ "Contact your bank"              Return to
│ "Need help? Chat with us"        payment
│                                  form
│ [X Close]                             │
└───────────────────────────────────────┘

Order configuration preserved
Merchant doesn't lose their setup
```

#### KYC Review Needed

```
┌───────────────────────────────────────────────┐
│ [Modal or Page]                                │
├───────────────────────────────────────────────┤
│ [⚠️ Orange Warning]                            │
│                                               │
│ Additional verification needed                │
│                                               │
│ "We need additional documents to              │
│ verify your business."                        │
│                                               │
│ Please upload:                                │
│ • Government-issued ID                        │
│ • Business license                            │
│ • Recent bank statement                       │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ [Drag-and-drop Upload Area]               │ │
│ │ "Drag files here or click to browse"     │ │
│ │ Accepted: PDF, JPG, PNG (Max 10MB)       │ │
│ │                                           │ │
│ │ [Files uploaded:]                         │ │
│ │ • drivers-license.pdf [X remove]          │ │
│ │ • business-license.jpg [X remove]         │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ [Submit documents]                            │
│                                               │
│ "Review typically takes 24 hours"             │
│ "Questions? Talk to verification team"        │
└───────────────────────────────────────────────┘

Note: Payment may be held until verification
```

---

## Step 4: Setup Checklist Flow

```
FROM STEP 3 (ORDER CONFIRMED)
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ Step 4 of 4: Get Everything Ready                                     │
│ Progress: [●●●●]                                                      │
├───────────────────────────────────────────────────────────────────────┤
│ Welcome back, [Merchant Name]!                                        │
│ Overall progress: 3 of 6 tasks complete                               │
│                                                                       │
│ [SPECIALIST BANNER - Conditional]                                     │
│ For Assisted: "Need help? [Name] is here. [Schedule session]"        │
│ For Managed: "Your specialist [Name] | Next session: [Date/Time]"    │
├───────────────────────────────────────────────────────────────────────┤
│ [TASK CHECKLIST - Single Column]                                      │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [✓] 1. Account created                           [Complete]     │  │
│ │ ▼ [Collapsed - click to expand details]                        │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [✓] 2. Software activated                        [Complete]     │  │
│ │ ▼ [Collapsed]                                                   │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [📦] 3. Hardware shipped                         [In transit]   │  │
│ │ ▼ [Expanded - current state]                                    │  │
│ │ ┌───────────────────────────────────────────────────────────┐   │  │
│ │ │ Your hardware is on the way!                              │   │  │
│ │ │                                                           │   │  │
│ │ │ Tracking: 1Z999AA1 0123456789                            │   │  │
│ │ │ [Track shipment] ← Opens carrier site                    │   │  │
│ │ │ Expected delivery: Oct 15-17                             │   │  │
│ │ │                                                           │   │  │
│ │ │ What's in the box:                                       │   │  │
│ │ │ • POS Terminal × 1                                       │   │  │
│ │ │ • Payment Terminal × 1                                   │   │  │
│ │ │ • Receipt Printer × 1                                    │   │  │
│ │ │ [View full packing list]                                 │   │  │
│ │ └───────────────────────────────────────────────────────────┘   │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [🔒] 4. Set up your hardware      [Waiting for delivery] ~20min│  │
│ │ "This task will unlock when hardware is delivered"              │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [○] 5. Connect bank account         [Not started] ~3min        │  │
│ │ [Required for payouts] ← Badge                                  │  │
│ │ ▲ [Click to expand and start]                                   │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [○] 6. Import products & customers  [Optional] ~10-30min        │  │
│ │ "Skip if starting fresh"                                        │  │
│ │ ▲ [Collapsed]                                                   │  │
│ └─────────────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────────────┤
│ [OVERALL PROGRESS CARD]                                               │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ [Circular Progress Ring: 50%]                                   │  │
│ │ 3 of 6 tasks complete                                           │  │
│ │                                                                 │  │
│ │ Critical tasks:                                                 │  │
│ │ ✓ Account created                                               │  │
│ │ ✓ Software activated                                            │  │
│ │ ⏳ Hardware (in transit)                                         │  │
│ │ ⬜ Bank account (not started)                                    │  │
│ │                                                                 │  │
│ │ [Info Banner]                                                   │  │
│ │ "Almost there! Complete remaining tasks to start accepting      │  │
│ │ payments."                                                      │  │
│ │                                                                 │  │
│ │ Next: Connect your bank account                                 │  │
│ │ [Continue] ───────────────────────────────────────────────┐     │  │
│ └──────────────────────────────────────────────────────────┼─────┘  │
└────────────────────────────────────────────────────────────┼─────────┘
                                                              ↓
                                                    Expands task or
                                                    scrolls to next task
```

### Task State Transitions

#### Task 4: Set Up Hardware (Detailed Flow)

```
INITIALLY: LOCKED
┌─────────────────────────────────────────────────────────────────┐
│ [🔒] 4. Set up your hardware          [Waiting for delivery]    │
│ "This task will unlock when hardware is delivered"              │
└─────────────────────────────────────────────────────────────────┘

AFTER DELIVERY: UNLOCKED
┌─────────────────────────────────────────────────────────────────┐
│ [○] 4. Set up your hardware           [Not started] ~20min      │
│ "Your hardware has arrived! Let's get it connected."            │
│                                                                 │
│ [Start setup] ──────────────────────────────────────────────┐   │
└──────────────────────────────────────────────────────────────┼──┘
                                                               ↓
                                                        Marks in progress
                                                        Expands content

AFTER CLICKING "START SETUP": IN PROGRESS
┌─────────────────────────────────────────────────────────────────┐
│ [●] 4. Set up your hardware           [In progress] ~20min      │
│ ▼ [Expanded]                                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Follow these steps to get your hardware ready:           │   │
│ │                                                           │   │
│ │ Sub-task checklist:                                       │   │
│ │ ☑ 1. Plug in your POS terminal                            │   │
│ │    ▼ [Expanded - shows photo/diagram, instructions]      │   │
│ │       [Watch setup video (2 min)]                        │   │
│ │                                                           │   │
│ │ ☑ 2. Connect your payment terminal                        │   │
│ │    ▼ [Expanded - pairing instructions]                   │   │
│ │       [Troubleshooting: Terminal not connecting?]        │   │
│ │                                                           │   │
│ │ ☐ 3. Set up receipt printer                               │   │
│ │    ▲ [Collapsed - click to expand]                       │   │
│ │                                                           │   │
│ │ ☐ 4. Set up cash drawer (if applicable)                   │   │
│ │    ▲ [Collapsed]                                          │   │
│ │                                                           │   │
│ │ ☐ 5. Run a test transaction                               │   │
│ │    ▲ [Collapsed]                                          │   │
│ │                                                           │   │
│ │ Progress: 2 of 5 steps complete                           │   │
│ │ [════════════════════════                    ] 40%        │   │
│ │                                                           │   │
│ │ [Mark as complete] ← Enabled when all checked            │   │
│ │ "I need help with this" ← Opens support chat             │   │
│ │                                                           │   │
│ │ [Troubleshooting ▼]                                       │   │
│ │ • Terminal won't pair → Solution                         │   │
│ │ • Printer not printing → Solution                        │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

AFTER ALL SUB-TASKS CHECKED + "MARK COMPLETE": COMPLETED
┌─────────────────────────────────────────────────────────────────┐
│ [✓] 4. Hardware set up                [Complete]                │
│ "All hardware connected and tested"                             │
│ Completed: Oct 15, 2025                                         │
│ ▼ [Collapsed - click to see summary]                            │
└─────────────────────────────────────────────────────────────────┘
```

#### Task 5: Connect Bank Account (Detailed Flow)

```
INITIALLY: UNLOCKED (Can start anytime after Step 3)
┌─────────────────────────────────────────────────────────────────┐
│ [○] 5. Connect bank account           [Not started] ~3min       │
│ [Required for payouts] ← Orange badge                           │
│                                                                 │
│ [⚠️ Info Banner]                                                 │
│ "You can accept payments now, but payouts are held until        │
│ your bank account is verified (1-2 days)."                      │
│                                                                 │
│ [Connect bank account] ─────────────────────────────────────┐   │
└──────────────────────────────────────────────────────────────┼──┘
                                                               ↓
                                                        Expands form

AFTER CLICKING "CONNECT": IN PROGRESS (ENTERING INFO)
┌─────────────────────────────────────────────────────────────────┐
│ [●] 5. Connect bank account           [In progress]             │
│ ▼ [Expanded]                                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [🔒] Your bank information is encrypted and secure        │   │
│ │                                                           │   │
│ │ [Instant verification (recommended)] [Manual entry]      │   │
│ │                                                           │   │
│ │ TAB 1: Instant verification (Plaid)                       │   │
│ │ [Connect with Plaid] ─────────────────────────────┐       │   │
│ │ "Instant verification, no waiting"                ↓       │   │
│ │                                           Opens Plaid     │   │
│ │                                           widget          │   │
│ │ OR                                                        │   │
│ │                                                           │   │
│ │ TAB 2: Manual entry                                       │   │
│ │ Account holder: [_____________________]                   │   │
│ │ Bank name: [_____________________]                        │   │
│ │ Routing number: [_________] [?]                           │   │
│ │ Account number: [_________________] [Show/Hide]           │   │
│ │ Account type: ○ Checking ○ Savings                        │   │
│ │                                                           │   │
│ │ [Submit for verification]                                 │   │
│ │ "I'll do this later"                                      │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

AFTER SUBMISSION: VERIFYING (MICRO-DEPOSITS)
┌─────────────────────────────────────────────────────────────────┐
│ [⏳] 5. Connect bank account          [Verifying]               │
│ ▼ [Expanded]                                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Verification in progress                                  │   │
│ │                                                           │   │
│ │ Timeline:                                                 │   │
│ │ Day 1: ✓ We've sent 2 small deposits to your account     │   │
│ │ Day 2-3: ⏳ Check your bank for deposits ($0.01-$0.99)    │   │
│ │ Day 3: ⬜ Enter amounts to verify                          │   │
│ │                                                           │   │
│ │ Current status: "Waiting for deposits to arrive"          │   │
│ │ "We'll email you when they're ready to verify"           │   │
│ │                                                           │   │
│ │ [Change bank account]                                     │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

WHEN DEPOSITS ARRIVE (EMAIL SENT): READY TO VERIFY
┌─────────────────────────────────────────────────────────────────┐
│ [⏳] 5. Connect bank account          [Verify amounts]          │
│ ▼ [Expanded]                                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Deposits have arrived! Enter the amounts to verify:       │   │
│ │                                                           │   │
│ │ Deposit 1: $0.[__]                                        │   │
│ │ Deposit 2: $0.[__]                                        │   │
│ │                                                           │   │
│ │ [Verify amounts]                                          │   │
│ │                                                           │   │
│ │ "Can't find the deposits? Check with your bank"           │   │
│ │ [Wrong account? Change bank account]                      │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

AFTER SUCCESSFUL VERIFICATION: COMPLETED
┌─────────────────────────────────────────────────────────────────┐
│ [✓] 5. Bank account connected         [Verified]               │
│ "Your bank account is verified and payouts are now enabled"    │
│                                                                 │
│ Bank: [Bank Name]                                               │
│ Account: ****1234                                               │
│ Payout schedule: Daily (next business day)                      │
│                                                                 │
│ [View payout settings] [Change bank account]                   │
│ ▼ [Collapsed]                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Test Transaction Flow

```
WHEN ALL CRITICAL TASKS COMPLETE
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ [PROGRESS CARD - Updated]                                             │
│ ┌─────────────────────────────────────────────────────────────────┐   │
│ │ [Circular Progress: 100%] ✓                                     │   │
│ │ All critical tasks complete!                                    │   │
│ │                                                                 │   │
│ │ [Success Banner]                                                │   │
│ │ "You're ready to go live!"                                      │   │
│ │ "Run a test transaction to make sure everything works"         │   │
│ │                                                                 │   │
│ │ [Run test transaction] ← LARGE PROMINENT BUTTON ────────────┐   │   │
│ └──────────────────────────────────────────────────────────────┼──┘   │
└────────────────────────────────────────────────────────────────┼──────┘
                                                                  ↓
                                                          Opens test flow

TEST FLOW (Modal or Inline Guided)
┌───────────────────────────────────────────────────────────────────────┐
│ [Step 1]                                                              │
│ Let's run a test payment                                              │
│ "This makes sure everything works"                                    │
│                                                                       │
│ [Enter test mode] ───────────────────────────────────────────────┐    │
└──────────────────────────────────────────────────────────────────┼────┘
                                                                   ↓
                                                      Activates test mode

┌───────────────────────────────────────────────────────────────────────┐
│ [Step 2]                                                              │
│ Create a test sale                                                    │
│ "Ring up a test sale in your POS"                                     │
│                                                                       │
│ Instructions:                                                         │
│ • Add any item to cart                                                │
│ • Choose payment: Card                                                │
│ • Use test card: 4242 4242 4242 4242                                  │
│                                                                       │
│ ☐ I've created the test sale                                          │
│                                                                       │
│ [Continue] ──────────────────────────────────────────────────────┐    │
└──────────────────────────────────────────────────────────────────┼────┘
                                                                   ↓

┌───────────────────────────────────────────────────────────────────────┐
│ [Step 3]                                                              │
│ Process the payment                                                   │
│ "Process the payment on your terminal"                                │
│                                                                       │
│ Instructions:                                                         │
│ • Test card will work on your terminal                                │
│ • Payment processes but won't be charged                              │
│                                                                       │
│ [⏳ Detecting payment...] ← System auto-detects                        │
└───────────────────────────────────────────────────────────────────────┘
  ↓
  System detects test payment complete
  ↓
┌───────────────────────────────────────────────────────────────────────┐
│ [Step 4]                                                              │
│ [✓ Large Green Checkmark Animation]                                   │
│                                                                       │
│ Test successful! Your system works perfectly                          │
│                                                                       │
│ What was tested:                                                      │
│ ✓ POS software connected                                              │
│ ✓ Payment terminal paired                                             │
│ ✓ Transaction processed                                               │
│ ✓ Receipt printed                                                     │
│                                                                       │
│ [Exit test mode]                                                      │
│                                                                       │
│ Ready to take your first real payment?                                │
│ [Go live] ← LARGE BUTTON ─────────────────────────────────────────┐   │
└────────────────────────────────────────────────────────────────────┼──┘
                                                                     ↓
                                                            COMPLETION!
```

### Completion Celebration

```
┌───────────────────────────────────────────────────────────────────────┐
│ [Full-screen Modal with Confetti Animation - Subtle]                  │
│                                                                       │
│ [🏆 Trophy Icon]                                                       │
│                                                                       │
│ Congratulations! You're all set up                                    │
│                                                                       │
│ "You're ready to accept payments and run your business with           │
│ Lightspeed"                                                           │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ What you've accomplished:                                       │  │
│ │ ✓ Account created and verified                                  │  │
│ │ ✓ Software configured                                           │  │
│ │ ✓ Hardware set up and tested                                    │  │
│ │ ✓ Bank account connected                                        │  │
│ │ ✓ Test transaction successful                                   │  │
│ │                                                                 │  │
│ │ Time to complete: 3 days                                        │  │
│ │ "You're in the top 20% of fastest setups!"                      │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ What's next?                                                    │  │
│ │ • Start taking real payments                                    │  │
│ │ • Explore advanced features                                     │  │
│ │ • Set up your team                                              │  │
│ │ • Connect integrations                                          │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│ [Start taking payments] ← LARGE PRIMARY BUTTON ────────────────────┐  │
│                                                                    ↓  │
│ "View help center"                                         Opens     │
│                                                           X-Series   │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │ How was your onboarding experience?                             │  │
│ │ [★ ★ ★ ★ ★] 5-star rating                                       │  │
│ │ [Optional comment field]                                        │  │
│ │ [Share feedback]                                                │  │
│ └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Specialist Integration Touchpoints

### Self-Serve Path (No Specialist)

```
STEP 1: Signup
  - No specialist shown
  - Outcome: "You're approved" → Step 2

STEP 2: Configuration
  - No specialist banner
  - Help option: "Questions? Chat with us" (secondary)

STEP 3: Checkout
  - Standard checkout
  - Help: "Questions? Call or chat" (footer)

STEP 4: Setup
  - No specialist banner
  - Help option: "Stuck? Chat with us" (inline)
  - Stall detection → Automated email offers help
```

### Assisted Path (Specialist Available)

```
STEP 1: Signup
  - If high-value detected → Specialist introduction
  - "You qualify for dedicated support"
  - [Schedule call] OR [Continue alone]

STEP 2: Configuration
  - Specialist banner (top of page)
    "Your specialist [Name] is ready to help"
    [Call me now] [Schedule call]
  - Can dismiss: "I'll do this myself"
  - Merchant sees same configuration UI
  - Specialist can share screen and modify quote

STEP 3: Checkout
  - Specialist sends checkout link (optional)
  - Merchant can complete on own or with specialist on call
  - Standard checkout experience

STEP 4: Setup
  - Specialist banner (persistent or dismissible)
    "Need help? [Name] is here"
    [Schedule setup session]
  - Free IC support sessions available
  - Can book for specific tasks or work alone
```

### Managed Path (Required Specialist)

```
STEP 1: Signup
  - Specialist introduction (required)
  - "Your account manager [Name] is preparing quote"
  - [Schedule call] (required before purchase)

STEP 2: Configuration
  - Specialist banner (prominent, not dismissible)
    "Your account manager [Name] is preparing custom quote"
    [Schedule call]
  - Can browse options but checkout disabled
  - "Custom quote ready within 24 hours"
  - When quote ready: Appears in same interface

STEP 3: Checkout
  - Custom quote with negotiated pricing
  - May have custom payment terms
  - Specialist manages order process

STEP 4: Setup
  - Dedicated specialist banner (top)
    "Your implementation specialist: [Name]"
    "Next session: [Date/Time]"
    [Reschedule] [Join session]
  - Scheduled onboarding sessions (multiple if needed)
  - IC manages entire setup
  - Merchant participates but IC leads
```

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SPECIALIST TOUCHPOINTS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ SELF-SERVE              ASSISTED                MANAGED              │
│ ────────────────────    ─────────────────       ───────────────      │
│                                                                      │
│ No specialist           Optional specialist     Required specialist  │
│ shown                   offered                 engagement           │
│                                                                      │
│ "Chat with us"          Banner: "[Name]         Banner: "Your AM     │
│ (secondary link)        ready to help"          [Name]"              │
│                         [Call] [Schedule]       [Schedule call]      │
│                         OR "I'm good"           (required)           │
│                                                                      │
│ Self-serve all          Can self-serve OR       Guided through       │
│ tasks                   book sessions           all steps            │
│                                                                      │
│ Stall detection →       Free IC support         Paid implementation  │
│ Automated help          if requested            package              │
│ offers                                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Error & Edge Case Flows

### KYB Pending (Step 1 → Step 2 Transition)

```
SCENARIO: Merchant completes Step 1 but KYB not yet approved
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ STEP 2: Configuration Page                                        │
├───────────────────────────────────────────────────────────────────┤
│ Software & Hardware: [Can configure freely]                       │
│                                                                   │
│ Quote Summary:                                                    │
│ $X due today + $Y/month                                           │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ [⏳ Clock Icon]                                              │  │
│ │ We're finalizing your payment processing approval           │  │
│ │ "Usually 1-2 hours. Configure your setup now."              │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ [Continue to Checkout] ← DISABLED                                 │
│  ↑ Tooltip: "Waiting for business verification"                  │
└───────────────────────────────────────────────────────────────────┘
  ↓
  When KYB completes (backend event):
  ↓
  Email sent: "Your payment processing is approved! Complete purchase."
  ↓
  Button enabled + in-app notification
  ↓
  [Continue to Checkout] ← ENABLED ────────────────────────┐
                                                            ↓
                                                         STEP 3
```

### Hardware Out of Stock (Step 2)

```
SCENARIO: Merchant selects hardware that's backordered
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ [Hardware Package Card]                                           │
│ [Badge: "Ships in 2 weeks"]                                       │
│                                                                   │
│ Complete Package                                                  │
│ $Y one-time                                                       │
│                                                                   │
│ ◉ Select this package ──────────────────────────────────────┐     │
└──────────────────────────────────────────────────────────────┼────┘
                                                               ↓
                                                     Opens modal

┌───────────────────────────────────────────────────────────────────┐
│ [Modal]                                                           │
├───────────────────────────────────────────────────────────────────┤
│ [ℹ️ Info Icon]                                                     │
│                                                                   │
│ This item is currently backordered                                │
│                                                                   │
│ "Ships by October 25"                                             │
│                                                                   │
│ Your options:                                                     │
│                                                                   │
│ ○ Wait for this item (ships Oct 25)                              │
│ ○ Choose alternative: [Similar Package]                          │
│ ○ Continue with other items, ship this later                     │
│                                                                   │
│ [Continue]                                                        │
└───────────────────────────────────────────────────────────────────┘
  ↓
  Selection recorded in quote
  Expected ship date shown in order summary
```

### Merchant Stalls (Step 4)

```
SCENARIO: Merchant doesn't complete critical task within timeframe
  ↓
DAY 3 AFTER STEP 3: Hardware not set up
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ [EMAIL AUTOMATION]                                                │
│ Subject: "Your Lightspeed hardware is ready to set up"           │
│                                                                   │
│ Hi [Name],                                                        │
│                                                                   │
│ We noticed you haven't set up your hardware yet. Need help?      │
│ We're here to assist.                                            │
│                                                                   │
│ [Continue setup] ← Returns to Task 4                              │
│ [Schedule a setup call]                                           │
└───────────────────────────────────────────────────────────────────┘

DAY 7: Bank account not connected
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ [EMAIL AUTOMATION]                                                │
│ Subject: "Don't forget to connect your bank account"             │
│                                                                   │
│ You can accept payments now, but you'll need to connect your     │
│ bank account to receive payouts.                                 │
│                                                                   │
│ ⚠️ Payments are currently being held                              │
│                                                                   │
│ [Connect bank account] ← Returns to Task 5                        │
└───────────────────────────────────────────────────────────────────┘

DAY 14: Multiple tasks incomplete, no progress
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ [EMAIL + IN-DASHBOARD BANNER]                                     │
│ Subject: "Need help finishing your setup?"                       │
│                                                                   │
│ We're here to help! Let's get you up and running.                │
│                                                                   │
│ Free setup call with a specialist                                │
│                                                                   │
│ [Schedule call]                                                   │
│                                                                   │
│ For high-value merchants:                                         │
│ → Automatic IC assignment                                         │
│ → Proactive outreach call within 24 hours                         │
└───────────────────────────────────────────────────────────────────┘

IN-DASHBOARD BANNER (if stalled on critical task):
┌───────────────────────────────────────────────────────────────────┐
│ [Top of Checklist]                                                │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ [👋 Friendly Icon] Stuck on something?                       │  │
│ │ "Our team is here to help you complete your setup"          │  │
│ │ [Chat with us] [Schedule a call]                            │  │
│ └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### Bank Verification Failure (Step 4, Task 5)

```
SCENARIO: Merchant enters wrong micro-deposit amounts
  ↓
┌───────────────────────────────────────────────────────────────────┐
│ [Task 5: Bank Verification]                                       │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Deposit 1: $0.32                                            │  │
│ │ Deposit 2: $0.51                                            │  │
│ │ [Verify amounts] ─────────────────────────────────────┐     │  │
│ └──────────────────────────────────────────────────────┼─────┘  │
└────────────────────────────────────────────────────────┼─────────┘
                                                         ↓
                                                      Submit
                                                         ↓
┌───────────────────────────────────────────────────────────────────┐
│ [❌ Error State]                                                   │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Those amounts don't match. Please try again.               │  │
│ │ Attempts remaining: 2                                       │  │
│ │                                                             │  │
│ │ Deposit 1: $0.[__] ← Cleared for retry                     │  │
│ │ Deposit 2: $0.[__]                                          │  │
│ │ [Verify amounts]                                            │  │
│ │                                                             │  │
│ │ "Can't find the deposits? Check with your bank"             │  │
│ └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘

AFTER 3 FAILED ATTEMPTS:
┌───────────────────────────────────────────────────────────────────┐
│ [⚠️ Warning]                                                       │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Maximum attempts reached                                    │  │
│ │ "Please contact support to verify manually"                │  │
│ │                                                             │  │
│ │ [Contact support] ← Opens chat with context                │  │
│ │ [Change bank account] ← Start over with different account  │  │
│ └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## Summary

This document provides comprehensive user flow diagrams for all aspects of the merchant onboarding journey:

- **High-level 4-step overview** showing the complete journey
- **Detailed flows for each step** with all states and transitions
- **Cohort-specific paths** showing how specialists integrate seamlessly
- **Error and edge case handling** with clear recovery paths
- **State transitions** showing how tasks progress from locked → unlocked → in progress → complete

These flows should be used in conjunction with the main Design Specifications document to implement the complete onboarding experience.

---

**End of User Flow Diagrams Document**
