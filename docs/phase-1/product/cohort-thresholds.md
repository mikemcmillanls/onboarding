# Cohort Thresholds & Assignment Rules

**Version:** 1.0
**Status:** Final for Phase 1 MVP
**Last Updated:** October 2025
**Owner:** Product Lead

---

## Executive Summary

This document defines the precise rules for assigning merchants to cohorts (Self-Serve, Assisted, Managed) during the onboarding journey. These cohorts determine both the **Selling Plan** (how they purchase) and **Setup Plan** (how they implement).

**Key Decision:** For Phase 1 MVP, we're using a simplified 2-factor model (GTV + Location Count) with manual override capability. More complex scoring will be added in Phase 2.

---

## Cohort Definitions

### Three Primary Cohorts

| Cohort | Description | Selling Plan | Setup Plan |
|--------|-------------|--------------|------------|
| **Self-Serve** | Small merchants with straightforward needs | Automated purchase flow | Self-service guides + monitoring |
| **Assisted** | Mid-market merchants needing guidance | AE consultation + self-checkout | Free IC support (up to 5 hours) |
| **Managed** | Enterprise merchants requiring white-glove service | AE negotiated pricing | Paid implementation package |

---

## Phase 1 MVP: Simplified Assignment Model

### Primary Assignment Criteria

For Phase 1, cohort assignment uses **two weighted factors**:

1. **Annual GTV (Gross Transaction Volume)** - 70% weight
2. **Location Count** - 30% weight

### GTV Thresholds

| Annual GTV Range | GTV Score | Primary Signal |
|------------------|-----------|----------------|
| < $250K | 1 | Self-Serve |
| $250K - $500K | 2 | Self-Serve (borderline) |
| $500K - $1M | 3 | Assisted |
| $1M - $2M | 4 | Assisted (high-value) |
| $2M - $5M | 5 | Managed |
| $5M+ | 6 | Managed (enterprise) |

**Rationale:**
- $250K threshold: Below this, merchants typically have simple needs and prefer self-service
- $500K-$1M: Sweet spot for AE involvement - enough revenue to justify human touch, but standardized enough for efficiency
- $2M+: Warrants custom pricing and dedicated implementation support

### Location Count Thresholds

| Location Count | Location Score | Complexity Signal |
|----------------|----------------|-------------------|
| 1 location | 1 | Simple |
| 2-3 locations | 2 | Moderate |
| 4-10 locations | 3 | Complex |
| 11-25 locations | 4 | Very Complex |
| 26+ locations | 5 | Enterprise |

**Rationale:**
- Single location: Straightforward setup, minimal coordination
- 2-10 locations: Increased complexity in rollout, data migration, staff training
- 10+ locations: Requires project management, phased rollout, dedicated support

### Assignment Algorithm

```
Cohort Score = (GTV Score × 0.7) + (Location Score × 0.3)

If Cohort Score < 2.5 → Self-Serve
If Cohort Score 2.5 - 4.0 → Assisted
If Cohort Score > 4.0 → Managed
```

### Assignment Examples

| Merchant Profile | GTV | Locations | GTV Score | Location Score | Cohort Score | Assigned Cohort |
|------------------|-----|-----------|-----------|----------------|--------------|-----------------|
| Small cafe | $150K | 1 | 1 | 1 | 1.0 | Self-Serve |
| Local retailer | $400K | 2 | 2 | 2 | 2.0 | Self-Serve |
| Restaurant group | $800K | 5 | 3 | 3 | 3.0 | Assisted |
| Regional chain | $1.5M | 8 | 4 | 3 | 3.7 | Assisted |
| Multi-state retail | $3M | 15 | 5 | 4 | 4.7 | Managed |
| National brand | $10M | 50 | 6 | 5 | 5.7 | Managed |

---

## Edge Case Handling

### Scenario 1: High Locations, Low GTV
**Example:** Nonprofit with 15 locations but only $300K annual GTV

**Calculation:**
- GTV Score: 2 (for $300K)
- Location Score: 4 (for 15 locations)
- Cohort Score: (2 × 0.7) + (4 × 0.3) = 1.4 + 1.2 = **2.6**
- **Assigned Cohort: Assisted**

**Rationale:** The location complexity (rollout coordination, training, hardware deployment) justifies IC support even if revenue is lower. The weighted model captures this appropriately.

### Scenario 2: High GTV, Single Location
**Example:** High-volume single restaurant doing $2.5M annually

