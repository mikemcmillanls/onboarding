# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the cohort-based merchant onboarding system for X-Series and Lightspeed Payments. The system segments merchants into cohorts (Self-Serve, Assisted, Managed) based on GTV, location count, and complexity, then guides them through tailored 10-step onboarding journeys.

## Architecture

### Three-Stage Flow

The system is organized around three sequential stages:

1. **Qualify Leads** (Steps 1-3): Lead capture → cohort assignment → KYB qualification
2. **Buying Experience** (Steps 4-6): Software/hardware selection → purchase completion
3. **Guided Setup** (Steps 7-10): KYC verification → data import → hardware setup → final configuration

### Key Components

**Lead Profiling Engine**
- Evaluates GTV signals, business vertical, and complexity factors
- Assigns selling plan (self-serve, assisted, managed) and setup plan
- Routes merchants to appropriate flows

**Unified Onboarding Dashboard**
- Single source of truth for merchant progress across all stages
- Displays steps completed, next actions, quotes, and support options
- Handles both self-serve and AE/IC-assisted flows

**Smart Routing Logic**
- Routes high-GTV merchants to AE queue with SLA tracking
- Routes self-serve merchants through automated flows
- Detects stalls and triggers intervention workflows

**Progress Tracking & Monitoring System**
- Tracks completion of each step per merchant
- Flags abandoned carts, stalled setups, and blocked merchants
- Alerts IC/AE teams when intervention needed

**Data Sync Layer**
- Synchronizes data across: Marketing → Sales CRM → X-Series → Payments
- Eliminates redundant data entry
- Passes context forward at each stage

### Integration Points

The system integrates with:
- Marketing website (lead capture)
- Sales CRM (AE/IC assignment and tracking)
- X-Series provisioning (account creation)
- Payments Onboarding Service (KYB/KYC flows)
- Hardware ordering/shipping system
- Billing/payment processing
- **TrueBiz API** (business verification - planned)
- **Stripe Connect** (payment processing setup)

### Critical Flow Requirements

**KYB Before Hardware Purchase**
- Step 3 (KYB qualification) MUST complete successfully before Step 5 (hardware ordering)
- Prevents shipping hardware to ineligible merchants
- Decision point: Approved → continue | Review needed → flag | Rejected → end flow

**Payouts Held Until Bank Verification**
- Step 7 activates Lightspeed Payments per location but holds payouts
- Step 9 collects bank account details and runs verification
- Payouts enabled only after bank account verified

**Cohort-Specific Paths**
- Low GTV (<$500K): Fully automated self-serve flow
- Mid GTV ($500K-$2M): AE-guided purchase + free IC support
- High GTV ($2M+): AE negotiated pricing + paid implementation package

### Data Flow

```
Marketing Lead → Lead Profile Created → Cohort Assigned →
[Self-Serve OR AE-Assisted Purchase] →
X-Series Account Provisioned →
[KYC/KYB + Hardware Shipment in parallel] →
Setup Plan Assigned →
[Self-Serve Guides OR IC-Assisted Setup] →
Active Merchant
```

## Implementation Phases

### Phase 1: Foundation (MVP)
- Lead capture with qualifying questions
- Basic cohort assignment (self-serve vs. assisted)
- High-GTV routing to AE, low-GTV automated flow
- KYB qualification before hardware purchase
- Unified dashboard showing all steps

### Phase 2: Enhanced Self-Serve
- In-product guides for each setup step
- Progress tracking visible to merchant
- Automated hardware setup instructions
- Data import wizard
- Self-serve bank account connection

### Phase 3: Assisted & Managed Paths
- IC scheduling and session management
- AE quote builder and negotiation tools
- Shared dashboard for AE/IC and merchant
- Communication tracking (calls, emails, sessions)

### Phase 4: Intelligence & Optimization
- Drop-off detection and alerts
- Automated nudges and reminders
- Stall detection with IC/AE routing
- A/B testing framework
- Analytics dashboard for ops team

## Merchant Cohorts

| Cohort | GTV Range | Locations | Selling Plan | Setup Plan |
|--------|-----------|-----------|--------------|------------|
| Self-Serve | <$500K | 1-3 | Automated purchase | Self-serve guides + monitoring |
| Assisted | $500K-$2M | 3-10 | AE-guided with self-checkout | Free IC support |
| Managed | $2M+ | 10+ | AE negotiated pricing | Paid implementation package |

## Data Collection by Step

Refer to `merchant_onboarding_prd.md` Appendix for complete data collection summary. Key points:

- **Account Creation (/get-started)**:
  - Page 1: Name, email, password, business name, phone
  - Page 2: Business category, **business website URL**, business address, annual revenue, number of locations
  - Business website is required for future TrueBiz verification integration
- **Step 3**: KYB data (business structure, legal name, EIN, registered address)
- **Step 7**: KYC data (business representative + all owners with SSN, DOB)
- **Step 9**: Payout bank account (triggers payout enablement after verification)

## Available Specialized Agents

Claude Code has access to specialized agents for complex tasks. Use these agents when appropriate:

- **storytelling-expert**: Creative writing, story structure, character development, and narrative craft
- **api-development-expert**: API design, RESTful/GraphQL APIs, authentication, HTTP status codes, rate limiting, API documentation
- **design-lead-orchestrator**: Coordinate multiple design tasks across UI, UX, interaction design, and visual design
- **nextjs-frontend-expert**: Next.js applications, shadcn/ui components, React, animations, responsive layouts, frontend optimization
- **product-lead-advisor**: Strategic product guidance, feature prioritization, roadmap decisions, market analysis
- **tech-lead-orchestrator**: High-level technical coordination across frontend, backend, and API work
- **meta-agent**: Generate new Claude Code sub-agent configurations
- **stripe-connect-expert**: Stripe Connect platform integrations, payment onboarding, KYB/KYC, compliance, webhooks

## Integration Documentation

Detailed integration documentation is available in `/docs/05-integrations/`:

- **STRIPE_PAYMENT_SETUP_FLOW.md**: Complete Stripe Connect integration guide for payment processing setup
- **TRUEBIZ_VERIFICATION_API.md**: TrueBiz API reference for business verification (planned integration)
- **TRUEBIZ_INTEGRATION_ANALYSIS.md**: Comprehensive analysis of adding TrueBiz verification at signup, including ROI analysis and implementation plan

## Open Questions

When implementing features, consider these unresolved questions from the PRD:

1. Trial access vs. buy-first approach
2. Exact GTV/location/complexity thresholds for cohort assignment
3. AE response time SLAs (can we guarantee "15 minutes"?)
4. IC pricing model for paid implementation packages
5. Hardware compatibility verification process
6. Intervention triggers for auto-escalating self-serve to IC support
