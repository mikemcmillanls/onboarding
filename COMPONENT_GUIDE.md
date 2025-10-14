# Component Guide - Lightspeed Onboarding Dashboard

## Component Overview

This guide provides detailed information about each custom component in the onboarding dashboard.

---

## 1. CohortSelector (`cohort-selector.tsx`)

**Purpose:** Interactive cohort selection cards for visualizing and choosing merchant segments.

**Props:**
```typescript
{
  selectedCohort: CohortType;        // Currently selected cohort
  onSelect?: (cohort: CohortType) => void;  // Selection callback
  readOnly?: boolean;                // Disable selection (default: false)
}
```

**Features:**
- Three cohort cards (Self-Serve, Assisted, Managed)
- Color-coded visual identity per cohort
- Displays GTV range, location count, selling plan, setup plan
- Hover animation (scale up to 1.03x)
- Active state with ring indicator
- Staggered entrance animation (100ms delay per card)

**Usage:**
```tsx
<CohortSelector
  selectedCohort="assisted"
  onSelect={handleCohortChange}
/>
```

**Visual Elements:**
- Icon for each cohort (Building2, Users, TrendingUp)
- Badge showing "Selected" state
- Card layout with header and detailed info
- Color-coded backgrounds (10% opacity)

---

## 2. MerchantInfoPanel (`merchant-info-panel.tsx`)

**Purpose:** Display comprehensive merchant profile information.

**Props:**
```typescript
{
  merchant: MerchantProfile;  // Merchant data object
}
```

**Displays:**
- Business name and merchant ID
- Cohort badge (color-coded)
- Annual GTV (formatted currency)
- Location count
- Cohort configuration details
- Selling plan and setup plan
- Team assignments (AE/IC)
- Timeline (created date, last activity)

**Features:**
- Currency formatting with locale support
- Relative time display ("2h ago", "3d ago")
- Icons for each data point
- Sectioned layout with separators
- Responsive grid for key metrics

**Usage:**
```tsx
<MerchantInfoPanel merchant={merchantData} />
```

---

## 3. NextActionsPanel (`next-actions-panel.tsx`)

**Purpose:** Context-aware action recommendations and warnings.

**Props:**
```typescript
{
  currentStep: number;              // Current step ID (1-10)
  cohort: CohortType;              // Merchant cohort
}
```

**Features:**
- Current step display with description
- Cohort-specific action buttons
  - Self-Serve: "Continue Setup", "View Guide"
  - Assisted/Managed: "Schedule Call", "Contact Support"
- Critical warnings based on step position
  - KYB requirement before hardware purchase
  - Payout holds until bank verification
- Next step preview
- Support team information (for assisted/managed)

**Warning Types:**
- High severity: Red background/border
- Medium severity: Amber background/border
- Alert icon with contextual message

**Usage:**
```tsx
<NextActionsPanel
  currentStep={5}
  cohort="assisted"
/>
```

---

## 4. ProgressOverview (`progress-overview.tsx`)

**Purpose:** Comprehensive progress tracking and metrics display.

**Props:**
```typescript
{
  currentStep: number;              // Current step ID
  completedSteps: number[];         // Array of completed step IDs
}
```

**Displays:**
- Overall completion percentage
- Progress bar (animated)
- Current stage highlight
- Step breakdown:
  - Completed count (green)
  - In progress count (blue)
  - Pending count (gray)
- Stage-by-stage progress meters

**Features:**
- Real-time percentage calculation
- Animated progress bars
- Color-coded status indicators
- Stage identification with color dots
- Responsive layout

**Usage:**
```tsx
<ProgressOverview
  currentStep={5}
  completedSteps={[1, 2, 3, 4]}
/>
```

---

## 5. StageHeader (`stage-header.tsx`)

**Purpose:** Visual header for each onboarding stage.

**Props:**
```typescript
{
  stage: Stage;                     // Stage data object
  isActive: boolean;                // Is this the current stage?
  isCompleted: boolean;             // Are all steps completed?
  index: number;                    // Stage index (for animation delay)
}
```

