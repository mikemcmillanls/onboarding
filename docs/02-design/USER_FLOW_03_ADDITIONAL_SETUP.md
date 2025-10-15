# User Flow 3: Additional Setup Tasks

Complete documentation for the optional onboarding tasks: Hardware Selection, Data Import, and Team Setup, plus technical implementation details and UX principles.

---

## Document Overview

This document describes the three optional setup tasks that merchants can complete at their own pace, along with technical implementation details, UX principles, and navigation patterns that apply across all user flows.

---

## Table of Contents

1. [Task 4: Hardware Selection](#task-4-hardware-selection)
2. [Task 5: Data Import](#task-5-data-import)
3. [Task 6: Team Setup](#task-6-team-setup)
4. [Technical Implementation](#technical-implementation)
5. [User Experience Principles](#user-experience-principles)
6. [Navigation Patterns](#navigation-patterns)
7. [Error Handling](#error-handling)

---

## Task 4: Hardware Selection

**Route**: `/dashboard/hardware`

**Purpose**: Select and order POS hardware bundles

**Priority**: Optional

**Status**: Optional - can be skipped or completed later

---

### Current Implementation

**Content**:
Hardware bundle cards with:
- Package name and description
- Image/icon
- Included items list
- Price (one-time)
- Financing option text
- "Select" button

**Available Bundles** (`lib/merchant-mock-data.ts:4-79`):
- **Essential Retail Kit**: $1,299
- **Essential Restaurant Kit**: $1,499
- **Professional Retail Kit**: $2,899
- **Professional Restaurant Kit**: $3,499
- **Mobile POS Kit**: $899

**Actions**:
- Select bundle → Add to cart
- Quantity selector
- "Proceed to Checkout" button
- "Do This Later" button → Returns to dashboard

---

### Future Implementation

**Enhanced Features**:
- Bundle customization (add/remove items)
- Existing hardware compatibility check
- Shipping date estimates
- Integration with hardware ordering system
- Multiple bundle selection
- Volume discounts
- Lease-to-own financing options

**Hardware Compatibility**:
```typescript
// Check if merchant has existing hardware
const hasExistingHardware = await checkHardwareCompatibility({
  merchantId: merchant.id,
  currentEquipment: merchant.currentEquipment
});

if (hasExistingHardware.compatible) {
  showMessage("You can use your existing hardware with Lightspeed");
  offerBringYourOwnDeviceDiscount();
} else {
  recommendNewHardware();
}
```

**Shipping & Logistics**:
- Estimated delivery date based on location
- Multi-location delivery coordination
- Tracking numbers and status updates
- Setup appointment scheduling
- Return/exchange policy

---

### Why Hardware Is Optional

**Not Required for All Merchants**:
- Some merchants have compatible existing hardware
- Some start with software-only (e-commerce)
- Some delay hardware purchase until after trial
- Enterprise merchants may need custom quotes

**Merchant Can**:
- Complete immediately
- Research options and return later
- Contact sales for custom configurations
- Skip if using existing hardware

---

## Task 5: Data Import

**Route**: `/dashboard/import`

**Purpose**: Import products/customers from previous POS system

**Priority**: Optional

**Status**: Optional - merchants can start fresh or import later

---

### Current Implementation

**Options**:
- **CSV upload** (with field mapping wizard)
- **Start fresh** (skip import)
- **Assisted migration** (contact support for help)

**User Flow**:
1. Choose import method
2. If CSV: Upload file
3. Map fields (Product Name → Name, SKU → Product Code, etc.)
4. Preview data
5. Confirm import
6. Show progress
7. Complete

**Actions**:
- "Upload CSV" button → File picker
- "Start Fresh" button → Skip import, go to dashboard
- "Contact Support" button → Request assisted migration
- "Do This Later" button → Returns to dashboard

---

### Future Implementation

**CSV Import**:
- CSV parser and validator
- Field mapping interface (drag-and-drop)
- Data preview before import
- Progress indicator for large imports
- Error handling and validation reports
- Duplicate detection
- Data transformation rules

**Direct Integrations**:
- Square export/import
- Shopify product sync
- Clover data migration
- Toast POS import
- QuickBooks integration

**Assisted Migration**:
- Book appointment with migration specialist
- Screen sharing for complex setups
- Data validation and cleanup
- Post-migration verification
- Training on imported data

**Data Types Supported**:
- Products (SKU, name, price, description, images, categories)
- Customers (name, email, phone, address, purchase history)
- Inventory (quantities, locations, suppliers)
- Sales history (for reporting baseline)
- Employee records (for team setup)

---

### Why Data Import Is Optional

**Not All Merchants Need It**:
- New businesses (no existing data)
- Businesses changing categories (fresh start)
- Existing data in different system (manual entry easier)
- Small catalogs (faster to enter manually)

**Complexity Varies**:
- Simple: 50 products, 100 customers → CSV upload
- Medium: 500 products, 1000 customers → Assisted migration
- Complex: 5000+ products, multi-location inventory → Enterprise migration service

---

## Task 6: Team Setup

**Route**: `/dashboard/team`

**Purpose**: Invite staff members and configure permissions

**Priority**: Optional

**Status**: Optional - single-person businesses may skip

---

### Current Implementation

**Features**:
- Team member invitation form
- Role assignment (Owner, Manager, Staff)
- Permission configuration
- Active team member list

**User Flow**:
1. Click "Invite Team Member"
2. Enter email address
3. Select role:
   - **Owner**: Full access, billing, settings
   - **Manager**: Can manage staff, reports, limited settings
   - **Staff**: Can ring sales, limited reporting
4. Configure specific permissions (optional)
5. Send invitation
6. Invitation sent to email
7. Team member accepts and creates account

**Actions**:
- "Invite Team Member" button → Opens form
- "Save" button → Sends invitation
- "Cancel" button → Closes form
- "Remove" button → Removes team member (with confirmation)
- "Do This Later" button → Returns to dashboard

---

### Future Implementation

**Email Invitations**:
- Customizable invitation email template
- Branded invitation experience
- Invitation expiration (7 days)
- Resend invitation option
- Track invitation status (sent, opened, accepted, expired)

**Role-Based Access Control**:
```typescript
const roles = {
  owner: {
    permissions: ['*'], // Full access
    restrictedActions: []
  },
  manager: {
    permissions: [
      'sales.view', 'sales.create', 'sales.refund',
      'products.view', 'products.edit',
      'reports.view', 'reports.export',
      'staff.view', 'staff.invite'
    ],
    restrictedActions: ['billing', 'account.delete', 'integrations']
  },
  staff: {
    permissions: [
      'sales.view', 'sales.create',
      'products.view',
      'customers.view', 'customers.create'
    ],
    restrictedActions: ['reports', 'settings', 'staff', 'billing']
  }
};
```

**Team Member Management**:
- Edit permissions after invitation accepted
- Suspend/reactivate accounts
- Transfer ownership
- Audit log of team member actions
- Multiple locations: assign staff to specific locations
- Shift scheduling (future)
- Performance tracking (future)

**Advanced Features**:
- Custom roles (beyond Owner/Manager/Staff)
- Granular permissions (per module, per action)
- Multi-location permissions
- Time-based access (part-time staff)
- 2FA enforcement for managers

---

### Why Team Setup Is Optional

**Single-Person Businesses**:
- Solopreneurs don't need team management
- Can skip and return when hiring

**Timing Flexibility**:
- May want to test system first before inviting team
- Training plan needed before rollout
- Phased rollout (managers first, then staff)

---

## Technical Implementation

### Key Technologies

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Forms**: React Hook Form (future)
- **Validation**: Zod (future)

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
- Button, Input, Card, Label, Select, etc.
- Accessible by default (WCAG AA)
- Composable and themeable

### State Management

**Current Approach**:
- Component-level useState for forms
- localStorage for persistence
- No global state management
- Manual data flow between components

**Future Approach**:
- Zustand or Jotai for global state
- React Query for server state and caching
- Context API for theme/auth
- Optimistic updates
- Real-time sync via WebSockets

### Form Handling

**Current Pattern**:
- Controlled inputs with useState
- Manual validation functions
- Error state management
- Submit handlers with loading states

**Future Enhancement**:
- React Hook Form for form state management
- Zod schemas for validation
- Automatic error handling and display
- Form submission with error recovery
- Multi-step forms with progress saving

---

## User Experience Principles

### Progressive Disclosure

- Show 6 high-level tasks initially on dashboard
- Each task page reveals detailed requirements
- "Do This Later" option prevents abandonment
- Optional vs. required tasks clearly marked with badges
- Contextual help and tooltips
- Gradual feature introduction

### Non-Linear Completion

- Tasks can be completed in any order (except blocked dependencies)
- Dashboard always accessible as hub (back button on all pages)
- No forced sequence (merchant chooses priority)
- Return to dashboard anytime
- Save progress automatically
- Resume where left off

### Feedback & Validation

- Real-time validation on blur
- Inline error messages (no modals unless critical)
- Success states with green checkmarks and animations
- Loading states for async actions (spinners, progress bars)
- Clear next steps after completion
- Confirmation messages for destructive actions
- Toast notifications for background operations

### Accessibility

- **WCAG AA compliant** throughout application
- Keyboard navigation support (tab order, focus indicators)
- Screen reader friendly (ARIA labels, semantic HTML)
- Focus management (trapped modals, auto-focus first field)
- Color contrast ratios met (4.5:1 for text, 3:1 for UI)
- Alternative text for images
- Error messages announced to screen readers
- Skip links for navigation

### Responsive Design

- Mobile-first approach (design for smallest screen first)
- Touch-friendly hit targets (minimum 44×44px)
- Readable font sizes (minimum 16px, scales with viewport)
- Grid layouts adapt to screen size (1 col → 2 col → 3 col)
- No horizontal scrolling
- Collapsible navigation on mobile
- Touch gestures for common actions (swipe, tap)
- Responsive images and media

---

## Navigation Patterns

### Primary Navigation Routes

**Public Routes**:
- `/` - Marketing landing page
- `/get-started` - Signup flow (2 pages)

**Authenticated Routes** (merchant):
- `/dashboard` - Main dashboard hub (6 tasks)
- `/dashboard/verify` - Individual verification (Stripe Identity)
- `/dashboard/pos-setup` - POS configuration
- `/dashboard/payments` - Payment setup
- `/dashboard/hardware` - Hardware selection
- `/dashboard/import` - Data import
- `/dashboard/team` - Team setup
- `/dashboard/settings` - Account settings (future)

**Demo/Visualization Routes**:
- `/onboarding` - 10-step onboarding flow visualization (not part of main flow)

### Navigation Patterns

**Back Navigation**:
- All task pages have "Back to Dashboard" button (top left)
- Get Started Page 2 has "Back" to Page 1 (preserves data)
- Browser back button supported
- Confirmation prompts for unsaved changes

**Breadcrumbs**:
- Not currently implemented
- Future: Show navigation path (Home > Dashboard > Payments)
- Clickable breadcrumb trail
- Current page highlighted

**Progress Indicators**:
- Get Started: 2-step progress (Page 1 of 2, Page 2 of 2)
- Dashboard: Overall progress percentage (tasks completed / total)
- Task pages: Step indicators for multi-step tasks
- Visual progress bars
- Completion checkmarks

---

## Error Handling

### Form Validation Errors

**Display**:
- Show inline below field
- Red border on invalid field
- Error icon next to field label
- Error message describes how to fix
- Clears when user starts typing

**Example**:
```
Email Address *
┌─────────────────────────────┐
│ invalid-email               │ ❌
└─────────────────────────────┘
❗ Please enter a valid email address
```

### Network Errors

**Handling**:
- Retry button shown
- Error message explains issue clearly
- Maintain form state (don't lose user progress)
- Exponential backoff for retries
- Offline indicator
- Queue actions when offline

**Example**:
```
❌ Connection Error
We couldn't save your changes. Please check your internet connection.

[Retry] [Save for Later]
```

### Navigation Errors

**404 Pages**:
- Custom 404 page with helpful message
- Redirect to dashboard if not found (after 3 seconds)
- "Return to Dashboard" button
- Search functionality
- Common links

**Permission Errors**:
- Clear message about access requirements
- Link to contact support
- Breadcrumb trail shows location
- Option to request access

---

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - API endpoints for merchant data (RESTful + GraphQL)
   - Real-time sync with database (PostgreSQL)
   - WebSocket connections for live updates
   - Redis caching layer
   - Event-driven architecture

2. **Authentication**
   - JWT-based auth with refresh tokens
   - Session management (sliding expiration)
   - Password reset flow (email + SMS)
   - 2FA support (TOTP, SMS)
   - OAuth providers (Google, Apple)
   - Biometric auth for mobile

3. **Specialist Assignment**
   - Automated AE/IC routing based on cohort
   - In-app communication (chat, video)
   - Shared screen capability
   - Appointment scheduling
   - SLA tracking and escalation
   - Specialist performance metrics

4. **Stall Detection**
   - Automated email sequences (3-touch campaign)
   - Intervention workflows (AE assignment after 72 hours)
   - Proactive support offers (live chat popup)
   - Completion prediction ML model
   - Personalized nudges based on behavior
   - SMS reminders for high-value merchants

5. **Analytics**
   - Conversion funnel tracking (Segment, Mixpanel)
   - Drop-off analysis by task and cohort
   - Time-to-completion metrics (P50, P90, P99)
   - A/B testing framework (Optimizely)
   - Cohort analysis
   - Revenue attribution
   - User session replays (LogRocket)

6. **Payment Integration**
   - Actual payment processing (Stripe Connect live)
   - Hardware ordering system (ShipStation)
   - Shipping tracking and notifications
   - Invoice generation
   - Recurring billing
   - Multi-currency support

7. **KYB/KYC Integration**
   - **Primary strategy**: Layered verification approach
     - **TrueBiz** for business verification (KYB): Business legitimacy, domain validation, risk scoring
     - **Stripe Identity** for individual verification (KYC): Document verification, selfie/liveness checks
   - **Cohort-specific verification costs**:
     - Self-Serve (<$500K): Stripe Identity only (~$2.00/merchant)
     - Assisted ($500K-$2M): TrueBiz + Stripe Identity (~$4.50/merchant)
     - Managed ($2M+): Comprehensive verification + ongoing monitoring (~$9.50+/merchant)
   - Real-time verification status tracking via Stripe webhooks
   - Compliance reporting and audit trails

---

## Complete User Journey Summary

```
Marketing Website (/)
      ↓
   [Get Started Button]
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 FLOW 1: SIGNUP & PROVISIONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ↓
Signup Page 1: Account Creation
      ↓
Signup Page 2: Business Information
      ↓
TrueBiz Business Verification (5-10s)
      ↓
Cohort Assignment (Self-Serve/Assisted/Managed)
      ↓
X-Series Account Provisioned
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 FLOW 2: DASHBOARD & PAYMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ↓
Dashboard (/dashboard)
  [6 Tasks Displayed]
      ↓
Task 1: Individual Verification ⭐
  (Stripe Identity KYC)
      ↓
Task 2: POS Configuration ⭐
  (Locations & Registers)
      ↓
Task 3: Payment Setup ⭐
  (Bank Account Connection)
      ↓
[Payment processing enabled 1-2 days later]
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ FLOW 3: ADDITIONAL SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ↓
Task 4: Hardware Selection (Optional)
      ↓
Task 5: Data Import (Optional)
      ↓
Task 6: Team Setup (Optional)
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FULLY OPERATIONAL MERCHANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Related Documentation

**Previous Steps**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md)
- [User Flow 2: Dashboard and Payment Setup](./USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md)

**Integration Details**:
- [Stripe Identity vs Trulioo Analysis](../05-integrations/STRIPE_IDENTITY_VS_TRULIOO_ANALYSIS.md)
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md)
- [TrueBiz Integration Analysis](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md)

**Design & Implementation**:
- [Design Specifications](./DESIGN_SPECIFICATIONS.md)
- [Component Guide](../03-implementation/COMPONENT_GUIDE.md)
- [Architecture](../03-implementation/ARCHITECTURE.md)
- [Design System](../04-reference/DESIGN_SYSTEM.md)

---

**Last Updated**: January 2025
**Version**: Current State (Prototype + Future Planning)
**Maintainer**: Product & Engineering Teams
