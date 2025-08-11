#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AstralCore Production Readiness Check\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
  },
  {
    name: 'Next.js config exists',
    check: () => fs.existsSync('next.config.mjs'),
  },
  {
    name: 'Netlify config exists',
    check: () => fs.existsSync('netlify.toml'),
  },
  {
    name: 'PWA manifest exists',
    check: () => fs.existsSync('public/manifest.webmanifest'),
  },
  {
    name: 'Robots.txt exists',
    check: () => fs.existsSync('public/robots.txt'),
  },
  {
    name: 'ESLint config exists',
    check: () => fs.existsSync('.eslintrc.json'),
  },
  {
    name: 'TypeScript config exists',
    check: () => fs.existsSync('tsconfig.json'),
  },
  {
    name: 'Environment example exists',
    check: () => fs.existsSync('.env.example'),
  },
  {
    name: 'README exists',
    check: () => fs.existsSync('README.md'),
  },
  {
    name: 'Error boundary implemented',
    check: () => fs.existsSync('src/components/ui/error-boundary.tsx'),
  },
  {
    name: '404 page exists',
    check: () => fs.existsSync('src/app/not-found.tsx'),
  },
  {
    name: 'Loading page exists',
    check: () => fs.existsSync('src/app/loading.tsx'),
  },
  {
    name: 'Sitemap exists',
    check: () => fs.existsSync('src/app/sitemap.ts'),
  },
  {
    name: 'App icon exists',
    check: () => fs.existsSync('src/app/icon.tsx'),
  },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check }) => {
  const result = check();
  if (result) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All checks passed! Your app is ready for production deployment.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please address the issues before deploying.');
  process.exit(1);
}
