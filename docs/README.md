# Lightspeed Merchant Onboarding Documentation

Complete documentation for the Lightspeed merchant onboarding application.

---

## Quick Access

**New to the project?** → Start with [Quick Start Guide](00-getting-started/QUICK_START.md)

**Understanding the product?** → Read [Product Requirements](01-product/PRODUCT_REQUIREMENTS.md)

**Implementing features?** → Reference:
- [Design Specifications](02-design/DESIGN_SPECIFICATIONS.md)
- [Component Guide](03-implementation/COMPONENT_GUIDE.md)
- [Architecture](03-implementation/ARCHITECTURE.md)

**Need UI copy?** → [UI Copy Reference](02-design/UI_COPY.md)

**Design system details?** → [Design System](04-reference/DESIGN_SYSTEM.md)

---

## Product Overview

### What Is This?

A **4-step merchant onboarding flow** that guides businesses through signup, configuration, purchase, and activation for Lightspeed POS and Payments.

### The Four Steps

1. **Sign Up & Tell Us About Your Business**
   - Create account
   - Provide business details
   - Get cohort assignment

2. **Set Up Your POS & Payments**
   - Configure locations and registers
   - Select hardware bundles
   - Set up payment processing

3. **Complete Purchase & Verification**
   - Review quote and pricing
   - Enter payment details
   - Complete identity verification (KYC)

4. **Get Everything Ready**
   - Connect bank account for payouts
   - Activate payments per location
   - Final configuration

### Merchant Cohorts

The system automatically assigns merchants to one of three cohorts based on business size:

| Cohort | Revenue | Locations | Experience |
|--------|---------|-----------|------------|
| **Self-Serve** | <$500K | 1-3 | Fully automated flow |
| **Assisted** | $500K-$2M | 3-10 | Sales-guided with self-checkout |
| **Managed** | $2M+ | 10+ | White-glove implementation |

---

## Tech Stack

**Framework**: Next.js 15.5.4 (App Router, Turbopack)
**Language**: TypeScript 5+
**Styling**: Tailwind CSS 4
**Components**: shadcn/ui (Radix UI primitives)
**Animations**: Framer Motion 12
**Icons**: Lucide React

---

## Documentation Structure

### 00-getting-started/
Developer onboarding and setup instructions.

**Files:**
- `QUICK_START.md` - Get the app running locally

### 01-product/
Product requirements and business context.

**Files:**
- `PRODUCT_REQUIREMENTS.md` - Complete PRD with 4-step flow definition

### 02-design/
Design specifications, user flows, and UI copy.

**Files:**
- `DESIGN_SPECIFICATIONS.md` - Complete UX/UI specifications for all 4 steps
- `USER_FLOW_01_SIGNUP_AND_PROVISIONING.md` - Signup flow from website to account creation
- `USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md` - Dashboard and payment setup (critical tasks)
- `USER_FLOW_03_ADDITIONAL_SETUP.md` - Optional tasks and technical implementation
- `UI_COPY.md` - All interface copy and messaging

### 03-implementation/
Technical implementation guides and architecture.

**Files:**
- `COMPONENT_GUIDE.md` - Component implementation details
- `ARCHITECTURE.md` - Technical architecture and data flow

### 04-reference/
Reusable design system reference.

**Files:**
- `DESIGN_SYSTEM.md` - Colors, typography, spacing, components

### 05-integrations/
Third-party API integration documentation.

**Files:**
- `PAYMENT_FLOW_OPTIMIZATION.md` - **PRIMARY REFERENCE**: Comprehensive payment flow optimization strategy (speed, risk, experience, cost, segments)
- `STRIPE_PAYMENT_SETUP_FLOW.md` - Stripe Connect integration guide for payment processing
- `TRUEBIZ_VERIFICATION_API.md` - TrueBiz API reference for business verification (planned)
- `TRUEBIZ_INTEGRATION_ANALYSIS.md` - Complete analysis and implementation plan for TrueBiz integration at signup
- `STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md` - Analysis of Stripe Identity vs third-party verification providers
- `STRIPE_TRULIOO_ANALYSIS_VALIDATION_REPORT.md` - Validation of Stripe analysis claims against official documentation

---

## Common Tasks

### I want to...

**Get the application running**
```bash
cd /Users/mike.mcmillan/onboarding
npm install
npm run dev
```
See [Quick Start](00-getting-started/QUICK_START.md) for details.

