# Intervention Triggers & Escalation Rules

**Version:** 1.0
**Status:** Final for Phase 1 MVP
**Last Updated:** October 2025
**Owner:** Product Lead

---

## Executive Summary

This document defines when and how to automatically escalate merchants who are stalled, struggling, or at risk of abandonment during the onboarding journey. The goal is to **proactively prevent drop-offs** while **optimizing IC/AE resource allocation**.

**Key Principle:** Intervene early enough to save the deal, but not so early that we create unnecessary work.

---

## Intervention Framework

### Three Types of Triggers

1. **Time-Based Triggers** - Merchant inactive for X days at a specific step
2. **Attempt-Based Triggers** - Merchant fails X attempts at a specific action
3. **Behavior-Based Triggers** - Merchant exhibits abandonment signals

### Three Escalation Levels

| Level | Description | Action | Owner |
|-------|-------------|--------|-------|
| **Level 1: Automated Nudge** | Merchant slightly delayed | Send automated reminder email/SMS | Marketing automation |
| **Level 2: IC Soft Reach-Out** | Merchant moderately stalled | IC sends personalized offer to help | IC team (proactive outreach) |
| **Level 3: AE/IC Escalation** | Merchant significantly blocked or high-value | AE/IC calls directly, may offer concessions | AE/IC manager assigns |

---

## Stage 1: Qualify Leads (Steps 1-3)

### Step 2: Account Creation - Incomplete

**Scenario:** Merchant started account creation but didn't complete

**Time-Based Trigger:**
- **24 hours** after initial form entry without submission

**Action:** Level 1 - Automated Nudge
- Email: "Complete your Lightspeed account setup"
- CTA: Return to complete registration
- Offer: "Get started in 5 minutes"

**Escalation:** If no response after **72 hours**, send second nudge with limited-time incentive

---

### Step 2: High-GTV Merchant - No AE Response

**Scenario:** High-GTV merchant assigned to Assisted/Managed cohort but hasn't been contacted by AE

**Time-Based Trigger:**
- **30 minutes** after account creation (internal SLA for AE assignment)

**Action:** Level 2 - IC Soft Reach-Out
- IC receives notification if AE hasn't claimed lead
- IC sends holding message: "An account executive will contact you within 2 hours"
- IC can offer to schedule specific time if merchant responds

**Escalation:** If AE still hasn't responded after **2 hours**, escalate to Sales Manager

---

### Step 3: KYB Qualification - Failed or Under Review

**Scenario:** Merchant failed KYB or stuck in manual review

**Attempt-Based Trigger:**
- **1st rejection** → Automated email explaining why, offering to retry with corrections

**Action:** Level 1 - Automated Nudge
- Email: "We need more information to verify your business"
- Details: Specific fields that need correction
- CTA: "Update and resubmit"

**Time-Based Trigger:**
- **48 hours** after rejection with no retry attempt

**Action:** Level 2 - IC Soft Reach-Out
- IC email: "I noticed your business verification is pending. Can I help?"
- Offer: 15-minute call to resolve issues

**Attempt-Based Escalation:**
- **2nd rejection** → Level 3 - AE/IC Escalation
- AE/IC calls to troubleshoot, may need to reject if ineligible

---

## Stage 2: Buying Experience (Steps 4-6)

### Step 4-5: Software/Hardware Selection - Stalled

**Scenario:** Merchant logged into dashboard but hasn't configured subscription or selected hardware

**Time-Based Trigger (Self-Serve):**
- **3 days** after login without progress

**Action:** Level 1 - Automated Nudge
- Email: "Need help choosing your POS setup?"
- Offer: Link to hardware bundles guide, video walkthrough
- CTA: "Continue your setup"

**Time-Based Trigger (Self-Serve):**
- **7 days** after login without progress

**Action:** Level 2 - IC Soft Reach-Out
- IC email: "I can walk you through the setup in 10 minutes"
- Offer: Calendly link for quick call

---

**Time-Based Trigger (Assisted/Managed):**
- **5 days** after AE initial contact without quote finalization

**Action:** Level 2 - AE Follow-Up
- AE internal reminder to follow up
- AE sends summary of previous discussion with next steps
- Offer: Flexible payment terms or bundle discount if merchant is price-sensitive

---

### Step 6: Payment - Abandoned Cart

**Scenario:** Merchant viewed quote but didn't complete payment

**Time-Based Trigger:**
- **4 hours** after viewing quote (same-day urgency)

**Action:** Level 1 - Automated Nudge
- Email: "Your quote is ready - complete your order"
- Show: Running total, payment options
- Urgency: "Lock in your hardware shipment"

**Time-Based Trigger:**
- **24 hours** after viewing quote

