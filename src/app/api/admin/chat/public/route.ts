
'use server';

import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/storage';
import type { Rank } from '@/lib/ranks';
import type { TierSetting } from '@/lib/tiers';

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

const CHAT_KEY = 'public-chat.json';

export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const messages = await readJson<ChatMessage[]>(CHAT_KEY, []);
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);

    if (messages.length === updatedMessages.length) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await writeJson(CHAT_KEY, updatedMessages);

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
