# Onboarding Transformation: Three-Pillar Strategy

## The Problem

**Merchants face unnecessary friction and delays getting started—forced to re-enter information across multiple systems, wait for sales calls they don't want, and navigate a process that doesn't fit their timeline. Result: 33 days average to first transaction and 86.5% abandonment.**

Current flow: Free trial signup → Salesforce MQL → Rep qualifies → SDR sells → 70% of Ignite never transact → Cancel

### What We're Hearing

> "Merchants are left uncertain about ownership, eroding trust and continuity. ICs often start from scratch without context from the AE relationship."
> — AE/IC Interview Feedback

> "Merchants must re-enter the same business details across multiple LS Pay forms and portals, creating inefficiency and a poor user experience."
> — AE/IC Interview Feedback

> "AEs report an increasing volume of leads that are not a good fit for Lightspeed. These customers have low long-term value and are highly likely to churn. They often switch to competitors (e.g., Square) offering simpler onboarding or cheaper pricing."
> — AE/IC Interview Feedback

**Results**:
- **86.5% of qualified leads lost** before reaching 10CD activation
- **33 days average** from signup to first transaction (highly variable by readiness)
  - Fast track: Ignite merchants can activate in 24 hours when ready
  - Slow track: Some take months (business not set up yet, still planning)
  - Problem: One-size-fits-all process can't accommodate both extremes
- **19.2% abandon LSPay application** due to redundant data entry and form fatigue
- **No self-serve path exists**: Immediate sales involvement blocks merchants who want to try product independently
- **Split billing creates confusion**: Software (Chargeify) and hardware (Ecwid) billed separately, making hardware feel like a "hidden cost"
- **Sales capacity misallocated**: Reps spending time on merchants who want to self-serve OR aren't ready yet

---

## Root Cause: Three Interconnected Problems

### Problem 1: Sales Owns the Front Door

**Current State**:
```
Merchant clicks "Start Free Trial"
         ↓
Sent to Salesforce (MQL)
         ↓
Rep calls immediately to qualify
         ↓
If qualified → SDR walks through:
  - LSPay application
  - Software purchase
  - Hardware ordering
         ↓
Often converts to Ignite plan ($5/mo)
         ↓
70% never go transactional
         ↓
Cancel (wasted sales time + IC capacity)
```

**Why This Fails**:
- 30-35% are self-serve merchants who want to try product, not wait for calls
- Sales can't scale without scaling headcount 1:1 with lead volume
- Product team can't optimize activation flow (Sales owns conversion)
- No cohort segmentation → same rigid process for $5/mo and $2M merchants

---

### Problem 2: Fragmented Data Systems

**Current Reality**: Merchants re-enter the same information 3-4 times:

1. **Salesforce** (AE captures business info during sales call)
2. **LSPay application** (business structure, EIN, address, all owners with SSN/DOB)
3. **Hardware ordering** (shipping address, business name, contact)
4. **X-Series setup** (locations, registers, business details)

**Why This Fails**:
- **19.2% abandon LSPay application** due to form fatigue (Code Yellow data)
- Each system acts as standalone silo → no data sharing
- Handoffs require external redirects and context switching
- Merchants (and Lightspeed) don't know where they are in the process (no unified view)

**From AE Interviews**:
> "Merchants must re-enter the same business details across multiple LS Pay forms and portals, creating inefficiency and a poor user experience."

---

### Problem 3: Split Billing Creates Confusion

**Current Reality**:
- Software billed through Chargeify
- Hardware billed through Ecwid (separate checkout)
- Two systems, two receipts, two billing relationships

**Why This Fails**:

**For Merchants**:
- Hardware appears as "hidden cost" after software purchase
- Confusion about total monthly cost
- Two separate checkout processes create friction

**For AEs** (from interviews):
> "Hardware appears as an additional hidden cost, making it harder to sell. Some AEs manually combine quotes to set expectations, but this is not standardized."

