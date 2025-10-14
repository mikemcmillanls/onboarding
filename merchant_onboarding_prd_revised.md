# Product Requirements Document: Lightspeed Merchant Onboarding

## Executive Summary

**Product:** Lightspeed Merchant Onboarding Experience
**Goal:** Create a seamless, intelligent onboarding journey that gets merchants from signup to processing payments quickly, with the right level of support automatically provided based on business size and complexity
**Impact:** Faster time-to-first-transaction, higher completion rates, and better merchant satisfaction through personalized experiences that feel simple regardless of business complexity

---

## Problem Statement

**What Merchants Experience Today:**
- Confusing multi-step processes with unclear next actions
- Being asked for the same information multiple times
- Waiting for approvals without understanding why or what's happening
- Getting stuck during setup with no clear path to help
- Feeling overwhelmed by complexity for simple businesses
- Feeling undersupported for complex businesses

**What Merchants Actually Want:**
1. Sign up quickly and easily
2. Get their POS and payment processing set up
3. Start taking payments and running their business

**The Real Challenge:**
Behind the scenes, we need to verify their business, configure complex systems, and route high-value merchants to sales teams—but merchants don't care about our internal processes. They just want to get up and running.

---

## Goals & Success Metrics

### Primary Goals
1. **Get merchants to first transaction faster** - Reduce friction and waiting
2. **Make the journey feel simple** - Hide complexity, show clear progress
3. **Deliver the right support automatically** - Match help to merchant needs without asking them to choose

### Success Metrics

| Metric | Current Baseline | Target | Measurement |
|--------|-----------------|--------|-------------|
| **Signup to First Transaction** | TBD | -50% | Days from account creation to first payment processed |
| **Onboarding Completion Rate** | TBD | 85%+ | % of signups who complete setup and process first payment |
| **Merchant Satisfaction Score** | TBD | 8.5/10 | Post-onboarding survey rating |
| **Time in "Waiting" States** | TBD | <24 hours | Total time merchant waits for approvals/reviews |
| **Support Contact Rate** | TBD | <15% | % of merchants who contact support during onboarding |

---

## The Merchant Journey: 4 Simple Steps

From the merchant's perspective, onboarding is four straightforward actions:

### 1. Sign Up & Tell Us About Your Business
**What the merchant does:** Creates an account and provides basic business information
**What they see:** Simple signup form with clear progress indicators
**What happens behind the scenes:** Account creation, business qualification for payments, cohort assignment, routing decisions

### 2. Set Up Your POS & Payments
**What the merchant does:** Chooses their software plan and hardware needs
**What they see:** Clear options with recommendations, transparent pricing
**What happens behind the scenes:** License provisioning, hardware compatibility verification, quote generation, potential AE routing

### 3. Complete Purchase & Verification
**What the merchant does:** Pays for their setup and verifies their business identity
**What they see:** Checkout flow, simple identity verification forms
**What happens behind the scenes:** Payment processing, KYB/KYC verification, underwriting, account activation, hardware shipment

### 4. Get Everything Ready
**What the merchant does:** Sets up their hardware, imports data, runs first test payment
**What they see:** Step-by-step guides, clear checklists, test mode environment
**What happens behind the scenes:** Configuration, data migration, terminal activation, payout account setup, final compliance checks

**Result:** Merchant is processing live payments and running their business.

---

## Detailed Experience Requirements

## Step 1: Sign Up & Tell Us About Your Business

### Merchant Intent
"I want to sign up for Lightspeed and see if I qualify for payment processing."

### Experience Design

**Entry Points:**
- Lightspeed marketing website → "Get Started" button
- Pricing page → "Start Free Trial" or "Buy Now"
- Sales call → "I'll send you a signup link"

**What the merchant sees:**

**Page 1: Create Your Account**
- Name, email, password
- Business name and category (dropdown)
- "How much revenue do you process per year?" (ranges, not exact)
- "How many locations do you have?" (1, 2-5, 6-10, 11+)

**Page 2: Business Details**
- Legal business name
- Business type (LLC, Corporation, Sole Proprietor, etc.)
- Tax ID (EIN or SSN for sole proprietors)
- Business address
- "We need this to verify your business for payment processing"

**Progress Indicator:**
- "Step 1 of 4: Account Setup" → Makes progress visible

**What the merchant experiences:**

**For Most Merchants (Self-Serve Path):**
- Form completes → "Great! Your business qualifies for Lightspeed Payments" → "Next: Choose Your Setup"
- Smooth, automated flow to Step 2

