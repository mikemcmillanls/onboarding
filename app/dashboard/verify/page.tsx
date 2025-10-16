'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { US_STATES, BUSINESS_CATEGORIES, BUSINESS_STRUCTURES } from '@/lib/merchant-mock-data';
import { MerchantStorage } from '@/lib/merchant-storage';
import { Textarea } from '@/components/ui/textarea';

interface BeneficialOwner {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ssnLast4: string;
  ownershipPercentage: string;
}

interface VerificationFormData {
  // Step 1-4: Individual KYC
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  homeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ssnLast4: string;
  title: string;
  ownershipPercentage: string;
  tosAccepted: boolean;

  // Step 5: Business Entity KYB
  legalBusinessName: string;
  businessStructure: string;
  ein: string;
  businessPhone: string;
  customerSupportPhone: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessWebsite: string;
  productDescription: string;
  businessCategory: string;

  // Step 6: Beneficial Owners (conditional)
  hasOtherOwners: boolean;
  beneficialOwners: BeneficialOwner[];

  // Step 8: Bank Account (optional)
  skipBankAccount: boolean;
  bankAccountHolderName: string;
  bankName: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Business Owner' },
  { value: 'ceo', label: 'CEO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'president', label: 'President' },
  { value: 'partner', label: 'Partner' },
];

export default function VerifyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<VerificationFormData>({
    // Individual KYC
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    homeAddress: { street: '', city: '', state: '', zipCode: '' },
    ssnLast4: '',
    title: '',
    ownershipPercentage: '',
    tosAccepted: false,
    // Business KYB
    legalBusinessName: '',
    businessStructure: '',
    ein: '',
    businessPhone: '',
    customerSupportPhone: '',
    businessAddress: { street: '', city: '', state: '', zipCode: '' },
    businessWebsite: '',
    productDescription: '',
    businessCategory: '',
    // Beneficial Owners
    hasOtherOwners: false,
    beneficialOwners: [],
    // Bank Account (optional)
    skipBankAccount: false,
    bankAccountHolderName: '',
    bankName: '',
    accountType: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load merchant data and pre-fill form
  useEffect(() => {
    loadMerchantData();
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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

        if (merchantByEmail?.signUpData) {
          // Pre-fill both individual and business data from signup
          setFormData(prev => ({
            ...prev,
            // Individual KYC fields
            firstName: merchantByEmail.signUpData?.firstName || '',
            lastName: merchantByEmail.signUpData?.lastName || '',
            email: merchantByEmail.signUpData?.email || '',
            phone: merchantByEmail.signUpData?.phone || '',
            // Business KYB fields
            legalBusinessName: merchantByEmail.signUpData?.legalBusinessName || merchantByEmail.signUpData?.businessName || '',
            businessStructure: merchantByEmail.signUpData?.businessStructure || '',
            businessPhone: merchantByEmail.signUpData?.phone || '',
            customerSupportPhone: merchantByEmail.signUpData?.phone || '', // Pre-filled with business phone
            businessAddress: {
              street: merchantByEmail.signUpData?.businessAddress?.street || '',
              city: merchantByEmail.signUpData?.businessAddress?.city || '',
              state: merchantByEmail.signUpData?.businessAddress?.state || '',
              zipCode: merchantByEmail.signUpData?.businessAddress?.zipCode || '',
            },
            businessWebsite: prequalData.businessWebsite || '',
            businessCategory: merchantByEmail.signUpData?.businessCategory || prequalData.businessCategory || '',
            // Bank Account - pre-fill holder name from business
            bankAccountHolderName: merchantByEmail.signUpData?.legalBusinessName || merchantByEmail.signUpData?.businessName || '',
          }));
        } else if (prequalData) {
          // Fallback to prequalification data
          setFormData(prev => ({
            ...prev,
            // Individual KYC fields from prequalification data
            firstName: prequalData.firstName || '',
            lastName: prequalData.lastName || '',
            email: prequalData.email || '',
            phone: prequalData.phone || '',
            // Business KYB fields
            legalBusinessName: prequalData.businessName || '',
            businessPhone: prequalData.phone || '',
            customerSupportPhone: prequalData.phone || '',
            businessAddress: {
              street: prequalData.businessAddress?.street || '',
              city: prequalData.businessAddress?.city || '',
              state: prequalData.businessAddress?.state || '',
              zipCode: prequalData.businessAddress?.zipCode || '',
            },
            businessWebsite: prequalData.businessWebsite || '',
            businessCategory: prequalData.businessCategory || '',
          }));
        }
      } else {
        // Try to get the most recent merchant
        const merchants = await MerchantStorage.getAllMerchants();
        if (merchants.length > 0) {
          const latestMerchant = merchants[merchants.length - 1];
          if (latestMerchant.signUpData) {
            setFormData(prev => ({
              ...prev,
              firstName: latestMerchant.signUpData?.firstName || '',
              lastName: latestMerchant.signUpData?.lastName || '',
              email: latestMerchant.signUpData?.email || '',
              phone: latestMerchant.signUpData?.phone || '',
            }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof VerificationFormData] as Record<string, unknown>), [child]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: StepNumber): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 1: Personal Information
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) newErrors.dateOfBirth = 'You must be 18 or older';
      }
    }

    // Step 2: Home Address & SSN
    if (step === 2) {
      if (!formData.homeAddress.street.trim()) newErrors['homeAddress.street'] = 'Street address is required';
      if (!formData.homeAddress.city.trim()) newErrors['homeAddress.city'] = 'City is required';
      if (!formData.homeAddress.state) newErrors['homeAddress.state'] = 'State is required';
      if (!formData.homeAddress.zipCode.trim()) {
        newErrors['homeAddress.zipCode'] = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(formData.homeAddress.zipCode)) {
        newErrors['homeAddress.zipCode'] = 'Invalid ZIP code';
      }
      if (!formData.ssnLast4.trim()) {
        newErrors.ssnLast4 = 'SSN last 4 digits required';
      } else if (!/^\d{4}$/.test(formData.ssnLast4)) {
        newErrors.ssnLast4 = 'Must be 4 digits';
      }
    }

    // Step 3: Role in Business
    if (step === 3) {
      if (!formData.title) newErrors.title = 'Role is required';
      if ((formData.title === 'owner' || formData.title === 'partner') && !formData.ownershipPercentage) {
        newErrors.ownershipPercentage = 'Ownership percentage is required';
      }
    }

    // Step 4: Individual ToS
    if (step === 4) {
      if (!formData.tosAccepted) newErrors.tosAccepted = 'You must accept the terms';
    }

    // Step 5: Business Entity Information (KYB)
    if (step === 5) {
      if (!formData.legalBusinessName.trim()) newErrors.legalBusinessName = 'Legal business name is required';
      if (!formData.businessStructure) newErrors.businessStructure = 'Business structure is required';

      // EIN validation (not required for sole proprietor)
      if (formData.businessStructure !== 'sole-proprietor') {
        if (!formData.ein.trim()) {
          newErrors.ein = 'EIN is required';
        } else if (!/^\d{9}$/.test(formData.ein.replace(/-/g, ''))) {
          newErrors.ein = 'EIN must be 9 digits';
        }
      }

      if (!formData.businessPhone.trim()) newErrors.businessPhone = 'Business phone is required';
      if (!formData.customerSupportPhone.trim()) newErrors.customerSupportPhone = 'Customer support phone is required';

      if (!formData.businessAddress.street.trim()) newErrors['businessAddress.street'] = 'Business address is required';
      if (!formData.businessAddress.city.trim()) newErrors['businessAddress.city'] = 'City is required';
      if (!formData.businessAddress.state) newErrors['businessAddress.state'] = 'State is required';
      if (!formData.businessAddress.zipCode.trim()) {
        newErrors['businessAddress.zipCode'] = 'ZIP code is required';
      } else if (!/^\d{5}$/.test(formData.businessAddress.zipCode)) {
        newErrors['businessAddress.zipCode'] = 'Invalid ZIP code';
      }

      // Website OR Product Description required
      if (!formData.businessWebsite.trim() && !formData.productDescription.trim()) {
        newErrors.productDescription = 'Either website or product description is required';
      }

      if (!formData.businessCategory) newErrors.businessCategory = 'Business category is required';
    }

    // Step 6: Beneficial Owners (conditional)
    if (step === 6) {
      const needsOwners = ['llc', 'corporation', 'partnership'].includes(formData.businessStructure);

      if (needsOwners && formData.hasOtherOwners && formData.beneficialOwners.length === 0) {
        newErrors.beneficialOwners = 'Please add at least one beneficial owner or select "No"';
      }
    }

    // Step 7: Final Review (no additional validation needed)

    // Step 8: Bank Account (optional - validation only if not skipped)
    if (step === 8 && !formData.skipBankAccount) {
      if (!formData.bankAccountHolderName.trim()) newErrors.bankAccountHolderName = 'Account holder name is required';
      if (!formData.accountType) newErrors.accountType = 'Account type is required';

      if (!formData.routingNumber.trim()) {
        newErrors.routingNumber = 'Routing number is required';
      } else if (!/^\d{9}$/.test(formData.routingNumber)) {
        newErrors.routingNumber = 'Routing number must be 9 digits';
      }

      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      } else if (!/^\d{4,17}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = 'Account number must be 4-17 digits';
      }

      if (!formData.confirmAccountNumber.trim()) {
        newErrors.confirmAccountNumber = 'Please confirm account number';
      } else if (formData.accountNumber !== formData.confirmAccountNumber) {
        newErrors.confirmAccountNumber = 'Account numbers must match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Skip beneficial owners step if not needed
      if (currentStep === 5) {
        const needsOwners = ['llc', 'corporation', 'partnership'].includes(formData.businessStructure);
        if (!needsOwners) {
          setCurrentStep(7); // Skip directly to final review
          return;
        }
      }

      if (currentStep < 8) {
        setCurrentStep((prev) => (prev + 1) as StepNumber);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Skip beneficial owners step going back if not needed
      if (currentStep === 7) {
        const needsOwners = ['llc', 'corporation', 'partnership'].includes(formData.businessStructure);
        if (!needsOwners) {
          setCurrentStep(5); // Go back to business entity
          return;
        }
      }
      setCurrentStep((prev) => (prev - 1) as StepNumber);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async () => {
    if (validateStep(8)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (typeof window !== 'undefined') {
        localStorage.setItem('verificationData', JSON.stringify(formData));
      }
      router.push('/dashboard');
    }
  };

  const isOwnerRole = formData.title === 'owner' || formData.title === 'partner';
  const needsBeneficialOwners = ['llc', 'corporation', 'partnership'].includes(formData.businessStructure);
  const isSoleProprietor = formData.businessStructure === 'sole-proprietor';

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Address & SSN' },
    { number: 3, title: 'Your Role' },
    { number: 4, title: 'Review KYC' },
    { number: 5, title: 'Business Info' },
    { number: 6, title: 'Co-Owners' },
    { number: 7, title: 'Final Review' },
    { number: 8, title: 'Bank Account (Optional)' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/lightspeed-logo-dark.svg"
              alt="Lightspeed"
              className="h-5"
            />
          </div>

          {/* Exit Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-900 text-sm hover:text-gray-600 transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-14 left-0 right-0 h-1 bg-gray-100 z-40">
        <motion.div
          className="absolute top-0 left-0 h-full bg-red-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12 pt-20">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Let&apos;s start with your basic information</h2>
                <p className="text-gray-600">We need to verify your identity to comply with federal regulations</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={cn(errors.firstName && 'border-red-500')} />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={cn(errors.lastName && 'border-red-500')} />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={cn(errors.email && 'border-red-500')} />
                  <p className="text-xs text-gray-500">Pre-filled from signup - you can edit if needed</p>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Your Personal Phone *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(555) 123-4567" className={cn(errors.phone && 'border-red-500')} />
                  <p className="text-xs text-gray-500">Your personal contact number for verification issues (pre-filled with business phone for convenience)</p>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={cn(errors.dateOfBirth && 'border-red-500')} />
                  <p className="text-xs text-gray-500">You must be 18 or older</p>
                  {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your home address</h2>
                <p className="text-gray-600">We use this to verify your identity through credit bureaus</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input id="street" value={formData.homeAddress.street} onChange={(e) => updateField('homeAddress.street', e.target.value)} placeholder="123 Main Street" className={cn(errors['homeAddress.street'] && 'border-red-500')} />
                  {errors['homeAddress.street'] && <p className="text-sm text-red-600">{errors['homeAddress.street']}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={formData.homeAddress.city} onChange={(e) => updateField('homeAddress.city', e.target.value)} className={cn(errors['homeAddress.city'] && 'border-red-500')} />
                    {errors['homeAddress.city'] && <p className="text-sm text-red-600">{errors['homeAddress.city']}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.homeAddress.state} onValueChange={(value) => updateField('homeAddress.state', value)}>
                      <SelectTrigger className={cn(errors['homeAddress.state'] && 'border-red-500')}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors['homeAddress.state'] && <p className="text-sm text-red-600">{errors['homeAddress.state']}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input id="zipCode" value={formData.homeAddress.zipCode} onChange={(e) => updateField('homeAddress.zipCode', e.target.value)} placeholder="12345" maxLength={5} className={cn(errors['homeAddress.zipCode'] && 'border-red-500')} />
                  {errors['homeAddress.zipCode'] && <p className="text-sm text-red-600">{errors['homeAddress.zipCode']}</p>}
                </div>
                <div className="pt-6 border-t space-y-2">
                  <Label htmlFor="ssnLast4">Last 4 Digits of SSN *</Label>
                  <Input id="ssnLast4" type="password" value={formData.ssnLast4} onChange={(e) => updateField('ssnLast4', e.target.value)} placeholder="••••" maxLength={4} className={cn(errors.ssnLast4 && 'border-red-500')} />
                  <p className="text-xs text-gray-500">Used for identity verification. We&apos;ll only ask for your full SSN if automated verification fails.</p>
                  {errors.ssnLast4 && <p className="text-sm text-red-600">{errors.ssnLast4}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your role in the business</h2>
                <p className="text-gray-600">Help us understand your position and ownership</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Your Title/Role *</Label>
                  <Select value={formData.title} onValueChange={(value) => updateField('title', value)}>
                    <SelectTrigger className={cn(errors.title && 'border-red-500')}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>
                {isOwnerRole && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <Label htmlFor="ownershipPercentage">Ownership Percentage *</Label>
                    <Input id="ownershipPercentage" type="number" min="1" max="100" value={formData.ownershipPercentage} onChange={(e) => updateField('ownershipPercentage', e.target.value)} placeholder="50" className={cn(errors.ownershipPercentage && 'border-red-500')} />
                    <p className="text-xs text-gray-500">What percentage of the business do you own?</p>
                    {errors.ownershipPercentage && <p className="text-sm text-red-600">{errors.ownershipPercentage}</p>}
                  </motion.div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900"><strong>Why we need this:</strong> Federal regulations require us to verify the identity of business owners and executives who can authorize payments.</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review your identity information</h2>
                <p className="text-gray-600">Verify your personal details and accept our terms</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Name:</span><span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Date of Birth:</span><span className="font-medium">{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Email:</span><span className="font-medium">{formData.email}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Phone:</span><span className="font-medium">{formData.phone}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Address:</span><span className="font-medium text-right">{formData.homeAddress.street}, {formData.homeAddress.city}, {formData.homeAddress.state} {formData.homeAddress.zipCode}</span></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Role:</span><span className="font-medium">{ROLE_OPTIONS.find(r => r.value === formData.title)?.label}</span></div>
                  {isOwnerRole && formData.ownershipPercentage && (
                    <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Ownership:</span><span className="font-medium">{formData.ownershipPercentage}%</span></div>
                  )}
                </div>
                <div className="pt-6 border-t space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="tosAccepted" checked={formData.tosAccepted} onCheckedChange={(checked) => updateField('tosAccepted', checked === true)} className="mt-1" />
                    <label htmlFor="tosAccepted" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      I agree to Stripe&apos;s <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Connected Account Agreement</a> and authorize Lightspeed to share my information with Stripe for payment processing.
                    </label>
                  </div>
                  {errors.tosAccepted && <p className="text-sm text-red-600">{errors.tosAccepted}</p>}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900"><strong>Next up:</strong> We&apos;ll need your business entity information to complete verification.</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Beneficial owners</h2>
                <p className="text-gray-600">Federal law requires us to verify anyone who owns 25% or more of your business</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Does anyone else own 25% or more of this business?</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input type="radio" id="hasOwnersNo" name="hasOtherOwners" checked={!formData.hasOtherOwners} onChange={() => updateField('hasOtherOwners', false)} className="w-4 h-4 text-red-600" />
                      <label htmlFor="hasOwnersNo" className="text-sm cursor-pointer">No, I&apos;m the sole owner (skip this step)</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="radio" id="hasOwnersYes" name="hasOtherOwners" checked={formData.hasOtherOwners} onChange={() => updateField('hasOtherOwners', true)} className="w-4 h-4 text-red-600" />
                      <label htmlFor="hasOwnersYes" className="text-sm cursor-pointer">Yes, I need to add co-owners</label>
                    </div>
                  </div>
                </div>

                {formData.hasOtherOwners && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t">
                    {formData.beneficialOwners.map((owner, index) => (
                      <div key={owner.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Co-Owner #{index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOwners = formData.beneficialOwners.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input
                              value={owner.firstName}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].firstName = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input
                              value={owner.lastName}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].lastName = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth *</Label>
                          <Input
                            type="date"
                            value={owner.dateOfBirth}
                            onChange={(e) => {
                              const newOwners = [...formData.beneficialOwners];
                              newOwners[index].dateOfBirth = e.target.value;
                              setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Street Address *</Label>
                          <Input
                            value={owner.address.street}
                            onChange={(e) => {
                              const newOwners = [...formData.beneficialOwners];
                              newOwners[index].address.street = e.target.value;
                              setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>City *</Label>
                            <Input
                              value={owner.address.city}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].address.city = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State *</Label>
                            <Select
                              value={owner.address.state}
                              onValueChange={(value) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].address.state = value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                            >
                              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                              <SelectContent>
                                {US_STATES.map((state) => <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>ZIP *</Label>
                            <Input
                              value={owner.address.zipCode}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].address.zipCode = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                              maxLength={5}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>SSN Last 4 *</Label>
                            <Input
                              type="password"
                              value={owner.ssnLast4}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].ssnLast4 = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                              maxLength={4}
                              placeholder="••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Ownership % *</Label>
                            <Input
                              type="number"
                              min="25"
                              max="100"
                              value={owner.ownershipPercentage}
                              onChange={(e) => {
                                const newOwners = [...formData.beneficialOwners];
                                newOwners[index].ownershipPercentage = e.target.value;
                                setFormData(prev => ({ ...prev, beneficialOwners: newOwners }));
                              }}
                              placeholder="50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newOwner: BeneficialOwner = {
                          id: `owner-${Date.now()}`,
                          firstName: '',
                          lastName: '',
                          dateOfBirth: '',
                          address: { street: '', city: '', state: '', zipCode: '' },
                          ssnLast4: '',
                          ownershipPercentage: '',
                        };
                        setFormData(prev => ({ ...prev, beneficialOwners: [...prev.beneficialOwners, newOwner] }));
                      }}
                      className="w-full"
                    >
                      Add Another Co-Owner
                    </Button>

                    {errors.beneficialOwners && <p className="text-sm text-red-600">{errors.beneficialOwners}</p>}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Example scenarios:</strong>
                        <br />• 50/50 Partnership: Add 1 co-owner at 50%
                        <br />• Three Equal Partners: Add 2 co-owners at 33% each
                        <br />• Majority Owner: Only list if someone else owns 25%+
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Final review</h2>
                <p className="text-gray-600">Review all your information before submitting</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* Individual KYC Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Your Identity</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                    <div><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                    <div className="col-span-2"><span className="text-gray-600">Address:</span> <span className="font-medium">{formData.homeAddress.street}, {formData.homeAddress.city}, {formData.homeAddress.state} {formData.homeAddress.zipCode}</span></div>
                    <div><span className="text-gray-600">Role:</span> <span className="font-medium">{ROLE_OPTIONS.find(r => r.value === formData.title)?.label}</span></div>
                    {isOwnerRole && formData.ownershipPercentage && (
                      <div><span className="text-gray-600">Ownership:</span> <span className="font-medium">{formData.ownershipPercentage}%</span></div>
                    )}
                  </div>
                </div>

                {/* Business Entity Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Business Entity</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-600">Legal Name:</span> <span className="font-medium">{formData.legalBusinessName}</span></div>
                    <div><span className="text-gray-600">Structure:</span> <span className="font-medium">{BUSINESS_STRUCTURES.find(s => s.value === formData.businessStructure)?.label}</span></div>
                    {!isSoleProprietor && (
                      <div><span className="text-gray-600">EIN:</span> <span className="font-medium">{formData.ein}</span></div>
                    )}
                    <div><span className="text-gray-600">Business Phone:</span> <span className="font-medium">{formData.businessPhone}</span></div>
                    <div className="col-span-2"><span className="text-gray-600">Address:</span> <span className="font-medium">{formData.businessAddress.street}, {formData.businessAddress.city}, {formData.businessAddress.state} {formData.businessAddress.zipCode}</span></div>
                    {formData.businessWebsite && (
                      <div className="col-span-2"><span className="text-gray-600">Website:</span> <span className="font-medium">{formData.businessWebsite}</span></div>
                    )}
                    <div className="col-span-2"><span className="text-gray-600">Category:</span> <span className="font-medium">{BUSINESS_CATEGORIES.find(c => c.value === formData.businessCategory)?.label}</span></div>
                  </div>
                </div>

                {/* Beneficial Owners Summary */}
                {formData.hasOtherOwners && formData.beneficialOwners.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Beneficial Owners</h3>
                    {formData.beneficialOwners.map((owner, index) => (
                      <div key={owner.id} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Co-Owner #{index + 1}</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-gray-600">Name:</span> <span className="font-medium">{owner.firstName} {owner.lastName}</span></div>
                          <div><span className="text-gray-600">Ownership:</span> <span className="font-medium">{owner.ownershipPercentage}%</span></div>
                          <div className="col-span-2"><span className="text-gray-600">Address:</span> <span className="font-medium">{owner.address.street}, {owner.address.city}, {owner.address.state} {owner.address.zipCode}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-green-900">
                    <strong>What happens next?</strong> We&apos;ll verify your information in the background using Trulioo. This typically takes 1-2 business days. You&apos;ll receive an email when your account is approved and payment processing is activated.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Business entity information</h2>
                <p className="text-gray-600">Provide your official business details as they appear on tax documents</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900 text-lg">Business Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                    <Input id="legalBusinessName" value={formData.legalBusinessName} onChange={(e) => updateField('legalBusinessName', e.target.value)} className={cn(errors.legalBusinessName && 'border-red-500')} />
                    <p className="text-xs text-gray-500">Pre-filled from signup - verify this matches your tax documents</p>
                    {errors.legalBusinessName && <p className="text-sm text-red-600">{errors.legalBusinessName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessStructure">Business Structure *</Label>
                    <Select value={formData.businessStructure} onValueChange={(value) => updateField('businessStructure', value)}>
                      <SelectTrigger className={cn(errors.businessStructure && 'border-red-500')}>
                        <SelectValue placeholder="Select business structure" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_STRUCTURES.map((structure) => <SelectItem key={structure.value} value={structure.value}>{structure.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.businessStructure && <p className="text-sm text-red-600">{errors.businessStructure}</p>}
                  </div>

                  {isSoleProprietor && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900"><strong>Sole Proprietor:</strong> You&apos;ll use your SSN instead of EIN. Skip the EIN field below.</p>
                    </div>
                  )}

                  {!isSoleProprietor && (
                    <div className="space-y-2">
                      <Label htmlFor="ein">Employer Identification Number (EIN) *</Label>
                      <Input id="ein" value={formData.ein} onChange={(e) => updateField('ein', e.target.value)} placeholder="12-3456789" maxLength={10} className={cn(errors.ein && 'border-red-500')} />
                      <p className="text-xs text-gray-500">9 digits - format: XX-XXXXXXX</p>
                      {errors.ein && <p className="text-sm text-red-600">{errors.ein}</p>}
                    </div>
                  )}

                  {needsBeneficialOwners && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900"><strong>Note:</strong> Next step you&apos;ll need to add co-owners with 25%+ ownership</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone *</Label>
                      <Input id="businessPhone" type="tel" value={formData.businessPhone} onChange={(e) => updateField('businessPhone', e.target.value)} className={cn(errors.businessPhone && 'border-red-500')} />
                      {errors.businessPhone && <p className="text-sm text-red-600">{errors.businessPhone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerSupportPhone">Customer Support Phone *</Label>
                      <Input id="customerSupportPhone" type="tel" value={formData.customerSupportPhone} onChange={(e) => updateField('customerSupportPhone', e.target.value)} className={cn(errors.customerSupportPhone && 'border-red-500')} />
                      <p className="text-xs text-gray-500">For customer inquiries and disputes</p>
                      {errors.customerSupportPhone && <p className="text-sm text-red-600">{errors.customerSupportPhone}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 text-lg">Business Location</h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessStreet">Street Address *</Label>
                    <Input id="businessStreet" value={formData.businessAddress.street} onChange={(e) => updateField('businessAddress.street', e.target.value)} className={cn(errors['businessAddress.street'] && 'border-red-500')} />
                    {errors['businessAddress.street'] && <p className="text-sm text-red-600">{errors['businessAddress.street']}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessCity">City *</Label>
                      <Input id="businessCity" value={formData.businessAddress.city} onChange={(e) => updateField('businessAddress.city', e.target.value)} className={cn(errors['businessAddress.city'] && 'border-red-500')} />
                      {errors['businessAddress.city'] && <p className="text-sm text-red-600">{errors['businessAddress.city']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessState">State *</Label>
                      <Select value={formData.businessAddress.state} onValueChange={(value) => updateField('businessAddress.state', value)}>
                        <SelectTrigger className={cn(errors['businessAddress.state'] && 'border-red-500')}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors['businessAddress.state'] && <p className="text-sm text-red-600">{errors['businessAddress.state']}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessZipCode">ZIP Code *</Label>
                    <Input id="businessZipCode" value={formData.businessAddress.zipCode} onChange={(e) => updateField('businessAddress.zipCode', e.target.value)} placeholder="12345" maxLength={5} className={cn(errors['businessAddress.zipCode'] && 'border-red-500')} />
                    {errors['businessAddress.zipCode'] && <p className="text-sm text-red-600">{errors['businessAddress.zipCode']}</p>}
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 text-lg">Business Description</h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Business Website</Label>
                    <Input id="businessWebsite" type="url" value={formData.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} placeholder="https://example.com" className={cn(errors.businessWebsite && 'border-red-500')} />
                    <p className="text-xs text-gray-500">Enter &quot;None&quot; if you don&apos;t have a website</p>
                    {errors.businessWebsite && <p className="text-sm text-red-600">{errors.businessWebsite}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Product Description {!formData.businessWebsite.trim() && '*'}</Label>
                    <Textarea id="productDescription" value={formData.productDescription} onChange={(e) => updateField('productDescription', e.target.value)} placeholder="Describe what you sell or the services you provide..." rows={4} className={cn(errors.productDescription && 'border-red-500')} />
                    <p className="text-xs text-gray-500">Required if no website provided. Minimum 10 characters.</p>
                    {errors.productDescription && <p className="text-sm text-red-600">{errors.productDescription}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <Select value={formData.businessCategory} onValueChange={(value) => updateField('businessCategory', value)}>
                      <SelectTrigger className={cn(errors.businessCategory && 'border-red-500')}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map((category) => <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.businessCategory && <p className="text-sm text-red-600">{errors.businessCategory}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect your bank account (Optional)</h2>
                <p className="text-gray-600">You're almost done! Connect your bank account to receive automatic payouts from your sales.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Optional step:</strong> You can skip this step and add it later. You'll still be able to accept payments - funds will accumulate in your Stripe balance until you add a bank account.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Would you like to add your bank account now?</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input type="radio" id="addBankNo" name="skipBankAccount" checked={formData.skipBankAccount} onChange={() => updateField('skipBankAccount', true)} className="w-4 h-4 text-red-600" />
                      <label htmlFor="addBankNo" className="text-sm cursor-pointer">I'll add this later (skip)</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="radio" id="addBankYes" name="skipBankAccount" checked={!formData.skipBankAccount} onChange={() => updateField('skipBankAccount', false)} className="w-4 h-4 text-red-600" />
                      <label htmlFor="addBankYes" className="text-sm cursor-pointer">Yes, add my bank account now</label>
                    </div>
                  </div>
                </div>

                {!formData.skipBankAccount && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountHolderName">Account Holder Name *</Label>
                      <Input id="bankAccountHolderName" value={formData.bankAccountHolderName} onChange={(e) => updateField('bankAccountHolderName', e.target.value)} placeholder="Business Legal Name" className={cn(errors.bankAccountHolderName && 'border-red-500')} />
                      <p className="text-xs text-gray-500">Must match the name on your bank account (pre-filled with business name)</p>
                      {errors.bankAccountHolderName && <p className="text-sm text-red-600">{errors.bankAccountHolderName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" value={formData.bankName} onChange={(e) => updateField('bankName', e.target.value)} placeholder="e.g., Chase, Bank of America" />
                      <p className="text-xs text-gray-500">Optional - for your reference</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type *</Label>
                      <Select value={formData.accountType} onValueChange={(value) => updateField('accountType', value)}>
                        <SelectTrigger className={cn(errors.accountType && 'border-red-500')}>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.accountType && <p className="text-sm text-red-600">{errors.accountType}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number *</Label>
                      <Input id="routingNumber" value={formData.routingNumber} onChange={(e) => updateField('routingNumber', e.target.value)} placeholder="9 digits" maxLength={9} className={cn(errors.routingNumber && 'border-red-500')} />
                      <p className="text-xs text-gray-500">9-digit number that identifies your bank</p>
                      {errors.routingNumber && <p className="text-sm text-red-600">{errors.routingNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input id="accountNumber" type="password" value={formData.accountNumber} onChange={(e) => updateField('accountNumber', e.target.value)} placeholder="Account number" maxLength={17} className={cn(errors.accountNumber && 'border-red-500')} />
                      <p className="text-xs text-gray-500">4-17 digits - will be encrypted</p>
                      {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmAccountNumber">Confirm Account Number *</Label>
                      <Input id="confirmAccountNumber" type="password" value={formData.confirmAccountNumber} onChange={(e) => updateField('confirmAccountNumber', e.target.value)} placeholder="Re-enter account number" maxLength={17} className={cn(errors.confirmAccountNumber && 'border-red-500')} />
                      {errors.confirmAccountNumber && <p className="text-sm text-red-600">{errors.confirmAccountNumber}</p>}
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Bank-level encryption</p>
                          <p className="text-xs text-gray-600">Your banking information is encrypted and securely stored using bank-level 256-bit SSL encryption. We use Stripe, a certified PCI Level 1 Service Provider trusted by millions of businesses worldwide.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900">
                        <strong>Micro-deposit verification:</strong> Stripe will send 2 small deposits ($0.01-$0.99) to your account within 1-2 business days. You'll need to confirm the amounts to enable payouts.
                      </p>
                    </div>
                  </motion.div>
                )}

                {formData.skipBankAccount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>No problem!</strong> You can add your bank account later from your dashboard. You'll still be able to accept payments - funds will accumulate safely in your Stripe balance.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Back to Dashboard' : 'Previous'}
          </Button>
          {currentStep < 8 ? (
            <Button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
