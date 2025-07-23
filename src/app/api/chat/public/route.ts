
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type Rank, getUserRank, getCurrentTier } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings } from '@/lib/tiers';
import { getWalletByUserId } from '@/lib/wallet';

const CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

type ChatMessage = {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierData | null;
    isAdmin?: boolean;
};

async function readChatHistory(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeChatHistory(messages: ChatMessage[]): Promise<void> {
  await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(messages, null, 4), 'utf-8');
}

export async function GET(request: Request) {
    try {
        const history = await readChatHistory();
        return NextResponse.json(history);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
    }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, text } = body;

    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tierSettings = await getBotTierSettings();
    const balance = wallet.balances.usdt || 0;

    const newMessage: ChatMessage = {
        id: `msg_${crypto.randomUUID()}`,
        userId,
        displayName: wallet.profile.displayName || wallet.profile.username,
        avatarUrl: wallet.profile.avatarUrl,
        text,
        timestamp: Date.now(),
        rank: getUserRank(balance),
        tier: getCurrentTier(balance, tierSettings),
    };
    
    const history = await readChatHistory();
    history.push(newMessage);
    // Keep only the last 100 messages to prevent the file from getting too large
    await writeChatHistory(history.slice(-100));

    return NextResponse.json({ success: true, message: 'Message sent' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
