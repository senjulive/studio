'use server';

import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/storage';
import type { Clan } from '@/lib/squad-clans';

const CLANS_KEY = 'squad-clans.json';
const CHATS_KEY = 'squad-chats.json';

export async function GET() {
  try {
    const clans = await readJson<Record<string, Clan>>(CLANS_KEY, {});
    return NextResponse.json({ clans });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to read clans' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { clanId, name, avatarUrl } = await request.json();
    if (!clanId || (!name && !avatarUrl)) {
      return NextResponse.json({ error: 'clanId and at least one of name/avatarUrl are required' }, { status: 400 });
    }
    const clans = await readJson<Record<string, Clan>>(CLANS_KEY, {});
    const clan = clans[clanId];
    if (!clan) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 });
    }
    clans[clanId] = {
      ...clan,
      name: name ?? clan.name,
      avatarUrl: avatarUrl ?? clan.avatarUrl,
    };
    await writeJson(CLANS_KEY, clans);
    return NextResponse.json({ success: true, clan: clans[clanId] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update clan' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { clanId } = await request.json();
    if (!clanId) {
      return NextResponse.json({ error: 'clanId is required' }, { status: 400 });
    }
    const clans = await readJson<Record<string, Clan>>(CLANS_KEY, {});
    if (!clans[clanId]) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 });
    }
    delete clans[clanId];
    await writeJson(CLANS_KEY, clans);

    // Remove chats for this clan as well
    const chats = await readJson<Record<string, any[]>>(CHATS_KEY, {});
    if (chats[clanId]) {
      delete chats[clanId];
      await writeJson(CHATS_KEY, chats);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete clan' }, { status: 500 });
  }
}