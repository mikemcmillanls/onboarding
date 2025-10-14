# Design Documentation Index

## Welcome to the Lightspeed Merchant Onboarding Design Package

This directory contains complete UX/UI design specifications for the simplified 4-step merchant onboarding flow. Everything the frontend team needs to implement the experience is documented here.

**Date:** October 10, 2025
**Design Lead:** Claude Design Lead Orchestrator
**Status:** ✅ Ready for Implementation

---

## Quick Start

**New to this project? Start here:**

1. Read [DESIGN_HANDOFF_SUMMARY.md](./DESIGN_HANDOFF_SUMMARY.md) (20 min) - Executive summary and quick reference
2. Review [USER_FLOW_DIAGRAMS.md](./USER_FLOW_DIAGRAMS.md) (30 min) - Visual flow diagrams
3. Reference [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md) (ongoing) - Complete specifications

**Ready to implement? Use:**
- [COPY_REFERENCE_GUIDE.md](./COPY_REFERENCE_GUIDE.md) - All UI text and messaging
- [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md) - Component specs and patterns

---

## Document Overview

### 📋 [DESIGN_HANDOFF_SUMMARY.md](./DESIGN_HANDOFF_SUMMARY.md)
**Size:** 19 KB | **Read Time:** 20 minutes

**Executive summary and quick reference guide**

What's inside:
- What's been designed (overview of all 4 steps)
- Key design principles
- Implementation priorities (MVP vs Phase 2/3)
- Technical stack recommendations
- File structure guidance
- API integration points
- Component specifications (quick reference)
- Responsive breakpoints
- Accessibility checklist
- Getting started guide for frontend team

**Best for:**
- Project kickoff
- Understanding scope and priorities
- Technical planning
- Quick reference during development

---

### 📐 [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md)
**Size:** 95 KB | **Read Time:** 2-3 hours (reference document)

**Complete, detailed design specifications for all 4 steps**

What's inside:
- Design philosophy and principles
- Design system foundation (typography, colors, spacing)
- **Step 1:** Sign Up & Tell Us About Your Business (complete specs)
- **Step 2:** Set Up Your POS & Payments (complete specs)
- **Step 3:** Complete Purchase & Verification (complete specs)
- **Step 4:** Get Everything Ready (complete specs)
- Cross-cutting patterns (progress, forms, errors, loading, empty states)
- Component library specifications (12 core components)
- Responsive design guidelines
- Accessibility requirements (WCAG 2.1 AA)
- Animation and transitions
- Copy and microcopy guidelines
- Design decision rationale

**Best for:**
- Implementation reference (primary document)
- Understanding specific interaction patterns
- Component specifications
- Accessibility requirements
- Detailed form design
- State management requirements

---

### 🔄 [USER_FLOW_DIAGRAMS.md](./USER_FLOW_DIAGRAMS.md)
**Size:** 101 KB | **Read Time:** 1 hour

**Visual flow diagrams and state transitions**

What's inside:
- Complete onboarding flow (high-level overview)
- Step 1: Signup flow with cohort routing
- Step 2: Configuration flow
- Step 3: Checkout and verification flow
- Step 4: Setup checklist flow
- Specialist integration touchpoints
- Error and edge case flows
- State transition diagrams
- ASCII/text-based flow diagrams

**Best for:**
- Understanding user journey
- Visualizing state transitions
- Mapping routing logic
- Understanding cohort differences
- Error handling flows
- Team presentations

---

### 📝 [COPY_REFERENCE_GUIDE.md](./COPY_REFERENCE_GUIDE.md)
**Size:** 38 KB | **Read Time:** 1 hour (reference document)

**All UI copy, messaging, and microcopy**

What's inside:
- Voice and tone guidelines
- Step 1: All signup copy
- Step 2: All configuration copy
- Step 3: All checkout copy
- Step 4: All checklist copy
- Error messages (all scenarios)
- Success messages
- Email templates (6 automated emails)
- Specialist messaging

