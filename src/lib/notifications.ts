
'use client';

import { getAnnouncements } from './announcements';

export type Notification = {
  id: string;
  title: string;
  content: string;
  date: number; // timestamp
  read: boolean;
  href?: string;
};

// Since there is no DB, we'll use a local, in-memory store for notifications.
let userNotifications: Notification[] = getAnnouncements().map((ann) => ({
    ...ann,
    date: new Date(ann.date).getTime(),
    read: false,
    href: '/dashboard/profile'
}));

// Fetches notifications for a user, including unread announcements
export async function getNotifications(userId: string): Promise<Notification[]> {
  // Returns the mock notifications, sorted by date.
  return Promise.resolve(userNotifications.sort((a, b) => b.date - a.date));
}

export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'date' | 'read'>): Promise<void> {
    const newNotification: Notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        date: Date.now(),
        read: false,
    };
    userNotifications.push(newNotification);
}

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    userNotifications.forEach(n => n.read = true);
    return getNotifications(userId);
}
