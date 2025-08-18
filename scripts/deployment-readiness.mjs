#!/usr/bin/env node

/**
 * AstralCore Deployment Readiness Check
 * Validates project configuration before deployment
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class DeploymentChecker {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  success(message) {
    this.log(`✅ ${message}`, 'green');
  }

  warning(message) {
    this.log(`⚠️  ${message}`, 'yellow');
    this.warnings.push(message);
  }

  error(message) {
    this.log(`❌ ${message}`, 'red');
    this.errors.push(message);
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  // Check if required files exist
  checkRequiredFiles() {
    this.info('Checking required files...');

    const requiredFiles = [
      'package.json',
      'next.config.mjs',
      'tailwind.config.ts',
      'tsconfig.json',
      'netlify.toml',
      'vercel.json',
    ];

    requiredFiles.forEach(file => {
      const filePath = join(projectRoot, file);
      if (existsSync(filePath)) {
        this.success(`${file} exists`);
      } else {
        this.error(`${file} is missing`);
      }
    });
  }

  // Check package.json configuration
  checkPackageJson() {
    this.info('Checking package.json configuration...');

    try {
      const packagePath = join(projectRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

      // Check required scripts
      const requiredScripts = ['build', 'start', 'dev'];
      requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.success(`Script "${script}" is defined`);
        } else {
          this.error(`Script "${script}" is missing`);
        }
      });

      // Check essential dependencies
      const essentialDeps = ['next', 'react', 'react-dom'];
      essentialDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.success(`Dependency "${dep}" is installed`);
        } else {
          this.error(`Dependency "${dep}" is missing`);
        }
      });

      // Check for build optimization packages
      if (packageJson.devDependencies) {
        if (packageJson.devDependencies['@next/bundle-analyzer']) {
          this.success('Bundle analyzer is available');
        } else {
          this.warning(
            'Bundle analyzer not installed - consider adding for performance monitoring'
          );
        }
      }
    } catch (error) {
      this.error(`Failed to read package.json: ${error.message}`);
    }
  }

  // Check Next.js configuration
  checkNextConfig() {
    this.info('Checking Next.js configuration...');

    const configPath = join(projectRoot, 'next.config.mjs');
    if (existsSync(configPath)) {
      this.success('next.config.mjs exists');

      try {
        const configContent = readFileSync(configPath, 'utf8');

        // Check for important configurations
        if (configContent.includes('output:')) {
          this.success('Output configuration is set');
        } else {
          this.warning('Consider setting output configuration for deployment');
        }

        if (configContent.includes('headers:')) {
          this.success('Security headers are configured');
        } else {
          this.warning('Security headers not configured');
        }

        if (configContent.includes('images:')) {
          this.success('Image optimization is configured');
        } else {
          this.warning('Image optimization not configured');
        }
      } catch (error) {
        this.error(`Failed to read next.config.mjs: ${error.message}`);
      }
    }
  }

  // Check deployment configurations
  checkDeploymentConfigs() {
    this.info('Checking deployment configurations...');

    // Check Netlify config
    const netlifyPath = join(projectRoot, 'netlify.toml');
    if (existsSync(netlifyPath)) {
      this.success('Netlify configuration exists');

      try {
        const netlifyConfig = readFileSync(netlifyPath, 'utf8');
        if (netlifyConfig.includes('[build]')) {
          this.success('Netlify build configuration is set');
        } else {
          this.warning('Netlify build configuration may be incomplete');
        }
      } catch (error) {
        this.error(`Failed to read netlify.toml: ${error.message}`);
      }
    } else {
      this.warning('Netlify configuration is missing');
    }

    // Check Vercel config
    const vercelPath = join(projectRoot, 'vercel.json');
    if (existsSync(vercelPath)) {
      this.success('Vercel configuration exists');

      try {
        const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8'));
        if (vercelConfig.framework) {
          this.success(`Vercel framework is set to: ${vercelConfig.framework}`);
        } else {
          this.warning('Vercel framework not specified');
        }
      } catch (error) {
        this.error(`Failed to read vercel.json: ${error.message}`);
      }
    } else {
      this.warning('Vercel configuration is missing');
    }
  }

  // Check TypeScript configuration
  checkTypeScript() {
    this.info('Checking TypeScript configuration...');

    const tsconfigPath = join(projectRoot, 'tsconfig.json');
    if (existsSync(tsconfigPath)) {
      this.success('TypeScript configuration exists');

      try {
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

        if (tsconfig.compilerOptions) {
          if (tsconfig.compilerOptions.strict) {
            this.success('Strict mode is enabled');
          } else {
            this.warning('Consider enabling strict mode for better type checking');
          }

          if (tsconfig.compilerOptions.paths) {
            this.success('Path mapping is configured');
          } else {
            this.warning('Path mapping not configured');
          }
        }
      } catch (error) {
        this.error(`Failed to read tsconfig.json: ${error.message}`);
      }
    }
  }

  // Check environment setup
  checkEnvironment() {
    this.info('Checking environment setup...');

    // Check for environment files
    const envFiles = ['.env.local', '.env.production', '.env'];
    let hasEnvFile = false;

    envFiles.forEach(file => {
      if (existsSync(join(projectRoot, file))) {
        this.success(`Environment file ${file} exists`);
        hasEnvFile = true;
      }
    });

    if (!hasEnvFile) {
      this.warning(
        'No environment files found - make sure to set environment variables during deployment'
      );
    }
  }

  // Check security configurations
  checkSecurity() {
    this.info('Checking security configurations...');

    const nextConfigPath = join(projectRoot, 'next.config.mjs');
    if (existsSync(nextConfigPath)) {
      const config = readFileSync(nextConfigPath, 'utf8');

      if (config.includes('X-Frame-Options')) {
        this.success('X-Frame-Options header is configured');
      } else {
        this.warning('X-Frame-Options header not found');
      }

      if (config.includes('Content-Security-Policy')) {
        this.success('Content Security Policy is configured');
      } else {
        this.warning('Content Security Policy not configured');
      }

      if (config.includes('Strict-Transport-Security')) {
        this.success('HSTS header is configured');
      } else {
        this.warning('HSTS header not configured');
      }
    }
  }

  // Run all checks
  async runAllChecks() {
    this.log('\n🚀 AstralCore Deployment Readiness Check\n', 'cyan');
    this.log('='.repeat(50), 'cyan');

    this.checkRequiredFiles();
    this.checkPackageJson();
    this.checkNextConfig();
    this.checkDeploymentConfigs();
    this.checkTypeScript();
    this.checkEnvironment();
    this.checkSecurity();

    this.log('\n' + '='.repeat(50), 'cyan');
    this.log('\n📊 SUMMARY:', 'cyan');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.success('✨ All checks passed! Project is ready for deployment.');
      return true;
    } else {
      if (this.errors.length > 0) {
        this.log(`\n❌ ERRORS (${this.errors.length}):`, 'red');
        this.errors.forEach(error => this.log(`   • ${error}`, 'red'));
      }

      if (this.warnings.length > 0) {
        this.log(`\n⚠️  WARNINGS (${this.warnings.length}):`, 'yellow');
        this.warnings.forEach(warning => this.log(`   • ${warning}`, 'yellow'));
      }

      if (this.errors.length > 0) {
        this.error('\n🚫 Project has critical issues that must be fixed before deployment.');
        return false;
      } else {
        this.warning(
          '\n⚠️  Project has warnings but can be deployed. Consider addressing them for optimal performance.'
        );
        return true;
      }
    }
  }
}

// Run the deployment readiness check
const checker = new DeploymentChecker();
const isReady = await checker.runAllChecks();

process.exit(isReady ? 0 : 1);