**Best for:**
- Implementation (copy constants file)
- Content consistency
- Writing new messages
- Error message formatting
- Email templates
- Maintaining voice and tone

---

### 📘 [MERCHANT_FLOW_README.md](./MERCHANT_FLOW_README.md)
**Size:** 13 KB | **Read Time:** 15 minutes

**Simplified overview of the merchant journey**

What's inside:
- High-level merchant journey
- 4-step overview with timelines
- What merchants see vs. what happens behind the scenes
- Cohort routing explanation
- Key decision points

**Best for:**
- Stakeholder presentations
- Team onboarding
- Understanding product vision
- Non-technical audience

---

### 🔧 [README.md](./README.md)
**Size:** 4.3 KB

**Technical project README (Next.js)**

What's inside:
- Development setup instructions
- Tech stack overview
- Getting started commands
- Project structure

**Best for:**
- Initial development setup
- Running the project locally

---

## Document Relationships

```
Start Here
    ↓
DESIGN_HANDOFF_SUMMARY.md ←── Quick overview, priorities, getting started
    ↓
    ├─→ USER_FLOW_DIAGRAMS.md ←── Understand flows and states
    │
    ├─→ DESIGN_SPECIFICATIONS.md ←── Implement components and patterns
    │       ↓
    │       └─→ COPY_REFERENCE_GUIDE.md ←── Get all UI text
    │
    └─→ MERCHANT_FLOW_README.md ←── Share with stakeholders
```

---

## By Role

### 👨‍💻 Frontend Developers

**Primary documents:**
1. DESIGN_SPECIFICATIONS.md - Your main reference for implementation
2. COPY_REFERENCE_GUIDE.md - All UI text (create constants file)
3. USER_FLOW_DIAGRAMS.md - Understand state transitions

**Quick references:**
- Component specs: DESIGN_SPECIFICATIONS.md → "Component Library Specifications"
- Responsive patterns: DESIGN_SPECIFICATIONS.md → "Responsive Design Guidelines"
- Form validation: DESIGN_SPECIFICATIONS.md → Each step's "State Management Requirements"

### 🎨 Designers

**Primary documents:**
1. DESIGN_SPECIFICATIONS.md - Complete design system and patterns
2. USER_FLOW_DIAGRAMS.md - All flows documented

**For design reviews:**
- Use DESIGN_SPECIFICATIONS.md as the source of truth
- Reference specific sections during implementation reviews

### 📊 Product Managers

**Primary documents:**
1. MERCHANT_FLOW_README.md - High-level journey overview
2. DESIGN_HANDOFF_SUMMARY.md - Scope, priorities, and metrics
3. USER_FLOW_DIAGRAMS.md - Detailed flows and edge cases

**Quick insights:**
- Success metrics: DESIGN_HANDOFF_SUMMARY.md → "Success Metrics"
- Implementation phases: DESIGN_HANDOFF_SUMMARY.md → "Implementation Priorities"

### 👥 Stakeholders / Leadership

**Primary documents:**
1. MERCHANT_FLOW_README.md - Simplified overview
2. DESIGN_HANDOFF_SUMMARY.md → "What's Been Designed" section

**For presentations:**
- Use USER_FLOW_DIAGRAMS.md → "Complete Onboarding Flow (High-Level)"
- Share MERCHANT_FLOW_README.md for non-technical audience

### ✍️ Content Writers / Copywriters

**Primary documents:**
1. COPY_REFERENCE_GUIDE.md - All copy with voice/tone guidelines
2. DESIGN_SPECIFICATIONS.md → "Copy & Microcopy Guidelines"

**For new copy:**
- Follow voice/tone in COPY_REFERENCE_GUIDE.md → "Voice & Tone Guidelines"
- Reference existing patterns for consistency

### ♿ QA / Accessibility Testers

**Primary documents:**
1. DESIGN_SPECIFICATIONS.md → "Accessibility Requirements"
2. DESIGN_HANDOFF_SUMMARY.md → "Accessibility Checklist"

