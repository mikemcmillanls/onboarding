# Trial vs. Buy-First Strategy

**Version:** 1.0
**Status:** Final Recommendation
**Last Updated:** October 2025
**Owner:** Product Lead

---

## Executive Summary

**Core Question:** Should we offer a free trial before purchase, or require merchants to buy first before accessing the system?

**Recommendation for Phase 1:** **Buy-First with Limited Trial Option**

We recommend a hybrid approach where:
- **Primary path:** Buy-first (software + hardware purchase required)
- **Secondary path:** 14-day "Explore Mode" trial for high-intent leads who need to validate the product before committing (no hardware, limited features)

**Rationale:** The unique nature of POS systems (physical hardware requirement, data migration complexity, KYB/KYC compliance gates) makes traditional SaaS free trials problematic. However, a limited exploration option reduces friction for qualified prospects.

---

## Decision Framework

### Key Considerations for POS/Payments Onboarding

Unlike typical SaaS products, POS + Payments has unique constraints:

| Factor | Impact on Trial Strategy |
|--------|--------------------------|
| **Hardware Dependency** | Can't fully evaluate POS without physical terminals |
| **Payments Compliance** | KYB/KYC required before processing real transactions |
| **Data Migration Effort** | Merchant won't invest in import until committed |
| **High Implementation Cost** | Free trials without commitment waste IC resources |
| **Switching Costs** | Merchants rarely "trial" POS systems - it's a committed migration |
| **Revenue Model** | Primary revenue from transaction processing, not subscription |

**Conclusion:** Traditional 30-day free trials don't align with POS buyer behavior or our cost structure.

---

## Industry Benchmarks: Trial vs. Buy-First

### SaaS Trial Conversion Data (from research)

**Opt-In Trials (no credit card):**
- Average conversion rate: **18.2%**
- Higher signup volume but lower qualification
- Best for: Low-touch, self-serve products

**Opt-Out Trials (credit card required):**
- Average conversion rate: **48.8%**
- Lower signup volume but higher commitment
- Best for: Products requiring onboarding investment

**B2B SaaS (complex products):**
- Average trial conversion: **15-30%**
- Longer sales cycles (30-90 days)
- Often combine trial with AE consultation

### POS Competitor Analysis

| Competitor | Trial Offering | Conversion Approach |
|------------|----------------|---------------------|
| **Square** | No trial - Buy hardware to start | Instant signup, low-commitment pricing |
| **Clover** | Demo available, hardware required to process | Hardware purchase required |
| **Toast** | No trial - AE demo, then purchase | Sales-led for all accounts |
| **Shopify POS** | 3-day trial, then $89/mo | Software-focused, hardware optional |

**Pattern:** Most established POS systems don't offer traditional free trials. They either:
1. Offer demos/sandbox mode (view-only)
2. Require hardware purchase to start
3. Sales-led with product demos

---

## Phase 1 Recommendation: Buy-First with Limited Trial Option

### Primary Path: Buy-First (90% of merchants)

**How it Works:**
1. Merchant goes through Steps 1-6 (qualify, purchase software + hardware)
2. Account provisioned immediately upon payment
3. Full system access while waiting for hardware delivery
4. Can start configuring: products, taxes, employees, integrations
5. Hardware arrives → complete setup → process payments

**Why This Works:**
- **Commitment signal:** Merchant has made financial investment, more likely to complete onboarding
- **Resource efficiency:** We only invest IC time in paid customers
- **Better data quality:** KYB/KYC completed upfront ensures compliance
- **Hardware coordination:** No risk of shipping hardware to uncommitted leads
- **Realistic behavior:** Merchants switching POS systems are making a committed decision, not casually trying

**Merchant Value Proposition:**
- "Start building your system today - hardware ships immediately"
- "Your account is live - import your data and configure while hardware is in transit"
- "30-day money-back guarantee if not satisfied"

---

### Secondary Path: "Explore Mode" Trial (10% of merchants)

**Target Audience:**
- High-intent leads who need to validate the product before budget approval
- Merchants comparing multiple POS systems
- Existing Lightspeed X-Series customers considering adding Payments
- Merchants with technical teams who need to test API/integrations

**How it Works:**
1. Merchant can request "Explore Mode" access from pricing page
2. Requires: Email, company name, phone (light qualification)
3. Gets: **14-day read-only sandbox account** with demo data
4. Can explore: UI/UX, reporting, feature set, integrations
5. Cannot: Process real transactions, complete full setup, receive hardware
6. **Day 7:** Automated email with case studies + "Ready to buy?" CTA
7. **Day 12:** AE/IC reaches out to answer questions, offer conversion incentive
8. **Day 14:** Trial expires, must convert to paid to continue

**Limitations (by design):**
- No hardware shipment during trial
- Cannot complete KYB/KYC (no payment processing)
- Cannot import real merchant data (only demo data)
- Limited to single location view
- No IC support during trial (self-serve resources only)

