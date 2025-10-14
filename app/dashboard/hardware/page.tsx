'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const hardwareBundles = [
  {
    id: 'starter',
    name: 'Starter Bundle',
    price: 499,
    items: ['Card Reader', 'Receipt Printer', 'Cash Drawer'],
  },
  {
    id: 'professional',
    name: 'Professional Bundle',
    price: 899,
    items: ['Card Reader', 'Receipt Printer', 'Cash Drawer', 'Barcode Scanner', 'iPad Stand'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Bundle',
    price: 1499,
    items: ['Card Reader', 'Receipt Printer', 'Cash Drawer', 'Barcode Scanner', 'iPad Stand', 'Label Printer', 'Kitchen Display'],
  },
];

export default function HardwareSelectionPage() {
  const router = useRouter();
  const [hasExistingHardware, setHasExistingHardware] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  const handleSubmit = () => {
    if (hasExistingHardware || selectedBundle) {
      // Save selection and return to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hardware Selection</h1>
              <p className="text-gray-600">Choose the hardware you need</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Already Have Hardware Option */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="existing"
                  checked={hasExistingHardware}
                  onCheckedChange={(checked) => {
                    setHasExistingHardware(!!checked);
                    if (checked) setSelectedBundle(null);
                  }}
                />
                <Label htmlFor="existing" className="cursor-pointer font-semibold">
                  I already have compatible hardware
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Hardware Bundles */}
          {!hasExistingHardware && (
            <>
              <h2 className="text-xl font-semibold text-gray-900">Or choose a bundle:</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {hardwareBundles.map((bundle) => (
                  <Card
                    key={bundle.id}
                    className={`cursor-pointer transition-all ${
                      selectedBundle === bundle.id
                        ? 'border-red-600 border-2 shadow-lg'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedBundle(bundle.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {bundle.name}
                        {selectedBundle === bundle.id && (
                          <Check className="h-5 w-5 text-red-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-2xl font-bold text-gray-900">
                        ${bundle.price}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {bundle.items.map((item) => (
                          <li key={item} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-600 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!hasExistingHardware && !selectedBundle}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Do This Later</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
