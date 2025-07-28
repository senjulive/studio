'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { userStore, type User } from '@/lib/user-store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: Omit<User, 'hashedPassword'> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName?: string;
  contactNumber?: string;
  country?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Omit<User, 'hashedPassword'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = userStore.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = userStore.authenticate(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        
        // Remember email if requested
        if (rememberMe) {
          try {
            localStorage.setItem('astral-remembered-email', email);
          } catch (error) {
            console.warn('Failed to save remembered email:', error);
          }
        } else {
          try {
            localStorage.removeItem('astral-remembered-email');
          } catch (error) {
            console.warn('Failed to remove remembered email:', error);
          }
        }
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${result.user.username}`,
        });

        // Redirect based on role
        switch (result.user.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'moderator':
            router.push('/moderator');
            break;
          default:
            router.push('/dashboard');
            break;
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const result = userStore.register(userData);
      
      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        
        // Automatically log in the user (for demo purposes)
        const loginResult = userStore.authenticate(userData.email, userData.password);
        if (loginResult.success && loginResult.user) {
          setUser(loginResult.user);
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    userStore.logout();
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    router.push('/');
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const result = userStore.updateUser(user.id, updates);
      
      if (result.success) {
        const updatedUser = userStore.getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const result = userStore.changePassword(user.id, currentPassword, newPassword);
      
      if (result.success) {
        toast({
          title: "Password changed",
          description: "Your password has been successfully changed.",
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = userStore.requestPasswordReset(email);
      
      if (result.success) {
        toast({
          title: "Reset email sent",
          description: "If an account with this email exists, you will receive a password reset link.",
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Password reset failed' };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const verifyEmail = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const result = userStore.verifyEmail(user.id);
      
      if (result.success) {
        const updatedUser = userStore.getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
        
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified.",
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Email verification failed' };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
