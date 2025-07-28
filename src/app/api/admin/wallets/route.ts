
import { NextResponse } from 'next/server';
import wallets from '@/data/wallets.json';

export async function POST() {
    // This is a mock. In a real app, this would be a protected admin route.
    return NextResponse.json(wallets);
}
