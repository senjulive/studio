#!/usr/bin/env node

/**
 * AstralCore Deployment Verification Script
 * Verifies that all critical files and configurations are ready for deployment
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'netlify.toml',
  '.env.example',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/lib/auth.ts',
  'data/web-pages.json',
  'data/users.json',
  'data/settings.json',
  'public/robots.txt',
  'public/sitemap.xml'
];

const requiredDirectories = [
  'src/app',
  'src/components',
  'src/lib',
  'data',
  'public'
];

const requiredApiRoutes = [
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/health/route.ts',
  'src/app/api/ping/route.ts'
];

const requiredPages = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/help/page.tsx',
  'src/app/faq/page.tsx'
];

console.log('🚀 AstralCore Deployment Verification\n');

let errors = 0;
let warnings = 0;

// Check required files
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    errors++;
  }
});

// Check required directories
console.log('\n📂 Checking required directories...');
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ Missing: ${dir}/`);
    errors++;
  }
});

// Check API routes
console.log('\n🔌 Checking API routes...');
requiredApiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ Missing: ${route}`);
    errors++;
  }
});

// Check pages
console.log('\n📄 Checking pages...');
requiredPages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ Missing: ${page}`);
    errors++;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'bcryptjs', 'jsonwebtoken', 'zod'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ Missing dependency: ${dep}`);
      errors++;
    }
  });
} catch (e) {
  console.log('❌ Error reading package.json');
  errors++;
}

// Check environment configuration
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync('.env.example')) {
  console.log('✅ .env.example exists');
} else {
  console.log('⚠️  .env.example missing (recommended for deployment guide)');
  warnings++;
}

// Check Netlify configuration
console.log('\n🌐 Checking Netlify configuration...');
try {
  const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
  if (netlifyToml.includes('npm run build:production')) {
    console.log('✅ Build command configured');
  } else {
    console.log('⚠️  Build command might need verification');
    warnings++;
  }
  
  if (netlifyToml.includes('.next')) {
    console.log('✅ Publish directory configured');
  } else {
    console.log('❌ Publish directory not configured');
    errors++;
  }
} catch (e) {
  console.log('❌ Error reading netlify.toml');
  errors++;
}

// Check data files
console.log('\n💾 Checking data files...');
const dataFiles = ['data/web-pages.json', 'data/users.json', 'data/settings.json'];
dataFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${file} - Valid JSON`);
  } catch (e) {
    console.log(`❌ ${file} - Invalid JSON or missing`);
    errors++;
  }
});

// Summary
console.log('\n📊 Verification Summary:');
console.log(`✅ Checks passed: ${requiredFiles.length + requiredDirectories.length + requiredApiRoutes.length + requiredPages.length - errors}`);
console.log(`❌ Errors: ${errors}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (errors === 0) {
  console.log('\n🎉 All critical checks passed! Ready for deployment.');
  console.log('\n📋 Deployment Checklist:');
  console.log('1. Set JWT_SECRET environment variable in Netlify');
  console.log('2. Update NEXT_PUBLIC_APP_URL to your domain');
  console.log('3. Push code to GitHub');
  console.log('4. Connect repository to Netlify');
  console.log('5. Deploy and test!');
  process.exit(0);
} else {
  console.log('\n❌ Deployment verification failed. Please fix the errors above.');
  process.exit(1);
}
