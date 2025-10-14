'use client';

import { use } from 'react';
import { MerchantDetail } from '@/components/admin/merchant-detail';
import { getMerchantById } from '@/lib/admin-mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const merchant = getMerchantById(id);

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Merchant Not Found</h1>
          <p className="text-gray-600 mb-6">
            The merchant with ID &quot;{id}&quot; could not be found.
          </p>
          <Link href="/admin">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Merchant Detail</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <MerchantDetail merchant={merchant} />
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
