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
    id: 'individual-verification',
    title: 'Verify Your Identity',
    description: 'Complete identity verification for you and any business owners. Required to activate payment processing after purchase.',
    status: 'not-started',
    required: true,
    route: '/dashboard/verify',
    timeEstimate: '10-15 min',
    badgeText: 'Required to accept payments',
  },
  {
    id: 'pos-configuration',
    title: 'Configure Your POS',
    description: 'Tell us about your business setup. Required to configure payment processing and determine hardware needs.',
    status: 'not-started',
    required: true,
    route: '/dashboard/pos-setup',
    timeEstimate: '2-3 min',
    badgeText: 'Required to accept payments',
  },
  {
    id: 'bank-account-payouts',
    title: 'Connect Bank for Payouts',
    description: 'You can accept payments without this. Add your bank account to receive payouts from transactions.',
    status: 'not-started',
    required: false,
    route: '/dashboard/payments',
    timeEstimate: '1-3 min',
    badgeText: 'Optional - add anytime',
  },
  {
    id: 'hardware-selection',
    title: 'Hardware Selection',
    description: 'Select and order POS hardware bundles. Optional - you can use existing hardware.',
    status: 'not-started',
    required: false,
    route: '/dashboard/hardware',
    timeEstimate: '5-10 min',
    badgeText: 'Optional - can use existing',
  },
  {
    id: 'team-setup',
    title: 'Team Setup',
    description: 'Add team members and configure permissions',
    status: 'not-started',
    required: false,
    route: '/dashboard/team',
    timeEstimate: '3-5 min',
    badgeText: 'Optional - add anytime',
  },
  {
    id: 'import-data',
    title: 'Import Data',
    description: 'Import products, customers, and inventory',
    status: 'not-started',
    required: false,
    route: '/dashboard/import',
    timeEstimate: '10-30 min',
    badgeText: 'Optional - add anytime',
  },
];

// Determine task status from merchant data
function calculateTaskStatus(merchant: StoredMerchant): ChecklistTask[] {
  const tasks = getDefaultChecklistTasks();

  // Individual Verification (KYC) - index 0
  if (merchant.kycStatus === 'approved') {
    tasks[0].status = 'completed';
  } else if (merchant.kycStatus === 'pending' || merchant.kycStatus === 'review') {
    tasks[0].status = 'in-progress';
  }

  // POS Configuration - index 1
  if (merchant.posSetupData?.locations && merchant.posSetupData?.registersPerLocation) {
    tasks[1].status = 'completed';
  } else if (merchant.posSetupData) {
    tasks[1].status = 'in-progress';
  }

  // Bank Account (Payouts) - index 2
  if (merchant.bankAccountData?.accountNumber && merchant.bankAccountData?.routingNumber) {
    tasks[2].status = 'completed';
  } else if (merchant.bankAccountData) {
    tasks[2].status = 'in-progress';
  }

  // Hardware Selection - index 3
  if (merchant.checkoutData?.paymentMethod || merchant.posSetupData?.existingHardware?.hasExisting) {
    tasks[3].status = 'completed';
  } else if (merchant.checkoutData) {
    tasks[3].status = 'in-progress';
  }

  // Team Setup - index 4
  const teamTask = merchant.setupTasks?.find(t => t.id.includes('team'));
  if (teamTask?.completed) {
    tasks[4].status = 'completed';
  } else if (teamTask) {
    tasks[4].status = 'in-progress';
  }

  // Import Data - index 5
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
