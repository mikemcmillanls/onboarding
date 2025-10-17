# Lightspeed Code Yellow Onboarding Analysis

This document captures the findings from Lightspeed's NOAM Retail onboarding research, conducted to identify pain points and opportunities for improvement in the merchant onboarding journey.

## Terminology

- **AE**: Account Executive (sales representative who closes deals)
- **IC**: Implementation Consultant (technical specialist who helps merchants set up and configure the system)
- **10CD**: 10th Calendar Day (activation target - merchant fully operational within 10 days)
- **LS Pay**: Lightspeed Payments (integrated payment processing solution)
- **SSBO**: Self-Serve Business Onboarding

---

## Executive Summary

### The Problem

Lightspeed's NOAM Retail onboarding experience is underperforming, driving high early-stage churn and missed activation targets. The onboarding process is:
- **Inconsistent**: Lack of standardized process across teams
- **Transactional**: Not customer-centric or engagement-focused
- **Leaky**: High drop-off rates at multiple stages

**Result**: High leakage, low engagement, and lost revenue potential.

### The Opportunity

Transform onboarding from a transactional process into a **strategic growth lever** by:
- Improving activation rates
- Increasing retention
- Maximizing customer lifetime value

**Through**: Empowered team + standardized process + engaging customer experience

---

## Research Team & Timeline

### Team Members (Workstream 2)

- **Vahid Ghaffari**: Product Design (Invoicing)
- **Antoine Begin**: Product Design (Invoicing/Ledger)
- **Zane King**: Product Management (Selling/Sales Orders - X-Series)
- **Mai Bogin**: UX Research (Wholesale/Inventory)
- **Michael Cao**: UX Research (At scale)
- **Laurence Dumont**: UX Research (Selling - X-Series)

### Research Journey Status

**Completed** (Last 2 weeks):
- Onboarding research & journey mapping

**In Progress** (Week of Oct 13-17):
- Problem articulation

**Next Steps**:
- Future-state proposal (for product enablement)
- Working sessions with key P&T stakeholders on future-state onboarding journey
- Build conceptual model to visualize future-state
- Build dashboard to measure key milestones in onboarding journey

---

## Current Onboarding Journey (Sales-Led Motion)

### Main Chapters

1. **Discovery & Evaluation**
2. **Software purchase & account activation**
3. **LS PAY application**
4. **Hardware ordering**
5. **AE > IC Handoff**
6. **IC Sessions** (Navigation, Selling, Inventory, Reporting)
7. **Hardware Setup**
8. **10CD Target** (10th Calendar Day Activation)

---

## High-Level Funnel Analysis

**Hypothetical Cohort**: 1000 Qualified Leads (Jan '24 - Oct '25)

| Stage | # Merchants | Drop-off/Success Rate | Notes |
|-------|-------------|----------------------|-------|
| **Discovery & Evaluation** | 1,000 | - | Converted leads to Won opportunities in NOAM |
| **Software purchase & activation** | 287 | 24.8% drop-off | From account activation to before first IC call |
| **LS PAY application** | 249 | - | NOAM eligibility to LSPay in past year |
| **Hardware ordering** | N/A | - | Data mixed with AE > IC Handoff (needs Data Pod help) |
| **AE > IC Handoff** | 187 | 12.5% drop-off | From activated accounts to after first IC call |
| **IC + Hardware sessions** | 164 | - | - |
| **10CD (Activation Target)** | 135 | **46.94% success rate** | From activated account to 10CD (60-day window) |

**Key Insight**: Only **13.5%** of qualified leads reach 10CD activation target.

---

## Detailed Journey, Pain Points, and Solutions

### 1. Discovery & Evaluation

**Steps**: Lead generation → Sales reach out → Trial/Demos

**Timeline**:
- Median: 1-2 days to Closed Won
- Average: 10.8 days to Closed Won

#### Key Pain Point

**Ignite Plan Churn Risk**:
- High proportion of low-volume, short-term sellers
- High churn rate
- Consumes IC capacity that could serve higher-GTV customers

#### Proposed Solutions

**Product Enablement**:
- **Self-Serve Onboarding (SSBO)**: Create self-serve software funnel for Ignite plan customers to free IC capacity for higher-GTV customers

**Process Improvement**:
- Create lighter IC-supported workflow for Ignite plan customers
- Allow ICs to prioritize higher GTV customers

---

### 2. Software Purchase & Account Activation

**Steps**: Software quoting → Merchant buys software → Account activation

#### Key Pain Points

1. **Split Billing Confusion**:
   - Confuses merchants
   - Slows hardware sales

