import { HardwareBundle, SetupTask } from '@/types/merchant-onboarding';

// Hardware bundles based on business category
export const HARDWARE_BUNDLES: HardwareBundle[] = [
  {
    id: 'basic-retail',
    name: 'Essential Retail Kit',
    description: 'Perfect for small retail stores',
    items: [
      'Lightspeed POS Terminal',
      'Receipt Printer',
      'Barcode Scanner',
      'Cash Drawer',
    ],
    price: 1299,
    image: '/hardware/retail-basic.jpg',
    recommendedFor: ['retail', 'boutique', 'convenience'],
  },
  {
    id: 'basic-restaurant',
    name: 'Essential Restaurant Kit',
    description: 'Everything you need for table service',
    items: [
      'Lightspeed POS Terminal',
      'Kitchen Display System',
      'Receipt Printer',
      'Card Reader',
    ],
    price: 1499,
    image: '/hardware/restaurant-basic.jpg',
    recommendedFor: ['restaurant', 'cafe', 'bar'],
  },
  {
    id: 'advanced-retail',
    name: 'Professional Retail Kit',
    description: 'Advanced setup for busy retail environments',
    items: [
      '2x Lightspeed POS Terminals',
      '2x Receipt Printers',
      '2x Barcode Scanners',
      'Cash Drawer',
      'Customer Display',
      'Label Printer',
    ],
    price: 2899,
    image: '/hardware/retail-advanced.jpg',
    recommendedFor: ['retail', 'boutique', 'specialty'],
  },
  {
    id: 'advanced-restaurant',
    name: 'Professional Restaurant Kit',
    description: 'Complete solution for full-service restaurants',
    items: [
      '2x Lightspeed POS Terminals',
      '2x Kitchen Display Systems',
      'Expo Display',
      '2x Receipt Printers',
      '3x Card Readers',
      'Router & Networking',
    ],
    price: 3499,
    image: '/hardware/restaurant-advanced.jpg',
    recommendedFor: ['restaurant', 'fine-dining'],
  },
  {
    id: 'mobile-kit',
    name: 'Mobile POS Kit',
    description: 'Portable solution for on-the-go sales',
    items: [
      '2x Mobile Card Readers',
      'iPad Stand',
      'Receipt Printer (Bluetooth)',
      'Charging Station',
    ],
    price: 899,
    image: '/hardware/mobile.jpg',
    recommendedFor: ['mobile', 'events', 'popup'],
  },
];

// Business categories
export const BUSINESS_CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant / Food Service' },
  { value: 'cafe', label: 'Cafe / Coffee Shop' },
  { value: 'bar', label: 'Bar / Nightclub' },
  { value: 'retail', label: 'Retail / Clothing' },
  { value: 'boutique', label: 'Boutique / Specialty Store' },
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'grocery', label: 'Grocery / Market' },
  { value: 'pharmacy', label: 'Pharmacy / Health' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home-goods', label: 'Home Goods / Furniture' },
  { value: 'beauty', label: 'Beauty / Salon / Spa' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'sports', label: 'Sports / Recreation' },
  { value: 'pet', label: 'Pet Shop' },
  { value: 'other', label: 'Other' },
];

// Revenue ranges
export const REVENUE_RANGES = [
  { value: 'under-100k', label: 'Under $100,000', min: 0, max: 100000 },
  { value: '100k-250k', label: '$100,000 - $250,000', min: 100000, max: 250000 },
  { value: '250k-500k', label: '$250,000 - $500,000', min: 250000, max: 500000 },
  { value: '500k-1m', label: '$500,000 - $1M', min: 500000, max: 1000000 },
  { value: '1m-2m', label: '$1M - $2M', min: 1000000, max: 2000000 },
  { value: '2m-5m', label: '$2M - $5M', min: 2000000, max: 5000000 },
  { value: 'over-5m', label: 'Over $5M', min: 5000000, max: 999999999 },
];

