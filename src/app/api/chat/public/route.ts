
'use server';

import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { Rank } from '@/lib/ranks';
import type { TierSetting as TierData } from '@/lib/tiers';

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

async function readChatFile(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading public chat file:', error);
    return [];
  }
}

async function writeChatFile(data: ChatMessage[]): Promise<void> {
  try {
    await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(data, null, 4), 'utf-8');
  } catch (error) {
    console.error('Error writing to public chat file:', error);
  }
}

export async function GET() {
    try {
        const messages = await readChatFile();
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentMessages = messages.filter(msg => msg.timestamp >= twentyFourHoursAgo);
        return NextResponse.json(recentMessages);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, text } = await request.json();
        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
        }
        
        // In a real app, we'd get user details from a database
        // For now, we create a mock message
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            userId: userId,
            displayName: "NewUser", // This should be fetched
            text: text,
            timestamp: Date.now(),
            rank: { name: 'Recruit', minBalance: 0, Icon: 'RecruitRankIcon', className: 'text-muted-foreground' },
            tier: null,
        };

        const messages = await readChatFile();
        messages.push(newMessage);
        await writeChatFile(messages);

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
