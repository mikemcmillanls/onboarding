# Design System Foundation
## Cohort-Based Merchant Onboarding

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Phase 1 Foundation

---

## Overview

This design system establishes the visual and interaction foundation for the unified merchant onboarding experience. It supports three merchant cohorts (Self-Serve, Assisted, Managed) with interfaces for merchants, Account Executives (AEs), and Implementation Consultants (ICs).

**Design Principles:**
1. **Progressive Disclosure** - Reveal complexity gradually as merchants progress
2. **Context-Aware Support** - Surface help at decision points
3. **Cohort-Appropriate Complexity** - Balance simplicity (self-serve) with power (admin tools)
4. **Trust & Transparency** - Clear progress indicators, honest timelines, upfront pricing
5. **Celebration & Momentum** - Acknowledge milestones to maintain engagement

---

## Color Palette

### Primary Colors
```
Primary Blue (Brand)
- Primary 900: #0A1E3D (Darkest - headers, emphasis)
- Primary 700: #1E3A5F (Dark - primary actions)
- Primary 500: #2563EB (Base - buttons, links, focus states)
- Primary 300: #60A5FA (Light - hover states)
- Primary 100: #DBEAFE (Lightest - backgrounds, highlights)
- Primary 50:  #EFF6FF (Subtle backgrounds)

Usage: Primary CTAs, progress indicators, active states, merchant-facing actions
```

### Secondary Colors
```
Slate (Neutral)
- Slate 900: #0F172A (Text primary)
- Slate 700: #334155 (Text secondary)
- Slate 500: #64748B (Text tertiary, disabled states)
- Slate 300: #CBD5E1 (Borders, dividers)
- Slate 100: #F1F5F9 (Backgrounds, cards)
- Slate 50:  #F8FAFC (Page backgrounds)

Usage: Text hierarchy, borders, backgrounds, neutral UI elements
```

### Semantic Colors

**Success (Green)**
```
- Success 700: #15803D (Dark)
- Success 500: #22C55E (Base - completed states, checkmarks)
- Success 100: #DCFCE7 (Light - success backgrounds)
```
Usage: Step completion, successful payments, hardware delivered, payments activated

**Warning (Amber)**
```
- Warning 700: #B45309 (Dark)
- Warning 500: #F59E0B (Base - pending actions, review needed)
- Warning 100: #FEF3C7 (Light - warning backgrounds)
```
Usage: Pending KYB/KYC review, missing information, stalled progress

**Error (Red)**
```
- Error 700: #B91C1C (Dark)
- Error 500: #EF4444 (Base - validation errors, rejected states)
- Error 100: #FEE2E2 (Light - error backgrounds)
```
Usage: Form validation errors, KYB rejection, failed payments

**Info (Sky Blue)**
```
- Info 700: #0369A1 (Dark)
- Info 500: #0EA5E9 (Base - informational messages)
- Info 100: #E0F2FE (Light - info backgrounds)
```
Usage: Helpful tips, IC session reminders, AE call scheduled notifications

---

## Typography Scale

### Font Family
```
Sans-Serif (Primary): 'Inter', system-ui, -apple-system, sans-serif
Monospace (Code/Data): 'JetBrains Mono', 'Courier New', monospace
```

**Rationale:** Inter provides excellent readability at all sizes, includes extensive weights, and maintains clarity on both desktop and mobile.

### Type Scale (Desktop)

```
Heading 1 (H1) - Page Titles
Font: Inter Semi-Bold (600)
Size: 32px (2rem)
Line Height: 40px (1.25)
Letter Spacing: -0.02em
Usage: Dashboard title, major section headers

Heading 2 (H2) - Section Titles
Font: Inter Semi-Bold (600)
Size: 24px (1.5rem)
Line Height: 32px (1.33)
Letter Spacing: -0.01em
Usage: Step titles, modal headers, card headers

Heading 3 (H3) - Subsection Titles
Font: Inter Medium (500)
Size: 20px (1.25rem)
Line Height: 28px (1.4)
Letter Spacing: 0
Usage: Form sections, widget titles

Heading 4 (H4) - Component Titles
Font: Inter Medium (500)
Size: 16px (1rem)
Line Height: 24px (1.5)
Letter Spacing: 0
Usage: Small card headers, step numbers

Body Large
Font: Inter Regular (400)
Size: 18px (1.125rem)
Line Height: 28px (1.56)
Letter Spacing: 0
Usage: Intro paragraphs, important descriptions

Body Regular (Base)
Font: Inter Regular (400)
Size: 16px (1rem)
Line Height: 24px (1.5)
Letter Spacing: 0
Usage: Primary body text, form descriptions

Body Small
Font: Inter Regular (400)
Size: 14px (0.875rem)
Line Height: 20px (1.43)
Letter Spacing: 0
Usage: Helper text, secondary information, table data

Label (Form Labels)
Font: Inter Medium (500)
Size: 14px (0.875rem)
Line Height: 20px (1.43)
Letter Spacing: 0.01em
Usage: Form field labels, navigation items

Caption
Font: Inter Regular (400)
Size: 12px (0.75rem)
Line Height: 16px (1.33)
Letter Spacing: 0.02em
Usage: Timestamps, metadata, fine print

Overline (Eyebrow Text)
Font: Inter Semi-Bold (600)
Size: 12px (0.75rem)
Line Height: 16px (1.33)
Letter Spacing: 0.08em
Text Transform: Uppercase
Usage: Step indicators ("STEP 3 OF 10"), status badges
```

