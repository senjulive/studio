
'use server';

import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { addPlatformNotification } from './notifications';
import { Buffer } from 'buffer';

export type Message = {
  id: string;
  user_id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'admin';
  silent?: boolean;
  file_url?: string;
};

export type ChatHistory = {
  [userId: string]: Message[];
};


// Admin function: Fetches all chats from Supabase.
export async function getAllChats(): Promise<ChatHistory> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: true });
    
    if (error) {
        console.error('Error fetching chats:', error);
        return {};
    }

    const chats: ChatHistory = {};
    for (const message of data) {
        if (!chats[message.user_id]) {
            chats[message.user_id] = [];
        }
        chats[message.user_id].push(message as Message);
    }

    return chats;
}

// Fetches chat history for a single user.
export async function getChatHistoryForUser(userId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });
    
    if (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
    return data as Message[];
}

// Universal function to send a message.
async function createMessage(
  userId: string,
  text: string,
  sender: 'user' | 'admin',
  silent: boolean,
  file_url?: string
): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('chat_messages')
        .insert({
            user_id: userId,
            text,
            sender,
            silent,
            file_url,
        });
    
    if (error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }

    if (sender === 'user' && !silent) {
        const { data: { user } } = await createClient().auth.getUser();

        // Notify admin of new message
        await addPlatformNotification({
            title: "New Support Message",
            content: `New message from ${user?.email}: "${text.substring(0, 50)}..."`,
            href: '/admin'
        });

        // Create an automated reply
        await supabase.from('chat_messages').insert({
            user_id: userId,
            text: "Thank you for your message. An admin will be with you shortly. (This is an automated reply)",
            sender: 'admin',
            silent: false,
        });
    }
}

// Sends a message from a user.
export async function sendMessage(
  userId: string,
  text: string,
  fileDataUrl?: string,
  fileName?: string,
  fileType?: string,
): Promise<void> {
  const supabase = createAdminClient();
  let file_url: string | undefined = undefined;

  if (fileDataUrl && fileName && fileType) {
    const filePath = `${userId}/${Date.now()}_${fileName}`;
    const base64 = fileDataUrl.split(',')[1];
    const { data, error } = await supabase.storage
      .from('chat_files')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType: fileType,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage.from('chat_files').getPublicUrl(data.path);
    file_url = publicUrl;
  }

  return createMessage(userId, text, 'user', false, file_url);
}

// Sends a message from an admin.
export async function sendAdminMessage(userId: string, text: string): Promise<void> {
    return createMessage(userId, text, 'admin', false);
}
