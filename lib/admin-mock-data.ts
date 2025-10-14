import {
  MerchantOnboardingState,
  CohortType,
  SignUpFormData,
  POSSetupData,
  CheckoutData,
  BankAccountData,
} from '@/types/merchant-onboarding';

export type MerchantStatus = 'active' | 'stalled' | 'completed' | 'blocked';

export interface AdminMerchantRecord extends MerchantOnboardingState {
  id: string;
  merchantName: string;
  email: string;
  phone: string;
  createdAt: Date;
  lastActivity: Date;
  status: MerchantStatus;
  progressPercent: number;
}

// Helper to calculate progress percentage
function calculateProgress(currentStep: number, completed: boolean): number {
  if (completed) return 100;
  return (currentStep - 1) * 25; // 4 steps = 25% each
}

// Helper to determine merchant status
function determineStatus(
  currentStep: number,
  lastActivity: Date,
  kybStatus: string,
  kycStatus: string
): MerchantStatus {
  const hoursSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

  if (currentStep === 4 && kycStatus === 'approved') return 'completed';
  if (kybStatus === 'rejected' || kycStatus === 'rejected') return 'blocked';
  if (hoursSinceActivity > 24) return 'stalled';
  return 'active';
}

// Generate mock merchants with realistic data
export const mockMerchants: AdminMerchantRecord[] = [
  // Self-Serve Merchants
  {
    id: 'MERCH-2024-001',
    merchantName: 'Bean & Brew Coffee',
    email: 'sarah.mitchell@beanandbrewcoffee.com',
    phone: '(555) 234-5678',
    currentStep: 4,
    cohort: 'self-serve',
    kybStatus: 'approved',
    kycStatus: 'approved',
    orderConfirmed: true,
    hardwareShipped: true,
    paymentsActive: true,
    payoutsEnabled: true,
    setupTasks: [],
    createdAt: new Date('2024-10-08T09:00:00'),
    lastActivity: new Date('2024-10-10T14:30:00'),
    status: 'completed',
    progressPercent: 100,
    signUpData: {
      firstName: 'Sarah',
      lastName: 'Mitchell',
      email: 'sarah.mitchell@beanandbrewcoffee.com',
      password: '***',
      phone: '(555) 234-5678',
      businessName: 'Bean & Brew Coffee',
      businessCategory: 'cafe',
      revenueRange: '$100K-$250K',
      locationCount: 2,
      legalBusinessName: 'Bean & Brew Coffee LLC',
      businessStructure: 'llc',
      taxId: '**-***7890',
      businessAddress: {
        street: '123 Main Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
      },
    },
    posSetupData: {
      locations: 2,
      registersPerLocation: 2,
      needsEcommerce: true,
      hardwareBundles: [
        { bundleId: 'starter', quantity: 2 },
      ],
    },
    checkoutData: {
      paymentMethod: {
        cardNumber: '****-****-****-4242',
        expirationDate: '12/25',
        cvv: '***',
      },
      billingAddress: {
        street: '123 Main Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
      },
      shippingAddresses: [
        {
          locationName: 'Bean & Brew Downtown',
          street: '123 Main Street',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
        },
        {
          locationName: 'Bean & Brew Pearl District',
          street: '456 Pearl Ave',
          city: 'Portland',
          state: 'OR',
          zipCode: '97209',
        },
      ],
      identityVerification: {
        businessRepresentative: {
          fullName: 'Sarah Mitchell',
          dateOfBirth: '1985-06-15',
          ssnLast4: '****',
          homeAddress: {
            street: '789 Residential Blvd',
            city: 'Portland',
            state: 'OR',
            zipCode: '97202',
          },
          role: 'Owner',
        },
        businessOwners: [],
      },
    },
    bankAccountData: {
      accountHolderName: 'Bean & Brew Coffee LLC',
      bankName: 'Chase Bank',
      routingNumber: '******789',
      accountNumber: '******1234',
      accountType: 'checking',
    },
  },
  {
    id: 'MERCH-2024-002',
    merchantName: 'Urban Fitness Studio',
    email: 'james@urbanfitnessstudio.com',
    phone: '(555) 345-6789',
    currentStep: 2,
    cohort: 'self-serve',
    kybStatus: 'approved',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-09T14:20:00'),
    lastActivity: new Date('2024-10-10T08:15:00'),
    status: 'active',
    progressPercent: 25,
    signUpData: {
      firstName: 'James',
      lastName: 'Thompson',
      email: 'james@urbanfitnessstudio.com',
      password: '***',
      phone: '(555) 345-6789',
      businessName: 'Urban Fitness Studio',
      businessCategory: 'fitness',
      revenueRange: '$250K-$500K',
      locationCount: 1,
      legalBusinessName: 'Urban Fitness Studio Inc',
      businessStructure: 'corporation',
      taxId: '**-***4567',
      businessAddress: {
        street: '890 Fitness Blvd',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
      },
    },
  },
  {
    id: 'MERCH-2024-003',
    merchantName: 'Sweet Treats Bakery',
    email: 'maria@sweettreats.com',
    phone: '(555) 456-7890',
    currentStep: 1,
    cohort: 'self-serve',
    kybStatus: 'pending',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-07T11:00:00'),
    lastActivity: new Date('2024-10-07T11:30:00'),
    status: 'stalled',
    progressPercent: 0,
    signUpData: {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria@sweettreats.com',
      password: '***',
      phone: '(555) 456-7890',
      businessName: 'Sweet Treats Bakery',
      businessCategory: 'restaurant',
      revenueRange: '$50K-$100K',
      locationCount: 1,
      legalBusinessName: 'Sweet Treats Bakery',
      businessStructure: 'sole-proprietor',
      taxId: '***-**-****',
      businessAddress: {
        street: '234 Bakery Lane',
        city: 'Nashville',
        state: 'TN',
        zipCode: '37201',
      },
    },
  },

  // Assisted Merchants
  {
    id: 'MERCH-2024-004',
    merchantName: 'TrendyWear Fashion',
    email: 'alex@trendy-wear.com',
    phone: '(555) 567-8901',
    currentStep: 3,
    cohort: 'assisted',
    kybStatus: 'approved',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-09T09:30:00'),
    lastActivity: new Date('2024-10-10T13:45:00'),
    status: 'active',
    progressPercent: 50,
    assignedSpecialist: {
      name: 'Mike Chen',
      role: 'IC',
      phone: '(555) 100-2000',
      email: 'mike.chen@lightspeed.com',
    },
    signUpData: {
      firstName: 'Alex',
      lastName: 'Rodriguez',
      email: 'alex@trendy-wear.com',
      password: '***',
      phone: '(555) 567-8901',
      businessName: 'TrendyWear Fashion',
      businessCategory: 'retail',
      revenueRange: '$500K-$1M',
      locationCount: 4,
      legalBusinessName: 'TrendyWear Fashion Inc',
      businessStructure: 'corporation',
      taxId: '**-***2345',
      businessAddress: {
        street: '567 Fashion Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
      },
    },
    posSetupData: {
      locations: 4,
      registersPerLocation: 2,
      needsEcommerce: true,
      hardwareBundles: [
        { bundleId: 'professional', quantity: 4 },
      ],
    },
  },
  {
    id: 'MERCH-2024-005',
    merchantName: 'Garden & Home Supply',
    email: 'contact@gardenandhome.com',
    phone: '(555) 678-9012',
    currentStep: 2,
    cohort: 'assisted',
    kybStatus: 'approved',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-08T16:00:00'),
    lastActivity: new Date('2024-10-09T10:00:00'),
    status: 'stalled',
    progressPercent: 25,
    assignedSpecialist: {
      name: 'Emily Davis',
      role: 'IC',
      phone: '(555) 100-3000',
      email: 'emily.davis@lightspeed.com',
    },
    signUpData: {
      firstName: 'Robert',
      lastName: 'Anderson',
      email: 'contact@gardenandhome.com',
      password: '***',
      phone: '(555) 678-9012',
      businessName: 'Garden & Home Supply',
      businessCategory: 'retail',
      revenueRange: '$1M-$2M',
      locationCount: 6,
      legalBusinessName: 'Garden & Home Supply Co',
      businessStructure: 'llc',
      taxId: '**-***6789',
      businessAddress: {
        street: '890 Garden Way',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
      },
    },
    posSetupData: {
      locations: 6,
      registersPerLocation: 3,
      needsEcommerce: true,
      hardwareBundles: [
        { bundleId: 'professional', quantity: 6 },
      ],
    },
  },

  // Managed Merchants
  {
    id: 'MERCH-2024-006',
    merchantName: 'Premium Hotels Group',
    email: 'operations@premiumhotels.com',
    phone: '(555) 789-0123',
    currentStep: 3,
    cohort: 'managed',
    kybStatus: 'approved',
    kycStatus: 'review',
    orderConfirmed: true,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-05T10:00:00'),
    lastActivity: new Date('2024-10-10T11:00:00'),
    status: 'active',
    progressPercent: 50,
    assignedSpecialist: {
      name: 'Sarah Johnson',
      role: 'AE',
      phone: '(555) 100-1000',
      email: 'sarah.johnson@lightspeed.com',
    },
    signUpData: {
      firstName: 'David',
      lastName: 'Williams',
      email: 'operations@premiumhotels.com',
      password: '***',
      phone: '(555) 789-0123',
      businessName: 'Premium Hotels Group',
      businessCategory: 'hospitality',
      revenueRange: '$5M+',
      locationCount: 12,
      legalBusinessName: 'Premium Hotels Group Corporation',
      businessStructure: 'corporation',
      taxId: '**-***8901',
      businessAddress: {
        street: '1000 Luxury Boulevard',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
      },
    },
    posSetupData: {
      locations: 12,
      registersPerLocation: 4,
      needsEcommerce: false,
      hardwareBundles: [
        { bundleId: 'enterprise', quantity: 12 },
      ],
    },
  },
  {
    id: 'MERCH-2024-007',
    merchantName: 'Metro Restaurant Group',
    email: 'admin@metrorestaurants.com',
    phone: '(555) 890-1234',
    currentStep: 4,
    cohort: 'managed',
    kybStatus: 'approved',
    kycStatus: 'approved',
    orderConfirmed: true,
    hardwareShipped: true,
    paymentsActive: true,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-01T08:00:00'),
    lastActivity: new Date('2024-10-10T15:00:00'),
    status: 'active',
    progressPercent: 75,
    assignedSpecialist: {
      name: 'Sarah Johnson',
      role: 'AE',
      phone: '(555) 100-1000',
      email: 'sarah.johnson@lightspeed.com',
    },
    signUpData: {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'admin@metrorestaurants.com',
      password: '***',
      phone: '(555) 890-1234',
      businessName: 'Metro Restaurant Group',
      businessCategory: 'restaurant',
      revenueRange: '$5M+',
      locationCount: 15,
      legalBusinessName: 'Metro Restaurant Group LLC',
      businessStructure: 'llc',
      taxId: '**-***0123',
      businessAddress: {
        street: '2000 Culinary Drive',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
      },
    },
    posSetupData: {
      locations: 15,
      registersPerLocation: 3,
      needsEcommerce: false,
      hardwareBundles: [
        { bundleId: 'enterprise', quantity: 15 },
      ],
    },
    checkoutData: {
      paymentMethod: {
        cardNumber: '****-****-****-5555',
        expirationDate: '10/26',
        cvv: '***',
      },
      billingAddress: {
        street: '2000 Culinary Drive',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
      },
      shippingAddresses: [
        {
          locationName: 'Metro Restaurant HQ',
          street: '2000 Culinary Drive',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
        },
      ],
      identityVerification: {
        businessRepresentative: {
          fullName: 'Jennifer Martinez',
          dateOfBirth: '1978-09-20',
          ssnLast4: '****',
          homeAddress: {
            street: '3000 Executive Plaza',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60602',
          },
          role: 'CEO',
        },
        businessOwners: [
          {
            fullName: 'Michael Chen',
            ownershipPercent: 30,
            dateOfBirth: '1980-03-15',
            ssnLast4: '****',
            homeAddress: {
              street: '4000 Investment Way',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60603',
            },
            role: 'Co-Owner',
          },
        ],
      },
    },
  },
  {
    id: 'MERCH-2024-008',
    merchantName: 'Sports Arena Complex',
    email: 'info@sportsarena.com',
    phone: '(555) 901-2345',
    currentStep: 1,
    cohort: 'managed',
    kybStatus: 'review',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-09T15:00:00'),
    lastActivity: new Date('2024-10-10T09:00:00'),
    status: 'active',
    progressPercent: 0,
    assignedSpecialist: {
      name: 'Tom Wilson',
      role: 'AE',
      phone: '(555) 100-4000',
      email: 'tom.wilson@lightspeed.com',
    },
    signUpData: {
      firstName: 'Richard',
      lastName: 'Brown',
      email: 'info@sportsarena.com',
      password: '***',
      phone: '(555) 901-2345',
      businessName: 'Sports Arena Complex',
      businessCategory: 'entertainment',
      revenueRange: '$5M+',
      locationCount: 8,
      legalBusinessName: 'Sports Arena Complex Corporation',
      businessStructure: 'corporation',
      taxId: '**-***3456',
      businessAddress: {
        street: '5000 Stadium Drive',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
      },
    },
  },

  // Additional variety
  {
    id: 'MERCH-2024-009',
    merchantName: 'Bookworm Bookstore',
    email: 'owner@bookwormbookstore.com',
    phone: '(555) 012-3456',
    currentStep: 3,
    cohort: 'self-serve',
    kybStatus: 'approved',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-10T07:00:00'),
    lastActivity: new Date('2024-10-10T14:00:00'),
    status: 'active',
    progressPercent: 50,
    signUpData: {
      firstName: 'Linda',
      lastName: 'Taylor',
      email: 'owner@bookwormbookstore.com',
      password: '***',
      phone: '(555) 012-3456',
      businessName: 'Bookworm Bookstore',
      businessCategory: 'retail',
      revenueRange: '$100K-$250K',
      locationCount: 1,
      legalBusinessName: 'Bookworm Bookstore LLC',
      businessStructure: 'llc',
      taxId: '**-***5678',
      businessAddress: {
        street: '678 Reading Road',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
      },
    },
    posSetupData: {
      locations: 1,
      registersPerLocation: 2,
      needsEcommerce: true,
      hardwareBundles: [
        { bundleId: 'starter', quantity: 1 },
      ],
    },
  },
  {
    id: 'MERCH-2024-010',
    merchantName: 'Wellness Spa & Salon',
    email: 'info@wellnessspasalon.com',
    phone: '(555) 123-4567',
    currentStep: 2,
    cohort: 'assisted',
    kybStatus: 'approved',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
    createdAt: new Date('2024-10-06T13:00:00'),
    lastActivity: new Date('2024-10-08T16:00:00'),
    status: 'stalled',
    progressPercent: 25,
    assignedSpecialist: {
      name: 'Lisa Brown',
      role: 'IC',
      phone: '(555) 100-5000',
      email: 'lisa.brown@lightspeed.com',
    },
    signUpData: {
      firstName: 'Patricia',
      lastName: 'Lee',
      email: 'info@wellnessspasalon.com',
      password: '***',
      phone: '(555) 123-4567',
      businessName: 'Wellness Spa & Salon',
      businessCategory: 'wellness',
      revenueRange: '$500K-$1M',
      locationCount: 3,
      legalBusinessName: 'Wellness Spa & Salon Inc',
      businessStructure: 'corporation',
      taxId: '**-***7890',
      businessAddress: {
        street: '910 Wellness Way',
        city: 'San Diego',
        state: 'CA',
        zipCode: '92101',
      },
    },
    posSetupData: {
      locations: 3,
      registersPerLocation: 2,
      needsEcommerce: false,
      hardwareBundles: [
        { bundleId: 'professional', quantity: 3 },
      ],
    },
  },
];

