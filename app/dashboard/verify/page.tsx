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
import { US_STATES } from '@/lib/merchant-mock-data';
import { MerchantStorage } from '@/lib/merchant-storage';

interface VerificationFormData {
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
}

type StepNumber = 1 | 2 | 3 | 4;

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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load merchant data and pre-fill form
  useEffect(() => {
    loadMerchantData();
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

        if (merchantByEmail?.signUpData) {
          // Pre-fill email and phone from signup data
          setFormData(prev => ({
            ...prev,
            email: merchantByEmail.signUpData?.email || '',
            phone: merchantByEmail.signUpData?.phone || '', // Pre-filled with business phone for convenience
          }));
        } else if (prequalData) {
          // Fallback to prequalification data
          setFormData(prev => ({
            ...prev,
            email: prequalData.email || '',
            phone: prequalData.phone || '',
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
    if (step === 3) {
      if (!formData.title) newErrors.title = 'Role is required';
      if ((formData.title === 'owner' || formData.title === 'partner') && !formData.ownershipPercentage) {
        newErrors.ownershipPercentage = 'Ownership percentage is required';
      }
    }
    if (step === 4) {
      if (!formData.tosAccepted) newErrors.tosAccepted = 'You must accept the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as StepNumber);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async () => {
    if (validateStep(4)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (typeof window !== 'undefined') {
        localStorage.setItem('verificationData', JSON.stringify(formData));
      }
      router.push('/dashboard');
    }
  };

  const isOwnerRole = formData.title === 'owner' || formData.title === 'partner';

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Address & SSN' },
    { number: 3, title: 'Your Role' },
    { number: 4, title: 'Review & Accept' },
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
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Identity Verification</h1>
                <p className="text-xs text-gray-500">Required to accept payments</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    currentStep > step.number ? 'bg-green-600 text-white' : currentStep === step.number ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500')}>
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <p className={cn('text-xs font-medium mt-2', currentStep >= step.number ? 'text-gray-900' : 'text-gray-500')}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && <div className={cn('flex-1 h-0.5 mx-2 transition-all', currentStep > step.number ? 'bg-green-600' : 'bg-gray-200')} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review and accept</h2>
                <p className="text-gray-600">Review your information and accept our terms to continue</p>
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900"><strong>What happens next?</strong> We&apos;ll verify your information in the background. This typically takes 1-2 business days. You&apos;ll receive an email when your account is approved.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Back to Dashboard' : 'Previous'}
          </Button>
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Submit Verification
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
