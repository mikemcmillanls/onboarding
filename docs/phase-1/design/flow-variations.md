# Flow Variations by Cohort
## Path-Specific Design Differences

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Phase 1 Specifications

---

## Overview

This document defines how the onboarding experience differs across three merchant cohorts:
- **Self-Serve** (GTV < $500K, 1-3 locations)
- **Assisted** (GTV $500K-$2M, 3-10 locations)
- **Managed** (GTV $2M+, 10+ locations)

**Key Differentiators:**
- **Level of automation** - Self-serve is fully automated, Managed is high-touch
- **Support access** - Self-serve gets self-help, Managed gets dedicated IC
- **Pricing flexibility** - Self-serve gets standard pricing, Managed gets custom quotes
- **Timeline expectations** - Self-serve can complete in hours, Managed may take weeks

---

## Cohort Assignment Logic

### Initial Routing (Step 2: Account Creation)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  COHORT ASSIGNMENT ALGORITHM                                             │
│                                                                           │
│  Input Signals:                                                          │
│  • Annual Revenue (selected by merchant)                                 │
│  • Price Bracket (from marketing site)                                   │
│  • Business Category (restaurant, retail, golf, etc.)                    │
│  • Number of Locations (if asked early)                                  │
│                                                                           │
│  Decision Tree:                                                          │
│                                                                           │
│  IF Annual Revenue < $500K                                               │
│    → Assign: Self-Serve Selling Plan                                     │
│    → Route: Directly to Step 3 (KYB)                                     │
│    → Setup Plan: Self-serve guides with optional IC upgrade              │
│                                                                           │
│  IF Annual Revenue >= $500K AND < $2M                                    │
│    → Assign: Assisted Selling Plan                                       │
│    → Route: Offer AE call (optional, can self-serve)                     │
│    → Setup Plan: Free IC support included                                │
│                                                                           │
│  IF Annual Revenue >= $2M                                                │
│    → Assign: Managed Selling Plan                                        │
│    → Route: Require AE call (block self-serve purchase)                  │
│    → Setup Plan: Paid implementation package (required)                  │
│                                                                           │
│  Override Conditions:                                                    │
│  • High-value verticals (Golf, Multi-location restaurants): Bump to      │
│    Assisted even if revenue < $500K                                      │
│  • Express interest in B2B/NuOrder: Bump to Assisted                     │
│  • 10+ locations regardless of GTV: Assign Managed                       │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Path Comparison Matrix

| Feature | Self-Serve | Assisted | Managed |
|---------|-----------|----------|---------|
| **Selling Plan** | Automated | Hybrid (AE optional) | AE-driven |
| **Pricing** | Standard, transparent | Minor discounts | Custom negotiated |
| **Quote Approval** | Instant | Self-approve or AE-assisted | AE finalizes |
| **Payment** | Self-checkout | Self-checkout | Self-checkout (after AE quote) |
| **IC Support** | Optional (paid upgrade) | Free (reactive) | Included (proactive) |
| **Data Import** | Self-serve wizard | Wizard + IC option | IC-assisted (dedicated session) |
| **Hardware Setup** | Self-guided | Self-guided + IC on-demand | IC-scheduled sessions |
| **Integrations** | Self-guided | Self-guided + IC support | IC-configured |
| **Timeline** | Days (fast) | 1-2 weeks (medium) | 2-4 weeks (thorough) |
| **Communication** | Email, in-app | Email, in-app, phone | Dedicated Slack/email, scheduled calls |

---

## Step-by-Step Flow Variations

## STEP 2: Account Creation

### All Paths (Identical Experience)
- Same form fields
- Same validation rules
- Same KYB pre-qualification

### Divergence Point: After Account Creation

**Self-Serve Path:**
```
Create Account → Proceed to Step 3 (KYB) immediately
```

