# Product Requirements Document: Cohort-Based Merchant Onboarding

## Executive Summary

**Product:** Unified X-Series and Lightspeed Payments Onboarding Experience  
**Goal:** Transform merchant onboarding from a one-size-fits-all process into a cohort-based journey that adapts to merchant complexity, GTV potential, and support needs  
**Impact:** Improve conversion rates, reduce time-to-first-transaction, and optimize resource allocation across self-serve and high-touch merchants

---

## Problem Statement

**Current State Challenges:**
- All merchants experience the same onboarding flow regardless of business complexity or revenue potential
- High-value merchants don't receive adequate white-glove support early enough
- Self-serve merchants encounter friction requiring unnecessary human intervention
- Qualification for Lightspeed Payments happens too late in the journey, causing drop-offs
- Data collection is scattered across disconnected systems (marketing → sales → X-Series → Payments)
- No visibility into where merchants get stuck or abandon the process

**Opportunity:**
Create an intelligent onboarding system that segments merchants into cohorts early, assigns appropriate selling and setup plans, and guides them through tailored journeys with the right level of automation and human touch.

---

## Goals & Success Metrics

### Primary Goals
1. **Increase conversion rates** across all merchant cohorts
2. **Reduce time-to-activation** for Lightspeed Payments
3. **Optimize resource allocation** between self-serve and assisted paths
4. **Improve data capture quality** throughout the journey

### Success Metrics

| Metric | Current Baseline | Target | Measurement |
|--------|-----------------|--------|-------------|
| **Lead-to-Customer Conversion** | TBD | +25% | % of qualified leads who complete purchase |
| **Purchase-to-Active Conversion** | TBD | +30% | % of purchased accounts processing payments |
| **Time to First Transaction** | TBD | -40% | Days from account creation to first payment processed |
| **Self-Serve Completion Rate** | TBD | 80%+ | % of low-GTV merchants completing without IC support |
| **High-GTV Retention in Onboarding** | TBD | 95%+ | % of high-GTV merchants who don't churn during setup |
| **AE/IC Efficiency** | TBD | +50% | Merchants handled per AE/IC with same quality |

---

## Solution Overview: 3-Stage, 10-Step Journey

### Three-Stage Framework

```
Stage 1: Qualify Leads → Stage 2: Buying Experience → Stage 3: Guided Setup
(Segment & Route)         (Convert & Sell)              (Onboard & Activate)
```

**Stage 1: Qualify Leads**
- **Input:** New interested leads from marketing
- **Process:** Collect qualifying information, profile into cohorts, assign selling plan
- **Output:** Qualified leads approved for LS Payments with assigned selling plan

**Stage 2: Buying Experience**  
- **Input:** Qualified leads with assigned selling plan
- **Process:** Guide through tailored buying flow (self-serve or assisted)
- **Output:** Sold accounts, hardware ordered, payments pre-approved, setup plan assigned

**Stage 3: Guided Setup**
- **Input:** Sold merchants with assigned setup plan  
- **Process:** Implementation support matched to cohort (self-serve, free IC, paid IC)
- **Output:** Fully onboarded merchants processing payments OR flagged cases for review

---

## Detailed Requirements: 10-Step Journey

### Merchant Cohorts & Path Assignment

**Cohort Criteria:**
- **Business Vertical:** Restaurant, Retail, Golf, etc.
- **Number of Locations:** Single vs. multi-location
- **Expected GTV:** Annual gross transaction volume
- **Complexity Factors:** Integration needs, data import volume, add-ons (B2B, eCommerce)
- **Payments Eligibility:** KYB pre-qualification results

**Primary Cohorts:**

| Cohort | GTV Range | Locations | Selling Plan | Setup Plan |
|--------|-----------|-----------|--------------|------------|
| **Self-Serve** | <$500K | 1-3 | Automated purchase | Self-serve guides + monitoring |
| **Assisted** | $500K-$2M | 3-10 | AE-guided with self-checkout | Free IC support |
| **Managed** | $2M+ | 10+ | AE negotiated pricing | Paid implementation package |

---

### Step-by-Step Requirements

## **STEP 1: Browse and Buy Decision**
**Stage:** Qualify Leads  
**Milestone:** Merchant understands value proposition and makes buy decision

### Merchant Experience
- **Sees:** Marketing site → Pricing page → Plan options
- **Does:** Reviews pricing, selects price bracket, clicks "Buy" or "Talk to an expert"

### System Requirements
- Capture selection and route appropriately
- Begin lead profile creation with price bracket signal

### Data Collected
- Region, Language
- Initial buy intent signal (self-serve vs. assisted)

---

