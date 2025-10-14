'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface AccountFormData {
  businessName: string;
  email: string;
  password: string;
}

interface AccountFormProps {
  onNext: (data: AccountFormData) => void;
  initialData?: Partial<AccountFormData>;
}

export function AccountForm({ onNext, initialData }: AccountFormProps) {
  const [formData, setFormData] = useState<AccountFormData>({
    businessName: initialData?.businessName || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (field: keyof AccountFormData, value: string) => {
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

  const handleBlur = (field: keyof AccountFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof AccountFormData) => {
    const newErrors: Record<string, string> = { ...errors };

    switch (field) {
      case 'businessName':
        if (!formData.businessName.trim()) {
          newErrors.businessName = 'Business name is required';
        } else {
          delete newErrors.businessName;
        }
        break;
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms to continue';
    }

    setErrors(newErrors);
    setTouched({
      businessName: true,
      email: true,
      password: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAll()) {
      onNext(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Let's create your account
        </h1>
        <p className="text-base text-gray-600">
          Signing up for Lightspeed is fast and free—no commitments or long-term contracts.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
            Business Name
          </Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            onBlur={() => handleBlur('businessName')}
            className={cn(
              'h-11 text-base border-gray-300 rounded-md',
              touched.businessName && errors.businessName && 'border-red-500 focus-visible:ring-red-500'
            )}
            placeholder="e.g., Riverside Coffee Co."
            autoFocus
          />
          {touched.businessName && errors.businessName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {errors.businessName}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={cn(
              'h-11 text-base border-gray-300 rounded-md',
              touched.email && errors.email && 'border-red-500 focus-visible:ring-red-500'
            )}
            placeholder="you@yourbusiness.com"
          />
          {touched.email && errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={cn(
                'h-11 text-base border-gray-300 rounded-md pr-10',
                touched.password && errors.password && 'border-red-500 focus-visible:ring-red-500'
              )}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2.5 pt-1">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-snug cursor-pointer">
            I agree to Lightspeed's{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Terms
            </Link>
            ,{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              E-Sign Consent
            </Link>
            .
          </label>
        </div>
        {errors.terms && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600"
          >
            {errors.terms}
          </motion.p>
        )}

        {/* Submit Button */}
        <div className="pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base h-11 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
          >
            Create account
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-sm text-center text-gray-600 pt-1">
          Already have a Lightspeed account?{' '}
          <Link href="/onboarding" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in.
          </Link>
        </p>
      </form>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-4 h-4 text-gray-400 mb-1.5" />
            <p className="text-xs text-gray-600">Secure & Encrypted</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-gray-400 mb-1.5" />
            <p className="text-xs text-gray-600">Setup in Minutes</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-gray-400 mb-1.5" />
            <p className="text-xs text-gray-600">No Long-term Contract</p>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-xs text-center text-gray-500 mt-6">
        This site is protected by reCAPTCHA Enterprise and the Google{' '}
        <Link href="#" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
        {' '}and{' '}
        <Link href="#" className="underline hover:text-gray-700">
          Terms of Service
        </Link>
        {' '}apply.
      </p>
    </motion.div>
  );
}
