# Merchant Dashboard Wireframes
## Unified Onboarding Dashboard (Merchant View)

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Phase 1 Wireframes

---

## Overview

The Merchant Dashboard is the central hub for the entire onboarding journey. It provides:
- **Progress visibility** - Clear 10-step progress indicator
- **Contextual guidance** - Step-specific instructions and help
- **Status transparency** - Order status, hardware tracking, KYB/KYC status
- **Support access** - Easy escalation to AE/IC help

**Design Goals:**
1. Single source of truth for merchant progress
2. Reduce anxiety through clear communication
3. Enable merchants to pick up where they left off
4. Surface blockers and next actions prominently
5. Celebrate milestones to maintain momentum

---

## Progress Indicator Design

### Horizontal Stepper (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ONBOARDING PROGRESS                                              4 of 10   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ●━━━━●━━━━●━━━━●━━━━○━━━━○━━━━○━━━━○━━━━○━━━━○                          │
│   ✓     ✓     ✓     ●     5     6     7     8     9     10                 │
│   │     │     │     │     │     │     │     │     │     │                   │
│ Acct  KYB  Soft  Hard  Pay  KYC  Data Setup Final                          │
│                                                                               │
│ ✓ = Completed (Success 500 with checkmark)                                  │
│ ● = Current Step (Primary 500, pulsing glow)                                │
│ ○ = Pending (Slate 300)                                                     │
│ ━ = Connector (matches step state color)                                    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Desktop Implementation Details:**
- Fixed at top of dashboard, sticky on scroll
- Each step is clickable (can navigate back, not forward)
- Hover state shows step name tooltip
- Current step has subtle pulsing animation
- Progress percentage displayed in top-right

### Vertical Stepper (Mobile)

```
┌──────────────────────────────┐
│  ONBOARDING PROGRESS         │
│  Step 4 of 10 (40%)          │
├──────────────────────────────┤
│                              │
│  ✓  1. Create Account        │
│  ✓  2. Business Info (KYB)   │
│  ✓  3. Software Setup        │
│                              │
│  ●  4. Hardware Selection    │
│      [Expand ▼]              │
│                              │
│  ○  5. Payment & Checkout    │
│  ○  6. KYC Verification      │
│  ○  7. Data Import           │
│  ○  8. Hardware Setup        │
│  ○  9. Integrations          │
│  ○  10. Final Review         │
│                              │
└──────────────────────────────┘
```

**Mobile Implementation Details:**
- Collapsible vertical list
- Current step auto-expanded
- Can expand any completed step to review
- Cannot expand future steps (grayed out)
- Swipe to collapse/expand

### Step States

**Completed (✓)**
- Icon: CheckCircle (Success 500)
- Label: Success 700
- Background: Success 50 (subtle highlight)
- Clickable: Yes (can review)

**Current (●)**
- Icon: Circle with pulsing glow (Primary 500)
- Label: Primary 900 (bold)
- Background: Primary 50 (highlight)
- Clickable: Yes (currently viewing)

**Pending (○)**
- Icon: Circle outline (Slate 300)
- Label: Slate 500
- Background: None
- Clickable: No (disabled)

**Blocked (⚠)**
- Icon: AlertCircle (Warning 500)
- Label: Warning 700
- Background: Warning 50
- Clickable: Yes (shows blocker details)
- Example: "Step 6 pending KYB review"

---

## Dashboard Layout Structure

