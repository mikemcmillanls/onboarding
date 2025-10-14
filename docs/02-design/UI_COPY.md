# Copy Reference Guide: Merchant Onboarding

## Document Overview

This document provides all UI copy, messaging, and microcopy for the merchant onboarding flow. Use this as the source of truth for all user-facing text.

**Date:** October 10, 2025
**Status:** Ready for Implementation

---

## Table of Contents

1. [Voice & Tone Guidelines](#voice--tone-guidelines)
2. [Step 1: Sign Up Copy](#step-1-sign-up-copy)
3. [Step 2: Configuration Copy](#step-2-configuration-copy)
4. [Step 3: Checkout Copy](#step-3-checkout-copy)
5. [Step 4: Setup Checklist Copy](#step-4-setup-checklist-copy)
6. [Error Messages](#error-messages)
7. [Success Messages](#success-messages)
8. [Email Templates](#email-templates)
9. [Specialist Messaging](#specialist-messaging)

---

## Voice & Tone Guidelines

### Our Voice Is
- **Friendly but professional** - Like a knowledgeable colleague, not a robot or overly casual friend
- **Clear and direct** - Get to the point, use simple words
- **Encouraging** - Positive without being cheesy or over-the-top
- **Helpful** - Anticipate questions and provide context

### Our Voice Is Not
- **Robotic or corporate** - Avoid stiff, formal language
- **Overly casual** - No slang, excessive exclamation points, or emojis
- **Pushy** - Don't oversell or use aggressive sales tactics
- **Condescending** - Never talk down to merchants

### Writing Rules
1. **Use second person** - "Your business" not "the business"
2. **Active voice** - "Choose your hardware" not "Hardware should be chosen"
3. **Short sentences** - Under 20 words when possible
4. **Action-oriented** - Start with verbs
5. **Explain why** - Especially for sensitive data requests

---

## Step 1: Sign Up Copy

### Page 1: Account Creation

**Page Title (H1):**
```
Get started with Lightspeed
```

**Subtitle:**
```
Create your account and see if you qualify for payment processing
```

**Progress Indicator:**
```
Step 1 of 4: Account Setup
```

**Form Fields:**

```
First name
[Text input]

Last name
[Text input]

Work email
[Email input]
Help text: We'll send your login details here

Phone number
[Tel input]
Help text: For important updates about your account

Create a password
[Password input]
Password strength: [Weak/Medium/Strong]
Help text: At least 8 characters, 1 uppercase, 1 number

Business name
[Text input]
Placeholder: The name your customers see

What type of business do you have?
[Dropdown]
Options: Restaurant, Retail, Services, Healthcare, Beauty & Wellness, Other

What's your approximate annual revenue?
[Radio buttons]
Options:
- Less than $250K
- $250K - $500K
- $500K - $1M
- $1M - $2M
- More than $2M
Help text: This helps us recommend the right setup for you

How many locations do you have?
[Radio buttons]
Options: 1, 2-5, 6-10, 11+
```

**Primary Button:**
```
Continue
```

**Secondary Link:**
```
Already have an account? Sign in
```

**Footer Text:**
```
By continuing, you agree to our Terms of Service and Privacy Policy
```

### Page 2: Business Details

**Page Title (H1):**
```
Tell us about your business
```

**Subtitle:**
```
We need these details to verify your business for payment processing
```

**Progress Indicator:**
```
Step 1 of 4: Account Setup - Page 2 of 2
```

**Info Banner:**
```
[Shield icon] Your information is secure and encrypted. We use this to verify your business and comply with payment processing regulations.
[Link] Why do we need this?
```

**Modal Content for "Why do we need this?":**
```
Title: Why we need your business information

We're required by law to verify all businesses before enabling payment processing. This is a standard process called "Know Your Business" (KYB) verification.

What we verify:
- Your business is legally registered
- You're authorized to accept payments
- Your business isn't in a restricted industry

Your information is:
- Encrypted and secure
- Used only for verification
- Never shared without your permission
- Protected by our Privacy Policy

This usually takes just a few minutes and most businesses are approved immediately.
```

**Form Fields:**

```
Legal business name
[Text input]
Placeholder: As registered with the government
Help text: This may be different from your business name

Business structure
[Dropdown]
Options:
- Sole Proprietorship
- Partnership
- LLC (Limited Liability Company)
- Corporation (C-Corp or S-Corp)
- Non-profit

[If Sole Proprietorship selected:]
Social Security Number
[SSN input with masking]
Placeholder: XXX-XX-XXXX
Help text: Encrypted and used only for verification
[Show/Hide toggle]

[If other structures selected:]
Employer Identification Number (EIN)
[EIN input with masking]
Placeholder: XX-XXXXXXX
Help text: Your federal tax ID number
[Show/Hide toggle]

Business address
[Address input with autocomplete]
Street address
Street address (Line 2) - Optional
City
State
ZIP code
Help text: Your registered business address

Business phone number
[Tel input]
Placeholder: (555) 123-4567
```

**Primary Button:**
```
Submit Application
```

**Secondary Button:**
```
Back
```

### Processing Screen

```
[Spinner animation]

Verifying your business...

This usually takes just a few seconds

[Progress steps with animated icons:]
• Checking business details
• Verifying payment eligibility
• Setting up your account
```

### Outcome: Auto-Approved

```
[Green checkmark icon - animated]

Great! You're approved for Lightspeed Payments

Your business qualifies for payment processing. Let's set up your POS system.

[Info card]
What happens next?
1. Choose your software and hardware
2. Complete your purchase
3. Get everything set up and start taking payments

[Primary button]
Continue to Setup
```

### Outcome: High-Value Merchant

```
[Success badge icon]

Great news! You qualify for dedicated support

Based on your business size, we're assigning you a payment specialist who will help you get set up.

[Specialist card]
[Avatar placeholder]
Your specialist will contact you within 2 hours

What your specialist will help with:
- Customized pricing for your business size
- Hardware recommendations
- Setup assistance
- Ongoing support

[Primary button]
Schedule a Call

[Secondary link]
Prefer to continue on your own? Continue to setup
```

### Outcome: Needs Review

```
[Clock icon - orange]

We're reviewing your application

Your business information is being reviewed by our team. This usually takes 1-2 hours during business hours.

[Info card]
What's happening?

We review applications to ensure we can support your business type and comply with payment processing regulations.

Expected response: Within 2 hours
We'll send you an email at [email@business.com] when approved

☐ Send me a text message when approved

[Primary button]
Got it

[Secondary link]
Questions? Chat with us
```

### Outcome: Rejected

```
[X icon - red, sympathetic design]

We can't approve your application right now

[Specific reason - varies by cause]

Example reasons:
- We don't currently support [business category] for payment processing.
- Your business location is in a restricted area.
- We need additional information to verify your business.

[Info card - if applicable]
You can still use Lightspeed POS

You can use our POS system with a different payment processor.
[Link] View compatible payment processors

[Primary button]
Contact Sales

[Secondary link]
Back to homepage
```

---

## Step 2: Configuration Copy

### Main Page

**Page Title (H1):**
```
Let's get your business set up
```

**Progress Indicator:**
```
Step 2 of 4: Set Up Your POS & Payments
```

### Specialist Banner - Assisted Cohort

```
[Avatar]
Your specialist [Name] is ready to help

Available for questions or to walk you through your setup

[Primary button] Call me now
[Secondary button] Schedule a call
[Tertiary link] I'll do this myself

[Collapsed state after dismiss:]
Need help? Chat with [Name]
```

### Specialist Banner - Managed Cohort

```
[Avatar]
Your account manager [Name] is preparing your quote

Feel free to browse options. We'll have a custom quote ready within 24 hours.

Status: Quote in progress

[Primary button] Schedule a call

[Tooltip on disabled checkout button:]
Your custom quote will be ready soon
```

### Software Setup Card

```
Software Setup
Configure your POS system

How many locations will use Lightspeed?
[Number input with +/- buttons]
Help text: Each physical location needs a license

How many registers per location?
[Number input with +/- buttons]
Help text: Registers are checkout stations or employee devices

[If multiple locations:]
☐ Different amounts per location?
[Expands to show:]
Location 1: [Dropdown: 1-20 registers]
Location 2: [Dropdown: 1-20 registers]

☐ I need eCommerce
Help text: Sell online and sync with your POS
Adds $X/month

[Link] View other add-ons
[Expands to show:]
☐ Advanced reporting
☐ Loyalty program
☐ Gift cards
☐ Inventory management
(Each with pricing)

[Live pricing indicator:]
Software: $X/month for [N] locations, [M] registers
```

### Hardware Setup Card

```
Hardware Setup
Choose what you need to run your business

[Tab 1 - Selected by default] Recommended Packages
[Tab 2] I have existing hardware

View as: ○ Grid ● List

[Package cards:]

Essential Package
[MOST POPULAR badge]

[Hardware image]

What's included:
• 1x POS Terminal
• 1x Payment Terminal
• 1x Receipt Printer
• Cash Drawer

$X one-time
or $Y/month financing

○ Select this package
[Link] Customize items
[Link] See full specifications ▼

Need multiple packages?
Quantity: [1] [+][-]
Total: 1 package = $X
```

**Tab 2: Existing Hardware**

```
Check your hardware compatibility
Tell us what you already have and we'll verify it works with Lightspeed

Device type: [Dropdown: iPad/Tablet, Payment Terminal, Receipt Printer, etc.]
Make and model: [Text input with autocomplete]
Placeholder: e.g., iPad Pro 11-inch, 2023
Help text: Found on device label or documentation

[Button] Check Compatibility

[After check - Compatible:]
[Green checkmark] Great! iPad Pro 11-inch works with Lightspeed
You'll need to download the Lightspeed app

[After check - Not Compatible:]
[Yellow warning] iPad Pro 9.7-inch isn't compatible with Lightspeed
We recommend: iPad Pro 11-inch (2023 or later)
[Button] Add to cart

[After check - Uncertain:]
[Info icon] We need more details about this device
[Button] Upload a photo
[Button] Chat with hardware specialist

[Button] + Add another device

[Banner if missing critical items:]
You'll need a payment terminal to accept payments
[Recommended terminal card with "Add to cart" button]
```

### Quote Summary (Sidebar)

```
Your Quote

Software (monthly)
• [N] locations × $X = $Y
• [M] registers × $X = $Y
• Add-ons: $Z
Subtotal: $X/month

Hardware (one-time)
• [Package name] × [qty] = $Y
Or:
• POS Terminal × 2 = $X
• Payment Terminal × 2 = $Y
• Receipt Printer × 2 = $Z
Subtotal: $X one-time

Lightspeed Payments
$0 setup fee + 2.6% + 10¢ per transaction
[Link] See full pricing details

─────────────────────

$X due today
$Y/month starting [date]

[Primary button - full width]
Continue to Checkout

[If KYB pending - button disabled with overlay:]
[Clock icon]
We're finalizing your payment processing approval
Usually 1-2 hours. You can configure your setup now.

[Secondary links:]
Save quote for later
Need help deciding? Chat with us

[Trust indicators:]
[Icon] 30-day money-back guarantee
[Icon] Free shipping
[Icon] Secure checkout
```

---

## Step 3: Checkout Copy

### Main Page

**Page Title (H1):**
```
Complete your purchase
```

**Progress Indicator:**
```
Step 3 of 4: Complete Purchase
```

### Section 1: Order Review

```
Review your order

[Expandable section - collapsed by default]
▶ Software Subscription - $X/month
[When expanded:]
• [N] locations × $Y = $Z
• [M] registers × $Y = $Z
• Add-ons:
  - eCommerce: $X/month
Subtotal: $X/month

[Expandable section]
▶ Hardware & Equipment - $Y one-time
[When expanded:]
[Item list with thumbnail images]
• POS Terminal (iPad Stand) × 2 = $X
• Payment Terminal (Verifone P400) × 2 = $Y
• Receipt Printer (Epson TM-T88) × 2 = $Z
Subtotal: $X one-time

[Expandable section]
▶ Lightspeed Payments - $0 setup + 2.6% + 10¢ per transaction
[When expanded:]
Transaction rate breakdown:
• Card-present: 2.6% + 10¢
• Card-not-present: 2.9% + 30¢
• Keyed/manual: 3.4% + 30¢
[Link] See full rate card

═══════════════════════════════════════

Total due today: $X
Then $Y/month starting [date]

First month prorated. Billed monthly after that.

[Link] Need to change something? Edit configuration
```

### Section 2: Payment Information

```
Payment information
How would you like to pay?

[Tab 1 - Selected] Credit Card
[Tab 2] ACH/Bank Transfer

[Security badge]
[Lock icon] Your payment information is encrypted and secure
[Logos] SSL | PCI Compliant

Card number
[Input with card type detection]
Placeholder: 1234 5678 9012 3456

Expiration    CVV
[MM / YY]     [123]
              Help text: 3-digit code on back of card

Cardholder name
[Input]
Placeholder: John Smith

☑ Save this card for future billing
Help text: Your monthly subscription will charge to this card
```

### Section 3: Billing & Shipping

```
Billing address

☑ Same as business address
[Read-only display]
123 Main Street
City, State 12345
[Link] Edit

[If unchecked - shows address form]

─────────────────────

Shipping address
Where should we send your hardware?

☑ Ship to business address
[Read-only display]
123 Main Street
City, State 12345
[Link] Edit

[If multi-location:]
○ Ship everything to main address
○ Ship to each location separately

[If "separately" selected:]
▶ Location 1: [Name from Step 2]
Address: [Input fields]
Hardware for this location:
• Item 1
• Item 2
```

### Section 4: Identity Verification

```
[Warning banner - important but not alarming]
[Shield icon] Identity verification required

To comply with payment processing regulations, we need to verify business ownership. This is standard for all payment processors and keeps your business secure.

[Link] Why is this required?

[Modal content:]
Title: Why identity verification is required

Payment processors (including Lightspeed Payments) are required by federal law to verify the identity of all business owners. This is called "Know Your Customer" (KYC) verification.

What we verify:
- You're a real person authorized to run this business
- Your identity matches government records
- You're not on any restricted lists

What we collect:
- Full legal name
- Date of birth
- Social Security Number
- Home address

Your information is:
- Encrypted with bank-level security
- Used only for identity verification
- Required by federal regulations
- Never shared without permission
- Protected by our Privacy Policy

This is the same process used by banks, payment apps, and all payment processors.

─────────────────────

Business representative
The person responsible for this account

Full legal name
[Input]
Placeholder: John Michael Smith

Date of birth
[Date picker or separate inputs]
MM / DD / YYYY
Help text: Must be 18 or older

Social Security Number
[Input with masking - XXX-XX-XXXX]
[Show/Hide toggle]
[Lock icon] Encrypted and used only for verification

Home address
[Address inputs]
Street address
Apt/Suite (optional)
City, State, ZIP
Help text: Must be your residential address

Your role at the business
[Dropdown]
Options: Owner, CEO, CFO, President, Manager, Partner

─────────────────────

[If business structure requires:]

Business owners
Anyone who owns 25% or more of the business

[Accordion for Owner 1]
▶ Owner 1
[Same fields as business representative, plus:]
Ownership percentage: [__]%

[Button] + Add another owner

[Link] Only one owner? That's me
(Removes additional owner sections)
```

### Section 5: Terms & Consent

```
☐ I agree to the Lightspeed Terms of Service
[Link] Read terms

☐ I agree to the Lightspeed Payments Processing Agreement
[Link] Read agreement

☐ I acknowledge the Privacy Policy
[Link] Read policy

☐ I authorize Lightspeed to verify the information provided and run a credit check

By checking these boxes, you confirm that you have authority to enter into this agreement on behalf of the business.
```

### Sticky Bottom Bar

```
[Collapsed on mobile, visible on desktop]

Total: $X due today + $Y/month

[Primary button - large]
Complete Purchase

[Trust indicators]
[Icon] Secure checkout
[Icon] 30-day money-back guarantee
[Icon] Support available

Questions? Call us at 1-800-XXX-XXXX or chat with us
```

### Processing Screen

```
[Full-page overlay - can't dismiss]

[Large spinner animation]

Processing your order...
Please don't close this page

[Animated progress steps:]
✓ Verifying payment...
⋯ Activating your account...
⋯ Preparing your hardware...

Usually takes 10-30 seconds
```

### Confirmation Screen

```
[Large green checkmark - animated]

Order confirmed! Here's what happens next

Order #123456
Confirmation email sent to [email@business.com]

[Timeline - vertical with icons:]

[✓ Checkmark] Software account activated
We've sent your login credentials to [email@business.com]
[Button - secondary] Access your dashboard

[📦 Box icon] Hardware shipping to [address]
Expected delivery: [date range]
We'll email you tracking info within 24 hours

[🛡️ Shield icon] Payment processing activating
Ready in 24-48 hours
You'll be able to accept payments as soon as this is complete

[✓ Checklist icon] Next: Get everything ready
We'll guide you through setup

─────────────────────

[Info card - light blue background]
While you wait...

Explore your new Lightspeed dashboard and familiarize yourself with the system. You can start adding products and setting up your locations.

[Button - secondary] Explore Lightspeed

─────────────────────

[Primary button - large]
Go to Setup Checklist

[Links]
Download order confirmation (PDF)
Need help? Contact support
```

---

## Step 4: Setup Checklist Copy

### Main Page

**Page Title (H1):**
```
Welcome to Lightspeed! Let's get you ready to accept payments.
```

**Progress Indicator:**
```
Step 4 of 4: Get Everything Ready
```

**Subheading:**
```
Progress: 3 of 6 tasks complete
```

### Specialist Banner - Assisted

```
[Avatar]
Need help? [Name] is here for you

Book a setup session or work through these tasks at your own pace

[Button] Schedule session

[Link] I'm good, thanks
```

### Specialist Banner - Managed

```
[Avatar]
Your implementation specialist: [Name]

Your next session: [Date/Time]

[Button] Reschedule
[Button - if time is now] Join session

[Link] View session details
```

### Task 1: Account Created (Auto-complete)

```
[✓ Green checkmark] 1. Account created
Badge: Complete

[Collapsed - click to expand]
[When expanded:]

[Icon: User account checkmark]
Your Lightspeed account has been created and activated

Email: [merchant@business.com]
[Link] Reset password

[Button - secondary] Open Lightspeed Dashboard
```

### Task 2: Software Activated (Auto-complete)

```
[✓ Green checkmark] 2. Software activated
Badge: Complete

[Collapsed]
[When expanded:]

[Icon: Software/app icon]
Your POS software is ready to use

Plan: [N] locations, [M] registers
Monthly cost: $X/month
[Link] View billing details

[Info card]
Start exploring

While you wait for hardware, you can:
• Add products to your catalog
• Set up your locations and registers
• Configure taxes and payment settings
• Add employee accounts

[Button - secondary] Go to Lightspeed
```

### Task 3: Hardware Shipped

**Waiting State (before shipment):**
```
[⏳ Gray clock] 3. Hardware shipped
Badge: Processing order

Your hardware order is being prepared
Estimated ship date: [Date]
We'll update you when it ships
```

**In Transit State:**
```
[📦 Blue box/truck icon] 3. Hardware shipped
Badge: In transit

[Expanded by default]

Your hardware is on the way!

Tracking number: [1Z999AA1 0123456789]
[Button] Track shipment

Expected delivery: [Date range]

What's in the box:
• POS Terminal × 2
• Payment Terminal × 2
• Receipt Printer × 2
• Accessories

[Link] View full packing list
```

**Delivered State:**
```
[✓ Green checkmark] 3. Hardware delivered
Badge: Complete

Delivered on [Date] to [Address]
[Link] View delivery confirmation

Ready to set up? Continue to next task →
```

### Task 4: Set Up Hardware

**Locked State:**
```
[🔒 Gray lock] 4. Set up your hardware
Badge: Waiting for delivery

This task will unlock when your hardware is delivered
Estimated: [Date]
```

**Unlocked State:**
```
[○ Blue dot] 4. Set up your hardware
Badge: Not started
Time: ~15-20 min

Your hardware has arrived! Let's get it connected.

[Button] Start setup
```

**In Progress State:**
```
[● Blue pulsing dot] 4. Set up your hardware
Badge: In progress

[Expanded]

Follow these steps to get your hardware ready:

☑ 1. Plug in your POS terminal
[Expanded - shows photo/diagram and instructions]
[Link] Watch setup video (2 min)

☑ 2. Connect your payment terminal
[Expanded - pairing instructions]
Troubleshooting: Terminal not connecting?

☐ 3. Set up receipt printer
[Collapsed - click to expand]

☐ 4. Set up cash drawer (if applicable)
[Collapsed]

☐ 5. Run a test transaction
[Collapsed]

Progress: 2 of 5 steps complete
[Progress bar: 40%]

[Button] Mark as complete
(Enabled when all sub-tasks checked)

[Link] I need help with this

[Expandable section]
▼ Troubleshooting
• Terminal won't pair → [Solution]
• Printer not printing → [Solution]
• Test payment failed → [Solution]
[Link] More help articles
```

**Completed State:**
```
[✓ Green checkmark] 4. Hardware set up
Badge: Complete

All hardware connected and tested
Completed: [Date]

[Link] Need to add more hardware?
```

### Task 5: Connect Bank Account

**Unlocked State:**
```
[○ Blue dot] 5. Connect your bank account
Badge: Not started | Required for payouts
Time: ~3 min + 1-2 days verification

[Warning banner - informational]
[Info icon] You can accept payments now, but payouts are held until your bank account is verified. This usually takes 1-2 business days.

[Button] Connect bank account
```

**In Progress State (entering info):**
```
[● Blue dot] 5. Connect your bank account
Badge: In progress

[Expanded]

[Lock icon] Your bank information is encrypted and secure

[Tab 1 - Selected] Instant verification (recommended)
[Tab 2] Manual entry

[Tab 1 content:]
[Button] Connect with Plaid
Benefits: Instant verification, no waiting

[Tab 2 content:]
Account holder name
[Input]
Help text: Must match business name

Bank name
[Input with autocomplete]

Routing number
[Input - 9 digits]
[? icon] Where to find this

Account number
[Input with show/hide]
[? icon] Where to find this

Account type
○ Checking ○ Savings

[Button] Submit for verification

[Link] I'll do this later
```

**Verifying State (micro-deposits):**
```
[⏳ Orange pulsing clock] 5. Connect your bank account
Badge: Verifying

[Expanded]

Verification in progress

Timeline:
Day 1: ✓ We've sent 2 small deposits to your account
Day 2-3: ⏳ Check your bank for deposits (usually $0.01-$0.99)
Day 3: ⬜ Enter deposit amounts to verify

Current status: Waiting for deposits to arrive
We'll email you when they're ready to verify

[Link] Change bank account
```

**Ready to Verify:**
```
[⏳ Orange clock] 5. Connect your bank account
Badge: Verify amounts

[Expanded]

Deposits have arrived! Enter the amounts to verify:

Deposit 1: $0.[__]
Deposit 2: $0.[__]

[Button] Verify amounts

Can't find the deposits? Check with your bank
[Link] Wrong account? Change bank account
```

**Completed State:**
```
[✓ Green checkmark] 5. Bank account connected
Badge: Verified

Your bank account has been verified and payouts are now enabled

Bank: [Bank Name]
Account: ****1234
Payout schedule: Daily (next business day)

[Link] View payout settings
[Link] Change bank account
```

### Task 6: Import Data (Optional)

**Unlocked State:**
```
[○ Gray square] 6. Import your products & customers
Badge: Optional - Skip if starting fresh
Time: ~10-30 min depending on data size

Moving from another POS system? We can help you migrate your data.

[Three option cards:]

[Card 1]
[Icon: Document/upload]
Import from CSV file
Upload your products and customers from a spreadsheet
[Button] Start import wizard

[Card 2]
[Icon: Plug/integration]
Connect another system
Import directly from Square, Shopify, or other platforms
[Button] View integrations
[Badge - if applicable] Coming soon

[Card 3]
[Icon: Plus/new]
Start from scratch
I'll add products manually or I'm a new business
[Button] Skip this step

[Link] Need help migrating data? Chat with specialist
```

**In Progress State (CSV import wizard):**
```
[● Blue dot] 6. Import your products & customers
Badge: In progress

[Expanded]

[Multi-step wizard:]

Step 1 of 4: Upload file

Upload your CSV file

[Drag-and-drop area]
Drag file here or click to browse
Accepted formats: .csv, .xlsx
Max size: 25MB

[Link] Don't have a CSV? Download template
[Link] Need help exporting from your old system?

---

Step 2 of 4: Map fields

Match your columns to Lightspeed fields

Your Column → Lightspeed Field
[Dropdowns for each mapping]

Example:
"Item Name" → Product Name
"Price" → Default Price
"SKU" → SKU
"Category" → Category

[Button] Continue to review

---

Step 3 of 4: Review & validate

Review your data before importing

Found: [N] products, [M] customers
[X] items ready to import
[Y] items need attention

[If errors - expandable list:]
▼ Items needing attention ([Y])
Row 15: Missing required field 'Price'
Row 32: Invalid SKU format

Options:
○ Fix in CSV and re-upload
○ Skip problematic rows
○ Import what's valid, fix later

[Button] Start import

---

Step 4 of 4: Importing

[Progress bar]
Importing [N] items...
320 of 500 complete

This may take a few minutes
Please don't close this page

---

Import complete!

[Success icon]
[N] products imported successfully
[M] customers imported successfully

[If partial success:]
[X] items couldn't be imported
[Link] Download error report
[Button] Fix and re-import failed items

[Button] View your products
(Opens X-Series product catalog)

[Button] Done
(Marks task complete)
```

**Completed State:**
```
[✓ Green checkmark] 6. Data imported
Badge: Complete

Successfully imported [N] products and [M] customers
Completed: [Date]

[Link] Import more data
```

**Skipped State:**
```
[– Gray dash] 6. Import products & customers
Badge: Skipped

You chose to start from scratch

[Link] Changed your mind? Import now
```

### Overall Progress Card

**When tasks incomplete:**
```
[Circular progress ring: 50%]
3 of 6 tasks complete

Critical tasks:
✓ Account created
✓ Software activated
✓ Hardware set up
⏳ Bank account (verifying)

Optional tasks:
⏭️ Data import (skipped)

[Info banner]
Almost there!
Complete the remaining tasks to start accepting payments

Next: Connect your bank account
[Button] Continue
```

**When all critical tasks complete:**
```
[Circular progress ring: 100%] ✓
All critical tasks complete!

[Success banner]
You're ready to go live!
Run a test transaction to make sure everything works

[Button - large, prominent]
Run test transaction
```

### Test Transaction Flow

**Step 1:**
```
Let's run a test payment
This makes sure everything works

[Button] Enter test mode
```

**Step 2:**
```
Create a test sale
Ring up a test sale in your POS

Instructions:
• Add any item to cart
• Choose payment type: Card
• Use test card: 4242 4242 4242 4242

☐ I've created the test sale

[Button] Continue
```

**Step 3:**
```
Process the payment
Process the payment on your terminal

Instructions:
• Test card will work on your terminal
• Payment processes but won't be charged

[Spinner] Detecting payment...
(System auto-detects when complete)
```

**Step 4:**
```
[✓ Large green checkmark - animated]

Test successful! Your system works perfectly

What was tested:
✓ POS software connected
✓ Payment terminal paired
✓ Transaction processed
✓ Receipt printed

[Button] Exit test mode

Ready to take your first real payment?
[Button - large]
Go live
```

### Completion Celebration

```
[Full-screen modal with subtle confetti animation]

[Trophy icon]

Congratulations! You're all set up

You're ready to accept payments and run your business with Lightspeed

[Summary card]
What you've accomplished:
✓ Account created and verified
✓ Software configured
✓ Hardware set up and tested
✓ Bank account connected
✓ Test transaction successful

Time to complete: 3 days
You're in the top 20% of fastest setups!

[Card]
What's next?
• Start taking real payments
• Explore advanced features
• Set up your team
• Connect integrations

[Button - large primary]
Start taking payments

[Link] View help center

─────────────────────

How was your onboarding experience?
[5-star rating]
[Optional comment field]
[Button] Share feedback
```

---

## Error Messages

### Form Validation Errors

**Required field:**
```
This field is required. Please enter your [field name].
```

**Invalid email:**
```
Please enter a valid email address.
```

**Invalid phone:**
```
Please enter a valid phone number in format (555) 123-4567.
```

**Password too weak:**
```
Password must be at least 8 characters with 1 uppercase letter and 1 number.
```

**Invalid SSN/EIN:**
```
Please enter a valid [Social Security Number / EIN] in format XXX-XX-XXXX.
```

**Age requirement:**
```
You must be 18 or older to create an account.
```

### API Errors

**Network error:**
```
Couldn't connect to server. Please check your internet connection and try again.
[Button] Retry
```

**Generic server error:**
```
Something went wrong on our end. Please try again in a moment or contact support if the problem persists.
[Button] Try again
Reference: [Error ID]
```

**Session expired:**
```
Your session has expired for security. Please sign in again.
[Button] Sign in
```

### Payment Errors

**Card declined:**
```
Payment unsuccessful. Your card was declined. Try another card?
[If reason available:] Reason: [Insufficient funds / Card expired / etc.]
[Button] Try another card
[Link] Contact your bank
[Link] Need help? Chat with us
```

**Payment processing error:**
```
We couldn't process your payment. Please try again or use a different payment method.
[Button] Try again
[Link] Use different card
[Link] Contact support
```

### KYB/KYC Errors

**Business verification failed:**
```
We couldn't verify your business information. Please check the details and try again.
Common issues:
• Business name doesn't match registration
• EIN/SSN format incorrect
• Address doesn't match records
[Button] Review and resubmit
[Link] Contact support
```

**Identity verification failed:**
```
We couldn't verify your identity. Please check your information and try again.
Common issues:
• Name doesn't match government records
• SSN format incorrect
• Date of birth incorrect
[Button] Review and resubmit
[Link] Contact support
```

**Additional documents required:**
```
Additional verification needed

We need additional documents to verify your business:
• Government-issued ID
• Business license
• Recent bank statement

[Drag-and-drop upload area]
Drag files here or click to browse
Accepted: PDF, JPG, PNG (Max 10MB)

Review typically takes 24 hours

[Button] Submit documents
[Link] Questions? Talk to verification team
```

### Hardware Errors

**Out of stock:**
```
This item is currently backordered
Ships by [Date]

Your options:
○ Wait for this item (ships [date])
○ Choose alternative: [Similar item]
○ Continue with other items, ship this later

[Button] Continue
```

**Compatibility check failed:**
```
[Device] isn't compatible with Lightspeed

We recommend: [Alternative device]
[Button] Add to cart

[Link] Have questions? Chat with hardware specialist
```

### Bank Verification Errors

**Wrong micro-deposit amounts:**
```
Those amounts don't match. Please try again.
Attempts remaining: [2]

Can't find the deposits? Check with your bank or wait 1-2 more business days.
[Link] Wrong account? Change bank account
```

**Max attempts reached:**
```
Maximum attempts reached

Please contact support to verify manually.
[Button] Contact support
[Link] Change bank account
```

---

## Success Messages

### Form Submission Success

**Generic success:**
```
[Checkmark icon] Saved successfully
```

**Specific confirmations:**
```
✓ Your quote has been saved and emailed to [email@business.com]
✓ Bank account added. Verification pending.
✓ Products imported successfully
✓ Hardware configuration updated
✓ Task marked as complete
```

### Inline Success (Auto-dismiss)

```
[Green checkmark] Changes saved
[Green checkmark] Email sent
[Green checkmark] Added to cart
[Green checkmark] Configuration updated
```

---

## Email Templates

### Email 1: KYB Approved

**Subject:**
```
You're approved! Complete your Lightspeed setup
```

**Body:**
```
Hi [First Name],

Great news! Your business has been approved for Lightspeed Payments.

You can now complete your purchase and get set up to accept payments.

[Button] Continue to Setup

What's next:
1. Choose your software and hardware
2. Complete your purchase
3. Get everything ready to take payments

Questions? We're here to help.

Thanks,
The Lightspeed Team

[Footer with contact info and unsubscribe]
```

### Email 2: Order Confirmation

**Subject:**
```
Order confirmed! Here's what happens next
```

**Body:**
```
Hi [First Name],

Thanks for your order! Here's your confirmation:

Order #[123456]
Order date: [Date]

Your order:
• Software: $X/month ([N] locations, [M] registers)
• Hardware: $Y one-time
• Total charged: $Z

What happens next:

✓ Software activated
Your login credentials have been sent to [email@business.com]
[Button] Access Lightspeed

📦 Hardware shipping
Expected delivery: [Date range]
We'll email you tracking info within 24 hours

🛡️ Payments activating
Ready in 24-48 hours
You'll be notified when you can accept payments

[Button] Track your setup progress

Questions? Reply to this email or call us at 1-800-XXX-XXXX

Thanks,
The Lightspeed Team

[Footer]
```

### Email 3: Hardware Shipped

**Subject:**
```
Your hardware is on the way!
```

**Body:**
```
Hi [First Name],

Your Lightspeed hardware has shipped!

Tracking: [1Z999AA1 0123456789]
[Button] Track shipment

Expected delivery: [Date range]
Shipping to: [Address]

What's in the box:
• POS Terminal × 2
• Payment Terminal × 2
• Receipt Printer × 2
• All necessary cables and accessories
• Quick start guide

When it arrives:
We'll guide you through a simple setup process. It takes about 20 minutes and we're here to help if you need it.

[Button] View setup checklist

Thanks,
The Lightspeed Team

[Footer]
```

### Email 4: Stall Reminder (Day 3)

**Subject:**
```
Your Lightspeed hardware is ready to set up
```

**Body:**
```
Hi [First Name],

We noticed you haven't set up your hardware yet. Need help?

Setting up your hardware takes about 20 minutes and gets you ready to accept payments.

[Button] Continue setup

Need help? We're here for you:
• [Link] Watch setup videos
• [Link] Chat with our team
• [Link] Schedule a setup call

Thanks,
The Lightspeed Team

[Footer]
```

### Email 5: Bank Account Reminder (Day 7)

**Subject:**
```
Don't forget to connect your bank account
```

**Body:**
```
Hi [First Name],

You can accept payments now, but you'll need to connect your bank account to receive payouts.

⚠️ Your payments are currently being held

Connecting your bank account takes just 3 minutes, and verification usually completes within 1-2 business days.

[Button] Connect bank account

Once verified, we'll automatically release your held payments.

Questions? We're here to help.

Thanks,
The Lightspeed Team

[Footer]
```

### Email 6: Bank Verified

**Subject:**
```
Your bank account is verified - payouts enabled!
```

**Body:**
```
Hi [First Name],

Great news! Your bank account has been verified.

Your payout settings:
• Bank: [Bank Name] ****1234
• Payout schedule: Daily (next business day)

You're all set to receive payments from your customers.

[Button] View payout details

Your next payout will arrive: [Date]

Thanks,
The Lightspeed Team

[Footer]
```

---

## Specialist Messaging

### Specialist Introduction (High-Value Merchants)

**In-product:**
```
Your specialist [Sarah Johnson] is ready to help

[Avatar]

Based on your business size, we're assigning you a dedicated payment specialist who will help you get set up and answer any questions.

What [Sarah] will help with:
• Customized pricing for your business
• Hardware recommendations
• Setup guidance
• Ongoing support

[Button] Schedule a call
[Link] Prefer to continue on your own?
```

**Email:**
```
Subject: Welcome to Lightspeed - Your dedicated specialist

Hi [First Name],

I'm [Sarah Johnson], your dedicated Lightspeed payment specialist.

I noticed you just signed up for Lightspeed, and based on your business size, I'd love to help you get set up.

I can help with:
• Custom pricing for your business
• Choosing the right hardware
• Getting everything configured
• Answering any questions

I'll be reaching out within the next 2 hours, but feel free to schedule a time that works better for you:

[Button] Schedule a call

Or call me directly at [phone number]

Looking forward to working with you!

[Sarah Johnson]
Payment Specialist, Lightspeed
[Photo] [Contact info]
```

### Specialist Check-in (Stalled Merchant)

**Email:**
```
Subject: Need help finishing your Lightspeed setup?

Hi [First Name],

I'm [Mike Chen], a setup specialist at Lightspeed.

I noticed you started setting up your account [X] days ago, and I wanted to reach out to see if you need any help getting everything finished.

I'm here to help with:
• Hardware setup
• Importing your products
• Connecting your bank account
• Running your first test payment

Would a quick 15-minute call help? I have availability:
• [Time slot 1]
• [Time slot 2]
• [Time slot 3]

Or [link to calendar]

No pressure - just want to make sure you have the support you need!

[Mike Chen]
Setup Specialist, Lightspeed
[Photo] [Contact info]
```

---

## Conclusion

This copy reference guide provides all user-facing text for the merchant onboarding flow. Use this as the single source of truth for all messaging.

**Implementation Notes:**
- Store all copy in a constants file (`/lib/constants/copy.ts`)
- Never hardcode UI text in components
- Use consistent variable formatting for dynamic content (e.g., `[First Name]`, `[Date]`)
- Maintain tone and voice across all touchpoints
- Update this document as copy evolves

**For Questions:**
- Reference Voice & Tone Guidelines section
- Consult main DESIGN_SPECIFICATIONS.md
- Schedule copy review with design team

---

**End of Copy Reference Guide**
