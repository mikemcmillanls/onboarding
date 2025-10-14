# Routing and Data Flow Specification

This document provides comprehensive specifications for routing, state management, and data flow in the Lightspeed merchant dashboard.

---

## Table of Contents

1. [Route Structure](#route-structure)
2. [Data Flow](#data-flow)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Navigation Patterns](#navigation-patterns)
6. [Error Handling](#error-handling)

---

## Route Structure

### Complete Route Map

```
/
├── (landing page)
├── /get-started
│   └── Account creation form (2 pages)
└── /dashboard
    ├── (main checklist view)
    ├── /verify
    │   └── Business verification (KYB)
    ├── /pos-setup
    │   └── POS configuration
    ├── /hardware
    │   └── Hardware selection & purchase
    ├── /payments
    │   └── Bank account & payment setup
    ├── /team
    │   └── Team member management (optional)
    ├── /import
    │   └── Data import wizard (optional)
    └── /settings
        └── Account settings
```

### Route Details

#### `/dashboard` - Main Dashboard

**Purpose:** Display checklist of onboarding tasks

**Access Control:**
- Requires: Account created
- Redirects to `/get-started` if no account

**Data Requirements:**
- Merchant profile data
- Task completion status
- Business name

**Components:**
- DashboardLayout
- HeroSection
- ProgressIndicator
- ChecklistGrid with ChecklistCards

---

#### `/dashboard/verify` - Business Verification

**Purpose:** Complete KYB (Know Your Business) verification

**Access Control:**
- Open to all authenticated merchants
- Cannot be skipped (required)

**Data Requirements:**
- Load existing signUpData from merchant state
- Legal business name
- Business structure
- Tax ID (EIN)
- Registered business address

**Data Collection:**
```typescript
interface KYBData {
  legalBusinessName: string;
  businessStructure: 'sole_proprietorship' | 'llc' | 'corporation' | 'partnership';
  taxId: string; // EIN
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessPhone: string;
  businessEmail: string;
  yearEstablished: string;
  businessDescription: string;
}
```

**On Complete:**
1. Save KYB data to merchant state
2. Update `kybStatus` to 'approved' (or 'review')
3. Enable dependent tasks (Hardware, Payments)
4. Redirect to `/dashboard`

---

#### `/dashboard/pos-setup` - POS Configuration

**Purpose:** Configure POS system (locations, registers, ecommerce)

**Access Control:**
- Requires: Business verification completed
- Redirects to `/dashboard/verify` if not completed

**Data Requirements:**
- Number of locations
- Registers per location
- Ecommerce needs
- Business category (from account creation)

**Data Collection:**
```typescript
interface POSSetupData {
  locations: number;
  registersPerLocation: number;
  needsEcommerce: boolean;
  locationDetails?: Array<{
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }>;
}
```

**On Complete:**
1. Save POS setup data
2. Calculate pricing based on configuration
3. Update task status to 'completed'
4. Redirect to `/dashboard`

---

#### `/dashboard/hardware` - Hardware Selection

**Purpose:** Select and purchase hardware bundles

**Access Control:**
- Requires: Business verification completed
- Redirects to `/dashboard/verify` if KYB not approved

**Data Requirements:**
- Available hardware bundles (from API or config)
- Business category (for recommendations)
- Number of locations/registers (from POS setup)
- Shipping addresses

**Data Collection:**
```typescript
interface HardwareData {
  selectedBundles: Array<{
    bundleId: string;
    quantity: number;
  }>;
  shippingAddresses: Array<{
    locationName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
  hasExistingHardware: boolean;
  existingHardwareInfo?: Array<{
    make: string;
    model: string;
    serialNumber?: string;
  }>;
}
```

**On Complete:**
1. Process payment (if not existing hardware)
2. Save hardware selection
3. Create shipping orders
4. Update task status to 'completed'
5. Redirect to `/dashboard`

---

#### `/dashboard/payments` - Payment Setup

**Purpose:** Configure payment processing and bank account for payouts

**Access Control:**
- Requires: Business verification completed
- Requires: KYC data collection

**Data Requirements:**
- Business representative information
- Beneficial owners (>25% ownership)
- Bank account details

**Data Collection:**
```typescript
interface PaymentSetupData {
  // KYC Data
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
  beneficialOwners: Array<{
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
  }>;

  // Bank Account
  bankAccount: {
    accountHolderName: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  };
}
```

**On Complete:**
1. Submit KYC data for verification
2. Submit bank account for verification
3. Update `kycStatus` to 'pending' or 'approved'
4. Update `payoutsEnabled` when verified
5. Update task status to 'completed'
6. Redirect to `/dashboard`

---

#### `/dashboard/team` - Team Setup (Optional)

**Purpose:** Add team members and assign roles/permissions

**Access Control:**
- No prerequisites (optional task)
- Can be completed at any time

**Data Collection:**
```typescript
interface TeamMember {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: {
    canManageSettings: boolean;
    canProcessRefunds: boolean;
    canViewReports: boolean;
    canManageInventory: boolean;
  };
  assignedLocations: string[]; // location IDs
}
```

**On Complete:**
1. Send invitation emails to team members
2. Save team member data
3. Update task status to 'completed'
4. Redirect to `/dashboard`

---

#### `/dashboard/import` - Data Import (Optional)

**Purpose:** Import existing products, customers, inventory from CSV or other POS

**Access Control:**
- Requires: POS configuration completed
- Optional task

**Data Collection:**
```typescript
interface DataImportInfo {
  importType: 'csv' | 'square' | 'shopify' | 'clover' | 'other';
  dataTypes: Array<'products' | 'customers' | 'inventory' | 'sales_history'>;
  files?: File[];
  apiCredentials?: {
    apiKey: string;
    accessToken: string;
  };
}
```

**On Complete:**
1. Process import files/API sync
2. Validate data format
3. Import data into system
4. Show import summary
5. Update task status to 'completed'
6. Redirect to `/dashboard`

---

## Data Flow

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  1. LANDING PAGE → /get-started (Account Creation)             │
│     - Collect: Name, Email, Password, Business Name            │
│     - Collect: Business Category, Revenue, Locations           │
│     - Store in: localStorage as 'prequalificationData'         │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                    router.push('/dashboard')
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. DASHBOARD (/dashboard)                                      │
│     - Load merchant data from localStorage/API                 │
│     - Construct checklist based on completion status           │
│     - Display progress and available tasks                     │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                    User clicks "Start" on task
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. TASK PAGE (e.g., /dashboard/verify)                        │
│     - Load existing data (if any)                              │
│     - Display form with pre-filled values                      │
│     - Validate inputs                                          │
│     - Submit data on completion                                │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. DATA PERSISTENCE                                            │
│     - Save to API: POST /api/merchants/[email]                 │
│     - Update localStorage cache                                │
│     - Sync across tabs (storage event)                         │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                    router.push('/dashboard')
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. DASHBOARD REFRESH                                           │
│     - Reload merchant data                                     │
│     - Update task statuses                                     │
│     - Recalculate progress                                     │
│     - Show updated UI with completed task                      │
└─────────────────────────────────────────────────────────────────┘
```

### Data Persistence Strategy

**Three-Tier Storage:**

1. **Client-Side (localStorage):**
   - Used for: Temporary data, caching, offline access
   - Key: `prequalificationData`, `merchantEmail`
   - Cleared: After successful API sync

2. **Server-Side (File System - Dev):**
   - Used for: Development/testing merchant data
   - Location: `/data/merchants/[email].json`
   - Format: MerchantOnboardingState JSON

3. **Production Database:**
   - Used for: Production merchant data
   - Schema: Matches MerchantOnboardingState
   - Access: Via API routes

---

## State Management

### Merchant State Structure

```typescript
interface MerchantOnboardingState {
  // Identity
  merchantId?: string;
  currentStep: StepNumber; // Legacy, kept for compatibility

  // Cohort Assignment
  cohort: 'self-serve' | 'assisted' | 'managed';

  // Account Data (from /get-started)
  signUpData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    businessCategory: string;
    revenueRange: string;
    locationCount: number;
    // KYB data (from /dashboard/verify)
    legalBusinessName?: string;
    businessStructure?: string;
    taxId?: string;
    businessAddress?: Address;
  };

  // POS Setup Data (from /dashboard/pos-setup)
  posSetupData?: {
    locations: number;
    registersPerLocation: number;
    needsEcommerce: boolean;
    locationDetails?: LocationDetail[];
  };

  // Hardware Data (from /dashboard/hardware)
  checkoutData?: {
    selectedBundles: HardwareSelection[];
    shippingAddresses: Address[];
    hasExistingHardware: boolean;
    existingHardwareInfo?: ExistingHardwareInfo[];
  };

  // Payment Data (from /dashboard/payments)
  bankAccountData?: {
    accountHolderName: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  };

  // Verification Statuses
  kybStatus: 'pending' | 'approved' | 'review' | 'rejected';
  kycStatus: 'pending' | 'approved' | 'review' | 'rejected';

  // Activation Flags
  orderConfirmed: boolean;
  hardwareShipped: boolean;
  paymentsActive: boolean;
  payoutsEnabled: boolean;

  // Support Assignment
  assignedSpecialist?: {
    name: string;
    role: 'AE' | 'IC';
    phone: string;
    email: string;
  };

  // Setup Tasks (legacy from Step 4)
  setupTasks: SetupTask[];
}
```

### State Update Patterns

**Loading State:**
```typescript
const [merchantState, setMerchantState] = useState<MerchantOnboardingState | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadMerchant = async () => {
    try {
      const email = localStorage.getItem('merchantEmail');
      if (!email) {
        router.push('/get-started');
        return;
      }

      const response = await fetch(`/api/merchants/${email}`);
      if (response.ok) {
        const data = await response.json();
        setMerchantState(data);
      }
    } catch (error) {
      console.error('Failed to load merchant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadMerchant();
}, []);
```

**Updating State:**
```typescript
const updateMerchant = async (updates: Partial<MerchantOnboardingState>) => {
  try {
    const updatedState = { ...merchantState, ...updates };

    // Optimistic update
    setMerchantState(updatedState);

    // Persist to API
    const response = await fetch(`/api/merchants/${merchantState.signUpData?.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedState),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }
  } catch (error) {
    console.error('Failed to update merchant:', error);
    // Revert optimistic update
    setMerchantState(merchantState);
  }
};
```

---

## API Integration

### API Routes

#### `POST /api/merchants`

**Purpose:** Create new merchant account

**Request:**
```typescript
{
  email: string;
  businessName: string;
  cohort: CohortType;
  signUpData: Partial<SignUpFormData>;
}
```

**Response:**
```typescript
{
  success: boolean;
  merchantId: string;
  message: string;
}
```

---

#### `GET /api/merchants/[email]`

**Purpose:** Load merchant data

**Response:**
```typescript
MerchantOnboardingState
```

---

#### `PUT /api/merchants/[email]`

**Purpose:** Update merchant data

**Request:**
```typescript
Partial<MerchantOnboardingState>
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### `POST /api/merchants/[email]/verify-kyb`

**Purpose:** Submit KYB verification

**Request:**
```typescript
{
  legalBusinessName: string;
  businessStructure: string;
  taxId: string;
  businessAddress: Address;
}
```

**Response:**
```typescript
{
  success: boolean;
  kybStatus: 'approved' | 'review' | 'rejected';
  message: string;
}
```

---

#### `POST /api/merchants/[email]/verify-kyc`

**Purpose:** Submit KYC verification

**Request:**
```typescript
{
  businessRepresentative: Representative;
  beneficialOwners: Owner[];
}
```

**Response:**
```typescript
{
  success: boolean;
  kycStatus: 'approved' | 'review' | 'rejected';
  message: string;
}
```

---

## Navigation Patterns

### Standard Navigation Flow

```typescript
// From dashboard card → task page
<ChecklistCard onClick={() => router.push('/dashboard/verify')} />

// After task completion → back to dashboard
const handleComplete = async (data: any) => {
  await updateMerchant({ verificationData: data, kybStatus: 'approved' });
  router.push('/dashboard');
};

// Cancel/Back → return to dashboard
<Button onClick={() => router.back()}>Cancel</Button>
```

### Protected Routes

**Middleware Pattern:**

```typescript
// app/dashboard/[task]/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMerchantState } from '@/hooks/use-merchant-state';

export default function TaskPage() {
  const router = useRouter();
  const { merchantState, isLoading } = useMerchantState();

  useEffect(() => {
    if (!isLoading) {
      // Check prerequisites
      if (merchantState.kybStatus !== 'approved') {
        router.push('/dashboard/verify');
      }
    }
  }, [merchantState, isLoading, router]);

  // ... rest of component
}
```

### Deep Linking

**Support direct access to task pages:**

```typescript
// URL: /dashboard/hardware?from=email

useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get('from');

  // Track source for analytics
  if (from) {
    analytics.track('Task Accessed', { task: 'hardware', source: from });
  }
}, []);
```

---

## Error Handling

### Error Types

1. **Network Errors:** API unavailable, timeout
2. **Validation Errors:** Invalid input data
3. **Permission Errors:** Trying to access blocked tasks
4. **State Errors:** Corrupted or missing data

### Error Handling Pattern

```typescript
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <div className="space-y-2">
          <Button onClick={resetErrorBoundary} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TaskPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TaskContent />
    </ErrorBoundary>
  );
}
```

### API Error Handling

```typescript
async function saveMerchantData(data: any) {
  try {
    const response = await fetch('/api/merchants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save data');
    }

    return await response.json();
  } catch (error) {
    // Network error
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your connection.');
    }

    // API error
    throw error;
  }
}
```

### Validation Error Display

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  legalBusinessName: z.string().min(1, 'Business name is required'),
  taxId: z.string().regex(/^\d{2}-?\d{7}$/, 'Invalid EIN format'),
});

export function VerificationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await submitVerification(data);
      router.push('/dashboard');
    } catch (error) {
      // Show error toast
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('legalBusinessName')} />
        {errors.legalBusinessName && (
          <p className="text-red-600 text-sm mt-1">
            {errors.legalBusinessName.message}
          </p>
        )}
      </div>
      {/* ... more fields */}
    </form>
  );
}
```