### Main Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER                                              [Help] [Profile]    │
├─────────────┬───────────────────────────────────────────────────────────┤
│             │  PROGRESS STEPPER (sticky)                                │
│  SIDEBAR    ├───────────────────────────────────────────────────────────┤
│             │                                                            │
│  - Home     │  MAIN CONTENT AREA                                        │
│  - Orders   │  (Step-specific content)                                  │
│  - Support  │                                                            │
│  - Settings │                                                            │
│             │                                                            │
│  ────────   │                                                            │
│             │                                                            │
│  STATUS     │                                                            │
│  CARD       │                                                            │
│             │                                                            │
│  Next:      │                                                            │
│  Hardware   │                                                            │
│  Selection  │                                                            │
│             │                                                            │
│  [Continue] │                                                            │
│             │                                                            │
└─────────────┴───────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌───────────────────────────────┐
│  HEADER         [☰] [Profile] │
├───────────────────────────────┤
│                               │
│  PROGRESS STEPPER             │
│  (collapsible vertical)       │
│                               │
├───────────────────────────────┤
│                               │
│  MAIN CONTENT AREA            │
│  (Step-specific content)      │
│                               │
│                               │
│                               │
│                               │
│                               │
└───────────────────────────────┘
│  STICKY FOOTER CTA            │
│  [Continue to Next Step]      │
└───────────────────────────────┘
```

---

## Step-by-Step Flow Wireframes

## STEP 2: Account Creation

### Self-Serve Path

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Your Account                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Let's get started! We'll guide you through setting up your      │
│  Lightspeed account and payment processing.                      │
│                                                                   │
│  Personal Information                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ First Name *                                             │   │
│  │ [                                                     ]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Last Name *                                              │   │
│  │ [                                                     ]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Contact Information                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Email Address *                                          │   │
│  │ [                                                     ]  │   │
│  │ We'll send order confirmations here                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Phone Number *                                           │   │
│  │ [                                                     ]  │   │
│  │ For important account updates                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Password *                                               │   │
│  │ [                                                     ] 👁│   │
│  │ At least 8 characters, 1 number, 1 special character    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Business Information                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Business Category *                                      │   │
│  │ [Select...                                           ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Type of Business *                                       │   │
│  │ [Select...                                           ▼] │   │
│  │ (e.g., Retail, Restaurant, Golf Course)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Estimated Annual Revenue *                               │   │
│  │ [Select...                                           ▼] │   │
│  │ Options: <$500K, $500K-$2M, $2M-$5M, $5M+               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ ☐ I agree to the Terms of Service and Privacy Policy │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                   │
│  [Continue to Business Verification]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Validation Patterns:**
- Inline validation on blur (red error text + error icon)
- Real-time password strength meter
- Email format validation
- Phone number formatting (auto-adds dashes)

**GTV-Based Routing Logic:**
After submission, system evaluates:
- If Annual Revenue < $500K → Continue to Step 3 (Self-Serve)
- If Annual Revenue ≥ $500K → Show AE scheduling screen

### High GTV Path (AE Scheduling Screen)

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Account Created                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Great news! Based on your business size, you qualify for        │
│  personalized support from one of our Account Executives.        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤                                                       │   │
│  │                                                           │   │
│  │  An Account Executive will call you within 15 minutes    │   │
│  │  to discuss your needs and custom pricing.               │   │
│  │                                                           │   │
│  │  We've sent a confirmation to: you@business.com          │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Not available right now?                                        │
│  [Schedule a Call Instead]                                       │
│                                                                   │
│  ────────────────  OR  ────────────────                         │
│                                                                   │
│  Want to explore on your own?                                    │
│  [Continue Self-Guided Setup]                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**AE Notification (System Action):**
- Create lead in CRM
- Assign to available AE
- Send notification: "New high-value lead: [Name], [Business], [GTV]"
- Set SLA: 15-minute response time

---

## STEP 3: KYB Qualification

```
┌─────────────────────────────────────────────────────────────────┐
│  Verify Your Business                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 2 OF 10: Business Verification (KYB)                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ℹ️  Why do we need this?                               │    │
│  │                                                         │    │
│  │ To enable payment processing, we need to verify your   │    │
│  │ business is authorized to accept card payments. This   │    │
│  │ typically takes 1-2 minutes.                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Legal Business Information                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Legal Business Name *                                    │   │
│  │ [                                                     ]  │   │
│  │ Must match IRS records                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Business Structure *                                     │   │
│  │ [Select...                                           ▼] │   │
│  │ Options: Sole Proprietor, LLC, Corporation, etc.        │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Employer Identification Number (EIN) *                   │   │
│  │ [  -       ]                                            │   │
│  │ 9-digit number (e.g., 12-3456789)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Registered Business Address                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Street Address *                                         │   │
│  │ [                                                     ]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌────────────────┬──────────────────┬────────────────────┐   │
│  │ City *         │ State *          │ ZIP Code *         │   │
│  │ [            ] │ [Select...    ▼] │ [              ]   │   │
│  └────────────────┴──────────────────┴────────────────────┘   │
│                                                                   │
│  [← Back]                              [Verify Business →]       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### KYB Processing States

**Loading State (After Submit):**
```
┌─────────────────────────────────────────────────────────────────┐
│  Verifying Your Business...                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │              [Loading Spinner Animation]                 │   │
│  │                                                           │   │
│  │  Checking business records with government databases...  │   │
│  │                                                           │   │
│  │  This usually takes 10-30 seconds.                       │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Success State (Approved):**
```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Business Verified!                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Success!                                              │   │
│  │                                                           │   │
│  │  Your business is eligible for Lightspeed Payments.     │   │
│  │                                                           │   │
│  │  Next, we'll configure your software and hardware.       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Continue to Software Setup →]                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Review Needed State:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Additional Review Required                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⚠ Manual Review Needed                                  │   │
│  │                                                           │   │
│  │  Our compliance team needs to review your business       │   │
│  │  information. This typically takes 1-2 business days.    │   │
│  │                                                           │   │
│  │  You can continue setting up your account, but payment   │   │
│  │  processing will be enabled after approval.              │   │
│  │                                                           │   │
│  │  We'll email you at: you@business.com                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Continue Setup While We Review]   [Contact Support]            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Rejected State:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ✕ Unable to Verify Business                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✕ Verification Failed                                   │   │
│  │                                                           │   │
│  │  We were unable to verify your business information.     │   │
│  │                                                           │   │
│  │  Common issues:                                          │   │
│  │  • EIN doesn't match legal business name                │   │
│  │  • Business structure mismatch                          │   │
│  │  • Address not registered with IRS                      │   │
│  │                                                           │   │
│  │  Please double-check your information and try again.     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Edit Business Information]   [Contact Support]                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 4: Software Requirements (License Builder)

