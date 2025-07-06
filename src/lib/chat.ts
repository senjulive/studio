'use client';

const CHATS_STORAGE_KEY = 'astral-chats';

export type Message = {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'admin';
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

// Simulates sending a message. In a real app, this would go to a backend.
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
  };

  allChats[email].push(newMessage);
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(allChats));
  
  return newMessage;
}
