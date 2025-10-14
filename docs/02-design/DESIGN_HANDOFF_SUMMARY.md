# Design Handoff Summary: Merchant Onboarding

## Overview

This document serves as the executive summary and quick reference guide for implementing the Lightspeed merchant onboarding UX/UI design.

**Date:** October 10, 2025
**Design Lead:** Claude Design Lead Orchestrator
**Status:** Ready for Frontend Implementation

---

## Quick Links

**Primary Documents:**
- [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md) - Complete design specifications (all steps, components, patterns)
- [USER_FLOW_DIAGRAMS.md](./USER_FLOW_DIAGRAMS.md) - Visual flow diagrams and state transitions
- [merchant_onboarding_prd_revised.md](../merchant_onboarding_prd_revised.md) - Product requirements (reference)

---

## What's Been Designed

### Complete 4-Step Onboarding Journey

✅ **Step 1: Sign Up & Tell Us About Your Business** (3-5 min)
- 2-page form with progressive disclosure
- KYB verification and cohort routing
- Multiple outcome states (approved, high-value, review, rejected)

✅ **Step 2: Set Up Your POS & Payments** (10-20 min)
- Unified configuration dashboard
- Real-time quote updates
- Hardware package selection
- Specialist integration (assisted/managed cohorts)

✅ **Step 3: Complete Purchase & Verification** (5 min)
- Familiar eCommerce checkout pattern
- Identity verification (KYC) integrated
- Processing states and confirmation
- Error recovery flows

✅ **Step 4: Get Everything Ready** (2-5 days)
- Task-based checklist with smart unlocking
- Hardware setup, bank connection, data import
- Test transaction flow
- Completion celebration

### Cross-Cutting Design Elements

✅ **Design System Foundation**
- Typography scale, color system, spacing, borders
- Complete visual hierarchy defined

✅ **Component Library Specifications**
- 12 core components fully specified (Button, Input, Select, Card, Modal, etc.)
- All variants, states, and props documented

✅ **Responsive Design Patterns**
- Mobile, tablet, desktop layouts
- Touch target sizes, typography scaling
- Navigation patterns per breakpoint

✅ **Accessibility Requirements**
- WCAG 2.1 AA compliance guidelines
- Keyboard navigation patterns
- Screen reader support
- Focus management

✅ **Animation & Transitions**
- Page transitions, modal behaviors
- Loading states, success states
- Performance guidelines (60fps target)

✅ **Copy & Microcopy Guidelines**
- Voice and tone principles
- Writing patterns for all UI elements
- Error message formats
- Sensitive topic handling

---

## Key Design Principles

### 1. Invisible Cohorts
Merchants in different cohorts (self-serve, assisted, managed) see nearly identical UI. Specialist support appears seamlessly without making merchants choose tiers.

**Implementation:** Use conditional rendering based on cohort data, but maintain same core components.

### 2. Progressive Disclosure
Show only what's needed at each moment. Multi-page forms, expandable sections, task unlocking based on dependencies.

**Implementation:** Use accordion components, conditional rendering, state-based unlocking logic.

### 3. Clear Progress
Merchants always know "Step X of 4" and what comes next. Progress indicators at macro and micro levels.

**Implementation:** Persistent progress component in header, task completion tracking in Step 4.

### 4. Merchant-Centered Language
Action-oriented, benefit-focused copy. No jargon. Explain "why" for sensitive data requests.

**Implementation:** Use copy constants file, never hardcode UI text.

### 5. Trust Building
Transparent timelines, security indicators, clear error messages with recovery paths.

**Implementation:** Show "usually takes X time", use lock icons, provide actionable error messages.

---

## Implementation Priorities

### Phase 1: MVP (Core Flow)
**Timeline:** Months 1-2
**Goal:** Complete self-serve path, basic cohort routing

