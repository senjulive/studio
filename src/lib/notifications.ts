
'use client';

import { getAnnouncements } from './announcements';
import { readDb, writeDb } from './db';

const DB_FILE = 'notifications.json';

export type Notification = {
  id: string;
  title: string;
  content: string;
  date: number; // timestamp
  read: boolean;
  href?: string;
};

// Returns a default set of notifications based on announcements
const getDefaultNotifications = (): Notification[] => {
    return getAnnouncements().map((ann) => ({
        ...ann,
        date: new Date(ann.date).getTime(),
        read: false,
        href: '/dashboard/profile'
    }));
};

// Fetches notifications for a user, including unread announcements
export async function getNotifications(userId: string): Promise<Notification[]> {
    const allUserNotifications: Record<string, Notification[]> = await readDb(DB_FILE, {});
    
    // For a given user, if they have no notifications, populate with defaults.
    if (!allUserNotifications[userId]) {
        allUserNotifications[userId] = getDefaultNotifications();
        await writeDb(DB_FILE, allUserNotifications);
    }

    return allUserNotifications[userId].sort((a, b) => b.date - a.date);
}

export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'date' | 'read'>): Promise<void> {
    const allUserNotifications = await readDb(DB_FILE, {});

    const newNotification: Notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        date: Date.now(),
        read: false,
    };

    if (!allUserNotifications[userId]) {
        allUserNotifications[userId] = getDefaultNotifications();
    }

    allUserNotifications[userId].push(newNotification);
    await writeDb(DB_FILE, allUserNotifications);
}

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    const allUserNotifications = await readDb(DB_FILE, {});
    if (allUserNotifications[userId]) {
        allUserNotifications[userId].forEach(n => n.read = true);
        await writeDb(DB_FILE, allUserNotifications);
        return allUserNotifications[userId];
    }
    return [];
}

export async function clearNotifications(userId: string): Promise<void> {
    const allUserNotifications = await readDb(DB_FILE, {});
    if (allUserNotifications[userId]) {
        allUserNotifications[userId] = [];
        await writeDb(DB_FILE, allUserNotifications);
    }
}