**Conversion Incentives:**
- "Convert within trial period: Get first month 50% off"
- "Priority hardware shipping if you purchase during trial"
- "Free 1-hour IC onboarding session for trial converts"

**Expected Conversion Rate:** 35-40% (higher than opt-in trials due to qualification + limited functionality creating urgency)

---

## Pros and Cons Analysis

### Buy-First Approach

**Pros:**
- Higher commitment level → better completion rates
- Resource efficiency (IC time spent on paid customers)
- Compliance completed upfront (KYB/KYC before product access)
- Hardware and software purchases aligned
- Clearer revenue recognition
- Matches POS industry norms
- 30-day money-back guarantee reduces risk perception

**Cons:**
- Higher barrier to entry (requires payment upfront)
- May lose some low-commitment browsers
- Competitive disadvantage vs. Square's instant signup
- Requires strong sales/marketing to overcome friction

---

### Limited Trial ("Explore Mode") Approach

**Pros:**
- Reduces friction for qualified prospects who need validation
- Competitive with other POS systems offering demos
- Allows technical evaluation (API testing, integration validation)
- Provides conversion funnel for high-intent leads not ready to buy
- Can upsell existing X-Series customers to add Payments

**Cons:**
- Lower conversion rates than buy-first (35% vs. 100%)
- Requires separate product flow and access controls
- Risk of tire-kickers wasting AE/IC time
- Demo environment maintenance overhead
- May cannibalize some direct purchases if not positioned carefully

---

### Full Free Trial Approach (NOT RECOMMENDED)

**Why We Don't Recommend Traditional 30-Day Free Trial:**

**Operational Challenges:**
- **Hardware Dilemma:** Do we ship hardware to trial users?
  - If YES: High cost, abuse risk, returns logistics nightmare
  - If NO: Trial isn't representative of real experience
- **Payments Compliance:** KYB/KYC required before processing transactions - can't offer true "free trial" of payments without completing underwriting
- **Data Migration:** Merchants won't invest time importing data until committed
- **IC Resource Drain:** Supporting trial users with onboarding takes same effort as paid customers
- **Low Conversion:** POS trials likely convert <20% (based on B2B SaaS benchmarks for complex products)

**Financial Impact:**
- Estimated cost per trial user: $150-200 (IC time, hardware shipment if offered, support)
- At 20% conversion, cost per acquisition: $750-1000
- Too high for low-to-mid GTV merchants (Self-Serve and Assisted cohorts)

**Alternative Solution:** 30-day money-back guarantee provides similar risk reduction without operational complexity

---

## Impact on Onboarding Flow (Steps 1-2)

### Current Flow (PRD)
```
Step 1: Browse pricing → Click "Buy Now"
Step 2: Create account → Collect GTV/locations → Route to cohort
Step 3+: Continue to purchase
```

### Updated Flow with Trial Option

**Step 1: Browse Pricing → Two CTAs**
- **Primary CTA:** "Buy Now" (prominent, recommended)
- **Secondary CTA:** "Explore First" (smaller, below fold)

**Step 2A: Buy Path (Primary - 90%)**
- Create account → Collect qualifying info → Route to cohort → Continue to purchase
- *No change from original PRD*

**Step 2B: Explore Mode Path (Secondary - 10%)**
- Click "Explore First" → Light signup form (email, name, company, phone)
- Instant access to sandbox account with demo data
- Banner: "You're in Explore Mode - 14 days to try before you buy"
- **Day 1:** Email with guided tour, key features to test
- **Day 7:** Email with conversion offer
- **Day 12:** AE/IC outreach if high-value signals (viewed pricing, explored integrations, etc.)
- **Day 14:** Trial expires → Modal: "Convert now for 50% off first month"

**How Explore Mode Users Convert:**
- Click "Upgrade to Full Access" in dashboard
- Redirected to Step 2 (account creation) → Pre-fill info from trial signup
- Continue through Steps 3-6 (KYB, purchase, hardware)
- Trial sandbox data discarded (start fresh with real account)

---

## Phase 1 Implementation Scope

### Build Now (MVP)

**Buy-First Path:**
- ✅ Already defined in PRD Steps 1-6
- Add: 30-day money-back guarantee messaging on pricing page
- Add: "Start configuring while hardware ships" value prop

**Explore Mode Trial (Optional for Phase 1):**
If resources allow, build lightweight version:
- Landing page: "Explore Lightspeed POS" with trial signup form
- Provision: Read-only sandbox account with demo data (1 location, sample products/transactions)
- Limit: 14-day access, no hardware, no real payment processing
- Email automation: Day 1 welcome, Day 7 conversion nudge, Day 12 AE reach-out trigger, Day 14 expiration
- Dashboard banner: "Explore Mode - Upgrade to unlock full features"
- Conversion flow: "Upgrade" button → redirect to Step 2 of main onboarding

**If Explore Mode is too complex for Phase 1:** Defer to Phase 2 and focus on optimizing buy-first path with money-back guarantee.

---

