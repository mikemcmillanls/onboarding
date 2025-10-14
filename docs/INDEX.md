# Documentation Index

Welcome to the Lightspeed Onboarding Dashboard documentation. This guide helps you navigate all project documentation organized by topic.

## Quick Navigation

- **New to the project?** Start with [Getting Started](#00-getting-started)
- **Product Manager?** See [Product Requirements](#01-product)
- **Designer?** Check [Design Documentation](#02-design)
- **Developer?** View [Implementation Guides](#03-implementation)
- **Looking for reference?** Browse [Reference Documentation](#04-reference)

---

## 00-getting-started

Documentation for getting started with the project.

| File | Purpose | Audience |
|------|---------|----------|
| [QUICK_START.md](./00-getting-started/QUICK_START.md) | Quick setup and development guide | Developers |
| [MERCHANT_FLOW_README.md](./00-getting-started/MERCHANT_FLOW_README.md) | Simplified merchant journey overview | All stakeholders |

---

## 01-product

Product requirements and planning documentation.

| File | Purpose | Status |
|------|---------|--------|
| [merchant_onboarding_prd_revised.md](./01-product/merchant_onboarding_prd_revised.md) | **PRIMARY PRD** - 4-step merchant-centric flow | ✅ Current |
| [archived/merchant_onboarding_prd.md](./01-product/archived/merchant_onboarding_prd.md) | Original 10-step PRD | 🗄️ Historical |

**Key Concepts:**
- 4-step onboarding flow (Sign Up → POS Setup → Checkout → Bank Account)
- Three merchant cohorts (Self-Serve, Assisted, Managed)
- Cohort-based routing and experiences

---

## 02-design

Complete design specifications, flows, and brand guidelines.

### Core Design Documentation

| File | Purpose | Status |
|------|---------|--------|
| [DESIGN_INDEX.md](./02-design/DESIGN_INDEX.md) | Navigation guide to all design docs | ✅ Current |
| [DESIGN_HANDOFF_SUMMARY.md](./02-design/DESIGN_HANDOFF_SUMMARY.md) | Executive summary for design handoff | ✅ Current |
| [DESIGN_SPECIFICATIONS.md](./02-design/DESIGN_SPECIFICATIONS.md) | **PRIMARY SPEC** - Complete UX/UI specifications | ✅ Current |
| [USER_FLOW_DIAGRAMS.md](./02-design/USER_FLOW_DIAGRAMS.md) | Visual ASCII flow diagrams for all steps | ✅ Current |
| [COPY_REFERENCE_GUIDE.md](./02-design/COPY_REFERENCE_GUIDE.md) | All UI copy and messaging | ✅ Current |
| [LIGHTSPEED_DESIGN_HANDOFF.md](./02-design/LIGHTSPEED_DESIGN_HANDOFF.md) | Lightspeed brand design system & guidelines | ✅ Current |

### Archived Design Files

| File | Purpose | Status |
|------|---------|--------|
| [archived/DESIGN_UPDATE_SUMMARY.md](./02-design/archived/DESIGN_UPDATE_SUMMARY.md) | Summary of design updates made | 🗄️ Historical |
| [archived/DASHBOARD_REDESIGN_SUMMARY.md](./02-design/archived/DASHBOARD_REDESIGN_SUMMARY.md) | Dashboard redesign summary | 🗄️ Historical |
| [archived/LIGHTSPEED_COLOR_PALETTE.md](./02-design/archived/LIGHTSPEED_COLOR_PALETTE.md) | Color palette (consolidated into LIGHTSPEED_DESIGN_HANDOFF) | 🗄️ Superseded |
| [archived/VISUAL_LAYOUT_REFERENCE.md](./02-design/archived/VISUAL_LAYOUT_REFERENCE.md) | Visual layouts (consolidated into DESIGN_SPECIFICATIONS) | 🗄️ Superseded |

**Design Principles:**
- Lightspeed brand identity (black, white, minimal color accents)
- Clear visual hierarchy
- Cohort-specific color coding
- Progressive disclosure
- Mobile-first responsive design

---

## 03-implementation

Technical implementation guides and specifications.

| File | Purpose | Audience |
|------|---------|----------|
| [COMPONENT_IMPLEMENTATION_GUIDE.md](./03-implementation/COMPONENT_IMPLEMENTATION_GUIDE.md) | Detailed component implementation guide | Developers |
| [COMPONENT_GUIDE.md](./03-implementation/COMPONENT_GUIDE.md) | Component overview and usage | Developers |
| [ROUTING_AND_DATA_FLOW.md](./03-implementation/ROUTING_AND_DATA_FLOW.md) | Technical routing and data flow specs | Backend/Frontend Devs |
| [IMPLEMENTATION_SUMMARY.md](./03-implementation/IMPLEMENTATION_SUMMARY.md) | Summary of what was built (snapshot) | All technical staff |

**Tech Stack:**
- Next.js 15.5.4 (App Router, Turbopack)
- TypeScript 5+
- Tailwind CSS 4
- shadcn/ui (Radix UI)
- Framer Motion

**Key Implementation Details:**
- 4-step merchant flow components
- Admin dashboard for ops team
- Mock data layer for prototyping
- Responsive design system
- Type-safe data structures

---

## 04-reference

Reference materials and utilities.

| File | Purpose | Status |
|------|---------|--------|
| [DASHBOARD_DESIGN_SYSTEM.md](./04-reference/DASHBOARD_DESIGN_SYSTEM.md) | Design system for internal ops dashboard | ✅ Current |
| [archived/PROJECT_SUMMARY.md](./04-reference/archived/PROJECT_SUMMARY.md) | Original project summary (consolidated into README) | 🗄️ Superseded |

---

## Root Documentation

| File | Purpose |
|------|---------|
| [/README.md](../README.md) | Main project README with setup instructions |
| [/CLAUDE.md](../CLAUDE.md) | Instructions for Claude Code AI assistant |

---

## Documentation Conventions

### Status Indicators

- ✅ **Current** - Active, maintained documentation
- 🗄️ **Historical** - Archived for reference, documents past decisions
- 🗄️ **Superseded** - Content merged into another document

### File Naming

- **ALL_CAPS.md** - Major documentation files
- **lowercase_with_underscores.md** - Product/planning documents
- **archived/** - Outdated or consolidated content

### Update Guidelines

1. **Before updating design specs**: Check DESIGN_SPECIFICATIONS.md first
2. **Before updating copy**: Update COPY_REFERENCE_GUIDE.md
3. **After major changes**: Update IMPLEMENTATION_SUMMARY.md with date
4. **When adding features**: Update relevant PRD and implementation docs

---

## Common Tasks

### I want to...

**Understand the merchant journey**
→ Start with [MERCHANT_FLOW_README.md](./00-getting-started/MERCHANT_FLOW_README.md)

**Implement a new component**
→ See [COMPONENT_IMPLEMENTATION_GUIDE.md](./03-implementation/COMPONENT_IMPLEMENTATION_GUIDE.md)

**Update UI copy**
→ Edit [COPY_REFERENCE_GUIDE.md](./02-design/COPY_REFERENCE_GUIDE.md)

**Understand the design system**
→ Read [LIGHTSPEED_DESIGN_HANDOFF.md](./02-design/LIGHTSPEED_DESIGN_HANDOFF.md)

**See complete UX flows**
→ Review [USER_FLOW_DIAGRAMS.md](./02-design/USER_FLOW_DIAGRAMS.md)

**Understand data routing**
→ Check [ROUTING_AND_DATA_FLOW.md](./03-implementation/ROUTING_AND_DATA_FLOW.md)

**Get up and running**
→ Follow [QUICK_START.md](./00-getting-started/QUICK_START.md)

**Understand product requirements**
→ Read [merchant_onboarding_prd_revised.md](./01-product/merchant_onboarding_prd_revised.md)

---

## Related Resources

- **Live Application**: http://localhost:3000 (development)
- **Source Code**: `/app`, `/components`, `/lib`
- **Design Assets**: (Link to Figma/design tool if applicable)
- **API Documentation**: (Link to API docs if applicable)

---

## Documentation Maintenance

**Last Updated**: October 2025

**Maintainers**: Product & Engineering Teams

**Review Schedule**: Quarterly or after major features

**Feedback**: Report documentation issues via project issue tracker

---

## Phase Documentation (Legacy)

The `/docs/phase-*` directories contain planning documentation from the original project phases. These are preserved for historical context but may not reflect the current implementation.

- phase-1: Foundation planning
- phase-2: Enhanced self-serve planning
- phase-3: Assisted & managed paths planning
- phase-4: Intelligence & optimization planning
- phase-5: Additional features planning
