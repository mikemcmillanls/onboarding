# AE/IC Dashboard Wireframes
## Admin Dashboards for Account Executives and Implementation Consultants

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Phase 1 Wireframes

---

## Overview

This document defines the administrative dashboards for:
- **Account Executives (AEs)** - Sales support, quote building, lead management
- **Implementation Consultants (ICs)** - Setup support, session scheduling, progress tracking

**Design Goals:**
1. Surface high-priority merchants requiring attention
2. Provide full context on merchant status and history
3. Enable efficient quote building and session management
4. Track communication history and next actions
5. Surface actionable insights and alerts

---

## AE Dashboard

### Main Dashboard View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Lightspeed AE Dashboard                    [Sarah Johnson] [Settings] │
├─────────────────────────────────────────────────────────────────────────┤
│  SIDEBAR                 │  MAIN CONTENT AREA                           │
│                          │                                              │
│  📊 Dashboard            │  My Assigned Leads (12)                      │
│  👥 My Leads (12)        │  ┌────────────────────────────────────┐    │
│  🔍 Lead Queue (24) 🔴   │  │ Filter: [All] [New] [In Progress]  │    │
│  📈 Metrics              │  │ Sort: [Priority ▼] [Date ▼]        │    │
│  💬 Communications       │  └────────────────────────────────────┘    │
│  ⚙️ Settings             │                                              │
│                          │  ┌──────────────────────────────────────┐  │
│  QUICK STATS             │  │ 🔴 NEW - Response Due in 12 min     │  │
│  ┌──────────────┐        │  │                                      │  │
│  │ Today's Calls│        │  │ Acme Retail Group                    │  │
│  │      3       │        │  │ Estimated GTV: $3.5M                 │  │
│  │              │        │  │ 5 locations • Restaurant             │  │
│  │ [View →]     │        │  │                                      │  │
│  └──────────────┘        │  │ Created: 13 min ago                  │  │
│  ┌──────────────┐        │  │ Contact: john@acmeretail.com         │  │
│  │ Pipeline     │        │  │          (555) 123-4567              │  │
│  │  $247K       │        │  │                                      │  │
│  │              │        │  │ [Call Now] [View Details →]          │  │
│  │ [View →]     │        │  └──────────────────────────────────────┘  │
│  └──────────────┘        │                                              │
│                          │  ┌──────────────────────────────────────┐  │
│                          │  │ 🟡 IN PROGRESS - Quote Pending       │  │
│                          │  │                                      │  │
│                          │  │ Downtown Golf Club                   │  │
│                          │  │ Estimated GTV: $1.2M                 │  │
│                          │  │ 3 locations • Golf                   │  │
│                          │  │                                      │  │
│                          │  │ Last Contact: 2 hours ago (call)     │  │
│                          │  │ Next: Send quote for review          │  │
│                          │  │                                      │  │
│                          │  │ [Build Quote] [View Details →]       │  │
│                          │  └──────────────────────────────────────┘  │
│                          │                                              │
│                          │  ┌──────────────────────────────────────┐  │
│                          │  │ 🟢 QUOTE SENT - Awaiting Approval    │  │
│                          │  │                                      │  │
│                          │  │ Boutique Fashion LLC                 │  │
│                          │  │ Quote Value: $12,450                 │  │
│                          │  │ 2 locations • Retail                 │  │
│                          │  │                                      │  │
│                          │  │ Quote sent: 1 day ago                │  │
│                          │  │ Quote viewed: 3 times                │  │
│                          │  │                                      │  │
│                          │  │ [Follow Up] [View Details →]         │  │
│                          │  └──────────────────────────────────────┘  │
│                          │                                              │
│                          │  [View All Leads →]                          │
│                          │                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Lead Status Badges

