# Implementation Consultant Pricing Model

**Version:** 1.0
**Status:** Final for Phase 1 MVP
**Last Updated:** October 2025
**Owner:** Product Lead

---

## Executive Summary

**Core Question:** How should we price IC (Implementation Consultant) services?

**Recommendation for Phase 1:** **Tiered Support Model with Hybrid Pricing**

| Cohort | IC Support Included | Pricing Model | What's Included |
|--------|---------------------|---------------|-----------------|
| **Self-Serve** | Reactive support only | Free (baseline) | Help center, chat, intervention when stalled |
| **Assisted** | 5 hours of guided setup | Free (included in subscription) | 2-3 sessions: data import, hardware setup, go-live |
| **Managed** | Dedicated implementation package | **$2,500 base + $250/location** (paid add-on) | Full white-glove: project plan, weekly sessions, on-site option |

**Rationale:** This model aligns support investment with merchant value, keeps Assisted cohort accessible (free IC drives conversion), and monetizes high-touch Managed implementations where value is clear.

---

## Pricing Philosophy

### Core Principles

1. **Free IC Support is a Conversion Tool, Not a Profit Center**
   - Assisted cohort gets free IC time to reduce friction and improve activation
   - Goal: 90%+ completion rate justifies the IC investment
   - ROI: Higher LTV from activated merchants > cost of IC time

2. **Paid IC Support is Value-Based**
   - Managed cohort implementations are complex, high-stakes projects
   - Merchants see clear ROI (faster rollout, fewer errors, staff training)
   - Pricing reflects project scope, not just hourly cost

3. **Self-Serve Gets Reactive Support**
   - Low-touch by design, but safety net exists
   - IC intervenes when merchant is stalled (per intervention triggers)
   - Keeps CAC low while preventing abandonment

---

## Self-Serve Cohort: Free Reactive Support

### What's Included (Baseline)

**Help Center & Documentation:**
- Searchable knowledge base with setup guides
- Video tutorials for each onboarding step
- FAQ library
- Community forum (merchant-to-merchant peer support)

**Asynchronous Support:**
- Email support (24-hour response SLA)
- In-app chat (4-hour response SLA during business hours)
- Ticket system for bug reports

**Proactive Monitoring:**
- Automated intervention triggers (see `intervention-triggers.md`)
- IC reaches out if merchant is stalled >7 days
- Offer: 15-30 minute troubleshooting call

**What's NOT Included:**
- Scheduled onboarding sessions
- Data import assistance (self-serve CSV wizard only)
- Custom configuration
- Phone support (email/chat only)

### When Self-Serve Merchants Can Upgrade

**Trigger:** Merchant explicitly requests more help or auto-upgraded due to:
- 3+ failed attempts at a step
- 3+ support tickets in 7 days
- 21+ days stalled after purchase

**Upgrade Path:**
- Automatically moved to Assisted cohort
- Gets 2 hours of IC time (reduced from 5 hours for organic Assisted)
- IC schedules first session within 48 hours

**Cost:** Free (customer success investment to prevent churn)

---

## Assisted Cohort: 5 Hours Free IC Support

### What's Included

**Support Package: 5 Hours of Guided Sessions**

Typical session breakdown:
1. **Session 1 (90 min):** Kickoff + data import
   - Review business needs, configure initial settings
   - Walk through data import process (products, customers)
   - Set up first location

2. **Session 2 (90 min):** Hardware setup + test transactions
   - Unbox and configure terminals
   - Run test transactions
   - Set up bank account for payouts
   - Troubleshoot any hardware issues

3. **Session 3 (60 min):** Final config + go-live prep
   - Set up integrations (accounting, eCommerce)
   - Employee training tips
   - Final pre-launch checklist
   - How to get ongoing support

4. **Buffer (60 min):** Follow-up time
   - Answer questions via email/chat
   - Quick troubleshooting calls (<15 min each)
   - Post-launch check-in

**Additional Resources:**
- All Self-Serve resources (help center, chat, email)
- Priority scheduling (book sessions within 72 hours)
- Dedicated IC assigned (continuity across sessions)
- Shared screen + recording of sessions

### Session Scheduling

**Booking Process:**
- Merchant receives Calendly link at purchase
- Can book all 3 sessions upfront or schedule incrementally
- IC sends prep checklist before each session (e.g., "have your CSV files ready")

**Cancellation Policy:**
- Can reschedule up to 4 hours before session
- Late cancellations (< 4 hours) count toward 5-hour limit
- No-shows forfeit that session's time

### Time Limit Enforcement

**What Happens if Merchant Needs More Than 5 Hours?**

**Option 1: Pay for Additional Time**
- $150/hour for additional IC support
- Billed in 1-hour increments
- Merchant can purchase 2, 5, or 10-hour blocks

