
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const walletsFilePath = path.join(process.cwd(), 'src/data/wallets.json');

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, ...profileData } = body;

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const walletsData = fs.readFileSync(walletsFilePath, 'utf-8');
        const wallets = JSON.parse(walletsData);

        if (wallets[userId]) {
            wallets[userId].profile = {
                ...wallets[userId].profile,
                ...profileData,
                verificationStatus: 'verifying'
            };
            fs.writeFileSync(walletsFilePath, JSON.stringify(wallets, null, 2), 'utf-8');
            return NextResponse.json({ success: true, wallet: wallets[userId] });
        } else {
            return NextResponse.json({ error: 'Wallet not found for user' }, { status: 404 });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
