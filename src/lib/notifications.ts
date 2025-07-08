'use client';

import { getAnnouncements } from './announcements';

const NOTIFICATIONS_STORAGE_KEY = 'astral-notifications';

export type Notification = {
  id: string;
  title: string;
  content: string;
  date: number; // timestamp
  read: boolean;
  href?: string;
};

export type UserNotifications = {
  [userId: string]: Notification[];
};

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
}

async function getAllNotifications(): Promise<UserNotifications> {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  return safeJsonParse(stored, {});
}

async function saveAllNotifications(data: UserNotifications): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(data));
}

// Fetches notifications for a user, including unread announcements
export async function getNotifications(userId: string): Promise<Notification[]> {
  const allNotifications = await getAllNotifications();
  let userNotifications = allNotifications[userId] || [];

  const staticAnnouncements = getAnnouncements();

  // Check if announcements have already been added to this user's notifications
  const announcementIds = new Set(userNotifications.map(n => n.id));
  let newNotificationsAdded = false;

  for (const announcement of staticAnnouncements) {
    if (!announcementIds.has(announcement.id)) {
      newNotificationsAdded = true;
      userNotifications.unshift({
        ...announcement,
        date: new Date(announcement.date).getTime(),
        read: false, // Always appear as unread initially
        href: '/dashboard/profile' // Link to the inbox tab
      });
    }
  }
  
  if (newNotificationsAdded) {
    allNotifications[userId] = userNotifications;
    await saveAllNotifications(allNotifications);
  }

  return userNotifications.sort((a, b) => b.date - a.date);
}

export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'date' | 'read'>): Promise<void> {
    const allNotifications = await getAllNotifications();
    const userNotifications = allNotifications[userId] || [];

    const newNotification: Notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random()}`,
        date: Date.now(),
        read: false,
    };

    userNotifications.unshift(newNotification);
    allNotifications[userId] = userNotifications;
    await saveAllNotifications(allNotifications);
}

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    const allNotifications = await getAllNotifications();
    const userNotifications = (allNotifications[userId] || []).map(n => ({ ...n, read: true }));
    
    allNotifications[userId] = userNotifications;
    await saveAllNotifications(allNotifications);
    
    return userNotifications;
}