**Option 2: Upgrade to Managed Package** (if eligible)
- If merchant reveals higher complexity (e.g., actually has 15 locations, not 5)
- IC recommends upgrading to full Managed implementation
- Credit 5 free hours toward Managed package price

**Option 3: Extend for Free (Exception Cases)**
- IC Manager can approve additional 2 hours if:
  - Technical issue on our side caused delays
  - Merchant is high-value (>$1M GTV) and we want to retain
  - Strategic account or referral partner

**Tracking:** All IC time logged in CRM to monitor usage patterns and refine 5-hour estimate

---

## Managed Cohort: Paid Implementation Package

### Pricing Model: Base + Per-Location

**Base Package: $2,500**
- Covers: Project planning, first 3 locations, 15 hours of IC time
- Includes: Dedicated IC, project plan, weekly check-ins, go-live support

**Additional Locations: $250 per location** (locations 4+)
- Examples:
  - 5 locations = $2,500 + (2 × $250) = **$3,000**
  - 10 locations = $2,500 + (7 × $250) = **$4,250**
  - 25 locations = $2,500 + (22 × $250) = **$8,000**

**Why Base + Per-Location vs. Pure Hourly or Fixed Fee?**

| Model | Pros | Cons | Verdict |
|-------|------|------|---------|
| **Hourly ($150-200/hr)** | Simple, transparent | Unpredictable total cost, incentivizes slow work, feels transactional | ❌ Not recommended |
| **Fixed Fee (e.g., $5K flat)** | Predictable cost | Doesn't scale with complexity, loses money on 50-location rollouts | ❌ Not recommended |
| **Base + Per-Location** | Scales with complexity, predictable, aligns cost with merchant value | Slightly more complex to explain | ✅ **Recommended** |

**Industry Benchmark:** Consulting firms use this model (base engagement fee + unit pricing) for scalable implementations.

---

### What's Included in Managed Package