---

## Testing Strategy

### Route Testing

```typescript
// __tests__/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/app/dashboard/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Dashboard Page', () => {
  it('redirects to /get-started if no account', async () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock no localStorage data
    Storage.prototype.getItem = jest.fn(() => null);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/get-started');
    });
  });

  it('displays checklist when data loaded', async () => {
    // Mock localStorage data
    Storage.prototype.getItem = jest.fn(() => 'test@example.com');

    // Mock API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMerchantState),
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Business Verification')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/onboarding-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('/api/merchants', (req, res, ctx) => {
    return res(ctx.json({ success: true, merchantId: '123' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Complete Onboarding Flow', () => {
  it('completes full journey from get-started to dashboard', async () => {
    // 1. Start at get-started
    const { container } = render(<GetStartedPage />);

    // 2. Fill account form
    fireEvent.change(screen.getByLabelText('Business Name'), {
      target: { value: 'Test Business' },
    });
    // ... fill other fields

    fireEvent.click(screen.getByText('Next'));

    // 3. Fill business form
    // ...

    fireEvent.click(screen.getByText('Get Started'));

    // 4. Verify redirect to dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });

    // 5. Verify checklist appears
    expect(screen.getByText('Business Verification')).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load task pages
import dynamic from 'next/dynamic';

const VerifyPage = dynamic(() => import('./verify/page'), {
  loading: () => <TaskPageSkeleton />,
});
```