```
🔴 NEW - Requires immediate attention (SLA: 15 minutes)
🟡 IN PROGRESS - Active conversation
🟢 QUOTE SENT - Awaiting merchant approval
🔵 APPROVED - Merchant completed purchase
⚪ STALLED - No activity in 3+ days
⚫ LOST - Merchant declined or disqualified
```

---

## AE: Merchant Detail View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to My Leads          Acme Retail Group                 [✕]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  OVERVIEW                    QUOTE              COMMUNICATIONS   NOTES  │
│  ───────                                                                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MERCHANT INFORMATION                                           │   │
│  │                                                                  │   │
│  │  Legal Business Name: Acme Retail Group LLC                     │   │
│  │  Contact: John Smith (Owner)                                    │   │
│  │  Email: john@acmeretail.com                                     │   │
│  │  Phone: (555) 123-4567                                          │   │
│  │                                                                  │   │
│  │  Business Category: Restaurant                                  │   │
│  │  Estimated Annual Revenue: $2M-$5M                              │   │
│  │  Estimated GTV: $3.5M/year                                      │   │
│  │  Number of Locations: 5                                         │   │
│  │                                                                  │   │
│  │  ✓ KYB Status: Approved                                         │   │
│  │  ○ KYC Status: Pending purchase                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ONBOARDING PROGRESS                                            │   │
│  │                                                                  │   │
│  │  ●━━━━●━━━━●━━━━○━━━━○━━━━○━━━━○━━━━○━━━━○━━━━○              │   │
│  │  ✓     ✓     ✓     ●     5     6     7     8     9     10      │   │
│  │                                                                  │   │
│  │  Current Step: Hardware Selection (Step 4)                      │   │
│  │  Progress: 30% complete                                         │   │
│  │                                                                  │   │
│  │  Next Action: Build and send quote for review                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  TIMELINE & ACTIVITY                                            │   │
│  │                                                                  │   │
│  │  📅 Oct 9, 2025 - 10:15 AM                                      │   │
│  │     Account created, KYB submitted                              │   │
│  │                                                                  │   │
│  │  ✓ Oct 9, 2025 - 10:17 AM                                       │   │
│  │     KYB approved                                                │   │
│  │                                                                  │   │
│  │  📞 Oct 9, 2025 - 10:20 AM                                      │   │
│  │     You: Outbound call (12 min duration)                        │   │
│  │     Notes: "Discussed needs, 5 locations, interested in..."    │   │
│  │     [View Full Notes]                                           │   │
│  │                                                                  │   │
│  │  📋 Oct 9, 2025 - 10:32 AM                                      │   │
│  │     You: Started building quote (Draft)                         │   │
│  │                                                                  │   │
│  │  ⏳ Next: Send quote for review                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ACTIONS                                                                 │
│  [📞 Call Merchant]  [📧 Send Email]  [📝 Add Note]  [📋 Build Quote]  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## AE: Quote Builder Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Quote Builder - Acme Retail Group                             [✕]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SOFTWARE SUBSCRIPTION                                          │   │
│  │                                                                  │   │
│  │  Location Licenses                                              │   │
│  │  Quantity: [5]  [-] [+]         $199/mo × 5 = $995/mo          │   │
│  │                                                                  │   │
│  │  Register Licenses                                              │   │
│  │  Quantity: [10] [-] [+]         $29/mo × 10 = $290/mo          │   │
│  │                                                                  │   │
│  │  Billing Frequency:                                             │   │
│  │  ○ Monthly   ● Annual (Save 20%)                                │   │
│  │                                                                  │   │
│  │  Custom Discount:                                               │   │
│  │  ☑ Enterprise discount        -15%   -$193/mo                  │   │
│  │  [Add Discount...]                                              │   │
│  │  ────────────────────────────────────────────                  │   │
│  │  Subtotal:                            $1,092/mo                 │   │
│  │  Annual Total (first year):           $13,104                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  HARDWARE                                                       │   │
│  │                                                                  │   │
│  │  Professional Bundle × 5 locations                              │   │
│  │  (iPad, receipt printer, card reader)                           │   │
│  │  Quantity: [5]  [-] [+]         $1,499 × 5 = $7,495            │   │
│  │                                                                  │   │
│  │  Additional Items:                                              │   │
│  │  ☑ Customer Display × 5         $299 × 5 = $1,495              │   │
│  │  ☑ Barcode Scanner × 5          $149 × 5 = $745                │   │
│  │  ☐ Cash Drawer × 5              $99 × 5 = $495                 │   │
│  │  [+ Add Hardware]                                               │   │
│  │  ────────────────────────────────────────────                  │   │
│  │  Hardware Subtotal:                   $9,735                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  OPTIONAL ADD-ONS                                               │   │
│  │                                                                  │   │
│  │  ☑ Paid Implementation Package    $999 (normally $1,499)       │   │
│  │     Dedicated IC support, data migration, training              │   │
│  │                                                                  │   │
│  │  ☐ Extended Hardware Warranty (2 years)       $499             │   │
│  │  ☐ Advanced Reporting Package                 $99/mo           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PAYMENT PROCESSING RATES                                       │   │
│  │                                                                  │   │
│  │  Standard Rates:                                                │   │
│  │  • 2.6% + 10¢ per transaction (Visa, MC, Discover)             │   │
│  │  • 2.9% + 10¢ per transaction (Amex)                           │   │
│  │                                                                  │   │
│  │  Custom Rates: [Edit Rates]                                     │   │
│  │  ☑ Volume discount tier 2      2.4% + 10¢ (Visa, MC, Disc)    │   │
│  │                                 2.7% + 10¢ (Amex)              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  QUOTE SUMMARY                                                  │   │
│  │                                                                  │   │
│  │  One-Time Costs:                                                │   │
│  │  Hardware:                            $9,735                    │   │
│  │  Implementation:                      $999                      │   │
│  │  ────────────────────────────────────────────                  │   │
│  │  Total Due Today:                     $10,734                   │   │
│  │                                                                  │   │
│  │  Recurring Costs:                                               │   │
│  │  Monthly Subscription:                $1,092/mo                 │   │
│  │  Annual Subscription (prepaid):       $13,104/year              │   │
│  │                                                                  │   │
│  │  Payment Processing:                  2.4% + 10¢               │   │
│  │  Estimated monthly processing fees:   $840/mo                   │   │
│  │  (based on $3.5M GTV / 12 months)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Quote Validity: [30 days ▼]                                             │
│  Internal Notes: [Add notes for finance/ops...]                          │
│                                                                           │
│  [Save Draft]  [Preview Quote]  [Send to Merchant]  [Share via Email]   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Quote Sharing Options

