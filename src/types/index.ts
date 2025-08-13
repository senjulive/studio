// Global TypeScript types for AstralCore

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  avatar?: string;
}

export interface TradingBot {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  isRunning: boolean;
  settings: TradingBotSettings;
  stats: TradingStats;
  lastActivity: string;
  uptime: number;
  errorMessage?: string;
}

export interface TradingBotSettings {
  riskLevel: number;
  autoReinvest: boolean;
  stopLoss: number;
  takeProfit: number;
  maxConcurrentTrades: number;
  tradingPairs: string[];
  minTradeAmount: number;
  maxTradeAmount: number;
}

export interface TradingStats {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  successRate: number;
  averageTradeTime: number;
  bestTrade: number;
  worstTrade: number;
}

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade';
  asset: string;
  amount: number;
  value: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  hash?: string;
  fee?: number;
}

export interface MarketData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface SquadClan {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  level: number;
  experience: number;
  avatar: string;
  isPublic: boolean;
  requirements?: {
    minLevel?: number;
    minProfit?: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalVolume: number;
  totalProfits: number;
  pendingVerifications: number;
  activeTickets: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface DeploymentInfo {
  platform: 'vercel' | 'netlify' | 'docker' | 'other';
  environment: string;
  appUrl: string;
  buildTime: string;
  version: string;
  nodeVersion: string;
  nextVersion: string;
  features: Record<string, boolean>;
  security: Record<string, boolean>;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  platform: string;
  memory: {
    used: number;
    total: number;
  };
  services: Record<string, {
    status: string;
    latency?: number;
  }>;
}

// Component prop types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Environment variables type
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_BUILDER_API_KEY?: string;
  DATABASE_URL?: string;
  REDIS_URL?: string;
  JWT_SECRET?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
}

// Utility types
export type Theme = 'light' | 'dark' | 'system';
export type Platform = 'vercel' | 'netlify' | 'docker' | 'other';
export type UserRole = 'user' | 'admin' | 'moderator';
export type BotStatus = 'running' | 'stopped' | 'paused' | 'error';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
