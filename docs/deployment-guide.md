# 🚀 Deployment Guide

This guide covers deployment to Vercel and Netlify with troubleshooting for common issues.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All TypeScript errors are resolved (\`npm run typecheck\`)
- [ ] ESLint passes without errors (\`npm run lint\`)
- [ ] Build completes successfully (\`npm run build\`)
- [ ] Environment variables are configured
- [ ] Node.js version matches (.nvmrc: 20.19.4)
- [ ] No secrets committed to repository

## 🔧 Vercel Deployment

### Automatic Deployment

1. Connect your Git repository to Vercel
2. Vercel will automatically detect Next.js
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

### Vercel Configuration

The \`vercel.json\` file includes:

- Build settings
- Function configurations
- Security headers
- Redirects and rewrites
- Caching policies

### Environment Variables for Vercel

Set these in Vercel dashboard:

\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-key
DATABASE_URL=your-database-url
\`\`\`

## 🌐 Netlify Deployment

### Automatic Deployment

1. Connect your Git repository to Netlify
2. Configure build settings:
   - Build command: \`npm run build\`
   - Publish directory: \`.next\`
3. Install Next.js plugin
4. Deploy!

### Manual Deployment

\`\`\`bash
# Build the project
npm run build

# Deploy to Netlify (using drag & drop or CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=.next
\`\`\`

### Netlify Configuration

The \`netlify.toml\` file includes:

- Build settings
- Plugin configuration
- Security headers
- Redirects and rewrites
- Edge functions

### Environment Variables for Netlify

Set these in Netlify dashboard:

\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-key
DATABASE_URL=your-database-url
NODE_VERSION=20.19.4
\`\`\`

## 🐛 Common Issues & Solutions

### Build Failures

#### TypeScript Errors

**Problem**: Build fails due to TypeScript errors
**Solution**:
\`\`\`bash
# Check for errors locally
npm run typecheck

# Fix errors and retry
npm run build
\`\`\`

#### Missing Dependencies

**Problem**: Module not found errors
**Solution**:
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use specific package manager
yarn install --frozen-lockfile
\`\`\`

#### Build Timeout

**Problem**: Build times out on platform
**Solution**:
- Reduce bundle size
- Optimize dependencies
- Use build caching
- Consider build parallelization

### Runtime Errors

#### Environment Variables Not Found

**Problem**: Environment variables undefined in production
**Solution**:
1. Verify variables are set in platform dashboard
2. Check variable names (case-sensitive)
3. Restart deployment after adding variables
4. For client-side variables, ensure \`NEXT_PUBLIC_\` prefix

#### API Routes Failing

**Problem**: API routes return 404 or 500 errors
**Solution**:
1. Check API route file structure
2. Verify export names (\`GET\`, \`POST\`, etc.)
3. Check function timeout settings
4. Review server logs

#### Image Optimization Issues

**Problem**: Images not loading or optimizing
**Solution**:
1. Configure \`next.config.mjs\` image domains
2. Use proper image formats (WebP, AVIF)
3. Check image paths and imports

### Platform-Specific Issues

#### Vercel Issues

**Memory Limit Exceeded**:
\`\`\`javascript
// next.config.mjs
module.exports = {
  experimental: {
    // Increase memory limit for build
    workerThreads: false,
    cpus: 1
  }
}
\`\`\`

**Function Timeout**:
\`\`\`json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
\`\`\`

#### Netlify Issues

**Next.js Plugin Missing**:
\`\`\`toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

**Build Command Issues**:
\`\`\`toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
\`\`\`

## 🔍 Debugging Deployment

### Build Logs Analysis

1. **Check build output** for errors and warnings
2. **Review dependency installation** logs
3. **Look for memory usage** spikes
4. **Check file sizes** and bundle analysis

### Runtime Debugging

1. **Enable error tracking** (Sentry, LogRocket)
2. **Check browser console** for client errors
3. **Monitor API responses** for server errors
4. **Use platform monitoring** tools

### Performance Monitoring

1. **Core Web Vitals** tracking
2. **Lighthouse audits** on deployed site
3. **Bundle size analysis** with @next/bundle-analyzer
4. **Runtime performance** monitoring

## 📊 Performance Optimization

### Bundle Size Optimization

\`\`\`bash
# Analyze bundle size
npm run build:analyze

# Check for duplicate dependencies
npm ls --depth=0

# Remove unused dependencies
npm uninstall unused-package
\`\`\`

### Image Optimization

\`\`\`javascript
// next.config.mjs
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  }
}
\`\`\`

### Caching Strategy

\`\`\`javascript
// API routes caching
export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate'
    }
  })
}
\`\`\`

## 🔒 Security Configuration

### Security Headers

Both platforms include security headers via configuration:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

### Environment Security

1. **Never commit secrets** to repository
2. **Use platform-specific** environment variable storage
3. **Rotate secrets** regularly
4. **Limit API key** permissions

## 📈 Monitoring & Analytics

### Performance Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Netlify Analytics**: Traffic and performance insights
- **Google Analytics**: User behavior tracking
- **Sentry**: Error monitoring and debugging

### Health Checks

Set up monitoring for:

- **Uptime monitoring**
- **API endpoint health**
- **Database connectivity**
- **Third-party service status**

## 🚀 Advanced Deployment

### Custom Domains

**Vercel**:
1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL automatically provisioned

**Netlify**:
1. Add domain in Netlify dashboard
2. Update nameservers or DNS records
3. SSL automatically provisioned

### Preview Deployments

Both platforms support:
- **Branch previews** for feature development
- **Pull request previews** for code review
- **Deploy previews** for testing

### CI/CD Integration

The included GitHub Actions workflow provides:
- **Automated testing** on pull requests
- **Build verification** before deployment
- **Security scanning** with Trivy
- **Lighthouse audits** on deployment

## 📞 Getting Help

If you encounter issues not covered here:

1. **Check platform status** pages
2. **Review platform documentation**
3. **Search community forums**
4. **Create support tickets**
5. **Join our Discord** for community help

---

Happy deploying! 🎉