```
┌───────────────────────────────────────────────┐
│  Send Quote to Merchant                [✕]   │
├───────────────────────────────────────────────┤
│                                                │
│  Delivery Method:                             │
│  ● Email quote (merchant reviews offline)     │
│  ○ Share live in dashboard (during call)      │
│                                                │
│  Email Recipients:                             │
│  ┌──────────────────────────────────────┐    │
│  │ john@acmeretail.com             [✓] │    │
│  │ [+ Add CC]                            │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  Message to Merchant:                          │
│  ┌──────────────────────────────────────┐    │
│  │ Hi John,                              │    │
│  │                                        │    │
│  │ As discussed, here's your custom      │    │
│  │ quote for 5 locations...              │    │
│  │                                        │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  ☑ Allow merchant to complete purchase online │
│  ☐ Require AE approval before purchase        │
│                                                │
│  [Cancel]                     [Send Quote]     │
│                                                │
└───────────────────────────────────────────────┘
```

---

## AE: Communication Log

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Communications - Acme Retail Group                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  [+ Log Call]  [+ Send Email]  [+ Add Note]                              │
│                                                                           │
│  Filter: [All] [Calls] [Emails] [Notes] [System]                         │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📞 Outbound Call - Oct 9, 2025 10:20 AM                        │   │
│  │  Duration: 12 minutes                                            │   │
│  │  AE: Sarah Johnson                                               │   │
│  │                                                                  │   │
│  │  Notes:                                                          │   │
│  │  Spoke with John (Owner). Discussed current pain points:        │   │
│  │  - Using outdated POS, wants modern system                      │   │
│  │  - 5 locations, planning to add 2 more in Q1 2026              │   │
│  │  - Interested in integrated payments for better rates          │   │
│  │  - Needs robust reporting across all locations                 │   │
│  │                                                                  │   │
│  │  Action items:                                                   │   │
│  │  - Send quote with 5-location pricing                          │   │
│  │  - Include implementation package                               │   │
│  │  - Follow up in 24 hours if no response                        │   │
│  │                                                                  │   │
│  │  [Edit] [Delete]                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🤖 System Event - Oct 9, 2025 10:17 AM                         │   │
│  │  KYB verification approved                                       │   │
│  │  Business: Acme Retail Group LLC (EIN: 12-3456789)             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📧 System Email - Oct 9, 2025 10:15 AM                         │   │
│  │  To: john@acmeretail.com                                         │   │
│  │  Subject: Welcome to Lightspeed - Next Steps                    │   │
│  │  Status: Delivered, Opened (10:16 AM)                           │   │
│  │                                                                  │   │
│  │  [View Email]                                                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Log Call Modal