2. **Closed Won Definition Gaps**:
   - Excludes hardware & LS Pay milestones
   - Misaligned with actual activation requirements

#### Proposed Solutions

**Product Enablement (Sales-Led)**:
- Allow hardware and software to be quoted and billed together
- Streamline the purchase process

**Process Improvement**:
- Redefine "Closed Won" to include hardware
- Align sales incentives with activation milestones

---

### 3. LS PAY Application

**Steps**: Merchant applies for LS PAY → Underwriting review → Merchant approved for Payments

#### Funnel Data (Of Activated Accounts)

- **87%** are eligible for LS Pay
- **70%** apply (19.2% drop between steps)
- **68%** are approved (2.47% drop between steps)

#### Key Pain Points

1. **Redundant Forms**:
   - Duplicate data entry
   - Delays in processing

2. **Email Document Sharing**:
   - Privacy and security risks
   - Lack of audit trail

3. **Incomplete Information**:
   - Causes rework
   - Leads to merchant rejections

#### Proposed Solutions

**Product Enablement (Code Yellow)**:
- Streamline form submission to avoid duplicate data entry
- Identify and track "expected churn" for merchants who don't get approved for LS Pay
- Create secure file share mechanism for missing LS Pay documents

**Process Improvement**:
- Publish LS Pay onboarding guide documenting checklist of required documents and approval steps
- Provide merchant reminders/progress tracker for missing documents/incomplete actions

---

### 4. Hardware Ordering

**Steps**: Hardware scoping → Hardware purchase

#### Key Pain Points

1. **Poor Timing and Guidance**:
   - Merchants unclear when to order hardware
   - Lack of recommendations based on business needs

2. **Confusing Store Experience**:
   - Checkout friction
   - Complex product selection

3. **Limited Visibility**:
   - Unclear ownership of fulfillment process
   - No tracking for AEs/ICs/merchants

4. **System Gaps**:
   - Blocks seamless HW ordering and delivery

#### Proposed Solutions

**Product Enablement (Code Yellow/SSBO)**:
- Add qualifying questions to guide HW purchases **(Quick Win)**
- Embed HW ordering link into in-app onboarding workflow
- Auto-apply and share HW discounts for AEs/ICs
- Show HW fulfillment status to AEs, ICs, and merchant

**Process Improvement**:
- Block HW onboarding until delivery is confirmed
- Align AE-IC KPIs around activation (10CD)

---

### 5. AE > IC Handoff

**Steps**: Account Activation → AE schedules first call with IC

#### Drop-off Data (Of Activated Accounts)

- **19.63%** don't have a first call with IC scheduled
- **5.17%** drop off before first call happens

#### Key Pain Points

1. **Unstructured Handoff**:
   - Creates disconnects between AE and IC
   - Information loss during transition

2. **Poor Cross-Team Communication**:
   - Limited visibility into merchant status
   - No standardized handoff format

3. **Misaligned Expectations**:
   - Merchants unclear what happens next
   - IC unprepared for first call

#### Proposed Solutions

**Product Enablement**:
- Define AE-IC coordination triggers
- Increase visibility into key onboarding milestones (LS Pay status, hardware order)

**Process Improvement**:
- Joint handoff playbook and standardized form (require AEs to complete key merchant details)
- 15-min AE-IC kickoff call template to ensure smooth transition
- Quarterly alignment workshops

---

### 6. IC Sessions (Navigation, Selling, Inventory, Reporting)

**Steps**: Navigation call → Hardware call → Merchant completes data import & hardware setup → Merchant completes all IC sessions

#### Drop-off Data (Of Activated Accounts)

- **12.5%** drop off after Navigation call
- **6.1%** after Selling call
- **7.1%** after Inventory call
- **2.6%** after Wrap-up call

**Cumulative drop-off**: ~28.3% across IC sessions

#### Key Pain Points

1. **Overwhelming and Passive Experience**:
   - Too much information at once
   - Limits learning and retention

2. **Disjointed Handoffs**:
   - Inconsistent experience between sessions
   - Information not carried forward

3. **Import Delays and Setup Complexity**:
   - Blocks contextual onboarding
   - Training happens before merchant is ready

#### Proposed Solutions

**Product Enablement**:
- Unified onboarding progress view for merchants and LS teams (steps, owners, status)
- Automate reminders and dependencies (e.g., "Product import must be complete before integration call")
- Enable live, contextual training in "training mode"

**Process Improvement**:
- Dynamic session templates based on merchant setup progress
- Let merchants perform live actions (e.g., add a product, process a sale) during training calls

