# Lightspeed Design System

Complete design system reference for the Lightspeed Merchant Onboarding application.

---

## Brand Identity

### Core Principles

1. **Clarity First** - Every element should have a clear purpose
2. **Minimal & Bold** - Black, white, and strategic color accents
3. **Professional** - Enterprise-grade visual language
4. **Accessible** - WCAG AA compliant throughout

---

## Color Palette

### Primary Colors

**Black (Primary)**
- `#000000` - Primary text, headers, navigation
- `rgb(0, 0, 0)`
- Usage: Main brand color, high-emphasis text

**White (Surface)**
- `#FFFFFF` - Backgrounds, cards, surfaces
- `rgb(255, 255, 255)`
- Usage: Primary background, card surfaces

### Accent Colors

**Primary Blue**
- `#0066FF` - Primary actions, links
- `rgb(0, 102, 255)`
- Tailwind: `blue-600`
- Usage: Primary buttons, links, active states

**Success Green**
- `#059669` - Success states, completed actions
- `rgb(5, 150, 105)`
- Tailwind: `green-600`
- Usage: Success messages, completed steps

**Warning Amber**
- `#D97706` - Warnings, alerts
- `rgb(217, 119, 6)`
- Tailwind: `amber-600`
- Usage: Warning messages, attention needed

**Error Red**
- `#DC2626` - Errors, destructive actions
- `rgb(220, 38, 38)`
- Tailwind: `red-600`
- Usage: Error messages, validation failures

### Neutral Grays

**Gray Scale**
- `gray-50`: `#F9FAFB` - Subtle backgrounds
- `gray-100`: `#F3F4F6` - Card backgrounds
- `gray-200`: `#E5E7EB` - Borders
- `gray-300`: `#D1D5DB` - Dividers
- `gray-400`: `#9CA3AF` - Disabled text
- `gray-500`: `#6B7280` - Secondary text
- `gray-600`: `#4B5563` - Body text
- `gray-700`: `#374151` - Emphasized text
- `gray-800`: `#1F2937` - High-emphasis text
- `gray-900`: `#111827` - Headers (alternative to black)

### Cohort-Specific Colors

