
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getOrCreateWallet } from '@/lib/wallet'; // Assuming wallet can provide user details
import { getUserRank } from '@/lib/ranks';
import { getBotTierSettings, getCurrentTier } from '@/lib/tiers';

const PUBLIC_CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

async function readPublicChat() {
  try {
    const data = await fs.readFile(PUBLIC_CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writePublicChat(data: any[]) {
  await fs.writeFile(PUBLIC_CHAT_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
    try {
        const messages = await readPublicChat();
        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch public chat history' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, text } = await request.json();
        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [wallet, tierSettings] = await Promise.all([
            getOrCreateWallet(userId),
            getBotTierSettings()
        ]);

        if (!wallet) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const balance = wallet.balances?.usdt || 0;
        const rank = getUserRank(balance);
        const tier = await getCurrentTier(balance, tierSettings);

        const newMessage = {
            id: `msg_${crypto.randomUUID()}`,
            userId,
            displayName: wallet.profile?.displayName || wallet.profile?.username || 'Anonymous',
            avatarUrl: wallet.profile?.avatarUrl || '',
            text,
            timestamp: Date.now(),
            rank,
            tier,
        };

        const messages = await readPublicChat();
        messages.push(newMessage);

        // Keep only the last 50 messages to prevent the file from getting too large
        if (messages.length > 50) {
            messages.splice(0, messages.length - 50);
        }
        
        await writePublicChat(messages);

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
