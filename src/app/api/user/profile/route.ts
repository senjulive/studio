import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWalletByUserId } from '@/lib/wallet';

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('astralcore-session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days
    if (Date.now() - session.timestamp > maxAge) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user wallet data (contains profile info)
    const wallet = await getWalletByUserId('mock-user-123'); // In real app, use session.userId
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        email: session.email,
        role: session.role,
        profile: wallet.profile,
        balances: wallet.balances,
        growth: wallet.growth,
        squad: wallet.squad,
        verificationStatus: wallet.profile?.verificationStatus || 'unverified'
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