### Self-Serve Path

```
┌─────────────────────────────────────────────────────────────────┐
│  Configure Your Software                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 3 OF 10: Software Setup                                    │
│                                                                   │
│  How many locations will you operate?                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Number of Locations *                                    │   │
│  │ [  1  ]  [  2  ]  [  3  ]  [  4  ]  [  5+ ▼]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  How many registers per location?                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Registers Per Location *                                 │   │
│  │ [  1  ]  [  2  ]  [  3  ]  [  4  ]  [  5+ ▼]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SUBSCRIPTION SUMMARY                                    │   │
│  │                                                           │   │
│  │  Location Licenses (2):        $199/mo × 2 = $398/mo    │   │
│  │  Register Licenses (4):        $29/mo × 4 = $116/mo     │   │
│  │  ────────────────────────────────────────────────────    │   │
│  │  Monthly Total:                            $514/mo       │   │
│  │  First 3 months: 50% off                   $257/mo       │   │
│  │                                                           │   │
│  │  ℹ️  Cancel anytime, no long-term contracts             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [← Back]                             [Continue to Hardware →]   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**
- Real-time pricing calculation
- Adjust licenses with + / - buttons
- Show promotional pricing prominently
- Display annual savings option (e.g., "Save 20% with annual billing")

### Assisted Path (AE-Driven - Shared Quote View)

```
┌─────────────────────────────────────────────────────────────────┐
│  Review Your Quote with Sarah (AE)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 3 OF 10: Software Setup                                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📞 Live Session with Sarah Johnson                      │   │
│  │  Currently building your custom quote...                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CUSTOM QUOTE - Draft                                    │   │
│  │                                                           │   │
│  │  Location Licenses (5):      $199/mo × 5 = $995/mo      │   │
│  │  Enterprise discount (15%):              - $149/mo       │   │
│  │  Register Licenses (10):     $29/mo × 10 = $290/mo      │   │
│  │  Volume discount (10%):                  - $29/mo        │   │
│  │  ────────────────────────────────────────────────────    │   │
│  │  Monthly Total:                          $1,107/mo       │   │
│  │                                                           │   │
│  │  🎯 Recommended: Annual billing saves $2,656/year        │   │
│  │                                                           │   │
│  │  (AE is updating this quote in real-time)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Send Quote to My Email]  [Approve and Continue]                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**AE Dashboard Integration:**
- Merchant sees read-only quote
- AE has edit controls on their dashboard
- Updates sync in real-time (WebSocket)
- Merchant can approve when ready

---

## STEP 5: Hardware Selection (Bundle Picker)

### Self-Serve Path

