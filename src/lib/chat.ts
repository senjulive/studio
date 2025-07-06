'use client';

const CHATS_STORAGE_KEY = 'astral-chats';

export type Message = {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'admin';
  silent?: boolean;
};

export type ChatHistory = {
  [userEmail: string]: Message[];
};

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return fallback;
  }
}

// Simulates fetching all chats from a database. For admin use.
export async function getAllChats(): Promise<ChatHistory> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (typeof window === 'undefined') return {};
  const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
  return safeJsonParse(storedChats, {});
}

// Simulates fetching chat history for a single user.
export async function getChatHistoryForUser(email: string): Promise<Message[]> {
  const allChats = await getAllChats();
  return allChats[email] || [];
}

// Simulates sending a message from a user.
export async function sendMessage(email: string, text: string): Promise<Message> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (typeof window === 'undefined') {
    throw new Error('Cannot send message: not in a browser environment.');
  }

  const allChats = await getAllChats();
  if (!allChats[email]) {
    allChats[email] = [];
  }

  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random()}`,
    text,
    sender: 'user',
    timestamp: Date.now(),
    silent: false,
  };

  allChats[email].push(newMessage);
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(allChats));
  
  return newMessage;
}

// Simulates an admin sending a message to a user.
export async function sendAdminMessage(email: string, text: string): Promise<Message> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (typeof window === 'undefined') {
    throw new Error('Cannot send message: not in a browser environment.');
  }

  const allChats = await getAllChats();
  if (!allChats[email]) {
    allChats[email] = [];
  }

  const newMessage: Message = {
    id: `msg_${Date.now()}_${Math.random()}`,
    text,
    sender: 'admin',
    timestamp: Date.now(),
    silent: false,
  };

  allChats[email].push(newMessage);
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(allChats));
  
  return newMessage;
}


// Function for silent system notifications
export async function sendSystemNotification(email: string, text: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (typeof window === 'undefined') {
    return;
  }

  const allChats = await getAllChats();
  if (!allChats[email]) {
    allChats[email] = [];
  }

  const systemMessage: Message = {
    id: `sys_${Date.now()}_${Math.random()}`,
    text: `[System Alert] ${text}`,
    sender: 'admin',
    timestamp: Date.now(),
    silent: true,
  };

  allChats[email].push(systemMessage);
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(allChats));
}
