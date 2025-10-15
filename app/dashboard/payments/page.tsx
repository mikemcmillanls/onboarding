'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function PaymentSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    // Save bank account data
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
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Connect Bank for Payouts</h1>
              <p className="text-gray-600">Optional - you can accept payments without this</p>
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
              <CardTitle>Bank Account for Payouts</CardTitle>
              <CardDescription>
                Connect your bank account to receive payouts. You can accept payments without this step.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Important Notes Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Payment Processing vs Payouts</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• <strong>Payment Processing (money in):</strong> Enabled by Identity Verification + POS Config + Purchase</li>
                  <li>• <strong>Payouts (money out):</strong> Enabled by this bank account connection</li>
                  <li>• You can accept payments without connecting a bank account</li>
                  <li>• Funds will be held securely by Stripe until you add your bank account</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Flexible timing:</strong> Complete before purchase, after purchase, or after your first sale.
                  <strong> Estimated time:</strong> 1-3 minutes (instant with Plaid or 1-2 days with manual verification).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="accountHolder">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="routing">Routing Number</Label>
                    <Input
                      id="routing"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="account">Account Number</Label>
                    <Input
                      id="account"
                      type="password"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmAccount">Confirm Account Number</Label>
                  <Input
                    id="confirmAccount"
                    type="password"
                    value={formData.confirmAccountNumber}
                    onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Your bank information is encrypted and secure. We recommend using Plaid for instant verification,
                    or we&apos;ll verify your account with two small deposits within 1-2 business days.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Save Bank Account
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">Do This Later</Button>
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