```
┌─────────────────────────────────────────────────────────────────┐
│  Choose Your Hardware                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 4 OF 10: Hardware Selection                                │
│                                                                   │
│  Select a bundle or customize your hardware                      │
│                                                                   │
│  ┌───────────────┬───────────────┬───────────────────────┐     │
│  │  STARTER      │  PROFESSIONAL │  ENTERPRISE           │     │
│  │               │               │                       │     │
│  │  Best for     │  Best for     │  Best for             │     │
│  │  new stores   │  busy stores  │  high-volume stores   │     │
│  │               │               │                       │     │
│  │  [Image]      │  [Image]      │  [Image]              │     │
│  │   📱🖨️        │   📱🖨️💳      │   📱🖨️💳📊           │     │
│  │               │               │                       │     │
│  │  • POS Tablet │  • POS Tablet │  • POS Tablet         │     │
│  │  • Receipt    │  • Receipt    │  • Receipt Printer    │     │
│  │    Printer    │    Printer    │  • Card Reader        │     │
│  │               │  • Card       │  • Customer Display   │     │
│  │               │    Reader     │  • Barcode Scanner    │     │
│  │               │               │  • Cash Drawer        │     │
│  │               │               │                       │     │
│  │  $899         │  $1,499       │  $2,299               │     │
│  │  /location    │  /location    │  /location            │     │
│  │               │               │                       │     │
│  │  [Select]     │  [Select] ★   │  [Select]             │     │
│  │               │  RECOMMENDED  │                       │     │
│  └───────────────┴───────────────┴───────────────────────┘     │
│                                                                   │
│  ────────────────────  OR  ────────────────────                 │
│                                                                   │
│  Already have compatible hardware?                               │
│  [Verify My Existing Hardware]                                   │
│                                                                   │
│  [← Back]                             [Continue to Checkout →]   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Bundle Selection Details:**
- Visual comparison cards
- Highlight recommended bundle (based on business type/GTV)
- Expandable "What's included" details
- Compatibility checker for existing hardware

### Existing Hardware Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Verify Your Existing Hardware                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Enter your current hardware details to check compatibility.     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POS Tablet/Computer *                                    │   │
│  │ [Select brand...                                     ▼] │   │
│  │ [Select model...                                     ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Receipt Printer                                          │   │
│  │ [Select brand...                                     ▼] │   │
│  │ [Select model...                                     ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Card Reader/Terminal                                     │   │
│  │ [Select brand...                                     ▼] │   │
│  │ [Select model...                                     ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Check Compatibility]                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Compatibility Results:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Hardware Compatibility Check                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ POS Tablet: iPad Pro 12.9" (2021) - Compatible       │   │
│  │  ✓ Printer: Star TSP143IIIU - Compatible                │   │
│  │  ⚠ Card Reader: Clover Mini - Not Compatible            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  You'll need to add:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Lightspeed Payments Card Reader                         │   │
│  │  $299                                        [Add to Cart]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Continue to Checkout]                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 6: Quote Review and Payment Checkout

```
┌─────────────────────────────────────────────────────────────────┐
│  Review and Complete Purchase                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 5 OF 10: Payment & Checkout                                │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ORDER SUMMARY                                           │   │
│  │                                                           │   │
│  │  Software Subscription                                   │   │
│  │  • Location Licenses (2) - $398/mo                       │   │
│  │  • Register Licenses (4) - $116/mo                       │   │
│  │  • First 3 months (50% off) - Save $257/mo              │   │
│  │    Subtotal: $514/mo (regular price after promo)        │   │
│  │                                                           │   │
│  │  Hardware                                                │   │
│  │  • Professional Bundle × 2 locations - $2,998            │   │
│  │    (iPad, receipt printer, card reader)                  │   │
│  │                                                           │   │
│  │  Optional Add-Ons                                        │   │
│  │  ☐ Implementation Package ($499)                         │   │
│  │     Dedicated onboarding specialist for data import      │   │
│  │     and hardware setup                                   │   │
│  │                                                           │   │
│  │  ────────────────────────────────────────────────────    │   │
│  │  Hardware Total (one-time):            $2,998            │   │
│  │  Monthly Subscription:                 $514/mo           │   │
│  │  First 3 months promotional:           $257/mo           │   │
│  │                                                           │   │
│  │  Payment Processing Rates                                │   │
│  │  2.6% + 10¢ per transaction (Visa, MC, Discover)        │   │
│  │  2.9% + 10¢ per transaction (Amex)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Payment Method                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 💳 Credit/Debit Card                                     │   │
│  │ [                                                     ]  │   │
│  │                                                           │   │
│  │ Card Number *                                            │   │
│  │ [                                                     ]  │   │
│  │                                                           │   │
│  │ ┌────────────────┬──────────────────┬──────────────┐   │   │
│  │ │ Expiry (MM/YY) │ CVV              │              │   │   │
│  │ │ [    /    ]    │ [           ]    │  [💳 Logo]   │   │   │
│  │ └────────────────┴──────────────────┴──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Billing Address                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑ Same as business address                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Shipping Address                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑ Same as billing address                               │   │
│  │                                                           │   │
│  │ [Edit Shipping Address]                                  │   │
│  │                                                           │   │
│  │ Estimated Delivery: October 15-17, 2025                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │ ☑ I agree to the Terms of Service and acknowledge      │     │
│  │   monthly subscription charges will begin immediately.  │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                   │
│  [← Back]                    [Complete Purchase - $2,998]        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Purchase Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Order Confirmed!                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎉 Welcome to Lightspeed!                               │   │
│  │                                                           │   │
│  │  Order #LS-2025-10-09-1234                               │   │
│  │                                                           │   │
│  │  ✓ Payment processed: $2,998                             │   │
│  │  ✓ Hardware shipping to: 123 Main St, Anytown, CA       │   │
│  │  ✓ Subscription active: $257/mo (first 3 months)        │   │
│  │                                                           │   │
│  │  📦 Estimated delivery: October 15-17, 2025              │   │
│  │  📧 Confirmation sent to: you@business.com               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  What's Next?                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. Complete payment verification (KYC) - Required       │   │
│  │     to start accepting payments                          │   │
│  │                                                           │   │
│  │  2. Import your data (products, customers, etc.)         │   │
│  │                                                           │   │
│  │  3. Set up hardware when it arrives                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Continue to Payment Verification →]                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 7: KYC Form (Business Representative + Owners)

