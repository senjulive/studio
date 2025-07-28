
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const walletsFilePath = path.join(process.cwd(), 'src/data/wallets.json');

export async function POST(req: Request) {
    const { userId } = await req.json();
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const walletsData = fs.readFileSync(walletsFilePath, 'utf-8');
        const wallets = JSON.parse(walletsData);

        if (wallets[userId]) {
            wallets[userId].profile.verificationStatus = 'verified';
            fs.writeFileSync(walletsFilePath, JSON.stringify(wallets, null, 2), 'utf-8');
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
    }
}