**Testing requirements:**
- WCAG 2.1 AA compliance required
- Keyboard navigation patterns documented
- Screen reader requirements specified

---

## Key Concepts Explained

### What are "Invisible Cohorts"?

Merchants are automatically assigned to cohorts (self-serve, assisted, managed) based on their business profile, but they don't see "tiers" or "plans." The same core UI adapts with specialist support appearing seamlessly where needed.

**Where to learn more:**
- DESIGN_HANDOFF_SUMMARY.md → "Key Design Principles" → "Invisible Cohorts"
- USER_FLOW_DIAGRAMS.md → "Specialist Integration Touchpoints"

### What is "Progressive Disclosure"?

Show only what's needed at each moment. Multi-page forms, expandable sections, and task unlocking based on dependencies reduce cognitive load and increase completion rates.

**Where to learn more:**
- DESIGN_SPECIFICATIONS.md → "Design Philosophy & Principles"
- Each step in DESIGN_SPECIFICATIONS.md demonstrates this principle

### What happens behind the scenes?

While merchants see 4 simple steps, the system orchestrates 20+ background processes (KYB verification, provisioning, hardware fulfillment, KYC verification, etc.). The design hides this complexity.

**Where to learn more:**
- MERCHANT_FLOW_README.md → "Behind the Scenes" sections
- DESIGN_SPECIFICATIONS.md → Each step's "Behind the Scenes" subsections

---

## Implementation Sequence

### Phase 1: MVP (Months 1-2)

**Goal:** Complete self-serve path

**Documents to focus on:**
1. DESIGN_HANDOFF_SUMMARY.md → "Getting Started"
2. DESIGN_SPECIFICATIONS.md → Step 1, Step 2, Step 3, Step 4
3. COPY_REFERENCE_GUIDE.md → Step 1, Step 2, Step 3, Step 4

**Build order:**
1. Core components (Button, Input, Card, Modal, Progress)
2. Step 1 (Signup)
3. Step 2 (Configuration)
4. Step 3 (Checkout)
5. Step 4 (Checklist)
6. Integration testing

### Phase 2: Specialist Integration (Month 3)

**Goal:** Add assisted and managed paths

**Documents to focus on:**
1. DESIGN_SPECIFICATIONS.md → Specialist banners and conditional rendering
2. USER_FLOW_DIAGRAMS.md → "Specialist Integration Touchpoints"
3. COPY_REFERENCE_GUIDE.md → "Specialist Messaging"

### Phase 3: Polish (Months 4-5)

**Goal:** Refinement and optimization

**Documents to focus on:**
1. DESIGN_SPECIFICATIONS.md → "Animation & Transitions"
2. DESIGN_SPECIFICATIONS.md → "Accessibility Requirements"
3. DESIGN_HANDOFF_SUMMARY.md → "Success Metrics"

---

## Common Questions

### Where do I find...?

**Component specifications?**
→ DESIGN_SPECIFICATIONS.md → "Component Library Specifications"

**All UI copy?**
→ COPY_REFERENCE_GUIDE.md (entire document)

**Error message formats?**
→ COPY_REFERENCE_GUIDE.md → "Error Messages"

**Responsive breakpoints?**
→ DESIGN_SPECIFICATIONS.md → "Responsive Design Guidelines"

**Form validation rules?**
→ DESIGN_SPECIFICATIONS.md → Each step shows field validations

**Animation specifications?**
→ DESIGN_SPECIFICATIONS.md → "Animation & Transitions"

**API endpoints?**
→ DESIGN_HANDOFF_SUMMARY.md → "Data Flow & API Integration"

**State management approach?**
→ DESIGN_HANDOFF_SUMMARY.md → "Data Flow & API Integration"

**Accessibility requirements?**
→ DESIGN_SPECIFICATIONS.md → "Accessibility Requirements"

**File structure?**
→ DESIGN_HANDOFF_SUMMARY.md → "File Structure"