```
┌─────────────────────────────────────────────────────────────────┐
│  Complete Payment Verification (KYC)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 6 OF 10: Payment Activation                                │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ℹ️  Why do we need this?                               │    │
│  │                                                         │    │
│  │ To protect your business and comply with regulations,  │    │
│  │ we need to verify the individuals associated with      │    │
│  │ your business. This enables payment processing and     │    │
│  │ payouts to your bank account.                          │    │
│  │                                                         │    │
│  │ Your information is encrypted and secure.              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Business Representative (Primary Contact)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Full Legal Name *                                        │   │
│  │ [                                                     ]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Date of Birth *                                          │   │
│  │ [MM] / [DD] / [YYYY]                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Social Security Number *                                 │   │
│  │ [   -  -    ]                                           │   │
│  │ 🔒 Encrypted and secure                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Home Address *                                           │   │
│  │ [                                                     ]  │   │
│  │ [                                                     ]  │   │
│  │ [City]            [State ▼]      [ZIP]                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Role/Title *                                             │   │
│  │ [Select...                                           ▼] │   │
│  │ Owner, CEO, CFO, etc.                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Business Owners (25% or more ownership)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Owner 1: John Doe (50%)                    [Edit]      │   │
│  │  Owner 2: Not added yet                     [+ Add]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [← Back]                          [Submit for Verification]     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Owner Details Form (Modal)

```
┌─────────────────────────────────────────────────────────────┐
│  Add Business Owner                                    [✕]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Full Legal Name *                                    │   │
│  │ [                                                 ]  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Email *                                              │   │
│  │ [                                                 ]  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Date of Birth *                                      │   │
│  │ [MM] / [DD] / [YYYY]                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Social Security Number *                             │   │
│  │ [   -  -    ]                                       │   │
│  │ 🔒 Encrypted and secure                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Home Address *                                       │   │
│  │ [                                                 ]  │   │
│  │ [                                                 ]  │   │
│  │ [City]        [State ▼]      [ZIP]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Ownership Percentage *                               │   │
│  │ [    ]%                                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Role/Title *                                         │   │
│  │ [Select...                                       ▼] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Cancel]                                     [Save Owner]   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### KYC Processing State

```
┌─────────────────────────────────────────────────────────────────┐
│  Verifying Payment Information...                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              [Loading Spinner Animation]                 │   │
│  │                                                           │   │
│  │  Running identity verification checks...                 │   │
│  │                                                           │   │
│  │  This usually takes 30-60 seconds.                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### KYC Success (Payments Activated, Payouts Pending)

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Payment Processing Activated!                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Identity Verified                                     │   │
│  │                                                           │   │
│  │  You can now accept credit card payments at all 2        │   │
│  │  locations. Payouts will be enabled after you connect    │   │
│  │  your bank account during hardware setup.                │   │
│  │                                                           │   │
│  │  📧 Confirmation sent to: you@business.com               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Location Payment Status                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Main Street Store - Payment processing enabled       │   │
│  │  ✓ Downtown Store - Payment processing enabled          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Next: Import your data while you wait for hardware              │
│  [Continue to Data Import →]                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 8: Data Import Wizard

### Import Options

```
┌─────────────────────────────────────────────────────────────────┐
│  Import Your Data                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 7 OF 10: Data Import                                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Bring your existing data into Lightspeed to hit the   │    │
│  │  ground running. Or start fresh - it's up to you!      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌───────────────────────┬───────────────────────────────┐     │
│  │  📦 Import Data       │  ✨ Start Fresh               │     │
│  │                       │                                │     │
│  │  Transfer products,   │  Start with a clean slate     │     │
│  │  customers, inventory,│  and build as you go.         │     │
│  │  and sales history.   │                                │     │
│  │                       │  You can always import         │     │
│  │  [Continue Import →]  │  data later.                   │     │
│  │                       │                                │     │
│  │                       │  [Skip for Now]                │     │
│  └───────────────────────┴───────────────────────────────┘     │
│                                                                   │
│  ────────────────────  OR  ────────────────────                 │
│                                                                   │
│  Need help with a complex migration?                             │
│  [Schedule Data Import Session with IC] (Included in Pro setup) │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Self-Serve Import Wizard (Step 1: Select Import Type)

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import Wizard - Step 1 of 4                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  What would you like to import?                                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑ Products (Required)                                   │   │
│  │    SKU, name, price, categories, variants, inventory     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑ Customers                                             │   │
│  │    Name, email, phone, purchase history                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑ Sales History                                         │   │
│  │    Past transactions for reporting (last 12 months)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☐ Vendors/Suppliers                                     │   │
│  │    Supplier contacts and purchase orders                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Cancel]                                              [Next →]  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Import Wizard (Step 2: Upload Files)

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import Wizard - Step 2 of 4                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Upload Your Files                                               │
│                                                                   │
│  Products                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📄 Drag and drop CSV file here, or click to browse     │   │
│  │                                                           │   │
│  │  [Download Template CSV]                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Customers                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ customers.csv uploaded (2,341 rows)      [Remove]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Sales History                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ sales_2024.csv uploaded (8,743 rows)     [Remove]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ℹ️  CSV files should use UTF-8 encoding. First row    │    │
│  │     should contain column headers.                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [← Back]                                              [Next →]  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Import Wizard (Step 3: Map Fields)

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import Wizard - Step 3 of 4                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Map Your Product Fields                                         │
│                                                                   │
│  Match your CSV columns to Lightspeed fields                     │
│                                                                   │
│  ┌───────────────────────────┬──────────────────────────────┐  │
│  │ Your Column               │ Lightspeed Field             │  │
│  ├───────────────────────────┼──────────────────────────────┤  │
│  │ product_name              │ [Product Name ▼]             │  │
│  │ sku_code                  │ [SKU ▼]                      │  │
│  │ price                     │ [Price ▼]                    │  │
│  │ category_name             │ [Category ▼]                 │  │
│  │ stock_count               │ [Inventory Quantity ▼]       │  │
│  │ brand                     │ [-- Skip this column --]     │  │
│  └───────────────────────────┴──────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ✓ Required fields mapped (5/5)                        │    │
│  │  ⚠ 1 optional field skipped                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [← Back]                                              [Next →]  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Import Wizard (Step 4: Review & Import)

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import Wizard - Step 4 of 4                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Review and Start Import                                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IMPORT SUMMARY                                          │   │
│  │                                                           │   │
│  │  ✓ Products:          1,247 items                        │   │
│  │  ✓ Customers:         2,341 customers                    │   │
│  │  ✓ Sales History:     8,743 transactions                 │   │
│  │                                                           │   │
│  │  Estimated import time: 5-10 minutes                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ℹ️  You can continue onboarding while the import runs  │    │
│  │     in the background. We'll email you when complete.   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [← Back to Edit]                        [Start Import →]        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Import In Progress

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import in Progress                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Importing your data...                                  │   │
│  │                                                           │   │
│  │  ✓ Products:     1,247 / 1,247  (100%)                   │   │
│  │  ▶ Customers:      847 / 2,341  (36%)                    │   │
│  │  ○ Sales:            0 / 8,743  (0%)                     │   │
│  │                                                           │   │
│  │  [████████░░░░░░░░] 45%                                  │   │
│  │                                                           │   │
│  │  Estimated time remaining: 6 minutes                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  You can safely leave this page. We'll email you when the       │
│  import completes.                                               │
│                                                                   │
│  [Continue to Hardware Setup]                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 9: Hardware Setup Guide Interface

