#!/usr/bin/env node

// Environment validation script for builds
import { validateEnv } from '../src/lib/env-validation.ts';

try {
  const env = validateEnv();
  console.log('✅ Environment validation passed');
  console.log(`Platform: ${env.NODE_ENV}`);
  
  if (env.NEXT_PUBLIC_BUILDER_API_KEY) {
    console.log('✅ Builder.io API key configured');
  } else {
    console.log('⚠️  Builder.io API key not set (using demo mode)');
  }
  
  process.exit(0);
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}