**For High-Value Merchants (Assisted Path):**
- Form completes → "Great news! Based on your business size, you qualify for dedicated support"
- "A payment specialist will contact you within 2 hours to help with your setup"
- Optional: "Prefer to continue on your own? Click here"
- They can schedule a specific time or continue self-serve

**For Flagged Merchants (Review Path):**
- Form completes → "We're reviewing your business information"
- "This usually takes 1-2 hours. We'll email you as soon as you're approved"
- Clear expected timeline, notification preferences

### Behind the Scenes: Intelligent Routing

**System evaluates:**
- Revenue range + location count → Cohort assignment
- Business category + address → Risk assessment for payments
- Time of submission → AE availability for immediate contact

**Routing logic:**

| Business Profile | Revenue | Locations | Experience |
|-----------------|---------|-----------|------------|
| **Self-Serve** | <$500K | 1-3 | Automated flow, optional support |
| **Assisted** | $500K-$2M | 3-10 | Dedicated specialist contacts them, can still self-serve |
| **Managed** | $2M+ | 10+ | Required specialist call, custom pricing |

**Critical requirement:** KYB (business verification) happens automatically during this step. Merchants see one form, but system runs background checks before allowing purchase.

**Decision Gates:**
- ✅ **Auto-approved:** Continue immediately to Step 2
- ⚠️ **Needs review:** Show waiting message with timeline, send to review queue
- ❌ **Ineligible:** Show clear rejection message with specific reason (high-risk category, restricted location, etc.)

### Data Collected
- Contact: Name, email, phone, password
- Business basics: Business name, category, revenue range, location count
- Legal details: Legal name, business structure, EIN, registered address

### Technical Requirements
- Real-time KYB verification integration (Payments Service)
- Cohort assignment engine (revenue + location + category → routing decision)
- AE queue management and notification system
- Review queue for flagged applications
- CRM sync for all leads created

### Success Criteria
- Form completion rate >90%
- Average completion time <5 minutes
- Auto-approval rate >70%
- Review turnaround <2 hours
- AE contact rate (when assigned) >95% within SLA

---

## Step 2: Set Up Your POS & Payments

### Merchant Intent
"I need to figure out what software and hardware I need to run my business."

### Experience Design

**What the merchant sees:**

**Unified Setup Dashboard**
- Welcome message: "Let's get your business set up"
- Clear progress: "Step 2 of 4: Choose Your Setup"
- Two sections side-by-side:

**Section A: Software Setup**
- "How many locations will use Lightspeed?" (number input)
- "How many registers per location?" (number input)
- Live price preview: "$X/month for [N] locations"
- Optional: "I need eCommerce" (checkbox, adds to plan)

**Section B: Hardware Setup**
- "What hardware do you need?"
- Option 1: "Show me recommended packages" (bundles based on business category)
- Option 2: "I have existing hardware" (compatibility checker)
- Clear package cards with images, what's included, pricing
- One-time cost shown clearly

**Running Total:**
- Sticky footer: "Setup: $X one-time + $Y/month" with "Continue to Checkout" button

**What different merchants experience:**

**Self-Serve Merchants:**
- Configure everything themselves
- See recommended options based on their business type
- Instant price calculations
- "Questions? Chat with us" option always visible

**Assisted Merchants:**
- Same dashboard BUT with banner: "Your specialist [Name] is ready to help"
- Option to "Schedule a call" or "Call me now"
- Can still configure themselves or wait for specialist guidance
- When specialist calls, they screen-share this same dashboard
- Specialist can modify the quote, merchant sees changes in real-time

**Managed Merchants:**
- Dashboard shows: "Your account manager [Name] is preparing a custom quote"
- Can browse options but can't checkout yet
- "Review options while you wait" mode
- Receive custom quote within 24 hours
- Quote appears in same dashboard when ready

### Behind the Scenes: Intelligent Recommendations

**System provides:**
- Hardware bundles matched to business category (restaurant vs. retail vs. specialty)
- Minimum viable setup (required items)
- Common add-ons (receipt printers, scanners, multiple terminals)
- Compatibility verification for existing hardware

**Specialist Tools (for Assisted/Managed):**
- Same merchant view + admin controls
- Can adjust pricing, add discounts, create custom packages
- Quote builder syncs with merchant dashboard in real-time
- Notes and internal flags invisible to merchant