**Must-Have:**
- All 4 steps functional for self-serve merchants
- Form validation with Zod schemas
- Basic responsive behavior (mobile + desktop)
- KYB/KYC integration points (API stubs OK initially)
- Core components (Button, Input, Card, Modal, Progress)
- Error handling with clear messages
- Real-time quote updates in Step 2
- Task checklist in Step 4

**Can Defer:**
- Specialist integration (assisted/managed)
- Advanced animations
- Some edge cases
- Polish and micro-interactions

### Phase 2: Specialist Integration
**Timeline:** Month 3
**Goal:** Add assisted and managed paths

**Add:**
- Specialist banners (conditional rendering)
- High-value merchant routing
- Quote builder for specialists
- Shared dashboard views
- IC scheduling integration

### Phase 3: Polish & Optimization
**Timeline:** Months 4-5
**Goal:** Refinement and intelligence

**Add:**
- Advanced animations and transitions
- Stall detection and interventions
- Enhanced error recovery
- Performance optimization
- Analytics integration
- A/B testing framework

---

## Technical Stack Recommendations

### Frontend Framework
**Next.js 14+** with App Router
- Server and client components
- Built-in routing
- Image optimization
- API routes for BFF pattern

### UI Components
**shadcn/ui** + Radix UI primitives
- Accessible by default
- Customizable with Tailwind
- Tree-shakeable
- Matches design system approach

### Styling
**Tailwind CSS**
- Utility-first approach
- Configured with design tokens
- Responsive modifiers
- Dark mode support (future)

### Form Handling
**React Hook Form** + **Zod**
- Performance (uncontrolled inputs)
- Type-safe validation schemas
- Easy error handling
- Integrates with components

### State Management
**React Context** for onboarding state
**React Query** (TanStack Query) for API state
- Local storage persistence
- Optimistic updates
- Cache management

### Animations
**Framer Motion** (optional) or **CSS transitions**
- Declarative animations
- Spring physics
- Gesture support
- Performance optimized

---

## File Structure

```
/components
  /onboarding
    /step1-signup
      /components
        AccountCreationForm.tsx
        BusinessDetailsForm.tsx
        ProcessingScreen.tsx
        OutcomeScreens.tsx
      /hooks
        useSignup.ts
      index.ts
    /step2-setup
      /components
        SoftwareConfiguration.tsx
        HardwareSelection.tsx
        QuoteSummary.tsx
        SpecialistBanner.tsx
      /hooks
        useQuote.ts
        useHardwareCatalog.ts
      index.ts
    /step3-checkout
      /components
        OrderReview.tsx
        PaymentForm.tsx
        ShippingForm.tsx
        IdentityVerification.tsx
        ConfirmationScreen.tsx
      /hooks
        useCheckout.ts
      index.ts
    /step4-checklist
      /components
        OnboardingDashboard.tsx
        TaskCard.tsx
        TaskList.tsx
        TestTransactionFlow.tsx
      /hooks
        useTasks.ts
      index.ts
  /shared
    /forms
      Input.tsx
      Select.tsx
      RadioGroup.tsx
      Checkbox.tsx
      AddressInput.tsx
    /ui
      Button.tsx
      Card.tsx
      Modal.tsx
      Banner.tsx
      ProgressIndicator.tsx
      Tooltip.tsx
    /layout
      Header.tsx
      Container.tsx
      Grid.tsx

/lib
  /validation
    step1-schemas.ts
    step2-schemas.ts
    step3-schemas.ts
    validators.ts
  /api
    onboarding.ts
    hardware.ts
    payments.ts
  /utils
    formatting.ts
    helpers.ts
  /constants
    copy.ts (all UI text)
    routes.ts

/hooks
  useOnboarding.ts (global onboarding context)
  useFormValidation.ts
  useKYBStatus.ts
  useLocalStorage.ts

/types
  merchant.ts
  onboarding.ts
  api.ts
  cohort.ts

/app
  /onboarding
    /step1
      page.tsx
    /step2
      page.tsx
    /step3
      page.tsx
    /step4
      page.tsx
    layout.tsx
  layout.tsx (root)

/styles
  globals.css (Tailwind imports)
  animations.css
```