**Understand what the product does**
→ Read [Product Requirements](01-product/PRODUCT_REQUIREMENTS.md)

**See how users move through the flow**
→ Review User Flows:
  - [Flow 1: Signup & Provisioning](02-design/USER_FLOW_01_SIGNUP_AND_PROVISIONING.md)
  - [Flow 2: Dashboard & Payments](02-design/USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md)
  - [Flow 3: Additional Setup](02-design/USER_FLOW_03_ADDITIONAL_SETUP.md)

**Implement a new component**
→ Follow [Component Guide](03-implementation/COMPONENT_GUIDE.md)

**Update interface copy**
→ Edit [UI Copy](02-design/UI_COPY.md)

**Find color codes or spacing values**
→ Check [Design System](04-reference/DESIGN_SYSTEM.md)

**Understand the technical architecture**
→ Review [Architecture](03-implementation/ARCHITECTURE.md)

---

## Key Features

### Merchant Experience
- **Marketing landing page** - Public-facing product information
- **2-page signup flow** - Streamlined account creation and business profiling
- **Merchant dashboard** - Post-signup hub with 6-task checklist
- **Cohort-specific routing** - Different experiences by business size

### Technical Highlights
- **Responsive design** - Mobile-first, works on all devices
- **Type-safe** - Full TypeScript coverage
- **Accessible** - WCAG AA compliant
- **Animated** - Smooth transitions with Framer Motion
- **Mock data layer** - Prototype-ready with realistic data

---

## Application Structure

```
/
├── app/                    # Next.js pages
│   ├── page.tsx           # Marketing landing page
│   ├── get-started/       # 2-page signup flow
│   └── dashboard/         # Merchant dashboard (6 task pages)
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── dashboard/         # Dashboard-specific components
│   ├── merchant/          # Merchant flow components
│   └── get-started/       # Get started flow components
│
├── lib/
│   ├── onboarding-data.ts # Data models and configurations
│   ├── merchant-mock-data.ts # Mock merchant data
│   └── utils.ts           # Utility functions
│
└── types/
    └── onboarding.ts      # TypeScript type definitions
```

---

## Documentation Philosophy

### Current State Only

Documentation describes **what exists**, not historical decisions or planning phases.

**We document:**
- ✅ How the product works today
- ✅ How to build features
- ✅ Why non-obvious decisions were made

**We don't document:**
- ❌ Historical planning phases
- ❌ Features that were considered but not built
- ❌ Multiple versions of the same information

### Single Source of Truth

Each topic has **one authoritative document**:
- Product requirements → `PRODUCT_REQUIREMENTS.md`
- Design specifications → `DESIGN_SPECIFICATIONS.md`
- Component implementation → `COMPONENT_GUIDE.md`
- Technical architecture → `ARCHITECTURE.md`

**Never duplicate information across files.**

---

## Maintenance

### When to Update Documentation

**Always update when:**
- Changing product requirements
- Modifying user flows
- Updating UI copy
- Adding or changing components
- Modifying architecture

### How to Update

1. **Find the right document** - Use this README as navigation
2. **Update in place** - Edit the single source of truth
3. **Keep it current** - Remove outdated information
4. **Test examples** - Ensure code examples work

### Documentation Standards

**File naming:**
- Use clear, descriptive names (no "revised", "v2", "summary" suffixes)
- ALL_CAPS for major documents
- Keep names concise

**Content rules:**
- Write in present tense ("The product has 4 steps")
- Be specific and actionable
- Include code examples where helpful
- Remove outdated content immediately

---

## Getting Help

**Application not running?** → See [Quick Start troubleshooting](00-getting-started/QUICK_START.md#troubleshooting)

**Design questions?** → Reference [Design Specifications](02-design/DESIGN_SPECIFICATIONS.md)

**Implementation questions?** → Check [Component Guide](03-implementation/COMPONENT_GUIDE.md)

**Architecture questions?** → Review [Architecture](03-implementation/ARCHITECTURE.md)

**Documentation unclear?** → Open an issue or update the doc directly

---

## Related Resources

**Live Application**: http://localhost:3000 (development)
**Source Code**: `/app`, `/components`, `/lib`
**Project README**: [../README.md](../README.md)

---

**Last Updated**: January 2025
**Total Documentation Files**: 15
**Documentation Coverage**: Current product state + planned integrations
