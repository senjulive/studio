#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Production deployment readiness checker
class DeploymentChecker {
  constructor() {
    this.checks = [];
    this.errors = [];
    this.warnings = [];
    this.passed = 0;
    this.total = 0;
  }

  check(name, description, checkFn) {
    this.total++;
    try {
      const result = checkFn();
      if (result.success) {
        this.passed++;
        this.checks.push({
          name,
          description,
          status: 'pass',
          message: result.message || 'OK'
        });
      } else {
        if (result.severity === 'error') {
          this.errors.push({ name, description, message: result.message });
        } else {
          this.warnings.push({ name, description, message: result.message });
        }
        this.checks.push({
          name,
          description,
          status: result.severity || 'error',
          message: result.message
        });
      }
    } catch (error) {
      this.errors.push({ name, description, message: error.message });
      this.checks.push({
        name,
        description,
        status: 'error',
        message: error.message
      });
    }
  }

  fileExists(filePath) {
    return fs.existsSync(path.join(process.cwd(), filePath));
  }

  runChecks() {
    console.log('🔍 Running deployment readiness checks...\n');

    // Core files check
    this.check(
      'Next.js Config',
      'next.config.mjs exists and is valid',
      () => {
        if (!this.fileExists('next.config.mjs')) {
          return { success: false, message: 'next.config.mjs not found' };
        }
        return { success: true, message: 'Configuration file present' };
      }
    );

    this.check(
      'Package.json',
      'package.json exists with required scripts',
      () => {
        if (!this.fileExists('package.json')) {
          return { success: false, message: 'package.json not found' };
        }
        
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredScripts = ['build', 'start', 'dev'];
        const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
        
        if (missingScripts.length > 0) {
          return { success: false, message: `Missing scripts: ${missingScripts.join(', ')}` };
        }
        
        return { success: true, message: 'All required scripts present' };
      }
    );

    // Deployment configurations
    this.check(
      'Vercel Config',
      'vercel.json exists for Vercel deployment',
      () => {
        if (!this.fileExists('vercel.json')) {
          return { success: false, severity: 'warning', message: 'vercel.json not found (optional)' };
        }
        return { success: true, message: 'Vercel configuration ready' };
      }
    );

    this.check(
      'Netlify Config',
      'netlify.toml exists for Netlify deployment',
      () => {
        if (!this.fileExists('netlify.toml')) {
          return { success: false, severity: 'warning', message: 'netlify.toml not found (optional)' };
        }
        return { success: true, message: 'Netlify configuration ready' };
      }
    );

    // Build artifacts
    this.check(
      'Build Directory',
      '.next directory exists (run npm run build)',
      () => {
        if (!this.fileExists('.next')) {
          return { success: false, message: 'No build found. Run npm run build first.' };
        }
        return { success: true, message: 'Build artifacts present' };
      }
    );

    // Environment setup
    this.check(
      'Environment Template',
      '.env.example exists for environment setup',
      () => {
        if (!this.fileExists('.env.example')) {
          return { success: false, severity: 'warning', message: 'No environment template found' };
        }
        return { success: true, message: 'Environment template available' };
      }
    );

    // Security files
    this.check(
      'Security Headers',
      'Security configuration in Next.js config',
      () => {
        const configPath = path.join(process.cwd(), 'next.config.mjs');
        if (!fs.existsSync(configPath)) {
          return { success: false, message: 'Next.js config not found' };
        }
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        if (!configContent.includes('headers:')) {
          return { success: false, severity: 'warning', message: 'No security headers configured' };
        }
        
        return { success: true, message: 'Security headers configured' };
      }
    );

    // Performance files
    this.check(
      'Performance Scripts',
      'Performance monitoring scripts available',
      () => {
        const perfScript = this.fileExists('scripts/performance-check.js');
        const bundleScript = this.fileExists('scripts/bundle-analyzer.mjs');
        
        if (!perfScript && !bundleScript) {
          return { success: false, severity: 'warning', message: 'No performance monitoring scripts' };
        }
        
        return { success: true, message: 'Performance monitoring available' };
      }
    );

    // Documentation
    this.check(
      'Documentation',
      'Deployment documentation exists',
      () => {
        const hasDeploymentMd = this.fileExists('DEPLOYMENT.md');
        const hasReadme = this.fileExists('README.md');
        
        if (!hasDeploymentMd && !hasReadme) {
          return { success: false, severity: 'warning', message: 'No documentation found' };
        }
        
        return { success: true, message: 'Documentation available' };
      }
    );

    // TypeScript setup
    this.check(
      'TypeScript Config',
      'tsconfig.json properly configured',
      () => {
        if (!this.fileExists('tsconfig.json')) {
          return { success: false, message: 'tsconfig.json not found' };
        }
        
        const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        if (!tsconfig.compilerOptions || !tsconfig.compilerOptions.paths) {
          return { success: false, severity: 'warning', message: 'TypeScript paths not configured' };
        }
        
        return { success: true, message: 'TypeScript properly configured' };
      }
    );

    // Git setup
    this.check(
      'Git Repository',
      'Git repository initialized',
      () => {
        if (!this.fileExists('.git')) {
          return { success: false, severity: 'warning', message: 'Not a git repository' };
        }
        return { success: true, message: 'Git repository ready' };
      }
    );

    // CI/CD
    this.check(
      'CI/CD Pipeline',
      'GitHub Actions workflow exists',
      () => {
        if (!this.fileExists('.github/workflows')) {
          return { success: false, severity: 'warning', message: 'No CI/CD workflows found' };
        }
        return { success: true, message: 'CI/CD pipeline configured' };
      }
    );

    // PWA setup
    this.check(
      'PWA Manifest',
      'Web app manifest exists',
      () => {
        const manifestExists = this.fileExists('public/manifest.webmanifest') || 
                              this.fileExists('public/manifest.json');
        
        if (!manifestExists) {
          return { success: false, severity: 'warning', message: 'No PWA manifest found' };
        }
        return { success: true, message: 'PWA manifest configured' };
      }
    );
  }

