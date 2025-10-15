# User Flow 1: Signup and Account Provisioning

Complete documentation for the merchant signup flow from marketing website through account creation and Lightspeed X-Series provisioning.

---

## Document Overview

This document describes the end-to-end signup journey from first website visit through TrueBiz verification and account provisioning. This flow ends when the merchant lands on their dashboard for the first time.

---

## Table of Contents

1. [Marketing Landing Page](#marketing-landing-page)
2. [2-Page Signup Flow](#2-page-signup-flow)
3. [TrueBiz Business Verification](#truebiz-business-verification)
4. [Cohort Assignment](#cohort-assignment)
5. [Account Provisioning](#account-provisioning)
6. [Technical Implementation](#technical-implementation)

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

## 2-Page Signup Flow

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

### Page 2: Business Information with TrueBiz Verification

**Component**: `BusinessForm` (`components/get-started/business-form.tsx`)

**Data Collected**:
- Business category (dropdown, 15+ options)
- **Business website URL** (text input, URL format) - *Required for TrueBiz business verification*
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

**Flow (Current Prototype)**:
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

## TrueBiz Business Verification

**When**: After user clicks "Continue to Setup" on Page 2

**Purpose**: Validate business legitimacy and prevent fraud BEFORE account creation

### Future Implementation Flow

After user clicks "Continue to Setup", the following verification flow runs BEFORE account creation:

#### 1. TrueBiz Business Verification API Call (5-10 seconds)

**Verification Checks**:
- Validates business website domain exists and is active
- Checks business legitimacy and registration status
- Performs fraud detection and risk assessment
- Cross-references address with business records
- Returns verification result: `APPROVE` / `REVIEW` / `REJECT`

**Provider**: TrueBiz (business verification service via domain/URL lookup)

**Cost**: ~$0.50-$2.00 per verification (estimated, custom pricing)

---

#### 2. Verification Outcome Handling

**✅ APPROVED (Pass)**:
- Verification score meets threshold (e.g., ≥80/100)
- Cohort determination logic runs
- Lightspeed X-Series account provisioned
- Data saved with verification metadata
- User redirected to `/dashboard`
- Estimated time: ~10 seconds total

**⚠️ REVIEW (Manual Review Required)**:
- Verification score inconclusive (e.g., 50-79/100)
- Show "Under Review" screen with message:
  - "We're reviewing your application"
  - "You'll receive an email within 24 hours"
  - Display support contact information
- Flag account for manual review by operations team
- User cannot access dashboard until approved
- Review queue notification sent to ops team

**❌ REJECTED (Failed)**:
- Verification score below threshold (<50/100) OR fraud signals detected
- Show rejection screen with:
  - Clear explanation of rejection reason
  - Options to correct information and resubmit
  - Alternative: "Contact Sales" button for manual review
- Prevent account creation
- Log rejection reason for compliance

---

#### 3. Data Captured

```typescript
{
  truebizVerification: {
    status: 'APPROVED' | 'REVIEW' | 'REJECTED',
    verificationId: string,
    score: number,
    riskFlags: string[],
    timestamp: string,
    reviewReason?: string  // If REVIEW or REJECTED
  }
}
```

---

### Why Verify at Signup

- **Fraud Prevention**: Block high-risk merchants before account creation
- **Cost Optimization**: Avoid provisioning X-Series accounts for ineligible merchants
- **Compliance**: Meet "Know Your Business" (KYB) requirements early
- **User Experience**: Fast approval for legitimate businesses (~10 seconds)

### Integration Details

- See [TrueBiz Integration Analysis](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md) for complete implementation plan
- See [TrueBiz Verification API](../05-integrations/TRUEBIZ_VERIFICATION_API.md) for API reference

---

## Cohort Assignment

**Logic** (`lib/merchant-mock-data.ts:265-284`):

Automatic cohort assignment based on business size:

### Cohort Rules

**Self-Serve**:
- Revenue < $500K OR
- Locations < 3

**Assisted**:
- Revenue $500K-$2M OR
- Locations 3-10

**Managed**:
- Revenue ≥ $2M OR
- Locations ≥ 10

### Cohort Types

**Self-Serve**:
- **Criteria**: <$500K revenue OR <3 locations
- **Experience**: Fully automated self-service flow
- **Support**: Standard support (chat, email)
- **Specialist**: None assigned
- **Verification Cost**: Stripe Identity only (~$2.00/merchant)

**Assisted**:
- **Criteria**: $500K-$2M revenue OR 3-10 locations
- **Experience**: Sales-guided with self-checkout option
- **Support**: Free IC support available
- **Specialist**: Optional AE guidance
- **Verification Cost**: TrueBiz + Stripe Identity (~$4.50/merchant)

**Managed**:
- **Criteria**: $2M+ revenue OR 10+ locations
- **Experience**: White-glove implementation
- **Support**: Dedicated account manager
- **Specialist**: Required specialist engagement
- **Verification Cost**: Comprehensive verification + monitoring (~$9.50+/merchant)

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

### Current Implementation

- All cohorts see the same merchant-facing UI
- Cohort stored for future specialist assignment
- Future: Will affect specialist assignment and pricing

### Future Differentiation

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

## Account Provisioning

**Trigger**: After TrueBiz verification returns APPROVE

**What Happens**:

1. **Lightspeed X-Series Account Creation**:
   - New account created in Lightspeed POS system
   - Account ID generated
   - Account status: "PENDING_SETUP"

2. **Data Transfer**:
   - Business name, address, contact information
   - Cohort assignment
   - TrueBiz verification metadata

3. **Initial Configuration**:
   - Default settings applied
   - Welcome email sent
   - Dashboard access granted

4. **Redirect to Dashboard**:
   - User lands on `/dashboard`
   - Sees 6-task checklist
   - Can begin setup immediately

---

## Technical Implementation

### Key Technologies

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React

### Data Storage

**localStorage Keys**:
- `prequalificationData`: Account + business info from signup

```typescript
{
  businessName: string;
  email: string;
  password: string;
  businessCategory: string;
  businessWebsite: string;  // Used for TrueBiz business verification
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  annualRevenue: string;
  numberOfLocations: number;
  cohort: 'self-serve' | 'assisted' | 'managed';
  truebizVerification?: {
    status: 'APPROVED' | 'REVIEW' | 'REJECTED';
    verificationId: string;
    score: number;
    riskFlags: string[];
    timestamp: string;
  };
  createdAt: string;
}
```

### Component Architecture

**Page Components** (`app/**/*.tsx`):
- Use `'use client'` directive
- Manage route-level state
- Handle data loading and persistence
- Coordinate child components

**Form Components** (`components/get-started/*.tsx`):
- `AccountForm`: Page 1 account creation
- `BusinessForm`: Page 2 business information

**UI Primitives** (`components/ui/*.tsx`):
- shadcn/ui base components
- Button, Input, Card, Label, etc.
- Accessible by default (WCAG AA)

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

- Start with minimal information (Page 1)
- Gradually collect business details (Page 2)
- Fast verification (~10 seconds)
- Clear next steps

### Feedback & Validation

- Real-time validation on blur
- Inline error messages (no modals)
- Loading states for async actions
- Clear outcome messaging

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
- Forms stack vertically on mobile
- No horizontal scrolling

---

## Navigation Flow

```
Marketing Page (/)
      ↓
   [Get Started Button]
      ↓
Signup Page 1 (/get-started)
      ↓
   [Create Account Button]
      ↓
Signup Page 2 (/get-started)
      ↓
   [Continue to Setup Button]
      ↓
TrueBiz Verification (5-10s)
      ↓
   [APPROVED | REVIEW | REJECTED]
      ↓
If APPROVED:
  Cohort Assignment
      ↓
  X-Series Account Provisioning
      ↓
  Dashboard (/dashboard)
```

---

## Related Documentation

**Next Steps**:
- [User Flow 2: Dashboard and Payment Setup](./USER_FLOW_02_DASHBOARD_AND_PAYMENTS.md) - Dashboard overview and payment activation

**Technical Details**:
- [TrueBiz Integration Analysis](../05-integrations/TRUEBIZ_INTEGRATION_ANALYSIS.md)
- [TrueBiz Verification API](../05-integrations/TRUEBIZ_VERIFICATION_API.md)
- [Component Guide](../03-implementation/COMPONENT_GUIDE.md)

**Design Specifications**:
- [Design Specifications](./DESIGN_SPECIFICATIONS.md)
- [UI Copy Reference](./UI_COPY.md)

---

**Last Updated**: January 2025
**Version**: Current State (Prototype + TrueBiz Verification Planning)
**Maintainer**: Product & Engineering Teams