**Critical Requirement:** Merchant cannot proceed to purchase until KYB from Step 1 is approved. If still pending, show: "We're finalizing your payment processing approval (usually 1-2 hours). You can configure your setup now and we'll notify you when ready to purchase."

### Data Collected
- Location licenses (quantity)
- Register licenses (quantity)
- Hardware selections (SKUs and quantities)
- Existing hardware details (if applicable)
- Add-on preferences (eCommerce, integrations)

### Technical Requirements
- X-Series provisioning API (create account when confirmed)
- Hardware catalog with business-category matching logic
- Compatibility checker for existing hardware
- Real-time quote calculator
- Specialist dashboard with quote builder
- Quote sync between specialist and merchant views
- Gate: Block checkout button if KYB not approved

### Success Criteria
- Configuration completion rate >95%
- Average time on page: <10 minutes (self-serve), flexible (assisted)
- Hardware bundle acceptance rate >70% (vs. custom configuration)
- Specialist-assisted quote acceptance rate >85%
- Support contact rate during this step <5%

---

## Step 3: Complete Purchase & Verification

### Merchant Intent
"I'm ready to buy. Just take my payment and ship my stuff."

### Experience Design

**What the merchant sees:**

**Checkout Page (Familiar eCommerce Pattern)**

**Section 1: Review Your Order**
- Itemized list:
  - Software: $X/month (N locations, M registers)
  - Hardware: $Y one-time (itemized list)
  - Lightspeed Payments: $0 setup + [rate]% per transaction
  - Optional: Implementation package (for Managed merchants)
- Total: $Z due today + $X/month starting [date]

**Section 2: Payment Information**
- Credit card fields (standard checkout form)
- Billing address

**Section 3: Shipping Information**
- Shipping address (pre-filled from business address, editable)
- Multiple locations? Add shipping addresses for each

**Section 4: Identity Verification**
- "For payment processing security, we need to verify business ownership"
- **Business Representative:** Name, date of birth, last 4 of SSN, role
- **Business Owners:** (if multiple) Name, ownership %, date of birth, last 4 of SSN
- "Why do we need this?" tooltip explaining compliance requirements

**Button: "Complete Purchase"**

**Post-Purchase Confirmation:**
- "Order confirmed! Here's what happens next:"
- ✅ Software account activated (access email sent)
- 📦 Hardware shipping to [address] (tracking link)
- ⏳ Payment processing activating (ready in 24-48 hours)
- 📧 "Check your email for login details and tracking info"

**What different merchants experience:**

**Self-Serve Merchants:**
- Standard checkout flow
- Immediate purchase confirmation
- Automated emails with next steps

**Assisted Merchants:**
- Checkout link sent by specialist
- Can complete purchase on their own time
- Specialist receives notification when completed
- Optional: Specialist stays on call while they complete purchase

**Managed Merchants:**
- Custom quote with negotiated pricing
- May have custom payment terms (NET 30, split payments)
- Dedicated contact manages the order

### Behind the Scenes: Orchestration

**When "Complete Purchase" is clicked:**

1. **Immediate:**
   - Process payment → Authorize or decline
   - Create X-Series account and provision licenses
   - Send order to hardware fulfillment system
   - Generate invoice and send confirmation email

