
'use server';

import { createClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";

export type Notification = {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  content: string;
  read: boolean;
  href?: string;
};

// Fetches notifications for a user
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

// Adds a notification for a specific user
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


// Adds a notification for the admin and all active moderators
export async function addPlatformNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'read' | 'user_id'>): Promise<void> {
    const supabaseAdmin = createAdminClient();
    
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
        console.error("Failed to fetch users for platform notification:", userError);
        return;
    }
    
    const adminUser = users.find(u => u.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    
    // Get active moderators
    const { data: modSettings } = await supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', 'moderators')
        .single();
    
    const moderatorIds: string[] = (modSettings?.value || [])
        .filter((mod: any) => mod.status === 'active')
        .map((mod: any) => mod.userId);
    
    const recipientIds = new Set<string>();
    if (adminUser) {
        recipientIds.add(adminUser.id);
    }
    moderatorIds.forEach(id => recipientIds.add(id));

    if (recipientIds.size === 0) {
        console.error("No recipients found for platform notification.");
        return;
    }

    const notificationsToInsert = Array.from(recipientIds).map(id => ({
        user_id: id,
        ...notificationData
    }));
    
    const { error } = await supabaseAdmin.from('notifications').insert(notificationsToInsert);
    if (error) {
        console.error("Error adding platform notifications:", error);
    }
}

// Backwards compatibility
export const addAdminNotification = addPlatformNotification;


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