## **STEP 2: Account Creation**  
**Stage:** Qualify Leads  
**Milestone:** Lead created, contact details captured, selling plan assigned

### Merchant Experience - All Paths
- **Sees:** Account creation form with contact details and business type
- **Does:** Enters name, email, phone, password, business category, annual revenue

### System Requirements
- Create lead record
- **Intelligent routing logic:**
  - Evaluate: price bracket + estimated GTV + business vertical
  - Assign selling plan: Self-serve, Assisted, or Managed
  - Route low-GTV to automated flow
  - Route high-GTV to AE scheduling

### Low GTV Path
- Proceed directly to Step 3 (KYB qualification)

### High GTV Path  
- **Sees:** "An AE will call within 15 minutes" + option to schedule later
- **Does:** Waits for call or books appointment
- **System triggers:** AE notification and scheduling workflow

### Data Collected
- Name, Email, Phone, Password
- Business category, Type of business, Annual revenue

---

## **STEP 3: Qualify for LS Payments (KYB)**
**Stage:** Qualify Leads  
**Milestone:** Merchant qualified for payment processing based on business vertical and KYB results

### Merchant Experience - All Paths
- **Sees:** Basic legal entity details form
- **Does:** Enters business structure, legal business name, EIN, registered business address

### System Requirements
- **Pass legal entity data to Payments Service for KYB checks**
- Run automated risk assessment
- **Decision point:**
  - ✅ Approved: Continue to Step 4
  - ⚠️ Review needed: Flag for manual review, may continue with conditions
  - ❌ Rejected: End flow, explain ineligibility

**Critical:** This must happen BEFORE hardware purchase to avoid shipping to ineligible merchants

### Data Collected
- Business structure
- Legal business name  
- Employer Identification Number (EIN)
- Registered business address

---

## **STEP 4: Define Software Requirements**
**Stage:** Buying Experience  
**Milestone:** Software license defined, X-Series account provisioned

### Low GTV Path (Self-Serve)
- **Sees:** Onboarding dashboard with subscription builder
- **Does:** Selects number of locations and registers
- **System:** Provisions X-Series account, updates running invoice total, logs merchant into dashboard

### High GTV Path (AE-Assisted)
- **Sees:** Shared quote in dashboard during AE call
- **Does:** Discusses subscription details with AE over phone
- **System:** AE configures subscription, generates quote

### Data Collected
- Number of location licenses
- Number of register licenses

---

## **STEP 5: Define Hardware Requirements**  
**Stage:** Buying Experience  
**Milestone:** Hardware package selected (POS + Payment hardware), quote generated

### Low GTV Path (Self-Serve)
- **Sees:** Recommended hardware bundles based on subscription needs + option to verify existing hardware compatibility
- **Does:** Selects hardware package OR enters existing hardware details
- **System:** Updates invoice total with hardware costs

### High GTV Path (AE-Assisted)
- **Sees:** Hardware options discussed during AE call
- **Does:** Reviews and approves hardware selection with AE guidance
- **System:** AE adds hardware to quote

### Data Collected
- Hardware bundle selection
- Existing hardware verification (if applicable)

---

## **STEP 6: Payment for Software, Hardware, Launch Package**
**Stage:** Buying Experience  
**Milestone:** Software and hardware purchased, billing/shipping details collected

### Low GTV Path (Self-Serve)
- **Sees:** Quote with itemized totals (software + hardware + payment rates + optional launch package), payment form
- **Does:** Reviews quote, enters payment details, billing address, shipping address, completes purchase
- **System:** Processes payment, emails invoice, activates subscription, triggers shipment

### High GTV Path (AE-Assisted)  
- **Sees:** Finalized quote email from AE
- **Does:** Reviews negotiated terms, completes payment online
- **System:** AE uploads finalized quote → merchant receives notification → completes payment → activates subscription

### Data Collected
- Payment details
- Billing address
- Shipping address

---

## **STEP 7: Lightspeed Payments Activation (KYC)**
**Stage:** Guided Setup  
**Milestone:** Lightspeed Payments activated per location, payouts paused pending further review

### Merchant Experience - All Paths
- **Sees:** Onboarding dashboard showing paid invoice, shipment tracking, **additional Payments fields** (business representative + owners)
- **Does:** Enters business representative details + all business owner details, verifies/corrects location addresses

### System Requirements
- **Run KYC checks on all persons**
- Execute automated underwriting  
- **Sync business details with X-Series** to update account with location information
- Activate payments per location
- **Hold payouts** until bank account verified (Step 9)
- **If additional underwriting needed:** Surface document requests or communication needs on dashboard

