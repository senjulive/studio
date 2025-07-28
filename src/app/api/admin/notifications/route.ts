
import { NextResponse } from 'next/server';
import notifications from '@/data/notifications.json';

export async function POST() {
    // In a real app, this would be a protected admin route.
    // Here we're just returning a flattened list of all notifications for simplicity.
    const allNotifications = Object.values(notifications).flat();
    return NextResponse.json(allNotifications);
}
