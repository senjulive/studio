import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query<{ now: string }>('select now()');
    return NextResponse.json({ ok: true, now: res.rows[0]?.now });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'db error' }, { status: 500 });
  }
}