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
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUSINESS_CATEGORIES, REVENUE_RANGES } from '@/lib/merchant-mock-data';
import { MockAddressAutocomplete } from './mock-address-autocomplete';

export interface BusinessFormData {
  businessCategory: string;
  businessWebsite: string;
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

  // Separate state for the address input display
  const [addressInputValue, setAddressInputValue] = useState('');

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

    if (!formData.businessWebsite.trim()) {
      newErrors.businessWebsite = 'Business website is required';
    } else {
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
      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Information
        </h1>
        <p className="text-base text-gray-600">
          Tell us about your business to help us tailor your experience
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Category */}
        <div className="space-y-1.5">
          <Label htmlFor="businessCategory" className="text-sm font-medium text-gray-700">
            Business Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.businessCategory}
            onValueChange={(value) => updateField('businessCategory', value)}
          >
            <SelectTrigger
              className={cn(
                'h-11 text-base border-gray-300 rounded-md',
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
              className="text-sm text-red-600"
            >
              {errors.businessCategory}
            </motion.p>
          )}
        </div>

        {/* Business Website */}
        <div className="space-y-1.5">
          <Label htmlFor="businessWebsite" className="text-sm font-medium text-gray-700">
            Business Website <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessWebsite"
            type="url"
            value={formData.businessWebsite}
            onChange={(e) => updateField('businessWebsite', e.target.value)}
            onBlur={() => handleBlur('businessWebsite')}
            className={cn(
              'h-11 text-base border-gray-300 rounded-md',
              touched.businessWebsite && errors.businessWebsite && 'border-red-500 focus-visible:ring-red-500'
            )}
            placeholder="https://yourbusiness.com"
          />
          <p className="text-xs text-gray-500">
            We&apos;ll use this to verify your business information
          </p>
          {touched.businessWebsite && errors.businessWebsite && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {errors.businessWebsite}
            </motion.p>
          )}
        </div>

        {/* Business Address - Single Field */}
        <div className="space-y-1.5">
          <Label htmlFor="businessAddress" className="text-sm font-medium text-gray-700">
            Business Address <span className="text-red-500">*</span>
          </Label>
          <MockAddressAutocomplete
            value={addressInputValue}
            onChange={(value) => {
              // Update the display value as user types
              setAddressInputValue(value);
              // Also update the street field for validation
              updateField('businessAddress.street', value);
            }}
            onBlur={() => {
              handleBlur('businessAddress.street');
              handleBlur('businessAddress.city');
              handleBlur('businessAddress.state');
              handleBlur('businessAddress.zipCode');
            }}
            onAddressSelect={(address) => {
              // Auto-fill all address fields from selection
              setFormData(prev => ({
                ...prev,
                businessAddress: {
                  street: address.street,
                  city: address.city,
                  state: address.state,
                  zipCode: address.zipCode,
                }
              }));
              // Update display value to show full formatted address
              setAddressInputValue(`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`);
              // Clear any errors for auto-filled fields
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors['businessAddress.street'];
                delete newErrors['businessAddress.city'];
                delete newErrors['businessAddress.state'];
                delete newErrors['businessAddress.zipCode'];
                return newErrors;
              });
            }}
            placeholder="123 Main Street, New York, NY 10001"
            className={cn(
              'h-11 text-base border-gray-300 rounded-md',
              (touched['businessAddress.street'] || touched['businessAddress.city'] || touched['businessAddress.state'] || touched['businessAddress.zipCode']) &&
              (errors['businessAddress.street'] || errors['businessAddress.city'] || errors['businessAddress.state'] || errors['businessAddress.zipCode']) &&
              'border-red-500 focus-visible:ring-red-500'
            )}
          />
          {(touched['businessAddress.street'] || touched['businessAddress.city'] || touched['businessAddress.state'] || touched['businessAddress.zipCode']) &&
            (errors['businessAddress.street'] || errors['businessAddress.city'] || errors['businessAddress.state'] || errors['businessAddress.zipCode']) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {errors['businessAddress.street'] || errors['businessAddress.city'] || errors['businessAddress.state'] || errors['businessAddress.zipCode']}
            </motion.p>
          )}
        </div>

        {/* Business Size Section */}
        <div className="pt-3 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Business Size</h3>

          {/* Annual Revenue */}
          <div className="space-y-1.5">
            <Label htmlFor="annualRevenue" className="text-sm font-medium text-gray-700">
              Annual Revenue <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.annualRevenue}
              onValueChange={(value) => updateField('annualRevenue', value)}
            >
              <SelectTrigger
                className={cn(
                  'h-11 text-base border-gray-300 rounded-md',
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
                className="text-sm text-red-600"
              >
                {errors.annualRevenue}
              </motion.p>
            )}
          </div>

          {/* Number of Locations */}
          <div className="space-y-1.5">
            <Label htmlFor="numberOfLocations" className="text-sm font-medium text-gray-700">
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
                'h-11 text-base border-gray-300 rounded-md',
                touched.numberOfLocations && errors.numberOfLocations && 'border-red-500 focus-visible:ring-red-500'
              )}
              placeholder="1"
            />
            {touched.numberOfLocations && errors.numberOfLocations && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errors.numberOfLocations}
              </motion.p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-11 px-6 text-base border-gray-300 rounded-md"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 text-base bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Dashboard'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