### Hardware Delivery Notification

```
┌─────────────────────────────────────────────────────────────────┐
│  📦 Hardware Delivered!                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 8 OF 10: Hardware Setup                                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎉 Your hardware has arrived!                           │   │
│  │                                                           │   │
│  │  Tracking: Delivered Oct 15, 2025 at 2:34 PM            │   │
│  │                                                           │   │
│  │  Ready to set up your devices?                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Setup Checklist                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ○ 1. Unbox and connect hardware                         │   │
│  │  ○ 2. Configure payment terminal                         │   │
│  │  ○ 3. Connect receipt printer                            │   │
│  │  ○ 4. Run test transaction                               │   │
│  │  ○ 5. Connect bank account for payouts                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  Need Help?                                            │     │
│  │  • [📺 Watch Setup Videos]                             │     │
│  │  • [📄 Download Setup Guide PDF]                       │     │
│  │  • [💬 Chat with Support]                              │     │
│  │  • [📞 Schedule IC Setup Call] (Pro customers)         │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                   │
│  [Start Hardware Setup →]                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Hardware Setup: Step-by-Step Guide

```
┌─────────────────────────────────────────────────────────────────┐
│  Hardware Setup - Step 1 of 5                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Unbox and Connect Hardware                                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │         [Illustration/Photo of hardware]                 │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  1. Remove all items from the box:                               │
│     • iPad with stand                                            │
│     • Payment terminal (card reader)                             │
│     • Receipt printer                                            │
│     • Power adapters (3)                                         │
│     • USB cables (2)                                             │
│                                                                   │
│  2. Place the iPad on the stand and connect power                │
│                                                                   │
│  3. Plug in the payment terminal and receipt printer             │
│                                                                   │
│  4. Connect the terminal and printer to your iPad via Bluetooth  │
│     or USB (instructions in Settings → Devices)                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  💡 Tip: Charge all devices fully before first use     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [📺 Watch Video Guide]                                          │
│                                                                   │
│  [← Back]        [Skip This Step]           [Mark Complete →]   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Bank Account Connection (Critical Step)

