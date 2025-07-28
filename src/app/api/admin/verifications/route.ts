
import { NextResponse } from 'next/server';
import wallets from '@/data/wallets.json';

export async function POST() {
    // This is a mock. In a real app, this would be a protected admin route.
    // We'll find users with a 'verifying' status.
    const pendingVerifications = Object.values(wallets).filter(
        (w: any) => w.profile.verificationStatus === 'verifying'
    );
    return NextResponse.json(pendingVerifications);
}
