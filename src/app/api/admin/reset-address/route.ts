
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';
import { logModeratorAction } from '@/lib/moderator';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedWalletData = {
      ...wallet,
      security: {
        ...wallet.security,
        withdrawalAddresses: {},
      },
    };
    
    await updateWalletByUserId(userId, updatedWalletData);

    await addNotification(userId, {
      title: 'Security Alert',
      content: 'Your saved withdrawal address has been reset by an administrator. Please set a new one before withdrawing.',
      href: '/dashboard/withdraw',
    });

    await logModeratorAction(`Reset withdrawal address for user ${wallet.profile.username || userId}.`);

    return NextResponse.json({ message: 'Withdrawal address reset successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
