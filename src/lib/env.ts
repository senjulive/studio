import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Builder.io configuration
  NEXT_PUBLIC_BUILDER_API_KEY: z.string().optional(),
  BUILDER_PRIVATE_KEY: z.string().optional(),
  
  // Database configuration
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // API Keys
  NEXT_PUBLIC_COINAPI_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_AI_API_KEY: z.string().optional(),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  
  // Redis
  REDIS_URL: z.string().optional(),
  
  // Error monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  
  // File upload
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`❌ Invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type for the environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions for common environment checks
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Helper to get required environment variable with fallback
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    throw new Error(`❌ Environment variable ${key} is required but not set`);
  }
  return value || fallback || '';
}

// Helper to check if all required variables are set for production
export function checkProductionEnv() {
  if (!isProduction) return true;
  
  const requiredProdVars = [
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_SECRET',
  ];
  
  const missingVars = requiredProdVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required production environment variables: ${missingVars.join(', ')}`
    );
  }
  
  return true;
}

// Log environment configuration (without sensitive data)
export function logEnvConfig() {
  if (isDevelopment) {
    console.log('🔧 Environment Configuration:');
    console.log(`   NODE_ENV: ${env.NODE_ENV}`);
    console.log(`   APP_URL: ${env.NEXT_PUBLIC_APP_URL || 'Not set'}`);
    console.log(`   Builder.io: ${env.NEXT_PUBLIC_BUILDER_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   Database: ${env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`   Authentication: ${env.NEXTAUTH_SECRET ? '✅ Configured' : '❌ Not configured'}`);
  }
}