---

## Data Flow & API Integration

### Onboarding Context Structure

```typescript
interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4;
  merchantProfile: {
    id: string;
    email: string;
    businessName: string;
    cohort: 'self-serve' | 'assisted' | 'managed';
    kybStatus: 'pending' | 'approved' | 'review' | 'rejected';
  };
  configuration: {
    locations: number;
    registers: number;
    hardware: HardwareSelection[];
    addons: string[];
  };
  quote: {
    softwareMonthly: number;
    hardwareOneTime: number;
    totalDueToday: number;
    monthlyRecurring: number;
  };
  tasks: {
    accountCreated: boolean;
    softwareActivated: boolean;
    hardwareShipped: boolean;
    hardwareSetup: boolean;
    bankConnected: boolean;
    dataImported: boolean;
  };
}
```

### Key API Endpoints

**Step 1:**
- `POST /api/onboarding/signup` - Create account + trigger KYB
- `GET /api/onboarding/kyb-status/:id` - Poll verification status
- `POST /api/cohort/assign` - Determine cohort

**Step 2:**
- `GET /api/hardware/catalog` - Fetch available hardware
- `POST /api/hardware/compatibility` - Check existing hardware
- `POST /api/quote/generate` - Calculate quote
- `GET /api/specialists/:cohort` - Get specialist info (assisted/managed)

**Step 3:**
- `POST /api/orders/create` - Process payment + order
- `POST /api/kyc/submit` - Submit identity verification
- `GET /api/orders/:id/status` - Check order status
- `POST /api/accounts/provision` - Provision X-Series account

**Step 4:**
- `GET /api/onboarding/status/:merchantId` - Fetch all task status
- `POST /api/tasks/:taskId/complete` - Mark task complete
- `POST /api/bank-accounts/add` - Submit bank details
- `POST /api/bank-accounts/verify` - Verify micro-deposits
- `POST /api/data/import` - Upload CSV for import
- `GET /api/hardware/activation/:deviceId` - Check device status

---

## Component Specifications (Quick Reference)

### Button
**Variants:** primary, secondary, tertiary, danger
**Sizes:** small (36px), medium (44px), large (52px)
**States:** default, hover, active, disabled, loading

### Input
**Types:** text, email, tel, password, number
**Features:** validation, error display, help text, icons, show/hide toggle
**States:** default, focus, valid, error, disabled

### Card
**Variants:** standard, elevated (shadow), outlined, interactive (hover)
**Padding:** none, small, medium, large

### Modal
**Sizes:** small (400px), medium (600px), large (800px), fullscreen
**Features:** overlay click to close, escape key, focus trap, scroll lock

### Progress Indicator
**Variants:** horizontal, vertical, compact
**Display:** step circles, connecting lines, labels, current step highlight

### Radio Group
**Layouts:** horizontal, vertical, grid
**Styles:** standard (compact), card (visual selection)

### Task Card (Step 4)
**Status:** completed, in-progress, waiting, not-started
**Features:** expandable, sub-task checklist, progress indicator, conditional content

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Single column, full width, stacked elements */
  /* Sticky footers for CTAs */
  /* Collapsed navigation */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) {
  /* Two columns where appropriate */
  /* More breathing room */
  /* Expanded navigation */
}