---

### 7. Hardware Setup

**Steps**: Hardware calls (ICs help set up and test hardware)

#### Data

- **44.8%** of scheduled calls never happen
- **7.4%** of merchants who interact with hardware team need 3+ calls

#### Key Pain Points

1. **Premature Setup**:
   - Attempted before hardware delivery
   - Attempted before payment approval
   - Causes delays and frustration

2. **Hardware and Peripheral Limits**:
   - Create setup friction
   - Compatibility issues

3. **Payment Dependencies**:
   - LS Pay approval required for testing
   - Scheduling conflicts
   - Activation delays

#### Proposed Solutions

**Product Enablement (Code Yellow)**:
- Add 1x1 label printing (iOS compatible) **(Quick Win)**
- Display real-time LS Pay status so ICs know appropriate time to start hardware onboarding
- Add in-app education prompts (tooltips) explaining payout timing and setup dependencies **(Quick Win)**

**Process Improvement**:
- Block setup session booking until LS Pay application is approved and active

---

## Key Metrics & Success Criteria

### Current State

- **10CD Success Rate**: 46.94% (from activated account to 10CD within 60-day window)
- **Overall Conversion**: 13.5% (from qualified lead to 10CD activation)

### Major Drop-off Points

1. **Discovery → Software Purchase**: 71.3% drop-off
2. **Account Activation → First IC Call**: 24.8% drop-off
3. **LS Pay Eligibility → Application**: 19.2% drop-off
4. **AE Handoff → IC Scheduled**: 19.63% drop-off
5. **IC Sessions**: 28.3% cumulative drop-off

---

## Implications for New Onboarding System

### Alignment with Code Yellow Findings

Our new cohort-based onboarding system directly addresses several Code Yellow pain points:

#### 1. Self-Serve Path for Ignite/Low-GTV Merchants
- **Code Yellow**: "Create self-serve software funnel for Ignite plan customers"
- **Our Design**: Self-Serve cohort (<$500K) with automated onboarding
- **Impact**: Frees IC capacity for higher-GTV merchants

#### 2. Unified Progress Visibility
- **Code Yellow**: "Unified onboarding progress view for merchants and LS teams"
- **Our Design**: Dashboard with 5-task checklist, status tracking
- **Impact**: Reduces confusion, improves handoffs

#### 3. Streamlined Data Collection
- **Code Yellow**: "Streamline form submission to avoid duplicate data entry"
- **Our Design**: TrueBiz data enhancement at signup, pre-populate verification data
- **Impact**: Reduces merchant friction, improves completion rates

#### 4. Hardware Ordering Integration
- **Code Yellow**: "Embed HW ordering link into in-app onboarding workflow"
- **Our Design**: Hardware selection as Task 3 in dashboard
- **Impact**: Clear timing, integrated experience

#### 5. LS Pay Status Visibility
- **Code Yellow**: "Display real-time LS Pay status"
- **Our Design**: Stripe verification status visible in dashboard, blocks purchase if needed
- **Impact**: Prevents premature hardware setup, reduces IC call waste

#### 6. Cohort-Specific Support Levels
- **Code Yellow**: "Create lighter IC-supported workflow for Ignite plan"
- **Our Design**: Self-Serve (automated), Assisted (optional IC), Managed (required IC)
- **Impact**: Right-sized support based on merchant value

### Priority Areas for Implementation

Based on Code Yellow findings, prioritize:

1. **Self-Serve Path** (Phase 1): Addresses Ignite churn + IC capacity issues
2. **Unified Dashboard** (Phase 1): Addresses visibility + handoff issues
3. **LS Pay Integration** (Phase 2): Streamline application, reduce drop-off
4. **Hardware Ordering** (Phase 2): Integrate into dashboard flow
5. **IC Session Optimization** (Phase 3): Dynamic templates based on cohort

---

## Related Documentation

- [Sales Context](../04-reference/SALES_CONTEXT.md) - Sales team insights on current challenges
- [Revenue Cohort Mapping](./REVENUE_COHORT_MAPPING.md) - How revenue ranges map to cohorts
- [User Flow 1: Signup and Provisioning](../02-design/USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - New signup flow design
- [User Flow 2: Dashboard Experience](../02-design/USER_FLOW_02_DASHBOARD.md) - New dashboard task structure

---

**Document Status**: Code Yellow research findings (Jan '24 - Oct '25)
**Last Updated**: 2025-10-16
**Source**: NOAM Retail Onboarding Research Team (Workstream 2)
