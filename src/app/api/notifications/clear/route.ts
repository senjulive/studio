
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const notificationsFilePath = path.join(process.cwd(), 'src/data/notifications.json');
const MOCK_USER_ID = 'mock-user-123'; // Using the static mock user ID

export async function POST() {
    try {
        const notificationsData = fs.readFileSync(notificationsFilePath, 'utf-8');
        const notifications = JSON.parse(notificationsData);

        if (notifications[MOCK_USER_ID]) {
            notifications[MOCK_USER_ID] = [];
            fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2), 'utf-8');
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
    }
}
