#!/usr/bin/env node

// Simple environment validation for production deployments

console.log('🔍 Checking environment configuration...\n');

const requiredVars = [
  'NODE_ENV',
];

const recommendedVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_BUILDER_API_KEY',
];

let issues = 0;

console.log('📋 Required Environment Variables:');
requiredVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar}: Set`);
  } else {
    console.log(`   ❌ ${envVar}: Missing`);
    issues++;
  }
});

console.log('\n💡 Recommended Environment Variables:');
recommendedVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar}: Configured`);
  } else {
    console.log(`   ⚠️  ${envVar}: Not set (using defaults)`);
  }
});

console.log('\n🔧 Environment Summary:');
console.log(`   Platform: ${process.env.NODE_ENV || 'development'}`);
console.log(`   App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);

if (process.env.VERCEL) {
  console.log(`   Deployment: Vercel`);
} else if (process.env.NETLIFY) {
  console.log(`   Deployment: Netlify`);
} else {
  console.log(`   Deployment: Local/Other`);
}

console.log('\n' + '='.repeat(50));

if (issues === 0) {
  console.log('✅ Environment validation passed!');
  console.log('🚀 Ready for deployment');
} else {
  console.log(`❌ Found ${issues} issues that need attention`);
  console.log('📝 Check .env.example for configuration guidance');
}

process.exit(issues > 0 ? 1 : 0);