- AEs not compensated for hardware sales → lower prioritization
- Result: Unsupported third-party hardware approved to close deals
- Downstream: Hardware setup issues, increased support burden

**For Operations**:
- "Closed Won" defined as software activation only (excludes hardware)
- Creates confusion about merchant readiness
- Incentive misalignment: AEs paid before merchant can transact

---

### Why These Three Problems Are Connected

```
Problem 1: Sales Owns Front Door
    ↓
    Can't collect comprehensive data at signup
    ↓
Problem 2: Fragmented Data Systems
    ↓
    Forces merchants to re-enter info multiple times
    ↓
    19.2% abandon LSPay application
    +
Problem 3: Split Billing
    ↓
    Hardware feels like "hidden cost"
    ↓
    AEs don't sell hardware properly
    ↓
    Downstream setup issues

= 86.5% ABANDONMENT
```

**You can't fix one without fixing all three.**

---

## The Three-Pillar Solution

### Core Insight

Fixing onboarding requires three interconnected changes:

```
┌─────────────────────────────────────────────────────────────┐
│  PILLAR 1: Product-Owned Front Door                         │
│  → Collect data once at signup                              │
│  → Assign cohort based on revenue/locations                 │
│  → Provision X-Series account                               │
│                                                              │
│              ↓ ENABLES ↓                                     │
│                                                              │
│  PILLAR 2: Unified Data Flow                                │
│  → Signup data flows to LSPay, Hardware, X-Series           │
│  → Pre-fills all forms (eliminate 3-4x re-entry)            │
│  → Benefits ALL cohorts (Self-Serve, Assisted, Managed)     │
│                                                              │
│              ↓ ENABLES ↓                                     │
│                                                              │
│  PILLAR 3: Unified Purchase Experience                      │
│  → Single checkout: software + hardware together            │
│  → Clear total cost, one receipt, one transaction           │
│  → Aligns AE incentives (paid on complete solution)         │
└─────────────────────────────────────────────────────────────┘
```

**Why all three matter**:
- **Front Door alone** = still fragmented data systems downstream
- **Data Flow alone** = still split billing confusion
- **Unified Purchase alone** = still manual data re-entry

**Together**: Merchant enters info once → sees one price → checks out once → gets activated fast

---

## Pillar 1: Product-Owned Front Door

### What Changes

**Before**: Sales owns signup → Salesforce MQL → Rep qualifies → Routes merchant

**After**: Product owns signup → Cohort auto-assigned → Routes to appropriate experience

### The New Signup Flow

**Page 1: Account Creation**
- Name, email, password
- Business name, phone

**Page 2: Business Profiling** (This enables everything else)
- Business category
- Business website (for TrueBiz verification & data enrichment)
- Business address
- **Annual revenue** (dropdown: <$100K, $100K-$250K, etc.)
- **Number of locations** (numeric input)

**Behind the Scenes**:
1. **TrueBiz verification** → Enriches data with EIN, business structure, verified address
2. **Cohort assignment** → Based on revenue + locations
3. **X-Series account provisioned** → Merchant lands in dashboard
4. **Route to experience** → Self-Serve, Assisted, or Managed

**No Salesforce MQL created for Self-Serve.** Product owns these merchants.

---

### Cohort Routing Logic

| Cohort | Revenue | Locations | Experience | Sales Touch |
|--------|---------|-----------|------------|-------------|
| **Self-Serve** | <$500K | 1-3 | Automated activation | None (unless requested) |
| **Assisted** | $500K-$2M | 3-10 | Hybrid (optional AE/IC) | AE notified, can reach out |
| **Managed** | $2M+ | 10+ | White-glove implementation | AE calls within 1 hour |

### Why This Matters

**Enables Cohort-Specific Experiences**:
- Self-Serve: Product-led activation, zero sales time
- Assisted: Merchant controls pace (self-serve OR get help)
- Managed: High-touch from day 1, no competing with low-value leads

**Enables Data Collection**:
- Comprehensive business data captured once at signup
- Flows downstream to LSPay, Hardware, X-Series (Pillar 2)

