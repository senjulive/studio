'use server';

import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/storage';
import type { ClanChatMessage } from '@/lib/squad-clans';

const CHATS_KEY = 'squad-chats.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clanId = searchParams.get('clanId');
    if (!clanId) {
      return NextResponse.json({ error: 'clanId is required' }, { status: 400 });
    }
    const chats = await readJson<Record<string, ClanChatMessage[]>>(CHATS_KEY, {});
    return NextResponse.json({ messages: chats[clanId] || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to read clan chat' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { clanId, messageId } = await request.json();
    if (!clanId) {
      return NextResponse.json({ error: 'clanId is required' }, { status: 400 });
    }
    const chats = await readJson<Record<string, ClanChatMessage[]>>(CHATS_KEY, {});
    const messages = chats[clanId] || [];

    if (messageId) {
      const updated = messages.filter((m) => m.id !== messageId);
      chats[clanId] = updated;
    } else {
      // Clear all messages for the clan
      chats[clanId] = [];
    }
    await writeJson(CHATS_KEY, chats);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to modify clan chat' }, { status: 500 });
  }
}