```
┌───────────────────────────────────────────────┐
│  Log Call                              [✕]   │
├───────────────────────────────────────────────┤
│                                                │
│  Call Type:                                    │
│  ● Outbound   ○ Inbound                       │
│                                                │
│  Contact:                                      │
│  [John Smith (Owner)                      ▼] │
│                                                │
│  Duration:                                     │
│  [12] minutes                                  │
│                                                │
│  Outcome:                                      │
│  [Quote requested                         ▼] │
│  Options: Connected, Voicemail, No answer,    │
│           Quote requested, Purchase agreed    │
│                                                │
│  Notes:                                        │
│  ┌──────────────────────────────────────┐    │
│  │                                        │    │
│  │                                        │    │
│  │                                        │    │
│  │                                        │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  Next Action:                                  │
│  ┌──────────────────────────────────────┐    │
│  │ [Send quote                       ▼] │    │
│  │ Due: [Tomorrow                    ▼] │    │
│  └──────────────────────────────────┘    │
│                                                │
│  [Cancel]                     [Save Call Log]  │
│                                                │
└───────────────────────────────────────────────┘
```

---

## IC Dashboard

### Main Dashboard View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Lightspeed IC Dashboard                    [Mike Chen] [Settings]     │
├─────────────────────────────────────────────────────────────────────────┤
│  SIDEBAR                 │  MAIN CONTENT AREA                           │
│                          │                                              │
│  📊 Dashboard            │  My Assigned Merchants (18)                  │
│  👥 My Merchants (18)    │  ┌────────────────────────────────────┐    │
│  🔍 Merchant Queue (31)  │  │ Filter: [All] [Active] [Stalled]   │    │
│  📅 Calendar             │  │ Sort: [Priority ▼] [Progress ▼]    │    │
│  📈 Metrics              │  └────────────────────────────────────┘    │
│  ⚙️ Settings             │                                              │
│                          │  ┌──────────────────────────────────────┐  │
│  QUICK STATS             │  │ 🔴 STALLED - No activity 4 days     │  │
│  ┌──────────────┐        │  │                                      │  │
│  │ Sessions     │        │  │ Cafe Delight                         │  │
│  │ Today        │        │  │ Step 7: Data Import (70% complete)  │  │
│  │      2       │        │  │ 2 locations • Restaurant             │  │
│  │              │        │  │                                      │  │
│  │ [View →]     │        │  │ Last activity: Oct 5 (hardware setup)│  │
│  └──────────────┘        │  │ Blocker: Import wizard abandoned     │  │
│  ┌──────────────┐        │  │                                      │  │
│  │ Merchants    │        │  │ [Call Merchant] [View Details →]     │  │
│  │ At Risk      │        │  └──────────────────────────────────────┘  │
│  │      5       │        │                                              │
│  │              │        │  ┌──────────────────────────────────────┐  │
│  │ [View →]     │        │  │ 🟡 ACTIVE - Session scheduled        │  │
│  └──────────────┘        │  │                                      │  │
│                          │  │ Urban Boutique                       │  │
│                          │  │ Step 8: Hardware Setup (80% complete)│  │
│                          │  │ 1 location • Retail                  │  │
│                          │  │                                      │  │
│                          │  │ Upcoming: Setup session today 2 PM   │  │
│                          │  │ Duration: 60 min                     │  │
│                          │  │                                      │  │
│                          │  │ [Join Session] [View Details →]      │  │
│                          │  └──────────────────────────────────────┘  │
│                          │                                              │
│                          │  ┌──────────────────────────────────────┐  │
│                          │  │ 🟢 ON TRACK - Progressing well       │  │
│                          │  │                                      │  │
│                          │  │ Fitness Pro Center                   │  │
│                          │  │ Step 9: Integrations (90% complete)  │  │
│                          │  │ 3 locations • Services               │  │
│                          │  │                                      │  │
│                          │  │ Last activity: 2 hours ago           │  │
│                          │  │ Next: Final review and launch        │  │
│                          │  │                                      │  │
│                          │  │ [Send Message] [View Details →]      │  │
│                          │  └──────────────────────────────────────┘  │
│                          │                                              │
│                          │  [View All Merchants →]                      │
│                          │                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Merchant Status Badges (IC View)

