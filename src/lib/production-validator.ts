// Production configuration validator for AstralCore

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: ValidationIssue[];
  recommendations: string[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  fix?: string;
}

export class ProductionValidator {
  private issues: ValidationIssue[] = [];
  private score = 100;

  validate(): ValidationResult {
    this.issues = [];
    this.score = 100;

    // Core configuration checks
    this.validateEnvironmentVariables();
    this.validateSecurityConfiguration();
    this.validatePerformanceSettings();
    this.validateMonitoring();
    this.validateDeploymentSettings();
    this.validateDependencies();

    const isValid = !this.issues.some(issue => issue.severity === 'error');
    const recommendations = this.generateRecommendations();

    return {
      isValid,
      score: Math.max(0, this.score),
      issues: this.issues,
      recommendations,
    };
  }

  private validateEnvironmentVariables() {
    const requiredEnvVars = [
      'NODE_ENV',
      'NEXT_PUBLIC_APP_URL',
    ];

    const optionalButRecommended = [
      'NEXT_PUBLIC_BUILDER_API_KEY',
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SECRET',
    ];

    // Check required variables
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        this.addIssue('error', 'Environment', `Missing required environment variable: ${envVar}`);
      }
    }

    // Check recommended variables
    for (const envVar of optionalButRecommended) {
      if (!process.env[envVar]) {
        this.addIssue('warning', 'Environment', `Recommended environment variable missing: ${envVar}`, 
          `Set ${envVar} for full functionality`);
      }
    }

    // Validate NODE_ENV
    if (process.env.NODE_ENV !== 'production') {
      this.addIssue('warning', 'Environment', 'NODE_ENV is not set to production');
    }

    // Validate URLs
    if (process.env.NEXT_PUBLIC_APP_URL && !this.isValidUrl(process.env.NEXT_PUBLIC_APP_URL)) {
      this.addIssue('error', 'Environment', 'NEXT_PUBLIC_APP_URL is not a valid URL');
    }
  }

  private validateSecurityConfiguration() {
    // Check HTTPS enforcement
    if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
      this.addIssue('warning', 'Security', 'Application URL should use HTTPS in production');
    }

    // Check JWT secret strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      this.addIssue('error', 'Security', 'JWT_SECRET should be at least 32 characters long');
    }

    // Check for development secrets in production
    const devSecrets = ['demo-key', 'test-key', 'development', 'localhost'];
    Object.entries(process.env).forEach(([key, value]) => {
      if (key.includes('KEY') || key.includes('SECRET')) {
        if (value && devSecrets.some(secret => value.toLowerCase().includes(secret))) {
          this.addIssue('error', 'Security', `Development secret detected in ${key}`);
        }
      }
    });
  }

  private validatePerformanceSettings() {
    // Check Next.js configuration (this would need to be adapted for actual config reading)
    this.addIssue('info', 'Performance', 'Ensure Next.js is configured with compression and optimization');
    
    // Memory usage check
    const memUsage = process.memoryUsage();
    const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    if (memPercentage > 85) {
      this.addIssue('warning', 'Performance', 'High memory usage detected');
    }
  }

  private validateMonitoring() {
    const monitoringVars = [
      'SENTRY_DSN',
      'NEW_RELIC_LICENSE_KEY',
      'NEXT_PUBLIC_GA_ID',
    ];

    const hasMonitoring = monitoringVars.some(envVar => process.env[envVar]);
    
    if (!hasMonitoring) {
      this.addIssue('warning', 'Monitoring', 'No monitoring tools configured', 
        'Configure error tracking and analytics for production');
    }
  }

  private validateDeploymentSettings() {
    const platform = this.getDeploymentPlatform();
    
    if (platform === 'unknown') {
      this.addIssue('warning', 'Deployment', 'Deployment platform not detected');
    }

    // Platform-specific validations
    if (platform === 'vercel') {
      this.validateVercelSettings();
    } else if (platform === 'netlify') {
      this.validateNetlifySettings();
    }
  }

  private validateVercelSettings() {
    // Vercel-specific checks
    if (!process.env.VERCEL_URL && process.env.VERCEL) {
      this.addIssue('warning', 'Deployment', 'Running on Vercel but VERCEL_URL not set');
    }
  }

  private validateNetlifySettings() {
    // Netlify-specific checks
    if (!process.env.URL && process.env.NETLIFY) {
      this.addIssue('warning', 'Deployment', 'Running on Netlify but URL not set');
    }
  }

  private validateDependencies() {
    // This would need package.json reading in a real implementation
    this.addIssue('info', 'Dependencies', 'Ensure all dependencies are up to date and security-audited');
  }

  private addIssue(severity: 'error' | 'warning' | 'info', category: string, message: string, fix?: string) {
    this.issues.push({ severity, category, message, fix });
    
    // Deduct points based on severity
    switch (severity) {
      case 'error':
        this.score -= 20;
        break;
      case 'warning':
        this.score -= 10;
        break;
      case 'info':
        this.score -= 2;
        break;
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const errorCount = this.issues.filter(i => i.severity === 'error').length;
    const warningCount = this.issues.filter(i => i.severity === 'warning').length;
    
    if (errorCount > 0) {
      recommendations.push('Fix all error-level issues before deploying to production');
    }
    
    if (warningCount > 5) {
      recommendations.push('Address warning-level issues for optimal production deployment');
    }
    
    if (this.score >= 90) {
      recommendations.push('Excellent configuration! Ready for production deployment');
    } else if (this.score >= 75) {
      recommendations.push('Good configuration with minor improvements needed');
    } else if (this.score >= 60) {
      recommendations.push('Configuration needs attention before production deployment');
    } else {
      recommendations.push('Significant configuration issues must be resolved');
    }
    
    // Specific recommendations based on issues
    const categories = [...new Set(this.issues.map(i => i.category))];
    
    if (categories.includes('Security')) {
      recommendations.push('Review and strengthen security configuration');
    }
    
    if (categories.includes('Performance')) {
      recommendations.push('Optimize performance settings for production load');
    }
    
    if (categories.includes('Monitoring')) {
      recommendations.push('Set up comprehensive monitoring and alerting');
    }
    
    return recommendations;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getDeploymentPlatform(): string {
    if (process.env.VERCEL) return 'vercel';
    if (process.env.NETLIFY) return 'netlify';
    if (process.env.DOCKER) return 'docker';
    return 'unknown';
  }
}

// Export a simple function for easy use
export function validateProductionConfig(): ValidationResult {
  const validator = new ProductionValidator();
  return validator.validate();
}

// Export validation categories for reference
export const VALIDATION_CATEGORIES = {
  ENVIRONMENT: 'Environment',
  SECURITY: 'Security', 
  PERFORMANCE: 'Performance',
  MONITORING: 'Monitoring',
  DEPLOYMENT: 'Deployment',
  DEPENDENCIES: 'Dependencies',
} as const;
