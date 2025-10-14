'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { StepProgress } from '@/components/merchant/step-progress';
import { Step1SignUp } from '@/components/merchant/step1-signup';
import { Step2POSSetup } from '@/components/merchant/step2-pos-setup';
import { Step3Checkout } from '@/components/merchant/step3-checkout';
import { Step4Setup } from '@/components/merchant/step4-setup';
import {
  MerchantOnboardingState,
  SignUpFormData,
  POSSetupData,
  CheckoutData,
  StepNumber,
  CohortType,
} from '@/types/merchant-onboarding';
import { calculatePricing } from '@/lib/merchant-mock-data';
import { MerchantStorage } from '@/lib/merchant-storage';

function MerchantOnboardingContent() {
  const searchParams = useSearchParams();
  const isPrequalified = searchParams.get('prequalified') === 'true';

  const [state, setState] = useState<MerchantOnboardingState>({
    currentStep: 1,
    cohort: 'self-serve',
    kybStatus: 'pending',
    kycStatus: 'pending',
    orderConfirmed: false,
    hardwareShipped: false,
    paymentsActive: false,
    payoutsEnabled: false,
    setupTasks: [],
  });

  // Load prequalification data on mount if available
  useEffect(() => {
    if (isPrequalified && typeof window !== 'undefined') {
      const prequalDataStr = localStorage.getItem('prequalificationData');

      if (prequalDataStr) {
        try {
          const prequalData = JSON.parse(prequalDataStr);

          // Map prequalification data to SignUpFormData format
          const signUpData: Partial<SignUpFormData> = {
            firstName: '', // Not collected in prequalification
            lastName: '', // Not collected in prequalification
            email: prequalData.email,
            password: '', // Not collected in prequalification
            phone: prequalData.phone,
            businessName: prequalData.businessName,
            businessCategory: prequalData.businessCategory,
            revenueRange: prequalData.annualRevenue,
            locationCount: prequalData.numberOfLocations,
            legalBusinessName: '', // Will need to collect these in Step 1
            businessStructure: '',
            taxId: '',
            businessAddress: prequalData.businessAddress,
          };

          const cohort: CohortType = prequalData.cohort || 'self-serve';

          // Set state to skip Step 1 and go directly to Step 2
          setState({
            currentStep: 2 as StepNumber,
            cohort,
            signUpData,
            kybStatus: 'approved' as const, // Pre-approved based on pre-qualification
            kycStatus: 'pending',
            orderConfirmed: false,
            hardwareShipped: false,
            paymentsActive: false,
            payoutsEnabled: false,
            setupTasks: [],
            assignedSpecialist: cohort !== 'self-serve' ? {
              name: cohort === 'managed' ? 'Sarah Johnson' : 'Mike Chen',
              role: cohort === 'managed' ? 'AE' as const : 'IC' as const,
              phone: '(555) 123-4567',
              email: 'specialist@lightspeed.com',
            } : undefined,
          });

          // Clear the prequalification data from localStorage
          localStorage.removeItem('prequalificationData');
        } catch (error) {
          console.error('Failed to parse prequalification data:', error);
        }
      }
    }
  }, [isPrequalified]);

  // Save to file via API whenever state changes
  useEffect(() => {
    if (state.signUpData?.email) {
      MerchantStorage.saveMerchant(state).catch(error => {
        console.error('Failed to save merchant:', error);
      });
    }
  }, [state]);

  // Handle Step 1 completion
  const handleStep1Complete = (data: SignUpFormData, cohort: 'self-serve' | 'assisted' | 'managed') => {
    setState({
      ...state,
      currentStep: 2 as StepNumber,
      cohort,
      signUpData: data,
      kybStatus: 'approved' as const, // Simulated
      assignedSpecialist: cohort !== 'self-serve' ? {
        name: cohort === 'managed' ? 'Sarah Johnson' : 'Mike Chen',
        role: cohort === 'managed' ? 'AE' as const : 'IC' as const,
        phone: '(555) 123-4567',
        email: 'specialist@lightspeed.com',
      } : undefined,
    });
  };

  // Handle Step 2 completion
  const handleStep2Complete = (data: POSSetupData) => {
    setState({
      ...state,
      currentStep: 3 as StepNumber,
      posSetupData: data,
    });
  };

  // Handle Step 3 completion
  const handleStep3Complete = (data: CheckoutData) => {
    setState({
      ...state,
      currentStep: 4 as StepNumber,
      checkoutData: data,
      kycStatus: 'approved' as const,
      orderConfirmed: true,
      hardwareShipped: true,
      paymentsActive: true,
    });
  };

  // Handle Step 4 completion
  const handleStep4Complete = () => {
    // In a real app, redirect to main dashboard
    alert('Onboarding complete! Redirecting to your dashboard...');
  };

  // Navigation handlers
  const goBack = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as StepNumber,
    }));
  };

  // Calculate pricing for steps 2 & 3
  const pricing = state.posSetupData ? calculatePricing(
    state.posSetupData.locations || 1,
    state.posSetupData.registersPerLocation || 1,
    state.posSetupData.needsEcommerce || false,
    state.posSetupData.hardwareBundles || [],
    state.cohort
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Lightspeed Onboarding
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Get your business up and running in just 4 steps
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <StepProgress currentStep={state.currentStep} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step1SignUp
                onComplete={handleStep1Complete}
                initialData={state.signUpData}
              />
            </motion.div>
          )}

          {state.currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step2POSSetup
                onComplete={handleStep2Complete}
                onBack={goBack}
                cohort={state.cohort}
                businessCategory={state.signUpData?.businessCategory || ''}
                assignedSpecialist={state.assignedSpecialist}
              />
            </motion.div>
          )}

          {state.currentStep === 3 && pricing && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step3Checkout
                onComplete={handleStep3Complete}
                onBack={goBack}
                pricing={pricing}
                businessAddress={state.signUpData?.businessAddress || {
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                }}
              />
            </motion.div>
          )}

          {state.currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step4Setup
                onComplete={handleStep4Complete}
                cohort={state.cohort}
                assignedSpecialist={state.assignedSpecialist}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Lightspeed Commerce Inc. - Merchant Onboarding</p>
            <p>Need help? <a href="#" className="text-primary hover:underline font-medium">Contact Support</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function MerchantOnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <MerchantOnboardingContent />
    </Suspense>
  );
}
