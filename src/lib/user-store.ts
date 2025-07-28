// Enhanced user store with localStorage persistence
'use client';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'moderator' | 'user';
  profile: {
    fullName: string;
    contactNumber: string;
    country: string;
    avatarUrl: string;
    verificationStatus: 'unverified' | 'pending' | 'verified';
  };
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  hashedPassword: string; // In real app, this would be properly hashed
  twoFactorEnabled: boolean;
}

export interface AuthSession {
  user: Omit<User, 'hashedPassword'>;
  token: string;
  expiresAt: string;
}

class UserStore {
  private readonly USERS_KEY = 'astral-users';
  private readonly SESSION_KEY = 'astral-session';
  private readonly SALT = 'astral-salt-2024'; // In production, use proper crypto

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    if (typeof window === 'undefined') return;
    
    const existingUsers = this.getAllUsers();
    if (existingUsers.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'admin-001',
          email: 'admin@astralcore.io',
          username: 'Administrator',
          role: 'admin',
          profile: {
            fullName: 'System Administrator',
            contactNumber: '+1234567890',
            country: 'United States',
            avatarUrl: '',
            verificationStatus: 'verified'
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          hashedPassword: this.hashPassword('admin'),
          emailVerified: true,
          twoFactorEnabled: false
        },
        {
          id: 'mod-001',
          email: 'moderator@astralcore.io',
          username: 'Moderator',
          role: 'moderator',
          profile: {
            fullName: 'System Moderator',
            contactNumber: '+1234567891',
            country: 'United States',
            avatarUrl: '',
            verificationStatus: 'verified'
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          hashedPassword: this.hashPassword('moderator'),
          emailVerified: true,
          twoFactorEnabled: false
        },
        {
          id: 'user-001',
          email: 'user@example.com',
          username: 'DemoUser',
          role: 'user',
          profile: {
            fullName: 'Demo User',
            contactNumber: '+1234567892',
            country: 'United States',
            avatarUrl: '',
            verificationStatus: 'unverified'
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          hashedPassword: this.hashPassword('password123'),
          emailVerified: false,
          twoFactorEnabled: false
        }
      ];

      this.saveUsers(defaultUsers);
    }
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - use bcrypt in production
    let hash = 0;
    const combined = password + this.SALT;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  private getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  private getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;
      
      const session: AuthSession = JSON.parse(stored);
      if (new Date(session.expiresAt) < new Date()) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch {
      return null;
    }
  }

  private setSession(session: AuthSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to set session:', error);
    }
  }

  private clearSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  public authenticate(email: string, password: string): { success: boolean; user?: Omit<User, 'hashedPassword'>; error?: string } {
    const users = this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const hashedPassword = this.hashPassword(password);
    if (user.hashedPassword !== hashedPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!user.emailVerified && user.role === 'user') {
      return { success: false, error: 'Please verify your email before logging in' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    // Create session
    const session: AuthSession = {
      user: { ...user, hashedPassword: undefined } as Omit<User, 'hashedPassword'>,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    this.setSession(session);

    return { success: true, user: session.user };
  }

  public register(userData: {
    email: string;
    password: string;
    username: string;
    fullName?: string;
    contactNumber?: string;
    country?: string;
    referralCode?: string;
  }): { success: boolean; user?: Omit<User, 'hashedPassword'>; error?: string } {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase(),
      username: userData.username,
      role: 'user',
      profile: {
        fullName: userData.fullName || '',
        contactNumber: userData.contactNumber || '',
        country: userData.country || '',
        avatarUrl: '',
        verificationStatus: 'unverified'
      },
      createdAt: new Date().toISOString(),
      lastLogin: '',
      isActive: true,
      hashedPassword: this.hashPassword(userData.password),
      emailVerified: false,
      twoFactorEnabled: false
    };

    users.push(newUser);
    this.saveUsers(users);

    // In a real app, send verification email here
    console.log(`Verification email would be sent to: ${userData.email}`);

    return { 
      success: true, 
      user: { ...newUser, hashedPassword: undefined } as Omit<User, 'hashedPassword'>
    };
  }

  public getCurrentUser(): Omit<User, 'hashedPassword'> | null {
    const session = this.getSession();
    return session?.user || null;
  }

  public isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  public logout(): void {
    this.clearSession();
  }

  public updateUser(userId: string, updates: Partial<User>): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    // Update session if it's the current user
    const session = this.getSession();
    if (session && session.user.id === userId) {
      session.user = { ...users[userIndex], hashedPassword: undefined } as Omit<User, 'hashedPassword'>;
      this.setSession(session);
    }

    return { success: true };
  }

  public changePassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const hashedCurrentPassword = this.hashPassword(currentPassword);
    if (user.hashedPassword !== hashedCurrentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    user.hashedPassword = this.hashPassword(newPassword);
    this.saveUsers(users);

    return { success: true };
  }

  public requestPasswordReset(email: string): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true };
    }

    // In a real app, generate reset token and send email
    const resetToken = this.generateToken();
    console.log(`Password reset email would be sent to: ${email} with token: ${resetToken}`);

    return { success: true };
  }

  public verifyEmail(userId: string): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex].emailVerified = true;
    this.saveUsers(users);

    return { success: true };
  }

  public getAllUsersForAdmin(): Omit<User, 'hashedPassword'>[] {
    return this.getAllUsers().map(user => {
      const { hashedPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  public toggleUserStatus(userId: string): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex].isActive = !users[userIndex].isActive;
    this.saveUsers(users);

    return { success: true };
  }
}

export const userStore = new UserStore();