**Dedicated Implementation Consultant:**
- Single point of contact throughout onboarding
- Direct phone/email access (no ticketing system)
- Proactive check-ins (IC reaches out, merchant doesn't have to ask)

**Comprehensive Project Plan:**
- Custom timeline based on merchant's go-live date
- Phased rollout plan for multi-location deployments
- Milestone tracking (merchant can see progress)

**Implementation Services:**
- **Data import:** IC handles all CSV imports, data mapping, validation
- **System configuration:** Products, taxes, discounts, employee permissions, hardware setup per location
- **Integration setup:** eCommerce, accounting, loyalty, B2B (if applicable)
- **Hardware deployment:** Coordinate shipments, on-site setup option (see below)
- **Staff training:** Live training sessions for managers + recorded videos for staff
- **Go-live support:** IC available during first week of operations (daily check-ins)
- **Post-launch check-in:** 30-day review to address any issues

**Project Timeline Examples:**
- **Single complex location (restaurant group HQ):** 2-3 weeks
- **5-10 locations (phased rollout):** 4-6 weeks
- **25+ locations (enterprise rollout):** 8-12 weeks

---

### On-Site Setup Option (Premium Add-On)

**When to Offer:**
- Merchant has limited technical staff
- First-time POS users (e.g., new business opening)
- High-stakes rollout (major remodel, grand opening event)
- Geographic concentration (all locations in same region)

**Pricing:**
- **$1,500/day** + travel expenses (flight, hotel, meals)
- Includes: Full day on-site (8 hours), setup of all hardware, staff training

**Typical Use Cases:**
- Flagship location setup (other locations replicate)
- Grand opening support (IC on-site for first few days of operations)
- Complex hardware integration (kitchen display systems, self-checkout kiosks)

**Phase 1 Recommendation:** Offer on-site as optional add-on, but don't proactively push it (keep most implementations virtual). Track demand to inform Phase 2 positioning.

---

### How Managed Package is Sold

**Presented During Purchase (Step 6):**

When Managed cohort merchant reaches payment step, they see:

**Quote Breakdown:**
- X-Series Subscription: $X/month
- Hardware: $X (one-time)
- **Implementation Package (Recommended): $X**
  - "Dedicated IC to manage your rollout"
  - "15+ hours of hands-on support"
  - "Go-live in [X weeks] with zero downtime"
- Lightspeed Payments: X% per transaction

**CTA:** "Add Implementation Package" (checkbox, checked by default for Managed)

**AE Talking Points:**
- "With [X] locations and [$X] in annual volume, you need a flawless rollout"
- "Our IC will handle all the technical heavy lifting so you can focus on running your business"
- "Includes staff training so your team is confident from day one"
- "Investment pays for itself in week one by avoiding lost sales from setup issues"

**Objection Handling:**
- **"That's expensive"** → "Compared to the cost of downtime or training delays, it's minimal. Plus, we're guaranteeing a [X-week] go-live timeline."
- **"We have technical staff"** → "Great! Your team can collaborate with our IC - we've seen every edge case and can accelerate your timeline."
- **"Can we try without it first?"** → "Absolutely - you can start with the free 5-hour Assisted support. If you need more, we can upgrade to Managed later." (Note: Upgrade pricing is same, no penalty)

---

## Free vs. Paid IC Support Decision Tree

### When is IC Support Free?

| Scenario | Free IC Support? | Hours Included | Rationale |
|----------|------------------|----------------|-----------|
| **Self-Serve merchant completes onboarding smoothly** | ✅ Yes (reactive only) | Minimal (interventions only) | No active help needed |
| **Self-Serve merchant stalls/struggles** | ✅ Yes (auto-upgraded) | 2 hours (reduced Assisted) | Retention investment |
| **Assisted merchant (organic)** | ✅ Yes (proactive) | 5 hours | Included in subscription value prop |
| **Assisted merchant needs >5 hours** | ❌ Paid (hourly) | $150/hour after 5 hours | Fair use policy |
| **Managed merchant (standard)** | ❌ Paid (package) | 15+ hours in package | Complex, high-value implementation |
| **Managed merchant (strategic)** | ✅ Yes (exception) | Unlimited (within reason) | Lighthouse customer, referral partner, etc. |

### When to Recommend Paid IC Support

**IC should proactively recommend paid support when:**
1. **Complexity Revealed During Free Sessions**
   - "I see you have 12 locations - the 5 free hours will only cover 2-3 locations. I recommend our Managed package to do this right."

2. **Custom Requirements**
   - Extensive data migration (>10K SKUs, complex inventory)
   - Custom integrations not in standard catalog
   - Tight timeline (need to go-live in <2 weeks)

3. **Merchant Requests Additional Help**
   - "Can you help with [X]?" → Check if within 5-hour scope
   - If not, offer: "I can add that for $150/hour, or we can upgrade you to Managed package which includes it."

---

## IC Capacity Planning

### IC Workload Model (Per Week)

| Cohort | Merchants per IC | Hours per Merchant | Total Hours |
|--------|------------------|---------------------|-------------|
| **Self-Serve Interventions** | 10-15 merchants | 0.5 hr avg (quick calls) | 5-7.5 hrs |
| **Assisted (Active)** | 5-8 merchants | 5 hrs (spread over 2-3 weeks) | 8-15 hrs |
| **Managed (Active)** | 2-3 merchants | 15+ hrs (spread over 4-8 weeks) | 10-15 hrs |
| **Admin/Prep** | N/A | Scheduling, follow-ups, docs | 5 hrs |
| **Team Meetings** | N/A | Training, standups, retrospectives | 3 hrs |
| **Total** | | | **31-45 hrs** |

**Conclusion:** Each IC can support ~20 active merchants across all cohorts simultaneously.

**Team Sizing (Phase 1):**
- Expected lead volume: 100 merchants/month
- Distribution: 60% Self-Serve, 30% Assisted, 10% Managed
- IC needs:
  - Self-Serve interventions: 60 merchants × 0.5 hr = 30 hrs/month = 0.75 FTE
  - Assisted: 30 merchants × 5 hr = 150 hrs/month = 3.75 FTE
  - Managed: 10 merchants × 15 hr = 150 hrs/month = 3.75 FTE
  - **Total: 8-10 ICs** (with buffer for peaks and PTO)

---

## Revenue Impact Analysis

### Projected Revenue from Paid IC Services (Phase 1)

**Assumptions:**
- 100 new merchants per month
- 10% are Managed cohort
- 80% of Managed merchants purchase implementation package

**Monthly Revenue:**
- Managed implementations: 10 merchants × 80% attach rate = 8 packages/month
- Average package price: $3,500 (assumes avg 6 locations)
- **Monthly IC revenue: $28,000**
- **Annual IC revenue: $336,000**

**Additional Revenue Opportunities:**
- Assisted cohort overages: 30 merchants × 20% need extra hours × 2 hrs avg × $150/hr = $1,800/month = $21,600/year
- On-site visits: 2/month × $1,500 = $3,000/month = $36,000/year
- **Total Potential Annual IC Revenue: $393,600**

**Cost Analysis:**
- 10 ICs × $60K avg salary = $600K annual payroll cost
- Burden (benefits, taxes, tools): $600K × 1.3 = $780K fully-loaded cost

**Conclusion:** IC services are not a profit center (revenue ~$400K vs. cost ~$780K). The value is in **improving activation rates and retention**, not direct revenue.

**ROI Calculation:**
- If IC support increases activation rate by 15% (from 70% to 85%)
- 100 merchants/month × 15% improvement = 15 additional active merchants/month
- 15 merchants × $200 avg monthly subscription = $3,000 additional MRR/month
- **$36,000 additional ARR per month** = **$432,000 annual recurring revenue**
- Plus: Payment processing revenue (15 merchants × $2K monthly GTV × 2.9% rate = $870/month = $10,440/year per cohort)

**Verdict:** IC investment is justified by improved activation, not by IC service revenue.

---

## Merchant Presentation & Transparency

### How to Communicate IC Pricing

**On Pricing Page:**
- Self-Serve: "Free support via help center and chat"
- Assisted: "Includes 5 hours of guided setup with an expert"
- Managed: "Add dedicated implementation package for $2,500+"

**In Quote (Step 6):**
```
Lightspeed X-Series Subscription: $799/month
Hardware Bundle: $2,499 (one-time)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: $3,298

Optional Add-Ons:
☐ Implementation Package (Recommended)
  - Dedicated IC for your 8-location rollout
  - Includes 15+ hours of hands-on support
  - Price: $2,500 + (5 locations × $250) = $3,750

☐ On-Site Setup (Premium)
  - IC on-site for grand opening
  - Price: $1,500/day + travel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: $3,298 (or $7,048 with Implementation Package)
```

**Transparency Principle:** Always show IC pricing upfront, never surprise merchants with fees.

---

## Phase 1 MVP Recommendations

### Implement Now

1. **Free 5-hour IC support for Assisted cohort**
   - Build session booking system (Calendly integration)
   - Train ICs on session structure (kickoff, hardware, go-live)
   - Track time usage per merchant to validate 5-hour estimate

2. **Paid Managed implementation package**
   - Base + per-location pricing ($2,500 + $250/location)
   - Presented in quote builder at purchase
   - AE trained to sell value (not just list price)

3. **Self-Serve reactive support**
   - Help center with setup guides
   - Email/chat support (24-hour / 4-hour SLA)
   - IC intervention triggers (per `intervention-triggers.md`)

4. **Hourly overage pricing for Assisted**
   - $150/hour for additional support beyond 5 hours
   - Billed monthly, added to subscription invoice

### Defer to Phase 2

- Subscription-based IC retainer (e.g., $500/month for unlimited support)
- Self-service IC session booking for Self-Serve cohort (pay-per-session)
- Group training sessions (webinars for common topics)
- Certified partner network (outsource implementations to third-party consultants)

### Success Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| **Assisted IC Utilization** | 4-5 hours average per merchant | Is 5-hour estimate accurate? |
| **Managed Package Attach Rate** | 75%+ | Are AEs selling it effectively? |
| **IC-Assisted Activation Rate** | 90%+ (Assisted), 95%+ (Managed) | Is IC support improving outcomes? |
| **Merchant Satisfaction (IC)** | 4.5+ / 5.0 | Are merchants happy with IC experience? |
| **IC Overage Revenue** | $20K+/year | How often do merchants need >5 hours? |

---

## Appendix: IC Pricing FAQs

**Q: Can I get more than 5 hours for free if I'm a big customer?**
A: If you're in the Managed cohort (typically $2M+ GTV, 10+ locations), you should purchase the full Implementation Package which includes 15+ hours. If you're borderline, talk to your AE about upgrading to Managed.

**Q: What if I only use 2 hours of my 5-hour Assisted package?**
A: Unused hours don't roll over or refund - the 5 hours are included in your subscription value. We encourage you to use all your sessions for go-live prep and training!

**Q: Can I pay hourly instead of buying the Managed package?**
A: We don't offer pure hourly billing for Managed implementations because project-based pricing ensures we're aligned on outcomes, not hours. However, if you only need a few extra hours beyond the 5-hour Assisted package, we can bill $150/hour.

**Q: Is travel included in the on-site setup pricing?**
A: No, travel expenses (flight, hotel, meals) are billed separately at cost. We provide an estimate before you book.

**Q: Can I share my 5 hours of IC support across multiple locations?**
A: Yes! Your IC will prioritize based on your needs. Typically, you'll set up one location fully, then replicate to others.

**Q: What if my IC is sick or unavailable?**
A: We'll assign a backup IC who will review your project notes and continue where you left off. Continuity is important to us.

---

## Document Control

**Approved By:** Product Lead, CFO, Operations Lead, IC Manager
**Review Cycle:** Monthly for first 3 months, then quarterly
**Next Review:** November 2025
**Related Documents:**
- `/docs/phase-1/product/cohort-thresholds.md`
- `/docs/phase-1/product/intervention-triggers.md`
- `/docs/phase-1/product/ae-sla-strategy.md`
