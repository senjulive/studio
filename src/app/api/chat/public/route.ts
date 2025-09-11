
'use server';

import { NextResponse } from 'next/server';
import { getWalletByUserId } from '@/lib/wallet';
import { getUserRank, getCurrentTier } from '@/lib/ranks';
import { getBotTierSettings } from '@/lib/tiers';
import type { Rank } from '@/lib/ranks';
import type { TierSetting } from '@/lib/tiers';
import { readJson, writeJson } from '@/lib/storage';

const CHAT_KEY = 'public-chat.json';

type ChatMessage = {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierSetting | null;
    isAdmin?: boolean;
};

async function readChatHistory(): Promise<ChatMessage[]> {
  return readJson<ChatMessage[]>(CHAT_KEY, []);
}

async function writeChatHistory(data: ChatMessage[]) {
  await writeJson(CHAT_KEY, data);
}

export async function GET(request: Request) {
    try {
        const history = await readChatHistory();
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentHistory = history.filter(msg => msg.timestamp >= twentyFourHoursAgo);
        return NextResponse.json(recentHistory);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const { userId, text } = await request.json();

        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [wallet, tierSettings] = await Promise.all([
            getWalletByUserId(userId),
            getBotTierSettings(),
        ]);

        if (!wallet) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const rank = getUserRank(wallet.balances.usdt || 0);
        const tier = getCurrentTier(wallet.balances.usdt || 0, tierSettings);

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random()}`,
            userId,
            displayName: wallet.profile.displayName || wallet.profile.username,
            avatarUrl: wallet.profile.avatarUrl,
            text,
            timestamp: Date.now(),
            rank,
            tier,
        };

        const history = await readChatHistory();
        history.push(newMessage);
        
        // Keep only the last 100 messages to prevent the file from growing too large
        const trimmedHistory = history.slice(-100);

        await writeChatHistory(trimmedHistory);

        return NextResponse.json({ success: true, message: 'Message sent' });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