**Enables Product Iteration**:
- Product team owns conversion optimization
- Can A/B test, instrument, measure
- Not dependent on Sales process changes

---

## Pillar 2: Unified Data Flow

### What Changes

**Before**: Merchant re-enters same information 3-4 times across disconnected systems

**After**: Merchant enters information once at signup → flows everywhere automatically

### The Data Flow Architecture

```
┌──────────────────────────────────────┐
│   Signup Form (Product-Owned)        │
│   → Business name, category, address │
│   → Revenue, locations, website      │
└───────────────┬──────────────────────┘
                ↓
┌──────────────────────────────────────┐
│   TrueBiz Enrichment                 │
│   → Adds: EIN, business structure    │
│   → Verifies: Address, business type │
└───────────────┬──────────────────────┘
                ↓
        ┌───────┴───────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  LSPay App   │ │  Hardware    │ │  X-Series    │
│  (Pre-filled)│ │  (Pre-filled)│ │  (Pre-filled)│
└──────────────┘ └──────────────┘ └──────────────┘
```

### What Gets Pre-Filled

**LSPay Application**:
- ✅ Business name (from signup)
- ✅ Business address (from signup, verified by TrueBiz)
- ✅ EIN (from TrueBiz enrichment)
- ✅ Business structure (from TrueBiz enrichment)
- ⭕ Merchant only adds: Owner details (SSN, DOB), bank account

**Hardware Ordering**:
- ✅ Shipping address (from signup)
- ✅ Business name (from signup)
- ✅ Contact info (from signup)
- ⭕ Merchant only adds: Device selection, quantity

**X-Series Configuration**:
- ✅ Business name (from signup)
- ✅ Number of locations (from signup)
- ✅ Business category (from signup)
- ⭕ Merchant only adds: Product catalog, register setup, customizations

---

### Impact by Cohort

**Self-Serve Merchants**:
- Faster activation (eliminates 15-20 min of form re-entry)
- Less friction → higher conversion
- Can complete LSPay + Hardware in single session

**Assisted Merchants**:
- AE spends less time filling forms on behalf of merchant
- Can focus on consultation, not data entry
- Merchant can self-complete forms between calls

**Managed Merchants**:
- IC can pre-configure account before kickoff call
- First session focuses on strategy, not data collection
- Faster time to go-live

---

### Quantified Benefit

**Current State**:
- 70% of eligible merchants apply for LSPay
- 19.2% abandon between eligibility and application (Code Yellow data)
- Root cause: Form fatigue from re-entering same data

**New State**:
- Pre-filled forms reduce abandonment from 19.2% to <10%
- Net gain: ~150 additional LSPay approvals per year
- At $10K avg LTV per merchant = **$1.5M additional annual revenue**

**Benefits ALL cohorts** (not just Self-Serve):
- Self-Serve: 400 merchants/year × 15 min saved = 100 hours/year
- Assisted: 600 merchants/year × 30 min saved (AE + merchant) = 300 hours/year
- Managed: 300 merchants/year × 45 min saved (IC + merchant) = 225 hours/year

**Total time savings: 625 hours/year across all cohorts**

---

## Pillar 3: Unified Purchase Experience

### What Changes

**Before**: Software (Chargeify) and hardware (Ecwid) billed separately

**After**: Single checkout for software subscription + hardware (one-time)

### The New Purchase Flow

**Current Fragmented Experience**:
```
Merchant completes LSPay application
    ↓
Buys software subscription (Chargeify)
    → $89/month for Starter plan
    ↓ (SEPARATE PROCESS)
Redirected to hardware store (Ecwid)
    → $450 for terminal + printer
    ↓
Two checkouts, two receipts, two emails
    → Confusion about total cost
```

