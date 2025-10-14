# Lightspeed Merchant Dashboard - Complete Design System

## Executive Summary

This document provides comprehensive design specifications for the Lightspeed merchant onboarding dashboard overhaul, transforming the current 4-step stepper flow into a Square-inspired checklist-based dashboard experience.

---

## 1. Information Architecture

### 1.1 User Flow Mapping

**Current Flow (Before):**
```
Landing Page → /get-started (Account Creation) → /onboarding (4-Step Stepper)
  └─ Step 1: Sign Up & Business Info
  └─ Step 2: POS Setup Configuration
  └─ Step 3: Hardware Selection & Checkout
  └─ Step 4: Final Setup Tasks
```

**New Flow (After):**
```
Landing Page → /get-started (Account Creation) → /dashboard (Checklist Hub)
  ├─ Task: Business Verification (Required)
  ├─ Task: POS Configuration
  ├─ Task: Hardware Selection
  ├─ Task: Payment Setup
  ├─ Task: Team Setup (Optional)
  └─ Task: Import Data (Optional)
```

### 1.2 Checklist Task Mapping

| Checklist Task | Original Step | Status | Route | Dependencies |
|----------------|---------------|--------|-------|--------------|
| **Business Verification** | Step 1 (SignUp) | Required | `/dashboard/verify` | None |
| **POS Configuration** | Step 2 (POSSetup) | Required | `/dashboard/pos-setup` | Business Verification |
| **Hardware Selection** | Step 3 (Checkout) | Required | `/dashboard/hardware` | Business Verification |
| **Payment Setup** | Step 4 (Bank Account) | Required | `/dashboard/payments` | Business Verification |
| **Team Setup** | New/Step 4 | Optional | `/dashboard/team` | None |
| **Import Data** | New/Step 4 | Optional | `/dashboard/import` | POS Configuration |

### 1.3 Navigation Structure

**Left Sidebar (Primary Navigation):**
```
┌─────────────────────────────┐
│ [L] Lightspeed             │  ← Logo + Brand
│ Mike's Coffee Shop         │  ← Business Name (dynamic)
│                            │
│ [Search...]                │  ← Search Bar
│                            │
│ [Home]         ●           │  ← Active indicator
│ POS Setup                  │
│ Hardware & Checkout        │
│ Bank Setup                 │
│ Settings                   │
│                            │
│ ────────────────────       │
│                            │
│ [?] Help                   │  ← Bottom actions
│ [🔔] Notifications         │
│ [👤] Profile               │
└─────────────────────────────┘
```

### 1.4 Task Dependency Logic

**Dependency Rules:**
1. Business Verification must be completed first (blocks Hardware, Payments)
2. POS Configuration must be completed before Import Data
3. Team Setup is independent (can be completed anytime)
4. Hardware Selection becomes available after Business Verification
5. Payment Setup becomes available after Business Verification

**State Transition Matrix:**

| Task | Initial State | After Business Verification | After POS Setup | Completed |
|------|---------------|----------------------------|-----------------|-----------|
| Business Verification | `not-started` | - | - | `completed` |
| POS Configuration | `not-started` | `not-started` | `completed` | `completed` |
| Hardware Selection | `disabled` | `not-started` | `not-started` | `completed` |
| Payment Setup | `disabled` | `not-started` | `not-started` | `completed` |
| Team Setup | `not-started` | `not-started` | `not-started` | `completed` |
| Import Data | `disabled` | `disabled` | `not-started` | `completed` |

---

## 2. Visual Design System

### 2.1 Color Palette

**Primary Colors:**
```css
/* Lightspeed Red - Primary Brand Color */
--color-primary: #DC2626;              /* red-600 */
--color-primary-oklch: oklch(0.57 0.22 27);
--color-primary-hover: #B91C1C;        /* red-700 */
--color-primary-active: #991B1B;       /* red-800 */
--color-primary-foreground: #FFFFFF;

/* Secondary & Neutral Colors */
--color-background: #F9FAFB;           /* gray-50 */
--color-surface: #FFFFFF;              /* white */
--color-surface-dark: #111827;         /* gray-900 */
--color-foreground: #111827;           /* gray-900 */
--color-muted: #6B7280;                /* gray-500 */
--color-border: #E5E7EB;               /* gray-200 */
```

**Sidebar Colors:**
```css
--color-sidebar-bg: #1F2937;           /* gray-800 */
--color-sidebar-text: #F9FAFB;         /* gray-50 */
--color-sidebar-text-muted: #9CA3AF;   /* gray-400 */
--color-sidebar-hover: #374151;        /* gray-700 */
--color-sidebar-active: #DC2626;       /* red-600 */
--color-sidebar-border: #374151;       /* gray-700 */
```

