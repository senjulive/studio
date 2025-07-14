
import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/admin-config';
import { readDb, writeDb } from '@/lib/db';

const DB_FILE = 'settings.json';

export async function POST(request: Request) {
  try {
    const { adminPassword, key, value } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Setting key and value are required' }, { status: 400 });
    }
    
    const settings = await readDb(DB_FILE, {});
    settings[key] = value;
    await writeDb(DB_FILE, settings);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
