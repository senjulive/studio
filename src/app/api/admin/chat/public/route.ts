
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

type ChatMessage = {
  id: string;
  // other properties...
};

async function readChatFile(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    return [];
  }
}

async function writeChatFile(data: ChatMessage[]): Promise<void> {
  await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const messages = await readChatFile();
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);

    if (messages.length === updatedMessages.length) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await writeChatFile(updatedMessages);

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