**Assisted Path:**
```
Create Account → See modal:
┌───────────────────────────────────────────────┐
│  Great News!                                   │
│                                                │
│  Based on your business size, you qualify for │
│  personalized support from an Account         │
│  Executive at no extra cost.                  │
│                                                │
│  [Schedule Call with AE]                       │
│  [Continue On My Own]                          │
│                                                │
└───────────────────────────────────────────────┘
```

**Managed Path:**
```
Create Account → See mandatory AE scheduling:
┌───────────────────────────────────────────────┐
│  Welcome to Lightspeed Enterprise!            │
│                                                │
│  Your business qualifies for our white-glove  │
│  onboarding experience.                       │
│                                                │
│  An Account Executive will call you within    │
│  15 minutes to discuss your custom solution.  │
│                                                │
│  [I'm Ready] [Schedule for Later]             │
│                                                │
│  (Cannot proceed without AE contact)           │
└───────────────────────────────────────────────┘
```

---

## STEP 4: Software Requirements

### Self-Serve Path: Fully Automated

```
┌─────────────────────────────────────────────────────────────────┐
│  Configure Your Software                                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Recommended for your business:                        │    │
│  │  2 locations, 1 register each                          │    │
│  │  $456/mo (first 3 months: $228/mo)                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Locations: [- 2 +]                                              │
│  Registers per location: [- 1 +]                                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  PRICING BREAKDOWN                                      │    │
│  │  Location Licenses: $199/mo × 2 = $398/mo             │    │
│  │  Register Licenses: $29/mo × 2 = $58/mo               │    │
│  │  First 3 months (50% off): $228/mo                     │    │
│  │  Regular price after: $456/mo                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Continue to Hardware Selection →]                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- Transparent pricing displayed immediately
- Simple quantity selectors
- Promotional pricing clearly shown
- No discount customization
- Instant progression to next step

---

### Assisted Path: Hybrid (Self-Serve or AE-Assisted)

**Option 1: Merchant continues self-serve (declined AE call)**
- Same UI as Self-Serve path
- Standard pricing with minor volume discount (10% for 5+ locations)
- Option to "Request Custom Quote" button available

**Option 2: Merchant accepts AE call**
```
┌─────────────────────────────────────────────────────────────────┐
│  Building Your Quote with Sarah (AE)                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  📞 Live with Sarah Johnson                            │    │
│  │  You're viewing the same quote Sarah is building       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  CUSTOM QUOTE (DRAFT)                                   │    │
│  │                                                          │    │
│  │  Location Licenses: $199/mo × 5 = $995/mo              │    │
│  │  Volume discount (10%): -$99/mo                         │    │
│  │  Register Licenses: $29/mo × 10 = $290/mo              │    │
│  │  ──────────────────────────────────────                │    │
│  │  Monthly Total: $1,186/mo                               │    │
│  │                                                          │    │
│  │  🎯 Switch to annual billing: Save $2,845/year          │    │
│  │                                                          │    │
│  │  (AE is updating this quote...)                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Approve Quote]  [Request Changes]  [Send to Email]             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- Real-time quote sync between AE dashboard and merchant view
- Merchant sees quote updates as AE builds
- Can approve immediately or request via email for offline review
- Merchant maintains control (can approve without AE)

---

### Managed Path: AE-Driven (Quote Sent via Email)

**During AE Call:**
- AE builds quote in their dashboard
- Merchant does NOT see live quote (discussion-focused call)
- AE explains pricing verbally, negotiates terms