**States:**
- **Active:** Primary border, shadow, background tint
- **Completed:** Green border, checkmark icon
- **Pending:** Gray border, neutral styling

**Features:**
- Numbered icon or checkmark
- Stage title and description
- Step range display
- Entrance animation with staggered delay
- Active state indicator with layout animation

**Usage:**
```tsx
<StageHeader
  stage={stageData}
  isActive={true}
  isCompleted={false}
  index={0}
/>
```

---

## 6. StepCard (`step-card.tsx`)

**Purpose:** Individual step card with status and details.

**Props:**
```typescript
{
  step: OnboardingStep;             // Step data
  isActive: boolean;                // Is this step selected?
  onClick?: () => void;             // Click handler
}
```

**Status Indicators:**
- **Pending:** Gray circle icon
- **In Progress:** Blue spinning loader
- **Completed:** Green checkmark
- **Blocked:** Red alert icon

**Displays:**
- Step number and badge
- Step title and description
- First 3 data collection items
- "+X more..." for additional items

**Features:**
- Hover animation (scale to 1.02x)
- Active state with ring indicator
- Status-based color coding
- Badge with current status
- Clickable for interaction

**Usage:**
```tsx
<StepCard
  step={stepData}
  isActive={selectedStep === step.id}
  onClick={handleStepClick}
/>
```

---

## 7. OnboardingFlow (`onboarding-flow.tsx`)

**Purpose:** Main flow visualization orchestrating all stages and steps.

**Props:**
```typescript
{
  currentStep: number;              // Current step ID
  completedSteps: number[];         // Completed step IDs
  onStepClick?: (stepId: number) => void;  // Step click handler
}
```

**Features:**
- Groups steps by stage
- Displays stage headers
- Renders step cards in responsive grid
- Visual connectors between stages (arrows)
- Manages selection state
- Entrance animations:
  - Stage containers: 200ms delay per stage
  - Step cards: 100ms delay per step

**Layout:**
- Stage header (full width)
- Step grid (1-3 columns based on screen size)
- Arrow connector (centered, animated)
- Repeat for each stage

**Usage:**
```tsx
<OnboardingFlow
  currentStep={5}
  completedSteps={[1, 2, 3, 4]}
  onStepClick={handleStepClick}
/>
```

---

## shadcn/ui Components Used

### Badge (`ui/badge.tsx`)
- Variants: default, secondary, outline, destructive
- Used for: cohort labels, status indicators

### Button (`ui/button.tsx`)
- Variants: default, outline, secondary
- Sizes: sm, default, lg
- Used for: action buttons, navigation

### Card (`ui/card.tsx`)
- Components: Card, CardHeader, CardTitle, CardDescription, CardContent
- Used for: all major content containers

### Progress (`ui/progress.tsx`)
- Animated progress bar
- Customizable color and height
- Used for: completion tracking

### Separator (`ui/separator.tsx`)
- Visual divider
- Used for: section separation in panels

### Tabs (`ui/tabs.tsx`)
- Components: Tabs, TabsList, TabsTrigger, TabsContent
- Used for: Dashboard/Full Flow view switcher

---

## Animation Specifications

### Entrance Animations
```typescript
// Fade and slide up
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// Scale in
{
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2 }
}
```

### Hover Effects
```typescript
// Card hover
whileHover={{ scale: 1.02 }}

// Button press
whileTap={{ scale: 0.98 }}
```

### Staggered Delays
- Cohort cards: `index * 0.1` (100ms per card)
- Stages: `index * 0.2` (200ms per stage)
- Steps: `stageIndex * 0.2 + stepIndex * 0.1`

---

## Responsive Breakpoints

Using Tailwind CSS breakpoints:

- **Mobile (default):** 1 column grid
- **md (768px+):** 2 column grid
- **lg (1024px+):** 3 column grid (steps), 3-column dashboard layout

### Grid Patterns

