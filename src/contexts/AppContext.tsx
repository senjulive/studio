'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useErrorBoundary } from '@/hooks/use-error-boundary';
import { useLoading } from '@/hooks/use-loading';

// Types
interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  verified: boolean;
  rank: string;
  tier: string;
}

interface WalletBalance {
  usdt: number;
  btc: number;
  eth: number;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  notifications: {
    push: boolean;
    email: boolean;
    trading: boolean;
  };
  trading: {
    autoMode: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    maxInvestment: number;
  };
}

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Wallet & Trading
  balance: WalletBalance;
  totalBalance: number;
  
  // UI State
  sidebarOpen: boolean;
  miniSidebarOpen: boolean;
  
  // Data
  notifications: Notification[];
  unreadCount: number;
  
  // Settings
  settings: AppSettings;
  
  // Network & Status
  isOnline: boolean;
  lastSync: Date | null;
}

// Action Types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_BALANCE'; payload: Partial<WalletBalance> }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_MINI_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  balance: { usdt: 0, btc: 0, eth: 0 },
  totalBalance: 0,
  sidebarOpen: false,
  miniSidebarOpen: false,
  notifications: [],
  unreadCount: 0,
  settings: {
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    notifications: {
      push: true,
      email: true,
      trading: true,
    },
    trading: {
      autoMode: false,
      riskLevel: 'medium',
      maxInvestment: 1000,
    },
  },
  isOnline: true,
  lastSync: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
        user: action.payload ? state.user : null,
      };
    
    case 'UPDATE_BALANCE':
      const newBalance = { ...state.balance, ...action.payload };
      return {
        ...state,
        balance: newBalance,
        totalBalance: newBalance.usdt + newBalance.btc + newBalance.eth,
      };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_MINI_SIDEBAR_OPEN':
      return { ...state, miniSidebarOpen: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
    
    case 'RESET_STATE':
      return { ...initialState, settings: state.settings };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Convenience methods
  setUser: (user: User | null) => void;
  updateBalance: (balance: Partial<WalletBalance>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  logout: () => void;
  
  // Loading and error states
  isLoading: (key: string) => boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  captureError: (error: Error, context?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [persistedSettings, setPersistedSettings] = useLocalStorage('astral-settings', initialState.settings);
  const [persistedUser, setPersistedUser] = useLocalStorage('astral-user', null);
  const { captureError } = useErrorBoundary();
  const { isLoading, startLoading, stopLoading } = useLoading([
    'auth', 'wallet', 'trading', 'notifications', 'settings'
  ]);

  // Load persisted data on mount
  useEffect(() => {
    try {
      if (persistedUser) {
        dispatch({ type: 'SET_USER', payload: persistedUser });
      }
      if (persistedSettings) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: persistedSettings });
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error('Failed to load persisted data'));
    }
  }, [persistedUser, persistedSettings, captureError]);

  // Persist user data when it changes
  useEffect(() => {
    setPersistedUser(state.user);
  }, [state.user, setPersistedUser]);

  // Persist settings when they change
  useEffect(() => {
    setPersistedSettings(state.settings);
  }, [state.settings, setPersistedSettings]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Convenience methods
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const updateBalance = (balance: Partial<WalletBalance>) => {
    dispatch({ type: 'UPDATE_BALANCE', payload: balance });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const fullNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const logout = () => {
    dispatch({ type: 'RESET_STATE' });
    setPersistedUser(null);
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setUser,
    updateBalance,
    addNotification,
    markNotificationRead,
    updateSettings,
    logout,
    isLoading,
    startLoading,
    stopLoading,
    captureError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
