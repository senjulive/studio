
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type Rank } from '@/lib/ranks';
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


export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const messages = await readChatHistory();
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    
    if (messages.length === updatedMessages.length) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await writeChatHistory(updatedMessages);

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