**Step Cards:**
```tsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

**Dashboard Layout:**
```tsx
grid-cols-1 lg:grid-cols-3
// Left column: span 1
// Right column: lg:col-span-2
```

**Cohort Selector:**
```tsx
grid-cols-1 md:grid-cols-3
```

---

## Color Reference

### Stage Colors
```
Qualify Leads:       bg-emerald-500
Buying Experience:   bg-blue-500
Guided Setup:        bg-purple-500
```

### Cohort Colors
```
Self-Serve:   bg-blue-500
Assisted:     bg-purple-500
Managed:      bg-amber-500
```

### Status Colors
```
Completed:    text-green-600, bg-green-100
In Progress:  text-blue-600, bg-blue-100
Pending:      text-gray-400, bg-gray-100
Blocked:      text-red-600, bg-red-100
```

### UI Colors
```
Primary:      Blue-600
Secondary:    Purple-600
Muted:        Gray-500
Border:       Gray-200
Background:   Gradient from slate-50 via blue-50 to slate-50
```

---

## Icon Reference

From lucide-react:

- **CheckCircle2:** Completed status
- **Circle:** Pending status
- **Loader2:** In-progress status (animated spin)
- **AlertCircle:** Blocked status, warnings
- **ArrowRight:** Stage connectors, continue actions
- **Building2:** Self-serve cohort, business info
- **Users:** Assisted cohort
- **TrendingUp:** Managed cohort
- **DollarSign:** GTV display
- **MapPin:** Location count
- **Calendar:** Created date
- **Activity:** Last activity
- **Clock:** In-progress indicator
- **User:** Team assignments
- **Settings:** Settings button
- **LayoutDashboard:** Dashboard tab
- **Workflow:** Full flow tab
- **Phone:** Call actions
- **MessageSquare:** Support actions

---

## State Management

Currently using React useState for demo purposes:

```typescript
const [merchant, setMerchant] = useState<MerchantProfile>({
  id: 'MERCH-2024-001',
  businessName: 'Riverside Coffee Co.',
  cohort: 'assisted',
  currentStep: 5,
  completedSteps: [1, 2, 3, 4],
  gtv: 1200000,
  locationCount: 5,
  assignedAE: 'Sarah Johnson',
  assignedIC: 'Mike Chen',
  createdAt: new Date('2024-01-15'),
  lastActivity: new Date(),
});
```

For production, consider:
- React Query/TanStack Query for server state
- Zustand for client state
- Context API for theme/user preferences

---

## Component Dependencies

```
OnboardingFlow
  ├── StageHeader
  └── StepCard
      └── Card (shadcn)
          ├── CardHeader
          ├── CardTitle
          ├── CardDescription
          └── CardContent

CohortSelector
  └── Card (shadcn)
      ├── Badge
      └── CardHeader/CardContent

MerchantInfoPanel
  └── Card (shadcn)
      ├── Badge
      ├── Separator
      └── Icons

NextActionsPanel
  └── Card (shadcn)
      ├── Button
      ├── Badge
      └── Icons

ProgressOverview
  └── Card (shadcn)
      ├── Progress
      └── Badge
```

---

## Testing Considerations

For future testing implementation:

1. **Unit Tests**
   - Component rendering
   - Props validation
   - State changes

2. **Integration Tests**
   - User interactions
   - Navigation flows
   - Data updates

3. **Visual Regression Tests**
   - Screenshot comparison
   - Animation playback
   - Responsive layouts

4. **Accessibility Tests**
   - ARIA labels
   - Keyboard navigation
   - Screen reader compatibility

---

## Performance Notes

- All components use React.memo candidates for optimization
- Heavy computations (progress calculation) can be memoized
- Animation uses Framer Motion's layout optimization
- Tailwind CSS purges unused styles in production
- Images and icons are optimized via next/image and SVG

---

**Last Updated:** October 9, 2025
**Framework:** Next.js 15 with App Router
**Component Library:** shadcn/ui + custom components
