
import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

const DB_FILE = 'settings.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json({ error: 'A key is required' }, { status: 400 });
    }

    const settings = await readDb(DB_FILE, {});
    const value = settings[key];

    if (value === undefined) {
      // Return null or an empty object if the key is not found,
      // so the frontend can use its default values.
      return NextResponse.json(null);
    }
    
    return NextResponse.json(value);
  } catch (error: any) {
    // If the file doesn't exist or is invalid JSON, we'll fall back to defaults on the client.
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      return NextResponse.json(null);
    }
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
