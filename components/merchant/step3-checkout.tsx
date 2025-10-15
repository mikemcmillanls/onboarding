'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckoutData } from '@/types/merchant-onboarding';
import { PricingBreakdown } from '@/types/merchant-onboarding';
import { CreditCard, Shield, Package, Loader2, CheckCircle2 } from 'lucide-react';

interface Step3CheckoutProps {
  onComplete: (data: CheckoutData) => void;
  onBack: () => void;
  pricing: PricingBreakdown;
  businessAddress: { street: string; city: string; state: string; zipCode: string };
}

export function Step3Checkout({ onComplete, onBack, pricing, businessAddress }: Step3CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<CheckoutData>>({
    paymentMethod: { cardNumber: '', expirationDate: '', cvv: '' },
    billingAddress: { ...businessAddress },
    shippingAddresses: [{ locationName: 'Main Location', ...businessAddress }],
    identityVerification: {
      businessRepresentative: {
        fullName: '',
        dateOfBirth: '',
        ssnLast4: '',
        homeAddress: { street: '', city: '', state: '', zipCode: '' },
        role: '',
      },
      businessOwners: [],
    },
  });

  const updateField = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof CheckoutData],
        [field]: value,
      },
    }));
  };

  const updateNestedField = (section: string, subsection: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof CheckoutData],
        [subsection]: {
          ...(prev[section as keyof CheckoutData] as Record<string, unknown>)?.[subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.paymentMethod?.cardNumber || !formData.identityVerification?.businessRepresentative.fullName) {
      setErrors({ general: 'Please fill in all required fields' });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing and KYC submission
    await new Promise(resolve => setTimeout(resolve, 3000));

    setOrderPlaced(true);

    // Wait for success animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    onComplete(formData as CheckoutData);
  };

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-20 h-20 mx-auto text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold">Order Confirmed!</h2>
              <p className="text-muted-foreground">
                Your order number is <strong>#LS-{Date.now().toString().slice(-6)}</strong>
              </p>

              <div className="bg-muted rounded-lg p-6 text-left space-y-3 mt-6">
                <h3 className="font-semibold mb-3">What happens next:</h3>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Software account activated</p>
                    <p className="text-sm text-muted-foreground">Login details sent to your email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Hardware shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Tracking info will be sent within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Payment processing activating</p>
                    <p className="text-sm text-muted-foreground">Ready in 24-48 hours</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Proceeding to setup tasks...
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-600" />
              <h3 className="text-xl font-semibold">Processing Your Order...</h3>
              <p className="text-muted-foreground">Please don&apos;t close this window</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={formData.paymentMethod?.cardNumber}
                  onChange={(e) => updateField('paymentMethod', 'cardNumber', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration Date *</Label>
                  <Input
                    id="expiration"
                    placeholder="MM/YY"
                    value={formData.paymentMethod?.expirationDate}
                    onChange={(e) => updateField('paymentMethod', 'expirationDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.paymentMethod?.cvv}
                    onChange={(e) => updateField('paymentMethod', 'cvv', e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="font-medium">Billing Address</h3>
              <div className="text-sm text-muted-foreground">
                {formData.billingAddress?.street}, {formData.billingAddress?.city},{' '}
                {formData.billingAddress?.state} {formData.billingAddress?.zipCode}
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Required for payment processing security and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Business Representative</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repName">Full Name *</Label>
                    <Input
                      id="repName"
                      value={formData.identityVerification?.businessRepresentative.fullName}
                      onChange={(e) =>
                        updateNestedField('identityVerification', 'businessRepresentative', 'fullName', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repRole">Role/Title *</Label>
                    <Input
                      id="repRole"
                      placeholder="e.g., Owner, CEO"
                      value={formData.identityVerification?.businessRepresentative.role}
                      onChange={(e) =>
                        updateNestedField('identityVerification', 'businessRepresentative', 'role', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repDOB">Date of Birth *</Label>
                    <Input
                      id="repDOB"
                      type="date"
                      value={formData.identityVerification?.businessRepresentative.dateOfBirth}
                      onChange={(e) =>
                        updateNestedField('identityVerification', 'businessRepresentative', 'dateOfBirth', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repSSN">Last 4 of SSN *</Label>
                    <Input
                      id="repSSN"
                      placeholder="1234"
                      maxLength={4}
                      value={formData.identityVerification?.businessRepresentative.ssnLast4}
                      onChange={(e) =>
                        updateNestedField('identityVerification', 'businessRepresentative', 'ssnLast4', e.target.value)
                      }
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  This information is encrypted and used only for identity verification as required by
                  payment processing regulations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Software</span>
                    <span className="font-medium">
                      ${pricing.softwareMonthly.toLocaleString()}/mo
                    </span>
                  </div>

                  {pricing.hardwareOneTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hardware</span>
                      <span className="font-medium">
                        ${pricing.hardwareOneTime.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {pricing.implementationPackage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Implementation</span>
                      <span className="font-medium">
                        ${pricing.implementationPackage.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-base font-bold">
                    <span>Due Today</span>
                    <span>${pricing.total.dueToday.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Then</span>
                    <span className="font-medium">
                      ${pricing.total.monthly.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={handleSubmit} className="w-full" size="lg">
                    Complete Purchase
                  </Button>
                  <Button onClick={onBack} variant="outline" className="w-full">
                    Back
                  </Button>
                </div>

                {errors.general && (
                  <p className="text-sm text-red-500 text-center">{errors.general}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