**Action:** Level 2 - IC Soft Reach-Out (Self-Serve) / AE Follow-Up (Assisted/Managed)
- Self-Serve: IC email offering to answer questions about pricing
- Assisted: AE calls to address objections, may offer limited discount or payment plan

**Time-Based Trigger:**
- **72 hours** after viewing quote

**Action:** Level 3 - AE/IC Escalation
- For Assisted/Managed: AE calls with authority to negotiate
- For Self-Serve high-potential: Upgrade to Assisted, AE reaches out
- May offer: Extended payment terms, free add-ons, expedited shipping

---

### Abandoned Cart - Win-Back Campaign

**Scenario:** Merchant abandoned payment and hasn't responded to interventions

**Time-Based Trigger:**
- **7 days** after last interaction

**Action:** Level 2 - Win-Back Email Sequence
- Email 1 (Day 7): "We miss you - here's 10% off your first month"
- Email 2 (Day 14): Case study or testimonial from similar merchant
- Email 3 (Day 21): "Last chance - talk to an expert for free consultation"

**End of Sequence:**
- After **30 days**, mark as "Cold Lead" and move to nurture campaign
- Re-engage with quarterly product updates, new features, or seasonal promotions

---

## Stage 3: Guided Setup (Steps 7-10)

### Step 7: Payments Activation (KYC) - Incomplete

**Scenario:** Merchant purchased but hasn't completed KYC (business rep + owner details)

**Time-Based Trigger:**
- **2 days** after purchase without KYC submission

**Action:** Level 1 - Automated Nudge
- Email: "Almost there - activate Lightspeed Payments"
- Emphasize: "Required to accept payments and receive payouts"
- CTA: "Complete in 5 minutes"

**Time-Based Trigger:**
- **5 days** after purchase without KYC submission

**Action:** Level 2 - IC Soft Reach-Out
- IC email/SMS: "Noticed you haven't activated payments yet. Need help?"
- Offer: Screen-share session to complete together
- Urgency: "Your hardware arrives soon - payments must be active"

**Attempt-Based Trigger:**
- **1st KYC rejection** (failed identity verification)

**Action:** Level 2 - IC Soft Reach-Out
- Automated email explaining rejection reason
- IC follows up within 24 hours if no retry attempt
- Offer: Call to troubleshoot document issues

**Time-Based Trigger:**
- **10 days** after purchase without KYC submission

**Action:** Level 3 - AE/IC Escalation
- Escalate to IC Manager
- Direct phone call with urgency
- Warning: "Account at risk of suspension if not completed"

---

### Step 7: Payments Under Review - Needs Documents

**Scenario:** Underwriting requires additional documentation

**Time-Based Trigger:**
- **Immediate** - when additional documents requested by underwriting

**Action:** Level 1 - Automated Nudge
- Email with specific document requests
- Upload portal link
- Timeline: "Submit within 48 hours to avoid delays"

**Time-Based Trigger:**
- **48 hours** after document request without upload

**Action:** Level 2 - IC Soft Reach-Out
- IC calls to explain document requirements
- Offer: Email or text alternative if documents are sensitive
- Support: Help with document gathering if needed

**Attempt-Based Trigger:**
- **2nd rejection** of documents (wrong format, illegible, etc.)

**Action:** Level 3 - AE/IC Escalation
- IC Manager reviews case
- Direct call to merchant to walk through requirements
- May need to escalate to underwriting team for special consideration

---

### Step 8: Data Import - Not Started

**Scenario:** Merchant purchased but hasn't imported data or started using the system

**Time-Based Trigger (Self-Serve):**
- **7 days** after hardware delivery with no data import

**Action:** Level 1 - Automated Nudge
- Email: "Ready to import your data? Here's how"
- Include: CSV template, video walkthrough, help center link
- CTA: "Start your import"

**Time-Based Trigger (Self-Serve):**
- **14 days** after hardware delivery with no data import

**Action:** Level 2 - IC Soft Reach-Out
- IC email: "Most merchants import data in 30 minutes - I can help"
- Offer: Free data import session (30 min)
- Book: Calendly link

---

**Time-Based Trigger (Assisted/Managed):**
- **3 days** after hardware delivery with no IC session booked

**Action:** Level 2 - IC Outreach
- IC calls/emails: "Your hardware has arrived - let's schedule your onboarding"
- Offer: Multiple time slots
- Urgency: "Book within 48 hours for priority scheduling"

---

### Step 9: Hardware Setup - Not Completed

**Scenario:** Merchant received hardware but hasn't set it up or run test transaction

**Time-Based Trigger:**
- **10 days** after hardware delivery with no test transaction

**Action:** Level 1 - Automated Nudge
- Email: "Your hardware is ready to set up"
- Include: Setup guide, troubleshooting tips
- Offer: Live chat support available