**New Unified Experience**:
```
Task 2: Hardware Selection (in dashboard)
    ↓
Merchant selects:
  • 2× Terminals ($200 each)
  • 1× Receipt Printer ($50)
    ↓
Sees pricing summary:
  • Software: $89/month (Starter plan)
  • Hardware: $450 (one-time)
  • Total today: $539 ($450 hardware + $89 first month)
  • Recurring: $89/month
    ↓
[Complete Purchase] → Single checkout
    ↓
Confirmation: Software activated + Hardware ships in 3 days
```

---

### Why This Matters

**For Merchants**:
- Clear total cost upfront (no surprises)
- One decision, one purchase, one receipt
- Hardware doesn't feel like "hidden cost"

**For AEs**:
- Can quote complete solution (software + hardware together)
- **Incentive alignment**: Paid on full deal, not just software
- Result: Properly specced hardware, not third-party workarounds

**For Operations**:
- Enables "Closed Won" redefinition:
  - Old: Software activation only
  - New: Software + hardware purchased + LSPay approved
- AE incentives align with merchant readiness (not just software activation)

---

### AE Behavior Change

**Current Incentives**:
- AEs paid on software activation only
- Hardware sales = $0 commission
- Result: "Whatever hardware you want is fine" (to close deal faster)
- Outcome: Unsupported devices, setup issues, support burden

**New Incentives**:
- AEs paid on software + hardware
- Hardware becomes part of solution, not afterthought
- Result: AEs recommend proper hardware for merchant's use case
- Outcome: Better hardware attachment, fewer setup issues

**From AE Interviews**:
> "AEs are not compensated for hardware sales, leading to lower prioritization. This results in unsupported third-party hardware being approved to close deals — causing downstream onboarding and support issues."

---

### Quantified Benefit

**Current State**:
- Hardware attachment rate: ~60% (estimated)
- Third-party hardware issues: ~30% of hardware setup support tickets

**New State**:
- Hardware attachment rate: 85%+ (AEs incentivized to sell)
- Third-party hardware issues: Reduce by 70% (proper devices specified)

**Financial Impact**:
- Additional hardware revenue: 25% increase × 1,300 merchants/year × $400 avg = **$130K/year**
- Support cost savings: 70% reduction in hardware tickets × 500 tickets/year × $50/ticket = **$17.5K/year**
- AE productivity: Less time troubleshooting bad hardware = 100 hours/year saved

**Total annual impact: $150K-$200K** (revenue + cost savings)

---

## How the Three Pillars Work Together

### Example: Self-Serve Merchant Journey

**Step 1: Signup (Pillar 1 - Front Door)**
- Merchant completes 2-page signup
- Data collected: Revenue <$100K, 1 location
- Cohort assigned: Self-Serve
- X-Series account provisioned
- Lands in dashboard

**Step 2: Dashboard Tasks (Pillar 2 - Data Flow)**
- Task 1: Verify Identity → LSPay application pre-filled with signup data
  - Merchant only adds: Owner SSN/DOB, bank account
  - Time to complete: 5 min (vs. 20 min today)
- Task 2: Hardware Selection → Shipping address pre-filled
  - Merchant only adds: Device selection
  - Sees total price: Software + hardware

**Step 3: Purchase (Pillar 3 - Unified Checkout)**
- Merchant clicks "Complete Purchase"
- Single checkout: $89/month software + $250 hardware (terminal)
- Confirmation: "Software activated! Hardware ships in 3 days."
- One receipt, clear next steps

**Result**: Merchant goes from signup → first transaction in <7 days (vs. 33 days today)

---

### Example: Assisted Merchant Journey

**Step 1: Signup (Pillar 1)**
- Merchant completes signup
- Revenue $750K, 4 locations
- Cohort: Assisted
- AE (Sarah) auto-notified in Salesforce

**Step 2: Dashboard (Pillar 2)**
- Merchant lands in dashboard, sees Sarah's contact card
- Can self-complete tasks OR schedule AE call
- Chooses: "Schedule 15-min call"

**Step 3: AE Call**
- Sarah reviews pre-filled data (no need to re-ask basic info)
- Focuses on: Business goals, payment volume, hardware needs
- Recommends: 2× terminals, 1× printer, Starter plan

