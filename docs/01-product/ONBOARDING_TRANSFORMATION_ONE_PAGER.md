# Onboarding Transformation: One-Pager

## The Problem

**We're losing 86.5% of qualified leads before they become active merchants.**

Current state: 1,000 qualified leads → 135 reach 10CD activation (13.5% conversion)

This isn't a marketing problem. This isn't a sales problem. **This is a systems problem.**

---

## Root Cause Analysis

### The Data Tells a Clear Story

Our onboarding journey has **five critical failure points**:

| Stage | Drop-off | Root Cause |
|-------|----------|------------|
| Discovery → Purchase | 71.3% | **Wrong leads in the door**: 30-35% are micro merchants (Ignite plan) who will never transact |
| Activation → First IC Call | 24.8% | **The handoff black hole**: No structure, no visibility, no accountability |
| LS Pay Application | 19.2% | **Death by forms**: Redundant data entry, missing documents, email ping-pong |
| IC Sessions | 28.3% | **One-size-fits-all**: Same rigid process for $5/mo and $5M merchants |
| Hardware Setup Calls | 44.8% no-show | **Premature scheduling**: Calls booked before hardware arrives or payments approved |

### The Real Problem: Misaligned Incentives + No Segmentation

**Current reality**:
- Sales paid on "Closed Won" (software activation only)
- Hardware and LS Pay approval happen AFTER commissions paid
- 70% of Ignite customers never go transactional
- ICs spend equal time on $5/month and $500K/year merchants
- No one owns the gap between "software sold" and "merchant activated"

**Result**: We're optimizing for deals closed, not merchants activated.

---

## The Highest Priority Solution

### Cohort-Based Onboarding with Gated Activation

**Core Principle**: Right-size the experience AND the support cost to the merchant's lifetime value potential.

#### Three Cohorts, Three Experiences

| Cohort | Criteria | Onboarding Path | IC Involvement | Success Metric |
|--------|----------|----------------|----------------|----------------|
| **Self-Serve** | <$500K revenue<br/><3 locations<br/>Ignite/Starter plans | Fully automated digital onboarding<br/>In-app guides, video tutorials<br/>Chat support (AI-first) | **Zero IC time**<br/>Escalation available | 10CD: 60%+ |
| **Assisted** | $500K-$2M revenue<br/>3-10 locations<br/>Standard plans | Hybrid: self-serve + optional IC calls<br/>AE can send custom quotes<br/>IC available on-demand | **2-3 IC hours**<br/>(vs. 8-10 today) | 10CD: 70%+ |
| **Managed** | $2M+ revenue<br/>10+ locations<br/>Enterprise plans | White-glove implementation<br/>Dedicated AE + IC assigned<br/>Scheduled onboarding sessions | **15-20 IC hours**<br/>(justified by LTV) | 10CD: 85%+ |

#### Why This Works

**Problem 1: Wrong leads consuming IC capacity**
- **Solution**: Self-serve path for Ignite/low-GTV merchants frees ~60% of current IC time
- **Impact**: ICs can focus on high-value merchants, or we need 50% fewer ICs

**Problem 2: AE → IC handoff black hole**
- **Solution**: Cohort auto-assigned at signup, IC automatically notified only for Assisted/Managed
- **Impact**: Eliminates 19.63% drop-off from unscheduled handoffs

**Problem 3: One-size-fits-all IC sessions**
- **Solution**: Dynamic session templates based on cohort complexity
- **Impact**: Self-serve needs zero sessions, Assisted needs 1-2, Managed gets full suite

**Problem 4: Premature hardware setup**
- **Solution**: Dashboard shows real-time LS Pay + hardware delivery status, blocks scheduling until ready
- **Impact**: Eliminates 44.8% hardware call no-shows

**Problem 5: Redundant LS Pay forms**
- **Solution**: Pre-populate verification data from signup, single unified form
- **Impact**: Reduces 19.2% drop-off from application abandonment

---

## Implementation: The Unified Dashboard

**Core Concept**: One progress tracker for merchant, AE, IC, and operations.

### Merchant View
```
Your Setup Progress: 3 of 5 tasks complete

✅ 1. Create Account (complete)
✅ 2. Verify Your Identity (complete)
✅ 3. Configure POS (complete)
⏳ 4. Hardware Selection (in progress)
   → Status: Order placed, ships in 3 days
⏳ 5. Payment Approval (in progress)
   → Status: Under review (1-2 days)

[Self-Serve]: "Need help? Check our guides"
[Assisted]: "Questions? Schedule a call with [IC Name]"
[Managed]: "Your next session: Oct 18 at 2pm with [IC Name]"
```

### AE/IC/Ops View (Shared Dashboard)
```
Merchant: Joe's Coffee Shop
Cohort: Assisted | Revenue: $750K | Locations: 4
Account Created: Oct 10 | Days Since Activation: 6 | Target 10CD: Oct 20

Progress Tracker:
✅ Account created (Oct 10)
✅ Identity verified (Oct 11) - Stripe approved
✅ POS configured (Oct 11) - 4 locations, 8 registers
✅ Hardware ordered (Oct 12) - Ships Oct 16, arrives Oct 18
⏳ LS Pay approval (Oct 13) - Under review, ETA Oct 15
⚠️ IC session not scheduled - [Auto-schedule] [Mark not needed]

Risk Score: 🟢 Low (on track for 10CD)
Next Action: Schedule IC call after LS Pay approval + hardware delivery
```

**Key Feature**: Dependency management
- Can't schedule hardware setup until: LS Pay approved AND hardware delivered
- Can't mark 10CD complete until: First transaction processed
- Auto-alerts when merchant stalled >3 days on any task

---

## North Star Metric

### Primary Success Metric

