/**
 * Merchant Storage Helper
 *
 * Provides file-based persistence for merchant onboarding data via API routes.
 * Enables synchronization between merchant onboarding flow and admin dashboard.
 */

import type { MerchantOnboardingState } from '@/types/merchant-onboarding';

export interface StoredMerchant extends MerchantOnboardingState {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const MerchantStorage = {
  /**
   * Save or update a merchant via API
   */
  async saveMerchant(merchant: MerchantOnboardingState): Promise<StoredMerchant> {
    try {
      const response = await fetch('/api/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchant),
      });

      if (!response.ok) {
        throw new Error('Failed to save merchant');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to save merchant:', error);
      throw error;
    }
  },

  /**
   * Get all merchants from API
   */
  async getAllMerchants(): Promise<StoredMerchant[]> {
    try {
      const response = await fetch('/api/merchants', {
        cache: 'no-store', // Disable caching to always get fresh data
      });

      if (!response.ok) {
        throw new Error('Failed to fetch merchants');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to load merchants:', error);
      return [];
    }
  },

  /**
   * Get a single merchant by ID
   */
  async getMerchant(id: string): Promise<StoredMerchant | undefined> {
    const merchants = await this.getAllMerchants();
    return merchants.find(m => m.id === id);
  },

  /**
   * Get a merchant by email
   */
  async getMerchantByEmail(email: string): Promise<StoredMerchant | undefined> {
    const merchants = await this.getAllMerchants();
    return merchants.find(m => m.signUpData?.email === email);
  },

  /**
   * Clear all merchant data (for testing)
   */
  async clearAll(): Promise<void> {
    try {
      const response = await fetch('/api/merchants', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear merchants');
      }
    } catch (error) {
      console.error('Failed to clear merchants:', error);
      throw error;
    }
  },

  /**
   * Calculate merchant status based on activity
   */
  calculateStatus(merchant: StoredMerchant): 'active' | 'stalled' | 'completed' | 'blocked' {
    // Completed
    if (merchant.currentStep === 4 && merchant.setupTasks?.every(t => t.completed)) {
      return 'completed';
    }

    // Blocked (KYB/KYC rejected)
    if (merchant.kybStatus === 'rejected' || merchant.kycStatus === 'rejected') {
      return 'blocked';
    }

    // Stalled (no activity in 24 hours)
    const lastActivity = new Date(merchant.updatedAt);
    const hoursSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60);

    if (hoursSinceActivity > 24 && merchant.currentStep < 4) {
      return 'stalled';
    }

    // Active
    return 'active';
  },

  /**
   * Calculate checklist progress for dashboard
   */
  calculateChecklistProgress(merchant: StoredMerchant): {
    completed: number;
    total: number;
    percentage: number;
  } {
    const tasks = [
      { completed: merchant.kybStatus === 'approved' },
      { completed: !!merchant.posSetupData?.locations },
      { completed: !!merchant.checkoutData?.paymentMethod || !!merchant.posSetupData?.existingHardware?.hasExisting },
      { completed: !!merchant.bankAccountData?.accountNumber && merchant.kycStatus === 'approved' },
      { completed: merchant.setupTasks?.some(t => t.id.includes('team') && t.completed) || false },
      { completed: merchant.setupTasks?.some(t => (t.id.includes('import') || t.id.includes('data')) && t.completed) || false },
    ];

    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  },
};
