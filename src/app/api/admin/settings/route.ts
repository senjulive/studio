import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/storage';

const SETTINGS_KEY = 'settings.json';

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required.' }, { status: 400 });
    }

    const settings = await readJson<any>(SETTINGS_KEY, {});
    settings[key] = value;
    await writeJson(SETTINGS_KEY, settings);

    return NextResponse.json({ success: true, message: 'Settings updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