**Time-Based Trigger:**
- **21 days** after hardware delivery with no test transaction

**Action:** Level 3 - AE/IC Escalation
- **High urgency:** Merchant may be using competitor or gave up
- IC Manager assigns case for direct outreach
- AE involved if Assisted/Managed cohort
- Offer: Free on-site setup visit (if high-value merchant) or virtual white-glove session

---

### Step 9: Bank Account Not Added

**Scenario:** Merchant set up hardware but hasn't added payout bank account

**Time-Based Trigger:**
- **3 days** after first test transaction without bank account

**Action:** Level 1 - Automated Nudge
- Email: "Add your bank account to receive payouts"
- Urgency: "You have $X in pending payouts"
- CTA: "Add bank account now"

**Time-Based Trigger:**
- **7 days** after first test transaction without bank account

**Action:** Level 2 - IC Soft Reach-Out
- IC calls: "You're processing payments but can't receive funds yet"
- Troubleshoot: Address concerns about bank verification, privacy
- Offer: Walk through verification process together

---

## Auto-Escalation Rules: Self-Serve → IC Assistance

### When to Automatically Upgrade Cohort

Certain behaviors signal a merchant needs more help than self-serve can provide:

| Trigger | Threshold | Action |
|---------|-----------|--------|
| **Multiple Failed Attempts** | 3+ failed attempts at any single step | Auto-upgrade to Assisted, assign IC |
| **Prolonged Inactivity** | 21+ days with no progress after purchase | Upgrade to Assisted, IC Manager calls |
| **Support Ticket Volume** | 3+ support tickets in 7 days | Upgrade to Assisted, assign dedicated IC |
| **Requested Help** | Merchant explicitly asks for call/help | Upgrade to Assisted, IC responds within 4 hours |
| **High-Value Discovery** | Self-Serve merchant reveals $1M+ GTV in conversation | Upgrade to Managed, assign AE |

**Tracking:** All auto-upgrades logged with reason code for analysis

---

## Win-Back Campaigns for Abandoned Leads

### Definition: Abandoned Lead
A lead is considered "abandoned" if:
- **Pre-Purchase:** No activity for 7+ days after viewing quote
- **Post-Purchase:** No progress for 21+ days after payment

### Win-Back Sequence for Pre-Purchase Abandonment

| Timeline | Channel | Message | Offer |
|----------|---------|---------|-------|
| Day 7 | Email | "We noticed you didn't complete your order" | 10% discount on first 3 months |
| Day 14 | Email | Case study: "How [Similar Business] increased sales 30%" | Free consultation with AE |
| Day 21 | SMS (if provided) | "Quick question - what held you back?" | Survey with incentive |
| Day 30 | Email | "Last chance - exclusive pricing expires tonight" | Limited-time bundle deal |
| Day 45+ | Quarterly nurture | Product updates, new features, success stories | None (low-touch) |

### Win-Back Sequence for Post-Purchase Abandonment

| Timeline | Channel | Message | Offer |
|----------|---------|---------|-------|
| Day 21 | Email + Phone | "Your Lightspeed system is waiting - need help?" | Free IC setup session (2 hours) |
| Day 30 | Email | "You've already invested - let's get you live" | Dedicated IC assignment, extended support |
| Day 45 | AE Call | "We want to make this right - what do you need?" | Concessions: refund, exchange, or full IC support |
| Day 60 | Email | Final attempt: "Should we pause your account?" | Option to pause vs. cancel |

**Churn Prevention Goal:** Recover at least 20% of abandoned post-purchase merchants in Phase 1

---

## AE/IC Capacity Planning & SLA Expectations

### Workload Assumptions (Per Week)

**Account Executive (Assisted/Managed):**
- 15-20 new qualified leads per week
- 5-7 active negotiations (multi-week deals)
- 3-5 hours per week on escalations/interventions
- **Total capacity:** ~25 active merchants at any time

**Implementation Consultant (All Cohorts):**
- 10-15 Self-Serve merchants needing intervention (light touch)
- 5-8 Assisted merchants (scheduled sessions)
- 2-3 Managed merchants (ongoing white-glove)
- **Total capacity:** ~20 active merchants at any time

### SLA Expectations by Escalation Level

| Escalation Level | Response Time SLA | Resolution Time SLA |
|------------------|-------------------|---------------------|
| **Level 1: Automated Nudge** | Immediate (system-triggered) | N/A (merchant self-resolves) |
| **Level 2: IC Soft Reach-Out** | Within 4 business hours | Within 2 business days |
| **Level 3: AE/IC Escalation** | Within 2 business hours | Within 1 business day |

