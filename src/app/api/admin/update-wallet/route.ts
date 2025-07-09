
import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/admin-config';
import type { WalletData } from '@/lib/wallet';
import { updateWallet } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { adminPassword, userId, newWalletData } = (await request.json()) as {
      adminPassword: string;
      userId: string;
      newWalletData: WalletData;
    };

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await updateWallet(userId, newWalletData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