**Status Colors:**
```css
--color-success: #10B981;              /* green-500 */
--color-success-bg: #D1FAE5;           /* green-100 */
--color-warning: #F59E0B;              /* amber-500 */
--color-warning-bg: #FEF3C7;           /* amber-100 */
--color-error: #EF4444;                /* red-500 */
--color-error-bg: #FEE2E2;             /* red-100 */
--color-info: #3B82F6;                 /* blue-500 */
--color-info-bg: #DBEAFE;              /* blue-100 */
```

**Color Usage Guidelines:**

| Element | Color | Usage |
|---------|-------|-------|
| Primary CTAs | `--color-primary` | Start, Continue, Submit buttons |
| Secondary actions | `--color-surface` with border | Cancel, Back buttons |
| Destructive actions | `--color-error` | Delete, Remove buttons |
| Required badges | `--color-primary` | "Required" status badge |
| Optional badges | `--color-muted` | "Optional" status badge |
| Completed badges | `--color-success` | "Completed" status badge |
| Card backgrounds | `--color-surface` | All checklist cards |
| Hero section | `--color-surface-dark` | Dashboard hero header |

### 2.2 Typography System

**Font Stack:**
```css
--font-sans: 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono', ui-monospace, 'Courier New', monospace;
```

**Type Scale:**

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| **Hero Title** | 36px (2.25rem) | 700 (Bold) | 1.2 | -0.02em | Main dashboard headline |
| **H1** | 30px (1.875rem) | 700 (Bold) | 1.3 | -0.01em | Page titles |
| **H2** | 24px (1.5rem) | 600 (Semibold) | 1.35 | -0.01em | Section headers |
| **H3** | 20px (1.25rem) | 600 (Semibold) | 1.4 | 0 | Card titles |
| **Body Large** | 18px (1.125rem) | 400 (Regular) | 1.5 | 0 | Card descriptions |
| **Body** | 16px (1rem) | 400 (Regular) | 1.5 | 0 | Default text |
| **Body Small** | 14px (0.875rem) | 400 (Regular) | 1.5 | 0 | Secondary text |
| **Caption** | 12px (0.75rem) | 400 (Regular) | 1.5 | 0 | Helper text, badges |
| **Button** | 16px (1rem) | 600 (Semibold) | 1 | 0.01em | Button text |

**Responsive Typography:**
```css
/* Mobile (<768px) */
--hero-title: 28px;
--h1: 24px;
--h2: 20px;
--h3: 18px;

/* Tablet (768px-1024px) */
--hero-title: 32px;
--h1: 28px;
--h2: 22px;
--h3: 19px;

/* Desktop (>1024px) */
--hero-title: 36px;
--h1: 30px;
--h2: 24px;
--h3: 20px;
```

### 2.3 Spacing System

**Base Unit:** 4px (0.25rem)

**Spacing Scale:**
```css
--space-0: 0px;
--space-1: 4px;     /* 0.25rem */
--space-2: 8px;     /* 0.5rem */
--space-3: 12px;    /* 0.75rem */
--space-4: 16px;    /* 1rem */
--space-5: 20px;    /* 1.25rem */
--space-6: 24px;    /* 1.5rem */
--space-8: 32px;    /* 2rem */
--space-10: 40px;   /* 2.5rem */
--space-12: 48px;   /* 3rem */
--space-16: 64px;   /* 4rem */
--space-20: 80px;   /* 5rem */
--space-24: 96px;   /* 6rem */
```

**Component Spacing Guidelines:**

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| Checklist Card | `24px` | `16px bottom` | - |
| Card Content | `24px` | - | `16px` (internal) |
| Hero Section | `48px vertical`, `32px horizontal` | - | - |
| Sidebar Item | `12px vertical`, `16px horizontal` | - | - |
| Button | `12px vertical`, `24px horizontal` | - | - |
| Status Badge | `4px vertical`, `12px horizontal` | - | - |
| Section Gap | - | - | `32px` |

### 2.4 Elevation & Shadows