**After AE Call:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Quote Ready for Review                                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ✓ Your custom quote is ready!                         │    │
│  │                                                          │    │
│  │  Sarah Johnson sent you a quote for:                    │    │
│  │  10 locations, 25 registers, Enterprise features        │    │
│  │                                                          │    │
│  │  Quote sent to: john@acmeretail.com                     │    │
│  │  Valid until: November 8, 2025                          │    │
│  │                                                          │    │
│  │  [View Quote in Email] [View in Dashboard]              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  [Contact Sarah] [Review Quote →]                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Quote Review Page (After Email Link Click):**
```
┌─────────────────────────────────────────────────────────────────┐
│  Custom Quote from Sarah Johnson                                 │
│  Valid until: November 8, 2025                                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  ENTERPRISE QUOTE                                       │    │
│  │                                                          │    │
│  │  Software Subscription:                                 │    │
│  │  • Location Licenses (10): $1,990/mo                    │    │
│  │  • Enterprise discount (20%): -$398/mo                  │    │
│  │  • Register Licenses (25): $725/mo                      │    │
│  │  • Volume discount (15%): -$109/mo                      │    │
│  │  ──────────────────────────────────────                │    │
│  │  Monthly Subscription Total: $2,208/mo                  │    │
│  │  Annual (prepaid, save 20%): $21,197/year               │    │
│  │                                                          │    │
│  │  Hardware (one-time):                                   │    │
│  │  • Enterprise Bundle × 10: $18,990                      │    │
│  │  • Volume discount: -$2,000                             │    │
│  │  ──────────────────────────────────────                │    │
│  │  Hardware Total: $16,990                                │    │
│  │                                                          │    │
│  │  Implementation Package: $2,499 (included)              │    │
│  │  • Dedicated IC for all locations                       │    │
│  │  • Full data migration                                  │    │
│  │  • On-site training (optional)                          │    │
│  │                                                          │    │
│  │  Payment Processing:                                    │    │
│  │  • Custom rate: 2.3% + 10¢ (negotiated)                │    │
│  │                                                          │    │
│  │  ══════════════════════════════════════                │    │
│  │  TOTAL DUE TODAY: $16,990                               │    │
│  │  MONTHLY: $2,208/mo (or $21,197/year)                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Questions about this quote?                                     │
│  [📞 Call Sarah] [📧 Email Sarah] [💬 Live Chat]                │
│                                                                   │
│  Ready to proceed?                                               │
│  [Approve and Continue to Payment →]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- Quote finalized offline (not live-edited with merchant)
- Sent via professional PDF + in-dashboard view
- Higher discounts and custom rates
- Implementation package included (not optional)
- Clear validity period (creates urgency)

---

## STEP 5: Hardware Requirements

### Self-Serve Path: Bundle Picker

```
┌─────────────────────────────────────────────────────────────────┐
│  Choose Your Hardware                                            │
│                                                                   │
│  Select a pre-configured bundle for fast setup:                  │
│                                                                   │
│  [Starter $899] [Professional $1,499 ★] [Enterprise $2,299]     │
│                                                                   │
│  Or verify your existing hardware:                               │
│  [I Have Compatible Hardware]                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- 3 fixed bundles only
- Cannot customize bundle contents
- Clear recommendation (star badge)
- Option to skip hardware if already owned

---

### Assisted Path: Bundle Picker + Customization

```
┌─────────────────────────────────────────────────────────────────┐
│  Choose Your Hardware                                            │
│                                                                   │
│  Select a bundle or customize:                                   │
│                                                                   │
│  [Starter $899] [Professional $1,499 ★] [Enterprise $2,299]     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Want to customize your hardware?                       │    │
│  │  [Build Custom Package] or [Talk to AE]                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Already have hardware?                                          │
│  [Verify Compatibility]                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Same 3 bundles as Self-Serve
- Option to customize (add/remove items)
- "Talk to AE" escalation available
- More flexibility than Self-Serve

---

### Managed Path: Custom Hardware Configuration (AE-Built)

```
┌─────────────────────────────────────────────────────────────────┐
│  Review Hardware Configuration                                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Sarah configured this hardware package for you:        │    │
│  │                                                          │    │
│  │  Enterprise Bundle × 10 locations:                      │    │
│  │  • iPad Pro 12.9" with stand (10)                       │    │
│  │  • Star TSP143 receipt printer (10)                     │    │
│  │  • Lightspeed card reader (10)                          │    │
│  │  • Customer display (10)                                │    │
│  │  • Barcode scanner (10)                                 │    │
│  │  • Cash drawer (8) - Not needed for 2 locations         │    │
│  │                                                          │    │
│  │  Subtotal: $18,990                                      │    │
│  │  Volume discount: -$2,000                               │    │
│  │  Total: $16,990                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Need changes to this configuration?                             │
│  [Contact Sarah] [Request Modifications]                         │
│                                                                   │
│  [Approve Hardware →]                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Pre-configured by AE (not merchant-selected)
- Line-item breakdown (not bundle view)
- Customized per location (different quantities)
- Higher-end hardware options available
- Approval flow (not selection flow)

