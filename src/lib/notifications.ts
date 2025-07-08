
'use client';

import { supabase } from './supabase';
import type { Announcement } from './announcements';

export type Notification = {
  id: string;
  title: string;
  content: string;
  date: number; // timestamp
  read: boolean;
  href?: string;
};

async function fetchAnnouncements(): Promise<Announcement[]> {
    try {
        const response = await fetch('/api/public-settings?key=announcements');
        if (!response.ok) return [];
        const data = await response.json();
        return data || [];
    } catch (e) {
        console.error("Failed to fetch announcements for notifications", e);
        return [];
    }
}


// Fetches notifications for a user, including unread announcements
export async function getNotifications(userId: string): Promise<Notification[]> {
  // Fetch existing notifications and announcements in parallel
  const [notificationsResult, announcements] = await Promise.all([
    supabase.from('notifications').select('id, notification').eq('user_id', userId),
    fetchAnnouncements()
  ]);

  if (notificationsResult.error) {
    console.error("Error fetching notifications:", notificationsResult.error);
    return [];
  }

  const userNotifications = notificationsResult.data.map(r => r.notification as Notification);
  const existingNotificationIds = new Set(userNotifications.map(n => n.id));
  const newNotificationsToInsert: any[] = [];

  // Check for announcements that haven't been added to this user's notifications yet
  for (const announcement of announcements) {
    if (!existingNotificationIds.has(announcement.id)) {
      const newNotification: Notification = {
        ...announcement,
        date: new Date(announcement.date).getTime(),
        read: false, // Always appear as unread initially
        href: '/dashboard/profile' // Link to the inbox tab
      };
      userNotifications.push(newNotification);
      newNotificationsToInsert.push({ id: newNotification.id, user_id: userId, notification: newNotification });
    }
  }
  
  // If there are new announcements, add them to the database for this user
  if (newNotificationsToInsert.length > 0) {
    const { error: insertError } = await supabase.from('notifications').insert(newNotificationsToInsert);
    if (insertError) {
      console.error("Error adding new announcement notifications:", insertError);
    }
  }

  return userNotifications.sort((a, b) => b.date - a.date);
}

export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'date' | 'read'>): Promise<void> {
    const newNotification: Notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        date: Date.now(),
        read: false,
    };

    const { error } = await supabase.from('notifications').insert({
      id: newNotification.id,
      user_id: userId,
      notification: newNotification as any
    });

    if (error) {
      console.error("Error adding notification:", error);
    }
}

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    const { data: notificationsToUpdate, error } = await supabase
      .from('notifications')
      .select('id, notification')
      .eq('user_id', userId);

    if (error || !notificationsToUpdate) {
        console.error("Error fetching notifications to mark as read:", error);
        return [];
    }

    const updatedNotifications = notificationsToUpdate.map(n => ({
        id: n.id,
        user_id: userId,
        notification: { ...(n.notification as Notification), read: true }
    }));
    
    if (updatedNotifications.length > 0) {
      const { error: upsertError } = await supabase.from('notifications').upsert(updatedNotifications);
      if (upsertError) {
        console.error("Error marking notifications as read:", upsertError);
      }
    }
    
    return updatedNotifications.map(n => n.notification as Notification);
}