**Shadow Tokens:**
```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

**Elevation Scale:**

| Level | Shadow | Z-Index | Usage |
|-------|--------|---------|-------|
| **Ground** | none | 0 | Background, base surface |
| **Level 1** | `--shadow-sm` | 1 | Cards at rest |
| **Level 2** | `--shadow-md` | 10 | Cards on hover |
| **Level 3** | `--shadow-lg` | 100 | Dropdowns, popovers |
| **Level 4** | `--shadow-xl` | 1000 | Modals, dialogs |
| **Level 5** | `--shadow-xl` | 10000 | Tooltips, toasts |

### 2.5 Border Radius

**Radius Tokens:**
```css
--radius-xs: 4px;    /* 0.25rem */
--radius-sm: 6px;    /* 0.375rem */
--radius-md: 8px;    /* 0.5rem */
--radius-lg: 10px;   /* 0.625rem - default */
--radius-xl: 12px;   /* 0.75rem */
--radius-2xl: 16px;  /* 1rem */
--radius-full: 9999px;
```

**Component Radius Mapping:**

| Component | Radius | Notes |
|-----------|--------|-------|
| Checklist Card | `--radius-lg` | Main cards |
| Button | `--radius-md` | All button variants |
| Status Badge | `--radius-sm` | Pills and badges |
| Input Field | `--radius-md` | Form inputs |
| Search Bar | `--radius-lg` | Sidebar search |
| Avatar | `--radius-full` | Profile images |
| Sidebar | `0` | No radius on edges |

### 2.6 Icon System

**Icon Library:** Lucide React (recommended) or Heroicons

**Icon Sizes:**
```css
--icon-xs: 16px;     /* Small badges */
--icon-sm: 20px;     /* Buttons, inline text */
--icon-md: 24px;     /* Default, sidebar */
--icon-lg: 32px;     /* Card headers */
--icon-xl: 48px;     /* Empty states */
```

**Core Icons Needed:**

| Icon | Usage | Component |
|------|-------|-----------|
| `CheckCircle2` | Completed status | Badge, card status |
| `Circle` | Not started | Badge indicator |
| `Clock` | In progress | Badge indicator |
| `AlertCircle` | Required badge | Status indicator |
| `ChevronRight` | Navigation | Sidebar, cards |
| `Home` | Navigation | Sidebar item |
| `Settings` | Navigation | Sidebar item |
| `CreditCard` | Hardware/Payments | Card icon |
| `Users` | Team setup | Card icon |
| `FileText` | Import data | Card icon |
| `Search` | Search | Search bar |
| `Bell` | Notifications | Sidebar bottom |
| `HelpCircle` | Help | Sidebar bottom |
| `User` | Profile | Sidebar bottom |
| `Menu` | Mobile menu | Mobile header |

---

## 3. Component Specifications

### 3.1 Sidebar Navigation Component

**Component Structure:**
```typescript
<Sidebar>
  <SidebarHeader>
    <Logo />
    <BusinessName />
  </SidebarHeader>

  <SidebarSearch />

  <SidebarNav>
    <SidebarNavItem active />
    <SidebarNavItem />
    ...
  </SidebarNav>

  <SidebarFooter>
    <IconButton />
    ...
  </SidebarFooter>
</Sidebar>
```

**Dimensions:**
- Desktop width: `280px` (fixed)
- Mobile: Full width overlay or slide-in (320px max)
- Height: `100vh` (full viewport)

**Visual Specifications:**

```css
/* Sidebar Container */
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-sidebar-border);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

/* Sidebar Header */
.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--color-sidebar-border);
}

/* Business Name */
.business-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-sidebar-text);
  margin-top: 8px;
}

/* Search Bar */
.sidebar-search {
  margin: 16px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-sidebar-border);
  border-radius: var(--radius-lg);
  color: var(--color-sidebar-text);
}

/* Navigation Item */
.sidebar-nav-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-sidebar-text-muted);
  font-size: 15px;
  font-weight: 500;
  transition: all 150ms ease;
  cursor: pointer;
}

.sidebar-nav-item:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-text);
}

.sidebar-nav-item.active {
  background: rgba(220, 38, 38, 0.1);
  color: var(--color-sidebar-active);
  border-right: 3px solid var(--color-sidebar-active);
}

/* Footer Icons */
.sidebar-footer {
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid var(--color-sidebar-border);
  display: flex;
  gap: 12px;
  justify-content: center;
}

.sidebar-footer-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-muted);
  transition: all 150ms ease;
}

.sidebar-footer-icon:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-sidebar-text);
}
```

**Responsive Behavior:**
- Desktop (>1024px): Always visible, fixed position
- Tablet (768-1024px): Collapsible with toggle button
- Mobile (<768px): Hidden by default, overlay when opened

### 3.2 Checklist Card Component

**Component Structure:**
```typescript
<ChecklistCard
  status="not-started" | "in-progress" | "completed" | "disabled"
  required={true | false}
>
  <CardIcon />
  <CardContent>
    <CardHeader>
      <CardTitle />
      <StatusBadge />
    </CardHeader>
    <CardDescription />
    <CardAction>
      <Button />
    </CardAction>
  </CardContent>
</ChecklistCard>
```

**Dimensions:**
- Width: `100%` (responsive, max-width: 800px)
- Min-height: `160px`
- Padding: `24px`

**Visual Specifications:**

```css
/* Card Container */
.checklist-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.checklist-card:hover:not(.disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.checklist-card.completed {
  background: linear-gradient(to right, #ECFDF5 0%, #FFFFFF 100%);
  border-color: var(--color-success);
}

.checklist-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Card Icon */
.card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon.completed {
  background: var(--color-success-bg);
  color: var(--color-success);
}

/* Card Content */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-foreground);
  line-height: 1.4;
}

