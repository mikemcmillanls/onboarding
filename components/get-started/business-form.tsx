'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUSINESS_CATEGORIES, REVENUE_RANGES, US_STATES } from '@/lib/merchant-mock-data';

export interface BusinessFormData {
  businessCategory: string;
  businessWebsite: string; // For future TrueBiz verification
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  annualRevenue: string;
  numberOfLocations: number;
}

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  onBack: () => void;
  initialData?: Partial<BusinessFormData>;
}

export function BusinessForm({ onSubmit, onBack, initialData }: BusinessFormProps) {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessCategory: initialData?.businessCategory || '',
    businessWebsite: initialData?.businessWebsite || '',
    businessAddress: initialData?.businessAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    annualRevenue: initialData?.annualRevenue || '',
    numberOfLocations: initialData?.numberOfLocations || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BusinessFormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessCategory) {
      newErrors.businessCategory = 'Business category is required';
    }

    // Website URL validation (required for TrueBiz verification)
    if (!formData.businessWebsite.trim()) {
      newErrors.businessWebsite = 'Business website is required';
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.businessWebsite)) {
        newErrors.businessWebsite = 'Please enter a valid website URL';
      }
    }

    if (!formData.businessAddress.street.trim()) {
      newErrors['businessAddress.street'] = 'Street address is required';
    }

    if (!formData.businessAddress.city.trim()) {
      newErrors['businessAddress.city'] = 'City is required';
    }

    if (!formData.businessAddress.state) {
      newErrors['businessAddress.state'] = 'State is required';
    }

    if (!formData.businessAddress.zipCode.trim()) {
      newErrors['businessAddress.zipCode'] = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.businessAddress.zipCode)) {
      newErrors['businessAddress.zipCode'] = 'Please enter a valid ZIP code';
    }

    if (!formData.annualRevenue) {
      newErrors.annualRevenue = 'Annual revenue is required';
    }

    if (!formData.numberOfLocations || formData.numberOfLocations < 1) {
      newErrors.numberOfLocations = 'Number of locations is required';
    }

    setErrors(newErrors);
    setTouched({
      businessCategory: true,
      businessWebsite: true,
      'businessAddress.street': true,
      'businessAddress.city': true,
      'businessAddress.state': true,
      'businessAddress.zipCode': true,
      annualRevenue: true,
      numberOfLocations: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAll()) {
      setIsSubmitting(true);
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold">Business Information</CardTitle>
          <CardDescription className="text-base">
            Tell us about your business to help us tailor your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessCategory" className="text-base">
                  Business Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.businessCategory}
                  onValueChange={(value) => updateField('businessCategory', value)}
                >
                  <SelectTrigger
                    className={cn(
                      'h-11 text-base',
                      touched.businessCategory && errors.businessCategory && 'border-red-500 focus:ring-red-500'
                    )}
                    onBlur={() => handleBlur('businessCategory')}
                  >
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
                {touched.businessCategory && errors.businessCategory && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.businessCategory}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessWebsite" className="text-base">
                  Business Website <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessWebsite"
                  type="url"
                  value={formData.businessWebsite}
                  onChange={(e) => updateField('businessWebsite', e.target.value)}
                  onBlur={() => handleBlur('businessWebsite')}
                  className={cn(
                    'h-11 text-base',
                    touched.businessWebsite && errors.businessWebsite && 'border-red-500 focus-visible:ring-red-500'
                  )}
                  placeholder="https://yourbusiness.com"
                />
                <p className="text-sm text-muted-foreground">
                  We'll use this to verify your business information
                </p>
                {touched.businessWebsite && errors.businessWebsite && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.businessWebsite}
                  </motion.p>
                )}
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-medium mb-4 text-base">Business Address</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-base">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="street"
                      value={formData.businessAddress.street}
                      onChange={(e) => updateField('businessAddress.street', e.target.value)}
                      onBlur={() => handleBlur('businessAddress.street')}
                      className={cn(
                        'h-11 text-base',
                        touched['businessAddress.street'] && errors['businessAddress.street'] && 'border-red-500 focus-visible:ring-red-500'
                      )}
                      placeholder="123 Main Street"
                    />
                    {touched['businessAddress.street'] && errors['businessAddress.street'] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors['businessAddress.street']}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-base">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={formData.businessAddress.city}
                        onChange={(e) => updateField('businessAddress.city', e.target.value)}
                        onBlur={() => handleBlur('businessAddress.city')}
                        className={cn(
                          'h-11 text-base',
                          touched['businessAddress.city'] && errors['businessAddress.city'] && 'border-red-500 focus-visible:ring-red-500'
                        )}
                        placeholder="New York"
                      />
                      {touched['businessAddress.city'] && errors['businessAddress.city'] && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors['businessAddress.city']}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-base">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.businessAddress.state}
                        onValueChange={(value) => updateField('businessAddress.state', value)}
                      >
                        <SelectTrigger
                          className={cn(
                            'h-11 text-base',
                            touched['businessAddress.state'] && errors['businessAddress.state'] && 'border-red-500 focus:ring-red-500'
                          )}
                          onBlur={() => handleBlur('businessAddress.state')}
                        >
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
                      {touched['businessAddress.state'] && errors['businessAddress.state'] && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors['businessAddress.state']}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-base">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.businessAddress.zipCode}
                      onChange={(e) => updateField('businessAddress.zipCode', e.target.value)}
                      onBlur={() => handleBlur('businessAddress.zipCode')}
                      className={cn(
                        'h-11 text-base',
                        touched['businessAddress.zipCode'] && errors['businessAddress.zipCode'] && 'border-red-500 focus-visible:ring-red-500'
                      )}
                      placeholder="12345"
                      maxLength={10}
                    />
                    {touched['businessAddress.zipCode'] && errors['businessAddress.zipCode'] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors['businessAddress.zipCode']}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-medium mb-4 text-base">Business Size</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualRevenue" className="text-base">
                      Annual Revenue <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.annualRevenue}
                      onValueChange={(value) => updateField('annualRevenue', value)}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-11 text-base',
                          touched.annualRevenue && errors.annualRevenue && 'border-red-500 focus:ring-red-500'
                        )}
                        onBlur={() => handleBlur('annualRevenue')}
                      >
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
                    {touched.annualRevenue && errors.annualRevenue && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.annualRevenue}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfLocations" className="text-base">
                      Number of Locations <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="numberOfLocations"
                      type="number"
                      min="1"
                      value={formData.numberOfLocations}
                      onChange={(e) => updateField('numberOfLocations', parseInt(e.target.value) || 1)}
                      onBlur={() => handleBlur('numberOfLocations')}
                      className={cn(
                        'h-11 text-base',
                        touched.numberOfLocations && errors.numberOfLocations && 'border-red-500 focus-visible:ring-red-500'
                      )}
                    />
                    {touched.numberOfLocations && errors.numberOfLocations && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.numberOfLocations}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 h-12 text-base"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Setup
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
