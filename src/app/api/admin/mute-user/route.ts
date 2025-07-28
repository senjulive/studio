import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for muted users (in production, use a database)
let mutedUsers: Set<string> = new Set();

export async function POST(request: NextRequest) {
  try {
    const { userId, duration } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Add user to muted list
    mutedUsers.add(userId);

    // Optional: Set automatic unmute after duration (in minutes)
    if (duration && duration > 0) {
      setTimeout(() => {
        mutedUsers.delete(userId);
      }, duration * 60 * 1000); // Convert minutes to milliseconds
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${userId} has been muted`,
      duration: duration || 'indefinite'
    });

  } catch (error) {
    console.error('Error muting user:', error);
    return NextResponse.json(
      { error: 'Failed to mute user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove user from muted list
    mutedUsers.delete(userId);

    return NextResponse.json({ 
      success: true, 
      message: `User ${userId} has been unmuted` 
    });

  } catch (error) {
    console.error('Error unmuting user:', error);
    return NextResponse.json(
      { error: 'Failed to unmute user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      mutedUsers: Array.from(mutedUsers),
      count: mutedUsers.size
    });

  } catch (error) {
    console.error('Error getting muted users:', error);
    return NextResponse.json(
      { error: 'Failed to get muted users' },
      { status: 500 }
    );
  }
}
