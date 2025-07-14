
import { NextResponse } from 'next/server';
import { getOrCreateWallet, updateWallet, getAllWallets, type WalletData } from '@/lib/wallet';

// This is a mock implementation. In a real app, you'd use a database.
async function isIdCardUnique(userId: string, idCardNo: string): Promise<boolean> {
  const allWallets = await getAllWallets();
  for (const id in allWallets) {
    if (id !== userId && allWallets[id].profile.idCardNo === idCardNo) {
      return false; // Found a duplicate
    }
  }
  return true;
}

export async function POST(request: Request) {
  try {
    const { userId, fullName, idCardNo, address, dateOfBirth } = await request.json();

    if (!userId || !fullName || !idCardNo || !address || !dateOfBirth) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!/^\d{9,}$/.test(idCardNo)) {
        return NextResponse.json({ success: false, error: 'ID Card Number must be at least 9 digits.' }, { status: 400 });
    }

    // Check for uniqueness
    const isUnique = await isIdCardUnique(userId, idCardNo);
    if (!isUnique) {
      return NextResponse.json({ success: false, error: 'This ID Card Number is already in use.' }, { status: 409 });
    }

    const walletData = await getOrCreateWallet(userId);
    
    // Start verification process
    const newWalletData: WalletData = {
      ...walletData,
      profile: {
        ...walletData.profile,
        fullName,
        idCardNo,
        address,
        dateOfBirth,
        verificationStatus: 'verifying',
      },
    };
    
    await updateWallet(userId, newWalletData);

    // Simulate the 2-minute verification delay
    setTimeout(async () => {
      try {
        const finalWalletData = await getOrCreateWallet(userId);
        finalWalletData.profile.verificationStatus = 'verified';
        await updateWallet(userId, finalWalletData);
        console.log(`Verification completed for user ${userId}`);
      } catch (error) {
        console.error(`Error completing verification for user ${userId}:`, error);
        // Optionally, handle the failure case (e.g., set status to 'failed')
        const failedWalletData = await getOrCreateWallet(userId);
        failedWalletData.profile.verificationStatus = 'unverified';
        await updateWallet(userId, failedWalletData);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return NextResponse.json({ success: true, message: 'Profile update received. Verification is in progress.' });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
