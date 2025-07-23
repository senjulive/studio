
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type Rank, getUserRank } from '@/lib/ranks';
import { type TierSetting, getBotTierSettings, getCurrentTier } from '@/lib/tiers';

const CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

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
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writeChatHistory(history: ChatMessage[]) {
  await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(history, null, 4), 'utf-8');
}

export async function GET() {
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
        const { userId, text, rank, tier } = body;

        if (!userId || !text || !rank) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const history = await readChatHistory();

        const newMessage: ChatMessage = {
            id: `msg_${crypto.randomUUID()}`,
            userId,
            displayName: 'MockUser',
            text,
            timestamp: Date.now(),
            rank,
            tier,
            isAdmin: false,
        };
        
        history.push(newMessage);
        
        // Keep only the last 50 messages for performance
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }

        await writeChatHistory(history);

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
