'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { POSSetupData, HardwareSelection } from '@/types/merchant-onboarding';
import { HARDWARE_BUNDLES, calculatePricing } from '@/lib/merchant-mock-data';
import { ShoppingCart, Check, Phone, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step2POSSetupProps {
  onComplete: (data: POSSetupData) => void;
  onBack: () => void;
  cohort: 'self-serve' | 'assisted' | 'managed';
  businessCategory: string;
  assignedSpecialist?: {
    name: string;
    role: 'AE' | 'IC';
    phone: string;
  };
}

export function Step2POSSetup({
  onComplete,
  onBack,
  cohort,
  businessCategory,
  assignedSpecialist,
}: Step2POSSetupProps) {
  const [locations, setLocations] = useState(1);
  const [registersPerLocation, setRegistersPerLocation] = useState(1);
  const [needsEcommerce, setNeedsEcommerce] = useState(false);
  const [selectedBundles, setSelectedBundles] = useState<HardwareSelection[]>([]);
  const [showSpecialistCard, setShowSpecialistCard] = useState(false);

  // Show specialist card after 2 seconds for assisted/managed
  useEffect(() => {
    if (cohort !== 'self-serve' && assignedSpecialist) {
      const timer = setTimeout(() => setShowSpecialistCard(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [cohort, assignedSpecialist]);

  // Filter recommended hardware based on business category
  const recommendedBundles = HARDWARE_BUNDLES.filter(
    (bundle) => bundle.recommendedFor.includes(businessCategory) || bundle.recommendedFor.includes('all')
  );

  const allBundles = recommendedBundles.length > 0 ? recommendedBundles : HARDWARE_BUNDLES;

  const pricing = calculatePricing(
    locations,
    registersPerLocation,
    needsEcommerce,
    selectedBundles,
    cohort
  );

  const toggleBundle = (bundleId: string) => {
    setSelectedBundles(prev => {
      const existing = prev.find(b => b.bundleId === bundleId);
      if (existing) {
        // Remove if exists
        return prev.filter(b => b.bundleId !== bundleId);
      } else {
        // Add with quantity 1
        return [...prev, { bundleId, quantity: 1 }];
      }
    });
  };

  const updateBundleQuantity = (bundleId: string, quantity: number) => {
    setSelectedBundles(prev =>
      prev.map(b => (b.bundleId === bundleId ? { ...b, quantity: Math.max(1, quantity) } : b))
    );
  };

  const handleContinue = () => {
    onComplete({
      locations,
      registersPerLocation,
      needsEcommerce,
      hardwareBundles: selectedBundles,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Specialist Banner (Assisted/Managed only) */}
      {showSpecialistCard && cohort !== 'self-serve' && assignedSpecialist && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold text-lg">
                    {assignedSpecialist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Your {cohort === 'managed' ? 'Account Manager' : 'Payment Specialist'}:{' '}
                      {assignedSpecialist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cohort === 'managed'
                        ? "I'll help you create a custom quote and guide your setup"
                        : 'Available to help if you have questions'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Software Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Software Setup</CardTitle>
              <CardDescription>Configure your Lightspeed POS licenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="locations">Number of Locations</Label>
                  <Input
                    id="locations"
                    type="number"
                    min="1"
                    value={locations}
                    onChange={(e) => setLocations(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <p className="text-xs text-muted-foreground">
                    $199/month per location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registers">Registers per Location</Label>
                  <Input
                    id="registers"
                    type="number"
                    min="1"
                    value={registersPerLocation}
                    onChange={(e) => setRegistersPerLocation(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <p className="text-xs text-muted-foreground">
                    $89/month per register
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox
                  id="ecommerce"
                  checked={needsEcommerce}
                  onCheckedChange={(checked) => setNeedsEcommerce(checked as boolean)}
                />
                <Label htmlFor="ecommerce" className="cursor-pointer">
                  Add eCommerce ($99/month)
                </Label>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Software Total:</span>
                  <span className="text-xl font-bold">
                    ${pricing.softwareMonthly.toLocaleString()}/month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {locations} {locations === 1 ? 'location' : 'locations'} × {registersPerLocation} {registersPerLocation === 1 ? 'register' : 'registers'}
                  {needsEcommerce && ' + eCommerce'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hardware Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Hardware Setup</CardTitle>
              <CardDescription>
                {recommendedBundles.length > 0
                  ? 'Recommended packages for your business'
                  : 'Choose the hardware that fits your needs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allBundles.map((bundle) => {
                  const isSelected = selectedBundles.some(b => b.bundleId === bundle.id);
                  const selection = selectedBundles.find(b => b.bundleId === bundle.id);

                  return (
                    <motion.div
                      key={bundle.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={cn(
                          'cursor-pointer transition-all',
                          isSelected && 'ring-2 ring-primary shadow-lg'
                        )}
                        onClick={() => toggleBundle(bundle.id)}
                      >
                        <CardContent className="p-4 space-y-3">
                          {/* Image Placeholder */}
                          <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <Package className="w-12 h-12 text-slate-400" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{bundle.name}</h3>
                                <p className="text-xs text-muted-foreground">{bundle.description}</p>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>

                            <ul className="text-xs text-muted-foreground space-y-1">
                              {bundle.items.slice(0, 3).map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                              {bundle.items.length > 3 && (
                                <li>+ {bundle.items.length - 3} more items</li>
                              )}
                            </ul>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-lg font-bold">
                                ${bundle.price.toLocaleString()}
                              </span>
                              {isSelected && selection && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBundleQuantity(bundle.id, selection.quantity - 1);
                                    }}
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">
                                    {selection.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateBundleQuantity(bundle.id, selection.quantity + 1);
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {selectedBundles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select hardware packages to continue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Sticky Pricing Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
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

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payments Processing</span>
                    <span className="text-xs font-medium">
                      {pricing.paymentsProcessing.rate}
                    </span>
                  </div>

                  {pricing.implementationPackage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Implementation</span>
                      <span className="font-medium">
                        ${pricing.implementationPackage.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Due Today</span>
                    <span>${pricing.total.dueToday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Billing</span>
                    <span className="font-medium">
                      ${pricing.total.monthly.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {cohort === 'managed' && (
                  <Badge variant="secondary" className="w-full justify-center">
                    Custom pricing available
                  </Badge>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button
                onClick={handleContinue}
                className="w-full"
                size="lg"
                disabled={selectedBundles.length === 0}
              >
                Continue to Checkout
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full">
                Back
              </Button>
            </div>

            {cohort === 'self-serve' && (
              <p className="text-xs text-center text-muted-foreground">
                Questions? <button className="text-primary hover:underline font-medium">Chat with us</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
