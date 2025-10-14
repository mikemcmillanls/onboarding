'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountForm, AccountFormData } from '@/components/get-started/account-form';
import { BusinessForm, BusinessFormData } from '@/components/get-started/business-form';
import { determineCohort } from '@/lib/merchant-mock-data';
import { CohortType } from '@/types/merchant-onboarding';

type PageNumber = 1 | 2;

export default function GetStartedPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageNumber>(1);
  const [accountData, setAccountData] = useState<AccountFormData | null>(null);

  const handleAccountFormNext = (data: AccountFormData) => {
    setAccountData(data);
    setCurrentPage(2);
  };

  const handleBusinessFormBack = () => {
    setCurrentPage(1);
  };

  const handleBusinessFormSubmit = async (businessData: BusinessFormData) => {
    if (!accountData) return;

    // Determine cohort based on revenue and locations
    const cohort: CohortType = determineCohort(
      businessData.annualRevenue,
      businessData.numberOfLocations
    );

    // Combine all data for storage
    const prequalificationData = {
      ...accountData,
      ...businessData,
      cohort,
    };

    // Store in localStorage for the dashboard to pick up
    if (typeof window !== 'undefined') {
      localStorage.setItem('prequalificationData', JSON.stringify(prequalificationData));
    }

    // Redirect to new dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Lightweight Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Lightspeed</h1>
                <p className="text-xs text-gray-600">POS & Payments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Form Pages with Animation */}
          <AnimatePresence mode="wait">
            {currentPage === 1 && (
              <AccountForm
                key="account-form"
                onNext={handleAccountFormNext}
                initialData={accountData || undefined}
              />
            )}

            {currentPage === 2 && (
              <BusinessForm
                key="business-form"
                onSubmit={handleBusinessFormSubmit}
                onBack={handleBusinessFormBack}
              />
            )}
          </AnimatePresence>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Setup in Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Trusted by Thousands</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>© 2024 Lightspeed Commerce Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