**Step 4: Purchase (Pillar 3)**
- Sarah sends custom quote: $89/month + $450 hardware
- Merchant sees total cost, completes purchase
- Sarah paid on full deal (software + hardware)

**Result**: Merchant feels supported, AE focuses on value (not data entry), hardware properly specced

---

### Example: Managed Merchant Journey

**Step 1: Signup (Pillar 1)**
- Merchant completes signup
- Revenue $5M, 15 locations
- Cohort: Managed
- High-priority AE (John) notified, calls within 1 hour

**Step 2: Discovery Call (Pillar 2 Benefits AE)**
- John reviews pre-filled data before call
- Already knows: 15 locations, $5M revenue, business category
- Call focuses on: Multi-location strategy, payment processing needs, integration requirements

**Step 3: Custom Implementation (Pillar 3)**
- John creates custom quote: Enterprise plan + hardware for 15 locations
- Single purchase: Software subscription + hardware (one transaction)
- IC (assigned at signup) begins pre-configuring account using signup data

**Result**: Enterprise merchant gets white-glove experience, IC starts work immediately (no waiting for data collection)

---

## Financial Impact: All Three Pillars

### Pillar 1: Product-Owned Front Door (Self-Serve Cost Savings)

**Current State Costs** (Per 100 Self-Serve Leads):
- Sales/IC labor: 300 hours @ ~$75/hr = **$22.5K**
- Free terminals given: ~20 conversions × $200 = **$4K**
- Terminal waste (70% churn): ~14 wasted terminals = **$2.8K**
- Sales commissions: **~$200-500** (low value deals)
- **Total cost per 100 leads: $27K-$30K**

**New State Economics** (Per 100 Self-Serve Leads):
- Sales/IC labor: **$0** (self-serve)
- Terminal strategy: **$0-$6K** depending on policy (earn-it vs. free models)
- Sales commissions: **$0** (no sales touch)
- **Total cost per 100 leads: $0-$6K**

**Net Savings**:
- **$21K-$27K per 100 leads**
- At 400 Self-Serve leads/month = **$1.0M-$1.3M annual savings**

---

### Pillar 2: Unified Data Flow (LSPay Conversion Improvement)

**Current State**:
- LSPay eligibility → application: 19.2% drop-off (Code Yellow data)
- Root cause: Form fatigue from re-entering same data
- Lost merchants: ~250/year abandon LSPay application

**New State**:
- Pre-filled LSPay application reduces drop-off from 19.2% to <10%
- Net gain: ~150 additional LSPay approvals per year

**Revenue Impact**:
- 150 merchants/year × $10K avg LTV = **$1.5M additional annual revenue**
- **Applies to ALL cohorts** (Self-Serve, Assisted, Managed)

---

### Pillar 3: Unified Purchase (Hardware Attachment + AE Productivity)

**Hardware Attachment Rate**:
- Current: ~60% attach hardware
- New: 85%+ (AEs incentivized, clearer pricing)
- Net gain: 25% increase × 1,300 merchants/year × $400 avg hardware = **$130K/year**

**Support Cost Savings**:
- Reduce third-party hardware issues by 70%
- 500 tickets/year × 70% × $50/ticket = **$17.5K/year**

**AE Productivity**:
- Less time on billing confusion and hardware troubleshooting
- ~100 hours/year saved across sales team

**Total Pillar 3 Impact**: **$150K-$200K/year**

---

### Combined Annual Impact

| Pillar | Annual Impact | Applies To |
|--------|---------------|------------|
| **Pillar 1**: Product-Owned Front Door | **$1.0M-$1.3M** (cost savings) | Self-Serve only |
| **Pillar 2**: Unified Data Flow | **$1.5M** (revenue) | ALL cohorts |
| **Pillar 3**: Unified Purchase | **$150K-$200K** (revenue + savings) | ALL cohorts |
| **TOTAL** | **$2.65M-$3.0M** | - |