```
🔴 STALLED - No activity 3+ days, needs intervention
🟡 ACTIVE - Scheduled session or recent activity
🟢 ON TRACK - Progressing normally
🔵 COMPLETED - Onboarding finished
⚪ PENDING - Waiting on hardware delivery or external blocker
```

---

## IC: Merchant Detail View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back to My Merchants      Cafe Delight                     [✕]      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  OVERVIEW            PROGRESS            SESSIONS          NOTES         │
│  ───────                                                                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MERCHANT INFORMATION                                           │   │
│  │                                                                  │   │
│  │  Business Name: Cafe Delight                                    │   │
│  │  Contact: Maria Garcia (Owner)                                  │   │
│  │  Email: maria@cafedelight.com                                   │   │
│  │  Phone: (555) 987-6543                                          │   │
│  │                                                                  │   │
│  │  Cohort: Assisted (Estimated GTV: $800K)                        │   │
│  │  Locations: 2                                                   │   │
│  │  Business Type: Restaurant (Coffee Shop)                        │   │
│  │                                                                  │   │
│  │  AE: Sarah Johnson                                              │   │
│  │  IC: Mike Chen (You)                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ONBOARDING PROGRESS - 70% Complete                             │   │
│  │                                                                  │   │
│  │  ●━━━━●━━━━●━━━━●━━━━●━━━━●━━━━●━━━━○━━━━○━━━━○              │   │
│  │  ✓     ✓     ✓     ✓     ✓     ✓     ●     8     9     10      │   │
│  │                                                                  │   │
│  │  Current Step: Data Import (Step 7)                             │   │
│  │  Status: 🔴 STALLED (4 days inactive)                           │   │
│  │                                                                  │   │
│  │  Completed Steps:                                               │   │
│  │  ✓ Account created, KYB approved, software configured           │   │
│  │  ✓ Hardware ordered and delivered (Oct 10)                      │   │
│  │  ✓ KYC approved, payments activated                             │   │
│  │                                                                  │   │
│  │  Blocker: Import wizard abandoned at field mapping step         │   │
│  │  Reason: Unknown (no error logged)                              │   │
│  │                                                                  │   │
│  │  Recommended Action: Call merchant to offer assistance           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SETUP DETAILS                                                  │   │
│  │                                                                  │   │
│  │  Software:                                                       │   │
│  │  • 2 location licenses, 4 register licenses                     │   │
│  │  • Subscription: $514/mo (promotional: $257/mo first 3 months) │   │
│  │                                                                  │   │
│  │  Hardware:                                                       │   │
│  │  • Professional Bundle × 2 locations                            │   │
│  │  • Delivery status: Delivered Oct 10, 2025                      │   │
│  │  • Setup status: Partially configured (1/2 locations complete)  │   │
│  │                                                                  │   │
│  │  Payments:                                                       │   │
│  │  • KYC: Approved Oct 9                                          │   │
│  │  • Processing enabled: ✓ Both locations                         │   │
│  │  • Payouts: ○ Bank account not connected yet                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  RECENT ACTIVITY                                                │   │
│  │                                                                  │   │
│  │  📅 Oct 5, 2025 - 3:47 PM                                       │   │
│  │     Merchant: Abandoned data import wizard (field mapping)      │   │
│  │                                                                  │   │
│  │  📅 Oct 5, 2025 - 2:30 PM                                       │   │
│  │     Merchant: Completed hardware setup for Location 1           │   │
│  │                                                                  │   │
│  │  📅 Oct 3, 2025 - 10:00 AM                                      │   │
│  │     You: Onboarding session (60 min) - Hardware unboxing        │   │
│  │     Notes: "Helped set up first location, scheduled..."         │   │
│  │     [View Full Notes]                                           │   │
│  │                                                                  │   │
│  │  ⏳ Next: Reach out about data import blocker                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ACTIONS                                                                 │
│  [📞 Call Merchant]  [📧 Send Email]  [📅 Schedule Session]  [📝 Note]  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## IC: Session Scheduler

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Schedule Onboarding Session - Cafe Delight                    [✕]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Session Type:                                                           │
│  ┌───────────────────────────────────────────────────────────────┐     │
│  │ [Data Import & Migration                                  ▼] │     │
│  │ Options: Hardware Setup, Data Import, Integration Setup,     │     │
│  │          Training, General Support                            │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                           │
│  Duration:                                                               │
│  [60 minutes ▼]                                                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  YOUR AVAILABILITY                                              │   │
│  │                                                                  │   │
│  │  October 2025                                           [< >]   │   │
│  │  ┌────┬────┬────┬────┬────┬────┬────┐                         │   │
│  │  │ Su │ Mo │ Tu │ We │ Th │ Fr │ Sa │                         │   │
│  │  ├────┼────┼────┼────┼────┼────┼────┤                         │   │
│  │  │  6 │  7 │  8 │ [9]│ 10 │ 11 │ 12 │                         │   │
│  │  │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │                         │   │
│  │  │ 20 │ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │                         │   │
│  │  └────┴────┴────┴────┴────┴────┴────┘                         │   │
│  │                                                                  │   │
│  │  Wednesday, October 9, 2025                                     │   │
│  │  ┌──────────────────────────────────────────────┐             │   │
│  │  │ ○  9:00 AM - 10:00 AM                        │             │   │
│  │  │ ○ 10:00 AM - 11:00 AM                        │             │   │
│  │  │ ●  2:00 PM -  3:00 PM  [Selected]            │             │   │
│  │  │ ○  3:00 PM -  4:00 PM                        │             │   │
│  │  │ ○  4:00 PM -  5:00 PM                        │             │   │
│  │  └──────────────────────────────────────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Merchant Timezone: Pacific Time (PT)                                   │
│  ☑ Convert to merchant timezone in invitation                           │
│                                                                           │
│  Session Title:                                                          │
│  [Data Import Setup Session                                          ]  │
│                                                                           │
│  Agenda/Notes:                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ We'll work together to:                                          │   │
│  │ • Review your product/customer data                              │   │
│  │ • Map CSV fields to Lightspeed                                   │   │
│  │ • Complete the import process                                    │   │
│  │ • Verify data accuracy                                           │   │
│  │                                                                  │   │
│  │ Please have your CSV files ready.                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Video Conference:                                                       │
│  ● Auto-generate meeting link   ○ Use external link (Zoom, etc.)        │
│                                                                           │
│  [Cancel]                                      [Send Invitation]         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Session Confirmation (Merchant Receives)

