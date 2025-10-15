'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function BusinessVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartVerification = () => {
    setLoading(true);
    // In production, this would navigate to the KYC verification flow
    // For now, simulate and redirect back to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verify Your Identity</h1>
              <p className="text-gray-600">Individual verification required to accept payments</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Individual Identity Verification</CardTitle>
              <CardDescription>
                Verify your identity and any business owners (25%+ ownership) to enable payment processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Important Notes Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Important</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• This collects identity data for use during purchase</li>
                  <li>• No Stripe Connect account is created at this stage</li>
                  <li>• Business verification (KYB) was already completed at signup</li>
                  <li>• Payment processing activates 1-2 days after purchase</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required for each person:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Full legal name and date of birth</li>
                  <li>Social Security Number (SSN)</li>
                  <li>Home address</li>
                  <li>Government-issued ID (driver&apos;s license or passport)</li>
                  <li>Selfie photo for identity verification</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Who needs to be verified:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Business representative (you)</li>
                  <li>All beneficial owners with 25%+ ownership</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Estimated time:</strong> 10-15 minutes. Your information is encrypted and secure.
                  Required by Stripe to process payments and comply with financial regulations.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleStartVerification}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Starting...' : 'Start Verification'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline">Do This Later</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
