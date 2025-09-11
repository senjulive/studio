import { NextResponse } from 'next/server';
import { readJson } from '@/lib/storage';

export async function GET() {
  try {
    const [wallets, settings, notifications, publicChat, squadClans, squadChats] = await Promise.all([
      readJson<Record<string, any>>('wallets.json', {}),
      readJson<any>('settings.json', {}),
      readJson<any[]>('notifications.json', []),
      readJson<any[]>('public-chat.json', []),
      readJson<Record<string, any>>('squad-clans.json', {}),
      readJson<Record<string, any[]>>('squad-chats.json', {}),
    ]);
    return NextResponse.json({
      wallets,
      settings,
      notifications,
      publicChat,
      squad: {
        clans: squadClans,
        chats: squadChats,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to read app data' }, { status: 500 });
  }
}