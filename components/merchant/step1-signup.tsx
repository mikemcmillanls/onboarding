'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpFormData } from '@/types/merchant-onboarding';
import { BUSINESS_CATEGORIES, REVENUE_RANGES, BUSINESS_STRUCTURES, US_STATES } from '@/lib/merchant-mock-data';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Step1SignUpProps {
  onComplete: (data: SignUpFormData, cohort: 'self-serve' | 'assisted' | 'managed') => void;
  initialData?: Partial<SignUpFormData>;
}

type FormPage = 'account' | 'business-legal' | 'verification';

export function Step1SignUp({ onComplete, initialData }: Step1SignUpProps) {
  const [page, setPage] = useState<FormPage>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'review' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState<Partial<SignUpFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    businessCategory: '',
    revenueRange: '',
    locationCount: 1,
    legalBusinessName: '',
    businessStructure: '',
    taxId: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    ...initialData,
  });

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateAddress = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      businessAddress: {
        ...prev.businessAddress!,
        [field]: value,
      },
    }));
  };

  // Validation
  const validateAccountPage = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.businessName?.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessCategory) newErrors.businessCategory = 'Business category is required';
    if (!formData.revenueRange) newErrors.revenueRange = 'Revenue range is required';
    if (!formData.locationCount || formData.locationCount < 1) newErrors.locationCount = 'Location count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessPage = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.legalBusinessName?.trim()) newErrors.legalBusinessName = 'Legal business name is required';
    if (!formData.businessStructure) newErrors.businessStructure = 'Business structure is required';
    if (!formData.taxId?.trim()) newErrors.taxId = 'Tax ID / EIN is required';
    if (!formData.businessAddress?.street?.trim()) newErrors['businessAddress.street'] = 'Street address is required';
    if (!formData.businessAddress?.city?.trim()) newErrors['businessAddress.city'] = 'City is required';
    if (!formData.businessAddress?.state) newErrors['businessAddress.state'] = 'State is required';
    if (!formData.businessAddress?.zipCode?.trim()) newErrors['businessAddress.zipCode'] = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountPageNext = () => {
    if (validateAccountPage()) {
      setPage('business-legal');
    }
  };

  const handleBusinessPageSubmit = async () => {
    if (!validateBusinessPage()) return;

    setIsSubmitting(true);
    setPage('verification');

    // Simulate KYB verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate auto-approval for most cases
    const approved = Math.random() > 0.2; // 80% approval rate
    setVerificationStatus(approved ? 'approved' : 'review');

    if (approved) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Determine cohort based on revenue and location count
      const revenue = REVENUE_RANGES.find(r => r.value === formData.revenueRange);
      let cohort: 'self-serve' | 'assisted' | 'managed' = 'self-serve';

      if (revenue && (revenue.min >= 2000000 || formData.locationCount! >= 10)) {
        cohort = 'managed';
      } else if (revenue && (revenue.min >= 500000 || formData.locationCount! >= 3)) {
        cohort = 'assisted';
      }

      onComplete(formData as SignUpFormData, cohort);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {page === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Let&apos;s get started with some basic information about you and your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">At least 8 characters</p>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="pt-4 border-t space-y-4">
                  <h3 className="font-medium">Business Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      className={errors.businessName ? 'border-red-500' : ''}
                      placeholder="e.g., Riverside Coffee Co."
                    />
                    {errors.businessName && (
                      <p className="text-sm text-red-500">{errors.businessName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <Select
                      value={formData.businessCategory}
                      onValueChange={(value) => updateField('businessCategory', value)}
                    >
                      <SelectTrigger className={errors.businessCategory ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessCategory && (
                      <p className="text-sm text-red-500">{errors.businessCategory}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueRange">Annual Revenue *</Label>
                    <Select
                      value={formData.revenueRange}
                      onValueChange={(value) => updateField('revenueRange', value)}
                    >
                      <SelectTrigger className={errors.revenueRange ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your annual revenue" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVENUE_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.revenueRange && (
                      <p className="text-sm text-red-500">{errors.revenueRange}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationCount">Number of Locations *</Label>
                    <Input
                      id="locationCount"
                      type="number"
                      min="1"
                      value={formData.locationCount}
                      onChange={(e) => updateField('locationCount', parseInt(e.target.value) || 1)}
                      className={errors.locationCount ? 'border-red-500' : ''}
                    />
                    {errors.locationCount && (
                      <p className="text-sm text-red-500">{errors.locationCount}</p>
                    )}
                  </div>
                </div>

                <Button onClick={handleAccountPageNext} className="w-full" size="lg">
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {page === 'business-legal' && (
          <motion.div
            key="business-legal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Business Verification</CardTitle>
                <CardDescription>
                  We need this information to verify your business for payment processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                    <Input
                      id="legalBusinessName"
                      value={formData.legalBusinessName}
                      onChange={(e) => updateField('legalBusinessName', e.target.value)}
                      className={errors.legalBusinessName ? 'border-red-500' : ''}
                      placeholder="As registered with the IRS"
                    />
                    {errors.legalBusinessName && (
                      <p className="text-sm text-red-500">{errors.legalBusinessName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessStructure">Business Structure *</Label>
                    <Select
                      value={formData.businessStructure}
                      onValueChange={(value) => updateField('businessStructure', value)}
                    >
                      <SelectTrigger className={errors.businessStructure ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select business structure" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_STRUCTURES.map((structure) => (
                          <SelectItem key={structure.value} value={structure.value}>
                            {structure.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessStructure && (
                      <p className="text-sm text-red-500">{errors.businessStructure}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / EIN *</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => updateField('taxId', e.target.value)}
                      className={errors.taxId ? 'border-red-500' : ''}
                      placeholder="XX-XXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use SSN if you're a sole proprietor
                    </p>
                    {errors.taxId && (
                      <p className="text-sm text-red-500">{errors.taxId}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <h3 className="font-medium">Business Address</h3>

                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={formData.businessAddress?.street}
                        onChange={(e) => updateAddress('street', e.target.value)}
                        className={errors['businessAddress.street'] ? 'border-red-500' : ''}
                      />
                      {errors['businessAddress.street'] && (
                        <p className="text-sm text-red-500">{errors['businessAddress.street']}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.businessAddress?.city}
                          onChange={(e) => updateAddress('city', e.target.value)}
                          className={errors['businessAddress.city'] ? 'border-red-500' : ''}
                        />
                        {errors['businessAddress.city'] && (
                          <p className="text-sm text-red-500">{errors['businessAddress.city']}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.businessAddress?.state}
                          onValueChange={(value) => updateAddress('state', value)}
                        >
                          <SelectTrigger className={errors['businessAddress.state'] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors['businessAddress.state'] && (
                          <p className="text-sm text-red-500">{errors['businessAddress.state']}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.businessAddress?.zipCode}
                        onChange={(e) => updateAddress('zipCode', e.target.value)}
                        className={errors['businessAddress.zipCode'] ? 'border-red-500' : ''}
                        placeholder="12345"
                      />
                      {errors['businessAddress.zipCode'] && (
                        <p className="text-sm text-red-500">{errors['businessAddress.zipCode']}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPage('account')}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleBusinessPageSubmit}
                    className="flex-1"
                    size="lg"
                  >
                    Submit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {page === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  {!verificationStatus && (
                    <>
                      <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                      <h3 className="text-xl font-semibold">Verifying Your Business...</h3>
                      <p className="text-muted-foreground">
                        This usually takes just a moment
                      </p>
                    </>
                  )}

                  {verificationStatus === 'approved' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
                      <h3 className="text-xl font-semibold text-green-600">
                        Great! Your Business Qualifies
                      </h3>
                      <p className="text-muted-foreground">
                        for Lightspeed Payments
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Redirecting to next step...
                      </p>
                    </motion.div>
                  )}

                  {verificationStatus === 'review' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <AlertCircle className="w-16 h-16 mx-auto text-orange-600" />
                      <h3 className="text-xl font-semibold">We&apos;re Reviewing Your Information</h3>
                      <p className="text-muted-foreground">
                        This usually takes 1-2 hours. We&apos;ll email you as soon as you're approved.
                      </p>
                      <div className="mt-6">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                          Close
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