### Defer to Phase 2

- Advanced trial features (partial hardware shipment, test transaction processing)
- Dynamic trial length based on merchant behavior
- Personalized trial experiences by vertical (restaurant demo vs. retail demo)
- Trial-to-paid conversion optimization experiments
- Integration testing sandbox (full API access during trial)

---

## Success Metrics

### Buy-First Path
| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lead-to-Purchase Conversion** | 40%+ | % of qualified leads who complete Step 6 |
| **Purchase-to-Active Conversion** | 85%+ | % of paid merchants who process first transaction |
| **Money-Back Guarantee Usage** | <5% | % of purchases requesting refunds |

### Explore Mode Trial Path (if implemented)
| Metric | Target | Measurement |
|--------|--------|-------------|
| **Trial Signup Rate** | 8-10% of site visitors | % of pricing page viewers who start trial |
| **Trial Engagement** | 60%+ active users | % of trial users who log in 3+ times |
| **Trial-to-Paid Conversion** | 35%+ | % of trial users who purchase |
| **Trial User Quality** | 50%+ meet Assisted/Managed criteria | % of trial users who are high-value |

---

## Competitive Positioning

### Messaging for Buy-First

**Address the Objection:** "Why do I have to pay before I can try it?"

**Positioning:**
- "Unlike basic systems, Lightspeed POS is a committed business platform - we want to ensure you're serious about making the switch"
- "Your 30-day money-back guarantee means zero risk"
- "Start building your system immediately - configure products, set up employees, import data while hardware ships"
- "We ship hardware within 24 hours because we know you're ready to go live"

### Messaging for Explore Mode (if implemented)

**Positioning:**
- "Not ready to commit? Explore Lightspeed POS for 14 days"
- "See how we compare to [Square, Clover, Toast]"
- "Perfect for teams who need to validate features before budget approval"
- "Upgrade anytime during your trial for priority hardware shipping"

---

## Risk Mitigation

### Risk 1: Higher Buy-First Friction Reduces Lead Volume

**Mitigation:**
- Strong money-back guarantee (30 days, no questions asked)
- Financing options (payment plans, lease-to-own hardware)
- Free AE consultation for Assisted/Managed cohorts (reduce uncertainty)
- Social proof (testimonials, case studies, "5000+ merchants switched to Lightspeed")

### Risk 2: Explore Mode Trial Cannibalizes Direct Purchases

**Mitigation:**
- Position trial as secondary option (smaller CTA, not default)
- Target trial at specific audiences (enterprise, technical evaluation, multi-brand comparisons)
- Time-limited conversion incentive (discount only during trial period)
- Qualify trial users (require company info, phone) to filter out tire-kickers

### Risk 3: Low Trial Conversion Wastes Resources

**Mitigation:**
- No IC support during trial (self-serve only)
- No hardware shipment during trial
- Automated email nurture sequence (no manual AE time until Day 12)
- Strict 14-day limit (create urgency)

---

## Final Recommendation

**For Phase 1 MVP:**

1. **Primary Strategy: Buy-First with 30-Day Money-Back Guarantee**
   - Focus 90% of resources on optimizing the buy-first path
   - Emphasize immediate value: "Start configuring today, hardware ships tomorrow"
   - Strong guarantee reduces perceived risk

2. **Optional: Lightweight Explore Mode Trial**
   - Only implement if resources allow without delaying Phase 1 launch
   - Keep it simple: read-only sandbox, 14 days, automated nurture
   - Position as secondary path for qualified prospects

3. **Messaging Focus:**
   - Lead with commitment and business-readiness positioning
   - Use guarantee as primary risk-reducer
   - Highlight fast time-to-value (configure while hardware ships)

4. **Phase 2 Enhancements:**
   - Optimize trial features based on Phase 1 learnings
   - Test trial length (7 days vs. 14 days)
   - Experiment with trial-to-paid conversion incentives
   - Consider hardware "trial packs" (deposit-based, returnable)

---

## Appendix: Decision Matrix

| Approach | Lead Volume | Lead Quality | Conversion Rate | Resource Efficiency | Operational Complexity |
|----------|-------------|--------------|-----------------|---------------------|------------------------|
| **Full Free Trial** | High | Low | 15-20% | Low (wasted IC time) | Very High (hardware, compliance) |
| **Buy-First Only** | Medium | High | 85%+ (of purchases) | High | Low |
| **Limited Explore Mode** | Medium-High | Medium | 35% (trial) + 85% (direct buy) | Medium | Medium |
| **Hybrid (Recommended)** | High | High | Blended 70%+ | High | Medium |

---

## Document Control

**Approved By:** Product Lead, Sales VP, CFO, Operations Lead
**Review Cycle:** After Phase 1 launch, then quarterly
**Next Review:** 90 days post-launch
**Related Documents:**
- `/docs/phase-1/product/cohort-thresholds.md`
- `/docs/phase-1/product/ae-sla-strategy.md`
- Merchant Onboarding PRD (main document)
