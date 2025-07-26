
'use server';

import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { type Rank } from '@/lib/ranks';

const CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

type ChatMessage = {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  text: string;
  timestamp: number;
  rank: Rank;
  tier: any | null;
  isAdmin?: boolean;
};

async function readChatFile(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writeChatFile(data: ChatMessage[]): Promise<void> {
  await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(data, null, 4), 'utf-8');
}

// GET: Fetch all public chat messages
export async function GET() {
  try {
    const messages = await readChatFile();
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Send a message as an admin
export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const messages = await readChatFile();
    
    const newMessage: ChatMessage = {
      id: `msg_${crypto.randomUUID()}`,
      userId: 'admin-astralcore',
      displayName: 'AstralCore',
      text,
      timestamp: Date.now(),
      isAdmin: true,
      rank: { name: 'Admin', minBalance: 999999, Icon: 'Shield', className: 'text-primary' },
      tier: null,
    };

    messages.push(newMessage);
    await writeChatFile(messages);

    return NextResponse.json({ success: true, message: 'Message sent' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// DELETE: Remove a message from the chat
export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    let messages = await readChatFile();
    const initialLength = messages.length;

    messages = messages.filter(msg => msg.id !== messageId);

    if (messages.length === initialLength) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await writeChatFile(messages);

    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