### Data Collected
- Business representative details (name, email, SSN, DOB, address, role)
- Business owner details (name, email, SSN, DOB, address, ownership %, role)
- Location addresses (DBA, phone, address per location)

---

## **STEP 8: Data Import**
**Stage:** Guided Setup  
**Milestone:** Historical data imported, merchant can discontinue legacy POS

### Low GTV Path (Self-Serve)
- **Sees:** Option to import data or start from scratch
- **Does:** Selects data import → follows import wizard → uploads CSVs → maps fields → runs import
- **System:** Validates data, imports products/customers/sales history, updates reporting

### High GTV Path (IC-Assisted)
- **Sees:** Option to book onboarding session with IC  
- **Does:** Books session, shares CSVs with IC during call
- **System:** IC uses internal tools to import and configure data during session

### Data Collected
- (Data imported, not new merchant data collected)

---

## **STEP 9: Setup Hardware**
**Stage:** Guided Setup  
**Milestone:** All hardware configured, first test payment processed, payouts enabled

### Low GTV Path (Self-Serve)
- **Sees:** Hardware delivery notification + in-product setup instructions
- **Does:** Follows guides to set up register, scanner, printer, terminal → runs test transaction → **enters bank details for payouts**
- **System:** Guides hardware setup, **runs bank account verification checks**, **enables payouts** when verified

### High GTV Path (IC-Assisted)
- **Sees:** Hardware delivery notification + option to schedule IC session
- **Does:** Books first onboarding session → works with IC to set up all hardware → runs first test transaction → **enters bank account details**
- **System:** IC guides setup, **bank verification completes**, **payouts enabled**

### Data Collected
- **Payout bank account** (account holder name, account number, routing number, etc.)

### Critical Milestone
**This is where payouts are enabled** after bank account verification, completing the underwriting process.

---

## **STEP 10: Final Config, Integrations and Upsells**  
**Stage:** Guided Setup  
**Milestone:** Merchant has everything to go live

### Low GTV Path (Self-Serve)
- **Sees:** Onboarding dashboard with instructions for eCommerce, NuOrder, accounting integrations, other setup tasks
- **Does:** Follows in-product guides to complete setup
- **System:** Provides setup guides, confirms completion of integrations

### High GTV Path (IC-Assisted)
- **Sees:** Onboarding dashboard with options to schedule IC sessions for each integration
- **Does:** Books calls with IC, works through each setup step
- **System:** IC schedules sessions, guides merchant through setup, confirms integrations complete

### Data Collected
- Integration preferences
- Additional feature activation flags

---

## Technical Requirements

### System Architecture Changes

**New Components Needed:**
1. **Lead Profiling Engine**
   - Evaluates: GTV signals, business vertical, complexity factors
   - Assigns: Selling plan (self-serve, assisted, managed)
   - Assigns: Setup plan (self-serve, free IC, paid IC)

2. **Unified Onboarding Dashboard**
   - Single source of truth for merchant progress
   - Shows: Steps completed, next actions, support options
   - Handles: Quote display, payment processing, shipment tracking

3. **Smart Routing Logic**
   - Routes high-GTV to AE queue with SLA
   - Routes self-serve through automated flows
   - Detects stalls and triggers intervention

4. **Progress Tracking & Monitoring System**
   - Tracks completion of each step per merchant
   - Flags: Abandoned carts, stalled setups, blocked merchants
   - Alerts: IC/AE teams when intervention needed

5. **Data Sync Layer**
   - Synchronizes: Marketing lead data → Sales CRM → X-Series → Payments
   - Eliminates: Redundant data entry
   - Passes context forward at each stage

### Integration Points

**Existing Systems:**
- Marketing website (lead capture)
- Sales CRM (AE/IC assignment and tracking)
- X-Series provisioning (account creation)
- Payments Onboarding Service (KYB/KYC flows)
- Hardware ordering/shipping system
- Billing/payment processing

**Data Flow:**
```
Marketing → Lead Profile → Selling Plan Assignment →
Self-Serve OR AE-Assisted Purchase →
X-Series Account Provisioned →
Payments KYC/KYB (parallel with hardware shipment) →
Setup Plan Assignment →
Guided Setup (self-serve OR IC-assisted) →
Active Merchant
```

---

## User Stories

### Self-Serve Merchant (Low GTV)
**As a** small retail merchant with 1 location  
**I want to** purchase and set up my POS system entirely online  
**So that** I can start accepting payments quickly without waiting for sales calls

### Assisted Merchant (Mid GTV)  
**As a** growing restaurant group with 5 locations  
**I want to** get expert guidance on my setup while still having control of my timeline  
**So that** I can make informed decisions but move at my own pace

