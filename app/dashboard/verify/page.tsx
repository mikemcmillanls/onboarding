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
    // In production, this would navigate to the KYB verification flow
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
              <h1 className="text-3xl font-bold text-gray-900">Business Verification</h1>
              <p className="text-gray-600">Required to start accepting payments</p>
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
              <CardTitle>Verify Your Identity</CardTitle>
              <CardDescription>
                We need to verify your business information to comply with payment processing regulations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What you&apos;ll need:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Legal business name and structure</li>
                  <li>Employer Identification Number (EIN) or SSN</li>
                  <li>Business address</li>
                  <li>Business owner information</li>
                  <li>Government-issued ID</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  This verification process typically takes 5-10 minutes. Your information is encrypted and secure.
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