  printResults() {
    console.log('\n📊 Deployment Readiness Report\n');
    console.log('='.repeat(60));

    // Summary
    const successRate = Math.round((this.passed / this.total) * 100);
    console.log(`✅ Passed: ${this.passed}/${this.total} (${successRate}%)`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);

    // Overall status
    console.log('\n🎯 Overall Status:', this.getOverallStatus());

    // Detailed results
    console.log('\n📋 Detailed Results:');
    this.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`   ${icon} ${check.name}: ${check.message}`);
    });

    // Critical errors
    if (this.errors.length > 0) {
      console.log('\n🚨 Critical Issues:');
      this.errors.forEach(error => {
        console.log(`   ❌ ${error.name}: ${error.message}`);
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`   ⚠️  ${warning.name}: ${warning.message}`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('   🎉 Perfect! Your application is ready for production deployment.');
      console.log('   🚀 You can deploy to Vercel or Netlify with confidence.');
    } else if (this.errors.length === 0) {
      console.log('   ✅ Good to go! Address warnings for optimal deployment.');
      console.log('   🚀 Ready for production deployment.');
    } else {
      console.log('   🔧 Fix critical errors before deploying to production.');
      console.log('   📝 Follow the deployment guide for detailed instructions.');
    }

    // Quick commands
    console.log('\n🔧 Quick Commands:');
    console.log('   npm run build              # Build for production');
    console.log('   npm run performance:check  # Check bundle performance');
    console.log('   npm run deploy:vercel      # Deploy to Vercel');
    console.log('   npm run deploy:netlify     # Deploy to Netlify');

    console.log('\n' + '='.repeat(60));
  }

  getOverallStatus() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      return '🎯 EXCELLENT - Ready for production';
    } else if (this.errors.length === 0) {
      return '✅ GOOD - Ready with minor warnings';
    } else if (this.errors.length <= 2) {
      return '⚠️ NEEDS ATTENTION - Fix errors before deployment';
    } else {
      return '❌ NOT READY - Multiple issues to resolve';
    }
  }

  run() {
    this.runChecks();
    this.printResults();
    
    // Exit with appropriate code
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Run the checker
const checker = new DeploymentChecker();
checker.run();
