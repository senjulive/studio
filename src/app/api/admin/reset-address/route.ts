
import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/admin-config';
import { getOrCreateWallet, updateWallet } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { adminPassword, userId } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real DB, you'd fetch the specific user's wallet.
    // Here we use the mock getOrCreateWallet which returns the single in-memory wallet.
    const walletData = await getOrCreateWallet(userId);
    walletData.security.withdrawalAddresses = {};

    // Update the mock wallet data
    await updateWallet(userId, walletData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
