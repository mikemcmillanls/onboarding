# Sales Context

This document captures key insights from sales team discussions about the current sales process, challenges, and considerations for the onboarding system.

## Current Sales Process & Timeline

### Ideal Flow
- **Marketing lead → SDR contact within minutes → AE handoff → close same day**
- **50% of deals close same day** they receive lead from SDR
- **Close = software activation & payment**, not hardware
- AE walks through LSPAY application on call
- Hardware order completed during initial call (ideal state)

### Reality: Application Delays
The application process creates the longest delays:

- **Missing Documents**: Merchants lack required documents
  - Business bank account information
  - SSN/SIN
  - IRS documentation
- **Underwriting Review**: Required when automated checks fail
- **Email Back-and-Forth**: Requests for additional info often ask for documents merchants don't have

## Micro Merchant Problem

### Scale & Characteristics
- **30-35% of leads** (~400/month out of 1,300-1,400 total) are micro merchants
- Common profiles:
  - Aspirational businesses without established operations
  - Many never open actual business after signing up
  - Service-based businesses that won't become ICP
  - Only afford $5/month Ignite plan

### Business Impact
- **Sales team incentivized to close any deal**, including non-viable ones
  - Pay commissions on SDR, AE, director for $5 deals
  - Give free $200 terminals to merchants who may never transact
  - **70% of Ignite merchants don't go transactional**

### Key Challenge: No Skin in the Game
- If not closed immediately, lose contact entirely
- Cancel subscriptions easily vs. established businesses with inventory/rent
- No financial commitment prevents serious engagement

## Current Segmentation

### Strategic AE Team
- **Criteria**: >$2M GTV or >10 locations
- **Team Size**: 4 reps

### SMB Team
- **Criteria**: <$2M GTV and <10 locations
- **Team Size**: 50 reps

## Proposed Solutions & Concerns

### Self-Serve Path for Micro Merchants
**Benefits**:
- Eliminate sales overhead for low-value prospects
- Let merchants disqualify themselves through trial experience
- Focus AE attention on higher-value prospects
- Account management could upsell successful self-serve merchants at $10K GTV threshold

### Major Concern: Impact on Sales Organization
- **Losing 30% of leads requires reforecasting targets**
- Current rep hiring based on 45 leads per rep assumption
- Would need to restructure entire sales organization
- Need to balance lead quality vs. quantity in forecasting

## Implications for Onboarding System

### Design Considerations
1. **Self-Serve Path**: System must support fully automated onboarding for micro merchants
2. **Qualification Gating**: Early qualification can route viable merchants to AE, others to self-serve
3. **Document Collection**: Streamline document collection to reduce application delays
4. **Upward Mobility**: Successful self-serve merchants should have clear path to AE support at GTV thresholds

### Success Metrics
- Reduce time-to-close for qualified merchants
- Increase transactional rate for micro merchants (currently 30%)
- Improve document collection completion rate
- Reduce AE time spent on non-viable prospects

---

**Document Status**: Initial capture from sales team discussion
**Last Updated**: 2025-10-16
**Related Docs**: `CLAUDE.md` (cohort definitions), `merchant_onboarding_prd.md` (lead profiling)
