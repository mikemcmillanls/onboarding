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
- On successful validation → Proceed to Page 2

---

### Page 2: Business Information with TrueBiz Data Enhancement

**Component**: `BusinessForm` (`components/get-started/business-form.tsx`)

**Data Collected**:
- Business category (dropdown, 15+ options)
- **Business website URL** (text input, URL format) - *Required for TrueBiz business data enhancement*
- **Business phone number** (text input, US format) - *Required for payment processing*
- **Business structure** (dropdown) - *Required to determine individual vs company account type*
  - Sole Proprietorship
  - LLC
  - Corporation (C-Corp or S-Corp)
  - Partnership
  - Non-profit
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
- Business phone: Must be valid US phone format (10 digits)
- Business structure: Must select one option
- ZIP code: Must match format `^\d{5}(-\d{4})?$`
- Number of locations: Must be ≥ 1

**User Experience**:
- Sectioned form with clear groupings:
  - Business Category
  - Business Website (with helper text: "We'll use this to enrich your business profile")
  - Business Phone
  - Business Structure (with helper text: "This determines your account type for payment processing")
  - Business Address (4 fields)
  - Business Size (revenue + locations)
- Real-time validation on blur
- Inline error messages
- "Back" button to return to Page 1 (preserves data)
- "Continue to Setup" button with loading state
- On submission → TrueBiz data enhancement runs → Cohort assigned → User redirected to dashboard

**Note**: No Stripe account is created during signup. TrueBiz enriches business data for pre-population. Official KYC/KYB verification happens later via Trulioo during dashboard tasks.

---

## TrueBiz Business Data Enhancement

**When**: After user clicks "Continue to Setup" on Page 2

**Purpose**: Enrich business profile data and validate business legitimacy to prevent fraud BEFORE account creation

**Note**: TrueBiz is NOT the official KYC/KYB verification provider. It's a data enrichment tool that validates and enhances business information. Official identity and business verification is handled by Trulioo during dashboard tasks.

### Future Implementation Flow

After user clicks "Continue to Setup", the following verification flow runs BEFORE account creation:

#### 1. TrueBiz Business Data Enhancement API Call (5-10 seconds)

**Enhancement Checks**:
- Validates business website domain exists and is active
- Checks business legitimacy and registration status
- Performs fraud detection and risk assessment
- Cross-references address with business records
- Enriches business profile with additional data
- Returns result: `APPROVE` / `REVIEW` / `REJECT`

**Provider**: TrueBiz (business data enrichment service via domain/URL lookup)

**Cost**: ~$0.50-$2.00 per lookup (estimated, custom pricing)

**What It's NOT**: This is not the official KYC/KYB compliance verification. That is handled by Trulioo during dashboard tasks.

---

#### 2. Enhancement Outcome Handling

**✅ APPROVED (Pass)**:
- Enhancement score meets threshold (e.g., ≥80/100)
- Business data enriched and pre-populated
- Cohort determination logic runs
- Lightspeed X-Series account provisioned
- Data saved with enhancement metadata
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

### Why Use TrueBiz at Signup

- **Fraud Prevention**: Block high-risk merchants before account creation
- **Cost Optimization**: Avoid provisioning X-Series accounts for ineligible merchants
- **Data Enrichment**: Pre-populate business data to reduce merchant data entry downstream
- **User Experience**: Fast validation for legitimate businesses (~10 seconds)

**Note**: This is NOT the official KYB/KYC compliance verification. Official verification is handled by Trulioo during dashboard tasks before purchase.

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

### Cohort Experience Differences

**Self-Serve**:
- Fully automated dashboard experience
- Standard support (chat, email)
- No specialist assignment
- Self-guided setup tasks

**Assisted**:
- Sales-guided with self-checkout option
- Specialist banner on dashboard with "Schedule a call" option
- Free IC support available
- Can still complete setup independently

**Managed**:
- White-glove implementation with specialist introduction
- Dedicated account manager assigned
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

## Data Captured During Signup

**Account Information (Page 1)**:
```typescript
{
  businessName: string;
  email: string;
  password: string;
}
```

**Business Information (Page 2)**:
```typescript
{
  businessCategory: string;
  businessWebsite: string;  // Used for TrueBiz business verification
  businessPhone: string;  // Required for payment processing
  businessStructure: 'sole_proprietorship' | 'llc' | 'corporation' | 'partnership' | 'non_profit';
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  annualRevenue: string;
  numberOfLocations: number;
}
```

**Generated Data**:
```typescript
{
  cohort: 'self-serve' | 'assisted' | 'managed';  // Auto-assigned based on revenue/locations
  truebizVerification: {
    status: 'APPROVED' | 'REVIEW' | 'REJECTED';
    verificationId: string;
    score: number;
    riskFlags: string[];
    timestamp: string;
  };
  createdAt: string;
}
```

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