---

## STEP 6: Payment & Checkout

### All Paths: Same Checkout Experience

**Key Similarity:**
All cohorts use the same payment form and checkout flow once quote is finalized.

**Minor Differences:**

**Self-Serve:**
- Standard pricing, promotional discount auto-applied
- Optional add-ons: Implementation package (paid upgrade)

**Assisted:**
- Volume discounts reflected in quote
- Optional add-ons: Implementation package (free or discounted)

**Managed:**
- Custom pricing from AE quote
- Implementation package included (cannot remove)
- Extended payment terms available (e.g., net-30 for enterprise)

---

## STEP 7: KYC (Payments Activation)

### All Paths: Identical KYC Experience

No differences across cohorts. All merchants:
- Complete KYC form (business rep + owners)
- Undergo same identity verification checks
- Experience same approval/review/rejection flows

**Rationale:** Compliance and risk requirements are universal, regardless of merchant size.

---

## STEP 8: Data Import

### Self-Serve Path: Self-Guided Wizard

```
┌─────────────────────────────────────────────────────────────────┐
│  Import Your Data                                                │
│                                                                   │
│  [📦 Start Import Wizard] [✨ Start Fresh]                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  💡 Tip: Our wizard makes it easy to import your data  │    │
│  │     Follow the step-by-step guide, or watch a video.   │    │
│  │     [Watch Tutorial Video]                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Stuck? Upgrade to get IC help with data migration:              │
│  [Add IC Data Import Session - $299]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Fully self-service wizard
- Video tutorials and help docs
- Can upgrade to paid IC support
- No proactive IC outreach

---

### Assisted Path: Wizard + Reactive IC Support

```
┌─────────────────────────────────────────────────────────────────┐
│  Import Your Data                                                │
│                                                                   │
│  [📦 Start Import Wizard] [✨ Start Fresh]                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Need help? Free IC support is included!               │    │
│  │  [Schedule Data Import Session] (No charge)            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Prefer to do it yourself? Use our wizard:                       │
│  [Start Self-Guided Import]                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Same wizard as Self-Serve
- Free IC support available (merchant must initiate)
- Scheduling interface for IC sessions
- IC reacts to merchant requests (not proactive)

---

### Managed Path: IC-Assisted (Proactive)

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Import with Your IC                                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  👤 Mike Chen is your Implementation Consultant         │    │
│  │     Mike will guide you through data migration.         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  📅 Data Import Session Scheduled                       │    │
│  │     Thursday, Oct 10 at 10:00 AM PT                     │    │
│  │     Duration: 90 minutes                                │    │
│  │     [Join Video Call] [Add to Calendar]                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Preparation:                                                    │
│  ☐ Export your product list (CSV)                               │
│  ☐ Export customer database (CSV)                               │
│  ☐ Export sales history (last 12 months)                        │
│                                                                   │
│  [Upload Files Now] [Email Files to Mike]                        │
│                                                                   │
│  [Reschedule Session] [Contact Mike]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Session pre-scheduled by IC (proactive outreach)
- Dedicated IC assigned by name
- IC performs import (not merchant)
- Preparation checklist provided
- Higher touch, concierge experience

---

## STEP 9: Hardware Setup

### Self-Serve Path: Self-Guided Instructions