2. **Parallel Processing (merchant doesn't wait):**
   - Submit KYC data (business representative + owners) to Payments Service
   - Run identity verification and underwriting
   - Activate Lightspeed Payments per location (with payout hold)
   - Sync all data to CRM and provisioning systems

3. **Next 24-48 Hours:**
   - Hardware ships with tracking
   - KYC/underwriting completes
   - Payments approved OR flagged for review
   - Merchant receives: "Your payment processing is active! Next: Set up your hardware"

**Critical Requirements:**

**Payout Hold Strategy:**
- Activate payment processing immediately (merchant can accept payments)
- Hold payouts until bank account is verified (happens in Step 4)
- Merchant sees: "Payment processing: Active | Payouts: Pending bank setup"
- This protects against fraud while letting merchants progress

**Review/Rejection Handling:**
- If underwriting flags account: "Additional verification needed"
- Show clear list of required documents or information
- Provide easy upload mechanism
- Set clear timelines: "Usually resolved within 24 hours"

### Data Collected
- Payment method (credit card)
- Billing address
- Shipping address(es)
- Business representative: Full name, DOB, SSN, address, role
- Business owners: Full name, ownership %, DOB, SSN, address
- Consent acknowledgments

### Technical Requirements
- Payment processing integration (credit card authorization)
- X-Series provisioning API (account activation)
- Hardware order management system
- KYC submission to Payments Service
- Underwriting workflow and review queue
- Email notification system (order confirmation, tracking, account access)
- Dashboard status updates (show activation progress)

### Success Criteria
- Checkout completion rate >90% (of those who start)
- Payment authorization rate >95%
- KYC auto-approval rate >80%
- Order confirmation email delivery within 1 minute
- Hardware shipment initiation within 24 hours
- Merchant login success rate >95% (receiving credentials)

---

## Step 4: Get Everything Ready

### Merchant Intent
"My stuff is here. Help me get it all working so I can start taking payments."

### Experience Design

**What the merchant sees:**

**Onboarding Dashboard (Checklist View)**

**Header:**
- "Welcome to Lightspeed! Let's get you ready to accept payments."
- Progress bar: "3 of 5 tasks complete"

**Task List (Smart Ordering):**

**✅ 1. Account Created** (auto-completed)
- Your login: [email] | Password: [set]

**✅ 2. Software Activated** (auto-completed)
- [N] locations | [M] registers
- "Open your Lightspeed dashboard" (link)

**✅ 3. Hardware Shipped** (auto-completed when shipped)
- Tracking: [link] | Expected delivery: [date]
- Or: "Delivered on [date]"

**⬜ 4. Set Up Your Hardware** (unlocked when delivered)
- "Your hardware has arrived! Let's get it connected."
- Click to expand: Step-by-step guide with photos/videos
  - Plug in your register
  - Connect your payment terminal
  - Pair your scanner and printer
  - "Everything connected? Run a test transaction"
- Button: "I'm ready to test"

**⬜ 5. Connect Your Bank Account** (can do anytime after Step 3)
- "Where should we send your payments?"
- Simple form: Bank name, routing number, account number
- "We'll verify this with 2 small deposits (1-2 days)"
- "You can accept payments now, but payouts are held until verified"

**⬜ 6. Import Your Products & Customers** (optional, can skip)
- "Moving from another POS?"
- Option A: "Upload a CSV file" → Import wizard
- Option B: "Start from scratch" → Skip
- Option C: "I need help with this" → Request support

**Final Step:**
- All tasks complete → "Run your first test transaction"
- Walk through test payment on terminal
- "Success! You're ready to go live."
- Button: "Take Your First Real Payment"

**What different merchants experience:**

**Self-Serve Merchants:**
- Guided step-by-step with in-product instructions
- Video tutorials embedded in each task
- "Stuck? Chat with us" always available
- System detects if they're stalled (e.g., task opened but not completed for 2 days) → automated email offer of help

**Assisted Merchants:**
- Same checklist but with scheduling option
- "Book an onboarding session" button on each task
- Can work through on their own or schedule 30-60 min sessions with Implementation Consultant
- IC has shared view of same dashboard during calls

**Managed Merchants:**
- Dedicated Implementation Consultant assigned
- "Your implementation specialist: [Name]" banner
- Scheduled onboarding sessions (multiple if needed)
- IC manages the entire setup, merchant participates
- Same checklist but IC marks tasks complete

### Behind the Scenes: Progressive Activation

**Hardware Setup Flow:**
- System detects when hardware is delivered (shipping confirmation)
- Unlocks "Set Up Hardware" task
- Tracks terminal activation (device checks in with system)
- Enables test mode for first transactions
- Monitors for successful test payment
- Switches to live mode when merchant is ready

**Bank Verification Flow:**
- Merchant submits bank details
- System sends to payment processor for verification
- 2 micro-deposits sent (1-2 business days)
- Merchant verifies amounts in dashboard
- Payouts automatically enabled upon verification
- No additional action needed from merchant

**Data Import Flow:**
- CSV upload → field mapping wizard → validation → import
- System shows progress: "Importing 1,250 products..."
- Email when complete: "Your products are ready!"
- Errors surfaced clearly: "12 items need attention" → review list

**Intervention Triggers:**
- Task opened but not completed in 48 hours → Email nudge
- Multiple tasks incomplete after 7 days → IC outreach offer
- Critical task stuck (bank verification failed) → Immediate support notification
- High-value merchant stalled → AE notification

### Data Collected
- Bank account: Account holder name, bank name, routing number, account number
- Hardware activation: Device IDs, terminal pairing confirmations
- Data import: Products, customers, transaction history (from CSV)
- Integration preferences: Which systems to connect (accounting, eCommerce, etc.)

### Technical Requirements
- Hardware provisioning and pairing system
- Test mode environment for safe first transactions
- Bank account verification integration
- Micro-deposit processing and confirmation
- CSV import wizard with field mapping
- Data validation and error handling
- Progress tracking system
- Task completion detection
- Automated email triggers based on progress
- IC scheduling system and calendar integration
- Shared dashboard view for IC and merchant

### Success Criteria
- Hardware setup completion rate >95%
- Average time to first test transaction: <2 days after hardware delivery
- Bank account verification completion rate >90%
- Bank verification time: <3 business days average
- Data import success rate >85% (of those who attempt)
- Support contact rate during this step: <20%
- Onboarding completion rate (all tasks done): >85%

---

## Technical Architecture: Making It Feel Simple

### Core Principle
**Merchants see 4 simple steps. System manages 20+ background processes.**

### Key Technical Components

**1. Onboarding Orchestration Engine**
- Tracks merchant state across all systems
- Manages task sequencing and dependencies
- Triggers automated workflows
- Handles rollbacks and error recovery

**2. Progressive Disclosure UI**
- Shows only current step and next action
- Hides completed tasks (collapsible)
- Unlocks tasks when dependencies are met
- Adapts content based on cohort

**3. Intelligent Routing Layer**
- Evaluates merchant profile → assigns cohort
- Routes to appropriate experience (self-serve, assisted, managed)
- Invisible to merchant (no "choose your path" screens)
- Can escalate or de-escalate based on behavior

**4. Background Verification System**
- Runs KYB during signup (merchant sees one form)
- Runs KYC during checkout (merchant sees identity fields)
- Processes verifications asynchronously
- Surfaces results in merchant-friendly language

**5. Smart Notification Engine**
- Sends emails at right moments (order confirmed, hardware shipped, etc.)
- Detects stalls and sends helpful nudges
- Coordinates with support team for interventions
- Preferences: Merchant can control frequency

**6. Unified Data Sync**
- Single source of truth: Onboarding Service database
- Syncs to: CRM, X-Series, Payments Service, Hardware System, Support Tools
- Event-driven architecture (order placed → trigger provisioning + shipment + KYC)
- Idempotent operations (safe retries)

### Integration Map

```
Marketing Website
    ↓ (signup)
Onboarding Service [Core System]
    ↓
├─→ CRM (Salesforce) - Lead/opportunity tracking
├─→ X-Series Provisioning - Account creation
├─→ Payments Service - KYB/KYC verification
├─→ Hardware Fulfillment - Order and shipment
├─→ Billing System - Payment processing
├─→ Support Tools - Ticket creation, IC scheduling
└─→ Analytics - Funnel tracking, cohort analysis
```

### Data Flow by Step

**Step 1: Signup**
- Collect → Store in Onboarding Service
- Trigger → KYB verification (async)
- Sync → CRM (lead created)
- Evaluate → Cohort assignment
- Route → Self-serve, Assisted, or Managed path

**Step 2: Configuration**
- Collect → Software/hardware selections
- Generate → Quote with pricing
- Store → Quote in Onboarding Service
- Sync → CRM (opportunity updated with value)
- If Assisted/Managed → Specialist quote builder

**Step 3: Purchase**
- Process → Payment authorization
- Trigger → Multiple parallel workflows:
  - X-Series provisioning (account + licenses)
  - Hardware order submission
  - KYC submission and underwriting
  - Invoice generation
- Sync → All systems updated
- Activate → Payments (with payout hold)
- Email → Confirmation with credentials

**Step 4: Setup**
- Track → Hardware delivery status
- Monitor → Terminal activation and pairing
- Collect → Bank account details
- Verify → Bank account (micro-deposits)
- Enable → Payouts when verified
- Import → Data from CSV (if provided)
- Complete → All tasks checked off

### Critical Handoffs

**Marketing to Onboarding:**
- UTM parameters, referral source → stored for attribution
- Pre-filled fields from marketing forms → reduce re-entry

**Onboarding to X-Series:**
- Account provisioned with full context
- Merchant logs in directly, sees configured locations/registers

**Onboarding to Payments:**
- KYB/KYC data passed seamlessly
- Merchant never fills out separate payments application

**Onboarding to Support:**
- Full context available in support tools
- IC/AE can see merchant's exact state and history

### Error Handling & Edge Cases

**Payment Declined:**
- Show clear message: "Payment unsuccessful. Try another card?"
- Preserve quote and configuration
- Support chat option: "Need help?"

**KYB/KYC Rejection:**
- Clear explanation of issue (high-risk category, missing info, etc.)
- If recoverable: "Upload these documents to continue"
- If not recoverable: "Unfortunately we can't support [category] businesses at this time"
- Refund if already paid

**Hardware Out of Stock:**
- Detect before checkout
- Offer alternatives: "This item ships in 2 weeks. Choose substitute?"
- Or: "Continue with [available items], we'll ship [backordered item] when available"

**Bank Verification Failure:**
- Clear instructions: "Re-enter account details" or "Contact your bank"
- Alternative: "Connect via Plaid" (instant verification)
- Support escalation if 3 failures

**Merchant Stalls:**
- Day 3: Automated email with helpful tips
- Day 7: Support team notified, can reach out
- Day 14: AE/IC assigned to rescue (if high-value)

---

## Cohort Management: Invisible Intelligence

### The Merchant Never Sees Cohorts

**Bad approach (don't do this):**
- "Choose your plan: Basic, Professional, or Enterprise?"
- "Do you want assisted setup for an extra fee?"

**Good approach (do this):**
- System automatically determines the right experience
- Merchant just sees "Get Started" and moves through their personalized flow
- Support is offered when needed, not as a choice they have to make

### How Cohort Assignment Works

**Evaluation Factors:**
- Annual revenue (from signup form)
- Number of locations (from signup form)
- Business category (restaurant, retail, etc.)
- Complexity signals (multi-location, eCommerce needs, etc.)

**Assignment Logic:**

| Revenue | Locations | Category | Assigned Experience |
|---------|-----------|----------|-------------------|
| <$500K | 1-3 | Any | Self-Serve with optional support |
| $500K-$2M | 3-10 | Standard | Assisted (specialist contacts them) |
| $2M+ | 10+ | Standard | Managed (required specialist engagement) |
| Any | Any | High-risk | Enhanced review before approval |
| Any | Any | Complex needs | Escalated to specialist regardless of size |

**Dynamic Adjustments:**
- Merchant struggles in self-serve → System offers IC support
- Merchant moves quickly in assisted → Less specialist touchpoints needed
- Merchant profile changes during onboarding → Re-evaluate cohort

### Cohort-Specific Experiences

**Self-Serve (Automated Path)**
- No specialist assigned by default
- All tasks self-service with guides
- Optional: "Chat with support" always available
- Optional: "Book a call" if they want help
- System monitors progress, intervenes if stuck

**Assisted (Specialist Contacts Them)**
- Specialist reaches out after signup: "I'm here to help"
- Merchant can accept help or continue alone
- Specialist available for questions during purchase
- Free IC support during setup (optional)
- Shared dashboard when working together

**Managed (Dedicated Team)**
- Account Manager assigned immediately
- Custom pricing and negotiation
- Required specialist calls before purchase
- Dedicated Implementation Consultant for setup
- Multiple onboarding sessions scheduled
- May include paid implementation package

### What This Means for UI

**Same Core Interface, Different Scaffolding:**

**All merchants see:**
- Same 4-step journey
- Same dashboard
- Same task checklist
- Same configuration tools

**What's different:**
- Self-serve: No specialist name/photo shown, "Get Help" is secondary action
- Assisted: Specialist banner at top, "Schedule Call" is primary action
- Managed: Dedicated contact section, some tasks require specialist involvement

**Example - Hardware Setup Task:**

**Self-Serve view:**
- "Set up your hardware" (task name)
- Expandable guide with step-by-step instructions
- "Stuck? Chat with us" (link)

**Assisted view:**
- "Set up your hardware" (task name)
- Same expandable guide
- "Book a setup session with [IC Name]" (prominent button)
- "Prefer to do it yourself? Follow the guide below"

**Managed view:**
- "Set up your hardware" (task name)
- "Your specialist [IC Name] will guide you through this"
- "Scheduled session: [Date/Time]" or "Schedule your session"
- Guide available as reference

---

## Success Metrics & Monitoring

### Merchant-Facing Metrics

**Speed:**
- Signup to purchase: <1 day (self-serve), flexible (assisted)
- Purchase to first transaction: <5 days
- Total onboarding time: <7 days

**Completion:**
- Step 1 completion: >90%
- Step 2 completion: >85%
- Step 3 completion: >80%
- Step 4 completion: >85%
- Overall completion: >75%

**Satisfaction:**
- "How easy was onboarding?" >8/10
- "Did you get the help you needed?" >85% yes
- Net Promoter Score: >50

### Internal Operational Metrics

**Automation Efficiency:**
- Self-serve completion without support: >70%
- Auto-approval rate (KYB/KYC): >80%
- Automated task completion rate: >60%

**Specialist Efficiency:**
- Merchants per AE: Increase 50%
- IC onboarding sessions per week: Target TBD
- Specialist utilization: 80%+

**System Health:**
- Integration sync failures: <1%
- Payment authorization success: >95%
- Hardware shipment on-time rate: >95%
- Email delivery rate: >99%

**Intervention Effectiveness:**
- Stall rescue rate: >50% (merchants who re-engage after intervention)
- Support contact resolution rate: >90%
- Escalation to specialist success rate: >80%

### Monitoring Dashboard (Internal Ops Team)

**Real-Time View:**
- Merchants in each step (current funnel)
- Stalled merchants (no progress in 48+ hours)
- Flagged accounts (KYB/KYC issues)
- Hardware delivery tracking
- AE/IC queue depth

**Cohort Analysis:**
- Completion rates by cohort
- Time-to-completion by cohort
- Support contact rate by cohort
- Revenue by cohort

**Drop-Off Analysis:**
- Where merchants abandon (step-level)
- Reasons for drop-off (if known)
- Recovery opportunities

---

## Launch Plan

### Phase 1: MVP - Core Journey (Months 1-2)

**Goal:** Get basic 4-step journey working for self-serve merchants

**Scope:**
- Steps 1-4 functional for self-serve path
- Basic cohort assignment (self-serve vs. assisted routing)
- KYB verification in Step 1
- KYC verification in Step 3
- Hardware ordering and tracking
- Bank account collection and verification
- Email notifications at key moments

**Success criteria:**
- 50 merchants complete full journey
- Completion rate >60%
- Time to first transaction <10 days
- No critical bugs

### Phase 2: Assisted Path (Month 3)

**Goal:** Add specialist support for high-value merchants

**Scope:**
- AE routing and notification system
- IC scheduling and session management
- Specialist dashboard (shared view with merchant)
- Quote builder for custom pricing
- Enhanced monitoring for assisted merchants

**Success criteria:**
- 20 assisted merchants complete journey
- Completion rate >80%
- Specialist satisfaction >8/10
- AE response time <2 hours

### Phase 3: Intelligence & Optimization (Month 4-5)

**Goal:** Add smart interventions and continuous improvement

**Scope:**
- Stall detection and automated nudges
- Dynamic cohort adjustment (escalate/de-escalate)
- A/B testing framework for flow variations
- Advanced analytics and drop-off analysis
- Automated IC assignment for rescue cases

**Success criteria:**
- Intervention rescue rate >40%
- Overall completion rate >75%
- Time to first transaction <7 days

### Phase 4: Polish & Scale (Month 6)

**Goal:** Optimize for scale and merchant experience

**Scope:**
- Enhanced guides (video tutorials, interactive walkthroughs)
- Mobile-optimized experience
- Multi-language support
- Advanced data import tools (API connectors)
- White-label options for partner channels

**Success criteria:**
- Handle 500+ merchants/month
- Completion rate >85%
- Merchant satisfaction >8.5/10
- Support contact rate <15%

---

## Open Questions & Decisions Needed

### 1. Trial vs. Buy-First
**Question:** Should merchants be able to use the software before purchasing?

**Options:**
- A) Buy first, then set up (current plan)
- B) Trial first, convert to paid later
- C) Hybrid: Self-serve buys, assisted gets trial