**Self-Serve Cohort**
- Primary: `blue-500` (#3B82F6)
- Background: `blue-50` (#EFF6FF)
- Border: `blue-300` (#93C5FD)

**Assisted Cohort**
- Primary: `purple-500` (#8B5CF6)
- Background: `purple-50` (#F5F3FF)
- Border: `purple-300` (#C4B5FD)

**Managed Cohort**
- Primary: `amber-500` (#F59E0B)
- Background: `amber-50` (#FFFBEB)
- Border: `amber-300` (#FCD34D)

---

## Typography

### Font Families

**Primary Font: Geist Sans**
```css
font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Monospace Font: Geist Mono**
```css
font-family: 'Geist Mono', 'SF Mono', Monaco, monospace;
```

### Font Sizes

| Size | Rem | Pixels | Usage |
|------|-----|--------|-------|
| `text-xs` | 0.75rem | 12px | Fine print, labels |
| `text-sm` | 0.875rem | 14px | Secondary text, captions |
| `text-base` | 1rem | 16px | Body text (default) |
| `text-lg` | 1.125rem | 18px | Large body, subheadings |
| `text-xl` | 1.25rem | 20px | Section titles |
| `text-2xl` | 1.5rem | 24px | Card headings |
| `text-3xl` | 1.875rem | 30px | Page titles |
| `text-4xl` | 2.25rem | 36px | Hero headings |
| `text-5xl` | 3rem | 48px | Marketing hero |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text, buttons |
| `font-semibold` | 600 | Subheadings |
| `font-bold` | 700 | Headers, strong emphasis |

### Line Heights

| Class | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headers |
| `leading-snug` | 1.375 | Subheadings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.625 | Marketing copy |

---

## Spacing

### Scale

Tailwind spacing scale (1 unit = 0.25rem = 4px):

| Class | Rem | Pixels | Usage |
|-------|-----|--------|-------|
| `1` | 0.25rem | 4px | Tight spacing |
| `2` | 0.5rem | 8px | Small gaps |
| `3` | 0.75rem | 12px | Compact spacing |
| `4` | 1rem | 16px | Standard spacing |
| `6` | 1.5rem | 24px | Section spacing |
| `8` | 2rem | 32px | Large gaps |
| `12` | 3rem | 48px | Major sections |
| `16` | 4rem | 64px | Hero spacing |

### Component Spacing Patterns

**Cards**
- Padding: `p-6` (24px)
- Gap between: `gap-4` (16px)

**Sections**
- Margin between: `mb-8` or `mb-12` (32px-48px)
- Container padding: `px-6` (24px)

**Forms**
- Label-input gap: `mb-2` (8px)
- Field gap: `mb-4` (16px)
- Form section gap: `mb-8` (32px)

---

## Layout

### Containers

**Max Widths**
- `max-w-7xl` (1280px) - Main content container
- `max-w-4xl` (896px) - Reading content
- `max-w-2xl` (672px) - Narrow forms

**Breakpoints**
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Grid System

**Standard Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

**Dashboard Layout**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">{/* Sidebar */}</div>
  <div className="lg:col-span-2">{/* Main content */}</div>
</div>
```

---

## Components

### Buttons

**Primary Button**
```jsx
<button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
  Primary Action
</button>
```

**Secondary Button**
```jsx
<button className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
  Secondary Action
</button>
```

**Sizes**
- Small: `px-4 py-2 text-sm`
- Medium: `px-6 py-3 text-base` (default)
- Large: `px-8 py-4 text-lg`

### Cards

**Standard Card**
```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  {/* Content */}
</div>
```

**Hover Card**
```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
  {/* Content */}
</div>
```

### Badges

**Status Badges**
```jsx
{/* Success */}
<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
  Completed
</span>

{/* Warning */}
<span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
  Pending
</span>

{/* Error */}
<span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
  Failed
</span>
```

### Forms

**Input Field**
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Field Label
  </label>
  <input
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter value..."
  />
</div>
```

**Select Dropdown**
```jsx
<select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

## Animations

### Transitions

**Standard Transition**
```jsx
className="transition-colors duration-200"
```

**Common Patterns**
- Hover states: `hover:bg-gray-50 transition-colors`
- Shadow changes: `hover:shadow-lg transition-shadow`
- Scale effects: `hover:scale-105 transition-transform`

### Framer Motion Patterns

{% raw %}
**Fade In**
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

**Slide Up**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* Content */}
</motion.div>
```

**Staggered Children**
```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```
{% endraw %}

---

## Icons

**Library**: Lucide React

**Sizes**
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Extra Large: `w-8 h-8` (32px)

**Common Icons**
```jsx
import {
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  ArrowRight,
  User,
  Building2,
  CreditCard,
  Package
} from 'lucide-react';
```

---

## Accessibility

### Color Contrast

All text must meet WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States

**All interactive elements must have visible focus:**
```jsx
className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions, `<a>` for navigation
- Provide `alt` text for images
- Use `aria-label` for icon-only buttons

---

## Usage Examples

### Dashboard Card

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-gray-600 mb-4">
    Card description goes here.
  </p>
  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
    Action
  </button>
</div>
```

### Status Badge Group

```jsx
<div className="flex gap-2">
  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
    KYB: Approved
  </span>
  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
    Step 3 of 4
  </span>
</div>
```

---

## Files & Resources

**Design Specifications**: [DESIGN_SPECIFICATIONS.md](../02-design/DESIGN_SPECIFICATIONS.md)
**UI Copy**: [UI_COPY.md](../02-design/UI_COPY.md)
**Component Implementation**: [COMPONENT_GUIDE.md](../03-implementation/COMPONENT_GUIDE.md)

---

**Last Updated**: October 2025
**Maintainer**: Design & Engineering Teams