```
┌─────────────────────────────────────────────────────────────────┐
│  Set Up Your Hardware                                            │
│                                                                   │
│  Follow our step-by-step guide:                                  │
│                                                                   │
│  [Start Setup Guide] [📺 Watch Video Tutorial]                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Setup Checklist:                                       │    │
│  │  ○ 1. Unbox and connect hardware                       │    │
│  │  ○ 2. Configure payment terminal                       │    │
│  │  ○ 3. Connect receipt printer                          │    │
│  │  ○ 4. Run test transaction                             │    │
│  │  ○ 5. Connect bank account                             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Stuck? Get help:                                                │
│  [💬 Live Chat] [📞 Call Support] [📧 Email Support]            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- In-product step-by-step guide
- Video walkthroughs
- Reactive support (merchant initiates)
- Self-paced

---

### Assisted Path: Self-Guided + On-Demand IC

```
┌─────────────────────────────────────────────────────────────────┐
│  Set Up Your Hardware                                            │
│                                                                   │
│  [Start Self-Guided Setup] or [Schedule IC Session]              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Setup Checklist:                                       │    │
│  │  ○ 1. Unbox and connect hardware                       │    │
│  │  ○ 2. Configure payment terminal                       │    │
│  │  ○ 3. Connect receipt printer                          │    │
│  │  ○ 4. Run test transaction                             │    │
│  │  ○ 5. Connect bank account                             │    │
│  │                                                          │    │
│  │  Need help? Free IC support available!                 │    │
│  │  [Schedule Session] [Call IC]                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Same guide as Self-Serve
- Option to schedule IC session (free)
- Merchant chooses self-guided or IC-assisted
- IC available but not proactive

---

### Managed Path: IC-Scheduled Sessions

```
┌─────────────────────────────────────────────────────────────────┐
│  Hardware Setup with Mike Chen (IC)                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  📅 Setup Sessions Scheduled                            │    │
│  │                                                          │    │
│  │  Session 1: Location 1-5 Setup                         │    │
│  │  Monday, Oct 14 at 9:00 AM PT (2 hours)                │    │
│  │  [Join Video Call]                                      │    │
│  │                                                          │    │
│  │  Session 2: Location 6-10 Setup                        │    │
│  │  Tuesday, Oct 15 at 9:00 AM PT (2 hours)               │    │
│  │  [Add to Calendar]                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Mike will guide you through:                                    │
│  • Unboxing and connecting all devices                           │
│  • Configuring payment terminals                                │
│  • Running test transactions                                     │
│  • Connecting bank accounts                                      │
│  • Troubleshooting any issues                                    │
│                                                                   │
│  [Contact Mike] [View Full Schedule]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- IC proactively schedules multi-session setup
- Longer sessions (2 hours vs. 1 hour)
- Multi-location batching
- IC drives the schedule (not merchant-initiated)
- White-glove experience

---

## STEP 10: Integrations & Final Configuration

### Self-Serve Path: Self-Guided

```
┌─────────────────────────────────────────────────────────────────┐
│  Connect Your Integrations                                       │
│                                                                   │
│  [🛒 eCommerce] [📊 Accounting] [📧 Email Marketing] [📦 B2B]   │
│                                                                   │
│  Each integration has a setup guide:                             │
│  [View All Integrations →]                                       │
│                                                                   │
│  [Skip for Now] [Complete Onboarding →]                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Assisted Path: Self-Guided + IC Support

```
┌─────────────────────────────────────────────────────────────────┐
│  Connect Your Integrations                                       │
│                                                                   │
│  [🛒 eCommerce] [📊 Accounting] [📧 Email Marketing] [📦 B2B]   │
│                                                                   │
│  Need help connecting integrations?                              │
│  [Schedule IC Session] (Free)                                    │
│                                                                   │
│  [Skip for Now] [Complete Onboarding →]                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Managed Path: IC-Configured

```
┌─────────────────────────────────────────────────────────────────┐
│  Integration Setup with Mike Chen (IC)                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  📅 Integration Setup Session                           │    │
│  │     Wednesday, Oct 16 at 10:00 AM PT (90 min)          │    │
│  │     [Join Video Call]                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Mike will configure:                                            │
│  ☑ Lightspeed eCommerce sync                                    │
│  ☑ QuickBooks Online integration                                │
│  ☑ Mailchimp customer sync                                      │
│  ○ NuOrder B2B platform (optional)                              │
│                                                                   │
│  Preparation: Have your account credentials ready                │
│                                                                   │
│  [Contact Mike] [Add More Integrations]                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Visual Differentiation Between Paths