```
┌─────────────────────────────────────────────────────────────────┐
│  Hardware Setup - Step 5 of 5                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Connect Your Bank Account for Payouts                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  💰 Almost there! To receive payment payouts, connect   │    │
│  │     your business bank account.                         │    │
│  │                                                          │    │
│  │  Payouts will be deposited within 1-2 business days     │    │
│  │  after each transaction.                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Account Holder Name *                                    │   │
│  │ [                                                     ]  │   │
│  │ Must match the name on your business bank account       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Bank Name *                                              │   │
│  │ [Select...                                           ▼] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Account Number *                                         │   │
│  │ [                                                     ]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Routing Number *                                         │   │
│  │ [                                                     ]  │   │
│  │ 9-digit number (found on your checks)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Account Type *                                           │   │
│  │ ○ Checking    ○ Savings                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  🔒 Your bank details are encrypted and secure          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [← Back]                           [Verify Bank Account →]     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Bank Verification in Progress

```
┌─────────────────────────────────────────────────────────────────┐
│  Verifying Bank Account...                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              [Loading Spinner Animation]                 │   │
│  │                                                           │   │
│  │  Connecting to your bank to verify account details...    │   │
│  │                                                           │   │
│  │  This usually takes 10-30 seconds.                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Payouts Enabled Success

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Payouts Enabled!                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎉 You're all set!                                      │   │
│  │                                                           │   │
│  │  ✓ Bank account verified: **** **** 1234                 │   │
│  │  ✓ Payouts enabled for all locations                     │   │
│  │                                                           │   │
│  │  You can now accept payments and receive payouts!        │   │
│  │                                                           │   │
│  │  Payouts arrive in 1-2 business days after each          │   │
│  │  transaction.                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Continue to Final Setup Steps →]                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 10: Integration Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│  Final Setup & Integrations                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STEP 9 OF 10: Integrations & Features                           │
│                                                                   │
│  Enhance your Lightspeed experience with integrations            │
│                                                                   │
│  Popular Integrations                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🛒 eCommerce                                            │   │
│  │     Sync your online store with POS inventory           │   │
│  │                                                           │   │
│  │     ○ Not connected          [Connect eCommerce →]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 Accounting                                           │   │
│  │     QuickBooks, Xero, or other accounting software      │   │
│  │                                                           │   │
│  │     ○ Not connected          [Connect Accounting →]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📧 Email Marketing                                      │   │
│  │     Mailchimp, Klaviyo for customer campaigns           │   │
│  │                                                           │   │
│  │     ○ Not connected          [Connect Marketing →]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📦 NuOrder (B2B)                                        │   │
│  │     Wholesale ordering platform integration             │   │
│  │                                                           │   │
│  │     ○ Not connected          [Connect NuOrder →]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Additional Features                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☐ Set up employee accounts and permissions             │   │
│  │  ☐ Configure tax rates for your locations               │   │
│  │  ☐ Customize receipt templates                          │   │
│  │  ☐ Set up loyalty program                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Skip for Now]                       [Complete Onboarding →]   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Onboarding Complete Celebration

```
┌─────────────────────────────────────────────────────────────────┐
│  🎉 Welcome to Lightspeed!                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │         [Confetti Animation or Celebration Graphic]      │   │
│  │                                                           │   │
│  │  Congratulations! Your account is fully set up and       │   │
│  │  ready to go.                                            │   │
│  │                                                           │   │
│  │  ✓ Software configured (2 locations, 4 registers)        │   │
│  │  ✓ Hardware set up and connected                         │   │
│  │  ✓ Payment processing enabled                            │   │
│  │  ✓ Payouts active (**** 1234)                            │   │
│  │  ✓ 1,247 products imported                               │   │
│  │  ✓ 2,341 customers imported                              │   │
│  │                                                           │   │
│  │  You're ready to start selling!                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  What's Next?                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  • Train your staff on the POS system                    │   │
│  │  • Customize your product categories and pricing         │   │
│  │  • Set up your first promotion or discount               │   │
│  │  • Explore reporting and analytics                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Take a Tour of Your Dashboard]    [Start Selling →]           │
│                                                                   │
│  Need help? Our support team is here 24/7                        │
│  [📞 Contact Support]  [📚 Help Center]  [💬 Live Chat]         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Loading, Error, and Empty States

### Global Loading State

```
┌─────────────────────────────────────────────────────────────────┐
│  Loading...                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │            [Animated Spinner - Primary 500]              │   │
│  │                                                           │   │
│  │            Loading your dashboard...                     │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Form Validation Error

```
┌─────────────────────────────────────────────────────────────────┐
│  Email Address *                                                 │
│  [john@example                                               ]   │
│  ✕ Please enter a valid email address                            │
└─────────────────────────────────────────────────────────────────┘
(Input field has Error 500 border, error text in Error 700)
```

### System Error State

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Something Went Wrong                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⚠ Unable to Save Your Information                       │   │
│  │                                                           │   │
│  │  We encountered an error while saving your progress.     │   │
│  │  Please try again in a moment.                           │   │
│  │                                                           │   │
│  │  Error Code: ERR_500_INTERNAL                            │   │
│  │                                                           │   │
│  │  If this problem persists, please contact support.       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Try Again]                          [Contact Support]          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Empty State (No Data Imported)