**Plus scale opportunity**: Can 10x Self-Serve volume without proportional cost increase

---

## Implementation Sequence

### Phase 0: Strategic Alignment (REQUIRED FIRST)
**Goal**: Get executive buy-in on all three pillars

- [ ] **Executive decision**: Commit to all three pillars? (Go/No-Go)
- [ ] **Sales leadership buy-in**: Show how this benefits AEs (hardware commissions, better leads)
- [ ] **Define "Closed Won"**: Software + hardware + LSPay approved (not just software)
- [ ] **Set abort criteria**: What metrics would cause us to revert?
  - Suggested: If Self-Serve conversion <20% after pilot

**Success Criteria**: Signed executive approval to proceed

---

### Phase 1: Build Core Infrastructure
**Goal**: Product-owned signup + basic data flow + unified purchase (MVP)

**Scope**:
- [ ] **New signup flow** (2 pages, product-owned)
- [ ] **TrueBiz integration** (enrichment: EIN, business structure)
- [ ] **Cohort assignment logic** (revenue + locations → Self-Serve/Assisted/Managed)
- [ ] **X-Series provisioning** (auto-create account at signup)
- [ ] **Data schema design** (define what flows from signup to LSPay, Hardware, X-Series)
- [ ] **Basic dashboard** (Self-Serve only, 5-task progress tracker)
- [ ] **LSPay pre-fill logic** (signup data → pre-fill application)
- [ ] **Unified purchase flow** (single checkout: software + hardware)

**Explicitly OUT OF SCOPE for Phase 1**:
- ❌ Salesforce integration (manual CSV export acceptable)
- ❌ Assisted/Managed dashboards (focus on Self-Serve first)
- ❌ Advanced PLG features (email sequences, in-app triggers)

**Why This Scope**: Proves all three pillars work together with minimal dependencies

**Success Criteria**:
- Self-Serve merchant can signup → land in dashboard → complete LSPay (pre-filled) → purchase (software + hardware) → convert

---

### Phase 2: Pilot & Validate
**Goal**: Test all three pillars with real merchants

**Scope**:
- [ ] Route 100-200 Self-Serve signups through new flow
- [ ] Measure impact of each pillar:
  - **Pillar 1**: Signup completion rate, cohort assignment accuracy
  - **Pillar 2**: LSPay application completion rate (pre-filled vs. old), time savings
  - **Pillar 3**: Hardware attachment rate, unified purchase completion rate
- [ ] Collect qualitative feedback:
  - Merchant: "Did pre-filled forms save time?"
  - Merchant: "Was pricing clear with unified checkout?"
- [ ] Identify friction points and iterate

**Decision Point**:
- **If conversion ≥25%**: Proceed to Phase 3 (scale)
- **If conversion 20-24%**: Iterate for another pilot cycle
- **If conversion <20%**: Reassess (may need more guidance/support)

**Success Criteria**:
- ≥25% Self-Serve conversion rate
- LSPay completion rate >85% (vs. 70% today)
- Hardware attachment rate >80%

---

### Phase 3: Scale Self-Serve
**Goal**: Route all Self-Serve merchants through new flow

**Scope**:
- [ ] Route all <$500K signups to new flow (no more automatic sales calls)
- [ ] Train AE/IC teams on new handoff rules:
  - Self-Serve: Only engage if merchant clicks "Talk to Sales"
  - Assisted/Managed: Continue with existing support model (for now)
- [ ] Build analytics dashboard:
  - Track: Signup → LSPay → Purchase → Transaction funnel
  - Monitor: Drop-off points, time to complete each task
- [ ] Establish optimization cadence (weekly reviews, A/B tests)

**Success Criteria**:
- 30%+ Self-Serve conversion rate sustained over 3 months
- LSPay drop-off <10% (vs. 19.2% today)
- Hardware attachment >85%

---

### Phase 4: Extend to Assisted & Managed Cohorts
**Goal**: All cohorts benefit from three pillars