```
┌─────────────────────────────────────────────────────────────────┐
│  📧 Email: Onboarding Session Scheduled                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Hi Maria,                                                       │
│                                                                   │
│  Your Lightspeed onboarding session is scheduled!                │
│                                                                   │
│  📅 When: Wednesday, October 9, 2025 at 2:00 PM PT              │
│  ⏱️ Duration: 60 minutes                                         │
│  👤 With: Mike Chen, Implementation Consultant                   │
│  📹 Join: [Video Conference Link]                                │
│                                                                   │
│  What we'll cover:                                               │
│  • Review your product/customer data                             │
│  • Map CSV fields to Lightspeed                                  │
│  • Complete the import process                                   │
│  • Verify data accuracy                                          │
│                                                                   │
│  Please have your CSV files ready.                               │
│                                                                   │
│  [Add to Calendar]  [Reschedule]  [Cancel]                       │
│                                                                   │
│  Need to reschedule? Use the link above or reply to this email. │
│                                                                   │
│  See you soon!                                                   │
│  Mike Chen                                                       │
│  Implementation Consultant                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## IC: Setup Progress Tracker

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Setup Progress Tracker - Cafe Delight                         [✕]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Track setup completion for each location                                │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  LOCATION 1: Main Street Cafe                                   │   │
│  │                                                                  │   │
│  │  Hardware Setup                                                 │   │
│  │  ✓ iPad configured and logged in                                │   │
│  │  ✓ Receipt printer connected                                    │   │
│  │  ✓ Card reader paired                                           │   │
│  │  ✓ Test transaction completed                                   │   │
│  │  ○ Bank account connected (PENDING)                             │   │
│  │                                                                  │   │
│  │  Software Configuration                                          │   │
│  │  ✓ Products imported (247 items)                                │   │
│  │  ✓ Tax rates configured                                         │   │
│  │  ○ Employee accounts created (0/3)                              │   │
│  │  ○ Receipt template customized                                  │   │
│  │                                                                  │   │
│  │  Progress: 70% complete                                         │   │
│  │  [████████████░░░░░░]                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  LOCATION 2: Downtown Cafe                                      │   │
│  │                                                                  │   │
│  │  Hardware Setup                                                 │   │
│  │  ○ iPad configured and logged in                                │   │
│  │  ○ Receipt printer connected                                    │   │
│  │  ○ Card reader paired                                           │   │
│  │  ○ Test transaction completed                                   │   │
│  │  ○ Bank account connected                                       │   │
│  │                                                                  │   │
│  │  Software Configuration                                          │   │
│  │  ✓ Products imported (same catalog as Location 1)               │   │
│  │  ○ Tax rates configured                                         │   │
│  │  ○ Employee accounts created (0/2)                              │   │
│  │  ○ Receipt template customized                                  │   │
│  │                                                                  │   │
│  │  Progress: 10% complete                                         │   │
│  │  [██░░░░░░░░░░░░░░░░]                                           │   │
│  │                                                                  │   │
│  │  [Schedule Setup Session]                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Overall Progress: 40% (4/10 major milestones)                           │
│                                                                           │
│  [Mark Tasks Complete]  [Add Custom Task]  [Export Report]               │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Shared Components

### Merchant Status Card (Sidebar Widget)

```
┌─────────────────────────────────────────┐
│  MERCHANT STATUS                        │
├─────────────────────────────────────────┤
│                                          │
│  Cafe Delight                           │
│  🔴 Stalled (4 days)                    │
│                                          │
│  Progress: 70%                          │
│  [██████████████░░░░░]                  │
│                                          │
│  Current Step:                          │
│  Step 7: Data Import                    │
│                                          │
│  Next Action:                           │
│  Call about import blocker              │
│                                          │
│  [📞 Call]    [📧 Email]                │
│                                          │
└─────────────────────────────────────────┘
```

### Alert/Notification Patterns

**High Priority Alert (Top Banner):**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔴 5 merchants stalled for 3+ days. Review now.        [View All] [✕]  │
└─────────────────────────────────────────────────────────────────────────┘
```

