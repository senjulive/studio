// Mock authentication functions for the crypto trading platform

export interface User {
  id: string;
  email: string;
  username?: string;
  isAdmin?: boolean;
  isModerator?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
  confirmPassword: string;
}

// Mock login function
export async function login(credentials: LoginCredentials): Promise<{ user?: User; error?: string }> {
  const { email, password } = credentials;
  
  // Mock validation
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  // Mock user data
  const mockUsers: Record<string, { password: string; user: User }> = {
    'admin@astralcore.io': {
      password: 'admin123',
      user: {
        id: 'admin-001',
        email: 'admin@astralcore.io',
        username: 'Admin',
        isAdmin: true,
      }
    },
    'moderator@astralcore.io': {
      password: 'mod123',
      user: {
        id: 'mod-001',
        email: 'moderator@astralcore.io',
        username: 'Moderator',
        isModerator: true,
      }
    },
    'user@example.com': {
      password: 'user123',
      user: {
        id: 'user-001',
        email: 'user@example.com',
        username: 'User',
      }
    }
  };
  
  const userData = mockUsers[email];
  if (!userData || userData.password !== password) {
    return { error: 'Invalid email or password' };
  }
  
  return { user: userData.user };
}

// Mock register function
export async function register(credentials: RegisterCredentials): Promise<{ user?: User; error?: string }> {
  const { email, password, confirmPassword, username } = credentials;
  
  // Mock validation
  if (!email || !password || !confirmPassword) {
    return { error: 'All fields are required' };
  }
  
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }
  
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }
  
  // Check if user already exists (mock)
  if (email === 'admin@astralcore.io' || email === 'moderator@astralcore.io') {
    return { error: 'User already exists' };
  }
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    username: username || email.split('@')[0],
  };
  
  return { user: newUser };
}

// Mock logout function
export async function logout(): Promise<{ success: boolean; error?: string }> {
  // Mock logout logic
  return { success: true };
}

// Mock session check
export async function getSession(): Promise<{ user?: User; error?: string }> {
  // Mock session retrieval - in real app this would check JWT/session storage
  const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('loggedInEmail') : null;
  
  if (!storedEmail) {
    return { error: 'No session found' };
  }
  
  // Return mock user based on stored email
  return {
    user: {
      id: 'mock-user-123',
      email: storedEmail,
      username: storedEmail.split('@')[0],
      isAdmin: storedEmail === 'admin@astralcore.io',
      isModerator: storedEmail === 'moderator@astralcore.io',
    }
  };
}

// Mock password reset
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!email) {
    return { success: false, error: 'Email is required' };
  }
  
  // Mock sending reset email
  return { success: true };
}

// Mock token verification
export async function verifyToken(token: string): Promise<{ user?: User; error?: string }> {
  if (!token) {
    return { error: 'Token is required' };
  }
  
  // Mock token verification
  return {
    user: {
      id: 'mock-user-123',
      email: 'user@example.com',
      username: 'User',
    }
  };
}