**Business Hours Definition (Phase 1):**
- Monday-Friday, 9 AM - 6 PM (merchant's local time zone)
- For high-value merchants (Managed cohort): Extended hours 8 AM - 8 PM

**After-Hours Handling:**
- Leads received outside business hours queued for next business day
- Automated acknowledgment email sent immediately
- High-value merchants (>$5M GTV) receive emergency contact number

---

## Intervention Dashboard (IC/AE Team View)

### Required Features

**Daily Queue View:**
- Merchants requiring intervention today (sorted by escalation level)
- Merchant profile (cohort, GTV, step stalled at, days inactive)
- Previous intervention history
- One-click actions: Call, Email, Assign to me

**Escalation Alerts:**
- Real-time notifications for Level 3 escalations
- Slack/email alerts for high-value merchants at risk
- Daily digest of Level 2 interventions needed

**Performance Metrics:**
- Response time to interventions (vs. SLA)
- Conversion rate after intervention
- Average time to resolution
- Merchant satisfaction (post-intervention survey)

---

## Phase 1 MVP Recommendations

### Implement Now

1. **All time-based triggers** for Stage 1-3 (defined above)
2. **Attempt-based triggers** for KYB/KYC failures
3. **Automated nudges** (Level 1) for all scenarios
4. **IC soft reach-outs** (Level 2) for Self-Serve and Assisted cohorts
5. **Basic win-back email sequence** for abandoned carts (7-30 day sequence)
6. **Intervention dashboard** for IC/AE teams with daily queue

### Defer to Phase 2

1. **Behavior-based triggers** (e.g., "viewed pricing page 5 times" = price-sensitive)
2. **Predictive abandonment** (ML model to identify at-risk merchants before stall)
3. **Personalized intervention content** (A/B tested messaging)
4. **SMS nudges** (start with email only)
5. **After-hours / 24-7 coverage** (stick to business hours in Phase 1)
6. **Advanced win-back campaigns** with dynamic content

### Success Metrics for Phase 1

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Intervention Response Rate** | 30%+ | % of merchants who respond to Level 1 nudge |
| **IC Conversion Rate** | 60%+ | % of Level 2 interventions that unblock merchant |
| **Escalation Prevention** | 70%+ | % of issues resolved before Level 3 |
| **Time to Intervention** | 95% within SLA | % of interventions meeting response time SLA |
| **Win-Back Conversion** | 20%+ | % of abandoned leads who re-engage and complete |

---

## Monitoring & Continuous Improvement

### Weekly Review (Operations Team)
- Intervention volume by trigger type
- IC/AE capacity utilization
- SLA compliance rates
- Conversion rates by intervention level

### Monthly Review (Product + Ops)
- Top stall points (which steps cause most interventions?)
- Cohort-specific patterns (are Self-Serve merchants stalling more than expected?)
- Trigger timing optimization (are 3-day triggers too soon or too late?)
- Win-back campaign performance

### Quarterly Review (Leadership)
- ROI of intervention programs
- Resource allocation (do we need more ICs?)
- Cohort threshold adjustments
- Phase 2 enhancements prioritization

---

## Appendix: Intervention Decision Tree

```
MERCHANT STALLED OR AT-RISK
  |
  ├─> Check: What stage?
  |     ├─> Stage 1 (Qualify) → KYB failure? → Level 2 IC help
  |     ├─> Stage 2 (Buying) → Abandoned cart? → Level 1 nudge → Level 2 AE follow-up
  |     └─> Stage 3 (Setup) → Hardware not set up? → Level 1 nudge → Level 3 escalation
  |
  ├─> Check: Time since last activity?
  |     ├─> < 3 days → Monitor, no action yet
  |     ├─> 3-7 days → Level 1 automated nudge
  |     ├─> 7-14 days → Level 2 IC soft reach-out
  |     └─> 14+ days → Level 3 AE/IC escalation
  |
  ├─> Check: Cohort?
  |     ├─> Self-Serve → IC handles interventions
  |     ├─> Assisted → IC primary, AE involved for purchasing stage
  |     └─> Managed → AE primary owner, IC supports setup
  |
  ├─> Check: Number of failed attempts?
  |     ├─> 1st failure → Level 1 automated guidance
  |     ├─> 2nd failure → Level 2 IC soft reach-out
  |     └─> 3rd failure → Level 3 escalation + consider cohort upgrade
  |
  └─> Execute intervention:
        ├─> Send notification to appropriate owner (IC/AE)
        ├─> Log intervention in CRM
        ├─> Track response and outcome
        └─> Update merchant status
```

---

## Document Control

**Approved By:** Product Lead, Sales VP, Operations Lead, IC Manager
**Review Cycle:** Weekly for first month, then monthly
**Next Review:** November 2025
**Related Documents:**
- `/docs/phase-1/product/cohort-thresholds.md`
- `/docs/phase-1/product/ae-sla-strategy.md`
- `/docs/phase-1/product/ic-pricing-model.md`
