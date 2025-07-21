import { generateAvatar, type GenerateAvatarInput } from '@/ai/flows/generate-avatar-flow';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as GenerateAvatarInput;
    if (!input.prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    const result = await generateAvatar(input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Avatar Generation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during avatar generation.' },
      { status: 500 }
    );
  }
}