**Calculation:**
- GTV Score: 5 (for $2.5M)
- Location Score: 1 (single location)
- Cohort Score: (5 × 0.7) + (1 × 0.3) = 3.5 + 0.3 = **3.8**
- **Assigned Cohort: Assisted**

**Rationale:** High GTV warrants AE consultation for custom pricing, but single location keeps it in Assisted vs. Managed. AE can still negotiate rates and IC provides setup support without full enterprise implementation.

**Override Consideration:** If merchant requests white-glove service and is willing to pay for Managed implementation package, allow manual upgrade to Managed cohort.

### Scenario 3: Borderline Scores
**Example:** Merchant scores exactly 2.5 (borderline between Self-Serve and Assisted)

**Default Rule:** Round **up** to Assisted if score = 2.5

**Rationale:** Conservative approach - better to offer more support than needed vs. leaving a merchant struggling in self-serve. We can always downgrade support if merchant prefers autonomy.

### Scenario 4: Missing GTV Data
**Example:** Merchant skips or doesn't know annual revenue during signup

**Fallback Logic:**
1. Ask optional follow-up: "Estimated monthly transactions?"
2. If still blank, use **Location Count only** as temporary assignment
3. Flag for AE/IC review during first interaction
4. Re-assign cohort once GTV data is collected

**Temporary Assignment (GTV unknown):**
- 1 location → Self-Serve (with monitoring flag)
- 2-5 locations → Assisted
- 6+ locations → Assisted (high complexity flag)

### Scenario 5: International Merchants
**Example:** Canadian merchant with unknown GTV equivalency

**Approach for Phase 1:**
- Convert all non-USD GTV to USD using current exchange rates
- Apply same thresholds
- Flag for manual review if currency is volatile or business model differs significantly

**Phase 2 Enhancement:** Region-specific thresholds based on market dynamics

---

## Cohort Override Rules

### Manual Override Authority

| Override Type | Who Can Override | Approval Required | Common Scenarios |
|---------------|------------------|-------------------|------------------|
| **Upgrade** (Self-Serve → Assisted) | AE, IC, Support Lead | No | Merchant struggling, requests help |
| **Upgrade** (Assisted → Managed) | AE only | Sales VP approval if discount requested | Large deal, strategic account |
| **Downgrade** (Assisted → Self-Serve) | AE, IC | No | Merchant prefers autonomy, highly technical |
| **Downgrade** (Managed → Assisted) | AE only | Sales VP approval | Budget constraints, simpler than expected |

### Override Tracking
All manual overrides must be logged with:
- Original cohort and new cohort
- Override reason (dropdown + free text)
- Who approved the override
- Date of override

**Purpose:** Track override patterns to refine the assignment model in Phase 2

### Special Case: Strategic Accounts
Certain merchants may be flagged as "Strategic" regardless of GTV/location count:
- Existing Lightspeed customers expanding to Payments
- Industry influencers or high-visibility brands
- Referral partners or resellers
- Lighthouse customers for new verticals

**Rule:** Strategic flag automatically assigns **Managed cohort** with override.

---

## Phase 2 Enhancements: Multi-Factor Scoring Model

### Planned Additional Factors (Future State)

For Phase 2, we'll expand to a **5-factor complexity scoring model**:

| Factor | Weight | Scoring Criteria |
|--------|--------|------------------|
| **Annual GTV** | 40% | Same thresholds as Phase 1 |
| **Location Count** | 25% | Same thresholds as Phase 1 |
| **Business Vertical** | 15% | Risk/complexity by industry |
| **Integration Needs** | 10% | Number of third-party systems |
| **Add-on Products** | 10% | eCommerce, B2B, advanced features |

### Business Vertical Complexity Scoring (Phase 2)

| Vertical | Complexity Score | Rationale |
|----------|------------------|-----------|
| **Restaurant (QSR)** | Low (1) | Standardized setup, high volume |
| **Restaurant (Full Service)** | Medium (2) | Table management, tips, reservations |
| **Retail (Simple)** | Low (1) | Basic inventory, straightforward SKUs |
| **Retail (Complex)** | High (3) | Matrix items, variants, seasonal inventory |
| **Golf** | High (3) | Multi-revenue streams (pro shop, tee times, F&B) |
| **Specialty** | Medium (2) | Varies by needs |

### Integration Needs Scoring (Phase 2)

| Integration Count | Score | Examples |
|-------------------|-------|----------|
| 0-1 integrations | 1 | Just accounting sync |
| 2-3 integrations | 2 | Accounting + eCommerce + loyalty |
| 4+ integrations | 3 | Full ecosystem (accounting, eCommerce, loyalty, inventory, scheduling) |