**Recommendation:** Start with buy-first for MVP (simpler), test trial in Phase 3

### 2. Payment Hold Strategy
**Question:** Should merchants be able to accept payments before bank verification?

**Current plan:** Yes, accept payments but hold payouts until bank verified

**Risk:** Potential for fraud if verification fails
**Benefit:** Faster time-to-value, can test immediately

**Recommendation:** Hold payouts, closely monitor and set limits for unverified accounts

### 3. Specialist Response Time SLA
**Question:** What can we realistically promise for AE response time?

**Options:**
- A) "Within 15 minutes" (aggressive, requires staffing)
- B) "Within 2 hours" (realistic during business hours)
- C) "Within 1 business day" (safe)
- D) Let them schedule specific time (no SLA)

**Recommendation:** "Within 2 hours during business hours" + option to schedule specific time

### 4. Hardware Compatibility Verification
**Question:** How do we verify if existing merchant hardware is compatible?

**Options:**
- A) Make/model lookup in compatibility database
- B) Require photo of device (manual review)
- C) Trust merchant, deal with issues later
- D) Always recommend new hardware to avoid issues

**Recommendation:** Option A for Phase 1 (database lookup), add photo verification in Phase 2 if needed

### 5. Intervention Triggers
**Question:** When should we escalate a self-serve merchant to IC support?