**In-App Notification (Toast):**
```
┌───────────────────────────────────────┐
│  ✓ Quote sent to Acme Retail Group    │
│  Merchant will receive email shortly. │
│  [View Quote]                     [✕] │
└───────────────────────────────────────┘
```

**Notification Center (Dropdown):**
```
┌───────────────────────────────────────────┐
│  Notifications                       [✕]  │
├───────────────────────────────────────────┤
│                                            │
│  ● New lead assigned: Downtown Golf Club  │
│     2 minutes ago                          │
│                                            │
│  ○ Merchant approved quote: Boutique LLC  │
│     1 hour ago                             │
│                                            │
│  ○ Session reminder: Urban Boutique (2 PM)│
│     3 hours ago                            │
│                                            │
│  [View All Notifications]                  │
│  [Mark All Read]                           │
│                                            │
└───────────────────────────────────────────┘
```

---

## Quick Action Patterns

### Quick Actions Menu (Merchant Card)

```
┌─────────────────────────────────────┐
│  Acme Retail Group              [⋮] │
│  Step 4: Hardware Selection          │
│  Progress: 30%                       │
│                                      │
│  [View Details →]                    │
└─────────────────────────────────────┘

(On click of [⋮])
┌───────────────────────────┐
│  📞 Call Merchant         │
│  📧 Send Email            │
│  📝 Add Note              │
│  📋 Build Quote           │
│  ──────────────           │
│  🗑️ Unassign Lead         │
└───────────────────────────┘
```

