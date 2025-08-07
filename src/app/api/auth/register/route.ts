import { NextRequest, NextResponse } from 'next/server';

const MOCK_ADMIN_EMAIL = "admin@astralcore.io";
const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, options } = body;

    console.log("Mock Registration Attempt for:", email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Registration failed. Please provide all required information." },
        { status: 400 }
      );
    }

    if (email === MOCK_ADMIN_EMAIL || email === MOCK_MODERATOR_EMAIL) {
      return NextResponse.json(
        { error: "This email is reserved. Please use a different email." },
        { status: 400 }
      );
    }

    // In a real app, you would create a user here.
    return NextResponse.json({ error: null });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