**Proposed triggers:**
- Task opened but not completed in 48 hours → Automated email
- No progress in 7 days → IC notification, optional outreach
- Multiple failed attempts (test payment fails 3x) → Immediate support offer
- High-value merchant stalls → Proactive IC assignment

**Recommendation:** Start conservative (7 days), optimize based on data

### 6. Data Import Complexity
**Question:** How much help should we provide with data migration?

**Options:**
- A) Self-serve only (CSV upload, figure it out)
- B) Offer paid migration service
- C) Free IC assistance for assisted/managed merchants
- D) Hybrid: Self-serve wizard + optional paid service

**Recommendation:** Option D - good wizard for self-serve, included IC help for managed, paid option for everyone

---

## Appendix: Detailed Data Collection

### Data Collected by Step

**Step 1: Sign Up & Tell Us About Your Business**

*Page 1: Account Creation*
- First name, last name
- Email address
- Password
- Phone number
- Business name (DBA)
- Business category (dropdown)
- Annual revenue (range selector)
- Number of locations (numeric or range)

*Page 2: Business Verification*
- Legal business name
- Business structure (LLC, Corp, Sole Proprietor, etc.)
- Employer Identification Number (EIN) or SSN (sole proprietors)
- Business address (street, city, state, ZIP)
- Business phone

