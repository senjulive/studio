
'use client';

import { readDb, writeDb } from './db';

const DB_FILE = 'chats.json';

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


const defaultChats: ChatHistory = {
    'mock-user-123': [
        { id: 'msg_1', text: 'Welcome to support! This is a mock chat system. Messages will not be saved.', timestamp: Date.now() - 10000, sender: 'admin' }
    ]
};

// Admin function: Fetches all chats from the mock store.
export async function getAllChats(): Promise<ChatHistory> {
  return await readDb(DB_FILE, defaultChats);
}

// Fetches chat history for a single user from the mock store.
export async function getChatHistoryForUser(userId: string): Promise<Message[]> {
  const chats = await getAllChats();
  return chats[userId] || [];
}

// Universal function to send a message to the mock store.
async function createMessage(userId: string, text: string, sender: 'user' | 'admin', silent: boolean, file?: Message['file']): Promise<Message> {
  const chats = await getAllChats();
  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    sender,
    timestamp: Date.now(),
    silent,
    file,
  };

  if (!chats[userId]) {
    chats[userId] = [];
  }
  chats[userId].push(newMessage);
  
  if (sender === 'user' && !silent) {
      const autoReply: Message = {
          id: `msg_${Date.now()}_reply`,
          text: "Thank you for your message. An admin will be with you shortly. (This is an automated reply)",
          sender: 'admin',
          timestamp: Date.now() + 1000 // ensure it appears after
      };
      chats[userId].push(autoReply);
  }
  
  await writeDb(DB_FILE, chats);

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
