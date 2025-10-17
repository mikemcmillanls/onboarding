# AE Interview Feedback: Onboarding Pain Points

This document captures feedback from Account Executives (AEs) and Implementation Consultants (ICs) on current onboarding challenges.

## Interview Sources

- **Ivnoor Shergil** - SME, Account Executive
- **Heather Moores** - SME, Hardware/IC (not AE)
- **Alec Montealegre** - SME, Outbound AE

## Five Core Pain Point Themes

1. Cross-functional collaboration and culture
2. Sales-to-Implementation handoff
3. Hardware ordering and setup
4. LS Pay and payment process
5. Product-market fit — with Ignite and smaller merchants

---

## 1. Cross-Functional Collaboration & Culture

### Siloed Teams
- **Issue**: AEs and ICs rarely communicate beyond email handoffs
- **Impact**: No formal sync process or shared accountability
- **Result**: Each handoff results in information loss, and customer relationships restart from scratch

### Lack of Empathy for Roles
- **Issue**: Sales teams feel Implementation underestimates sales pressure
- **Counter-view**: ICs feel Sales sets unrealistic expectations
- **Result**: Creates friction between teams

### Low Feedback Visibility
- **Issue**: Issues identified by ICs or AEs (e.g., customer workflow gaps) are not consistently addressed or communicated back
- **Impact**: No structured feedback loop
- **Result**: AEs receive little insight into onboarding churn, limiting their ability to improve pre-sale qualification

---

## 2. Sales–Implementation Process & Handoff

### Abrupt AE → IC Handoff
- **Current Process**: Once an opportunity is marked "Closed Won," an IC is auto-assigned in Salesforce with no introductory email or joint handoff meeting
- **Merchant Experience**: Left uncertain about ownership, eroding trust and continuity
- **IC Experience**: Often start from scratch without context from the AE relationship

### Closed Won Misdefinition
- **Issue**: "Closed Won" is defined as software activation only — excluding hardware and payment applications
- **Impact**: Causes confusion about readiness and onboarding timelines
- **Result**: Misalignment between what's "sold" and what's actually ready

### Separate Billing Systems
- **Issue**: Software (Chargeify) and hardware (Ecwid) are billed separately, creating a disjointed experience
- **Merchant Perception**: Hardware appears as an additional hidden cost, making it harder to sell
- **Workaround**: Some AEs manually combine quotes to set expectations, but this is not standardized

### Premature Handoff to Support
- **Issue**: Merchants still within the onboarding phase (before 10 call days) are sometimes passed to Support prematurely
- **Impact**: Support lacks onboarding context
- **Result**: Long wait times, repeated back-and-forths, and potential churn

---

## 3. Hardware Ordering & Setup

### Hardware Setup Issues
- **Issue**: Customers face connection, delivery, or compatibility issues during hardware setup
- **Current Process**: When setup isn't completed on the first call, merchants are handed to Support
- **Result**: Fragmented communication and inconsistent guidance

### Label Printing Limitations
- **Issue**: X-Series devices cannot print labels from iPads (computer-only)
- **Impact**: Customer confusion and incorrect sales messaging
- **Limitation**: Only two label formats (rat tail and long) are supported
- **Frequent Request**: 1x1" format support
- **Preference**: Native support is preferred over relying on external workaround systems
- **Result**: Causes friction and delays during hardware setup

### Bluetooth Instability
- **Issue**: Bluetooth scanners frequently disconnect from iPads
- **Workaround**: USB scanners, while functional, act as keyboard peripherals — creating extra steps and poor usability
- **Result**: Causes friction and a bad experience that shows up during onboarding

### Visibility Gaps
- **Issue**: Hardware shipment and delivery tracking are opaque
- **Current State**: Only merchants receive FedEx notifications
- **Gap**: AEs and ICs lack visibility
- **Result**: Delays in onboarding and go-live readiness

