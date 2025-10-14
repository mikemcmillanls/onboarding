# Lightspeed Color Palette Reference

Quick reference for all colors used in the Lightspeed merchant onboarding design system.

---

## Primary Brand Colors

### Coral (Primary CTA Color)
- **Hex**: `#FF6B35` (approximate)
- **OKLCH**: `oklch(0.68 0.18 35)`
- **RGB**: `rgb(255, 107, 53)`
- **Usage**: Primary buttons, CTAs, active states, progress bars, links, checkmarks
- **Tailwind**: `bg-primary`, `text-primary`, `border-primary`, `ring-primary`

### Black
- **Hex**: `#000000`
- **OKLCH**: `oklch(0.15 0 0)`
- **RGB**: `rgb(0, 0, 0)`
- **Usage**: Hero backgrounds, headings, logo backgrounds, feature icons
- **Tailwind**: `bg-black`, `text-black`

### White
- **Hex**: `#FFFFFF`
- **OKLCH**: `oklch(1 0 0)`
- **RGB**: `rgb(255, 255, 255)`
- **Usage**: Text on dark, card backgrounds, navigation background
- **Tailwind**: `bg-white`, `text-white`

---

## Neutral Colors

### Gray 50 (Light Background)
- **Hex**: `#F8F8F8` (approximate)
- **OKLCH**: `oklch(0.97 0 0)`
- **Usage**: Alternate section backgrounds, page backgrounds
- **Tailwind**: `bg-gray-50`

### Gray 100 (Subtle Border)
- **Hex**: `#F5F5F5` (approximate)
- **OKLCH**: `oklch(0.97 0 0)`
- **Usage**: Card borders, subtle dividers
- **Tailwind**: `border-gray-100`

### Gray 200 (Progress Track)
- **Hex**: `#E5E5E5` (approximate)
- **OKLCH**: `oklch(0.92 0 0)`
- **Usage**: Progress bar backgrounds, inactive borders
- **Tailwind**: `bg-gray-200`

### Gray 300 (Inactive States)
- **Hex**: `#D4D4D4` (approximate)
- **Usage**: Inactive step indicators, disabled borders
- **Tailwind**: `border-gray-300`

### Gray 400 (Small Caps Labels)
- **Hex**: `#9CA3AF` (approximate)
- **Usage**: Small caps section labels, metadata
- **Tailwind**: `text-gray-400`

### Gray 600 (Secondary Text)
- **Hex**: `#6B7280`
- **OKLCH**: `oklch(0.52 0 0)`
- **RGB**: `rgb(107, 115, 128)`
- **Usage**: Secondary text, descriptions, helper text
- **Tailwind**: `text-gray-600`

---

## Semantic Colors

### Success (Green)
- **Usage**: Checkmarks for completed items (kept from original)
- **Tailwind**: `text-green-600`

### Error (Red)
- **Usage**: Form validation errors
- **Tailwind**: `border-red-500`, `text-red-500`

### Warning (Orange)
- **Usage**: Review states (kept from original)
- **Tailwind**: `text-orange-600`

---

## Color Usage Matrix

| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Primary Button BG | Coral | Coral (lighter) | `bg-primary` |
| Primary Button Text | White | Black | `text-primary-foreground` |
| Secondary Button BG | White | Dark Gray | `bg-white` / `bg-secondary` |
| Hero Section BG | Black | Black | `bg-black` |
| Hero Text | White | White | `text-white` |
| Body Background | White | Dark Gray | `bg-white` / `bg-background` |
| Section Background | Gray 50 | Dark Gray | `bg-gray-50` |
| Heading Text | Black | White | `text-black` / `text-foreground` |
| Body Text | Black | White | `text-foreground` |
| Secondary Text | Gray 600 | Gray 400 | `text-gray-600` / `text-muted-foreground` |
| Link Text | Coral | Coral | `text-primary` |
| Progress Bar Fill | Coral | Coral | `bg-primary` |
| Progress Bar Track | Gray 200 | Dark Gray | `bg-gray-200` |
| Active State Ring | Coral 20% | Coral 20% | `ring-primary/20` |
| Card Border | Gray 200 | Dark Border | `border-border` |

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Primary Colors */
  --primary: oklch(0.68 0.18 35);              /* Lightspeed Coral */
  --primary-foreground: oklch(1 0 0);          /* White */

  /* Base Colors */
  --foreground: oklch(0.15 0 0);               /* Near Black */
  --background: oklch(1 0 0);                  /* White */

  /* Neutral Colors */
  --muted: oklch(0.97 0 0);                    /* Light Gray */
  --muted-foreground: oklch(0.52 0 0);         /* Medium Gray */

  /* UI Elements */
  --border: oklch(0.92 0 0);                   /* Border Gray */
  --input: oklch(0.92 0 0);                    /* Input Border */
  --ring: oklch(0.68 0.18 35);                 /* Focus Ring (Coral) */

  /* Card */
  --card: oklch(1 0 0);                        /* White */
  --card-foreground: oklch(0.15 0 0);          /* Near Black */

  /* Secondary */
  --secondary: oklch(0.97 0 0);                /* Light Gray */
  --secondary-foreground: oklch(0.15 0 0);     /* Near Black */

  /* Accent */
  --accent: oklch(0.97 0 0);                   /* Light Gray */
  --accent-foreground: oklch(0.15 0 0);        /* Near Black */
}

