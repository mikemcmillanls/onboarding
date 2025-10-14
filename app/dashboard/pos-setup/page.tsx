'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function POSSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    locations: 1,
    registersPerLocation: 1,
    needsEcommerce: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, save to merchant data
    console.log('POS Setup:', formData);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
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
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">POS Configuration</h1>
              <p className="text-gray-600">Set up your point of sale system</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Configure Your POS</CardTitle>
              <CardDescription>
                Tell us about your business setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="locations">Number of Locations</Label>
                  <Input
                    id="locations"
                    type="number"
                    min={1}
                    value={formData.locations}
                    onChange={(e) => setFormData({ ...formData, locations: parseInt(e.target.value) })}
                    className="max-w-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="registers">Registers per Location</Label>
                  <Input
                    id="registers"
                    type="number"
                    min={1}
                    value={formData.registersPerLocation}
                    onChange={(e) => setFormData({ ...formData, registersPerLocation: parseInt(e.target.value) })}
                    className="max-w-xs"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ecommerce"
                    checked={formData.needsEcommerce}
                    onCheckedChange={(checked) => setFormData({ ...formData, needsEcommerce: !!checked })}
                  />
                  <Label htmlFor="ecommerce" className="cursor-pointer">
                    I need e-commerce integration
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Save Configuration
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