**Step 2: Set Up Your POS & Payments**
- Number of location licenses
- Number of register licenses per location
- Hardware selections (SKUs and quantities per item)
- Existing hardware details (if applicable): Make, model, serial numbers
- Add-on preferences: eCommerce (yes/no), other integrations

**Step 3: Complete Purchase & Verification**

*Checkout*
- Payment method (credit card number, exp, CVV)
- Billing address (if different from business address)
- Shipping address (if different from business address)
- Multiple shipping addresses (if multi-location hardware)

*Identity Verification*
- Business representative:
  - Full name
  - Date of birth
  - SSN (last 4 or full, depending on risk level)
  - Home address
  - Role/title
- Business owners (25%+ ownership):
  - Full name
  - Ownership percentage
  - Date of birth
  - SSN (last 4 or full)
  - Home address
  - Role/title

*Consents*
- Terms of service acceptance
- Payment processing agreement
- Privacy policy acknowledgment

**Step 4: Get Everything Ready**
- Payout bank account:
  - Account holder name
  - Bank name
  - Routing number
  - Account number
  - Account type (checking/savings)
- Hardware activation:
  - Device serial numbers (auto-captured during pairing)
  - Terminal IDs
- Data import:
  - CSV files uploaded (products, customers, transaction history)
- Integration preferences:
  - Accounting software selection
  - eCommerce platform connection
  - Other third-party integrations

