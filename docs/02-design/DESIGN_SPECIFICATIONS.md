# Lightspeed Merchant Onboarding: Design Specifications

## Document Overview

**Version:** 1.0
**Date:** October 10, 2025
**Design Lead:** Claude Design Lead Orchestrator
**Status:** Ready for Implementation

This document provides comprehensive UX/UI design specifications for the simplified 4-step merchant onboarding flow. It includes interaction patterns, component hierarchies, copy guidelines, and implementation guidance for the frontend development team.

---

## Table of Contents

1. [Design Philosophy & Principles](#design-philosophy--principles)
2. [Design System Foundation](#design-system-foundation)
3. [Step 1: Sign Up & Tell Us About Your Business](#step-1-sign-up--tell-us-about-your-business)
4. [Step 2: Set Up Your POS & Payments](#step-2-set-up-your-pos--payments)
5. [Step 3: Complete Purchase & Verification](#step-3-complete-purchase--verification)
6. [Step 4: Get Everything Ready](#step-4-get-everything-ready)
7. [Cross-Cutting Patterns](#cross-cutting-patterns)
8. [Component Library Specifications](#component-library-specifications)
9. [Responsive Design Guidelines](#responsive-design-guidelines)
10. [Accessibility Requirements](#accessibility-requirements)
11. [Animation & Transitions](#animation--transitions)
12. [Copy & Microcopy Guidelines](#copy--microcopy-guidelines)

---

## Design Philosophy & Principles

### Core Design Philosophy

**"Simple on the surface, intelligent underneath"**

The merchant sees a straightforward 4-step journey. Behind the scenes, we orchestrate complex workflows, verification processes, and intelligent routing. The design must hide this complexity while maintaining transparency about progress and next actions.

### Key Design Principles

#### 1. Invisible Cohorts
- All merchants see nearly identical UI regardless of cohort (self-serve, assisted, managed)
- Specialist support appears seamlessly as contextual assistance, not as a separate "tier"
- No "choose your plan" or "select support level" decision points
- The system adapts the experience based on merchant profile without making them aware

#### 2. Progressive Disclosure
- Show only what's needed at each moment
- Reveal complexity gradually as merchants progress
- Keep forms short and focused (max 5-7 fields per screen)
- Use multi-page forms with clear progress over single long forms
- Hide advanced options behind "Show more" or conditional reveals

#### 3. Clear Progress
- Merchants always know: "Step X of 4" and what comes next
- Each step has a clear completion state
- Progress is visible but not overwhelming
- Use step indicators consistently across all pages
- Show both macro progress (step 2 of 4) and micro progress (page 1 of 2)

#### 4. Merchant-Centered Language
- Use action-oriented, benefit-focused copy
- Avoid technical jargon and internal terminology
- Say "Set up your POS" not "Configure software licenses"
- Say "Get ready to take payments" not "Complete KYC verification"
- Always explain "why" when asking for sensitive information

#### 5. Trust Building
- Be transparent about waiting times and what's happening
- Explain why sensitive data is needed before collecting it
- Show security indicators (SSL, encryption messaging)
- Provide clear next steps during waiting states
- Never leave merchants wondering what happens next

#### 6. Contextual Help
- Help should be available but not intrusive
- Progressive help: tooltips → inline help → chat → specialist
- Self-serve merchants see support options as secondary actions
- Assisted merchants see specialist contact as primary option
- Help is always in context, never generic "contact support"

---

## Design System Foundation

### Visual Hierarchy

#### Typographic Scale

```
Hero (H1): 32px/40px - Bold - Page titles
Heading (H2): 24px/32px - Semibold - Section titles
Subheading (H3): 18px/24px - Semibold - Subsections
Body Large: 16px/24px - Regular - Primary content
Body: 14px/20px - Regular - Secondary content
Small: 12px/16px - Regular - Help text, captions
```

#### Color System

**Primary Colors:**
- Primary: #2563EB (Blue) - Actions, links, progress
- Primary Dark: #1E40AF - Hover states
- Primary Light: #DBEAFE - Backgrounds, highlights

**Semantic Colors:**
- Success: #10B981 - Completed states, confirmations
- Warning: #F59E0B - Pending review, attention needed
- Error: #EF4444 - Errors, validation failures
- Info: #3B82F6 - Informational messages

**Neutral Colors:**
- Gray 900: #111827 - Primary text
- Gray 700: #374151 - Secondary text
- Gray 500: #6B7280 - Tertiary text, placeholders
- Gray 300: #D1D5DB - Borders, dividers
- Gray 100: #F3F4F6 - Backgrounds
- White: #FFFFFF - Surfaces, cards

#### Spacing System

Using 4px base unit:
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

#### Border Radius

```
sm: 4px - Small elements, tags
md: 8px - Inputs, buttons, cards
lg: 12px - Large cards, modals
full: 9999px - Pills, avatars
```

### Layout Grid

**Desktop (1280px+):**
- 12-column grid
- 24px gutters
- Max content width: 1200px
- Centered layout with side margins

**Tablet (768px - 1279px):**
- 8-column grid
- 16px gutters
- Full width with 24px margins

**Mobile (<768px):**
- Single column
- 16px side margins
- Full width content

---

## Step 1: Sign Up & Tell Us About Your Business

### Overview

**Merchant Goal:** Create an account and provide basic information to get started
**Time Estimate:** 3-5 minutes
**Behind the Scenes:** KYB verification, cohort assignment, routing decisions

### User Flow Structure

```
Entry Point (Marketing/Pricing)
    ↓
Landing Page: "Get Started with Lightspeed"
    ↓
Page 1: Create Your Account (Account basics)
    ↓
Page 2: Tell Us About Your Business (Business details for KYB)
    ↓
Processing Screen (KYB verification)
    ↓
Outcome Routing:
    → Auto-Approved: "Great! Let's set up your POS" → Step 2
    → Needs Review: "We're reviewing your information" → Waiting State
    → High-Value: "You qualify for dedicated support" → Specialist Introduction
```

### Page 1: Create Your Account

#### Layout Structure

**Header:**
- Lightspeed logo (top left)
- "Need help? Chat with us" link (top right)
- Progress indicator: "Step 1 of 4: Account Setup"

**Content Area (centered, max-width 480px):**

**Hero Section:**
```
H1: "Get started with Lightspeed"
Subtitle: "Create your account and see if you qualify for payment processing"
```

**Form Section:**

```
Field 1: First Name
  Type: Text input
  Label: "First name"
  Validation: Required, min 2 chars

Field 2: Last Name
  Type: Text input
  Label: "Last name"
  Validation: Required, min 2 chars

Field 3: Email
  Type: Email input
  Label: "Work email"
  Placeholder: "you@yourbusiness.com"
  Validation: Required, valid email format
  Help text: "We'll send your login details here"

Field 4: Phone
  Type: Tel input
  Label: "Phone number"
  Placeholder: "(555) 123-4567"
  Validation: Required, valid phone format
  Help text: "For important updates about your account"

Field 5: Password
  Type: Password input
  Label: "Create a password"
  Validation: Min 8 chars, 1 uppercase, 1 number
  Show password strength indicator (weak/medium/strong)
  Toggle visibility icon

Field 6: Business Name
  Type: Text input
  Label: "Business name"
  Placeholder: "The name your customers see"
  Validation: Required, min 2 chars

Field 7: Business Category
  Type: Select dropdown
  Label: "What type of business do you have?"
  Options: [Restaurant, Retail, Services, Other...]
  Validation: Required

Field 8: Annual Revenue
  Type: Radio button group (horizontal on desktop, stacked on mobile)
  Label: "What's your approximate annual revenue?"
  Options:
    - Less than $250K
    - $250K - $500K
    - $500K - $1M
    - $1M - $2M
    - More than $2M
  Validation: Required
  Help text: "This helps us recommend the right setup for you"

Field 9: Number of Locations
  Type: Radio button group (horizontal on desktop, stacked on mobile)
  Label: "How many locations do you have?"
  Options:
    - 1
    - 2-5
    - 6-10
    - 11+
  Validation: Required
```

**Action Area:**
```
Primary Button: "Continue"
  Full width on mobile, fixed width (200px) on desktop
  Disabled until all required fields valid

Secondary Link: "Already have an account? Sign in"
```

**Footer:**
```
Small text: "By continuing, you agree to our Terms of Service and Privacy Policy"
Links to terms and privacy (opens in new tab)
```

#### Interaction Patterns

**Field Validation:**
- Real-time validation on blur (not on every keystroke)
- Show success checkmark icon on valid fields
- Show error state with icon and message below field
- Keep error message visible until corrected

**Password Strength Indicator:**
- Progress bar below password field
- Colors: Red (weak) → Yellow (medium) → Green (strong)
- Text label updates with strength level
- Requirements shown below: "At least 8 characters, 1 uppercase, 1 number"

**Revenue & Location Selection:**
- Radio buttons styled as selectable cards on desktop (easier to tap)
- Clear selected state with blue background and checkmark
- Hover state on interactive elements

**Form Submission:**
- Validate all fields on submit attempt
- If errors, scroll to first error and focus it
- Show loading spinner on button during submission
- Button text changes to "Creating your account..."

#### Responsive Behavior

**Desktop (1280px+):**
- Form centered, max-width 480px
- Radio buttons horizontal layout (4 columns for revenue, 4 for locations)
- Two-column for first/last name

**Tablet (768px-1279px):**
- Form centered, max-width 480px
- Radio buttons 2x2 grid
- First/last name stacked

**Mobile (<768px):**
- Full width form with 16px side margins
- All fields stacked vertically
- Radio buttons full width, stacked
- Button full width

### Page 2: Business Details for Verification

#### Layout Structure

**Header:**
- Same as Page 1
- Progress indicator: "Step 1 of 4: Account Setup - Page 2 of 2"

**Content Area (centered, max-width 480px):**

**Hero Section:**
```
H1: "Tell us about your business"
Subtitle: "We need these details to verify your business for payment processing"

Info Banner (light blue background):
  Icon: Shield with checkmark
  Text: "Your information is secure and encrypted. We use this to verify your
  business and comply with payment processing regulations."
  Link: "Why do we need this?"
```

**Form Section:**

```
Field 1: Legal Business Name
  Type: Text input
  Label: "Legal business name"
  Placeholder: "As registered with the government"
  Help text: "This may be different from your business name"
  Validation: Required, min 2 chars

Field 2: Business Structure
  Type: Select dropdown
  Label: "Business structure"
  Options:
    - Sole Proprietorship
    - Partnership
    - LLC (Limited Liability Company)
    - Corporation (C-Corp or S-Corp)
    - Non-profit
  Validation: Required

Field 3: Tax ID (Conditional based on structure)
  Type: Text input with masking
  Label: "Employer Identification Number (EIN)" OR "Social Security Number"
    (Label changes based on business structure selection)
  Placeholder: "XX-XXXXXXX" or "XXX-XX-XXXX"
  Help text: "Sole proprietors can use SSN. All other structures need an EIN."
  Validation: Required, valid format
  Show/hide toggle for sensitive data

Field 4: Business Address
  Type: Address autocomplete (Google Places or similar)
  Label: "Business address"
  Sub-fields when expanded:
    - Street address (Line 1)
    - Street address (Line 2) - Optional
    - City
    - State (dropdown)
    - ZIP code
  Validation: Required (all except Line 2)
  Help text: "Your registered business address"

Field 5: Business Phone
  Type: Tel input
  Label: "Business phone number"
  Placeholder: "(555) 123-4567"
  Validation: Required, valid phone format
  Pre-filled from Page 1 if same
```

**Action Area:**
```
Secondary Button: "Back"
  Outline style, returns to Page 1 with data preserved

Primary Button: "Submit Application"
  Full width on mobile, fixed width (200px) on desktop
  Disabled until all required fields valid
```

#### Processing Screen

After submitting Page 2, show full-screen loading state while KYB verification runs:

**Layout:**
```
Centered content:
  Animated spinner or progress animation
  H2: "Verifying your business..."
  Body text: "This usually takes just a few seconds"

Progress indicators (animated dots or steps):
  - Checking business details
  - Verifying payment eligibility
  - Setting up your account
```

**Duration:** 2-10 seconds typically

#### Outcome States

##### Auto-Approved (70%+ of merchants)

**Success Screen:**
```
Icon: Green checkmark in circle (animated entry)
H1: "Great! You're approved for Lightspeed Payments"
Body: "Your business qualifies for payment processing. Let's set up your POS system."

Info card:
  "What happens next?"
  1. Choose your software and hardware
  2. Complete your purchase
  3. Get everything set up and start taking payments

Primary Button: "Continue to Setup"
  → Routes to Step 2
```

##### High-Value Merchant (Assisted/Managed)

**Specialist Introduction Screen:**
```
Icon: User avatar with success badge
H1: "Great news! You qualify for dedicated support"
Body: "Based on your business size, we're assigning you a payment specialist
who will help you get set up."

Specialist Card:
  Photo placeholder or avatar
  "Your specialist will contact you within 2 hours"

Options:
  Primary Button: "Schedule a Call"
    → Opens calendar picker modal

  Secondary Link: "Prefer to continue on your own? Continue to setup"
    → Routes to Step 2 (self-serve path)

Additional info:
  "What your specialist will help with:"
  - Customized pricing for your business size
  - Hardware recommendations
  - Setup assistance
  - Ongoing support
```

##### Needs Review (Flagged for Review)

**Waiting State Screen:**
```
Icon: Clock or review icon (orange/amber)
H1: "We're reviewing your application"
Body: "Your business information is being reviewed by our team. This usually
takes 1-2 hours during business hours."

Info card:
  "What's happening?"
  "We review applications to ensure we can support your business type and
  comply with payment processing regulations."

Timeline:
  "Expected response: Within 2 hours"
  "We'll send you an email at [email] when approved"

Notification preferences:
  Checkbox: "Send me a text message when approved"

Primary Button: "Got it"
  → Returns to login page or dashboard waiting state

Secondary Link: "Questions? Chat with us"
```

##### Rejected (Ineligible)

**Rejection Screen:**
```
Icon: X in circle (red, but sympathetic design)
H1: "We can't approve your application right now"
Body: [Specific reason based on rejection cause]

Possible reasons:
  - "We don't currently support [business category] for payment processing."
  - "Your business location is in a restricted area."
  - "We need additional information to verify your business."

Info card (if applicable):
  "You can still use Lightspeed POS"
  "You can use our POS system with a different payment processor."
  Link: "View compatible payment processors"

Primary Button: "Contact Sales"
  → Opens contact form or schedules call

Secondary Link: "Back to homepage"
```

### State Management Requirements

**Data Persistence:**
- Save form data to local storage on every field change
- Restore data if user returns to page (within session)
- Clear sensitive data (SSN/EIN) from local storage after submit

**Navigation:**
- Allow "Back" navigation between pages without losing data
- Warn if user tries to close browser with unsaved changes
- Preserve cohort assignment in session/database

**Error Handling:**
- Network errors: Show retry option with saved data
- Validation errors: Clear messaging with correction guidance
- API errors: Fallback to "Contact support" with reference number

---

## Step 2: Set Up Your POS & Payments

### Overview

**Merchant Goal:** Configure software licenses and select hardware
**Time Estimate:** 10-20 minutes
**Behind the Scenes:** License provisioning, hardware compatibility verification, quote generation

### User Flow Structure

```
Entry from Step 1 (Approved)
    ↓
Dashboard View: Unified Setup Page
    ↓
Configure Software (locations & registers)
    ↓
Select Hardware (packages or custom)
    ↓
Review Quote (real-time pricing)
    ↓
Continue to Checkout → Step 3
```

### Unified Setup Dashboard

#### Layout Structure

**Header:**
- Progress: "Step 2 of 4: Set Up Your POS & Payments"
- Specialist banner (conditional - only for assisted/managed)

**Main Content Area (split layout on desktop, stacked on mobile):**

```
Two-section layout (60/40 split desktop, stacked mobile):

LEFT SECTION (60%): Configuration
  - Software Setup
  - Hardware Setup

RIGHT SECTION (40%): Quote Summary (sticky on scroll)
  - Running total
  - Item breakdown
  - CTA button
```

#### Specialist Banner (Assisted/Managed Cohorts Only)

**For Assisted Merchants:**
```
Banner (light blue background, full width):
  Avatar: [Specialist photo or placeholder]

  Text content:
    H3: "Your specialist [Name] is ready to help"
    Body: "Available for questions or to walk you through your setup"

  Actions (horizontal layout):
    Primary Button: "Call me now"
    Secondary Button: "Schedule a call"
    Tertiary Link: "I'll do this myself"

  Dismissible: X icon (top right) - collapses to small reminder
```

**For Managed Merchants:**
```
Banner (darker blue, full width):
  Avatar: [Account Manager photo]

  Text content:
    H3: "Your account manager [Name] is preparing your quote"
    Body: "Feel free to browse options. We'll have a custom quote ready within 24 hours."

  Actions:
    Primary Button: "Schedule a call"

  Status indicator: "Quote in progress"

  Browse mode: Can view options but checkout button disabled with tooltip
    "Your custom quote will be ready soon"
```

### Software Setup Section

```
Card Container:
  H2: "Software Setup"
  Body: "Configure your POS system"

  Field 1: Number of Locations
    Label: "How many locations will use Lightspeed?"
    Type: Number input with +/- buttons
    Default: 1
    Min: 1, Max: 100
    Help text: "Each physical location needs a license"

  Field 2: Registers per Location
    Label: "How many registers per location?"
    Type: Number input with +/- buttons
    Default: 1
    Min: 1, Max: 20
    Help text: "Registers are checkout stations or employee devices"

    Conditional (if locations > 1):
      Expandable option: "Different amounts per location?"
      → Shows breakdown input for each location

  Field 3: Add-ons (Optional)
    Checkbox: "I need eCommerce"
      Help text: "Sell online and sync with your POS"
      Adds $X/month to quote when checked

    Link: "View other add-ons" → Expands more options
      - Advanced reporting
      - Loyalty program
      - Gift cards
      - Inventory management
      (Each with checkbox and pricing)

  Live Pricing Indicator:
    "Software: $X/month for [N] locations, [M] registers"
    Updates in real-time as numbers change
    Color: Blue text, prominent but not intrusive
```

#### Interaction Patterns

**Number Inputs:**
- Large +/- buttons (min 44x44px touch target)
- Number can be typed directly
- Real-time validation (min/max)
- Immediate quote update on change

**Multi-location Configuration:**
- Default: Same number of registers for all locations
- "Different amounts?" expands to show:
  ```
  Location 1: [dropdown: 1-20 registers]
  Location 2: [dropdown: 1-20 registers]
  ...
  ```
- Auto-calculates total registers

**Add-ons:**
- Checkboxes styled as cards with icons
- Show pricing clearly on each option
- Hover state shows more details in tooltip
- Selected state: blue border, checkmark

### Hardware Setup Section

```
Card Container:
  H2: "Hardware Setup"
  Body: "Choose what you need to run your business"

  Tab Navigation:
    Tab 1: "Recommended Packages" (default selected)
    Tab 2: "I have existing hardware"

  [Content changes based on tab]
```

#### Tab 1: Recommended Packages

```
View selector:
  Radio toggle: "View as: [Grid] [List]"

Package Cards (3-4 options):
  Each card:
    Image: Hardware photo or illustration
    Badge: "Most Popular" or "Best Value" (conditional)

    H3: Package name
      Examples:
      - "Essential Package"
      - "Complete Package"
      - "Multi-register Package"

    Body: "What's included:"
      - Item list with icons
      - 1x POS Terminal
      - 1x Payment Terminal
      - 1x Receipt Printer
      - Cash Drawer

    Pricing:
      Large text: "$X one-time"
      Small text: "or $Y/month financing"

    Action:
      Radio button: "Select this package"
      Link: "Customize items"

    Expandable details:
      Link: "See full specifications"
      → Expands to show detailed specs for each item

Selection behavior:
  - Only one package can be selected
  - Selected state: Blue border, large checkmark, subtle shadow
  - "Customize" opens item-by-item selection modal

Quantity adjustment (after selection):
  "Need multiple packages?"
  Number input: Quantity
  "Total: [N] packages = $X"
```

#### Tab 2: Existing Hardware

```
Content:
  H3: "Check your hardware compatibility"
  Body: "Tell us what you already have and we'll verify it works with Lightspeed"

  Form:
    Field 1: Device Type
      Dropdown: "What type of device?"
      Options:
        - iPad/Tablet
        - Payment Terminal
        - Receipt Printer
        - Cash Drawer
        - Barcode Scanner
        - Other

    Field 2: Make/Model
      Text input with autocomplete
      Label: "Make and model"
      Placeholder: "e.g., iPad Pro 11-inch, 2023"
      Help text: "Found on device label or documentation"

    Button: "Check Compatibility"

  Results (after check):
    Compatible:
      Icon: Green checkmark
      "Great! [Device] works with Lightspeed"
      "You'll need to [brief setup instruction]"

    Not Compatible:
      Icon: Yellow warning
      "[Device] isn't compatible with Lightspeed"
      "We recommend: [Alternative device]"
      Button: "Add to cart"

    Uncertain:
      Icon: Info
      "We need more details about this device"
      Button: "Upload a photo" or "Chat with hardware specialist"

  Add Multiple Devices:
    Button: "+ Add another device"
    → Adds another device entry form

  Missing Items Notice:
    If no payment terminal:
      Banner: "You'll need a payment terminal to accept payments"
      Card: Recommended terminal with "Add to cart" button
```

### Quote Summary Sidebar (Sticky)

```
Card Container (sticky position on desktop):
  H3: "Your Quote"

  Software Section:
    Label: "Software (monthly)"
    Breakdown:
      - [N] locations × $X = $Y
      - [M] registers × $X = $Y
      - Add-ons: $Z
    Subtotal: "$X/month"

  Hardware Section:
    Label: "Hardware (one-time)"
    Breakdown:
      - [Package name] × [qty] = $Y
      Or item-by-item if customized:
      - POS Terminal × 2 = $X
      - Payment Terminal × 2 = $Y
      - Receipt Printer × 2 = $Z
    Subtotal: "$X one-time"

  Payments Section:
    Label: "Lightspeed Payments"
    Text: "$0 setup fee + 2.6% + 10¢ per transaction"
    Link: "See full pricing details" → Opens modal with rate breakdown

  Divider

  Total Section:
    Large text:
      "$X due today"
      "$Y/month starting [date]"

  Actions:
    Primary Button (full width):
      "Continue to Checkout"
      Disabled if KYB still pending
        Tooltip: "Waiting for business verification (usually 1-2 hours)"

    Secondary actions:
      Link: "Save quote for later"
        → Emails quote, saves in account
      Link: "Need help deciding? Chat with us"

  Trust indicators (small text at bottom):
    Icons + text:
    - "30-day money-back guarantee"
    - "Free shipping"
    - "Secure checkout"
```

#### Responsive Behavior

**Desktop (1280px+):**
- Two-column layout: 60% content, 40% quote sidebar
- Quote sidebar sticky on scroll
- Hardware packages in grid (2-3 columns)

**Tablet (768px-1279px):**
- Two-column layout: 65% content, 35% quote sidebar
- Quote sidebar scrolls with page (not sticky due to space)
- Hardware packages in grid (2 columns)

**Mobile (<768px):**
- Single column, stacked
- Quote summary collapses to bottom sticky bar:
  ```
  Sticky Footer:
    Total: "$X due today + $Y/month"
    Button: "Review & Checkout"
    → Taps to expand full quote details or proceed
  ```
- Hardware packages full width, stacked

### Gating & Error States

**KYB Pending (from Step 1):**
```
Blocking overlay on quote summary:
  Icon: Clock
  Text: "We're finalizing your payment processing approval"
  Subtext: "Usually 1-2 hours. You can configure your setup now."
  Checkout button disabled with clear reason

Email notification sent when approved:
  "Your payment processing is approved! Complete your purchase now."
  CTA button in email returns to this page
```

**Configuration Incomplete:**
- Checkout button disabled
- Tooltip: "Please select hardware to continue"
- Validation message: "You'll need at least [required items] to get started"

**Out of Stock:**
```
Badge on hardware card: "Ships in 2 weeks"
Modal on selection:
  "This item is currently backordered"
  Options:
    - "Wait for this item (ships [date])"
    - "Choose alternative: [Similar item]"
    - "Continue without this item"
```

---

## Step 3: Complete Purchase & Verification

### Overview

**Merchant Goal:** Pay for their setup and verify identity
**Time Estimate:** 5 minutes
**Behind the Scenes:** Payment processing, KYC verification, underwriting, account activation

### User Flow Structure

```
Entry from Step 2 (Configured)
    ↓
Checkout Page
    ↓
Review Order Summary
    ↓
Enter Payment Information
    ↓
Enter Shipping Details
    ↓
Identity Verification Form
    ↓
Submit Order
    ↓
Processing...
    ↓
Confirmation Screen
    ↓
Automatic routing to Step 4
```

### Checkout Page Layout

**Header:**
- Progress: "Step 3 of 4: Complete Purchase"
- Logo (links back to dashboard)

**Layout: Single column, centered (max-width 720px on desktop)**

### Section 1: Order Review

```
Card Container:
  H2: "Review your order"

  Expandable sections (accordion style):

  Software Summary:
    Header: "Software Subscription"
    Price: "$X/month"
    [Expand/Collapse toggle]

    Details when expanded:
      - [N] locations × $Y = $Z
      - [M] registers × $Y = $Z
      - Add-ons:
        - eCommerce: $X/month
      Subtotal: "$X/month"

  Hardware Summary:
    Header: "Hardware & Equipment"
    Price: "$X one-time"
    [Expand/Collapse toggle]

    Details when expanded:
      Item list with images (thumbnails):
      - POS Terminal (iPad Stand) × 2 = $X
      - Payment Terminal (Verifone) × 2 = $Y
      - Receipt Printer (Epson TM) × 2 = $Z
      Subtotal: "$X one-time"

  Payments Summary:
    Header: "Lightspeed Payments"
    Price: "$0 setup + 2.6% + 10¢ per transaction"
    [Expand/Collapse toggle]

    Details when expanded:
      Transaction rate breakdown:
      - Card-present: 2.6% + 10¢
      - Card-not-present: 2.9% + 30¢
      - Keyed/manual: 3.4% + 30¢
      Link: "See full rate card"

  Divider (prominent)

  Total Section:
    Large text (H2 size):
      "Total due today: $X"
      "Then $Y/month starting [date]"

    Small text:
      "First month prorated. Billed monthly after that."

  Link: "Need to change something? Edit configuration"
    → Returns to Step 2 with current selections preserved
```

### Section 2: Payment Information

```
Card Container:
  H2: "Payment information"
  Body: "How would you like to pay?"

  Tab Navigation:
    Tab 1: "Credit Card" (default)
    Tab 2: "ACH/Bank Transfer" (for higher amounts)

  [Tab 1 Content: Credit Card]

  Security Badge:
    Icon: Lock
    Text: "Your payment information is encrypted and secure"
    Logos: SSL, PCI Compliant badges

  Form:
    Field 1: Card Number
      Label: "Card number"
      Input: With card type detection and icon
      Placeholder: "1234 5678 9012 3456"
      Validation: Required, valid card number
      Live detection: Show Visa/Mastercard/Amex icon as typed

    Field 2-3 (side by side on desktop):
      Expiration Date:
        Label: "Expiration"
        Input: MM/YY format with masking
        Placeholder: "MM / YY"
        Validation: Required, future date

      CVV:
        Label: "CVV"
        Input: 3-4 digits with masking
        Placeholder: "123"
        Help icon with tooltip: "3-digit code on back of card"
        Validation: Required, 3-4 digits

    Field 4: Name on Card
      Label: "Cardholder name"
      Input: Text
      Placeholder: "John Smith"
      Validation: Required

  Save Option:
    Checkbox: "Save this card for future billing"
      Help text: "Your monthly subscription will charge to this card"
```

### Section 3: Billing & Shipping

```
Card Container:
  H2: "Billing address"

  Checkbox: "Same as business address"
    Checked by default
    When checked: Shows business address from Step 1 (read-only, with "Edit" link)
    When unchecked: Shows address input fields

  If unchecked - Address form:
    Field 1: Street Address
    Field 2: Apt/Suite (optional)
    Field 3-5: City, State, ZIP (side by side)

Divider

Card Container:
  H2: "Shipping address"
  Body: "Where should we send your hardware?"

  Checkbox: "Ship to business address"
    Checked by default
    When checked: Shows business address (read-only, with "Edit" link)
    When unchecked: Shows address input fields

  If multi-location:
    Radio options:
      - Ship everything to main address
      - Ship to each location separately

    If "separately" selected:
      Expandable sections for each location:
        Location 1: [Name from Step 2]
        Address: [Input fields]
        Hardware for this location:
          - Item 1
          - Item 2
```

### Section 4: Identity Verification

```
Card Container:
  Warning banner (important, not alarming):
    Icon: Shield
    H3: "Identity verification required"
    Body: "To comply with payment processing regulations, we need to verify
    business ownership. This is standard for all payment processors and keeps
    your business secure."
    Link: "Why is this required?"
      → Opens modal with detailed explanation

  Form:
    H3: "Business representative"
    Body: "The person responsible for this account"

    Field 1: Full Legal Name
      Label: "Full legal name"
      Placeholder: "John Michael Smith"
      Validation: Required, min 3 chars

    Field 2: Date of Birth
      Label: "Date of birth"
      Input: Date picker or MM/DD/YYYY inputs
      Validation: Required, age 18+
      Help text: "Must be 18 or older"

    Field 3: Social Security Number
      Label: "Social Security Number"
      Input: Masked (XXX-XX-XXXX)
      Placeholder: "XXX-XX-XXXX"
      Validation: Required, valid SSN format
      Show/hide toggle
      Security note: "Encrypted and used only for verification"

    Field 4: Home Address
      Label: "Home address"
      Sub-fields: Street, City, State, ZIP
      Validation: Required
      Help text: "Must be your residential address"

    Field 5: Role/Title
      Label: "Your role at the business"
      Dropdown: Owner, CEO, CFO, Manager, etc.
      Validation: Required

  Conditional Section (if business structure requires):
    H3: "Business owners"
    Body: "Anyone who owns 25% or more of the business"

    Owner 1 (accordion):
      Same fields as representative:
      - Full name
      - Ownership percentage (number input with %)
      - Date of birth
      - SSN
      - Home address
      - Role

    Button: "+ Add another owner"
      → Adds another owner section

    Link: "Only one owner? That's me"
      → Removes additional owner sections
```

### Section 5: Terms & Consent

```
Card Container:
  Checkboxes (all required):

  Checkbox 1:
    "I agree to the Lightspeed Terms of Service"
    Link: "Read terms" (opens in modal or new tab)

  Checkbox 2:
    "I agree to the Lightspeed Payments Processing Agreement"
    Link: "Read agreement"

  Checkbox 3:
    "I acknowledge the Privacy Policy"
    Link: "Read policy"

  Checkbox 4:
    "I authorize Lightspeed to verify the information provided and run a credit check"

  Small text:
    "By checking these boxes, you confirm that you have authority to enter into
    this agreement on behalf of the business."
```

### Action Area

```
Sticky bottom bar (on mobile) or fixed at bottom of card (desktop):

  Total reminder (collapsed on mobile):
    "Total: $X due today + $Y/month"

  Primary Button (large):
    "Complete Purchase"
    Full width on mobile, fixed width (280px) on desktop
    Disabled until all required fields valid and all checkboxes checked

    Loading state:
      Spinner + "Processing your order..."
      Disable all form fields
      Don't allow navigation away

  Trust indicators (icon row):
    - Secure checkout icon
    - Money-back guarantee icon
    - Support available icon

  Small text:
    "Questions? Call us at 1-800-XXX-XXXX or chat with us"
```

### Processing State

After clicking "Complete Purchase":

```
Full-page overlay (can't dismiss):
  Centered content:
    Large animated spinner or progress animation

    H2: "Processing your order..."
    Body: "Please don't close this page"

    Progress steps (animated):
      1. Verifying payment... [spinner or checkmark]
      2. Activating your account... [spinner or checkmark]
      3. Preparing your hardware... [spinner or checkmark]

    Estimated time: "Usually takes 10-30 seconds"
```

Duration: 5-30 seconds typically

### Confirmation Screen

Success state after processing:

```
Centered content (max-width 640px):
  Icon: Large green checkmark (animated entry)
  H1: "Order confirmed! Here's what happens next"

  Order reference:
    "Order #123456"
    "Confirmation email sent to [email]"

  Timeline (vertical steps with icons):

    Step 1 (completed):
      Icon: Checkmark
      "Software account activated"
      Details: "We've sent your login credentials to [email]"
      Button: "Access your dashboard" (secondary)

    Step 2 (in progress):
      Icon: Box/shipping icon
      "Hardware shipping to [address]"
      Details: "Expected delivery: [date range]"
      Text: "We'll email you tracking info within 24 hours"

    Step 3 (in progress):
      Icon: Shield/verification icon
      "Payment processing activating"
      Details: "Ready in 24-48 hours"
      Text: "You'll be able to accept payments as soon as this is complete"

    Step 4 (pending):
      Icon: Checklist icon
      "Next: Get everything ready"
      Details: "We'll guide you through setup"

  Info card (light blue background):
    H3: "While you wait..."
    Body: "Explore your new Lightspeed dashboard and familiarize yourself with
    the system. You can start adding products and setting up your locations."
    Button: "Explore Lightspeed" (opens X-Series dashboard)

  Primary action:
    Button: "Go to Setup Checklist"
    → Routes to Step 4
    Large, prominent placement

  Secondary actions:
    Link: "Download order confirmation (PDF)"
    Link: "Need help? Contact support"
```

### Error States

**Payment Declined:**
```
Modal overlay:
  Icon: Yellow warning (not red error - less alarming)
  H3: "Payment unsuccessful"
  Body: "Your card was declined. Would you like to try another payment method?"

  Possible reason (if provided by processor):
    "Reason: Insufficient funds" or "Reason: Invalid card number"

  Actions:
    Primary Button: "Try another card"
      → Returns to payment form with data cleared

    Secondary Link: "Contact your bank"

    Tertiary Link: "Need help? Chat with us"

  Note: Order configuration is preserved, don't make them reconfigure
```

**KYC Rejection:**
```
Modal or page:
  Icon: Orange warning
  H3: "Additional verification needed"
  Body: [Specific explanation based on rejection reason]

  Examples:
    - "We need additional documents to verify your business"
    - "The information provided doesn't match our records"
    - "Your business category requires enhanced verification"

  Actions required (list):
    - Upload government-issued ID
    - Provide business license
    - Submit bank statement

  Upload interface:
    Drag-and-drop or file picker
    Accepted formats: PDF, JPG, PNG
    Max size: 10MB per file

  Primary Button: "Submit documents"

  Secondary Link: "Questions? Talk to our verification team"

  Timeline: "Review typically takes 24 hours"

  Note: If payment was processed, it's held/escrowed until verification complete
```

---

## Step 4: Get Everything Ready

### Overview

**Merchant Goal:** Complete final setup tasks and start taking payments
**Time Estimate:** 2-5 days
**Behind the Scenes:** Hardware activation, bank verification, data migration

### User Flow Structure

```
Entry from Step 3 (Order Confirmed)
    ↓
Onboarding Dashboard (Checklist View)
    ↓
Monitor automated tasks:
  - Account created (auto-complete)
  - Software activated (auto-complete)
  - Hardware shipped (auto-complete when shipped)
    ↓
Complete manual tasks:
  - Set up hardware (when delivered)
  - Connect bank account (anytime)
  - Import data (optional)
    ↓
All critical tasks complete
    ↓
Run test transaction
    ↓
Go live → Active Merchant
```

### Onboarding Dashboard Layout

**Header:**
- Progress: "Step 4 of 4: Get Everything Ready"
- Welcome message with merchant name
- Overall progress: "3 of 6 tasks complete"

**Specialist Section (Assisted/Managed cohorts only):**
```
Banner (persistent at top):
  Avatar: [IC/specialist photo]

  For Assisted:
    H3: "Need help? [Name] is here for you"
    Body: "Book a setup session or work through these tasks at your own pace"
    Button: "Schedule session"
    Link: "I'm good, thanks"

  For Managed:
    H3: "Your implementation specialist: [Name]"
    Body: "Your next session: [Date/Time]"
    Button: "Reschedule" or "Join session" (if time is now)
    Link: "View session details"
```

**Main Content: Task Checklist (Single column, max-width 840px)**

### Task Card Structure

Each task follows this structure:

```
Card Container:
  Header (always visible):
    Left side:
      Status icon (24x24px):
        ✅ Green checkmark - Completed
        🔵 Blue dot - In progress
        ⏳ Gray clock - Waiting (dependency not met)
        ⬜ Gray square - Not started (unlocked)

      Task number and title:
        H3: "[Number]. [Task Title]"

    Right side:
      Status badge:
        "Complete" (green)
        "In progress" (blue)
        "Waiting for delivery" (gray)
        "Not started" (gray)

      Estimated time:
        Small text: "~5 min" or "~2 days"

  Body (expandable):
    [Task-specific content - details below for each task]

  Expand/Collapse toggle:
    Icon: Chevron down/up
    Expanded by default for current task
    Collapsed for completed tasks
    Locked/disabled for waiting tasks
```

### Task 1: Account Created (Auto-complete)

```
Status: Completed (green checkmark)

Collapsed view:
  "1. Account created"
  Badge: "Complete"

Expanded view:
  Icon: User account checkmark
  Body: "Your Lightspeed account has been created and activated"

  Info row:
    "Email: [merchant email]"
    Link: "Reset password"

  Action:
    Button: "Open Lightspeed Dashboard"
      Opens X-Series in new tab
      Style: Secondary (outline)
```

### Task 2: Software Activated (Auto-complete)

```
Status: Completed (green checkmark)

Collapsed view:
  "2. Software activated"
  Badge: "Complete"

Expanded view:
  Icon: Software/app icon
  Body: "Your POS software is ready to use"

  Summary:
    "Plan: [N] locations, [M] registers"
    "Monthly cost: $X/month"
    Link: "View billing details"

  Info card:
    H4: "Start exploring"
    Body: "While you wait for hardware, you can:"
    List:
      - Add products to your catalog
      - Set up your locations and registers
      - Configure taxes and payment settings
      - Add employee accounts

  Action:
    Button: "Go to Lightspeed"
      Opens X-Series
      Style: Secondary
```

### Task 3: Hardware Shipped (Auto-complete when shipped)

```
Status: Waiting → In Progress → Complete

Waiting state (before shipment):
  Icon: Gray clock
  "3. Hardware shipped"
  Badge: "Processing order"

  Body: "Your hardware order is being prepared"
  Estimated ship date: "[Date]"
  "We'll update you when it ships"

In Progress state (shipped but not delivered):
  Icon: Blue box/truck icon
  "3. Hardware shipped"
  Badge: "In transit"

  Body:
    "Your hardware is on the way!"
    Shipping info card:
      "Tracking number: [Number]"
      Button: "Track shipment" → Opens carrier tracking
      "Expected delivery: [Date range]"

    What's in the box:
      Item list with images:
      - POS Terminal × 2
      - Payment Terminal × 2
      - Receipt Printer × 2
      - Accessories

    Link: "View full packing list"

Completed state (delivered):
  Icon: Green checkmark
  "3. Hardware delivered"
  Badge: "Complete"

  Body: "Delivered on [Date] to [Address]"
  Link: "View delivery confirmation"

  CTA: "Ready to set up? Continue to next task"
    → Expands Task 4 automatically
```

### Task 4: Set Up Your Hardware (Manual)

```
Status: Locked until Task 3 complete → Unlocked → In Progress → Complete

Locked state:
  Icon: Gray lock
  "4. Set up your hardware"
  Badge: "Waiting for delivery"

  Body: "This task will unlock when your hardware is delivered"
  Estimated: "[Date]"

Unlocked state:
  Icon: Blue dot (not started)
  "4. Set up your hardware"
  Badge: "Not started"
  Time estimate: "~15-20 min"

  Body:
    "Your hardware has arrived! Let's get it connected."

    Button: "Start setup"
      → Marks task as in progress, expands content

In Progress state:
  Icon: Blue dot (pulsing animation)
  "4. Set up your hardware"
  Badge: "In progress"

  Body:
    Multi-step guide with visual aids:

    Sub-task checklist:
      □ 1. Plug in your POS terminal
        Expandable:
          - Photo/diagram showing setup
          - Step-by-step text instructions
          - Video link: "Watch setup video (2 min)"
          - Checkbox: "Done"

      □ 2. Connect your payment terminal
        Expandable:
          - Photo/diagram
          - Pairing instructions
          - Troubleshooting: "Terminal not connecting?"
          - Checkbox: "Done"

      □ 3. Set up receipt printer
        Expandable:
          - Connection instructions
          - Test print button
          - Checkbox: "Done"

      □ 4. Set up cash drawer (if applicable)
        Expandable:
          - Connection instructions
          - Test open mechanism
          - Checkbox: "Done"

      □ 5. Run a test transaction
        Expandable:
          - "Let's make sure everything works"
          - Button: "Start test mode"
            → Opens guided test transaction flow
          - Instructions for test payment
          - Checkbox: "Test successful"

    Progress indicator:
      "3 of 5 steps complete"
      Progress bar visualization

  Actions:
    Primary Button: "Mark as complete"
      Enabled when all sub-tasks checked

    Secondary Link: "I need help with this"
      → Opens support chat with context
      Or (assisted): "Schedule setup session with [IC Name]"

  Troubleshooting section (expandable):
    "Common issues:"
    - Terminal won't pair → Solution
    - Printer not printing → Solution
    - Test payment failed → Solution
    Link: "More help articles"

Completed state:
  Icon: Green checkmark
  "4. Hardware set up"
  Badge: "Complete"

  Body: "All hardware connected and tested"
  Completed: "[Date]"

  Link: "Need to add more hardware?"
```

### Task 5: Connect Your Bank Account (Manual, Critical)

```
Status: Unlocked (can start anytime after Step 3) → In Progress → Verifying → Complete

Importance indicator:
  Badge: "Required for payouts" (orange/yellow)

Unlocked state:
  Icon: Blue dot
  "5. Connect your bank account"
  Badge: "Not started"
  Time estimate: "~3 min + 1-2 days verification"

  Body:
    Warning banner (informational, not alarming):
      Icon: Info
      "You can accept payments now, but payouts are held until your bank
      account is verified. This usually takes 1-2 business days."

    Button: "Connect bank account"
      → Expands form or opens modal

In Progress state (entering information):
  Icon: Blue dot
  "5. Connect your bank account"
  Badge: "In progress"

  Body:
    Security message:
      Icon: Lock
      "Your bank information is encrypted and secure"

    Form options (tabs):
      Tab 1: "Instant verification (recommended)"
        Plaid or similar integration
        Button: "Connect with Plaid"
        → Opens Plaid widget
        Benefits: "Instant verification, no waiting"

      Tab 2: "Manual entry"
        Form fields:
          - Account holder name
            Label: "Account holder name"
            Help: "Must match business name"

          - Bank name
            Label: "Bank name"
            Input with autocomplete

          - Routing number
            Label: "Routing number"
            Input: 9 digits with validation
            Help icon: "Where to find this" → Image overlay

          - Account number
            Label: "Account number"
            Input: With show/hide toggle
            Help icon: "Where to find this"

          - Account type
            Radio buttons: Checking / Savings

        Button: "Submit for verification"

  Actions:
    Primary Button: "Connect account"
    Secondary Link: "I'll do this later"

Verifying state (after submission):
  Icon: Orange clock (pulsing)
  "5. Connect your bank account"
  Badge: "Verifying"

  Body:
    If instant (Plaid):
      "Verifying your account... This usually takes a few seconds"
      Spinner

    If manual (micro-deposits):
      "Verification in progress"

      Timeline:
        Day 1: "We've sent 2 small deposits to your account"
        Day 2-3: "Check your bank for deposits (usually $0.01-$0.99)"
        Day 3: "Enter deposit amounts to verify"

      Current status: "Waiting for deposits to arrive"

      When deposits arrive (email notification):
        Form appears:
          "Enter the amounts of the two deposits:"
          Input 1: "Deposit 1: $0." [XX]
          Input 2: "Deposit 2: $0." [XX]

          Button: "Verify amounts"

          Help: "Can't find the deposits? Check with your bank"
          Link: "Wrong account? Change bank account"

  Error handling:
    If verification fails (wrong amounts):
      "Those amounts don't match. Please try again."
      "Attempts remaining: 2"
      After 3 failures: "Please contact support to verify manually"

Completed state:
  Icon: Green checkmark
  "5. Bank account connected"
  Badge: "Verified"

  Body:
    Success message:
      "Your bank account has been verified and payouts are now enabled"

    Info:
      "Bank: [Bank name]"
      "Account: ****[last 4 digits]"
      Link: "Change bank account"

    Payout info:
      "Payout schedule: Daily (next business day)"
      Link: "View payout settings"
```

### Task 6: Import Your Products & Customers (Manual, Optional)

```
Status: Unlocked (anytime) → In Progress → Complete or Skipped

Optional badge: "Optional - Skip if starting fresh"

Unlocked state:
  Icon: Gray square (optional indicator)
  "6. Import your products & customers"
  Badge: "Optional"
  Time estimate: "~10-30 min depending on data size"

  Body:
    "Moving from another POS system? We can help you migrate your data."

    Three options (card-style):

      Option 1: "Import from CSV file"
        Icon: Document/upload icon
        Body: "Upload your products and customers from a spreadsheet"
        Button: "Start import wizard"

      Option 2: "Connect another system"
        Icon: Plug/integration icon
        Body: "Import directly from Square, Shopify, or other platforms"
        Button: "View integrations"
        Coming soon badge if not yet available

      Option 3: "Start from scratch"
        Icon: Plus/new icon
        Body: "I'll add products manually or I'm a new business"
        Button: "Skip this step"

    Link: "Need help migrating data? Chat with specialist"

In Progress state (CSV import):
  Icon: Blue dot
  "6. Import your products & customers"
  Badge: "In progress"

  Body:
    Multi-step wizard:

    Step 1: Upload file
      "Upload your CSV file"
      Drag-and-drop area:
        "Drag file here or click to browse"
        "Accepted formats: .csv, .xlsx"
        "Max size: 25MB"

      Link: "Don't have a CSV? Download template"
      Link: "Need help exporting from your old system?"

    Step 2: Map fields
      "Match your columns to Lightspeed fields"

      Table showing:
        Your Column → Lightspeed Field
        [Dropdown for each mapping]

      Example:
        "Item Name" → "Product Name"
        "Price" → "Default Price"
        "SKU" → "SKU"
        "Category" → "Category"
        ...

      Auto-detect common mappings
      Button: "Continue to review"

    Step 3: Review & validate
      "Review your data before importing"

      Summary:
        "Found: [N] products, [M] customers"
        "[X] items ready to import"
        "[Y] items need attention"

      If errors:
        Expandable error list:
          "Row 15: Missing required field 'Price'"
          "Row 32: Invalid SKU format"
          ...

        Options:
          - Fix in CSV and re-upload
          - Skip problematic rows
          - Import what's valid, fix later

      Button: "Start import"

    Step 4: Importing
      Progress indicator:
        "Importing [N] items..."
        Progress bar: "320 of 500 complete"
        "This may take a few minutes"

      Don't allow navigation away during import

    Step 5: Complete
      Success message:
        "Import complete!"
        "[N] products imported successfully"
        "[M] customers imported successfully"

      If partial success:
        "[X] items couldn't be imported"
        Link: "Download error report"
        Option: "Fix and re-import failed items"

      Button: "View your products"
        Opens X-Series product catalog

      Button: "Done"
        Marks task complete

Completed state:
  Icon: Green checkmark
  "6. Data imported"
  Badge: "Complete"

  Body:
    "Successfully imported [N] products and [M] customers"
    Completed: "[Date]"
    Link: "Import more data"

Skipped state:
  Icon: Gray dash
  "6. Import products & customers"
  Badge: "Skipped"

  Body: "You chose to start from scratch"
  Link: "Changed your mind? Import now"
```

### Overall Progress Section

Located at bottom of checklist:

```
Progress Summary Card:
  Large circular progress indicator:
    "5 of 6 tasks complete"
    Visual ring showing 83% progress

  Status:
    Critical tasks status:
      ✅ Account created
      ✅ Software activated
      ✅ Hardware set up
      ⏳ Bank account (verifying)

    Optional tasks:
      ⏭️ Data import (skipped)

  If all critical tasks complete:
    Success banner:
      H3: "You're ready to go live!"
      Body: "Run a test transaction to make sure everything works"

      Button: "Run test transaction" (large, prominent)
        → Opens guided test flow in X-Series

  If waiting on tasks:
    Info banner:
      H3: "Almost there!"
      Body: "Complete the remaining tasks to start accepting payments"

      Next action indicator:
        "Next: [Specific task to complete]"
        Button: "Continue"
```

### Test Transaction Flow

When merchant clicks "Run test transaction":

```
Modal or inline guided flow:

  Step 1: Enter test mode
    "Let's run a test payment to make sure everything works"
    Button: "Enter test mode"
      → Activates test mode in X-Series

  Step 2: Create a test sale
    "Ring up a test sale in your POS"
    Instructions:
      - Add any item to cart
      - Choose payment type: Card
      - Use test card: 4242 4242 4242 4242

    Checkbox: "I've created the test sale"

  Step 3: Process payment
    "Process the payment on your terminal"
    Instructions:
      - Test card will work on live terminal
      - Payment will process but won't be charged

    System detects when test payment completes
    Automatic check: "Test payment successful!"

  Step 4: Verify
    Success screen:
      Icon: Green checkmark
      "Test successful! Your system is working perfectly"

      What was tested:
        ✅ POS software connected
        ✅ Payment terminal paired
        ✅ Transaction processed
        ✅ Receipt printed (if applicable)

      Button: "Exit test mode"
        → Returns to live mode

      Primary CTA:
        "Ready to take your first real payment?"
        Button: "Go live"
          → Marks onboarding complete
          → Celebration modal
```

### Completion Celebration

When all critical tasks complete and test successful:

```
Full-screen celebration modal:
  Confetti animation (subtle, not overwhelming)

  Icon: Trophy or celebration icon
  H1: "Congratulations! You're all set up"
  Body: "You're now ready to accept payments and run your business with Lightspeed"

  Summary card:
    "What you've accomplished:"
    ✅ Account created and verified
    ✅ Software configured
    ✅ Hardware set up and tested
    ✅ Bank account connected
    ✅ Test transaction successful

  Stats (if applicable):
    "Time to complete: [X] days"
    "You're in the top 20% of fastest setups!"

  Next steps:
    "What's next?"
    - Start taking real payments
    - Explore advanced features
    - Set up your team
    - Connect integrations

  Actions:
    Primary Button: "Start taking payments"
      Opens X-Series POS

    Secondary Link: "View help center"

    Feedback request:
      "How was your onboarding experience?"
      5-star rating + optional comment
      "Share feedback"
```

### Intervention & Stall Detection

**Automated Nudges (Email/SMS):**

Day 3 after Step 3 (hardware not set up):
```
Email subject: "Your Lightspeed hardware is ready to set up"
Body:
  "Hi [Name], we noticed you haven't set up your hardware yet.
  Need help? We're here to assist."

  CTA: "Continue setup" → Returns to Task 4
  Link: "Schedule a setup call"
```

Day 7 after Step 3 (bank account not connected):
```
Email subject: "Don't forget to connect your bank account"
Body:
  "You can accept payments now, but you'll need to connect your bank account
  to receive payouts."

  Warning: "Payments are currently being held"
  CTA: "Connect bank account" → Returns to Task 5
```

Day 14 (onboarding incomplete, no progress):
```
Email subject: "Need help finishing your setup?"
Body:
  "We're here to help! Let's get you up and running."

  Offer: "Free setup call with a specialist"
  CTA: "Schedule call"

  For high-value merchants:
    Automatic IC assignment with proactive outreach call
```

**In-Dashboard Banners:**

If stalled on critical task:
```
Prominent banner at top of checklist:
  Icon: Friendly face or help icon
  H3: "Stuck on something?"
  Body: "Our team is here to help you complete your setup"

  Button: "Chat with us"
  Button: "Schedule a call"
```

---

## Cross-Cutting Patterns

### Progress Indicators

**Macro Progress (Step Level):**

```
Component: StepProgressIndicator
Location: Top of every page

Desktop layout (horizontal):

  [1] ————— [2] ————— [3] ————— [4]

  Step 1: Circle with "1" or checkmark
  Line: Solid if complete, dashed if upcoming
  Current step: Larger circle, blue background, pulsing animation
  Future steps: Gray outline, smaller

  Labels below:
    "Sign Up" "Setup" "Purchase" "Get Ready"

Mobile layout (compact horizontal):
  Step 1 of 4
  Progress bar showing 25%

  Or minimal version:
  [•••○] Step 2 of 4
```

**Micro Progress (Within Step):**

```
For multi-page forms (Step 1):
  Text: "Page 2 of 2"
  Or dots: [••○]
  Location: Below main step progress

For checklists (Step 4):
  "3 of 6 tasks complete"
  Circular progress ring
  Percentage: "50%"
```

### Form Patterns

**Field States:**

```
Default:
  Border: Gray (300)
  Label: Gray (700)
  Placeholder: Gray (500)

Focus:
  Border: Blue (500), 2px
  Label: Blue (700)
  Glow: Blue shadow

Valid (after blur):
  Border: Green (500)
  Icon: Green checkmark (right side)

Error:
  Border: Red (500)
  Label: Red (700)
  Icon: Red X or alert (right side)
  Message: Red text below field

Disabled:
  Background: Gray (100)
  Border: Gray (300)
  Text: Gray (500)
  Cursor: not-allowed
```

**Field Sizes:**

```
Height:
  Small: 36px
  Medium (default): 44px
  Large: 52px

Use medium for all touch interfaces
Use large for primary actions on mobile
```

**Label Patterns:**

```
Preferred: Top-aligned labels
  Label above input (better for form scanning)
  4px spacing between label and input

Avoid: Floating labels (harder to scan multiple fields)

Required indicators:
  Asterisk * in label (red color)
  Or "Required" badge
  Or "Optional" for optional fields only

Help text:
  Below input, 4px spacing
  Gray (500) color
  12px font size
```

**Validation Timing:**

```
Don't validate on keystroke (too aggressive)

Do validate on blur (when field loses focus)
  Show success checkmark for valid fields
  Show error for invalid fields

Do validate on submit
  Scroll to first error
  Focus first error field
  Show summary of errors at top
```

### Error Handling

**Error Message Patterns:**

```
Format:
  [Icon] Clear description + Actionable solution

Good examples:
  "Email already in use. Try signing in instead or use a different email."
  "Card declined. Please check your card details or try another card."
  "This field is required. Please enter your business name."

Bad examples:
  "Error 400" (no context)
  "Invalid input" (not specific)
  "Email is invalid" (no solution)
```

**Error Placement:**

```
Field-level errors:
  Below the field
  Connected to field with aria-describedby
  Icon + text

Form-level errors:
  Top of form
  Dismissible banner
  List of errors with jump links

Page-level errors:
  Modal or full-screen message
  For critical failures (payment processing, etc.)
```

**Error Recovery:**

```
Always provide:
  - Clear explanation of what went wrong
  - Specific action user can take
  - Alternative path if available
  - Support contact option

Preserve user data:
  - Don't clear form on error
  - Save to local storage
  - Allow retry without re-entry
```

### Loading States

**Buttons:**

```
Loading state:
  Disabled: true
  Spinner: Replaces icon or prepends text
  Text: Changes to present continuous
    "Continue" → "Loading..."
    "Complete Purchase" → "Processing..."

Maintain button size (don't shift layout)
```

**Page/Section Loading:**

```
Skeleton screens (preferred):
  Show layout structure with pulsing placeholders
  Maintain page structure
  Better than spinners for perceived performance

Spinners:
  Use for short waits (<3 seconds)
  Centered with descriptive text below
  "Loading your configuration..."

Progress indicators:
  Use for longer processes (>5 seconds)
  Show percentage or steps
  "Processing payment: Step 2 of 3"
```

**Optimistic Updates:**

```
Where safe, update UI immediately:
  - Form field changes
  - Selection changes
  - Non-critical actions

Show success state immediately
Revert if API returns error with clear message
```

### Empty States

**No Data Yet:**

```
Icon: Friendly illustration
Heading: Encouraging message
Body: Explanation and next action

Example (no products):
  Icon: Package box illustration
  H3: "No products yet"
  Body: "Add your first product to get started selling"
  Button: "Add product"
  Link: "Or import from CSV"
```

**Error/Failure State:**

```
Icon: Relevant error icon (not scary)
Heading: What happened
Body: Why it happened and what to do
Action: Retry or alternative

Example (failed to load):
  Icon: Disconnected icon
  H3: "Couldn't load your data"
  Body: "Check your connection and try again"
  Button: "Retry"
  Link: "Or refresh the page"
```

### Success States

**Inline Success:**

```
Checkmark icon (green)
Success text (green)
Brief confirmation message

Auto-dismiss after 3-5 seconds
Or manual dismiss option
```

**Page-level Success:**

```
Full success screen:
  Large checkmark animation
  Heading: Congratulatory message
  Body: Summary of what was completed
  Next action button

Don't auto-redirect immediately
Give merchant moment to read and feel accomplished
```

### Modals & Overlays

**Modal Structure:**

```
Overlay: Black with 40% opacity
Modal container: White, rounded corners, shadow
Max-width: 600px (desktop)
Full-screen on mobile (bottom sheet or full modal)

Header:
  Close X (top right)
  Title (H2 or H3)
  Optional subtitle

Body:
  Content (max-height with scroll)

Footer:
  Actions (right-aligned on desktop)
  Primary button + Secondary button/link
```

**Modal Behavior:**

```
Open animation: Fade in + scale from 0.95
Close animation: Fade out + scale to 0.95
Duration: 200ms

Can close by:
  - X button
  - Escape key
  - Click outside (for non-critical modals)

Can't close if:
  - Processing payment/critical action
  - Unsaved changes (show warning first)
```

**When to Use Modal vs Page:**

```
Use modal:
  - Quick actions (under 30 seconds)
  - Confirmation dialogs
  - Single-field forms
  - Image/detail preview

Use page:
  - Multi-step processes
  - Long forms (>5 fields)
  - Complex content requiring focus
```

### Tooltips & Help Text

**Tooltip Pattern:**

```
Trigger: Info icon (circle with 'i')
Placement: Prefer top or right (avoid covering content)
Delay: Show after 200ms hover
Dismiss: Remove on mouse out or tap outside

Content:
  Max-width: 240px
  Concise explanation (1-2 sentences)
  No actions (use popover if action needed)

Style:
  Dark background (gray 900)
  White text
  Small arrow pointing to trigger
```

**Inline Help Text:**

```
Location: Below field or section
Style: Smaller font, gray color
Purpose: Clarify expected input, provide context

Example:
  Field: Phone number
  Help: "We'll only call for important account updates"
```

**Contextual Help Links:**

```
Link: "Why do we need this?" or "Learn more"
Action: Opens modal or expands inline content
Content: Detailed explanation with visuals if helpful
```

---

## Component Library Specifications

### Core Components for Implementation

#### 1. Button Component

```typescript
Properties:
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger'
  size: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode (left or right)
  onClick: () => void

Variants:
  Primary:
    Background: Blue (500)
    Text: White
    Hover: Blue (600)
    Active: Blue (700)

  Secondary:
    Background: White
    Border: Blue (500)
    Text: Blue (500)
    Hover: Blue (50) background

  Tertiary:
    Background: Transparent
    Text: Blue (500)
    Hover: Blue (50) background

  Danger:
    Background: Red (500)
    Text: White
    Hover: Red (600)

States:
  Disabled:
    Opacity: 0.5
    Cursor: not-allowed

  Loading:
    Spinner replaces content
    Disabled: true
    Width maintained
```

#### 2. Input Component

```typescript
Properties:
  type: 'text' | 'email' | 'tel' | 'password' | 'number'
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  icon?: ReactNode (left or right)

Features:
  - Auto-focus on error
  - Show/hide for password
  - Format masking for phone, SSN, etc.
  - Validation on blur
  - Success state after valid input
```

#### 3. Select/Dropdown Component

```typescript
Properties:
  label: string
  options: Array<{value: string, label: string}>
  value: string
  onChange: (value: string) => void
  error?: string
  helpText?: string
  required?: boolean
  searchable?: boolean (for long lists)

Features:
  - Keyboard navigation
  - Type-ahead search
  - Custom option rendering
  - Group support
```

#### 4. Radio Button Group Component

```typescript
Properties:
  name: string
  options: Array<{value: string, label: string, description?: string}>
  value: string
  onChange: (value: string) => void
  layout: 'horizontal' | 'vertical' | 'grid'
  error?: string

Variants:
  Card style (for visual choices):
    - Larger touch target
    - Visual selection state
    - Optional icon/image per option

  Standard style:
    - Compact radio buttons
    - Text labels
```

#### 5. Checkbox Component

```typescript
Properties:
  label: string | ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string

Features:
  - Large touch target (44x44px)
  - Indeterminate state support
  - Rich label support (links, formatting)
```

#### 6. Progress Indicator Component

```typescript
Properties:
  currentStep: number
  totalSteps: number
  steps: Array<{label: string, status: 'complete' | 'current' | 'upcoming'}>
  variant: 'horizontal' | 'vertical' | 'compact'

Responsive:
  Desktop: Full horizontal with labels
  Tablet: Horizontal with abbreviated labels
  Mobile: Compact "Step X of Y" with progress bar
```

#### 7. Card Component

```typescript
Properties:
  title?: string
  subtitle?: string
  children: ReactNode
  padding?: 'none' | 'small' | 'medium' | 'large'
  shadow?: boolean
  border?: boolean
  hoverable?: boolean (for interactive cards)

Variants:
  Standard: White background, rounded corners
  Elevated: With shadow
  Outlined: With border, no shadow
  Interactive: Hover state, cursor pointer
```

#### 8. Modal Component

```typescript
Properties:
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  footer?: ReactNode (action buttons)
  closeOnOverlay?: boolean (default true)
  closeOnEscape?: boolean (default true)

Features:
  - Focus trap (keyboard focus stays in modal)
  - Scroll lock on body
  - Proper ARIA attributes
  - Animation (fade + scale)
```

#### 9. Banner/Alert Component

```typescript
Properties:
  variant: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string | ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  action?: {label: string, onClick: () => void}

Variants:
  Info: Blue background
  Success: Green background
  Warning: Yellow/orange background
  Error: Red background
```

#### 10. Task Card Component (Checklist)

```typescript
Properties:
  number: number
  title: string
  status: 'completed' | 'in-progress' | 'waiting' | 'not-started'
  timeEstimate?: string
  children: ReactNode (task content)
  expandable?: boolean
  defaultExpanded?: boolean

Features:
  - Status icon updates automatically
  - Expand/collapse animation
  - Progress indicators for sub-tasks
  - Conditional content based on status
```

#### 11. Quote Summary Component

```typescript
Properties:
  softwareItems: Array<LineItem>
  hardwareItems: Array<LineItem>
  oneTimeTotal: number
  monthlyTotal: number
  onEdit?: () => void
  onCheckout?: () => void
  checkoutDisabled?: boolean
  checkoutDisabledReason?: string

Features:
  - Live updates as configuration changes
  - Expandable sections
  - Sticky position on desktop
  - Collapsible on mobile
```

#### 12. Address Input Component

```typescript
Properties:
  value: Address
  onChange: (address: Address) => void
  autocomplete?: boolean (Google Places integration)
  label: string
  required?: boolean

Features:
  - Autocomplete with Google Places API
  - Manual entry fallback
  - Validation (valid address format)
  - Pre-fill from previous entries
```

---

## Responsive Design Guidelines

### Breakpoints

```
Mobile: 0 - 767px
Tablet: 768px - 1279px
Desktop: 1280px+
Large Desktop: 1920px+ (max content width still applies)
```

### Layout Adaptations by Step

**Step 1 (Signup Forms):**
- Mobile: Single column, full width fields, stacked radio buttons
- Tablet: Single column, centered form, 2-column for name fields
- Desktop: Single column, centered form (max-width 480px)

**Step 2 (Setup Configuration):**
- Mobile: Stacked layout, quote summary in sticky bottom bar
- Tablet: Stacked layout, quote summary as expandable section
- Desktop: Two-column (60/40), quote summary sticky sidebar

**Step 3 (Checkout):**
- Mobile: Single column, full width, sticky total bar at bottom
- Tablet: Single column, centered (max-width 720px)
- Desktop: Single column, centered (max-width 720px)

**Step 4 (Checklist):**
- Mobile: Single column, full width task cards
- Tablet: Single column, max-width 840px
- Desktop: Single column, max-width 840px

### Touch Target Sizes

```
Minimum: 44x44px for all interactive elements on touch devices
Preferred: 48x48px for primary actions

Apply to:
  - Buttons
  - Links (with padding)
  - Checkboxes/radio buttons
  - Form fields (height)
  - Icon buttons
```

### Typography Scaling

```
Desktop:
  H1: 32px → H2: 24px → H3: 18px → Body: 16px

Mobile:
  H1: 24px → H2: 20px → H3: 16px → Body: 14px

Line height increases slightly on mobile for readability:
  Desktop: 1.5
  Mobile: 1.6
```

### Spacing Adjustments

```
Reduce spacing on mobile:
  Desktop: 24px margins → Mobile: 16px
  Desktop: 32px section spacing → Mobile: 24px
  Desktop: 48px between major sections → Mobile: 32px

Increase touch spacing:
  Between form fields: Minimum 16px on mobile
  Between radio/checkbox options: Minimum 12px on mobile
```

### Navigation Patterns

**Desktop:**
- Persistent header with all navigation elements
- Side-by-side layouts where appropriate

**Mobile:**
- Simplified header (logo + minimal controls)
- Hamburger menu if multiple nav items needed
- Bottom navigation for multi-step forms
- Swipe gestures for multi-page forms (optional enhancement)

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1
- UI elements: Minimum 3:1
- Don't rely on color alone to convey information

**Keyboard Navigation:**
- All interactive elements reachable by Tab
- Logical tab order (follows visual flow)
- Visible focus indicators (outline or highlight)
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for radio groups and dropdowns

**Screen Reader Support:**
- Proper heading hierarchy (H1 → H2 → H3, no skips)
- Descriptive link text (avoid "click here")
- Alt text for all images
- ARIA labels for icon buttons
- ARIA-describedby for field errors and help text
- ARIA-live regions for dynamic content updates
- Role attributes for custom components

**Forms:**
- Labels associated with inputs (for/id or aria-label)
- Required fields marked with aria-required
- Error messages announced (aria-invalid + aria-describedby)
- Fieldsets and legends for grouped inputs
- Autocomplete attributes for personal data fields

**Focus Management:**
- Focus first error field on validation failure
- Focus modal content on open
- Return focus to trigger on modal close
- Focus new content after page transitions
- Skip links for main content

### Visual Accessibility

**Text:**
- Minimum font size: 14px (16px preferred)
- Maximum line length: 80 characters
- Line height: 1.5 minimum
- Avoid all-caps for body text (harder to read)
- Allow text zoom to 200% without breaking layout

**Motion:**
- Respect prefers-reduced-motion
- Provide option to disable animations
- No auto-playing videos or carousels
- Avoid rapid flashing (seizure risk)

**Forms:**
- Show errors inline and at top of form
- Don't remove error until corrected
- Success confirmation for completed actions
- Clear instructions before fields, not just in placeholders

### Testing Checklist

**Manual Testing:**
- [ ] Navigate entire flow with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast with tool
- [ ] Test at 200% zoom
- [ ] Test with reduced motion enabled
- [ ] Test with high contrast mode

**Automated Testing:**
- Use axe or similar tool in development
- Run Lighthouse accessibility audit
- Validate HTML for semantic correctness
- Check ARIA usage with linting tools

---

## Animation & Transitions

### Animation Principles

**Purpose-Driven:**
- Only animate when it improves understanding
- Guide attention to important changes
- Smooth transitions between states
- Reduce perceived wait times

**Performance:**
- Use CSS transforms (translate, scale, rotate) not position
- Use opacity not visibility when transitioning
- Avoid animating layout properties (width, height, margin)
- Keep animations under 400ms
- 60fps target

**Accessibility:**
- Respect prefers-reduced-motion
- Provide instant alternative to animations
- Don't rely on animation to convey information

### Specific Animations

**Page Transitions:**
```css
Duration: 300ms
Easing: ease-in-out

Entry:
  opacity: 0 → 1
  transform: translateY(20px) → translateY(0)

Exit:
  opacity: 1 → 0
  transform: translateY(0) → translateY(-20px)
```

**Modal Open/Close:**
```css
Duration: 200ms
Easing: ease-out (open), ease-in (close)

Open:
  Overlay: opacity 0 → 0.4
  Modal: opacity 0 → 1, scale(0.95) → scale(1)

Close:
  Reverse of open
```

**Success States:**
```css
Checkmark animation:
  Duration: 400ms
  Draw SVG path from 0% → 100%
  Easing: ease-out
  Scale pulse: 1 → 1.1 → 1 (200ms)
```

**Loading Spinners:**
```css
Rotation: Continuous 360deg
Duration: 1s linear infinite
Use CSS animation not JS for smoothness
```

**Form Field Validation:**
```css
Error shake:
  Duration: 400ms
  translateX: 0 → -10px → 10px → 0
  Repeat: 2 times
  Easing: ease-in-out

Success:
  Checkmark fade in: 200ms
  Optional: subtle green border pulse
```

**Progress Indicators:**
```css
Progress bar fill:
  transition: width 300ms ease-out

Pulsing dot:
  opacity: 0.4 → 1 → 0.4
  Duration: 1.5s infinite
  Easing: ease-in-out
```

**Collapsible Sections (Accordion):**
```css
Duration: 300ms
Easing: ease-in-out

Expand:
  max-height: 0 → [content height]
  opacity: 0 → 1

Collapse:
  Reverse

Chevron rotation: 0deg → 180deg
```

**Hover States:**
```css
Duration: 150ms
Easing: ease-out

Button:
  background-color transition

Card:
  box-shadow transition
  transform: translateY(0) → translateY(-2px)

Link:
  color transition
```

**Skeleton Loading:**
```css
Shimmer effect:
  Linear gradient moving left to right
  Duration: 1.5s infinite
  Colors: gray-200 → gray-300 → gray-200
```

---

## Copy & Microcopy Guidelines

### Voice & Tone

**Characteristics:**
- Friendly but professional
- Clear and direct
- Encouraging without being cheesy
- Confident, not pushy
- Helpful, not condescending

**Examples:**

Good: "Let's get your business set up"
Bad: "Congratulations on choosing the #1 POS system in the world! Let's begin your amazing journey!"

Good: "Your hardware is on the way. Expected delivery: Oct 15-17"
Bad: "We're excited to ship your order! Your awesome new hardware will arrive soon!"

Good: "Need help? Chat with us"
Bad: "Facing challenges? Our world-class support team is standing by!"

### Writing Patterns

**Headers (H1, H2):**
- Action-oriented: "Set up your POS & payments"
- Benefit-focused: "Get everything ready to accept payments"
- Direct: "Complete your purchase"
- Avoid: "Step 2: Configuration" (too technical)

**Body Text:**
- Short sentences (under 20 words)
- Active voice: "Choose your hardware" not "Hardware should be chosen"
- Second person: "Your business" not "The business"
- Explain why when asking for sensitive data

**Button Labels:**
- Verb + noun: "Continue to checkout" not just "Continue"
- Specific action: "Connect bank account" not "Submit"
- Present tense: "Save quote" not "Saving quote"
- Avoid generic: "OK", "Submit", "Next"

**Error Messages:**
- State what's wrong clearly
- Provide actionable solution
- Stay calm and helpful

Format: [What happened] + [How to fix]

Examples:
- "Email already in use. Try signing in instead or use a different email."
- "Card declined. Please check your card details or try another card."
- "This field is required. Please enter your business name."

**Help Text:**
- Answer "why do I need to provide this?"
- Keep under 15 words if possible
- Use for clarification, not repetition of label

Examples:
- "We'll send your login details here"
- "Must match your government registration"
- "This helps us recommend the right setup"

**Success Messages:**
- Acknowledge accomplishment
- State what happens next
- Keep brief and clear

Examples:
- "Great! You're approved for Lightspeed Payments"
- "Order confirmed! Here's what happens next"
- "Hardware set up successfully"

### Sensitive Topics

**Money:**
- Be clear and upfront about costs
- No hidden fees
- Explain payment terms clearly
- "$X due today + $Y/month starting [date]"
- Show total prominently

**Identity Verification:**
- Explain why before asking for SSN/DOB
- Reassure about security and encryption
- State what it's used for
- Link to detailed privacy information

Example:
"We need this to verify your identity and comply with payment processing regulations. Your information is encrypted and secure."

**Rejections:**
- Be direct but empathetic
- Explain specific reason
- Offer alternative if possible
- Provide support contact

Example:
"We can't approve your application right now because [specific reason]. You can [alternative path] or contact us at [phone] for help."

**Waiting/Delays:**
- Set clear expectations: "Usually takes 1-2 hours"
- Explain what's happening: "We're reviewing your information"
- Provide timeline: "Expected by [date/time]"
- Offer way to check status or get notified

### Terminology Consistency

**Use Merchant-Friendly Terms:**
- "Business" not "merchant" (in user-facing copy)
- "Locations" not "sites" or "stores"
- "Registers" not "POS terminals" or "devices"
- "Payment terminal" not "card reader" or "pinpad"
- "Set up" not "configure" or "provision"

**Avoid Jargon:**
- Don't say: KYB, KYC, underwriting, cohort, SKU
- Do say: Business verification, identity verification, review process, product code

**Internal vs External Terms:**

Internal (docs, APIs):
- Cohort (self-serve, assisted, managed)
- KYB/KYC verification
- SKU
- Provisioning

External (user-facing):
- Support level (implied, not labeled)
- Business/identity verification
- Product
- Setup or activation

---

## Design Decision Rationale

### Why This Flow Order?

**Step 1 (Signup) before Step 2 (Configuration):**
- Collect business profile early to enable intelligent routing
- Run KYB during signup to gate hardware purchase appropriately
- Allow cohort assignment before showing pricing/options
- Create account first so configuration is saved automatically

**Step 2 (Configuration) before Step 3 (Purchase):**
- Let merchants see full cost before committing
- Allow time to decide on hardware without purchase pressure
- Enable specialist consultation before purchase (assisted cohorts)
- Generate quote that can be saved or emailed

**Step 3 (Purchase) before Step 4 (Setup):**
- Activate software account immediately upon payment
- Ship hardware right away to reduce time-to-first-transaction
- Run KYC during checkout (all data already collected)
- Enable merchants to start exploring software while hardware ships

**Step 4 (Setup) after purchase:**
- Hardware arrival triggers setup phase naturally
- All systems activated, merchant just needs to configure
- Can track progress and intervene if stalled
- Clear checklist of remaining tasks

### How Cohorts Remain Invisible

**UI Sameness:**
- All merchants see the same 4-step structure
- Same forms, same flows, same pages
- Same dashboard and checklist

**Specialist Scaffolding:**
- Self-serve: No specialist shown, help is secondary option
- Assisted: Specialist banner appears, optional engagement
- Managed: Specialist prominent, but same underlying flow

**Progressive Disclosure of Support:**
- Doesn't ask merchant to "choose support level"
- System determines need and surfaces help automatically
- Merchant experiences it as "helpful system" not "tiered service"

**Pricing Appears the Same:**
- All merchants see transparent pricing
- Custom quotes shown in same interface (managed)
- No "Basic vs Pro vs Enterprise" plans visible

### Where Specialists Appear

**Step 1 Outcome:**
- High-value merchants see specialist introduction
- Option to schedule call or continue alone
- Doesn't block progress, just offers help

**Step 2 Configuration:**
- Assisted: Banner at top with specialist contact
- Managed: Banner indicates custom quote in progress
- Self-serve: No specialist shown

**Step 4 Setup:**
- Assisted: "Need help?" banner with specialist option
- Managed: Dedicated specialist section with scheduled sessions
- Self-serve: General "Chat with us" option

### Edge Case Handling

**KYB Rejection:**
- Handled in Step 1 with clear messaging
- Prevents wasted time configuring and purchasing
- Offers appeal process or alternative path
- Refund if payment already processed (shouldn't happen)

**Payment Declined:**
- Handled in Step 3 with retry option
- Preserves configuration, merchant doesn't restart
- Multiple payment method options
- Support escalation after multiple failures

**Hardware Out of Stock:**
- Detected in Step 2 before checkout
- Shows expected ship date upfront
- Offers alternatives or ability to wait
- Splits shipment if some items available

**Bank Verification Failure:**
- Non-blocking: Merchant can accept payments, payouts held
- Clear instructions to correct or retry
- Alternative: Instant verification via Plaid
- Support escalation after 3 failures

**Merchant Stalls:**
- Automated email nudges (day 3, 7, 14)
- In-dashboard help offers
- IC assignment for high-value merchants
- System detects lack of progress and intervenes

### Progressive Disclosure Examples

**Instead of showing all fields at once:**
- Page 1: Basic account info
- Page 2: Business details for verification
- Step 3: Identity verification only when purchasing

**Instead of showing all hardware upfront:**
- Start with packages (simple choice)
- Expand to individual items if needed
- Show advanced options behind "Show more"

**Instead of explaining entire onboarding upfront:**
- Focus on current step only
- Show next step after current completes
- Full roadmap available but not forced

**Instead of all tasks visible immediately:**
- Unlock tasks as dependencies complete
- Show waiting state for future tasks
- Expand current task, collapse completed

---

## Implementation Guidance for Frontend Team

### Project Structure Recommendation

```
/components
  /onboarding
    /step1-signup
      AccountCreationForm.tsx
      BusinessDetailsForm.tsx
      ProcessingScreen.tsx
      OutcomeScreens.tsx
    /step2-setup
      SoftwareConfiguration.tsx
      HardwareSelection.tsx
      QuoteSummary.tsx
      SpecialistBanner.tsx
    /step3-checkout
      OrderReview.tsx
      PaymentForm.tsx
      ShippingForm.tsx
      IdentityVerification.tsx
      ConfirmationScreen.tsx
    /step4-checklist
      OnboardingDashboard.tsx
      TaskCard.tsx
      TaskList.tsx
      TestTransactionFlow.tsx
  /shared
    /forms
      Input.tsx
      Select.tsx
      RadioGroup.tsx
      Checkbox.tsx
      AddressInput.tsx
    /ui
      Button.tsx
      Card.tsx
      Modal.tsx
      Banner.tsx
      ProgressIndicator.tsx
      Tooltip.tsx
    /layout
      Header.tsx
      Container.tsx
      Grid.tsx

/lib
  /validation
    schemas.ts (Zod or Yup)
    validators.ts
  /api
    onboarding-api.ts
  /utils
    formatting.ts
    helpers.ts
  /constants
    copy.ts (all UI text)
    routes.ts

/hooks
  useOnboarding.ts
  useFormValidation.ts
  useKYBStatus.ts

/types
  merchant.ts
  onboarding.ts
  api.ts

/styles
  globals.css (Tailwind)
  animations.css
```

### State Management Approach

**Recommended: React Context + Local Storage**

```typescript
OnboardingContext:
  - Current step
  - Merchant profile data
  - Configuration selections
  - Quote details
  - Task completion status
  - Cohort assignment

Persist to localStorage:
  - Form data (non-sensitive)
  - Configuration selections
  - Current step/progress

Clear from localStorage:
  - Sensitive data (SSN, card numbers) after submit
  - All data after successful completion
```

**API State: React Query or SWR**
- Fetch onboarding status
- Submit form data
- Poll for KYB/KYC status
- Update task completion
- Cache responses appropriately

### Form Validation Strategy

**Use Zod for Schema Validation:**

```typescript
Example for Step 1 Page 1:
const accountCreationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  businessName: z.string().min(2, "Business name is required"),
  businessCategory: z.string().min(1, "Please select a business category"),
  annualRevenue: z.string().min(1, "Please select your revenue range"),
  locationCount: z.string().min(1, "Please select number of locations")
});
```

**Validate on Blur:**
```typescript
<Input
  onBlur={() => validateField('email')}
  error={errors.email}
/>
```

**Validate on Submit:**
```typescript
const handleSubmit = async (data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    setErrors(result.error.flatten());
    scrollToFirstError();
    return;
  }
  await submitForm(data);
};
```

### API Integration Points

**Step 1:**
- POST /api/onboarding/signup (create account + KYB)
- GET /api/onboarding/kyb-status (poll for verification)
- POST /api/cohort/assign (cohort determination)

**Step 2:**
- GET /api/hardware/catalog (fetch available hardware)
- POST /api/hardware/compatibility (check existing hardware)
- POST /api/quote/generate (create quote)
- GET /api/specialists/availability (for assisted cohorts)

**Step 3:**
- POST /api/orders/create (process payment)
- POST /api/kyc/submit (identity verification)
- GET /api/orders/:id/status (check order status)
- POST /api/accounts/provision (X-Series setup)

**Step 4:**
- GET /api/onboarding/status (fetch task completion)
- POST /api/tasks/:id/complete (mark task done)
- POST /api/bank-accounts/add (submit bank info)
- POST /api/bank-accounts/verify (verify micro-deposits)
- POST /api/data/import (CSV upload)
- GET /api/hardware/activation-status (check devices)

### Testing Strategy

**Unit Tests:**
- Form validation logic
- Utility functions
- Component rendering

**Integration Tests:**
- Multi-page form flows
- API interactions
- State management

**E2E Tests (Playwright or Cypress):**
- Complete onboarding flow (all cohorts)
- Error handling scenarios
- Responsive behavior
- Accessibility checks

**Critical Paths to Test:**
- Self-serve signup → configure → purchase → setup
- High-value merchant with specialist introduction
- KYB rejection and retry
- Payment declined and retry
- Hardware out of stock handling
- Bank verification with micro-deposits

### Performance Considerations

**Code Splitting:**
- Split by step (lazy load each step component)
- Split by cohort (specialist components only for assisted/managed)
- Split large libraries (chart libraries, PDF generators)

**Image Optimization:**
- Use Next.js Image component
- Lazy load images below fold
- Serve WebP with fallback
- Compress all images

**Bundle Size:**
- Tree-shake unused libraries
- Use dynamic imports for heavy components
- Analyze bundle with webpack-bundle-analyzer

**API Optimization:**
- Debounce real-time quote updates (300ms)
- Cache catalog/static data
- Prefetch next step data
- Optimistic updates where safe

### Accessibility Implementation

**ARIA Attributes:**
```tsx
<Input
  aria-label="Email address"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : "email-help"}
/>
{helpText && <span id="email-help">{helpText}</span>}
{error && <span id="email-error" role="alert">{error}</span>}
```

**Keyboard Navigation:**
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && !disabled) submit();
};
```

**Focus Management:**
```tsx
// Focus first error on validation failure
useEffect(() => {
  if (errors.length > 0) {
    const firstError = Object.keys(errors)[0];
    document.getElementById(firstError)?.focus();
  }
}, [errors]);

// Restore focus on modal close
const previousFocus = useRef<HTMLElement>();
useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement as HTMLElement;
  } else {
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

**Screen Reader Announcements:**
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Animation Implementation

**CSS Transitions:**
```css
.button {
  transition: background-color 150ms ease-out, transform 150ms ease-out;
}

.button:hover {
  transform: translateY(-2px);
}

.modal {
  animation: modalEntry 200ms ease-out;
}

@keyframes modalEntry {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**Respect Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React Transitions:**
```tsx
import { Transition } from '@headlessui/react'

<Transition
  show={isOpen}
  enter="transition ease-out duration-200"
  enterFrom="opacity-0 scale-95"
  enterTo="opacity-100 scale-100"
  leave="transition ease-in duration-150"
  leaveFrom="opacity-100 scale-100"
  leaveTo="opacity-0 scale-95"
>
  {/* Content */}
</Transition>
```

---

## Next Steps for Design Handoff

### Design Assets to Create

1. **High-Fidelity Mockups:**
   - All 4 steps in multiple states (empty, filled, error)
   - All cohort variations (self-serve, assisted, managed)
   - All responsive breakpoints (mobile, tablet, desktop)
   - All error and success states

2. **Interactive Prototype:**
   - Clickable prototype in Figma or similar
   - Show transitions and animations
   - Demonstrate responsive behavior
   - Showcase specialist integration points

3. **Component Library in Figma:**
   - All components from specifications
   - All variants and states
   - Auto-layout for responsive behavior
   - Design tokens (colors, spacing, typography)

4. **Flow Diagrams:**
   - User flow for each cohort
   - Decision trees (KYB outcomes, payment results)
   - System flow (what happens behind scenes)

5. **Copywriting Document:**
   - All UI text in spreadsheet
   - Error messages
   - Success messages
   - Help text and tooltips
   - Email templates for notifications

### Collaboration with Frontend Team

**Kickoff Meeting:**
- Walk through entire flow
- Explain design decisions
- Discuss technical constraints
- Align on component approach

**Regular Design Reviews:**
- Review implementation in progress
- Provide feedback on fidelity
- Adjust design if technical constraints arise
- Test together (accessibility, responsive, UX)

**Design QA:**
- Review staging environment
- Check against design specs
- Test all states and edge cases
- Validate copy and microcopy

**Handoff Artifacts:**
- This design specification document
- Figma file with inspect mode enabled
- Component library documentation
- Copy spreadsheet
- Flow diagrams

---

## Summary & Key Takeaways

### Design Goals Achieved

1. **Invisible Cohorts:** Self-serve, assisted, and managed merchants experience the same core flow with specialist support appearing seamlessly where needed.

2. **Progressive Disclosure:** Information revealed step-by-step, with each step focused on a single goal. Complex backend processes hidden from merchants.

3. **Clear Progress:** Merchants always know where they are (Step X of 4) and what comes next. Task-based checklist in Step 4 shows clear completion status.

4. **Merchant-Centered Language:** Action-oriented copy focused on merchant benefits. Technical terms translated to plain language. Explanations provided for sensitive data requests.

5. **Trust Building:** Transparent timelines, security indicators, clear explanations, and helpful error messages build confidence throughout the journey.

### Critical UX Patterns

- **Multi-page forms** with progress indicators (Step 1)
- **Real-time quote updates** with sticky summary (Step 2)
- **Familiar eCommerce checkout** with clear total (Step 3)
- **Task-based checklist** with progressive unlock (Step 4)
- **Contextual specialist integration** (assisted/managed cohorts)
- **Gating mechanisms** (KYB before hardware purchase)
- **Clear waiting states** with expected timelines
- **Comprehensive error handling** with recovery paths

### Design System Foundation

- Established typography, color, spacing systems
- Component specifications ready for implementation
- Responsive patterns defined for all breakpoints
- Accessibility requirements documented
- Animation guidelines for consistency

### Implementation Priorities

**Phase 1 (MVP):**
- Complete Step 1-4 for self-serve path
- Core components (Button, Input, Card, Modal, etc.)
- Basic responsive behavior
- Essential error handling

**Phase 2:**
- Specialist integration (assisted/managed paths)
- Advanced interactions (animations, transitions)
- Enhanced error handling
- Performance optimization

**Phase 3:**
- Polish (micro-interactions, advanced animations)
- Accessibility refinements
- Edge case handling
- Analytics integration

---

## Appendix: Design Decisions Log

### Decision: Multi-page vs. Single-page Form (Step 1)

**Chosen:** Multi-page (2 pages)

**Rationale:**
- Reduces cognitive load (fewer fields visible at once)
- Separates account creation from business verification
- Allows progress saving between pages
- Better mobile experience (less scrolling)
- Higher completion rates in research

**Trade-off:** Requires one extra click, but worth it for clarity

### Decision: Configuration Before Purchase (Step 2)

**Chosen:** Separate configuration and checkout steps

**Rationale:**
- Merchants need time to evaluate hardware options
- Allows specialist consultation before purchase
- Quote can be saved/emailed for later
- Reduces purchase anxiety (clear cost before committing)
- Enables hardware compatibility checking

**Trade-off:** Adds a step, but necessary for complex configurations

### Decision: Sticky Quote Summary (Step 2)

**Chosen:** Sticky sidebar on desktop, sticky footer on mobile

**Rationale:**
- Always visible during configuration
- Real-time updates reinforce changes
- Easy access to checkout CTA
- Reduces need to scroll to see total

**Trade-off:** Takes screen space, but worth it for visibility

### Decision: Identity Verification in Checkout (Step 3)

**Chosen:** Collect KYC data during purchase, not earlier

**Rationale:**
- Reduces friction in early steps
- Only collect when merchant commits to purchase
- Standard for payment processors (expected pattern)
- Can run verification asynchronously after purchase

**Trade-off:** Makes checkout longer, but necessary for compliance

### Decision: Task-Based Checklist (Step 4)

**Chosen:** Expandable task cards with sub-steps

**Rationale:**
- Clear completion status
- Progressive disclosure (expand to see details)
- Feels accomplishment as tasks complete
- Works well for both self-serve and assisted

**Trade-off:** More complex to build, but better UX

### Decision: Payout Hold Until Bank Verified

**Chosen:** Allow payment acceptance immediately, hold payouts

**Rationale:**
- Faster time-to-first-transaction (key metric)
- Merchants can test and start using immediately
- Bank verification takes 1-2 days (too long to block)
- Low fraud risk with identity already verified in Step 3

**Trade-off:** Risk of fraud, mitigated by KYC and monitoring

---

## Document Version History

**Version 1.0 - October 10, 2025**
- Initial comprehensive design specification
- All 4 steps designed and documented
- Component library specified
- Responsive and accessibility guidelines included
- Copy and interaction patterns defined
- Ready for frontend implementation

---

**End of Design Specifications Document**

For questions or clarifications, contact the design team.
