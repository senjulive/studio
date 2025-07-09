
'use client';

// This file handles auth using a mock system as Supabase has been removed.
// It allows the app to function without a real database.

// We import the types but not the implementation from the removed package.
type User = {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email?: string;
  phone?: string;
  created_at: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  identities?: any[];
};

type Credentials = {
    email?: string;
    password?: string;
    phone?: string;
    options?: {
      emailRedirectTo?: string;
      data?: object;
    }
};


const mockUser: User = {
    id: 'mock-user-123',
    app_metadata: { provider: 'email' },
    user_metadata: { name: 'Mock User', username: 'MockUser' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'user@example.com',
};

export async function register(credentials: Credentials): Promise<User> {
    console.log('Mock register with:', credentials.email);
    // In a real app, you'd save the user. Here, we just simulate success.
    return Promise.resolve(mockUser);
}

export async function login(credentials: Credentials): Promise<User> {
    console.log('Mock login with:', credentials.email);
    // In a real app, you'd verify credentials. Here, we just simulate success.
    return Promise.resolve(mockUser);
}

export async function logout(): Promise<void> {
    console.log('Mock logout');
    // In a real app, you'd clear the session.
    return Promise.resolve();
}

export async function getCurrentUser(): Promise<User | null> {
    // Always return the mock user to simulate being logged in.
    return Promise.resolve(mockUser);
}


export async function resetPasswordForEmail(email: string): Promise<void> {
  console.log(`Mock reset password for: ${email}`);
  // In a real app, this would trigger an email.
  return Promise.resolve();
}
