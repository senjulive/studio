
import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/admin-config';

// This is a mock API route since there is no database.
// It simulates a successful save operation.
export async function POST(request: Request) {
  try {
    const { adminPassword, key, value } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Setting key and value are required' }, { status: 400 });
    }
    
    console.log(`Mock save setting: ${key}`, value);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