// Recalculate all status and progress fields
mockMerchants.forEach(merchant => {
  merchant.status = determineStatus(
    merchant.currentStep,
    merchant.lastActivity,
    merchant.kybStatus,
    merchant.kycStatus
  );
  merchant.progressPercent = calculateProgress(
    merchant.currentStep,
    merchant.status === 'completed'
  );
});

// Helper function to get merchant by ID
export function getMerchantById(id: string): AdminMerchantRecord | undefined {
  return mockMerchants.find(m => m.id === id);
}

// Helper function to filter merchants by cohort
export function filterMerchantsByCohort(cohort?: CohortType): AdminMerchantRecord[] {
  if (!cohort) return mockMerchants;
  return mockMerchants.filter(m => m.cohort === cohort);
}

// Helper function to filter merchants by status
export function filterMerchantsByStatus(status?: MerchantStatus): AdminMerchantRecord[] {
  if (!status) return mockMerchants;
  return mockMerchants.filter(m => m.status === status);
}

// Helper function to search merchants by name or email
export function searchMerchants(query: string): AdminMerchantRecord[] {
  const lowerQuery = query.toLowerCase();
  return mockMerchants.filter(
    m =>
      m.merchantName.toLowerCase().includes(lowerQuery) ||
      m.email.toLowerCase().includes(lowerQuery)
  );
}

// Helper function to format time elapsed
export function formatTimeElapsed(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}
