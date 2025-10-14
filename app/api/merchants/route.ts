import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { MerchantOnboardingState } from '@/types/merchant-onboarding';

const DATA_DIR = path.join(process.cwd(), 'data');
const MERCHANTS_FILE = path.join(DATA_DIR, 'merchants.json');

export interface StoredMerchant extends MerchantOnboardingState {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read merchants from file
async function readMerchants(): Promise<StoredMerchant[]> {
  await ensureDataDir();

  try {
    const data = await fs.readFile(MERCHANTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet
    return [];
  }
}

// Write merchants to file
async function writeMerchants(merchants: StoredMerchant[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MERCHANTS_FILE, JSON.stringify(merchants, null, 2));
}

// GET /api/merchants - Get all merchants
export async function GET() {
  try {
    const merchants = await readMerchants();
    return NextResponse.json(merchants);
  } catch (error) {
    console.error('Error reading merchants:', error);
    return NextResponse.json({ error: 'Failed to read merchants' }, { status: 500 });
  }
}

// POST /api/merchants - Create or update a merchant
export async function POST(request: NextRequest) {
  try {
    const merchant: MerchantOnboardingState = await request.json();
    const merchants = await readMerchants();
    const now = new Date().toISOString();

    // Check if merchant exists (by email)
    const existingIndex = merchants.findIndex(
      m => m.signUpData?.email === merchant.signUpData?.email
    );

    let storedMerchant: StoredMerchant;

    if (existingIndex >= 0) {
      // Update existing merchant
      storedMerchant = {
        ...merchant,
        id: merchants[existingIndex].id,
        createdAt: merchants[existingIndex].createdAt,
        updatedAt: now,
      };
      merchants[existingIndex] = storedMerchant;
    } else {
      // Create new merchant with generated ID
      const merchantId = merchant.signUpData?.email
        ? `MERCH-${Date.now()}-${merchant.signUpData.email.substring(0, 3).toUpperCase()}`
        : `MERCH-${Date.now()}`;

      storedMerchant = {
        ...merchant,
        id: merchantId,
        createdAt: now,
        updatedAt: now,
      };
      merchants.push(storedMerchant);
    }

    await writeMerchants(merchants);

    return NextResponse.json(storedMerchant);
  } catch (error) {
    console.error('Error saving merchant:', error);
    return NextResponse.json({ error: 'Failed to save merchant' }, { status: 500 });
  }
}

// DELETE /api/merchants - Clear all merchants (for testing)
export async function DELETE() {
  try {
    await writeMerchants([]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing merchants:', error);
    return NextResponse.json({ error: 'Failed to clear merchants' }, { status: 500 });
  }
}