**Design rationale?**
→ DESIGN_SPECIFICATIONS.md → "Design Decision Rationale"

---

## Document Statistics

| Document | Size | Lines | Sections | Best For |
|----------|------|-------|----------|----------|
| DESIGN_HANDOFF_SUMMARY | 19 KB | 800+ | 12 | Quick reference, planning |
| DESIGN_SPECIFICATIONS | 95 KB | 4000+ | 12 | Implementation details |
| USER_FLOW_DIAGRAMS | 101 KB | 4500+ | 7 | Flow visualization |
| COPY_REFERENCE_GUIDE | 38 KB | 1700+ | 9 | All UI text |
| MERCHANT_FLOW_README | 13 KB | 500+ | 5 | High-level overview |

**Total design documentation:** ~266 KB, ~11,500 lines

---

## Version History

### Version 1.0 - October 10, 2025
- ✅ Complete design specifications for all 4 steps
- ✅ User flow diagrams with all states and transitions
- ✅ Copy reference guide with all UI text
- ✅ Design handoff summary with implementation guidance
- ✅ Component library specifications
- ✅ Responsive and accessibility guidelines
- ✅ Ready for frontend implementation

---

## Next Steps

### For Design Team
- [ ] Create high-fidelity mockups in Figma
- [ ] Build interactive prototype
- [ ] Create Figma component library
- [ ] Export design tokens for Tailwind
- [ ] Schedule kickoff meeting with frontend team

### For Frontend Team
- [ ] Review all design documentation
- [ ] Attend kickoff meeting
- [ ] Set up development environment
- [ ] Begin Step 1 implementation
- [ ] Schedule regular design reviews

### For Product Team
- [ ] Review design documentation for alignment with PRD
- [ ] Validate success metrics
- [ ] Confirm implementation priorities
- [ ] Plan user testing sessions

---

## Support & Questions

**Design questions?**
- Reference the relevant document first
- Check "Common Questions" section above
- Document gaps or unclear areas
- Schedule design review session

**Technical questions?**
- Review DESIGN_HANDOFF_SUMMARY.md technical sections
- API integration points are documented
- State management approach is recommended but flexible

**Product questions?**
- Reference merchant_onboarding_prd_revised.md (parent directory)
- Open questions are documented in PRD

---

## Design Principles Summary

The design achieves these goals through:

1. **Invisible Cohorts** - Same UI adapts seamlessly for all merchant types
2. **Progressive Disclosure** - Show only what's needed now
3. **Clear Progress** - Merchants always know where they are
4. **Merchant Language** - Action-oriented, benefit-focused copy
5. **Trust Building** - Transparent timelines and clear communication

**Result:** A simple, intuitive onboarding experience that hides complexity while maintaining transparency.

---

## File Tree

```
/Users/mike.mcmillan/onboarding/onboarding-dashboard/
│
├── DESIGN_INDEX.md                    ← You are here
├── DESIGN_HANDOFF_SUMMARY.md          ← Start here for overview
├── DESIGN_SPECIFICATIONS.md           ← Main implementation reference
├── USER_FLOW_DIAGRAMS.md              ← Visual flows and states
├── COPY_REFERENCE_GUIDE.md            ← All UI text
├── MERCHANT_FLOW_README.md            ← High-level journey
└── README.md                          ← Technical setup
```

---

## Let's Build!

Everything is ready for implementation. The design team has provided:

- ✅ Complete UX/UI specifications for all 4 steps
- ✅ All user flows and state transitions documented
- ✅ All UI copy and messaging written
- ✅ Component library fully specified
- ✅ Responsive and accessibility guidelines
- ✅ Implementation guidance and priorities

**The frontend team has everything needed to build a best-in-class onboarding experience.**

Questions? Start with this index, then reference the specific documents. Let's create something great!

---

**Document maintained by:** Design Team
**Last updated:** October 10, 2025
**Status:** ✅ Complete and ready for implementation
