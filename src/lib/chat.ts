
'use client';

import { supabase } from '@/lib/supabase';

export type Message = {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'admin';
  silent?: boolean;
  file?: {
    name: string;
    type: string;
    dataUrl: string;
  };
};

export type ChatHistory = {
  [userId: string]: Message[];
};

// Admin function: Fetches all chats from the database.
export async function getAllChats(): Promise<ChatHistory> {
  const { data, error } = await supabase
    .from('chats')
    .select('user_id, message, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching all chats:", error);
    return {};
  }

  const chatHistory: ChatHistory = {};
  for (const row of data) {
    const userId = (row.user_id as any).toString();
    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }
    chatHistory[userId].push(row.message as Message);
  }
  return chatHistory;
}

// Fetches chat history for a single user.
export async function getChatHistoryForUser(userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('message')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error(`Error fetching chat history for ${userId}:`, error);
    return [];
  }

  return data ? data.map(row => row.message as Message) : [];
}

// Universal function to send a message.
async function createMessage(userId: string, text: string, sender: 'user' | 'admin', silent: boolean, file?: Message['file']): Promise<Message> {
  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    sender,
    timestamp: Date.now(),
    silent,
    file,
  };

  const { error } = await supabase.from('chats').insert({
    id: newMessage.id,
    user_id: userId,
    message: newMessage as any,
  });

  if (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message.');
  }

  return newMessage;
}


// Sends a message from a user.
export async function sendMessage(userId: string, text: string, file?: Message['file']): Promise<Message> {
  return createMessage(userId, text, 'user', false, file);
}

// Sends a message from an admin.
export async function sendAdminMessage(userId: string, text: string): Promise<Message> {
    return createMessage(userId, text, 'admin', false);
}

// Sends a silent system notification into the chat history.
export async function sendSystemNotification(userId:string, text:string): Promise<void>{
    await createMessage(userId, `[System Alert] ${text}`, 'admin', true);
}
