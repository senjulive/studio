
import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/admin-config';
import type { WalletData } from '@/lib/wallet';
import { getOrCreateWallet } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { adminPassword } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mockWallet = await getOrCreateWallet("mock-user-123");
    
    const wallets: Record<string, WalletData> = {
      "mock-user-123": mockWallet,
      "mock-user-456": {
        ...mockWallet,
        profile: {
          ...mockWallet.profile,
          username: 'Another User',
        },
        balances: {
            usdt: 1234.56,
            btc: 0.05,
            eth: 1.2
        }
      }
    };

    return NextResponse.json(wallets);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
