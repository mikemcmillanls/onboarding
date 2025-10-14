'use client';

import { useState, useEffect } from 'react';
import { MerchantTable } from '@/components/admin/merchant-table';
import { mockMerchants } from '@/lib/admin-mock-data';
import { MerchantStorage } from '@/lib/merchant-storage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [merchants, setMerchants] = useState(mockMerchants);

  // Load merchants from API
  useEffect(() => {
    const loadMerchants = async () => {
      const storedMerchants = await MerchantStorage.getAllMerchants();
      const formattedMerchants = storedMerchants.map(m =>
        MerchantStorage.toAdminFormat(m)
      );

      // Merge stored merchants with mock merchants (stored merchants take precedence)
      const mergedMerchants = [...formattedMerchants, ...mockMerchants];
      const uniqueMerchants = mergedMerchants.filter((merchant, index, self) =>
        index === self.findIndex(m => m.email === merchant.email)
      );

      setMerchants(uniqueMerchants);
    };

    // Initial load
    loadMerchants();

    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      loadMerchants();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const activeMerchants = merchants.filter(m => m.status === 'active').length;
  const stalledMerchants = merchants.filter(m => m.status === 'stalled').length;
  const completedMerchants = merchants.filter(m => m.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Merchant Onboarding Tracking System
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-sm text-gray-600 mb-1">Total Merchants</p>
              <p className="text-3xl font-bold text-black">{merchants.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-700">{activeMerchants}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">Stalled</p>
              <p className="text-3xl font-bold text-yellow-700">{stalledMerchants}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-blue-700">{completedMerchants}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-2">Merchant List</h2>
          <p className="text-gray-600">
            Click on any merchant row to view detailed information about their onboarding progress
            and collected data.
          </p>
        </div>

        <MerchantTable merchants={merchants} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Lightspeed Commerce Inc. - Admin Dashboard</p>
            <p>
              Need help?{' '}
              <a href="#" className="text-black hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