### Managed Merchant (High GTV)
**As a** large retail chain with 50+ locations  
**I want** dedicated implementation support and custom pricing  
**So that** I can ensure smooth rollout across my entire business

### Account Executive
**As an** AE handling high-value merchants  
**I want** qualified leads routed to me with full context  
**So that** I can focus on value conversation, not data gathering

### Implementation Consultant
**As an** IC supporting merchant onboarding  
**I want** to see which merchants are stalled and need help  
**So that** I can proactively reach out and guide them to completion

---

## Implementation Approach

### Phase 1: Foundation (MVP)
**Goal:** Establish basic cohort routing and data collection flow

**Scope:**
- Lead capture with qualifying questions
- Basic cohort assignment (self-serve vs. assisted)
- Route high-GTV to AE, low-GTV continues automated
- KYB qualification before hardware purchase
- Unified dashboard showing all steps

**Out of Scope:** Smart interventions, advanced monitoring

---

### Phase 2: Enhanced Self-Serve  
**Goal:** Optimize automated flow for low-GTV merchants

**Scope:**
- In-product guides for each setup step
- Progress tracking visible to merchant
- Automated hardware setup instructions
- Data import wizard
- Self-serve bank account connection

**Out of Scope:** IC scheduling, white-glove features

---

### Phase 3: Assisted & Managed Paths
**Goal:** Build high-touch support workflows

**Scope:**
- IC scheduling and session management
- AE quote builder and negotiation tools
- Shared dashboard for AE/IC and merchant
- Communication tracking (calls, emails, sessions)

**Out of Scope:** Advanced analytics, predictive intervention

---

### Phase 4: Intelligence & Optimization
**Goal:** Add monitoring, interventions, and continuous improvement

**Scope:**
- Drop-off detection and alerts
- Automated nudges and reminders
- Stall detection with IC/AE routing
- A/B testing framework for onboarding flows
- Analytics dashboard for ops team

---

## Open Questions

1. **Trial Access:** Do we want to provide a path for prospect merchants to access a trial, explore, and set up the product before purchase? OR should buy decision happen first?

2. **Cohort Thresholds:** What are the exact GTV/location/complexity thresholds for assigning selling and setup plans?

3. **AE Capacity:** What is realistic SLA for AE calls? Can we guarantee "15 minutes" or should we set expectations differently?

4. **IC Pricing:** For paid implementation packages, what is the pricing model? Fixed fee? Per-location? Per-hour?

5. **Hardware Verification:** If merchants have existing compatible hardware, how do we verify compatibility without manual review?

6. **Intervention Triggers:** At what point do we auto-escalate a self-serve merchant to IC support? (e.g., 3 days stalled, 2 failed attempts)

---

## Success Criteria

**Launch Readiness Checklist:**
- [ ] Cohort assignment logic tested and accurate
- [ ] All 10 steps functional for self-serve path
- [ ] All 10 steps functional for assisted path  
- [ ] AE routing and queue management working
- [ ] IC scheduling system operational
- [ ] KYB qualification happens before hardware purchase
- [ ] Data sync working across all systems
- [ ] Dashboard shows accurate progress for all merchants
- [ ] Payment processing and hardware shipment coordinated
- [ ] Monitoring and alerting configured

**Post-Launch:**
- Monitor conversion metrics at each stage
- Track time-to-completion by cohort
- Measure AE/IC efficiency gains
- Gather merchant feedback on experience
- Identify and address drop-off points

---

## Appendix: Data Collection Summary

### Data Collected Across Journey

| Step | Data Collected |
|------|----------------|
| 1. Browse/Buy | Region, Language |
| 2. Account Creation | Name, Email, Phone, Password, Business category, Annual revenue, Type of business |
| 3. KYB Qualification | Business structure, Legal business name, EIN, Registered business address |
| 4. Software Requirements | Number of location licenses, Number of register licenses |
| 5. Hardware Requirements | Hardware bundle selection |
| 6. Payment | Payment details, Billing address, Shipping address |
| 7. KYC/Payments Activation | Business representative details, Business owner details, Location addresses (DBA per location) |
| 8. Data Import | (Historical data imported) |
| 9. Hardware Setup | **Payout bank account** |
| 10. Final Config | Integration preferences |

**Total Merchant Account Data:** Comprehensive profile enabling both X-Series account operation and Lightspeed Payments processing

---

## Document Control

**Version:** 1.0  
**Author:** Product Lead, Fintech  
**Last Updated:** October 2025  
**Status:** Draft for Review  
**Next Steps:** Design wireframes, Technical feasibility assessment, Prioritize phases