### Cohort Badges (Always Visible)

Displayed in merchant dashboard sidebar and admin views:

```
Self-Serve:
┌─────────────────┐
│ 🟦 SELF-SERVE   │
└─────────────────┘

Assisted:
┌─────────────────┐
│ 🟨 ASSISTED     │
└─────────────────┘

Managed:
┌─────────────────┐
│ 🟪 MANAGED      │
└─────────────────┘
```

**Badge Colors:**
- Self-Serve: Blue (Primary 500)
- Assisted: Amber (Warning 500)
- Managed: Purple (custom color: #7C3AED)

---

### Support Widget Differences

**Self-Serve:**
```
┌─────────────────────┐
│  Need Help?         │
│  [📚 Help Center]   │
│  [💬 Live Chat]     │
│  [📧 Email Support] │
└─────────────────────┘
```

**Assisted:**
```
┌─────────────────────┐
│  Need Help?         │
│  [📚 Help Center]   │
│  [💬 Live Chat]     │
│  [📞 Call Support]  │
│  [📅 Schedule IC]   │
└─────────────────────┘
```

**Managed:**
```
┌─────────────────────────────┐
│  Your Support Team          │
│  👤 AE: Sarah Johnson       │
│     [📞 Call] [📧 Email]    │
│  👤 IC: Mike Chen           │
│     [📞 Call] [📧 Email]    │
│  [📅 View Schedule]         │
└─────────────────────────────┘
```

---

## Transition Points: Upgrading Cohorts

### Self-Serve → Assisted

**Trigger:** Merchant clicks "Talk to Expert" or "Get Help"

```
┌───────────────────────────────────────────────┐
│  Upgrade to Assisted Onboarding?              │
│                                                │
│  Get personalized support from an Account     │
│  Executive and Implementation Consultant.     │
│                                                │
│  Benefits:                                     │
│  • Free IC support for setup                  │
│  • Custom pricing and discounts               │
│  • Priority phone support                     │
│                                                │
│  [Schedule Call with AE] [Maybe Later]        │
│                                                │
└───────────────────────────────────────────────┘
```

**Result:** Merchant remains in current step, AE is notified and assigned.

---

### Assisted → Managed

**Trigger:** AE identifies high complexity or GTV potential

**Action:** AE manually upgrades merchant cohort in admin dashboard

```
┌───────────────────────────────────────────────┐
│  Upgrade to Managed Onboarding?               │
│                                                │
│  Reason: [High GTV potential ▼]               │
│                                                │
│  This will:                                    │
│  • Assign dedicated IC (proactive support)    │
│  • Include paid implementation package        │
│  • Enable custom payment rates                │
│                                                │
│  [Confirm Upgrade] [Cancel]                   │
│                                                │
└───────────────────────────────────────────────┘
```

**Merchant Notification:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ✨ Your Onboarding Experience Has Been Upgraded!               │
│                                                                   │
│  Based on your needs, we've assigned you a dedicated             │
│  Implementation Consultant at no extra charge.                   │
│                                                                   │
│  Mike Chen will reach out shortly to schedule your setup         │
│  sessions.                                                       │
│                                                                   │
│  [Learn More] [Contact Mike]                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Timeline Expectations by Cohort

### Self-Serve Timeline

```
Day 1:
• Account creation → KYB → Software setup → Hardware selection → Checkout
  (Can complete in 30-60 minutes)

Days 2-3:
• Hardware delivery

Day 3:
• KYC verification while waiting for hardware

Days 4-5:
• Hardware setup (self-guided, 1-2 hours)
• Data import (optional, 30 min - 2 hours)
• Bank account connection

Day 6:
• Final integrations and configuration

Total: 6-7 days to fully operational
```

---

### Assisted Timeline

```
Day 1:
• Account creation → KYB → Optional AE call

Days 1-3:
• AE builds quote, merchant reviews and approves
• Checkout and purchase

Days 4-6:
• Hardware delivery

Day 7:
• KYC verification

Days 8-10:
• Schedule IC session for data import
• Self-guided hardware setup or IC session

Days 11-14:
• Final integrations with IC support

Total: 10-14 days to fully operational
```

---

### Managed Timeline

```
Week 1:
• Day 1: Account creation → KYB → AE call scheduled
• Days 2-3: AE discovery call, quote building
• Days 4-7: Quote negotiation, approval, checkout

Week 2:
• Days 8-10: Hardware delivery
• Day 11: KYC verification
• IC schedules data import session

Week 3:
• Days 15-17: Data import session with IC
• Days 18-19: Hardware setup sessions with IC (multi-location)

Week 4:
• Days 22-24: Integration configuration sessions with IC
• Days 25-28: Final testing, go-live preparation

Total: 3-4 weeks to fully operational
```

---

## Communication Cadence by Cohort

### Self-Serve

**Email:**
- Welcome email (immediate)
- Order confirmation (after purchase)
- Hardware shipped notification (day 2-3)
- Hardware delivered notification (day 4-5)
- Onboarding tips series (every 2 days)

**In-App:**
- Real-time progress updates
- Contextual help tips
- Celebration toasts on milestone completion

**Proactive Outreach:**
- None (unless merchant requests help)

---

### Assisted

**Email:**
- All Self-Serve emails plus:
- AE introduction email (day 1)
- Quote sent notification (day 2-3)
- IC introduction email (after purchase)

**Phone:**
- AE call (optional, day 1-2)
- IC follow-up call if stalled (day 10+)

**In-App:**
- Same as Self-Serve plus:
- IC session reminders
- Option to schedule IC sessions

---

### Managed

**Email:**
- Welcome email with AE assignment (immediate)
- AE meeting confirmation (day 1)
- Quote sent (day 4-7)
- IC introduction email (after purchase)
- Session invitations (calendar invites)

**Phone:**
- AE discovery call (day 1-2, required)
- AE follow-up call (day 4-5)
- IC kick-off call (week 2)

**Dedicated Communication:**
- Slack channel or dedicated email thread
- Weekly status updates
- Proactive check-ins at each milestone

---

## Self-Service Upgrade Prompts

### When to Offer Upgrades

**Self-Serve → Assisted Prompts:**

1. **Stuck on data import for 24 hours:**
```
┌────────────────────────────────────────────────┐
│  Need help with data import?                   │
│  Talk to an expert - free for your business.   │
│  [Schedule IC Session] [Continue On My Own]    │
└────────────────────────────────────────────────┘
```

2. **Hardware setup abandoned for 48 hours:**
```
┌────────────────────────────────────────────────┐
│  Having trouble with hardware setup?           │
│  Our team can guide you through it.            │
│  [Get Help] [I'll Figure It Out]               │
└────────────────────────────────────────────────┘
```

3. **Clicked help > 3 times in one session:**
```
┌────────────────────────────────────────────────┐
│  Looks like you could use some help!           │
│  Want to speak with a specialist?              │
│  [Yes, Call Me] [No Thanks]                    │
└────────────────────────────────────────────────┘
```

---

## Document Status

**Status:** Phase 1 Flow Variations Complete
**Next Steps:**
- User testing with cohort representatives
- Refine transition logic based on feedback
- Define A/B test variations for Phase 5

**Related Documents:**
- `merchant-dashboard-wireframes.md` - UI specifications
- `ae-ic-dashboard-wireframes.md` - Admin tools
- `interaction-patterns.md` - UX behaviors
- `design-system.md` - Visual specifications

**Owner:** Design Lead, Merchant Onboarding