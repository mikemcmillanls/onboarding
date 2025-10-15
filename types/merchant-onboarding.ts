export type CohortType = 'self-serve' | 'assisted' | 'managed';

export type StepNumber = 1 | 2 | 3 | 4;

// Step 1: Sign Up & Tell Us About Your Business
export interface SignUpFormData {
  // Account Creation
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;

  // Business Basics
  businessName: string;
  businessCategory: string;
  revenueRange: string;
  locationCount: number;

  // Legal Details (Page 2)
  legalBusinessName: string;
  businessStructure: string;
  taxId: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Step 2: Set Up Your POS & Payments
export interface POSSetupData {
  locations: number;
  registersPerLocation: number;
  needsEcommerce: boolean;
  hardwareBundles: HardwareSelection[];
  existingHardware?: ExistingHardwareInfo;
}

export interface HardwareBundle {
  id: string;
  name: string;
  description: string;
  items: string[];
  price: number;
  image: string;
  recommendedFor: string[];
}

export interface HardwareSelection {
  bundleId: string;
  quantity: number;
}

export interface ExistingHardwareInfo {
  hasExisting: boolean;
  devices: Array<{
    make: string;
    model: string;
    serialNumber?: string;
  }>;
}

// Step 3: Complete Purchase & Verification
export interface CheckoutData {
  paymentMethod: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingAddresses: Array<{
    locationName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
  identityVerification: IdentityVerification;
}

export interface IdentityVerification {
  businessRepresentative: {
    fullName: string;
    dateOfBirth: string;
    ssnLast4: string;
    homeAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    role: string;
  };
  businessOwners: Array<{
    fullName: string;
    ownershipPercent: number;
    dateOfBirth: string;
    ssnLast4: string;
    homeAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    role: string;
  }>;
}

// Step 4: Get Everything Ready
export interface SetupTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  instructions?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface BankAccountData {
  accountHolderName: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
}

// Merchant Journey State
export interface MerchantOnboardingState {
  currentStep: StepNumber;
  cohort: CohortType;

  // Data from each step
  signUpData?: Partial<SignUpFormData>;
  posSetupData?: Partial<POSSetupData>;
  checkoutData?: Partial<CheckoutData>;
  bankAccountData?: Partial<BankAccountData>;

  // Status tracking
  kybStatus: 'pending' | 'approved' | 'review' | 'rejected';
  kycStatus: 'pending' | 'approved' | 'review' | 'rejected';
  orderConfirmed: boolean;
  hardwareShipped: boolean;
  paymentsActive: boolean;
  payoutsEnabled: boolean;

  // Support assignments (invisible to merchant initially)
  assignedSpecialist?: {
    name: string;
    role: 'AE' | 'IC';
    phone: string;
    email: string;
    photo?: string;
  };

  setupTasks: SetupTask[];
}

// Pricing calculations
export interface PricingBreakdown {
  softwareMonthly: number;
  hardwareOneTime: number;
  paymentsProcessing: {
    description: string;
    rate: string;
  };
  implementationPackage?: number;
  total: {
    dueToday: number;
    monthly: number;
  };
}

// Order summary
export interface OrderSummary {
  orderId: string;
  orderDate: Date;
  items: {
    software: {
      locations: number;
      registers: number;
      ecommerce: boolean;
      monthlyPrice: number;
    };
    hardware: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    services?: Array<{
      name: string;
      price: number;
    }>;
  };
  pricing: PricingBreakdown;
  shippingInfo: {
    trackingNumbers: string[];
    estimatedDelivery: Date;
  };
}

// Dashboard Checklist Types
export type ChecklistTaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  status: ChecklistTaskStatus;
  required: boolean;
  route: string;
  icon?: string;
  timeEstimate?: string;
  badgeText?: string;
}

export interface DashboardState {
  businessName: string;
  merchantId: string;
  checklistTasks: ChecklistTask[];
  overallProgress: number; // percentage
}