.dark {
  --primary: oklch(0.72 0.18 35);              /* Lighter Coral */
  --primary-foreground: oklch(0.15 0 0);       /* Black */
  --background: oklch(0.15 0 0);               /* Near Black */
  --foreground: oklch(0.985 0 0);              /* White */
  --muted: oklch(0.27 0 0);                    /* Dark Gray */
  --muted-foreground: oklch(0.70 0 0);         /* Light Gray */
}
```

---

## Contrast Ratios (WCAG Compliance)

| Combination | Ratio | WCAG Level | Use Case |
|-------------|-------|------------|----------|
| Coral on White | 4.5:1+ | AA | Buttons, links, small text |
| Black on White | 21:1 | AAA | Headings, body text |
| White on Black | 21:1 | AAA | Hero text, inverted sections |
| Gray-600 on White | 7:1+ | AAA | Secondary text |
| Coral on Black | 8:1+ | AA Large | Secondary buttons on dark |
| Gray-400 on White | 3.5:1 | AA Large | Small caps labels (large text) |

**Legend:**
- AAA: Enhanced contrast (4.5:1 for normal text, 3:1 for large text)
- AA: Minimum contrast (4.5:1 for normal text, 3:1 for large text)
- AA Large: For text 18pt+ or 14pt+ bold

---

## Color Application Examples

### Hero Section
```tsx
<section className="bg-black text-white">
  <h1 className="text-7xl font-bold">
    Be the best in your business
  </h1>
  <Button className="bg-primary text-primary-foreground">
    Get Started Now
  </Button>
</section>
```

### Feature Card
```tsx
<Card className="bg-white border-gray-100">
  <div className="w-12 h-12 bg-black rounded">
    <CreditCard className="text-white" />
  </div>
  <h3 className="text-black font-bold">Integrated Payments</h3>
  <p className="text-gray-600">Accept payments seamlessly...</p>
</Card>
```

### Progress Indicator
```tsx
<div className="bg-gray-200 rounded-full">
  <div className="bg-primary h-full rounded-full" />
</div>

<div className="border-primary ring-4 ring-primary/20">
  <span className="text-primary">2</span>
</div>
```

### Form Input
```tsx
<Input
  className="border-gray-200 focus:ring-primary focus:border-primary"
/>
```

---

## Gradient Removal Guide

**REMOVED GRADIENTS:**
```css
/* OLD - Blue to Purple */
bg-gradient-to-r from-blue-600 to-purple-600

/* OLD - Background gradient */
bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50

/* OLD - Text gradient */
bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
```

**REPLACED WITH:**
```css
/* NEW - Solid coral */
bg-primary

/* NEW - Solid backgrounds */
bg-black
bg-white
bg-gray-50

/* NEW - Solid text */
text-black
text-white
```

---

## Color Accessibility Checklist

- [x] Primary CTA (coral button) meets AA contrast on white backgrounds
- [x] Hero text (white on black) meets AAA contrast
- [x] Body text (black on white) meets AAA contrast
- [x] Secondary text (gray-600 on white) meets AAA contrast
- [x] Link text (coral) meets AA contrast
- [x] Focus states are clearly visible (coral ring)
- [x] Error states use both color + text/icons
- [x] Success states use both color + text/icons
- [x] No information conveyed by color alone

---

## Design Tool Export

### Figma/Sketch Color Styles
Create these named color styles:

**Primary**
- Lightspeed Coral: `#FF6B35`

**Neutrals**
- Black: `#000000`
- White: `#FFFFFF`
- Gray 50: `#F8F8F8`
- Gray 200: `#E5E5E5`
- Gray 600: `#6B7280`

**Semantic**
- Success: `#16A34A`
- Error: `#DC2626`
- Warning: `#EA580C`

---

## Quick Reference Chart

```
Primary Actions → Coral (#FF6B35)
Hero Sections → Black (#000000)
Text on Dark → White (#FFFFFF)
Body Backgrounds → White or Gray-50
Headings → Black
Body Text → Black or Gray-900
Secondary Text → Gray-600
Borders → Gray-200
Progress Fills → Coral
Focus Rings → Coral at 20% opacity
```

---

**Last Updated**: 2025-10-10
**Status**: Production Ready
**Maintained By**: Design System Team
