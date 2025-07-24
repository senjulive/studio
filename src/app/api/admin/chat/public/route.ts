
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const PUBLIC_CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

async function readPublicChat() {
  try {
    const data = await fs.readFile(PUBLIC_CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writePublicChat(data: any[]) {
  await fs.writeFile(PUBLIC_CHAT_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}


export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const messages = await readPublicChat();
    const updatedMessages = messages.filter((msg: any) => msg.id !== messageId);
    
    await writePublicChat(updatedMessages);

    return NextResponse.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