### Type Scale (Mobile Adjustments)

```
H1: 28px (1.75rem) / Line Height: 36px
H2: 22px (1.375rem) / Line Height: 30px
H3: 18px (1.125rem) / Line Height: 26px
Body Large: 17px (1.063rem) / Line Height: 26px
Body Regular: 16px (1rem) / Line Height: 24px
(All other sizes remain consistent)
```

---

## Spacing System

### Base Unit: 4px

Uses an 8px base grid with 4px increments for flexibility.

```
Spacing Scale:
0.5 = 2px   (Tight spacing between related inline elements)
1   = 4px   (Minimum touch target padding)
2   = 8px   (Default inline spacing, icon gaps)
3   = 12px  (Small component padding)
4   = 16px  (Standard component padding, form field spacing)
5   = 20px  (Medium component padding)
6   = 24px  (Large component padding, section spacing)
8   = 32px  (Extra large component padding, card spacing)
10  = 40px  (Section divider spacing)
12  = 48px  (Major section spacing)
16  = 64px  (Page section spacing)
20  = 80px  (Large page section spacing)
24  = 96px  (Extra large page section spacing)
```

### Component-Specific Spacing

**Form Fields:**
- Label to Input: 8px (space-2)
- Input Padding: 12px vertical, 16px horizontal (space-3, space-4)
- Field to Field: 24px (space-6)

**Cards:**
- Card Padding: 24px (space-6) desktop, 16px (space-4) mobile
- Card Gap: 24px (space-6)

**Buttons:**
- Button Padding: 12px vertical, 24px horizontal (space-3, space-6)
- Icon to Text: 8px (space-2)

**Page Layout:**
- Page Margin: 24px (space-6) desktop, 16px (space-4) mobile
- Section Spacing: 48px (space-12) desktop, 32px (space-8) mobile

---

## Component Library Approach

### Recommended Framework: **shadcn/ui**

**Rationale:**
- Built on Radix UI primitives (accessible by default)
- Fully customizable with Tailwind CSS
- Copy-paste components (no package dependency hell)
- Excellent TypeScript support
- Built-in dark mode support (future-proofing)
- Active community and Next.js integration

**Core Components Needed:**

**Forms:**
- Input (text, email, phone, number, password)
- Select (dropdown)
- Checkbox
- Radio Group
- Textarea
- Date Picker
- File Upload

**Navigation:**
- Breadcrumbs
- Tabs
- Stepper (custom build on Progress primitive)
- Pagination

**Feedback:**
- Alert (info, warning, error, success)
- Toast (notifications)
- Progress Bar
- Loading Spinner
- Badge (status indicators)

**Overlays:**
- Modal/Dialog
- Sheet (slide-out panel)
- Tooltip
- Popover
- Command Palette (search/help)

**Data Display:**
- Card
- Table
- Data List
- Empty State
- Stat Card (metrics)

**Actions:**
- Button (primary, secondary, ghost, destructive)
- Icon Button
- Button Group
- Dropdown Menu

### Custom Components to Build

**OnboardingProgressStepper**
- 10-step horizontal stepper (desktop)
- Collapsible vertical stepper (mobile)
- States: completed, active, pending, blocked
- Substep indicators for complex steps

**QuoteBuilder**
- Line item editor with add/remove
- Real-time total calculation
- Discount/promotion application
- Tax and shipping calculation display

**HardwareBundleSelector**
- Visual card-based bundle picker
- Comparison view
- Compatibility checker UI
- "Bring your own hardware" flow

