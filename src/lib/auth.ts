import { redirect } from 'next/navigation';

type Credentials = {
    email?: string;
    password?: string;
    options?: any;
}

const MOCK_ADMIN_EMAIL = "admin@astralcore.io";
const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";
const MOCK_ADMIN_PASS = "admin";
const MOCK_MODERATOR_PASS = "moderator";

export async function login(credentials: Credentials) {
  console.log("Mock Login Attempt with:", credentials.email);
  
  if (!credentials.email || !credentials.password) {
      return { error: "Please provide both email and password." };
  }

  if (credentials.email === MOCK_ADMIN_EMAIL && credentials.password === MOCK_ADMIN_PASS) {
      return { error: null, role: 'admin' };
  }

  if (credentials.email === MOCK_MODERATOR_EMAIL && credentials.password === MOCK_MODERATOR_PASS) {
      return { error: null, role: 'moderator' };
  }

  // Allow any other login for demo purposes
  if (credentials.email.includes('@')) {
      return { error: null, role: 'user' };
  }
  
  return { error: "Invalid credentials" };
}

export async function register(credentials: Credentials) {
  console.log("Mock Registration Attempt for:", credentials.email);
  
  if (credentials.email && credentials.password) {
    if (credentials.email === MOCK_ADMIN_EMAIL || credentials.email === MOCK_MODERATOR_EMAIL) {
        return { error: "This email is reserved. Please use a different email." };
    }
    // In a real app, you would create a user here.
    return { error: null };
  }
  return { error: 'Registration failed. Please provide all required information.' };
}

export async function logout() {
  // In a real app, you would clear the session/token here.
  // For the mock app, we just clear session storage and redirect.
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
  console.log("Mock Password Reset requested for:", email);
  // In a real app, you would trigger a password reset flow (e.g., send an email).
  // For this demo, we just log the request and return success.
  return null;
}