```
┌─────────────────────────────────────────────────────────────────┐
│  Products                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │              [Empty state illustration - boxes]          │   │
│  │                                                           │   │
│  │  No products yet                                         │   │
│  │                                                           │   │
│  │  Start by importing your existing products or add        │   │
│  │  your first product manually.                            │   │
│  │                                                           │   │
│  │  [Import Products]      [Add Product Manually]           │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mobile-Responsive Layouts

### Mobile Progress Indicator (Collapsed)

```
┌──────────────────────────────┐
│  Onboarding Progress         │
│  Step 4 of 10 (40%) [▼]      │
└──────────────────────────────┘
```

### Mobile Progress Indicator (Expanded)

```
┌──────────────────────────────┐
│  Onboarding Progress         │
│  Step 4 of 10 (40%) [▲]      │
├──────────────────────────────┤
│  ✓ 1. Create Account         │
│  ✓ 2. Business Verification  │
│  ✓ 3. Software Setup         │
│  ● 4. Hardware Selection     │
│  ○ 5. Payment & Checkout     │
│  ○ 6. KYC Verification       │
│  ○ 7. Data Import            │
│  ○ 8. Hardware Setup         │
│  ○ 9. Integrations           │
│  ○ 10. Final Review          │
└──────────────────────────────┘
```

### Mobile Form Layout (Single Column)

```
┌──────────────────────────────┐
│  Hardware Selection          │
├──────────────────────────────┤
│                              │
│  STARTER BUNDLE              │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │  [Hardware Image]   │    │
│  │                     │    │
│  │  Best for new stores│    │
│  │                     │    │
│  │  • POS Tablet       │    │
│  │  • Receipt Printer  │    │
│  │                     │    │
│  │  $899 /location     │    │
│  │                     │    │
│  │  [Select Bundle]    │    │
│  └─────────────────────┘    │
│                              │
│  PROFESSIONAL BUNDLE         │
│  ┌─────────────────────┐    │
│  │  [View Details]     │    │
│  └─────────────────────┘    │
│                              │
│  ENTERPRISE BUNDLE           │
│  ┌─────────────────────┐    │
│  │  [View Details]     │    │
│  └─────────────────────┘    │
│                              │
└──────────────────────────────┘
│ [Continue] (Sticky Footer)   │
└──────────────────────────────┘
```

---

## Help Text and Support Access

### Inline Help (Tooltip Pattern)

```
┌─────────────────────────────────────────────────────────────────┐
│  Employer Identification Number (EIN) * [?]                      │
│  [                                                            ]  │
│                                                                   │
│  (On hover of [?] icon)                                          │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  What's an EIN?                                        │     │
│  │                                                         │     │
│  │  A 9-digit tax ID number assigned by the IRS to your  │     │
│  │  business. Format: 12-3456789                          │     │
│  │                                                         │     │
│  │  [Learn more →]                                        │     │
│  └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Contextual Help Panel (Sidebar)

```
┌─────────────┬───────────────────────────────────────────────────┐
│             │                                                    │
│  MAIN       │  ┌──────────────────────────────────────────┐    │
│  FORM       │  │  💡 Need Help?                           │    │
│  AREA       │  │                                          │    │
│             │  │  Common Questions:                       │    │
│             │  │                                          │    │
│             │  │  • What if I don't have an EIN?          │    │
│             │  │  • How long does verification take?      │    │
│             │  │  • What if my business is rejected?      │    │
│             │  │                                          │    │
│             │  │  [View Full Help Guide →]                │    │
│             │  │                                          │    │
│             │  │  Still stuck?                            │    │
│             │  │  [💬 Chat with Support]                  │    │
│             │  │  [📞 Request a Call]                     │    │
│             │  └──────────────────────────────────────────┘    │
└─────────────┴───────────────────────────────────────────────────┘
```

### Support Widget (Global Access)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                          [?] Help │
│                                                                    │
│  (Fixed position bottom-right)                                    │
│                                                                    │
│                                            ┌─────────────────┐   │
│                                            │  💬 Need Help?  │   │
│                                            │                 │   │
│                                            │  [Live Chat]    │   │
│                                            │  [Help Center]  │   │
│                                            │  [Call Support] │   │
│                                            └─────────────────┘   │
│                                                        [✕ Close]  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Success State Patterns

### Micro-Success (Field Validation)

```
┌─────────────────────────────────────────────────────────────────┐
│  Email Address *                                                 │
│  [john@example.com                                           ] ✓ │
│  ✓ Valid email address                                           │
└─────────────────────────────────────────────────────────────────┘
(Checkmark in Success 500, validation text in Success 700)
```

### Milestone Celebration (Step Complete)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │         [Animated checkmark or confetti burst]           │   │
│  │                                                           │   │
│  │  ✓ Hardware Ordered!                                     │   │
│  │                                                           │   │
│  │  Your hardware will arrive in 2-3 business days.         │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  (Auto-dismisses after 3 seconds, or [Continue →])               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Document Status

**Status:** Phase 1 Wireframes Complete
**Next Steps:**
- Developer review for technical feasibility
- High-fidelity mockups in Figma
- Interactive prototype for user testing

**Related Documents:**
- `design-system.md` - Visual design specifications
- `ae-ic-dashboard-wireframes.md` - Admin interfaces
- `flow-variations.md` - Path-specific differences
- `interaction-patterns.md` - Detailed UX behaviors
- `accessibility.md` - Accessibility requirements

**Owner:** Design Lead, Merchant Onboarding