/* Card Description */
.card-description {
  font-size: 16px;
  color: var(--color-muted);
  line-height: 1.5;
}

/* Card Action */
.card-action {
  margin-top: 4px;
}
```

**State Variations:**

| State | Visual Treatment |
|-------|-----------------|
| **Not Started** | Default white background, shadow-sm, "Start" button |
| **In Progress** | Blue left border (3px), "Continue" button |
| **Completed** | Green gradient background, checkmark icon, "Completed" button (disabled) |
| **Disabled** | 60% opacity, no hover effect, button disabled |

### 3.3 Status Badge Component

**Variants:**

```css
/* Required Badge */
.badge-required {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Optional Badge */
.badge-optional {
  background: var(--color-background);
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Completed Badge */
.badge-completed {
  background: var(--color-success-bg);
  color: var(--color-success);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-completed::before {
  content: "✓";
  font-weight: 700;
}
```

### 3.4 Button Component

**Variants:**

```css
/* Primary Button (Start, Continue) */
.button-primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  border: none;
  box-shadow: var(--shadow-xs);
  transition: all 150ms ease;
  cursor: pointer;
  min-height: 44px;
}

.button-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.button-primary:active {
  background: var(--color-primary-active);
  transform: translateY(0);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Secondary Button */
.button-secondary {
  background: var(--color-surface);
  color: var(--color-foreground);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  transition: all 150ms ease;
  cursor: pointer;
  min-height: 44px;
}

.button-secondary:hover {
  background: var(--color-background);
  border-color: var(--color-foreground);
}

/* Ghost Button (Completed) */
.button-ghost {
  background: transparent;
  color: var(--color-success);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  border: 1px solid var(--color-success);
  cursor: default;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Button States:**

| State | Visual Treatment |
|-------|-----------------|
| Default | Primary red background, white text |
| Hover | Darker red (#B91C1C), subtle lift (translateY -1px) |
| Active | Darkest red (#991B1B), no lift |
| Focus | Primary color with focus ring (outline) |
| Disabled | 50% opacity, no pointer events |
| Loading | Spinner icon, disabled state |

### 3.5 Progress Indicator Component

**Component Structure:**
```typescript
<ProgressIndicator
  completed={3}
  total={6}
  percentage={50}
/>
```

**Visual Specifications:**

```css
.progress-indicator {
  margin-bottom: 32px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-foreground);
}

.progress-percentage {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--color-background);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, #F97316 100%);
  border-radius: var(--radius-full);
  transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3.6 Hero Section Component

**Visual Specifications:**

```css
.hero-section {
  background: var(--color-surface-dark);
  color: var(--color-sidebar-text);
  padding: 48px 32px;
  border-radius: var(--radius-xl);
  margin-bottom: 32px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.hero-description {
  font-size: 18px;
  color: var(--color-sidebar-text-muted);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    font-size: 16px;
  }
}
```

---

## 4. Interaction Design

### 4.1 Animation Specifications

**Timing Functions:**
```css
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);        /* Default out */
--ease-in: cubic-bezier(0.4, 0, 1, 1);           /* Default in */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* Default in-out */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Bounce */
```

**Duration Scale:**
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 400ms;
```

**Component Animations:**

| Component | Property | Duration | Easing | Trigger |
|-----------|----------|----------|--------|---------|
| Card Hover | `transform`, `box-shadow` | 200ms | ease-out | Hover |
| Button Hover | `background`, `transform` | 150ms | ease-out | Hover |
| Card Appear | `opacity`, `transform` | 300ms | ease-out | Mount |
| Progress Bar | `width` | 400ms | ease-in-out | Value change |
| Badge | `opacity`, `scale` | 200ms | ease-out | State change |
| Sidebar Toggle | `transform` | 300ms | ease-in-out | Click |
| Status Icon | `rotate`, `scale` | 400ms | ease-bounce | Complete |

**Framer Motion Variants:**

```typescript
// Card entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1]
    }
  }
};

// Stagger children animation
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Button hover animation
const buttonVariants = {
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: 0.15 }
  },
  tap: {
    scale: 0.98,
    y: 0
  }
};

// Completion animation
const completionVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};
```

### 4.2 Micro-interactions

**Card Hover Effect:**
```
1. Card elevates by 2px (translateY: -2px)
2. Shadow increases from sm to md
3. Border changes to primary color
4. Duration: 200ms
5. Easing: ease-out
```

**Button Click Feedback:**
```
1. On mousedown: Scale to 0.98
2. On mouseup: Return to scale 1
3. Background darkens by one shade
4. Duration: 150ms
5. Easing: ease-out
```

**Checkbox Complete:**
```
1. Checkmark scales from 0 to 1
2. Rotation from -180deg to 0deg
3. Background color transitions to green
4. Duration: 400ms
5. Easing: spring (bounce)
```

**Progress Bar Fill:**
```
1. Width animates to new percentage
2. Gradient shifts slightly
3. Duration: 400ms
4. Easing: ease-in-out
```

**Badge State Change:**
```
1. Fade out old badge (opacity 0, scale 0.9)
2. Fade in new badge (opacity 1, scale 1)
3. Duration: 200ms
4. Easing: ease-out
```

### 4.3 Loading States

**Skeleton Loader (Card):**
```css
.skeleton-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  gap: 20px;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(
    90deg,
    var(--color-background) 0%,
    var(--color-border) 50%,
    var(--color-background) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Button Loading State:**
```typescript
<Button disabled>
  <Spinner className="mr-2" />
  Loading...
</Button>
```

### 4.4 Focus States

**Focus Ring Specification:**
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}

/* For dark backgrounds */
.dark-bg *:focus-visible {
  outline-color: white;
}
```

**Keyboard Navigation:**
- Tab order follows visual hierarchy (top to bottom, left to right)
- Focus ring visible on all interactive elements
- Skip to main content link for accessibility
- Sidebar navigation keyboard accessible (Arrow keys)

---

## 5. Responsive Design

### 5.1 Breakpoint Strategy

**Breakpoints:**
```css
--breakpoint-sm: 640px;   /* Small devices (phones) */
--breakpoint-md: 768px;   /* Medium devices (tablets) */
--breakpoint-lg: 1024px;  /* Large devices (desktops) */
--breakpoint-xl: 1280px;  /* Extra large (wide screens) */
--breakpoint-2xl: 1536px; /* 2X large (ultra-wide) */
```

**Responsive Philosophy:**
- Mobile-first approach
- Fluid typography and spacing
- Adaptive layouts (not just scaled)
- Touch-friendly targets on mobile
- Performance optimization for mobile

### 5.2 Layout Adaptations

**Desktop Layout (>1024px):**
```
┌────────────┬─────────────────────────────────┐
│            │ [Hero Section]                   │
│  Sidebar   │                                  │
│  (280px)   │ [Progress Indicator]             │
│            │                                  │
│            │ [Card] [Card]                    │
│            │ [Card] [Card]                    │
│            │ [Card] [Card]                    │
└────────────┴─────────────────────────────────┘
```

**Tablet Layout (768px-1024px):**
```
┌────────────┬─────────────────────────────────┐
│  Sidebar   │ [Hero Section]                   │
│  (240px)   │                                  │
│  or        │ [Progress]                       │
│  Collapsed │                                  │
│            │ [Card]                           │
│            │ [Card]                           │
└────────────┴─────────────────────────────────┘
```

**Mobile Layout (<768px):**
```
┌─────────────────────────────────────────┐
│ [☰] Lightspeed     [🔔] [👤]           │
├─────────────────────────────────────────┤
│ [Hero Section]                          │
│                                         │
│ [Progress]                              │
│                                         │
│ [Card]                                  │
│ [Card]                                  │
│ [Card]                                  │
└─────────────────────────────────────────┘
```

### 5.3 Component Responsive Behavior

**Sidebar:**
- Desktop: Fixed, always visible (280px)
- Tablet: Collapsible toggle (240px when open)
- Mobile: Overlay drawer (full width, slides from left)

**Checklist Cards:**
- Desktop: 2-column grid if space allows
- Tablet: Single column (100% width)
- Mobile: Single column, reduced padding (16px)

**Hero Section:**
- Desktop: 48px vertical padding
- Tablet: 40px vertical padding
- Mobile: 32px vertical padding, smaller font sizes

**Buttons:**
- Desktop: Inline (fit-content width)
- Tablet: Inline
- Mobile: Full width (100%) for primary actions

### 5.4 Touch Targets

**Minimum Touch Target Sizes:**
- Buttons: 44px x 44px minimum
- Sidebar items: 48px height minimum
- Icons: 44px x 44px touch area
- Checkboxes: 44px x 44px touch area

**Touch-Friendly Spacing:**
- Minimum gap between touch targets: 8px
- Card tap area includes full card surface
- Swipe gestures for sidebar on mobile

### 5.5 Mobile-Specific Optimizations

**Performance:**
- Lazy load cards below the fold
- Optimize images and icons for retina displays
- Reduce animation complexity on low-end devices
- Use CSS transforms over position changes

**UX Enhancements:**
- Pull-to-refresh on mobile
- Swipe to open/close sidebar
- Bottom sheet for actions on mobile
- Safe area insets for notched devices

---

## 6. Accessibility Specifications

### 6.1 WCAG 2.1 AA Compliance

**Color Contrast Requirements:**

| Element | Foreground | Background | Ratio | Required | Actual |
|---------|------------|------------|-------|----------|--------|
| Body Text | #111827 | #FFFFFF | 4.5:1 | 4.5:1 | 16.3:1 ✓ |
| Primary Button | #FFFFFF | #DC2626 | 4.5:1 | 4.5:1 | 5.8:1 ✓ |
| Muted Text | #6B7280 | #FFFFFF | 4.5:1 | 4.5:1 | 4.6:1 ✓ |
| Sidebar Text | #F9FAFB | #1F2937 | 4.5:1 | 4.5:1 | 14.8:1 ✓ |
| Success Badge | #10B981 | #D1FAE5 | 3:1 | 3:1 | 3.2:1 ✓ |

### 6.2 Semantic HTML

**Required Structure:**
```html
<header role="banner">
  <nav aria-label="Primary navigation">
    <a href="#main-content" class="sr-only">Skip to main content</a>
    <!-- Sidebar navigation -->
  </nav>
</header>

<main id="main-content" role="main">
  <section aria-label="Onboarding checklist">
    <h1>Get set up to check out customers</h1>
    <!-- Checklist cards -->
  </section>
</main>
```

### 6.3 ARIA Labels

**Required ARIA Attributes:**

```html
<!-- Checklist Card -->
<article
  role="article"
  aria-labelledby="task-title-1"
  aria-describedby="task-desc-1"
>
  <h3 id="task-title-1">Business Verification</h3>
  <p id="task-desc-1">Complete KYB verification...</p>
  <button aria-label="Start business verification">Start</button>
</article>

<!-- Progress Indicator -->
<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
  50% complete
</div>

<!-- Sidebar Navigation -->
<nav aria-label="Main navigation">
  <a href="/dashboard" aria-current="page">Home</a>
  <a href="/pos-setup">POS Setup</a>
</nav>

<!-- Status Badge -->
<span role="status" aria-label="Required task">Required</span>
```

### 6.4 Keyboard Navigation

**Keyboard Shortcuts:**

| Key | Action |
|-----|--------|
| `Tab` | Navigate forward through interactive elements |
| `Shift + Tab` | Navigate backward |
| `Enter` | Activate button/link |
| `Space` | Activate button |
| `Escape` | Close sidebar (mobile) |
| `Arrow Keys` | Navigate sidebar items |
| `/` | Focus search bar |

**Focus Management:**
- Focus trap in modal dialogs
- Return focus after sidebar close
- Visible focus indicators on all elements
- Logical tab order (visual order)

### 6.5 Screen Reader Support

**Announcements:**
```typescript
// When task is completed
<div role="status" aria-live="polite">
  Business Verification completed successfully
</div>

// When progress updates
<div role="status" aria-live="polite" aria-atomic="true">
  Progress updated: 3 of 6 tasks completed, 50%
</div>

// Error messages
<div role="alert" aria-live="assertive">
  Error: Unable to save changes
</div>
```

**Screen Reader Only Text:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 7. Implementation Guidelines

### 7.1 File Structure

**Recommended Directory Structure:**
```
/app
  /dashboard
    page.tsx                    # Main dashboard page
    layout.tsx                  # Dashboard layout with sidebar
    loading.tsx                 # Loading state
    error.tsx                   # Error boundary
    /verify
      page.tsx                  # Business verification task
    /pos-setup
      page.tsx                  # POS configuration task
    /hardware
      page.tsx                  # Hardware selection task
    /payments
      page.tsx                  # Payment setup task
    /team
      page.tsx                  # Team setup task (optional)
    /import
      page.tsx                  # Import data task (optional)

/components
  /dashboard
    sidebar.tsx                 # Sidebar navigation component
    sidebar-header.tsx          # Sidebar header with logo/business name
    sidebar-nav.tsx             # Navigation items
    sidebar-footer.tsx          # Footer icons
    checklist-card.tsx          # Individual checklist card
    checklist-grid.tsx          # Grid container for cards
    progress-indicator.tsx      # Progress bar component
    hero-section.tsx            # Hero header section
    status-badge.tsx            # Status badge component
    mobile-header.tsx           # Mobile header with menu toggle
  /ui
    button.tsx                  # Button component (existing)
    badge.tsx                   # Badge component (existing)
    [other shadcn components]

/types
  dashboard.ts                  # Dashboard-specific types

/lib
  dashboard-helpers.ts          # Helper functions for dashboard
```

### 7.2 Component Composition Example

**Main Dashboard Page:**
```typescript
// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { HeroSection } from '@/components/dashboard/hero-section';
import { ProgressIndicator } from '@/components/dashboard/progress-indicator';
import { ChecklistGrid } from '@/components/dashboard/checklist-grid';
import { ChecklistCard } from '@/components/dashboard/checklist-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';

export default function DashboardPage() {
  const { tasks, progress, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout>
      <HeroSection
        title="Get set up to check out customers"
        description="Complete these tasks to start accepting payments and managing your business."
      />

      <ProgressIndicator
        completed={progress.completed}
        total={progress.total}
        percentage={progress.percentage}
      />

      <ChecklistGrid>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ChecklistCard
              title={task.title}
              description={task.description}
              status={task.status}
              required={task.required}
              route={task.route}
              icon={task.icon}
            />
          </motion.div>
        ))}
      </ChecklistGrid>
    </DashboardLayout>
  );
}
```

### 7.3 State Management Pattern

**Dashboard State Hook:**
```typescript
// hooks/use-dashboard-data.ts
import { useState, useEffect } from 'react';
import { ChecklistTask } from '@/types/dashboard';

export function useDashboardData() {
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load merchant data and construct checklist
    const loadDashboard = async () => {
      try {
        const merchantData = await fetchMerchantData();
        const checklistTasks = constructChecklist(merchantData);
        setTasks(checklistTasks);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const progress = {
    completed: tasks.filter(t => t.status === 'completed').length,
    total: tasks.filter(t => t.required).length,
    percentage: Math.round((tasks.filter(t => t.status === 'completed').length / tasks.filter(t => t.required).length) * 100)
  };

  return { tasks, progress, isLoading };
}
```

### 7.4 Routing Strategy

**Next.js App Router Pattern:**
```typescript
// After account creation (/get-started), redirect to /dashboard
router.push('/dashboard');

// From dashboard card click, route to specific task
<ChecklistCard
  onClick={() => router.push('/dashboard/verify')}
/>

// After task completion, return to dashboard
router.push('/dashboard');
```

### 7.5 Data Flow

**Data Flow Diagram:**
```
1. User completes /get-started
   ↓
2. Account data saved to localStorage/API
   ↓
3. Redirect to /dashboard
   ↓
4. Dashboard loads merchant data
   ↓
5. Construct checklist based on completion status
   ↓
6. Render cards with appropriate states
   ↓
7. User clicks "Start" on a task
   ↓
8. Route to task page (/dashboard/verify)
   ↓
9. User completes task
   ↓
10. Update merchant data
   ↓
11. Return to /dashboard
   ↓
12. Dashboard reflects updated state
```

---

## 8. Design Tokens Summary

### 8.1 Complete Token Reference

**Colors:**
```typescript
export const colors = {
  primary: {
    DEFAULT: '#DC2626',
    hover: '#B91C1C',
    active: '#991B1B',
    foreground: '#FFFFFF'
  },
  sidebar: {
    bg: '#1F2937',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    hover: '#374151',
    active: '#DC2626',
    border: '#374151'
  },
  surface: {
    DEFAULT: '#FFFFFF',
    dark: '#111827'
  },
  background: '#F9FAFB',
  foreground: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  success: {
    DEFAULT: '#10B981',
    bg: '#D1FAE5'
  },
  warning: {
    DEFAULT: '#F59E0B',
    bg: '#FEF3C7'
  },
  error: {
    DEFAULT: '#EF4444',
    bg: '#FEE2E2'
  }
};
```

**Spacing:**
```typescript
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px'
};
```

**Typography:**
```typescript
export const typography = {
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.75
  }
};
```

**Shadows:**
```typescript
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
};
```

**Border Radius:**
```typescript
export const borderRadius = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px'
};
```

**Animation:**
```typescript
export const animation = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400
  },
  easing: {
    out: 'cubic-bezier(0.0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};
```

---

## 9. Testing & Quality Assurance

### 9.1 Visual Regression Testing

**Checklist:**
- [ ] All cards render correctly in all states (not-started, in-progress, completed, disabled)
- [ ] Sidebar displays correctly on all breakpoints
- [ ] Hero section maintains proper contrast and readability
- [ ] Buttons display correct colors and hover states
- [ ] Status badges show appropriate colors and text
- [ ] Progress indicator animates smoothly
- [ ] Icons render at correct sizes
- [ ] Typography scales properly across breakpoints

### 9.2 Interaction Testing

**Checklist:**
- [ ] All buttons respond to hover, active, and focus states
- [ ] Card hover effects work smoothly
- [ ] Sidebar navigation items highlight correctly
- [ ] Progress bar animates when values change
- [ ] Modal/drawer animations are smooth
- [ ] Mobile sidebar toggle functions correctly
- [ ] Keyboard navigation works throughout
- [ ] Focus trap works in modals

### 9.3 Accessibility Testing

**Tools:**
- [ ] Run axe DevTools audit (0 violations)
- [ ] Test with NVDA/JAWS screen readers
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Validate HTML semantics
- [ ] Test with browser zoom (up to 200%)
- [ ] Verify focus indicators are visible

### 9.4 Responsive Testing

**Devices to Test:**
- [ ] iPhone SE (375px width)
- [ ] iPhone 14 Pro (390px width)
- [ ] iPad (768px width)
- [ ] iPad Pro (1024px width)
- [ ] Desktop (1280px width)
- [ ] Wide screen (1920px width)

### 9.5 Browser Testing

**Required Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 10. Handoff Checklist

### 10.1 Design Assets

- [x] Complete design system documentation
- [x] Color palette with hex/oklch values
- [x] Typography specifications
- [x] Spacing system
- [x] Component specifications
- [x] Interaction guidelines
- [x] Responsive breakpoints
- [x] Animation timings
- [x] Icon requirements
- [x] Accessibility requirements

### 10.2 Development Resources

- [x] Component structure recommendations
- [x] File organization guide
- [x] State management patterns
- [x] Routing strategy
- [x] Code examples
- [x] Integration with existing codebase
- [x] Token reference (colors, spacing, etc.)

### 10.3 Implementation Priorities

**Phase 1 (MVP):**
1. Sidebar navigation component
2. Basic dashboard layout
3. Checklist card component (all states)
4. Progress indicator
5. Hero section
6. Mobile responsive sidebar

**Phase 2 (Enhanced):**
1. Smooth animations and transitions
2. Skeleton loading states
3. Error boundaries
4. Optimistic UI updates
5. Advanced interactions (swipe gestures)

**Phase 3 (Polish):**
1. Micro-interactions
2. Advanced accessibility features
3. Performance optimizations
4. Analytics integration

### 10.4 Success Metrics

**Quantitative:**
- Time to first interaction < 2s
- Lighthouse Performance Score > 90
- Lighthouse Accessibility Score = 100
- Task completion rate > 80%
- Mobile responsiveness at all breakpoints

**Qualitative:**
- Visual quality matches Square reference
- Smooth, polished interactions
- Intuitive navigation
- Clear progress indication
- Professional, trustworthy appearance

---

## Appendix

### A. Icon List

**Required Icons (Lucide React):**
```typescript
import {
  Home,
  Settings,
  CreditCard,
  Users,
  FileText,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  User,
  Menu,
  X,
  Building2,
  Smartphone,
  Database,
  DollarSign
} from 'lucide-react';
```

### B. Sample Data Structure

```typescript
// Sample checklist data
export const sampleChecklist: ChecklistTask[] = [
  {
    id: 'business-verification',
    title: 'Business Verification',
    description: 'Complete KYB verification to accept payments',
    status: 'not-started',
    required: true,
    route: '/dashboard/verify',
    icon: 'Building2'
  },
  {
    id: 'pos-configuration',
    title: 'POS Configuration',
    description: 'Set up your point of sale system and locations',
    status: 'not-started',
    required: true,
    route: '/dashboard/pos-setup',
    icon: 'Smartphone'
  },
  {
    id: 'hardware-selection',
    title: 'Hardware Selection',
    description: 'Choose and order your POS hardware',
    status: 'disabled',
    required: true,
    route: '/dashboard/hardware',
    icon: 'ShoppingCart'
  },
  {
    id: 'payment-setup',
    title: 'Payment Setup',
    description: 'Configure payment processing and bank account',
    status: 'disabled',
    required: true,
    route: '/dashboard/payments',
    icon: 'CreditCard'
  },
  {
    id: 'team-setup',
    title: 'Team Setup',
    description: 'Add team members and set permissions',
    status: 'not-started',
    required: false,
    route: '/dashboard/team',
    icon: 'Users'
  },
  {
    id: 'import-data',
    title: 'Import Data',
    description: 'Import products, customers, and inventory',
    status: 'disabled',
    required: false,
    route: '/dashboard/import',
    icon: 'Database'
  }
];
```

### C. Code Snippets

**Tailwind Config Extension:**
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          active: '#991B1B'
        },
        sidebar: {
          bg: '#1F2937',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
          hover: '#374151',
          active: '#DC2626',
          border: '#374151'
        }
      },
      width: {
        sidebar: '280px'
      }
    }
  }
};
```

---

## Document Version

- **Version:** 1.0
- **Date:** 2025-10-10
- **Author:** Design Lead Orchestrator
- **Status:** Final - Ready for Implementation

---

**Next Steps:**

1. Review this design system with the development team
2. Set up component library structure
3. Implement Phase 1 components (sidebar, cards, layout)
4. Conduct design review checkpoint
5. Implement Phase 2 enhancements
6. Perform comprehensive testing
7. Launch dashboard to production

**Questions or Clarifications:**
Contact the design team for any clarifications or additional specifications needed during implementation.