/* Desktop */
@media (min-width: 1280px) {
  /* Full multi-column layouts */
  /* Sticky sidebars */
  /* Max content width: 1200px centered */
}
```

### Key Responsive Changes

**Step 1:** Centered form, max-width 480px on all devices
**Step 2:** Two-column (60/40) on desktop, stacked on mobile with sticky footer
**Step 3:** Single column centered, max-width 720px on all devices
**Step 4:** Single column, max-width 840px on all devices

**Touch Targets:** Minimum 44x44px on mobile/tablet

---

## Accessibility Checklist

### Required for Launch

- [ ] All interactive elements keyboard accessible (Tab navigation)
- [ ] Visible focus indicators on all focusable elements
- [ ] Proper heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Form labels associated with inputs (for/id or aria-label)
- [ ] Error messages announced to screen readers (aria-live, aria-invalid)
- [ ] Color contrast minimum 4.5:1 for text
- [ ] Alt text for all meaningful images
- [ ] Modal focus management (trap focus, return on close)
- [ ] Skip links for main content
- [ ] Respect prefers-reduced-motion for animations

### Testing Tools

- **Automated:** axe DevTools, Lighthouse Accessibility audit
- **Manual:** Keyboard-only navigation, NVDA/JAWS/VoiceOver screen readers
- **Visual:** Zoom to 200%, high contrast mode

---

## Copy & Content Guidelines

### Voice & Tone
- **Friendly but professional** - Approachable without being overly casual
- **Clear and direct** - Short sentences, active voice
- **Encouraging** - Positive reinforcement without being cheesy
- **Helpful** - Anticipate questions, explain when needed

### Button Labels
✅ Good: "Continue to checkout", "Connect bank account", "Start setup"
❌ Bad: "Next", "Submit", "OK"

### Error Messages
**Format:** [What happened] + [How to fix]
✅ Good: "Email already in use. Try signing in instead or use a different email."
❌ Bad: "Error 400: Invalid input"

### Help Text
Answer "why do I need this?" in under 15 words
✅ Good: "We'll send your login details here"
❌ Bad: "Email address is required for account creation"

### Sensitive Topics
- **Money:** Be upfront, no hidden fees, show total prominently
- **Identity:** Explain why before asking, reassure about security
- **Rejections:** Be direct but empathetic, offer alternatives
- **Waiting:** Set clear expectations with timelines

---

## Design Assets & Resources

### Available Now
1. **DESIGN_SPECIFICATIONS.md** - Complete specifications for all 4 steps
2. **USER_FLOW_DIAGRAMS.md** - Visual flow diagrams and state transitions
3. **merchant_onboarding_prd_revised.md** - Product requirements document

### To Be Created (Next Phase)
1. **High-fidelity mockups** in Figma
   - All steps, all states, all cohorts
   - Desktop, tablet, mobile views
2. **Interactive prototype** for user testing
3. **Figma component library** with all variants
4. **Design tokens** file for Tailwind config
5. **Copy spreadsheet** with all UI text
6. **Icon library** requirements

---

## Getting Started (For Frontend Team)

### Day 1: Setup & Planning
1. Review DESIGN_SPECIFICATIONS.md (focus on Step 1 first)
2. Review USER_FLOW_DIAGRAMS.md for flow understanding
3. Set up Next.js project with Tailwind + shadcn/ui
4. Configure design tokens in Tailwind config
5. Create file structure as outlined above
6. Set up Zod validation schemas

### Week 1: Core Components + Step 1
1. Build core components (Button, Input, Card, Modal)
2. Implement Step 1 Page 1 (Account Creation form)
3. Implement Step 1 Page 2 (Business Details form)
4. Add form validation with Zod
5. Create processing screen
6. Build outcome screens (approved, high-value, review, rejected)
7. Test responsive behavior
8. Basic accessibility pass

### Week 2: Step 2
1. Build SoftwareConfiguration component
2. Build HardwareSelection component (packages)
3. Build QuoteSummary component (sticky sidebar)
4. Implement real-time quote updates
5. Add SpecialistBanner (conditional rendering)
6. Test on all devices
7. Accessibility testing

### Week 3: Step 3
1. Build OrderReview component (expandable sections)
2. Build PaymentForm component (card input with validation)
3. Build ShippingForm component (address autocomplete)
4. Build IdentityVerification component (sensitive data handling)
5. Implement processing state
6. Build ConfirmationScreen
7. Error handling (payment declined, KYC review)

### Week 4: Step 4 + Integration
1. Build OnboardingDashboard layout
2. Build TaskCard component (all states)
3. Implement task unlocking logic
4. Build bank connection flow (Plaid + manual)
5. Build test transaction flow
6. Build completion celebration
7. End-to-end testing

### Week 5: Polish & Testing
1. Animation implementation
2. Performance optimization
3. Accessibility audit and fixes
4. Cross-browser testing
5. Edge case testing
6. Copy refinement
7. Bug fixes

---

## Questions & Support

### During Implementation

**Design Questions:**
- Refer to DESIGN_SPECIFICATIONS.md first
- Check USER_FLOW_DIAGRAMS.md for flow clarity
- Document edge cases not covered

**Technical Questions:**
- API integration points defined but may need refinement
- State management approach is recommended but flexible
- Component library choice (shadcn/ui) is suggested but not required

**Product Questions:**
- Refer to merchant_onboarding_prd_revised.md
- Open questions documented in PRD (Section: "Open Questions & Decisions Needed")

### Collaboration Process

**Design Reviews:**
- Schedule weekly review sessions
- Use staging environment for review
- Provide feedback on Slack/GitHub with screenshots
- Document design deviations with rationale

**Design QA:**
- Designer reviews implementation before launch
- Accessibility audit before launch
- Copy review before launch
- Cross-device testing together

---

## Success Metrics (Reference)

### User-Facing Metrics
- **Completion Rate:** >85% (all 4 steps)
- **Time to Complete:** <7 days (signup to active merchant)
- **Support Contact Rate:** <15% during onboarding
- **Merchant Satisfaction:** >8.5/10

### Technical Metrics
- **Page Load Time:** <2 seconds
- **Lighthouse Score:** >90 (Performance, Accessibility, Best Practices)
- **Error Rate:** <1% (API failures, validation errors)
- **Mobile Usability:** 100% (Google Mobile-Friendly Test)

---

## Design Rationale Summary

### Why 4 Steps?
Merchants think in these terms: "Sign up → Configure → Buy → Set up"
Matches mental model better than complex multi-stage flows

### Why Progressive Disclosure?
Reduces cognitive load, increases completion rates
Research shows shorter forms with multiple pages perform better than long single-page forms

### Why Invisible Cohorts?
Removes decision paralysis, system determines best path
Merchants don't want to "choose a tier" - they want to get started

### Why Task Checklist (Step 4)?
Clear sense of accomplishment as tasks complete
Easy to track progress and know what's left
Intervention opportunities when stalled

### Why Real-Time Quote (Step 2)?
Transparency builds trust, no surprises at checkout
Immediate feedback on configuration changes
Higher conversion when price is always visible

---

## Next Actions

### Immediate (This Week)
- [ ] Frontend team reviews all design documentation
- [ ] Schedule kickoff meeting with design lead
- [ ] Set up development environment
- [ ] Create high-fidelity mockups in Figma (design team)
- [ ] Begin Step 1 implementation

### Short-Term (Month 1)
- [ ] Complete Step 1 implementation
- [ ] Design review: Step 1
- [ ] Begin Step 2 implementation
- [ ] Create Figma component library
- [ ] Set up staging environment

### Medium-Term (Months 2-3)
- [ ] Complete all 4 steps (self-serve path)
- [ ] End-to-end testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] User acceptance testing

---

## Conclusion

This design provides a comprehensive, user-centered onboarding experience that:
- **Simplifies complexity** through progressive disclosure
- **Builds trust** through transparency and clear communication
- **Adapts seamlessly** to different merchant needs via invisible cohort routing
- **Guides effectively** with clear progress and next actions
- **Supports accessibility** as a core requirement, not an afterthought

The design is ready for implementation. All specifications, flows, components, and patterns have been documented. The frontend team has everything needed to build a best-in-class onboarding experience.

**Let's build something great!**

---

**Document prepared by:** Claude Design Lead Orchestrator
**For questions or clarifications:** Reference the detailed specifications or schedule a design review session
