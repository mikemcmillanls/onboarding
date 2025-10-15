# User Flows: Merchant Onboarding

Complete user flow documentation for the Lightspeed merchant onboarding application.

---

## Document Overview

This document describes the actual user flows as implemented in the current application. It focuses on what exists today, not historical planning or future features.

---

## Table of Contents

1. [Marketing Landing Page](#marketing-landing-page)
2. [Merchant Signup Flow](#merchant-signup-flow)
3. [Merchant Dashboard](#merchant-dashboard)
4. [Individual Task Pages](#individual-task-pages)
5. [Data Flow](#data-flow)
6. [Cohort Assignment](#cohort-assignment)

---

## Marketing Landing Page

**Route**: `/`

**Purpose**: Public-facing homepage to attract and convert potential merchants

### User Journey

1. User lands on marketing page
2. Views hero section with value proposition
3. Scrolls through features grid and benefits
4. Sees social proof and trust indicators
5. Primary action available:
   - **Get Started** button → Redirects to `/get-started`

### Key Features

- Hero section with product overview
- Features showcase (POS capabilities, payments, hardware)
- Benefits section (easy setup, no long-term contracts)
- Trust signals (security badges, testimonials)
- Clear CTAs throughout

### Technical Details

- Built with Next.js App Router
- Framer Motion animations for entrance effects
- Responsive design (mobile-first)
- shadcn/ui components for buttons and cards

---

## Merchant Signup Flow

**Route**: `/get-started`

**Purpose**: Capture merchant information and assign cohort in a streamlined 2-page form

### Overview

The signup flow uses a 2-page wizard pattern with client-side state management. Progress is shown at the top, and users can navigate back if needed.

---

### Page 1: Account Creation

**Component**: `AccountForm` (`components/get-started/account-form.tsx`)

**Data Collected**:
- Business Name
- Email address
- Password (minimum 8 characters)
- Terms and conditions agreement

**Validation Rules**:
- Business name: Required, non-empty
- Email: Required, valid format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password: Required, minimum 8 characters
- Terms: Must be checked to proceed

**User Experience**:
- Real-time validation on blur
- Inline error messages (red text, animated)
- Password show/hide toggle
- Trust indicators at bottom:
  - "Secure & Encrypted"
  - "Setup in Minutes"
  - "No Long-term Contract"
- "Already have an account? Sign in" link

**Flow**:
1. User fills out form fields
2. Validation runs on blur for each field
3. User checks terms agreement checkbox
4. User clicks "Create account" button
5. All fields validated
6. If valid → Proceed to Page 2
7. If invalid → Show errors, focus first error

---

### Page 2: Business Information

**Component**: `BusinessForm` (`components/get-started/business-form.tsx`)

**Data Collected**:
- Business category (dropdown, 15+ options)
- **Business website URL** (text input, URL format) - *For future TrueBiz verification*
- Business address:
  - Street address
  - City
  - State (dropdown, all US states)
  - ZIP code (5-digit or ZIP+4 format)
- Annual revenue (dropdown, 7 ranges)
- Number of locations (numeric input)

**Validation Rules**:
- All fields required
- Business website: Must be valid URL format (supports http/https, with or without www)
- ZIP code: Must match format `^\d{5}(-\d{4})?$`
- Number of locations: Must be ≥ 1

**User Experience**:
- Sectioned form with clear groupings:
  - Business Category
  - Business Website (with helper text: "We'll use this to verify your business information")
  - Business Address (4 fields)
  - Business Size (revenue + locations)
- Real-time validation on blur
- Inline error messages
- "Back" button to return to Page 1 (preserves data)
- "Continue to Setup" button with loading state

**Flow**:
1. User fills out business category
2. User completes business address fields
3. User selects annual revenue range
4. User enters number of locations
5. User clicks "Continue to Setup"
6. 800ms loading animation (shows spinner)
7. Cohort determination logic runs
8. Data saved to localStorage as `prequalificationData`
9. User redirected to `/dashboard`

---

### Cohort Assignment

**Logic** (`lib/merchant-mock-data.ts:265-284`):

Automatic cohort assignment based on business size:

**Self-Serve**:
- Revenue < $500K OR
- Locations < 3

**Assisted**:
- Revenue $500K-$2M OR
- Locations 3-10

**Managed**:
- Revenue ≥ $2M OR
- Locations ≥ 10

**Current Implementation**:
- All cohorts see the same merchant-facing UI
- Cohort stored for future specialist assignment
- Future: Will affect specialist assignment and pricing

---

## Merchant Dashboard

**Route**: `/dashboard`

**Purpose**: Post-signup hub with checklist of onboarding tasks

### Overview

The dashboard displays a 6-task checklist showing merchant setup progress. Each task is clickable and routes to a dedicated page. Tasks can be completed in any order (except blocked dependencies).

---

### Dashboard Layout

**Header**:
- Welcome message: "Welcome back, [Business Name]!"
- Overall progress indicator

**Main Content**:
- 6 task cards in grid layout (1 col mobile, 2 cols desktop)
- Each card shows:
  - Icon with color-coded badge
  - Task title
  - Task description
  - Status badge (not-started, in-progress, completed, blocked)
  - Action button ("Get Started", "Continue", "View/Edit")

---

### The 6 Dashboard Tasks

#### 1. Business Verification

- **Route**: `/dashboard/verify`
- **Status**: Required, high priority
- **Icon**: ShieldCheck (red badge)
- **Purpose**: KYB/KYC identity verification to enable payments
- **Badge**: "Required to accept payments"

#### 2. POS Configuration

- **Route**: `/dashboard/pos-setup`
- **Status**: Required
- **Icon**: ShoppingCart (blue badge)
- **Purpose**: Configure locations and registers
- **Data**: Number of locations, registers per location, e-commerce needs

#### 3. Payment Setup

- **Route**: `/dashboard/payments`
- **Status**: Required
- **Icon**: CreditCard (green badge)
- **Purpose**: Connect bank account for payouts
- **Note**: "Payouts held until verification completes"

#### 4. Hardware Selection

- **Route**: `/dashboard/hardware`
- **Status**: Optional
- **Purpose**: Select and order POS hardware bundles
- **Options**: Retail kits, restaurant kits, mobile kits ($899-$3,499)

#### 5. Data Import

- **Route**: `/dashboard/import`
- **Status**: Optional
- **Purpose**: Import products/customers from previous POS
- **Options**: CSV upload, start fresh, assisted migration

#### 6. Team Setup

- **Route**: `/dashboard/team`
- **Status**: Optional
- **Purpose**: Invite staff members and configure permissions

---

### Task Status System

**Not Started** (gray):
- Task has not been visited
- Shows "Get Started" button
- Gray icon badge

**In Progress** (blue):
- Task page visited or partially completed
- Shows "Continue" button
- Blue icon badge with partial fill

**Completed** (green):
- Task fully completed
- Shows green checkmark
- "View/Edit" button
- Completion timestamp stored

**Blocked** (red):
- Depends on incomplete task
- Shows warning message
- Action button disabled
- Example: "Complete Business Verification first"

---

### Data Persistence

**localStorage Keys**:
- `prequalificationData`: Account + business info from signup
- `merchantChecklistTasks`: Array of task completion status

**Task Status Calculation**:
- On dashboard load: Read from localStorage
- On task completion: Update localStorage + re-render
- Tasks show completion percentage on dashboard

---

## Individual Task Pages

All task pages follow a consistent structure and pattern.

---

### Common Patterns

**Layout**:
- Back button to `/dashboard`
- Icon badge with color-coded task category
- Page title and description
- Form or information card
- Primary action button (red Lightspeed brand color)
- "Do This Later" secondary button

**Animations**:
- Page entrance: Fade in + slide up (Framer Motion)
- Form validation: Error messages animate in
- Button loading states: Spinner + "Processing..." text

**Responsive Design**:
- Mobile-first layouts
- Forms stack vertically on mobile
- Multi-column grids on desktop

---

### Business Verification Page

**Route**: `/dashboard/verify`

**Content**:
- Information about KYB/KYC requirements
- List of required documents:
  - Legal business name and structure
  - EIN or SSN
  - Business address
  - Business owner information
  - Government-issued ID
- Security message: "Typically takes 5-10 minutes. Your information is encrypted."

**Actions**:
- "Start Verification" button → Simulated flow (currently redirects back to dashboard after 1.5s)
- "Do This Later" button → Returns to dashboard

**Future Implementation**:
- Integration with KYB/KYC provider (Stripe Identity, Persona, etc.)
- Document upload interface
- Real-time verification status

---

### POS Setup Page

**Route**: `/dashboard/pos-setup`

**Form Fields**:
- Number of locations (numeric input, min: 1)
- Registers per location (numeric input, min: 1)
- E-commerce integration (checkbox)

**Actions**:
- "Save Configuration" button → Saves to merchant data, returns to dashboard
- "Cancel" button → Returns to dashboard without saving

**Data Usage**:
- Stored for hardware recommendations
- Used for pricing calculations
- Affects software licensing quotes

---

### Payment Setup Page

**Route**: `/dashboard/payments`

**Form Fields**:
- Account holder name (text input)
- Bank name (text input)
- Routing number (numeric input)
- Account number (password field, masked)
- Confirm account number (password field, validation)

**Validation**:
- All fields required
- Account numbers must match
- Alert shown if mismatch

**Security Features**:
- Account numbers masked
- Security message: "We'll verify with 2 small deposits"
- Encryption badge

**Actions**:
- "Save Bank Account" button → Validates and saves
- "Do This Later" button → Returns to dashboard

**Future Implementation**:
- Plaid integration for instant verification
- Micro-deposit verification flow
- Payout settings configuration

---

### Hardware Selection Page

**Route**: `/dashboard/hardware`

**Content**:
- Hardware bundle cards with:
  - Package name and description
  - Image/icon
  - Included items list
  - Price (one-time)
  - Financing option text
  - "Select" button

**Available Bundles** (`lib/merchant-mock-data.ts:4-79`):
- Essential Retail Kit ($1,299)
- Essential Restaurant Kit ($1,499)
- Professional Retail Kit ($2,899)
- Professional Restaurant Kit ($3,499)
- Mobile POS Kit ($899)

**Actions**:
- Select bundle → Add to cart
- Quantity selector
- "Proceed to Checkout" button

**Future Implementation**:
- Bundle customization
- Existing hardware compatibility check
- Shipping date estimates
- Integration with hardware ordering system

---

### Data Import Page

**Route**: `/dashboard/import`

**Options**:
- CSV upload (with field mapping wizard)
- Start fresh (skip import)
- Assisted migration (contact support)

**Future Implementation**:
- CSV parser and validator
- Field mapping interface
- Preview before import
- Progress indicator for large imports

---

### Team Setup Page

**Route**: `/dashboard/team`

**Features**:
- Team member invitation form
- Role assignment (Owner, Manager, Staff)
- Permission configuration
- Active team member list

**Future Implementation**:
- Email invitations
- Role-based access control
- Team member management

---

## Data Flow

### Storage Architecture

**Client-Side Storage** (localStorage):
- Used for prototype/demo
- Persists across page reloads
- Cleared on browser cache clear

**Data Flow Diagram**:

```
User Signup Form
      ↓
localStorage ('prequalificationData')
      ↓
Dashboard Loads Data
      ↓
Individual Task Pages Read/Write
```

---

### Key localStorage Keys

**`prequalificationData`**:
```typescript
{
  businessName: string;
  email: string;
  password: string;
  businessCategory: string;
  businessWebsite: string;  // For future TrueBiz verification
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  annualRevenue: string;
  numberOfLocations: number;
  cohort: 'self-serve' | 'assisted' | 'managed';
  createdAt: string;
}
```

**`merchantChecklistTasks`**:
```typescript
Array<{
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  required: boolean;
  route: string;
  completedAt?: string;
}>
```

---

### Data Synchronization

**Current Implementation**:
- Manual refresh required for dashboard updates
- No real-time WebSocket connection

**Future Implementation**:
- Backend API for merchant data
- Real-time updates via WebSockets
- Event-driven architecture
- Persistent database storage

---

## Cohort Assignment

### Cohort Types

**Self-Serve**:
- **Criteria**: <$500K revenue OR <3 locations
- **Experience**: Fully automated self-service flow
- **Support**: Standard support (chat, email)
- **Specialist**: None assigned

**Assisted**:
- **Criteria**: $500K-$2M revenue OR 3-10 locations
- **Experience**: Sales-guided with self-checkout option
- **Support**: Free IC support available
- **Specialist**: Optional AE guidance

**Managed**:
- **Criteria**: $2M+ revenue OR 10+ locations
- **Experience**: White-glove implementation
- **Support**: Dedicated account manager
- **Specialist**: Required specialist engagement

---

### Cohort-Specific Logic

**Current State**:
- All cohorts use the same merchant-facing UI
- Cohort stored for future routing and specialist assignment

**Future Differentiation**:
- **Self-Serve**: No changes to current flow
- **Assisted**:
  - Specialist banner on dashboard
  - "Schedule a call" option
  - Can still self-serve
- **Managed**:
  - Required specialist introduction
  - Custom pricing negotiations
  - Scheduled onboarding sessions
  - Implementation package included

---

### Revenue Range Mapping

**From Form to Cohort** (`lib/merchant-mock-data.ts:101-109`):

| Revenue Range Value | Label | Min | Max | Default Cohort |
|---|---|---|---|---|
| under-100k | Under $100,000 | 0 | 100,000 | Self-Serve |
| 100k-250k | $100,000 - $250,000 | 100,000 | 250,000 | Self-Serve |
| 250k-500k | $250,000 - $500,000 | 250,000 | 500,000 | Self-Serve |
| 500k-1m | $500,000 - $1M | 500,000 | 1,000,000 | Assisted |
| 1m-2m | $1M - $2M | 1,000,000 | 2,000,000 | Assisted |
| 2m-5m | $2M - $5M | 2,000,000 | 5,000,000 | Managed |
| over-5m | Over $5M | 5,000,000 | 999,999,999 | Managed |

**Note**: Location count can override revenue-based cohort assignment

---

## Navigation Patterns

### Primary Navigation Routes

**Public Routes**:
- `/` - Marketing landing page
- `/get-started` - Signup flow

**Authenticated Routes** (merchant):
- `/dashboard` - Main dashboard hub
- `/dashboard/verify` - Business verification
- `/dashboard/pos-setup` - POS configuration
- `/dashboard/payments` - Payment setup
- `/dashboard/hardware` - Hardware selection
- `/dashboard/import` - Data import
- `/dashboard/team` - Team setup
- `/dashboard/settings` - Account settings

**Demo/Visualization Routes**:
- `/onboarding` - 10-step onboarding flow visualization (not part of main flow)

---

### Navigation Patterns

**Back Navigation**:
- All task pages have "Back to Dashboard" button
- Get Started Page 2 has "Back" to Page 1

**Breadcrumbs**:
- Not currently implemented
- Future: Show navigation path

**Progress Indicators**:
- Get Started: 2-step progress (Page 1 of 2, Page 2 of 2)
- Dashboard: Overall progress percentage
- Task pages: Step indicators for multi-step tasks

---

## Technical Implementation

### Key Technologies

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Forms**: React Hook Form (future)
- **Validation**: Zod (future)

---

### Component Architecture

**Page Components** (`app/**/*.tsx`):
- Use `'use client'` directive
- Manage route-level state
- Handle data loading and persistence
- Coordinate child components

**Shared Components** (`components/**/*.tsx`):
- Reusable UI components
- Form components with validation
- Layout components
- Feature-specific components

**UI Primitives** (`components/ui/*.tsx`):
- shadcn/ui base components
- Button, Input, Card, Label, etc.
- Accessible by default (WCAG AA)

---

### State Management

**Current Approach**:
- Component-level useState for forms
- localStorage for persistence
- No global state management

**Future Approach**:
- Zustand or Jotai for global state
- React Query for server state
- Context for theme/auth

---

### Form Handling

**Current Pattern**:
- Controlled inputs with useState
- Manual validation functions
- Error state management
- Submit handlers

**Future Enhancement**:
- React Hook Form for form state
- Zod schemas for validation
- Automatic error handling

---

## User Experience Principles

### Progressive Disclosure

- Show 6 high-level tasks initially
- Each task page reveals detailed requirements
- "Do This Later" option prevents abandonment
- Optional vs. required tasks clearly marked

### Non-Linear Completion

- Tasks can be completed in any order
- Dashboard always accessible as hub
- No forced sequence (except blocked dependencies)
- Return to dashboard anytime

### Feedback & Validation

- Real-time validation on blur
- Inline error messages (no modals)
- Success states with green checkmarks
- Loading states for async actions
- Clear next steps after completion

### Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Color contrast ratios met

### Responsive Design

- Mobile-first approach
- Touch-friendly hit targets (min 44×44px)
- Readable font sizes (min 16px)
- Grid layouts adapt to screen size
- No horizontal scrolling

---

## Error Handling

### Form Validation Errors

- Show inline below field
- Red border on invalid field
- Error message describes fix
- Clears when user starts typing

### Network Errors

- Retry button shown
- Error message explains issue
- Maintain form state
- Don't lose user progress

### Navigation Errors

- 404 page for invalid routes
- Redirect to dashboard if not found
- Back button always works

---

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - API endpoints for merchant data
   - Real-time sync with database
   - WebSocket connections for live updates

2. **Authentication**
   - JWT-based auth
   - Session management
   - Password reset flow

3. **Specialist Assignment**
   - Automated AE/IC routing
   - In-app communication
   - Shared screen capability

4. **Stall Detection**
   - Automated email sequences
   - Intervention workflows
   - Proactive support offers

5. **Analytics**
   - Conversion funnel tracking
   - Drop-off analysis
   - Time-to-completion metrics
   - A/B testing framework

6. **Payment Integration**
   - Actual payment processing
   - Hardware ordering system
   - Shipping tracking

7. **KYB/KYC Integration**
   - Stripe Identity or Persona
   - Document upload and verification
   - Real-time status updates

---

## Conclusion

This document describes the complete user flows as implemented in the current application. All flows are functional and testable in the prototype. The system provides a streamlined signup process followed by a task-based dashboard approach.

For detailed UI specifications, see [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md).

For implementation details, see [COMPONENT_GUIDE.md](../03-implementation/COMPONENT_GUIDE.md).

---

**Last Updated**: January 2025
**Version**: Current State (Prototype + TrueBiz Integration Planning)
**Maintainer**: Product & Engineering Teams
