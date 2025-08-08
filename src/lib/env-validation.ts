import { z } from 'zod';

// Environment variable schema for validation
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  
  // Builder.io configuration
  BUILDER_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_BUILDER_API_KEY: z.string().optional(),
  BUILDER_PRIVATE_KEY: z.string().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Encryption
  ENCRYPTION_KEY: z.string().min(32).optional(),
  API_SECRET_KEY: z.string().min(32).optional(),
  
  // Google AI
  GOOGLE_GENAI_API_KEY: z.string().optional(),
  GENKIT_ENV: z.enum(['dev', 'prod']).default('dev'),
  
  // Firebase
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  
  // Public Firebase config
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  
  // Email services
  RESEND_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  
  // External APIs
  COINCAP_API_KEY: z.string().optional(),
  TWITTER_API_KEY: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_PWA: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_MAINTENANCE_MODE: z.string().transform(val => val === 'true').default('false'),
  
  // Rate limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  
  // Build configuration
  ANALYZE: z.string().transform(val => val === 'true').default('false'),
  BUILD_STANDALONE: z.string().transform(val => val === 'true').default('false'),
  BUILD_ID: z.string().optional(),
  
  // Development
  DEBUG: z.string().transform(val => val === 'true').default('false'),
  VERBOSE_LOGGING: z.string().transform(val => val === 'true').default('false'),
  
  // Webhooks
  WEBHOOK_SECRET: z.string().optional(),
  BUILDER_WEBHOOK_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter(issue => issue.code === 'invalid_type')
        .map(issue => issue.path.join('.'));
      
      const invalidVars = error.issues
        .filter(issue => issue.code !== 'invalid_type')
        .map(issue => `${issue.path.join('.')}: ${issue.message}`);
      
      let errorMessage = 'Environment variable validation failed:\n';
      
      if (missingVars.length > 0) {
        errorMessage += `Missing variables: ${missingVars.join(', ')}\n`;
      }
      
      if (invalidVars.length > 0) {
        errorMessage += `Invalid variables: ${invalidVars.join(', ')}\n`;
      }
      
      errorMessage += '\nPlease check your .env.local file and ensure all required variables are set correctly.';
      errorMessage += '\nRefer to .env.example for the complete list of available environment variables.';
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}

// Get validated environment variables
export const env = validateEnv();

// Helper function to check if we're in production
export const isProduction = env.NODE_ENV === 'production';

// Helper function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development';

// Helper function to get the app URL
export const getAppUrl = () => {
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'http://localhost:3000';
};

// Helper function to get API URL
export const getApiUrl = () => {
  if (env.NEXT_PUBLIC_API_URL) {
    return env.NEXT_PUBLIC_API_URL;
  }
  
  return `${getAppUrl()}/api`;
};

// Export specific configurations for easy access
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'AstralCore',
    url: getAppUrl(),
    apiUrl: getApiUrl(),
  },
  builder: {
    publicKey: env.BUILDER_PUBLIC_KEY || env.NEXT_PUBLIC_BUILDER_API_KEY,
    privateKey: env.BUILDER_PRIVATE_KEY,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL || getAppUrl(),
  },
  features: {
    pwa: env.NEXT_PUBLIC_ENABLE_PWA,
    analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    errorReporting: env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
    maintenanceMode: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },
  rateLimit: {
    requestsPerMinute: env.RATE_LIMIT_REQUESTS_PER_MINUTE,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
} as const;

// Validate environment on module load (only in production)
if (isProduction) {
  validateEnv();
}