### Add-on Products Scoring (Phase 2)

| Add-ons | Score | Complexity |
|---------|-------|------------|
| POS only | 1 | Simple |
| POS + eCommerce | 2 | Moderate (omnichannel considerations) |
| POS + eCommerce + B2B | 3 | High (multiple selling channels, pricing rules) |

**Phase 2 Algorithm:**
```
Cohort Score = (GTV × 0.40) + (Locations × 0.25) + (Vertical × 0.15) + (Integrations × 0.10) + (Add-ons × 0.10)
```

**Why Not Phase 1?**
- Simplicity: Easier to test and validate with 2 factors
- Data availability: We don't yet collect vertical/integration data early enough
- Operational readiness: AE/IC teams need to stabilize with basic segmentation first

---

## Recommendation for Phase 1 MVP

### What to Implement Now

1. **Use the simplified 2-factor model** (GTV + Location Count)
2. **Implement the edge case rules** outlined above
3. **Build manual override capability** with tracking
4. **Flag borderline cases** for human review
5. **Set up monitoring** to track cohort distribution and override patterns

### What to Defer to Phase 2

1. Multi-factor complexity scoring (vertical, integrations, add-ons)
2. Machine learning-based assignment
3. Dynamic re-assignment based on behavior
4. Region-specific thresholds

### Success Metrics for Phase 1

Track these metrics to validate the model and inform Phase 2 refinements:

| Metric | Target | Purpose |
|--------|--------|---------|
| **Cohort Distribution** | 60% Self-Serve, 30% Assisted, 10% Managed | Validate market mix |
| **Override Rate** | < 15% of assignments | Indicates model accuracy |
| **Self-Serve Completion Rate** | > 75% | Confirms appropriate cohort assignment |
| **Assisted Completion Rate** | > 90% | IC support is effective |
| **Managed Satisfaction** | > 95% | White-glove experience is working |

### Phase 1 Launch Checklist

- [ ] Cohort assignment logic coded and tested
- [ ] Edge case handling implemented (missing GTV, borderline scores)
- [ ] Manual override interface built for AE/IC teams
- [ ] Dashboard shows cohort assignments in real-time
- [ ] Analytics tracking cohort distribution and override patterns
- [ ] Training completed for AE/IC teams on cohort definitions
- [ ] Fallback procedures documented for system failures

---

## Data Collection Requirements

### At Account Creation (Step 2)
**Required fields:**
- Annual revenue estimate (dropdown)
  - Under $100K
  - $100K - $250K
  - $250K - $500K
  - $500K - $1M
  - $1M - $2M
  - $2M - $5M
  - Over $5M
  - Prefer not to say

- Number of locations (numeric input)

**Optional fields:**
- Monthly transaction estimate (if annual revenue unknown)

### Validation Rules
- If "Prefer not to say" selected for revenue → Use location count only, flag for review
- If location count > 50 → Auto-flag as enterprise, require AE contact before proceeding
- If annual revenue > $5M → Auto-assign to Managed, trigger immediate AE notification

---

## Appendix: Cohort Assignment Decision Tree

```
START: Merchant enters annual GTV and location count
  |
  ├─> GTV missing?
  |     ├─> YES: Use Location Count only
  |     |         ├─> 1 location → Self-Serve (flagged)
  |     |         ├─> 2-5 locations → Assisted
  |     |         └─> 6+ locations → Assisted (high complexity)
  |     └─> NO: Continue
  |
  ├─> Calculate GTV Score (1-6)
  ├─> Calculate Location Score (1-5)
  ├─> Calculate Cohort Score = (GTV × 0.7) + (Location × 0.3)
  |
  ├─> Cohort Score < 2.5?
  |     └─> YES: Assign Self-Serve
  |
  ├─> Cohort Score 2.5 - 4.0?
  |     └─> YES: Assign Assisted
  |
  ├─> Cohort Score > 4.0?
  |     └─> YES: Assign Managed
  |
  ├─> Check for Strategic Account flag?
  |     └─> YES: Override to Managed
  |
  └─> Finalize cohort assignment
        ├─> Log assignment
        ├─> Route to appropriate selling plan
        └─> Notify AE if Assisted or Managed
```

---

## Document Control

**Approved By:** Product Lead, Sales VP, Operations Lead
**Review Cycle:** Monthly for first 3 months, then quarterly
**Next Review:** November 2025
**Related Documents:**
- `/docs/phase-1/product/intervention-triggers.md`
- `/docs/phase-1/product/ae-sla-strategy.md`
- `/docs/phase-1/product/ic-pricing-model.md`
