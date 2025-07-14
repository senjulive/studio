
import { NextResponse } from 'next/server';
import { clearNotifications } from '@/lib/notifications';
import { getCurrentUser } from '@/lib/auth'; // We need to identify the user

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await clearNotifications(user.id);

    return NextResponse.json({ success: true, message: 'Notifications cleared.' });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