// Business structures
export const BUSINESS_STRUCTURES = [
  { value: 'sole-proprietor', label: 'Sole Proprietor' },
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'nonprofit', label: 'Non-Profit' },
];

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Setup tasks for Step 4
export const DEFAULT_SETUP_TASKS: SetupTask[] = [
  {
    id: 'account-created',
    title: 'Account Created',
    description: 'Your Lightspeed account is ready',
    completed: true,
    required: true,
    status: 'completed',
  },
  {
    id: 'software-activated',
    title: 'Software Activated',
    description: 'Your licenses have been provisioned',
    completed: true,
    required: true,
    status: 'completed',
  },
  {
    id: 'hardware-shipped',
    title: 'Hardware Shipped',
    description: 'Track your hardware delivery',
    completed: true,
    required: true,
    status: 'completed',
    instructions: 'Your hardware is on the way! Expected delivery: 3-5 business days.',
  },
  {
    id: 'setup-hardware',
    title: 'Set Up Your Hardware',
    description: 'Connect and configure your POS terminals',
    completed: false,
    required: true,
    status: 'not-started',
    instructions: `
      1. Unbox your equipment and check all items
      2. Plug in your POS terminal and power it on
      3. Connect to WiFi using your network credentials
      4. Follow the on-screen setup wizard
      5. Pair your payment terminal
      6. Connect any additional peripherals (scanner, printer)
      7. Run a test transaction to verify everything works
    `,
  },
  {
    id: 'connect-bank',
    title: 'Connect Your Bank Account',
    description: 'Enable payouts for your sales',
    completed: false,
    required: true,
    status: 'not-started',
    instructions: `
      Provide your bank account information to receive payments from your sales.
      We'll verify your account with 2 small deposits within 1-2 business days.

      Note: You can accept payments now, but payouts are held until verification completes.
    `,
  },
  {
    id: 'import-data',
    title: 'Import Products & Customers',
    description: 'Bring your existing data into Lightspeed',
    completed: false,
    required: false,
    status: 'not-started',
    instructions: `
      Moving from another POS? Import your products and customers:

      Option 1: Upload a CSV file (we'll help you map the fields)
      Option 2: Start fresh and add items as you go
      Option 3: Contact support for assisted migration
    `,
  },
  {
    id: 'configure-integrations',
    title: 'Configure Integrations',
    description: 'Connect accounting, eCommerce, and other tools',
    completed: false,
    required: false,
    status: 'not-started',
    instructions: `
      Connect Lightspeed with your other business tools:
      - Accounting software (QuickBooks, Xero)
      - eCommerce platform (Shopify, WooCommerce)
      - Marketing tools (Mailchimp, Constant Contact)
      - Loyalty programs
    `,
  },
];

// Cohort assignment logic (simplified)
export function determineCohort(revenueRange: string, locationCount: number): 'self-serve' | 'assisted' | 'managed' {
  const revenue = REVENUE_RANGES.find(r => r.value === revenueRange);

  if (!revenue) return 'self-serve';

  const minRevenue = revenue.min;

  // Managed: $2M+ or 10+ locations
  if (minRevenue >= 2000000 || locationCount >= 10) {
    return 'managed';
  }

  // Assisted: $500K-$2M or 3-10 locations
  if (minRevenue >= 500000 || locationCount >= 3) {
    return 'assisted';
  }

  // Self-serve: everything else
  return 'self-serve';
}

// Pricing calculation
export function calculatePricing(
  locations: number,
  registersPerLocation: number,
  needsEcommerce: boolean,
  hardwareBundles: Array<{ bundleId: string; quantity: number }>,
  cohort: 'self-serve' | 'assisted' | 'managed'
) {
  // Software pricing (per location per month)
  const locationPrice = 199;
  const registerPrice = 89;
  const ecommercePrice = 99;

  const softwareMonthly =
    (locations * locationPrice) +
    (locations * registersPerLocation * registerPrice) +
    (needsEcommerce ? ecommercePrice : 0);

  // Hardware pricing
  const hardwareOneTime = hardwareBundles.reduce((total, selection) => {
    const bundle = HARDWARE_BUNDLES.find(b => b.id === selection.bundleId);
    return total + (bundle ? bundle.price * selection.quantity : 0);
  }, 0);

  // Implementation package for managed
  const implementationPackage = cohort === 'managed' ? 2500 : undefined;

  return {
    softwareMonthly,
    hardwareOneTime,
    paymentsProcessing: {
      description: 'Lightspeed Payments',
      rate: '2.6% + $0.10 per transaction',
    },
    implementationPackage,
    total: {
      dueToday: hardwareOneTime + (implementationPackage || 0),
      monthly: softwareMonthly,
    },
  };
}
