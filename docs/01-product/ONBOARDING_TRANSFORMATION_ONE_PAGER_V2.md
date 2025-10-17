# Onboarding Transformation: Product-Owned Front Door Strategy

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
- **No self-serve path exists**: Immediate sales involvement blocks merchants who want to try product independently
- **Fragmented systems create friction**: Data doesn't flow between systems (Salesforce → LSPay → Hardware → X-Series)
  - Merchants re-enter same information multiple times
  - Extra steps and redirects between disconnected tools
  - No single view of progress → merchants get lost in the process
- **Sales capacity misallocated**: Reps spending time on merchants who want to self-serve OR aren't ready yet
- **Product can't iterate**: Sales owns the front door, so Product can't optimize activation flow

---

## Root Cause: Sales Owns the Front Door

### Current State (The Broken Flow)

```
Merchant clicks "Start Free Trial"
         ↓
Sent to Salesforce (MQL)
         ↓
Rep calls immediately to qualify
         ↓
If qualified → SDR walks through:
  - LSPay application (form hell)
  - Software purchase
  - Hardware ordering
         ↓
Often converts to Ignite plan ($5/mo)
         ↓
70% never go transactional
         ↓
Cancel (wasted sales time + IC capacity)
```

### Why This Fails

**Problem 1: No self-serve path available**
- 30-35% are self-serve merchants (Ignite plan, <$100K revenue)
- They want to try the product independently, not wait for sales calls
- Forced sales involvement blocks fast, autonomous activation
- Result: Friction for merchants who prefer self-serve, wasted sales time on low-value leads

**Problem 2: Can't accommodate different readiness levels**
- Ready merchants (can activate in 24 hours) forced to wait for sales calls
- Unready merchants (need months) consuming sales time prematurely
- 33-day average masks huge variance: Some ready day 1, others not ready for 6 months
- One rigid process can't serve both extremes

**Problem 3: Fragmented systems create merchant friction**
- Data siloed across disconnected systems: Salesforce → LSPay → Hardware Store → X-Series
- Merchants re-enter same information 3-4 times (business name, address, EIN, etc.)
- Handoffs require external redirects and context switching
- No unified progress view → merchants don't know where they are in the process
- Result: Confusion, abandonment, and Code Yellow's 19.2% drop-off in LSPay application

**Problem 4: All or nothing**
- Either you get full sales + IC treatment (expensive)
- Or you don't get in at all
- No middle ground for different merchant types

**Problem 5: No product-led activation**
- Sales owns conversion from trial → paid
- Product can't instrument, test, or optimize activation
- No data on what drives self-serve conversion

**Problem 6: Sales incentives misaligned**
- Paid on "Closed Won" = software activation
- Not paid on 10CD activation (actual success)
- Result: Close Ignite deals that will churn

**Problem 7: Can't scale**
- Every new merchant requires sales/IC touch
- To 10x leads, need to 10x sales team
- CAC stays high forever

---

## The Highest Priority Solution

### Product-Owned Front Door with Smart Routing

**Core Principle**: Product owns the front door. Cohort determines the path. Activation drives conversion.

### The New Flow

```
Merchant clicks "Start Free Trial"
         ↓
Product-owned signup (2 pages)
  → Collects: revenue, locations, business type
         ↓
Cohort auto-assigned at signup
         ↓
         ├─→ Self-Serve (<$500K)
         │    → Dashboard with in-product activation
         │    → Product-led growth triggers
         │    → Convert via usage, not sales calls
         │    → Can request IC help if needed
         │
         ├─→ Assisted ($500K-$2M)
         │    → Dashboard + optional AE/IC support
         │    → AE notified, can reach out
         │    → Merchant can self-serve OR get help
         │    → Hybrid conversion path
         │
         └─→ Managed ($2M+)
              → Dashboard + required AE assignment
              → AE calls within 1 hour
              → White-glove implementation
              → Sales-led conversion
```

### Why This Works

#### For Self-Serve Merchants (30-35% of leads)

**Current State**:
- Forced through sales call → friction → many bounce
- Those who convert to Ignite → 70% never transact
- Sales + IC time wasted on low-LTV merchants