**10CD Activation Rate: 46.94% → 70%+ within 6 months**

This means: 1,000 qualified leads → 700 active merchants (vs. 135 today)

**Impact**: 5x more merchants activated with same or less IC headcount

### Supporting Metrics

| Metric | Current | Target (6mo) | Why It Matters |
|--------|---------|--------------|----------------|
| Self-Serve 10CD Rate | N/A (no path exists) | 60% | Proves we can activate without IC support |
| Assisted 10CD Rate | ~40% (estimated) | 70% | Shows cohort segmentation works |
| Managed 10CD Rate | ~55% (estimated) | 85% | Validates high-touch experience |
| AE → IC Handoff Drop-off | 19.63% | <5% | Measures process improvement |
| LS Pay Application Rate | 70% | 85% | Shows form streamlining works |
| Hardware Setup No-Shows | 44.8% | <15% | Validates dependency management |
| IC Hours per Merchant | ~8-10 hours (avg) | 2-4 hours (avg) | Proves efficiency gains |

### Financial Impact (Back-of-Envelope)

**Current State**:
- 1,300 leads/month → 175 activated merchants/month (13.5%)
- IC team: ~15 FTEs @ $75K loaded cost = $1.125M/year
- Cost per activation: $535/merchant

**Future State** (70% activation):
- 1,300 leads/month → 910 activated merchants/month (70%)
- IC team needed: ~10 FTEs @ $75K = $750K/year (Self-serve eliminates 30% IC capacity need)
- Cost per activation: $69/merchant

**Net Impact**:
- **5.2x more merchants activated**
- **$375K annual cost savings** in IC team
- **87% reduction in cost per activation**

---

## Why This Must Be Priority #1

### The Compounding Effect

Every 1% improvement in 10CD activation rate generates:
- 156 more active merchants per year (at 1,300 leads/month)
- ~$780K additional annual revenue (at $5K avg customer LTV)
- Reduced CAC by improving conversion efficiency

Going from 46.94% → 70% = **23.6 percentage point improvement**:
- **3,683 more active merchants per year**
- **$18.4M additional annual revenue**
- **Transforms unit economics of the entire business**

### The Urgency

We're currently spending:
- Sales commissions on merchants who never activate
- IC time on merchants who churn before 10CD
- Marketing dollars acquiring wrong-fit leads
- Support resources on preventable friction

**Every day we don't fix this, we're burning ~$50K in wasted activation cost.**

### The Opportunity

This isn't just about fixing what's broken. It's about:
- **Unlocking scale**: Self-serve path lets us 10x lead volume without 10x-ing IC team
- **Improving quality**: Cohort segmentation ensures best merchants get best experience
- **Creating leverage**: Unified dashboard becomes platform for future optimization

---

## What We Need to Decide

### Strategic Decisions (This Week)

1. **Do we commit to cohort-based onboarding as the strategy?**
   - Yes = we build for segmentation from day one
   - No = we continue one-size-fits-all and accept 13.5% conversion

2. **Do we redefine "Closed Won" to include 10CD activation?**
   - Yes = aligns sales incentives with actual business outcome
   - No = AE/IC misalignment continues

3. **Are we willing to let Self-Serve merchants fail fast?**
   - Yes = we optimize for high-value merchant success
   - No = we continue subsidizing low-LTV merchants with high-cost IC time

### Tactical Decisions (Next 2 Weeks)

4. **Unified dashboard or separate merchant/IC tools?**
   - Recommendation: Unified (single source of truth)

5. **Stripe Identity or continue with current KYC flow?**
   - Recommendation: Stripe Identity (eliminates form redundancy)

6. **Phase 1 scope: All three cohorts or Self-Serve only?**
   - Recommendation: All three (cohort logic is the foundation)

---

## Recommended Next Steps

### Week 1: Align & Design
- [ ] Executive decision on cohort strategy (Go/No-Go)
- [ ] Define "Closed Won" requirements with Sales leadership
- [ ] Finalize cohort thresholds ($500K, $2M breakpoints)
- [ ] Workshop unified dashboard requirements with AE/IC/Ops

### Week 2-3: Validate & Spec
- [ ] User testing: Show Self-Serve mockups to 5 small merchants
- [ ] User testing: Show Assisted mockups to 5 mid-market merchants
- [ ] Technical spike: Stripe Identity integration feasibility
- [ ] Build out detailed dashboard specs and dependency rules

### Week 4-6: Build Phase 1 (MVP)
- [ ] Cohort assignment logic at signup
- [ ] Unified dashboard (read-only progress view)
- [ ] Self-Serve path with in-app guides
- [ ] AE/IC shared visibility dashboard

### Week 7-8: Pilot & Iterate
- [ ] Pilot with 50 new Self-Serve merchants
- [ ] Measure: 10CD rate, task completion, support tickets
- [ ] Iterate based on feedback
- [ ] Prepare for full launch

### Month 3: Scale
- [ ] Launch to all new signups
- [ ] Train AE/IC teams on new process
- [ ] Build analytics dashboard for ongoing optimization
- [ ] Begin phase 2 planning (advanced features)

---

## The Bottom Line

**We have a 13.5% conversion problem masquerading as a volume problem.**

We can 5x our activation rate without changing anything about our product, our pricing, or our go-to-market strategy. We just need to:

1. **Segment** merchants by value potential
2. **Right-size** the onboarding experience to each segment
3. **Create visibility** so nothing falls through cracks
4. **Align incentives** so everyone optimizes for activation, not just software sales

This is the highest-leverage opportunity in the business right now.

**The question isn't whether we should do this. The question is: how fast can we move?**

---

**Document Owner**: Product Leadership
**Status**: Recommendation for Executive Decision
**Created**: 2025-10-16
**Next Review**: Executive alignment meeting (TBD)