**MerchantStatusCard**
- Cohort badge (Self-Serve, Assisted, Managed)
- Progress percentage
- Next action CTA
- Support contact quick action

**ICScheduler**
- Calendar availability view
- Timezone-aware booking
- Reschedule/cancel interface
- Session type selector

---

## Iconography Style

### Icon Library: **Lucide Icons**

**Rationale:**
- Consistent with shadcn/ui ecosystem
- Clean, modern, minimal aesthetic
- Extensive icon set (1000+ icons)
- SVG-based (scalable, performant)
- MIT licensed

### Icon Sizing
```
Small: 16px (status indicators, inline icons)
Medium: 20px (form field icons, navigation)
Large: 24px (feature icons, cards)
Extra Large: 32px (empty states, hero sections)
```

### Icon Usage Guidelines

**Navigation & Actions:**
- Home, Settings, Help, Logout, Menu, Search
- ChevronRight (next step), ChevronLeft (back), X (close)

**Status Indicators:**
- CheckCircle (completed, success)
- AlertCircle (warning, review needed)
- XCircle (error, rejected)
- Clock (pending, in progress)
- InfoCircle (informational)

**Business Objects:**
- Building (locations), CreditCard (payments), Package (hardware)
- Users (team, owners), FileText (documents), ShoppingCart (checkout)
- TrendingUp (GTV, revenue), Calendar (scheduling), MessageSquare (support)

**Actions:**
- Plus (add), Minus (remove), Edit, Trash, Download, Upload
- Send, Phone, Mail, ExternalLink

**Style Consistency:**
- Use 2px stroke weight (default Lucide style)
- Maintain 1:1 aspect ratio
- Apply color inheritance from parent text color
- Add hover states with color shifts (Primary 700 → Primary 500)

---

## Responsive Breakpoints

### Breakpoint Definitions

```
Mobile (sm):    640px  and up
Tablet (md):    768px  and up
Laptop (lg):    1024px and up
Desktop (xl):   1280px and up
Wide (2xl):     1536px and up
```

### Layout Strategies by Breakpoint

**Mobile (< 640px):**
- Single column layouts
- Bottom sheet navigation
- Collapsible sections
- Simplified progress indicator (vertical)
- Floating CTAs (sticky footer)
- Full-width cards

**Tablet (640px - 1024px):**
- 2-column layouts for forms
- Side drawer navigation
- Horizontal progress stepper (scrollable)
- Card grids (2 columns)
- Inline CTAs

**Desktop (1024px+):**
- 3-column layouts (sidebar + main + detail panel)
- Persistent sidebar navigation
- Full horizontal progress stepper
- Card grids (3-4 columns)
- Inline help panels
- Rich hover states and tooltips

### Component Responsive Behavior

**OnboardingProgressStepper:**
- Desktop: Full horizontal stepper with labels
- Tablet: Horizontal stepper with abbreviated labels
- Mobile: Collapsible vertical stepper, current step expanded

**Forms:**
- Desktop: 2-column layouts for related fields
- Tablet: 2-column for short fields (city, state, zip)
- Mobile: Single column, full width inputs

**Navigation:**
- Desktop: Persistent sidebar with merchant status, support panel
- Tablet: Collapsible sidebar
- Mobile: Bottom sheet or hamburger menu

**Modals:**
- Desktop: Centered modal (max-width: 600px)
- Tablet: Full-width modal with margins
- Mobile: Full-screen modal or bottom sheet

---

## Design Tokens (Tailwind CSS)