**Scope**:
- [ ] Build Assisted dashboard:
  - Same task structure + pre-filled data
  - AE contact card always visible
  - "Schedule call" vs. "Continue on my own" options
- [ ] Build Managed dashboard:
  - Same task structure + pre-filled data
  - Dedicated AE/IC assigned at signup
  - Implementation timeline visible
- [ ] Salesforce integration:
  - Self-Serve: No MQL unless help requested
  - Assisted: Auto-create MQL, notify AE
  - Managed: Auto-create MQL, high-priority queue
- [ ] AE training on unified purchase:
  - How to quote software + hardware together
  - Commission structure change (paid on full deal)

**Success Criteria**:
- All three cohorts using unified flow
- Assisted conversion rate >60%
- Managed conversion rate >80%
- AE satisfaction with unified purchase (survey)

---

### Phase 5: Advanced Optimization
**Goal**: Maximize conversion through PLG enhancements

**Scope**:
- [ ] Advanced email sequences (behavior-triggered, personalized)
- [ ] In-app celebration moments (task completion animations)
- [ ] A/B testing framework (test messaging, task ordering, CTAs)
- [ ] AI-powered chat support (deflect simple questions)
- [ ] Predictive analytics (identify at-risk merchants, trigger interventions)

**Success Criteria**:
- Incremental lift in Self-Serve conversion (30% → 35%+)
- Reduced support ticket volume (AI deflection working)

---

## Sequencing & Dependencies

**Critical Path**:
```
Phase 0 (Alignment - ALL 3 pillars)
    ↓
Phase 1 (Build Core - ALL 3 pillars together)
    ↓
Phase 2 (Pilot - validate ALL 3 pillars)
    ↓
    Decision Point: Do all 3 pillars work?
    ├─→ YES: Phase 3 (Scale Self-Serve)
    └─→ NO: Iterate or abort
    ↓
Phase 3 (Scale Self-Serve with all 3 pillars)
    ↓
Phase 4 (Extend to Assisted/Managed)
    ↓
Phase 5 (Advanced Optimization)
```

**Key Dependencies**:
- **Phase 1 must include all 3 pillars** (not just front door)
  - Front door enables data collection
  - Data flow enables pre-filling
  - Unified purchase completes the experience
- **Phase 2 validates all 3 pillars together** (not separately)
- **Phases 4 & 5 can overlap** (different teams, different scope)