### Data Prefetching

```typescript
// Prefetch next likely task
<Link href="/dashboard/pos-setup" prefetch>
  <ChecklistCard />
</Link>
```

### Caching Strategy

```typescript
// SWR for data fetching
import useSWR from 'swr';

function useMerchantData(email: string) {
  const { data, error, mutate } = useSWR(
    `/api/merchants/${email}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    merchantState: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
```

---

## Security Considerations

### Authentication Check

```typescript
// Middleware to verify session
export async function middleware(request: NextRequest) {
  const session = await getSession(request);

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/get-started', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

### Data Sanitization

```typescript
// Sanitize user input before saving
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

const saveMerchant = (data: any) => {
  const sanitized = {
    ...data,
    businessName: sanitizeInput(data.businessName),
    email: sanitizeInput(data.email),
  };

  // Save sanitized data
};
```

---

## Monitoring & Analytics

### Track User Journey

```typescript
// Track task completion
const trackTaskCompletion = (taskId: string, timeSpent: number) => {
  analytics.track('Task Completed', {
    taskId,
    timeSpent,
    timestamp: new Date().toISOString(),
  });
};

// Track navigation
const trackNavigation = (from: string, to: string) => {
  analytics.track('Page View', {
    from,
    to,
    timestamp: new Date().toISOString(),
  });
};
```

### Error Tracking

```typescript
// Send errors to monitoring service
const reportError = (error: Error, context: any) => {
  Sentry.captureException(error, {
    extra: context,
  });
};
```

---

**Version:** 1.0
**Last Updated:** 2025-10-10
**Status:** Ready for Implementation
