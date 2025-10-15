# User Flow 2: Dashboard Experience

Documentation for the merchant dashboard - the central hub after signup where merchants complete setup tasks.

---

## Document Overview

This document describes the dashboard experience after merchant completes signup:
- What the merchant sees when they land on the dashboard
- The 6-task checklist structure
- What's happening in the background (Stripe account creation)
- Task prioritization and flow

**Critical Flow**: After signup → Dashboard with 6 tasks → Complete critical tasks → Purchase → Payments activate

---

## Table of Contents

1. [Landing on the Dashboard](#landing-on-the-dashboard)
2. [Cohort-Specific Dashboard Experiences](#cohort-specific-dashboard-experiences)
3. [The 6 Dashboard Tasks](#the-6-dashboard-tasks)
4. [Background: Stripe Account Creation](#background-stripe-account-creation)
5. [Task Status System](#task-status-system)
6. [Payment Activation Timeline](#payment-activation-timeline)

---

## Landing on the Dashboard

**Route**: `/dashboard`

**When**: Immediately after signup completion and TrueBiz verification approval

**Purpose**: Central hub for merchant to complete setup and activate payments

### What the Merchant Sees

**Header Section**:
- Welcome message: "Welcome back, [Business Name]!"
- Overall progress indicator (e.g., "2 of 6 tasks completed")

**Payment Activation Banner** (prominent, above task cards):
```
🎯 Ready to accept payments?

Complete these 3 steps to activate payment processing:
  1. Verify Your Identity (10-15 minutes)
  2. Configure Your POS (2-3 minutes)
  3. Complete Your Purchase

After purchase, we'll activate payments in 1-2 days.
You can add your bank account anytime to receive payouts.
```

**6 Task Cards** (grid layout):
- Each card displays:
  - Task icon with status indicator
  - Task title and description
  - Time estimate badge
  - Priority badge ("Required to accept payments" or "Optional - add anytime")
  - Action button ("Start", "Continue", or "Review")

**Visual Hierarchy**:
- Critical tasks (1-2) emphasized with red/blue badges
- Optional tasks (3-6) shown with lower visual priority
- Clear path: Identity → POS → Purchase

---

## Cohort-Specific Dashboard Experiences

Each cohort sees a different dashboard experience with varying levels of support and specialist engagement.

### Self-Serve Cohort

**Criteria**: <$500K revenue OR <3 locations

**Dashboard Appearance**:
- Standard dashboard layout
- No specialist banner or contact card
- Emphasis on self-service resources

**Support Options**:
- Standard support (chat, email)
- In-app help documentation
- Video tutorials and guides
- Community forum access

**Purchase Experience**:
- Standard pricing displayed
- Self-checkout flow
- No AE consultation required

**Setup Experience**:
- Self-service guides for all tasks
- Progress tracking only
- Automated help suggestions based on behavior
- Optional: Can request IC support if needed (paid upgrade)

---

### Assisted Cohort

**Criteria**: $500K-$2M revenue OR 3-10 locations

**Dashboard Appearance**:
- "Want help? Schedule a call with your specialist" banner (collapsible)
- Specialist contact card with photo, name, calendly link
- Self-serve option still available

**Support Options**:
- Standard support PLUS free IC (Implementation Consultant) support
- Can schedule IC calls via dashboard
- IC can view merchant's progress in shared view
- Priority email/chat response

**Purchase Experience**:
- Optional AE consultation before purchase
- Can negotiate pricing/terms
- Self-checkout option still available
- AE can send custom quotes

**Setup Experience**:
- Self-serve guides available
- IC can schedule onboarding session
- IC monitors progress and reaches out proactively if stalled
- Hybrid: merchant can choose self-serve or IC assistance per task

---

### Managed Cohort

**Criteria**: $2M+ revenue OR 10+ locations

**Dashboard Appearance**:
- Prominent "Your dedicated account manager" card at top
- Shows AE photo, name, direct phone, email
- "Schedule Implementation Call" button
- White-glove messaging throughout

**Support Options**:
- Dedicated account manager (AE)
- Paid implementation package included
- IC assigned for technical setup
- Priority support with SLA guarantees
- Dedicated Slack/Teams channel option

**Purchase Experience**:
- **Required**: AE consultation before purchase
- Custom negotiated pricing
- Implementation package included in quote
- Purchase cannot proceed without AE involvement

**Setup Experience**:
- IC-led implementation (not self-serve)
- Scheduled onboarding sessions
- IC completes technical tasks with merchant
- Regular check-ins and progress reviews
- Concierge-level service

---

## The 6 Dashboard Tasks

### Critical Tasks (Required for Payment Processing)

#### 1. Verify Your Identity
- **Priority**: ⭐ Required to accept payments
- **Time**: 10-15 minutes
- **What**: Collect identity data for business representative and beneficial owners (25%+)
- **Why**: Trulioo handles official KYC (individual identity) and KYB (business entity) verification required by Stripe for payment processing
- **Note**: Business data was enhanced at signup via TrueBiz (data enrichment only, not official KYB)

#### 2. Configure Your POS

**Route**: `/dashboard/tasks/pos-configuration`

**Priority**: ⭐ Required to accept payments

**Time**: 2-3 minutes

**Purpose**: Configure locations, registers, and channels to determine Stripe account capabilities and hardware requirements

---

**Data Collected**:

| Field | Pre-filled? | Input Type | Notes |
|-------|-------------|------------|-------|
| Number of Locations | Yes (from signup) | Numeric input | Pre-filled from signup, can edit |
| Registers per Location | No | Numeric input per location | Merchant specifies for each location |
| E-commerce Enabled | No | Toggle (Yes/No) | Determines if online_payments capability needed |
| Location Names | No | Text input per location | Optional: merchant can name each location |

---

**UI Flow**:

1. **Welcome Screen**:
   - "Let's configure your POS system"
   - Shows number of locations from signup
   - "Edit" button if merchant wants to change location count

2. **Location Configuration** (for each location):
   - Location name (optional): "Location 1" or custom name
   - Number of registers: Dropdown (1-20)
   - Visual: Shows register icons multiplying as merchant selects

3. **E-commerce Question**:
   - "Will you accept payments online?"
   - Toggle: Yes / No
   - Helper text: "We'll enable online payment processing for your website or app"

4. **Summary Review**:
   - Total locations: X
   - Total registers: Y
   - E-commerce: Enabled / Disabled
   - "Confirm Configuration" button

---

**What This Determines**:

**Stripe Account Configuration**:
- Capabilities requested: `card_payments` (always) + `online_payments` (if e-commerce enabled)
- Account settings: Physical location count affects risk assessment

**Hardware Requirements**:
- Total registers determines hardware bundle recommendations
- Shows estimated hardware needs in Task 4

**X-Series Setup**:
- Creates location records in X-Series
- Pre-configures register count per location
- Enables e-commerce module if selected

---

**Validation Rules**:
- Number of locations: Must be ≥ 1
- Registers per location: Must be ≥ 1 per location
- E-commerce: Must select Yes or No

---

**Task Completion**:
- Data saved to YOUR database (not sent to Stripe yet)
- Task marked as "Completed" with green checkmark
- Data will be submitted to Stripe during purchase

**See Also**: [User Flow 4: Purchase](./USER_FLOW_04_PURCHASE.md) - How this data affects software licensing pricing

### Optional Tasks (Can Be Completed Anytime)

#### 3. Connect Bank for Payouts

**Route**: `/dashboard/tasks/bank-account`

**Priority**: ⚠️ Optional - add anytime

**Time**: 1-3 minutes (instant with Plaid)

**Purpose**: Connect bank account to receive payouts from Stripe balance

**Critical Note**: Merchants can accept payments WITHOUT a bank account. Funds accumulate in Stripe balance until bank account is added.

---

**Two Connection Methods**:

**Option 1: Instant Verification with Plaid** (Recommended):
- Click "Connect with Plaid" button
- Select bank from list
- Log in with online banking credentials
- Plaid instantly verifies account ownership
- Account verified and ready for payouts immediately
- **Time**: 1-2 minutes
- **Security**: OAuth 2.0, credentials never stored

**Option 2: Manual Entry with Micro-Deposits** (Traditional):
- Enter routing number and account number manually
- Stripe sends 2 small deposits (e.g., $0.32 and $0.45) to account
- Wait 1-2 business days for deposits to appear
- Return to dashboard and enter deposit amounts to verify
- **Time**: 3-5 minutes initial + 1-2 days wait
- **Use Case**: Banks not supported by Plaid, or merchant preference

---

**Data Collected**:

| Field | Method | Input Type | Notes |
|-------|--------|------------|-------|
| Bank Name | Plaid: Auto / Manual: Enter | Plaid selects / Text input | For merchant reference only |
| Account Holder Name | Both | Text input | Must match Stripe account business name or representative name |
| Routing Number | Plaid: Auto / Manual: Enter | 9-digit numeric | Auto-populated by Plaid |
| Account Number | Plaid: Auto / Manual: Enter | Numeric | Auto-populated by Plaid, masked after save |
| Account Type | Plaid: Auto / Manual: Select | Dropdown | Checking / Savings |

---

**Validation Rules**:
- **Routing number**: Must be valid 9-digit US bank routing number
- **Account holder name**: Must match business or representative name (soft check, warning if mismatch)
- **Account ownership**: Must be verified (instant with Plaid, or micro-deposit verification)

---

**UI Flow**:

1. **Landing Screen**:
   - Explanation: "Connect your bank account to receive payouts"
   - Two prominent buttons: "Connect with Plaid" (primary) vs "Enter Manually" (secondary)
   - Note: "You can accept payments without this. Add your bank anytime to receive funds."

2. **Plaid Flow** (if selected):
   - Plaid modal opens
   - Select bank → Log in → Select account → Confirm
   - Success: "Bank account verified! Payouts enabled."
   - Estimated first payout: [Date based on Stripe schedule]

3. **Manual Flow** (if selected):
   - Form with routing/account fields
   - "How to find your routing and account numbers" help link
   - Submit → "We'll send 2 small deposits in 1-2 days"
   - Task marked "In Progress" (not completed until verified)
   - Reminder email sent when deposits arrive
   - Return to verify: Enter deposit amounts → Complete

4. **Completion Screen**:
   - "Bank account connected!"
   - Shows masked account: "****1234"
   - Payout schedule: "Daily automatic payouts (2-day rolling)"
   - "Edit Bank Account" link

---

**Payout Schedule**:
- **Default**: Daily automatic payouts with 2-day rolling window
- **Example**: Payment on Monday → Available Wednesday
- **First payout**: May take 7-10 days (Stripe's standard new account period)
- **Display**: "Next payout: [Date] - Estimated amount: $XXX"

---

**What Happens If Merchant Skips This Task**:
- Merchant can still accept payments
- Funds accumulate in Stripe balance
- Dashboard shows: "💰 $XXX available - Connect bank to receive"
- Stripe sends email reminders every 7 days
- Merchant can add bank account anytime from dashboard

---

**Task Completion**:
- **Plaid**: Task marked "Completed" immediately after verification
- **Manual**: Task marked "In Progress" until micro-deposits verified
- Bank account details stored in YOUR database (encrypted)
- External account created in Stripe during purchase (or immediately if already purchased)

**See Also**: [User Flow 3: LSPAY Activation](./USER_FLOW_03_LSPAY.md) - Complete identity verification requirements before payments activate

#### 4. Hardware Selection

**Route**: `/dashboard/tasks/hardware`

**Priority**: Optional

**Time**: 5-10 minutes

**Purpose**: Browse and add POS hardware to quote for purchase

**Note**: Hardware is optional - merchants can use X-Series with existing hardware or software-only mode

---

**Hardware Bundles** (Pre-configured Kits):

**Starter Kit - $799**:
- 1× Card reader (Tap, Chip & Swipe)
- 1× Receipt printer
- 1× Cash drawer
- Best for: Single register, low volume

**Retail Kit - $1,299**:
- 1× Touchscreen terminal (12" display)
- 1× Card reader
- 1× Receipt printer
- 1× Cash drawer
- 1× Barcode scanner
- Best for: Retail stores, boutiques

**Restaurant Kit - $1,899**:
- 1× Touchscreen terminal (15" display)
- 1× Card reader
- 1× Kitchen printer
- 1× Receipt printer
- 2× Handheld order devices
- Best for: Full-service restaurants, cafes

**Enterprise Kit - $2,499**:
- 2× Touchscreen terminals (15" display)
- 2× Card readers
- 2× Receipt printers
- 1× Cash drawer
- 2× Barcode scanners
- Best for: High-volume, multi-register locations

---

**À La Carte Hardware** (Build Your Own):

| Item | Price | Description |
|------|-------|-------------|
| Touchscreen Terminal (12") | $699 | All-in-one POS terminal |
| Touchscreen Terminal (15") | $899 | Larger display for restaurants |
| Card Reader | $199 | Tap, Chip & Swipe |
| Receipt Printer | $249 | Thermal printer, auto-cutter |
| Kitchen Printer | $299 | Durable, heat-resistant |
| Cash Drawer | $129 | 5-bill, 5-coin compartments |
| Barcode Scanner | $149 | Handheld or stand |
| Handheld Order Device | $399 | Wireless, tableside ordering |
| iPad Stand | $79 | Counter or wall mount |

---

**UI Flow**:

1. **Landing Screen**:
   - "Do you need POS hardware?" question
   - Options:
     - "Browse hardware bundles" (recommended)
     - "Build custom setup"
     - "Skip - I'll use existing hardware"
     - "Not sure - help me choose"

2. **Hardware Recommendation** (if "help me choose"):
   - Based on Task 2 data (locations, registers, category)
   - Shows recommended bundle with explanation
   - Can still browse other options

3. **Bundle Selection View**:
   - 4 bundles shown as cards
   - Each shows: Contents list, price, "Best for" tag
   - "Add to Quote" button per bundle
   - "Customize this bundle" option (remove/add items)

4. **À La Carte View**:
   - Categorized list: Terminals, Readers, Printers, Accessories
   - Quantity selectors per item
   - Running total shows at bottom
   - "Add to Quote" button

5. **Quote Review**:
   - Line items with quantities and prices
   - Shipping estimate (based on location)
   - Total hardware cost
   - "Confirm Hardware Selection" button
   - "I'll decide later" option

---

**Shipping & Delivery**:
- **Timing**: 5-7 business days after purchase
- **Cost**: Free shipping on orders $500+, otherwise $49
- **Tracking**: Email with tracking number when shipped
- **Support**: 30-day return policy, 1-year warranty

---

**What Happens If Merchant Skips**:
- No hardware added to quote
- Can still purchase software-only
- Dashboard shows: "Need hardware? Browse options anytime"
- Can add hardware later via dashboard or contact sales

---

**Task Completion**:
- **If hardware selected**: Task marked "Completed", hardware items stored in quote
- **If skipped**: Task remains "Not Started" (can revisit anytime)
- Hardware quote is added to purchase flow (see FLOW_04)

**See Also**: [User Flow 4: Purchase - Hardware Bundle Selection](./USER_FLOW_04_PURCHASE.md#hardware-bundle-selection) - Complete hardware ordering flow

#### 5. Data Import

**Route**: `/dashboard/tasks/data-import`

**Priority**: Optional

**Time**: 10-30 minutes (depending on data volume)

**Purpose**: Import existing products, customers, and inventory from previous POS system

**Note**: Merchants can start fresh or import later - not required for payment processing

---

**Three Import Options**:

**Option 1: CSV Upload** (Self-Service):
- Download CSV templates for products, customers, inventory
- Fill in data from existing system
- Upload CSVs via dashboard
- System validates and imports
- **Time**: 10-20 minutes (for small catalogs)
- **Best for**: Self-serve merchants with simple data

**Option 2: Direct Migration** (Supported POS Systems):
- Connect to previous POS system via API
- Select data to migrate (products, customers, sales history)
- System pulls data automatically
- Review and confirm import
- **Time**: 5-10 minutes
- **Supported**: Square, Clover, Toast, Shopify POS, Vend
- **Best for**: Merchants switching from supported systems

**Option 3: Assisted Migration** (White-Glove):
- Schedule call with data migration specialist
- Send data exports to specialist team
- Team performs migration and validation
- Review imported data with specialist
- **Time**: 1-2 hours (scheduled appointment)
- **Cost**: Free for Managed cohort, $299 for Self-Serve/Assisted
- **Best for**: Large catalogs, complex data, or legacy systems

---

**Data Types Supported**:

**Products/Inventory**:
- Product name, SKU, barcode
- Category, subcategory, tags
- Price, cost, tax category
- Stock quantity per location
- Modifiers, variants
- Images (URLs or upload)

**Customers**:
- Name, email, phone
- Loyalty points balance
- Purchase history (optional)
- Customer tags/segments
- Preferences and notes

**Historical Sales Data** (Optional):
- Past 12 months of transactions
- For reporting and analytics
- Does not affect accounting

---

**UI Flow**:

1. **Landing Screen**:
   - "Import your existing data" heading
   - Three options presented as cards
   - "Start fresh - I'll add products later" option at bottom

2. **CSV Upload Flow**:
   - Download template buttons (Products, Customers, Inventory)
   - Template includes: Sample rows, column descriptions
   - Upload zone (drag & drop or browse)
   - Validation step: Shows errors/warnings
   - Preview: First 10 rows displayed
   - "Confirm Import" button

3. **Direct Migration Flow**:
   - Select previous POS from dropdown
   - "Connect to [System]" button
   - OAuth authorization (if supported)
   - Data selection checkboxes (products, customers, history)
   - Conflict resolution (e.g., duplicate SKUs)
   - "Start Migration" button
   - Progress indicator during import

4. **Assisted Migration Flow**:
   - "Schedule Migration Call" button → Calendly embed
   - Form: System type, data volume estimate, special requests
   - Confirmation: "Your specialist will contact you"
   - Follow-up: Email with preparation instructions

5. **Completion Screen**:
   - Import summary: X products, Y customers imported
   - "Review Imported Data" link
   - "Edit Products" and "Edit Customers" links
   - Option to import more data

---

**Validation & Error Handling**:

**Common CSV Errors**:
- Missing required fields (SKU, product name, price)
- Invalid formats (price as text, malformed email)
- Duplicate SKUs or customer records
- **Resolution**: Download error report, fix, re-upload

**Data Conflicts**:
- Duplicate SKUs: Append suffix (e.g., SKU-001-imported)
- Duplicate customers: Merge or keep separate (merchant chooses)
- Missing categories: Create new or map to existing

**Large Imports**:
- If >1,000 products: Background processing with email notification
- Progress visible in dashboard: "Importing... 45% complete"

---

**What Happens If Merchant Skips**:
- Can add products manually via dashboard
- Can import later anytime from settings
- Dashboard shows: "Ready to add products? Import or create manually"
- No impact on payment processing

---

**Task Completion**:
- **If data imported**: Task marked "Completed"
- **If started but not finished**: Task marked "In Progress"
- **If skipped**: Task remains "Not Started" (can revisit anytime)
- Imported data immediately available in X-Series POS

**Post-Import Support**:
- "Review imported data" checklist
- Help article: "Cleaning up imported data"
- Support chat available for questions

#### 6. Team Setup

**Route**: `/dashboard/tasks/team`

**Priority**: Optional

**Time**: 3-5 minutes per team member

**Purpose**: Invite staff members and configure role-based permissions

**Note**: Merchants can start with owner-only access and add team later

---

**Team Roles & Permissions**:

**Owner** (You):
- Full system access
- Financial reports and settings
- User management
- Cannot be deleted or restricted

**Manager**:
- Access: All locations
- Permissions: Sales, reports, inventory management, employee oversight
- Cannot: Change owner settings, delete locations, manage billing

**Cashier**:
- Access: Assigned location(s) only
- Permissions: Process sales, view products, basic reports
- Cannot: Manage inventory, view financial reports, change settings

**Kitchen Staff** (Restaurant mode):
- Access: Kitchen display system only
- Permissions: View orders, mark as complete
- Cannot: Process sales, view reports, manage inventory

**Custom Role**:
- Merchant creates custom role with specific permissions
- Granular control: 20+ permission toggles
- Can be applied to multiple team members

---

**Permission Categories**:

| Category | Owner | Manager | Cashier | Kitchen | Custom |
|----------|-------|---------|---------|---------|--------|
| Process Sales | ✅ | ✅ | ✅ | ❌ | ✓ |
| Accept Returns/Exchanges | ✅ | ✅ | ✓ | ❌ | ✓ |
| Apply Discounts | ✅ | ✅ | ✓ | ❌ | ✓ |
| Void Transactions | ✅ | ✅ | ❌ | ❌ | ✓ |
| View Sales Reports | ✅ | ✅ | ❌ | ❌ | ✓ |
| Manage Inventory | ✅ | ✅ | ❌ | ❌ | ✓ |
| Add/Edit Products | ✅ | ✅ | ❌ | ❌ | ✓ |
| Manage Customers | ✅ | ✅ | ✓ | ❌ | ✓ |
| Clock In/Out | ✅ | ✅ | ✅ | ✅ | ✓ |
| View Kitchen Orders | ✅ | ✅ | ✓ | ✅ | ✓ |
| Manage Team Members | ✅ | ✓ | ❌ | ❌ | ✓ |
| Access Settings | ✅ | ✓ | ❌ | ❌ | ✓ |
| View Financial Reports | ✅ | ✓ | ❌ | ❌ | ✓ |
| Manage Billing | ✅ | ❌ | ❌ | ❌ | ❌ |

✅ = Full access | ✓ = Partial/configurable | ❌ = No access

---

**UI Flow**:

1. **Landing Screen**:
   - "Build your team" heading
   - Current team members list (just owner initially)
   - "Invite Team Member" button (primary)
   - "I'll add team later" link

2. **Invite Flow**:
   - Form fields:
     - First name, Last name
     - Email address
     - Role dropdown (Manager, Cashier, Kitchen, Custom)
     - Location assignment (if multiple locations)
     - PIN code (4-6 digits, for POS login)
   - "Send Invitation" button
   - Preview: Shows what invitation email looks like

3. **Custom Role Creation** (if selected):
   - "Create Custom Role" dialog
   - Role name field
   - Permission checklist (grouped by category)
   - "Save Role" button
   - Role available in dropdown for future invites

4. **Team Member Invited**:
   - Success message: "Invitation sent to [email]"
   - Shows in team list as "Pending" status
   - "Resend Invitation" option
   - "Invite Another Team Member" button

5. **Team Member Activation** (from employee perspective):
   - Receives email invitation
   - Clicks "Accept Invitation"
   - Creates password
   - Downloads POS app (if needed)
   - Status changes to "Active"

6. **Team Management View**:
   - List of all team members with status
   - Edit icon: Change role, permissions, assigned locations
   - Deactivate button: Suspend access without deleting
   - Delete button: Permanently remove (requires confirmation)
   - Activity log: Last login, location, actions

---

**PIN Code System**:
- **Purpose**: Quick login on POS terminal (no password needed)
- **Format**: 4-6 digits
- **Security**: Cannot be same as another employee
- **Reset**: Employee can change via dashboard or manager can reset
- **Usage**: Employee enters PIN → Logged into register → Sales tracked per employee

---

**What Happens After Invitation**:

**Email to Employee**:
- Subject: "You're invited to join [Business Name]'s team"
- Includes: Business name, role, invitation link
- CTA: "Accept Invitation"
- Link expires in 7 days

**Employee Onboarding**:
- Accepts invitation → Creates account
- Views role and permissions
- Downloads POS app (iOS, Android, Web)
- Logs in with PIN at register
- Ready to process sales

**Tracking**:
- Sales tracked per employee
- Time tracking (clock in/out)
- Reports show employee performance

---

**What Happens If Merchant Skips**:
- Owner can use all registers with owner PIN
- Can invite team anytime from settings
- Dashboard shows: "Ready to add team members?"
- No impact on payment processing or operations

---

**Task Completion**:
- **If team member invited**: Task marked "Completed"
- **If skipped**: Task remains "Not Started" (can revisit anytime)
- Team members visible in dashboard team management section

**Team Management After Setup**:
- Accessible via Settings → Team
- Can add, edit, deactivate members anytime
- View employee activity and reports
- Export time tracking data for payroll

---

## Background: Stripe Account Creation

### When It Happens

**Critical Timing**: Stripe Custom account is created **DURING PURCHASE** (not at signup)

**Flow**:
```
Merchant completes signup
  ↓
TrueBiz verification approves
  ↓
Lightspeed user account created
  ↓
Redirect to dashboard
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MERCHANT COMPLETES TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Verification data collected and stored in YOUR database
  ↓
Merchant clicks "Complete Purchase"
  ↓
🔑 Stripe Custom account created WITH ALL PRE-COLLECTED DATA
  ↓
Stripe account ID stored
  ↓
Verification processing begins (1-2 days)
```

### Why Create Account During Purchase?

**Cost Optimization**:
- Only create accounts for merchants who commit (pay)
- Avoids abandoned Stripe accounts for merchants who never purchase
- 60% less operational overhead vs creating at signup

**Stripe's Official Recommendation**:
- "Only create an account when you're confident the user will actually use it"
- Purchase = strong commitment signal
- Better fraud signals for underwriting

**Data Pre-Collection Strategy**:
- Collect all verification data via dashboard tasks BEFORE purchase
- Store in YOUR database (encrypted)
- When merchant purchases, create Stripe account with ALL data at once
- Result: Zero user-facing delay, optimal cost efficiency

### What Happens in Background

**During Dashboard Tasks**:
- Task 1 (Verify Identity): Data saved to YOUR database (encrypted)
- Task 2 (Configure POS): Data saved to YOUR database
- Task 3 (Bank Account): Data saved to YOUR database (encrypted)
- NO Stripe API calls yet - just storing data locally

**During Purchase**:
1. Merchant clicks "Complete Purchase"
2. System processes payment for hardware/software
3. System retrieves all pre-collected data from YOUR database
4. **🔑 Stripe Custom account created with ALL data** (< 1 second)
5. Stripe account ID stored in YOUR database
6. Order confirmed, hardware ships

**After Purchase**:
- Stripe processes verification in background (1-2 business days)
- Webhook received when `charges_enabled` = true
- Merchant notified: "Payment processing is now active!"

**See Also**: [User Flow 4: Purchase](./USER_FLOW_04_PURCHASE.md#what-happens-behind-the-scenes) - Complete technical implementation details

---

## Task Status System

**Not Started** (gray):
- Task not yet visited
- Action: "Get Started" button

**In Progress** (blue):
- Task visited or partially completed
- Action: "Continue" button

**Completed** (green):
- Task fully completed, data saved to database
- Action: "Review" button
- **Note**: Data is NOT submitted to Stripe until purchase

---

## Payment Activation Timeline

### Complete Journey: Signup to Fully Operational

```
Day 0: Signup Complete
  ↓
NO Stripe account created yet
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DASHBOARD TASKS (Data Collection)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant completes Task 1: Verify Your Identity (10-15 min)
  → Data SAVED to YOUR database (encrypted)
  → ToS acceptance captured (date, IP, user agent)
  ↓
Merchant completes Task 2: Configure Your POS (2-3 min)
  → Data SAVED to YOUR database
  ↓
Merchant optionally completes Task 3: Connect Bank for Payouts (1-3 min)
  → Data SAVED to YOUR database
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 PURCHASE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant clicks "Complete Purchase"
  ↓
🔑 Stripe Custom account created WITH ALL PRE-COLLECTED DATA (< 1 second)
  ↓
Stripe account ID stored in database
  ↓
Order confirmed → Hardware ships
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ VERIFICATION PROCESSING (Background)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Stripe processes verification (1-2 business days)
  → Checks SSN against government records
  → Verifies addresses
  → Validates business entity
  ↓
Webhook: account.updated → charges_enabled = true
  ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PAYMENT PROCESSING ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ↓
Merchant can accept payments
  ↓
Funds accumulate in Stripe balance
  ↓
[If bank account added]: Funds flow to bank automatically
[If no bank account]: Funds held until merchant adds bank
  ↓
🎉 Fully operational merchant
```

### Key Timing Notes

**Stripe Account Creation**: During purchase (< 1 second, invisible to merchant)

**Data Collection**: During dashboard tasks (saved to YOUR database)

**Data Submission to Stripe**: During purchase (all at once)

**Verification Processing**: 1-2 business days AFTER purchase (Stripe background processing)

**Payment Processing**: Active 1-2 days after purchase (once verification completes)

**Payouts**: Require bank account verification (instant with Plaid, or 1-2 days with micro-deposits)

---

## Related Documentation

**Previous Flow**:
- [User Flow 1: Signup and Account Provisioning](./USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Account creation and cohort assignment before landing on dashboard

**Next Flows**:
- [User Flow 3: Identity Verification (LSPAY)](./USER_FLOW_03_LSPAY.md) - Detailed data requirements and UI for Task 1 (Verify Identity)
- [User Flow 4: Subscription and Hardware Purchase](./USER_FLOW_04_PURCHASE.md) - Complete purchase experience after completing required tasks

**Technical Integration Details**:
- [Stripe Payment Setup Flow](../05-integrations/STRIPE_PAYMENT_SETUP_FLOW.md) - Stripe Connect account creation timing and implementation
- [Trulioo KYC/KYB Integration](../05-integrations/TRULIOO_VERIFICATION_API.md) - Identity verification provider integration

**Component References**:
- `components/dashboard/checklist-card.tsx` - Task card component implementation (see lines 16-109)
- `components/dashboard/` - Dashboard task-specific components