**Why This Sequencing**:
- Proves all three pillars work together in Phase 1 (de-risks)
- Validates with real merchants in Phase 2 (learns fast)
- Scales only after validation (doesn't waste effort)

---

## Strategic Decisions Required

### Decision 1: Commit to All Three Pillars? (YES/NO)

**YES means**:
- Product owns signup flow (Pillar 1)
- Build unified data flow from day 1 (Pillar 2)
- Unify software + hardware purchase (Pillar 3)
- Redefine "Closed Won" to include hardware + LSPay
- Change AE commission structure (paid on full deal)

**NO means**:
- We continue fragmented systems
- Merchants continue re-entering data 3-4x
- Split billing continues to confuse
- 19.2% LSPay drop-off persists
- This entire strategy doesn't work

**Recommendation**: YES. All three pillars are interdependent. Partial implementation delivers partial results.

---

### Decision 2: Redefine "Closed Won" to Include Hardware + LSPay? (YES/NO)

**YES means**:
- AEs paid when: Software activated + Hardware purchased + LSPay approved
- Aligns incentives with merchant readiness
- AEs care about complete solution, not just software activation

**NO means**:
- AEs continue to be paid on software only
- Hardware remains deprioritized
- Split billing confusion persists
- Pillar 3 delivers limited benefit

**Recommendation**: YES. Without incentive alignment, Pillar 3 (unified purchase) won't change AE behavior.

---

### Decision 3: Start with Self-Serve or All Cohorts? (SELF-SERVE / ALL)

**SELF-SERVE means**:
- Phase 1 builds for Self-Serve only
- Proves model with least dependencies
- Extends to Assisted/Managed in Phase 4
- Lower risk, faster iteration

**ALL means**:
- Phase 1 builds for all three cohorts
- Longer build time, more complexity
- Higher risk if something doesn't work

**Recommendation**: SELF-SERVE. Validate with smallest scope first, then extend. All three pillars benefit Self-Serve merchants immediately. Assisted/Managed get benefits in Phase 4.

---

## What Makes This Different

### This Isn't Just "Build a Dashboard"

This is a **fundamental transformation in how merchants experience onboarding**:

**Before**:
- Fragmented systems (Salesforce → LSPay → Hardware → X-Series)
- Re-enter data 3-4x
- Split billing (software vs. hardware)
- One-size-fits-all process
- 86.5% abandonment

**After**:
- Single front door (Product-owned signup)
- Enter data once (flows everywhere)
- Unified purchase (software + hardware together)
- Cohort-specific experiences
- **Target: 70%+ activation** (5x improvement)

---

### This Benefits ALL Cohorts, Not Just Self-Serve

**Self-Serve**:
- Pillar 1: Can activate without sales calls (product-led)
- Pillar 2: Faster activation (pre-filled forms)
- Pillar 3: Clear pricing (unified checkout)

**Assisted**:
- Pillar 1: Merchant controls pace (self-serve OR get help)
- Pillar 2: AE spends less time on data entry, more on consultation
- Pillar 3: AE can quote complete solution (software + hardware)

**Managed**:
- Pillar 1: White-glove from day 1 (no competing with low-value leads)
- Pillar 2: IC can pre-configure account (faster implementation)
- Pillar 3: Single purchase for all 10+ locations (clear budgeting)

---

### This Changes the Conversation with Sales

**Not**: "We're taking leads away from you"

**Instead**: "We're making your job easier and more profitable"

**How**:
- **Better leads**: Self-Serve filters out low-fit merchants automatically
- **Less data entry**: Pre-filled forms mean AEs focus on consultation, not form-filling
- **Higher commissions**: Paid on full deal (software + hardware), not just software
- **Clearer merchant readiness**: "Closed Won" = actually ready to transact (not just software activated)

**AE wins**:
- Spend 30-35% less time on low-value leads
- Higher close rates (pre-qualified cohorts)
- Hardware commissions added to comp plan
- Less time troubleshooting bad hardware (proper devices specified upfront)

---

## The Bottom Line

**The current system has three fundamental problems**:
1. Sales owns the front door → can't segment or scale
2. Fragmented data systems → 19.2% abandon LSPay due to re-entry
3. Split billing → hardware feels like "hidden cost", AEs deprioritize

**The three-pillar solution fixes all three**:
1. **Product-owned front door** → Enables cohort segmentation + data collection
2. **Unified data flow** → Eliminates re-entry, benefits ALL cohorts
3. **Unified purchase** → Clear pricing, aligned incentives, better merchant experience

**The proof point**:
- Pilot with 100-200 Self-Serve merchants
- Measure impact of all three pillars:
  - Conversion rate (target: 25%+)
  - LSPay completion (target: 85%+)
  - Hardware attachment (target: 80%+)
- If successful → scale to all cohorts
- **Combined impact: $2.65M-$3.0M annually**

**This isn't just an onboarding improvement. This is a transformation in how we acquire, activate, and scale merchants.**

**The question isn't whether this is the right strategy. The questions are:**
1. Are we willing to change ownership? (Product owns front door)
2. Are we willing to invest in unified systems? (Data flow + unified purchase)
3. Are we willing to redefine success? ("Closed Won" = software + hardware + LSPay)

**If the answer to all three is YES, we have a $2.65M-$3.0M annual opportunity.**

---

**Document Owner**: Product Leadership
**Status**: Strategic Recommendation Requiring Executive Decision
**Created**: 2025-10-17
**Version**: 3.0
**Key Decision Required**: Commit to All Three Pillars? (YES/NO)