### Data Storage & Access

**Onboarding Service Database (Primary):**
- Stores all collected data
- Tracks journey progress (current step, task completion)
- Records timestamps for all actions
- Flags and notes from specialists/support

**Synced to External Systems:**
- CRM (Salesforce): Lead/contact/opportunity data, specialist assignments
- X-Series: Account details, licenses, location configuration
- Payments Service: KYB/KYC verification data, underwriting results
- Hardware System: Orders, shipments, device activations
- Billing: Payment methods, invoices, subscription billing
- Support Tools: Case history, communication logs

**Data Retention:**
- Active onboarding: All data retained
- Completed onboarding: Migrated to production systems, onboarding records archived
- Abandoned onboarding: Retained for 90 days, then anonymized for analytics

---

## Document Control

**Version:** 2.0 (Complete Revision)
**Author:** Product Lead
**Last Updated:** October 2025
**Status:** Draft for Review
**Key Changes from v1.0:**
- Complete rewrite from merchant perspective
- Simplified from 10 steps to 4 merchant-facing steps
- Invisible cohort routing (no "choose your path" friction)
- Progressive disclosure approach
- Clearer technical architecture
- Merchant-friendly language throughout

**Next Steps:**
- Review with design team for wireframe creation
- Technical feasibility assessment
- Validate metrics and success criteria
- Finalize Phase 1 scope and timeline
