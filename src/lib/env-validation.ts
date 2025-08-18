import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  
  // Builder.io
  NEXT_PUBLIC_BUILDER_API_KEY: z.string().min(1).optional(),
  
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32).optional(),
  
  // Admin credentials
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  
  // API Keys
  GOOGLE_AI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  COINCAP_API_KEY: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  
  // Email
  SENDGRID_API_KEY: z.string().optional(),
  
  // Platform detection
  VERCEL: z.string().optional(),
  NETLIFY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type')
        .map(err => err.path.join('.'))
        .join(', ');
      
      console.warn(`⚠️ Environment validation warnings: ${missingVars}`);
      
      // Return parsed environment with defaults
      return envSchema.parse(process.env);
    }
    throw error;
  }
}

// Get deployment platform
export function getDeploymentPlatform(): 'vercel' | 'netlify' | 'docker' | 'other' {
  if (process.env.VERCEL) return 'vercel';
  if (process.env.NETLIFY) return 'netlify';
  if (process.env.DOCKER) return 'docker';
  return 'other';
}

// Check if running in production
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Check if running in development
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Get app URL based on environment
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  const platform = getDeploymentPlatform();
  
  switch (platform) {
    case 'vercel':
      return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    case 'netlify':
      return process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:3000';
    default:
      return 'http://localhost:3000';
  }
}

// Export validated environment
export const env = validateEnv();