### Customer Readiness for Hardware
- **Issue**: Some merchants are not ready to purchase hardware at the time of sale (e.g., store not yet open)
- **Current Process**: Follow-ups depend on AE reminders and are often missed
- **Result**: Delays onboarding

### Hardware Scheduling Friction
- **Issue**: Merchants frequently overbook hardware appointments via Calendly (e.g., 3 slots at once)
- **Impact**: Creates scheduling congestion
- **Recommendation**: AEs or ICs should manage scheduling directly to prevent duplicate bookings

### No Hardware Incentives for AEs
- **Issue**: AEs are not compensated for hardware sales
- **Impact**: Lower prioritization of hardware in sales process
- **Result**: Unsupported third-party hardware being approved to close deals — causing downstream onboarding and support issues

---

## 4. LS Pay & Payment Process

### Sensitive Document Handling
- **Issue**: LS Pay requests personal and business documents (IDs, tax forms, supplier invoices, marriage/divorce certificates) via email for verification
- **Concern**: Raises privacy and security concerns
- **Merchant Experience**: Uncomfortable sending sensitive information as attachments or screenshots

### Merchant Confusion About Additional Documentation
- **Issue**: Many merchants forget or are unaware that additional documents are required for approval after initial application submission
- **Result**: Underwriting delays

### Underwriting Denials or Delays
- **Issue**: Some merchants fail to get approved due to missing, inconsistent, or non-standard information
- **Examples**: Mismatched IDs, lack of business credentials
- **Result**: Creates frustration and stalls the onboarding process

### Redundant Data Entry
- **Issue**: Merchants must re-enter the same business details across multiple LS Pay forms and portals
- **Result**: Creates inefficiency and a poor user experience

---

## 5. Product & Market Fit (Ignite & Small Merchants)

### Ignite Device Confusion
- **Misconception**: Merchants mistakenly believe Ignite terminals are standalone like Clover devices
- **Reality**: They require Wi-Fi and must pair to a register
- **Result**: Setup frustration and unnecessary support calls

### Low-Value Merchant Segment
- **Profile**: Many small "garage" or pop-up sellers have minimal sales volume
- **Business Model**: Receive free hardware and low-cost plans to inflate acquisition metrics
- **Reality**: These customers have low long-term value and are highly likely to churn
- **Competition**: Often switch to competitors (e.g., Square) offering simpler onboarding or cheaper pricing
- **AE Feedback**: Increasing volume of leads that are not a good fit for Lightspeed

---

## Implications for Onboarding Transformation

### Alignment with Product Strategy

**Cross-Functional Collaboration**:
- Unified dashboard addresses visibility gaps
- Product-owned front door reduces handoff complexity
- Shared data flow eliminates information loss

**Sales–Implementation Handoff**:
- Cohort-based routing provides structure
- Clear ownership rules (Self-Serve = Product, Managed = AE+IC)
- Redefining "Closed Won" to include hardware + payments aligns incentives

**Hardware Issues**:
- Dashboard integration shows hardware delivery status
- Prevents premature setup calls (wait for delivery + LS Pay approval)
- Label printing and Bluetooth issues are product improvements (separate from onboarding strategy)

**LS Pay Process**:
- Pre-fill data from signup (eliminate redundant entry)
- Secure document upload (not email attachments)
- Real-time status visibility for merchants and ICs

**Product-Market Fit**:
- Self-serve path lets Ignite merchants self-select
- Natural churn for low-fit merchants (fast fail vs. wasted IC time)
- AEs can focus on qualified leads ($500K+ revenue)

---

## Related Documentation

- [Code Yellow Onboarding Analysis](../01-product/CODE_YELLOW_ONBOARDING_ANALYSIS.md) - Research findings on current state
- [Sales Context](./SALES_CONTEXT.md) - Sales team insights on current challenges
- [Onboarding Transformation One-Pager V2](../01-product/ONBOARDING_TRANSFORMATION_ONE_PAGER_V2.md) - Strategic proposal

---

**Document Status**: AE/IC interview feedback
**Last Updated**: 2025-10-17
**Interview Date**: October 2025
