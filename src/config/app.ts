export const appConfig = {
  // App Information
  name: 'AstralCore',
  description: 'Your intelligent crypto management platform with advanced Grid Trading technology',
  version: '1.0.0',
  author: 'AstralCore Team',
  
  // URLs
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.astralcore.app',
  
  // Features
  features: {
    trading: true,
    wallet: true,
    squad: true,
    notifications: true,
    mobileApp: true,
    pwa: true,
    biometrics: false, // Future feature
    offlineMode: true,
  },
  
  // Limits
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024,  // 5MB
    requestTimeout: 30000, // 30 seconds
    maxRetries: 3,
    rateLimit: {
      requests: 100,
      window: 60000, // 1 minute
    },
  },
  
  // Performance
  performance: {
    enableServiceWorker: true,
    enableCodeSplitting: true,
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePreloading: true,
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes
  },
  
  // Security
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableCORS: true,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Analytics & Monitoring
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  
  // Social & External
  social: {
    twitter: 'https://twitter.com/astralcore',
    telegram: 'https://t.me/astralcore',
    discord: 'https://discord.gg/astralcore',
    github: 'https://github.com/astralcore',
  },
  
  // Contact
  contact: {
    email: 'support@astralcore.app',
    support: 'https://support.astralcore.app',
    docs: 'https://docs.astralcore.app',
  },
  
  // Theme
  theme: {
    defaultMode: 'dark',
    supportedModes: ['light', 'dark', 'auto'],
    colors: {
      primary: '#6e00ff',
      secondary: '#00f7ff',
      dark: '#0a0a1a',
      darker: '#050510',
      light: '#e0e0ff',
      success: '#00ff88',
      warning: '#ffaa00',
      danger: '#ff3860',
    },
  },
  
  // Mobile
  mobile: {
    enablePWA: true,
    enableNotifications: true,
    enableBiometrics: false,
    enableOfflineMode: true,
    enableSwipeGestures: true,
    minTouchTarget: 44, // 44px minimum touch target
    maxViewportWidth: 768,
  },
  
  // API Configuration
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    baseHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  
  // Storage
  storage: {
    prefix: 'astral_',
    encryption: false, // Enable for sensitive data
    compression: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  
  // Development
  dev: {
    showErrorDetails: process.env.NODE_ENV === 'development',
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enablePerformanceMonitoring: true,
    enableAccessibilityChecks: true,
  },
} as const;

export type AppConfig = typeof appConfig;

// Environment-specific overrides
export const getConfig = () => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return {
        ...appConfig,
        dev: {
          ...appConfig.dev,
          showErrorDetails: false,
          enableDebugLogs: false,
        },
        security: {
          ...appConfig.security,
          enableCSP: true,
          enableHSTS: true,
        },
      };
    
    case 'development':
      return {
        ...appConfig,
        security: {
          ...appConfig.security,
          enableCSP: false, // Disable for easier development
        },
      };
    
    default:
      return appConfig;
  }
};