**New State**:
- Immediate product access → try before they buy
- Product-led activation triggers drive engagement:
  - ✅ Complete Task 1 (Identity Verification) → Unlock Task 2
  - ✅ Configure POS → "Ready to accept payments! Complete purchase to activate"
  - ✅ First transaction in trial → "Upgrade to keep processing"
  - ✅ 7 days no activity → Automated email nudge
  - ✅ 14 days no conversion → Trial expires (can request extension or re-activate later)
- Natural self-selection: Engaged merchants convert, aspirational ones churn fast
- **Zero sales/IC time spent**

**Impact**:
- Frees 30-35% of sales capacity
- Lets product optimize for conversion
- Allows 10x lead volume without 10x-ing sales team

#### For Assisted Merchants (50-60% of leads)

**Current State**:
- Same rigid sales process as Managed
- But these merchants often want hybrid (some help, some self-serve)

**New State**:
- Land in product-first, sales available
- AE notified: "New Assisted merchant, Joe's Coffee, $750K revenue, 4 locations"
- AE can reach out proactively OR wait for merchant to request help
- Merchant controls pace: "Schedule AE call" vs "Continue on my own"
- Conversion can be self-serve checkout OR AE-guided

**Impact**:
- Right-sized sales involvement (AE time only when needed)
- Better merchant experience (control + support)
- Higher conversion (remove friction for those who don't need help)

#### For Managed Merchants (10-15% of leads)

**Current State**:
- This is the only segment where sales-first makes sense
- But they're in same queue as everyone else

**New State**:
- Auto-routed to high-priority AE queue
- AE calls within 1 hour (SLA enforced)
- Still land in product dashboard (visibility)
- White-glove treatment from day 1

**Impact**:
- High-value merchants get immediate attention
- Not competing with low-value leads for AE time
- Clear ownership and accountability

---

## Implementation: The Product-Owned Front Door

### Phase 1: The New Signup Flow (Product Owns This)

**Page 1: Account Creation**
- Name, email, password
- Business name, phone

**Page 2: Business Profiling** (This determines cohort)
- Business category
- Business website (for data enrichment)
- Business address
- **Annual revenue** (dropdown: <$100K, $100K-$250K, etc.)
- **Number of locations** (numeric input)

**Behind the scenes**:
1. TrueBiz verification (fraud prevention)
2. Cohort assignment based on revenue + locations
3. Lightspeed account provisioned
4. Route to cohort-specific dashboard

**No Salesforce MQL created for Self-Serve.** Product owns these merchants.

### Phase 2: Cohort-Specific Onboarding Experiences

**Self-Serve Onboarding Experience**:
```
🎯 Your 14-day free trial is active!

Try Lightspeed risk-free. Explore the platform and start processing
payments during your trial period.

Setup Progress: 0 of 5 tasks complete

⭕ 1. Verify Your Identity (Required - 10-15 min)
⭕ 2. Hardware Selection (5-10 min)
⭕ 3. Configure Your POS (2-3 min)
⭕ 4. Data Import (10-30 min)
⭕ 5. Team Setup (3-5 min)

Next step: Verify your identity to start accepting payments →

Need help? [Chat with us] [Browse guides]
```

**Self-Serve Experience Elements**:
- **Dashboard**: Task-based progress tracker (5 tasks)
- **In-app guides**: Contextual tooltips and walkthroughs
- **Video tutorials**: Embedded for each task
- **Chat support**: AI-first, escalates to human if needed
- **Email sequences**: Automated nurture and re-engagement
- **No AE/IC assignment**: Fully self-service unless merchant requests help

**Product-Led Activation Triggers**:
- Task 1 complete → Email: "Great start! Next: Configure your POS"
- Task 2 complete → Email: "You're ready! Complete purchase to activate payments"
- 3 days no progress → Email: "Stuck? Here are 3 quick wins"
- 7 days no purchase → Email: "See what [similar business] accomplished in week 1"
- 10 days no purchase → Email: "Your trial expires in 4 days. Want to talk to someone?"
- First transaction → Email: "Congrats! Here's how to grow from here"

---

**Assisted Onboarding Experience**:
```
Your Setup Progress: 0 of 5 tasks complete

[Same task list as Self-Serve]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Want help getting started?

Your specialist: Sarah Johnson
📞 (555) 123-4567 | 📧 sarah@lightspeed.com

[Schedule 15-min call] [I'll do this myself]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Assisted Experience Elements**:
- **Dashboard**: Same task structure as Self-Serve
- **Specialist visibility**: Always-visible AE card with contact info
- **Hybrid support model**: Can self-serve OR request AE/IC help at any time
- **Proactive AE outreach**: AE notified at signup, can reach out
- **Optional consultation**: "Schedule call" available on every task
- **Flexible conversion**: Merchant controls whether they need help

---

**Managed Onboarding Experience**:
```
Your Setup Progress: 0 of 5 tasks complete

[Same task list]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your Dedicated Account Manager

John Smith, Enterprise Account Executive
📞 Direct: (555) 987-6543
📧 john@lightspeed.com

Your implementation kickoff call is scheduled:
📅 Friday, Oct 18 at 2:00 PM EST

[View Calendar] [Reschedule]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Managed Experience Elements**:
- **Dashboard**: Same task structure, but IC-led completion
- **Dedicated AE + IC**: Both assigned at signup
- **White-glove implementation**: Scheduled onboarding sessions
- **Required consultation**: AE calls within 1 hour of signup (SLA)
- **Implementation timeline**: Visible schedule of sessions and milestones
- **Concierge support**: Direct phone line, shared notes, session recordings

---

### Phase 3: Shared Visibility for Sales/IC/Ops

**New Salesforce Lead Types**:
- **Self-Serve** (Product-owned, no automatic MQL)
  - Only create MQL if merchant requests help OR stalls
- **Assisted** (Product-owned, auto-notify AE)
  - MQL created immediately, AE sees in dashboard
- **Managed** (Sales-owned from signup)
  - MQL created, high-priority queue, 1-hour SLA

**Unified Data Flow to Salesforce**:

**Self-Serve**:
- No automatic Salesforce MQL created
- Merchant data stays in product database
- **Only create MQL when**:
  - Merchant clicks "Talk to Sales"
  - Merchant stalled 14+ days (auto-escalation)
  - Merchant requests IC help

**Assisted**:
- Auto-create Salesforce MQL at signup
- Send merchant profile data: name, revenue, locations, cohort
- Real-time status updates sent to Salesforce:
  - Task completion progress
  - Purchase completed
  - First transaction processed
- AE can view merchant progress in Salesforce

**Managed**:
- Auto-create Salesforce MQL at signup (high-priority queue)
- Send full merchant profile immediately
- Real-time status updates:
  - Task completion
  - IC session scheduling
  - Purchase milestones
  - Implementation progress
- AE + IC visibility through Salesforce

---

## North Star Metric

### Two Leading Indicators of Success

**Metric 1: Free Trial Conversion Rate**
- **What**: % of provisioned accounts that convert to paid subscription
- **Measurement**: From account provisioning → subscription purchase
- **Why**: Shows product-market fit and activation effectiveness

**By Cohort**:
- Self-Serve: 30%+ (vs. ~20% for Ignite today)
- Assisted: 60%+
- Managed: 80%+

**Metric 2: Time to First Transaction**
- **What**: Days from subscription purchase → first payment processed
- **Measurement**: Post-conversion activation speed
- **Why**: Shows how quickly merchants become transactional (true activation)

**By Cohort**:
- Self-Serve: <7 days average
- Assisted: <10 days average
- Managed: <14 days average (more complex setups)

**Combined Success**: Trial → Transacting Rate
- Self-Serve: 30% convert × 80% transact within 30 days = **32% fully activated** (vs. 21% today for Ignite)
- Assisted: 60% convert × 85% transact within 30 days = **51% fully activated**
- Managed: 80% convert × 90% transact within 30 days = **72% fully activated**

### Supporting Metrics

| Metric | Current | Target (6mo) | Why It Matters |
|--------|---------|--------------|----------------|
| Self-Serve Signup → Account Created | N/A | 90%+ | Measures signup friction |
| Self-Serve Trial → Paid Conversion | ~20% (Ignite) | 30%+ | Proves product-led activation works |
| Self-Serve Paid → Transacting | 30% | 80%+ | Shows we're activating right merchants |
| Assisted: Merchant-Initiated Contact | N/A | 30%+ | Shows hybrid model working |
| Managed: AE Contact <1hr | Unknown | 95%+ | Validates high-touch SLA |
| Sales Hours per Self-Serve Merchant | ~2-3 hours | 0 hours | Proves sales capacity freed |
| Task Completion Rate (Tasks 1-2) | Unknown | 85%+ | Measures in-product activation |
| Time to First Transaction | Unknown | <7 days (Self-Serve) | Speed to value metric |

### Financial Impact (Estimated Ranges)

**Current State Costs** (Per 100 Self-Serve Leads):
- Sales/IC labor: 300 hours @ ~$75/hr = **$22.5K**
- Free terminals given: ~20 conversions × $200 = **$4K**
- Terminal waste (70% churn): ~14 wasted terminals = **$2.8K**
- Sales commissions: **~$200-500** (low value deals)
- **Total cost per 100 leads: $27K-$30K**

**New State Economics** (Per 100 Self-Serve Leads):
- Sales/IC labor: **$0** (self-serve)
- Terminal strategy (TBD): **$0-$6K** depending on policy
  - Earn-it model (after $X transactions): $0-$2K waste
  - Pay-upfront model: $2K-$4K waste
  - Free-with-purchase model: $4K-$6K waste
- Sales commissions: **$0** (no sales touch)
- **Total cost per 100 leads: $0-$6K**

**Net Savings Range**:
- **Conservative**: $21K per 100 leads (if free terminals given)
- **Aggressive**: $27K per 100 leads (earn-it terminal model)
- **Annual savings (400 Self-Serve leads/month)**: **$1.0M-$1.3M**

**Revenue Impact**:
- Current: 100 leads → 21 transacting merchants
- New: 100 leads → 24 transacting merchants (+14% more merchants)
- At $5K avg LTV = **+$15K in LTV per 100 leads**
- **Annual additional LTV**: **$720K** (4,800 Self-Serve leads/year)

**Combined Annual Impact**: **$1.7M-$2.0M** (cost savings + incremental LTV)

**Scale Opportunity**:
- Can 10x Self-Serve lead volume without proportional cost increase
- Product-led optimization compounds over time
- Self-Serve becomes growth engine, not cost center

---

## What Makes This Different

### This Isn't Just "Build a Dashboard"

This is a **strategic shift in how we acquire and activate customers**:

**Before**: Sales owns the entire customer journey
- Can't scale without scaling sales team
- Can't optimize without changing sales process
- Product is just fulfillment

**After**: Product owns the front door, Sales focuses on high-value
- Can scale Self-Serve 10x without adding sales headcount
- Product can iterate on activation independently
- Sales team focuses on merchants that need (and value) human touch

### This Changes the Conversation with Sales

**Not**: "We're taking leads away from you"
**Instead**: "We're filtering out time-wasters so you can focus on closeable deals"

**Current reality for Sales**:
- Spend 30-35% of time on Ignite leads
- 70% of those never transact
- Wasted time = can't hit quota = frustrated team

**New reality for Sales**:
- Zero time on Self-Serve (unless merchant requests help)
- 100% of time on Assisted ($500K+) and Managed ($2M+)
- Higher close rates = hit quota = happy team

**Incentive alignment**:
- Still paid on "Closed Won" initially
- But leads are pre-qualified (higher close rate)
- Can add 10CD bonus later (once process proven)

---

## Strategic Decisions Required

### Decision 1: Does Product Own the Front Door? (YES/NO)

**YES means**:
- Product team owns signup flow, cohort logic, Self-Serve activation
- Sales gets notified for Assisted/Managed, but doesn't gate access
- Self-Serve merchants never hit Salesforce unless they request help
- Product can iterate and optimize without Sales approval

**NO means**:
- Sales continues to own lead qualification
- We continue 30-35% waste on low-fit leads
- We can't scale without scaling sales team
- This entire strategy doesn't work

**Recommendation**: YES. This is the foundational decision everything else depends on.

### Decision 2: Do We Build Product-Led Activation for Self-Serve? (YES/NO)

**YES means**:
- Invest in in-product triggers, email sequences, analytics
- Product team owns conversion optimization
- Create playbooks for activation (task completion → conversion)

**NO means**:
- Self-Serve merchants get product access but no guidance
- Lower conversion rates, higher confusion
- Missed opportunity to learn and optimize

**Recommendation**: YES. Otherwise we're just shifting problem from Sales to Product without solving it.

### Decision 3: Do We Still Optimize LSPay + Hardware for ALL Cohorts? (YES/NO)

**YES means**:
- Streamline LSPay application (remove duplicate forms)
- Integrate hardware ordering into dashboard
- Show real-time status to prevent premature setup
- Benefits all three cohorts

**NO means**:
- These problems persist even with new front door
- Reduced impact of overall transformation

**Recommendation**: YES. These are universal improvements that compound with cohort strategy.

---

## Implementation Sequence

### Phase 0: Strategic Alignment (REQUIRED FIRST)
**Goal**: Get executive buy-in and define success criteria

- [ ] **Executive decision**: Does Product own the front door? (Go/No-Go)
- [ ] **Sales leadership buy-in**: Show math on how this frees their capacity
- [ ] **Define handoff rules**: When does Self-Serve merchant become Sales MQL?
  - Suggested: Only when merchant clicks "Talk to Sales" OR stalls 14+ days
- [ ] **Set abort criteria**: What metrics would cause us to revert to old model?
  - Suggested: If Self-Serve conversion <20% after pilot period

**Success Criteria**: Signed executive approval to proceed

---

### Phase 1: Build MVP (Self-Serve Only)
**Goal**: Launch self-serve path for <$500K merchants with minimal dependencies

**Scope**:
- [ ] New signup flow (product-owned, collects revenue/locations)
- [ ] Cohort assignment logic (auto-route based on criteria)
- [ ] Basic dashboard (Self-Serve cohort only, 5-task progress tracker)
- [ ] In-app guides and tooltips for each task
- [ ] Email sequences (welcome, nudges, conversion triggers)

**Explicitly OUT OF SCOPE for Phase 1**:
- ❌ Salesforce integration (can be manual CSV export)
- ❌ Assisted/Managed cohort dashboards (focus on Self-Serve first)
- ❌ Chat support (use existing support channels)
- ❌ Advanced analytics (use basic funnel tracking)

**Why This Scope**: Proves the model with minimal dependencies. Can launch without Salesforce integration or new support infrastructure.

**Success Criteria**: Self-Serve merchants can sign up, land in dashboard, complete tasks, and convert without sales touch

---

### Phase 2: Pilot & Validate
**Goal**: Test Self-Serve path with real merchants and measure key metrics

**Scope**:
- [ ] Route 100-200 Self-Serve signups through new flow
- [ ] Measure core metrics:
  - Signup completion rate
  - Task 1-2 completion rate
  - Trial → Paid conversion
  - Paid → Transacting rate
  - Time to first transaction
- [ ] Collect qualitative feedback (surveys, support tickets, user interviews)
- [ ] Identify top drop-off points and friction areas
- [ ] Iterate on dashboard, email copy, in-app messaging

**Decision Point**:
- **If conversion ≥25%**: Proceed to Phase 3 (full launch)
- **If conversion 20-24%**: Iterate for another pilot cycle
- **If conversion <20%**: Reassess strategy (may need to route back to sales)

**Success Criteria**: ≥25% Self-Serve conversion rate, qualitative feedback is positive

---

### Phase 3: Scale Self-Serve
**Goal**: Route all Self-Serve merchants through new flow

**Scope**:
- [ ] Route all <$500K signups to Self-Serve flow (no more automatic sales calls)
- [ ] Train AE/IC teams on new handoff rules (only engage if merchant requests help)
- [ ] Build analytics dashboard for ongoing monitoring
- [ ] Establish weekly optimization cadence (review metrics, test improvements)

**Success Criteria**: 30%+ Self-Serve conversion rate sustained over 3 months

---

### Phase 4: Add Assisted & Managed Paths
**Goal**: Extend product-owned front door to all cohorts

**Scope**:
- [ ] Build Assisted dashboard (same task structure + AE contact card)
- [ ] Build Managed dashboard (same task structure + dedicated AE/IC assignment)
- [ ] Salesforce integration:
  - Self-Serve: No MQL unless help requested
  - Assisted: Auto-create MQL, notify AE
  - Managed: Auto-create MQL, high-priority queue
- [ ] AE/IC training on hybrid support model

**Success Criteria**: All three cohorts using unified dashboard, Salesforce sync working

---

### Phase 5: Product-Led Activation Enhancements
**Goal**: Optimize conversion through advanced activation features

**Scope**:
- [ ] Advanced email sequences (behavior-triggered, personalized)
- [ ] In-app celebration moments (task completion animations, progress milestones)
- [ ] A/B testing framework (test different messaging, task ordering, CTAs)
- [ ] AI-powered chat support (deflect simple questions, escalate complex)
- [ ] Predictive analytics (identify at-risk merchants, trigger interventions)

**Success Criteria**: Incremental lift in Self-Serve conversion (target: 30% → 35%+)

---

### Phase 6: Universal Improvements (All Cohorts)
**Goal**: Address Code Yellow pain points that benefit everyone

**Scope**:
- [ ] Streamline LSPay application (pre-fill data, single unified form)
- [ ] Integrate hardware ordering into dashboard (show delivery status)
- [ ] Real-time LS Pay approval status (prevent premature hardware setup)
- [ ] Unified data flow (eliminate duplicate data entry across systems)

**Success Criteria**: Reduce LSPay drop-off from 19.2% to <10%

---

## Sequencing & Dependencies

**Critical Path**:
```
Phase 0 (Alignment)
    ↓
Phase 1 (Build MVP - Self-Serve only)
    ↓
Phase 2 (Pilot & Validate)
    ↓
    Decision Point: Does Self-Serve work?
    ├─→ YES: Phase 3 (Scale Self-Serve)
    └─→ NO: Reassess or abort
    ↓
Phase 3 (Scale Self-Serve)
    ↓
    ← Can run in parallel →
    ↓                      ↓
Phase 4 (Assisted/Managed)  Phase 5 (PLG Enhancements)
    ↓                      ↓
    ← Merge →
    ↓
Phase 6 (Universal Improvements)
```

**Key Dependencies**:
- Phase 1 does NOT depend on Salesforce integration (use manual CSV export)
- Phase 2 must complete before Phase 3 (validate before scaling)
- Phase 4 & 5 can run in parallel (different teams, different scope)
- Phase 6 can start anytime after Phase 3 (independent improvements)

---

## The Bottom Line

**The current model forces every merchant through sales—even those who don't need sales.**

This creates three problems:
1. **Sales waste**: 30-35% of sales time spent on low-fit merchants
2. **Merchant friction**: Self-serve merchants want product, not calls
3. **Can't scale**: Must grow sales team 1:1 with lead volume

**The product-owned front door solves all three**:
1. **Frees sales capacity**: Zero time on Self-Serve (30-35% time back)
2. **Better merchant experience**: Right help, right time, right merchant
3. **Unlocks scale**: Can 10x Self-Serve leads without 10x-ing sales team

**The proof point**:
- Route 30-35% of leads (Self-Serve) through product-first
- Measure trial → transacting conversion vs. current Ignite (~21%)
- Target: 30%+ conversion with zero sales time
- **If we hit 30%, we've proven the model and can scale**

This isn't just an onboarding improvement. This is a **go-to-market transformation** that changes how we acquire, activate, and scale customers.

**The question isn't whether this is the right strategy. The question is: are we willing to change ownership?**

---

**Document Owner**: Product Leadership
**Status**: Strategic Recommendation Requiring Executive Decision
**Created**: 2025-10-16
**Key Decision Required**: Does Product Own the Front Door? (YES/NO)
