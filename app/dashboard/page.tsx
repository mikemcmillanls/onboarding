'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/sidebar';
import { HeroSection } from '@/components/dashboard/hero-section';
import { ProgressIndicator } from '@/components/dashboard/progress-indicator';
import { ChecklistCard } from '@/components/dashboard/checklist-card';
import { MerchantStorage, StoredMerchant } from '@/lib/merchant-storage';
import { ChecklistTask } from '@/types/merchant-onboarding';
import { Loader2 } from 'lucide-react';

// Default checklist tasks
const getDefaultChecklistTasks = (): ChecklistTask[] => [
  {
    id: 'business-verification',
    title: 'Business Verification',
    description: 'Verify your identity to start taking payments with Lightspeed',
    status: 'not-started',
    required: true,
    route: '/dashboard/verify',
  },
  {
    id: 'pos-configuration',
    title: 'POS Configuration',
    description: 'Configure your point of sale system and locations',
    status: 'not-started',
    required: true,
    route: '/dashboard/pos-setup',
  },
  {
    id: 'hardware-selection',
    title: 'Hardware Selection',
    description: 'Get the hardware you need to run your business',
    status: 'not-started',
    required: true,
    route: '/dashboard/hardware',
  },
  {
    id: 'payment-setup',
    title: 'Payment Setup',
    description: 'Set up payment processing and connect your bank account',
    status: 'not-started',
    required: true,
    route: '/dashboard/payments',
  },
  {
    id: 'team-setup',
    title: 'Team Setup',
    description: 'Add team members and configure permissions',
    status: 'not-started',
    required: false,
    route: '/dashboard/team',
  },
  {
    id: 'import-data',
    title: 'Import Data',
    description: 'Import products, customers, and inventory',
    status: 'not-started',
    required: false,
    route: '/dashboard/import',
  },
];

// Determine task status from merchant data
function calculateTaskStatus(merchant: StoredMerchant): ChecklistTask[] {
  const tasks = getDefaultChecklistTasks();

  // Business Verification - based on KYB status
  if (merchant.kybStatus === 'approved') {
    tasks[0].status = 'completed';
  } else if (merchant.kybStatus === 'pending' || merchant.kybStatus === 'review') {
    tasks[0].status = 'in-progress';
  }

  // POS Configuration - based on posSetupData
  if (merchant.posSetupData?.locations && merchant.posSetupData?.registersPerLocation) {
    tasks[1].status = 'completed';
  } else if (merchant.posSetupData) {
    tasks[1].status = 'in-progress';
  }

  // Hardware Selection - based on checkoutData
  if (merchant.checkoutData?.paymentMethod || merchant.posSetupData?.existingHardware?.hasExisting) {
    tasks[2].status = 'completed';
  } else if (merchant.checkoutData) {
    tasks[2].status = 'in-progress';
  }

  // Payment Setup - based on bankAccountData and KYC status
  if (merchant.bankAccountData?.accountNumber && merchant.kycStatus === 'approved') {
    tasks[3].status = 'completed';
  } else if (merchant.bankAccountData || merchant.kycStatus === 'pending') {
    tasks[3].status = 'in-progress';
  }

  // Team Setup - check setupTasks for team-related tasks
  const teamTask = merchant.setupTasks?.find(t => t.id.includes('team'));
  if (teamTask?.completed) {
    tasks[4].status = 'completed';
  } else if (teamTask) {
    tasks[4].status = 'in-progress';
  }

  // Import Data - check setupTasks for import-related tasks
  const importTask = merchant.setupTasks?.find(t => t.id.includes('import') || t.id.includes('data'));
  if (importTask?.completed) {
    tasks[5].status = 'completed';
  } else if (importTask) {
    tasks[5].status = 'in-progress';
  }

  return tasks;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState<StoredMerchant | null>(null);
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>(getDefaultChecklistTasks());

  useEffect(() => {
    loadMerchantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMerchantData = async () => {
    try {
      setLoading(true);

      // Try to get merchant from localStorage (for newly created accounts)
      const prequalDataStr = typeof window !== 'undefined'
        ? localStorage.getItem('prequalificationData')
        : null;

      if (prequalDataStr) {
        const prequalData = JSON.parse(prequalDataStr);
        const merchantByEmail = await MerchantStorage.getMerchantByEmail(prequalData.email);

        if (merchantByEmail) {
          setMerchant(merchantByEmail);
          setChecklistTasks(calculateTaskStatus(merchantByEmail));
        } else {
          // Show default checklist for new user
          setMerchant({
            id: 'temp-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentStep: 1,
            cohort: prequalData.cohort || 'self-serve',
            kybStatus: 'pending',
            kycStatus: 'pending',
            orderConfirmed: false,
            hardwareShipped: false,
            paymentsActive: false,
            payoutsEnabled: false,
            setupTasks: [],
            signUpData: {
              firstName: '',
              lastName: '',
              email: prequalData.email,
              password: '',
              phone: prequalData.phone || '',
              businessName: prequalData.businessName || '',
              businessCategory: prequalData.businessCategory || '',
              revenueRange: prequalData.annualRevenue || '',
              locationCount: prequalData.numberOfLocations || 1,
              legalBusinessName: '',
              businessStructure: '',
              taxId: '',
              businessAddress: prequalData.businessAddress || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
              },
            },
          });
        }
      } else {
        // Try to get the most recent merchant
        const merchants = await MerchantStorage.getAllMerchants();
        if (merchants.length > 0) {
          const latestMerchant = merchants[merchants.length - 1];
          setMerchant(latestMerchant);
          setChecklistTasks(calculateTaskStatus(latestMerchant));
        } else {
          // No merchant found, redirect to get-started
          router.push('/get-started');
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return null;
  }

  const businessName = merchant.signUpData?.businessName || 'Your Business';
  const completedTasks = checklistTasks.filter(t => t.status === 'completed').length;
  const totalTasks = checklistTasks.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar businessName={businessName} />

      {/* Main Content */}
      <main className="lg:ml-[240px] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
          {/* Hero Section */}
          <div className="mb-6">
            <HeroSection
              businessName={businessName}
              completed={completedTasks}
              total={totalTasks}
            />
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <ProgressIndicator completed={completedTasks} total={totalTasks} />
          </div>

          {/* Checklist Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Setup Checklist</h2>
              <p className="text-gray-600 mt-1">
                Complete these tasks to get your business up and running
              </p>
            </div>

            {/* Checklist Cards */}
            <div className="space-y-2">
              {checklistTasks.map((task, index) => (
                <ChecklistCard key={task.id} task={task} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-800 mb-4">
              Our support team is here to help you get set up. Contact us anytime!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+15551234567"
                className="text-blue-700 hover:text-blue-900 font-medium underline"
              >
                Call (555) 123-4567
              </a>
              <a
                href="mailto:support@lightspeed.com"
                className="text-blue-700 hover:text-blue-900 font-medium underline"
              >
                Email Support
              </a>
              <a
                href="#"
                className="text-blue-700 hover:text-blue-900 font-medium underline"
              >
                Live Chat
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
