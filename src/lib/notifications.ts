
'use server';

import { createClient } from "./supabase/server";

export type Notification = {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  content: string;
  read: boolean;
  href?: string;
};

// Fetches notifications for a user, including unread announcements
export async function getNotifications(userId: string): Promise<Notification[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }

    return data as Notification[];
}

export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'created_at' | 'read' | 'user_id'>): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            ...notificationData
        });

    if (error) {
        console.error("Error adding notification:", error);
    }
}

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    const supabase = createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    
    if (error) {
        console.error("Error marking notifications as read:", error);
        return [];
    }
    
    return getNotifications(userId);
}

export async function clearNotifications(userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
    
    if (error) {
        console.error("Error clearing notifications:", error);
    }
}