### Configuration Recommendations

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          300: '#60A5FA',
          500: '#2563EB',
          700: '#1E3A5F',
          900: '#0A1E3D',
        },
        // ... (full color palette)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        // Extends default Tailwind spacing scale
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
}
```

### Border Radius Guidelines
```
Small (sm): 4px - Badges, tags, small buttons
Medium (md): 6px - Inputs, small cards
Large (lg): 8px - Buttons, cards, modals
Extra Large (xl): 12px - Large cards, feature sections
2XL: 16px - Hero sections, major containers
```

### Elevation (Shadows)
```
Level 0 (None): Flat elements, backgrounds
Level 1 (card): Default cards, inputs
Level 2 (card-hover): Hover states, active cards
Level 3 (modal): Modals, popovers, dropdowns
Level 4 (toast): Toasts, tooltips, floating elements
```

---

## Animation & Motion

### Timing Functions
```
Ease Out: cubic-bezier(0, 0, 0.2, 1) - Default for entrances
Ease In: cubic-bezier(0.4, 0, 1, 1) - Exits
Ease In-Out: cubic-bezier(0.4, 0, 0.2, 1) - Transitions
```

### Duration Guidelines
```
Fast: 150ms - Hover states, simple transitions
Base: 200ms - Default transitions, fades
Moderate: 300ms - Panel slides, complex transitions
Slow: 500ms - Page transitions, celebrations
```

### Motion Patterns

**Micro-interactions:**
- Button press: Scale 0.98 on active, 150ms ease-out
- Checkbox/Radio: Checkmark draw-in animation, 200ms
- Toast entrance: Slide in from top-right, 300ms ease-out
- Loading spinner: Continuous rotate, 1000ms linear

**Page Transitions:**
- Step advance: Slide left (current) + fade in (next), 300ms
- Step back: Slide right (current) + fade in (previous), 300ms
- Modal open: Fade in backdrop + scale up content (0.95 → 1), 200ms
- Modal close: Reverse, 150ms

**Progress Indicators:**
- Progress bar fill: Ease-out animation, 500ms
- Step completion: Check icon draw + color change, 300ms
- Celebration: Confetti burst + scale pulse (1 → 1.1 → 1), 600ms

**Guidelines:**
- Respect `prefers-reduced-motion` for accessibility
- Avoid unnecessary motion on form interactions
- Use motion to guide attention (e.g., draw eye to next step)
- Celebrate milestones with meaningful animation

---

## Brand Expression

### Voice & Tone

**Merchant-Facing Content:**
- **Clear & Direct** - Avoid jargon, explain technical terms
- **Encouraging & Supportive** - "You're almost there!" not "Complete remaining tasks"
- **Professional but Friendly** - Approachable expertise
- **Transparent** - Honest about timelines, costs, requirements

**Admin Tools (AE/IC):**
- **Efficient & Professional** - Information-dense, action-oriented
- **Empowering** - Tools to make their jobs easier
- **Data-Driven** - Surface insights, not just raw data

### Writing Guidelines

**Button Labels:**
- Use action verbs: "Continue to Payment" not "Next"
- Be specific: "Schedule AE Call" not "Schedule"
- Avoid ambiguity: "Save and Continue" vs. "Save Draft"

**Form Instructions:**
- Lead with "why": "We need your EIN to verify your business for payment processing"
- Provide examples: "e.g., 12-3456789"
- Use positive language: "Enter your business name" not "Don't forget your business name"

**Error Messages:**
- Explain the problem: "Email address is required" not "Invalid input"
- Provide solution: "Enter a valid EIN in the format 12-3456789"
- Use human language: "We couldn't find that email" not "Error 404"

**Success Messages:**
- Celebrate wins: "Hardware is on the way! Expected delivery: Oct 15"
- Set expectations: "We'll verify your bank account in 1-2 business days"
- Provide next steps: "While you wait, you can set up your first product"

---

## Accessibility Foundation

**Standards Compliance:**
- WCAG 2.1 Level AA minimum
- Keyboard navigable (all interactive elements)
- Screen reader tested (NVDA, JAWS, VoiceOver)
- Color contrast ratios meet AA standards

**Quick Reference:**
- Text contrast: 4.5:1 minimum (normal text), 3:1 (large text 18px+)
- Interactive element size: 44x44px minimum touch target
- Focus indicators: Visible 2px outline, Primary 500 color
- Form labels: Explicit `<label>` association, not placeholder-only
- Alt text: Meaningful descriptions for all images/icons

*Full accessibility guidelines in `accessibility.md`*

---

## Design Deliverables Roadmap

### Phase 1 (Current)
- Core component library setup
- Design tokens configuration
- Basic layout templates

### Phase 2
- Merchant dashboard high-fidelity mockups
- AE/IC dashboard designs
- Interactive prototypes

### Phase 3
- Micro-interaction specifications
- Empty state illustrations
- Celebration animations

### Phase 4
- Mobile app designs (if applicable)
- Advanced data visualizations
- A/B test variant designs

---

## Resources & Links

**Design Files:**
- Figma: [Link to design system file]
- Component Library: [Link to Storybook when available]

**Development:**
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- Lucide Icons: https://lucide.dev/

**Accessibility:**
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- A11y Project: https://www.a11yproject.com/

---

**Document Status:** Phase 1 Foundation Complete
**Next Review:** After developer implementation feedback
**Owner:** Design Lead, Merchant Onboarding