### Bulk Actions (Multi-Select)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  My Leads (12)                                             [Select All]  │
│  3 leads selected                                                        │
│  [Send Email] [Assign to AE] [Export] [Delete]                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ☑ Acme Retail Group                                                    │
│  ☑ Downtown Golf Club                                                   │
│  ☑ Boutique Fashion LLC                                                 │
│  ☐ Cafe Delight                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Responsive (Admin Dashboards)

### Mobile AE Dashboard

```
┌──────────────────────────────┐
│  Lightspeed AE         [☰] │
├──────────────────────────────┤
│                              │
│  My Leads (12)               │
│  [All ▼] [Priority ▼]        │
│                              │
│  ┌────────────────────────┐ │
│  │ 🔴 NEW (12m left)      │ │
│  │                        │ │
│  │ Acme Retail Group      │ │
│  │ $3.5M GTV • 5 locs     │ │
│  │                        │ │
│  │ [Call] [Details →]     │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ 🟡 IN PROGRESS         │ │
│  │                        │ │
│  │ Downtown Golf Club     │ │
│  │ Quote pending          │ │
│  │                        │ │
│  │ [Build Quote] [→]      │ │
│  └────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

---

## Document Status

**Status:** Phase 1 Wireframes Complete
**Next Steps:**
- Developer review for admin tool feasibility
- High-fidelity mockups with real data
- Workflow testing with AE/IC teams

**Related Documents:**
- `merchant-dashboard-wireframes.md` - Merchant-facing interfaces
- `flow-variations.md` - Path-specific workflows
- `interaction-patterns.md` - UX behaviors
- `design-system.md` - Visual specifications

**Owner:** Design Lead, Merchant Onboarding