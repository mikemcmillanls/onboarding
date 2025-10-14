# Visual Layout Reference

This document provides ASCII art diagrams and visual references to help developers understand the layout structure of the Lightspeed merchant dashboard.

---

## Desktop Layout (>1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD LAYOUT (Desktop)                               │
└────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────────────────────────────────────────────────────────────┐
│              │                                                                     │
│   SIDEBAR    │                      MAIN CONTENT AREA                             │
│   (280px)    │                     (Container: max-w-6xl)                         │
│   Fixed      │                                                                     │
│              │  ┌───────────────────────────────────────────────────────────┐    │
│  ┌────────┐  │  │                                                           │    │
│  │   [L]  │  │  │              HERO SECTION                                 │    │
│  │  Logo  │  │  │       (Black background: #111827)                         │    │
│  └────────┘  │  │                                                           │    │
│              │  │   "Get set up to check out customers"                     │    │
│ Mike's Coffee│  │   Complete these tasks to start accepting payments...    │    │
│    Shop      │  │                                                           │    │
│              │  └───────────────────────────────────────────────────────────┘    │
│  [Search...] │                                                                     │
│              │  ┌───────────────────────────────────────────────────────────┐    │
│ [🏠] Home ●  │  │           PROGRESS INDICATOR                              │    │
│ [ ] POS Setup│  │                                                           │    │
│ [ ] Hardware │  │   3 of 6 tasks completed                           50%    │    │
│ [ ] Bank     │  │   [████████████████░░░░░░░░░░░░░░░░░░░░]                 │    │
│ [ ] Settings │  │                                                           │    │
│              │  └───────────────────────────────────────────────────────────┘    │
│              │                                                                     │
│              │  ┌───────────────────────────────────────────────────────────┐    │
│     ───      │  │  [✓]  CHECKLIST CARD 1                        [Required]  │    │
│              │  │                                                           │    │
│  [?] Help    │  │       Business Verification                               │    │
│  [🔔] Notify │  │       Complete KYB verification to accept payments        │    │
│  [👤] Profile│  │                                                           │    │
│              │  │       [Start] button                                      │    │
│              │  └───────────────────────────────────────────────────────────┘    │
│              │                                                                     │
│              │  ┌───────────────────────────────────────────────────────────┐    │
│              │  │  [⏱]  CHECKLIST CARD 2                        [Required]  │    │
│              │  │                                                           │    │
│              │  │       POS Configuration                                   │    │
│              │  │       Set up your point of sale system and locations      │    │
│              │  │                                                           │    │
│              │  │       [Continue] button                                   │    │
│              │  └───────────────────────────────────────────────────────────┘    │
│              │                                                                     │
│              │  ┌───────────────────────────────────────────────────────────┐    │
│              │  │  [○]  CHECKLIST CARD 3 (Disabled)             [Required]  │    │
│              │  │                                                           │    │
│              │  │       Hardware Selection                                  │    │
│              │  │       Choose and order your POS hardware                  │    │
│              │  │                                                           │    │
│              │  │       [Start] button (disabled)                           │    │
│              │  └───────────────────────────────────────────────────────────┘    │
│              │                                                                     │
│              │  ... (more cards)                                                  │
│              │                                                                     │
└──────────────┴─────────────────────────────────────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD LAYOUT (Tablet)                                │
└────────────────────────────────────────────────────────────────────────────────────┘

┌──────────┬─────────────────────────────────────────────────────────────────────────┐
│          │                                                                         │
│ SIDEBAR  │                    MAIN CONTENT AREA                                   │
│ (240px)  │                   (Reduced padding)                                    │
│ Toggle   │                                                                         │
│          │  ┌─────────────────────────────────────────────────────────────┐      │
│ [☰] Show │  │                                                             │      │
│          │  │         HERO SECTION (Slightly smaller)                     │      │
│ OR       │  │                                                             │      │
│          │  └─────────────────────────────────────────────────────────────┘      │
│ [Sidebar]│                                                                         │
│ [Visible]│  ┌─────────────────────────────────────────────────────────────┐      │
│          │  │        PROGRESS INDICATOR                                   │      │
│          │  └─────────────────────────────────────────────────────────────┘      │
│          │                                                                         │
│          │  ┌─────────────────────────────────────────────────────────────┐      │
│          │  │  CHECKLIST CARD (Full width, single column)                 │      │
│          │  └─────────────────────────────────────────────────────────────┘      │
│          │                                                                         │
│          │  ┌─────────────────────────────────────────────────────────────┐      │
│          │  │  CHECKLIST CARD                                             │      │
│          │  └─────────────────────────────────────────────────────────────┘      │
│          │                                                                         │
└──────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD LAYOUT (Mobile)                             │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    MOBILE HEADER (Fixed top)                         │  │
│  │                                                                      │  │
│  │  [☰]  [L] Lightspeed                             [🔔] [👤]         │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                      │  │
│  │             HERO SECTION                                            │  │
│  │        (Reduced padding: 32px)                                      │  │
│  │                                                                      │  │
│  │  Get set up to check out customers                                  │  │
│  │  Complete these tasks to start...                                   │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │      PROGRESS INDICATOR                                             │  │
│  │                                                                      │  │
│  │  3 of 6 tasks completed                                        50%  │  │
│  │  [████████████████░░░░░░░░░░░░░░░░]                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  [Icon]                                          [Required]         │  │
│  │                                                                      │  │
│  │  Business Verification                                              │  │
│  │  Complete KYB verification to accept payments                       │  │
│  │                                                                      │  │
│  │  [          Start          ] (Full width button)                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  [Icon]                                          [Required]         │  │
│  │                                                                      │  │
│  │  POS Configuration                                                  │  │
│  │  Set up your point of sale system and locations                     │  │
│  │                                                                      │  │
│  │  [        Continue         ] (Full width button)                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  (More cards scroll below...)                                              │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


SIDEBAR OVERLAY (When [☰] clicked):

┌────────────────────────────────────────────────────────────────────────────┐
│ [Backdrop: Black 50% opacity]                                              │
│                                                                            │
│  ┌─────────────────────────┐                                              │
│  │ SIDEBAR DRAWER          │                                              │
│  │ (280px, slides from left│                                              │
│  │                         │                                              │
│  │  [×] Close button       │                                              │
│  │                         │                                              │
│  │  [L] Lightspeed         │                                              │
│  │  Mike's Coffee Shop     │                                              │
│  │                         │                                              │
│  │  [Search...]            │                                              │
│  │                         │                                              │
│  │  [🏠] Home              │                                              │
│  │  [ ] POS Setup          │                                              │
│  │  [ ] Hardware           │                                              │
│  │  [ ] Bank Setup         │                                              │
│  │  [ ] Settings           │                                              │
│  │                         │                                              │
│  │  (Footer at bottom)     │                                              │
│  │  [?] [🔔] [👤]          │                                              │
│  └─────────────────────────┘                                              │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Checklist Card States

### Not Started

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [○]  Card Title                                   [Required] Badge  │
│                                                                      │
│       Description text explaining what this task involves.          │
│       Can be 1-2 lines of text.                                     │
│                                                                      │
│       [    Start    ] Red button                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Colors:
- Background: White
- Border: Gray (#E5E7EB)
- Shadow: shadow-sm
- Badge: Red background (#DC2626) or Gray (Optional)
- Button: Red (#DC2626)

Hover Effect:
- Shadow: shadow-md
- Border: Red (#DC2626)
- Transform: translateY(-2px)
```

### In Progress

```
┌──────────────────────────────────────────────────────────────────────┐
│ Blue left border (3px)                                               │
│  [⏱]  Card Title                                   [Required] Badge  │
│                                                                      │
│       Description text explaining what this task involves.          │
│       Can be 1-2 lines of text.                                     │
│                                                                      │
│       [  Continue   ] Red button                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Colors:
- Background: White
- Border: Gray + Blue left border (#3B82F6)
- Icon: Blue clock
- Button: Red (#DC2626)
```

### Completed

```
┌──────────────────────────────────────────────────────────────────────┐
│ Green gradient background                                            │
│  [✓]  Card Title                                   [✓ Completed]     │
│       Green checkmark icon                         Green badge       │
│                                                                      │
│       Description text explaining what this task involves.          │
│       Can be 1-2 lines of text.                                     │
│                                                                      │
│       [✓ Completed ] Outline button (disabled)                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Colors:
- Background: Green gradient (from-green-50 to-white)
- Border: Green (#10B981)
- Icon: Green checkmark
- Badge: Green background (#D1FAE5)
- Button: Green outline (disabled)

No Hover Effect (not interactive)
```

### Disabled

```
┌──────────────────────────────────────────────────────────────────────┐
│ 60% opacity                                                          │
│  [○]  Card Title                                   [Required] Badge  │
│       Gray icon                                                      │
│                                                                      │
│       Description text explaining what this task involves.          │
│       Can be 1-2 lines of text.                                     │
│                                                                      │
│       [    Start    ] Gray button (disabled)                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

Colors:
- Entire card: 60% opacity
- Cursor: not-allowed

No Hover Effect
Blocked by prerequisite task (e.g., Business Verification)
```

---

## Sidebar Component Details

### Desktop Sidebar

```
┌─────────────────────────┐
│                         │ ← Top padding: 24px
│  ┌────┐  Lightspeed     │ ← Logo section
│  │ L  │  POS & Payments │
│  └────┘                 │
│                         │
│  Mike's Coffee Shop     │ ← Business name (dynamic)
│                         │
│  ┌───────────────────┐  │
│  │ 🔍 Search...      │  │ ← Search bar
│  └───────────────────┘  │
│                         │ ← Border separator
│ ─────────────────────── │
│                         │
│  🏠  Home          ●    │ ← Active indicator (red dot)
│  ⚙   POS Setup         │
│  🛒  Hardware & Checkout│
│  💳  Bank Setup         │
│  ⚙   Settings          │
│                         │
│  (Spacer - auto margin) │
│                         │
│ ─────────────────────── │ ← Bottom border
│                         │
│  [?]  [🔔]  [👤]        │ ← Footer icons
│                         │
└─────────────────────────┘ ← Bottom padding: 20px

Dimensions:
- Width: 280px (fixed)
- Height: 100vh
- Background: #1F2937 (gray-800)
- Text: #F9FAFB (gray-50)
- z-index: 1000
```

### Sidebar Navigation Item

```
┌─────────────────────────┐
│  🏠  Home               │ ← Default state
└─────────────────────────┘

┌─────────────────────────┐
│  🏠  Home               │ ← Hover state (gray-700 bg)
└─────────────────────────┘

┌─────────────────────────┐█ ← Red right border (3px)
│  🏠  Home          ●    │ ← Active state (red bg tint + red text)
└─────────────────────────┘

Padding: 12px vertical, 20px horizontal
Gap between icon and text: 12px
Font: 15px, weight 500
Transition: 150ms all
```

---

## Hero Section Breakdown

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ← Padding: 48px vertical, 32px horizontal                              │
│                                                                          │
│  Get set up to check out customers                                      │
│  ↑ H1: 36px, Bold, White text, -0.02em letter-spacing                   │
│                                                                          │
│  Complete these tasks to start accepting payments and managing          │
│  your business with Lightspeed.                                         │
│  ↑ Description: 18px, Regular, Gray-400 text                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Background: #111827 (gray-900)
Border-radius: 12px (--radius-xl)
Margin-bottom: 32px

Responsive:
- Desktop: 48px vertical padding
- Tablet: 40px vertical padding
- Mobile: 32px vertical padding, smaller font sizes
```

---

## Progress Indicator Breakdown

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  3 of 6 tasks completed                                            50%  │
│  ↑ Text: 16px, Semibold                                  ↑ 24px, Bold   │
│                                                                          │
│  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│  ← Progress bar: height 8px, rounded-full                               │
│     Filled: Red-Orange gradient                                         │
│     Empty: Gray-200 background                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Animation:
- Width animates on change
- Duration: 400ms
- Easing: ease-in-out
- Initial: 0% width
- Final: Calculated percentage

Margin-bottom: 32px
```

---

## Button States Visual Reference

### Primary Button (Start / Continue)

**Default:**
```
┌──────────────┐
│    Start     │
└──────────────┘
Background: #DC2626 (Red)
Text: White
Padding: 12px vertical, 24px horizontal
Border-radius: 8px
Shadow: shadow-xs
```

**Hover:**
```
┌──────────────┐
│    Start     │ ← Slightly elevated (translateY -1px)
└──────────────┘
Background: #B91C1C (Darker red)
Shadow: shadow-sm (increased)
```

**Active (Pressed):**
```
┌──────────────┐
│    Start     │
└──────────────┘
Background: #991B1B (Darkest red)
Transform: none (back to original position)
```

**Disabled:**
```
┌──────────────┐
│    Start     │ ← 50% opacity
└──────────────┘
Cursor: not-allowed
No hover effects
```

### Completed Button (Outline)

```
┌──────────────┐
│ ✓ Completed  │
└──────────────┘
Background: Transparent
Border: 1px solid #10B981 (Green)
Text: #10B981 (Green)
Cursor: default (not clickable)
```

---

## Status Badge Visual Reference

### Required Badge

```
┌─────────────┐
│  REQUIRED   │
└─────────────┘
Background: #DC2626 (Red)
Text: White
Padding: 4px vertical, 12px horizontal
Border-radius: 6px
Font: 12px, Semibold, Uppercase, 0.05em letter-spacing
```

### Optional Badge

```
┌─────────────┐
│  OPTIONAL   │
└─────────────┘
Background: #F9FAFB (Gray-50)
Border: 1px solid #E5E7EB (Gray-200)
Text: #6B7280 (Gray-500)
Padding: 4px vertical, 12px horizontal
Border-radius: 6px
Font: 12px, Semibold, Uppercase, 0.05em letter-spacing
```

### Completed Badge

```
┌─────────────┐
│ ✓ COMPLETED │
└─────────────┘
Background: #D1FAE5 (Green-100)
Text: #10B981 (Green-500)
Padding: 4px vertical, 12px horizontal
Border-radius: 6px
Font: 12px, Semibold, Uppercase, 0.05em letter-spacing
Checkmark icon before text
```

---

## Z-Index Layer System

```
Layer 0 (Ground):           z-index: 0
  - Background
  - Base content

Layer 1 (Surface):          z-index: 1
  - Checklist cards at rest
  - Static content

Layer 2 (Elevated):         z-index: 10
  - Cards on hover
  - Buttons

Layer 3 (Floating):         z-index: 100
  - Dropdowns
  - Popovers

Layer 4 (Modal):            z-index: 1000
  - Sidebar (desktop)
  - Modals
  - Dialogs

Layer 5 (Overlay):          z-index: 10000
  - Tooltips
  - Toasts
  - Critical notifications
```

---

## Spacing Visual Guide

```
Component Internal Spacing:

Card:
┌────────────────────────────┐
│ ← 24px                     │ ↑ 24px padding
│                            │
│  [Icon]  ← 20px gap → Content
│                            │
│  Title                     │
│  ↓ 12px gap                │
│  Description               │
│  ↓ 12px gap                │
│  [Button]                  │
│                            │
│                      24px→ │ ↓ 24px padding
└────────────────────────────┘

Section Spacing:
Hero Section
     ↓ 32px gap
Progress Indicator
     ↓ 32px gap
Checklist Grid
     ↓ 16px gap between cards
Card 1
     ↓ 16px gap
Card 2
     ↓ 16px gap
Card 3
```

---

## Icon Sizes Reference

```
Extra Small:  16px × 16px  [✓] Small badges
Small:        20px × 20px  [🔍] Buttons, inline text
Medium:       24px × 24px  [🏠] Sidebar, default size
Large:        32px × 32px  [Icon] Card headers
Extra Large:  48px × 48px  [💡] Empty states, hero
```

---

## Color Swatches with Use Cases

```
┌────────┐
│        │ #DC2626 - Primary Red
│ ████   │ Use: Primary buttons, active states, required badges
└────────┘

┌────────┐
│        │ #1F2937 - Sidebar Background (Gray-800)
│ ████   │ Use: Sidebar, hero section backgrounds
└────────┘

┌────────┐
│        │ #F9FAFB - Light Background (Gray-50)
│ ████   │ Use: Page background, secondary surfaces
└────────┘

┌────────┐
│        │ #FFFFFF - White
│ ████   │ Use: Card backgrounds, text on dark backgrounds
└────────┘

┌────────┐
│        │ #10B981 - Success Green
│ ████   │ Use: Completed states, success messages
└────────┘

┌────────┐
│        │ #6B7280 - Muted Gray
│ ████   │ Use: Secondary text, descriptions, optional badges
└────────┘
```

---

## Animation Sequences

### Card Entrance (Stagger)

```
Timeline:

0ms:     Card 1 appears (opacity 0→1, y 20→0)
100ms:   Card 2 appears
200ms:   Card 3 appears
300ms:   Card 4 appears
400ms:   Card 5 appears
500ms:   Card 6 appears

Each transition: 300ms duration, ease-out
```

### Progress Bar Fill

```
Timeline:

0ms:     Width at 0%
400ms:   Width reaches target (e.g., 50%)

Easing: ease-in-out
Gradient shifts slightly during animation
```

### Button Hover

```
Timeline:

0ms:     Default state
150ms:   Hover state reached
         - Background darkens
         - Shadow increases
         - translateY(-1px)

On mouseout:
0ms:     Hover state
150ms:   Back to default
```

### Sidebar Mobile Slide-In

```
Timeline:

Click [☰]:
0ms:     Backdrop opacity 0, Sidebar x: -280px
300ms:   Backdrop opacity 1, Sidebar x: 0px
         Easing: Spring (damping: 30, stiffness: 300)

Click [×] or backdrop:
0ms:     Visible state
300ms:   Hidden state
         Backdrop fades out, Sidebar slides left
```

---

## Responsive Breakpoint Visualization

```
Mobile             Tablet              Desktop             Wide
<───────────────>  <─────────────────> <─────────────────> <───────────────>
0px    640px    768px      1024px    1280px      1536px    1920px

│                │                   │                   │
│  Full-width    │  Single column    │  Sidebar visible  │  Max-width
│  cards         │  Sidebar toggle   │  280px sidebar    │  constrained
│  Mobile header │  Reduced padding  │  Generous padding │  centered
│  Sidebar       │                   │                   │  content
│  overlay       │                   │                   │
│                │                   │                   │

Text Scaling:
Hero: 28px         32px               36px               36px
H1:   24px         28px               30px               30px
H2:   20px         22px               24px               24px
```

---

## Common Patterns Quick Reference

### Card with Icon, Title, Badge, Description, Button

```typescript
<ChecklistCard>
  <Icon />                    {/* 48×48px in colored circle */}
  <Content>
    <Header>
      <Title />               {/* 20px semibold */}
      <StatusBadge />        {/* Required/Optional/Completed */}
    </Header>
    <Description />          {/* 16px regular gray */}
    <Button />              {/* Red primary or green outline */}
  </Content>
</ChecklistCard>
```

### Sidebar Structure

```typescript
<Sidebar>
  <Header>
    <Logo />
    <BusinessName />
    <SearchBar />
  </Header>
  <Nav>
    <NavItem active />
    <NavItem />
    ...
  </Nav>
  <Footer>
    <IconButton icon="help" />
    <IconButton icon="notifications" />
    <IconButton icon="profile" />
  </Footer>
</Sidebar>
```

### Progress Indicator

```typescript
<ProgressIndicator>
  <Header>
    <Text>3 of 6 tasks completed</Text>
    <Percentage>50%</Percentage>
  </Header>
  <ProgressBar>
    <Fill width="50%" />
  </ProgressBar>
</ProgressIndicator>
```

---

## Accessibility Overlay

```
Visual Focus Indicators:

Default (no focus):
┌──────────────┐
│    Button    │
└──────────────┘

Focused (keyboard navigation):
┌──────────────┐
│    Button    │ ← 2px red outline, 2px offset
└──────────────┘
  └──────────┘ ← Focus ring

Screen Reader Regions:

<header role="banner">
  Sidebar navigation
</header>

<main role="main" id="main-content">
  Dashboard content
</main>

Skip Link:
[Skip to main content] ← Visible only on focus, top-left
```

---

This visual reference provides a comprehensive guide to the layout structure, component states, and responsive behavior of the Lightspeed merchant dashboard. Use these diagrams alongside the detailed specifications in DASHBOARD_DESIGN_SYSTEM.md for implementation.

**Version:** 1.0
**Last Updated:** 2025-10-10
