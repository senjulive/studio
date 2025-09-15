import { NextResponse } from 'next/server';
import { readJson } from '@/lib/storage';

const SETTINGS_KEY = 'settings.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'A settings key is required.' }, { status: 400 });
    }

    const settings = await readJson<any>(SETTINGS_KEY, {});
    const value = settings[key] ?? null;

    return NextResponse.json(value);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
