import { NextResponse } from 'next/server';
import { getDeploymentPlatform, getAppUrl, env } from '@/lib/env-validation';

export async function GET() {
  const platform = getDeploymentPlatform();
  const appUrl = getAppUrl();
  
  const deploymentInfo = {
    platform,
    environment: env.NODE_ENV,
    appUrl,
    buildTime: process.env.CUSTOM_BUILD_TIME || new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    nodeVersion: process.version,
    nextVersion: require('next/package.json').version,
    
    // Platform-specific information
    ...(platform === 'vercel' && {
      vercelUrl: process.env.VERCEL_URL,
      vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
      vercelGitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE,
      vercelGitCommitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME,
      vercelRegion: process.env.VERCEL_REGION,
    }),
    
    ...(platform === 'netlify' && {
      netlifyUrl: process.env.URL,
      netlifyDeployUrl: process.env.DEPLOY_PRIME_URL,
      netlifyCommitRef: process.env.COMMIT_REF,
      netlifyContext: process.env.CONTEXT,
      netlifyBranch: process.env.BRANCH,
    }),
    
    features: {
      builderIO: !!env.NEXT_PUBLIC_BUILDER_API_KEY,
      database: !!env.DATABASE_URL,
      redis: !!env.REDIS_URL,
      monitoring: !!(env.SENTRY_DSN || env.NEW_RELIC_LICENSE_KEY),
      email: !!env.SENDGRID_API_KEY,
      ai: !!(env.GOOGLE_AI_API_KEY || env.OPENAI_API_KEY),
    },
    
    security: {
      httpsEnforced: appUrl.startsWith('https://'),
      jwtConfigured: !!env.JWT_SECRET,
      adminConfigured: !!(env.ADMIN_EMAIL && env.ADMIN_PASSWORD),
    },
  };
  
  return NextResponse.json(deploymentInfo, {
    headers: {
      'Cache-Control': 'public, max-age=300', // 5 minutes
    },
  });
}
