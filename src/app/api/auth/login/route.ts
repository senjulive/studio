import { NextRequest, NextResponse } from 'next/server';

const MOCK_ADMIN_EMAIL = "admin@astralcore.io";
const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";
const MOCK_ADMIN_PASS = "admin";
const MOCK_MODERATOR_PASS = "moderator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Mock Login Attempt with:", email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASS) {
      return NextResponse.json({ error: null, role: 'admin' });
    }

    if (email === MOCK_MODERATOR_EMAIL && password === MOCK_MODERATOR_PASS) {
      return NextResponse.json({ error: null, role: 'moderator' });
    }

    // Allow any other login for demo purposes
    if (email.includes('@')) {
      return NextResponse.json({ error: null, role: 'user' });
    }
    
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
