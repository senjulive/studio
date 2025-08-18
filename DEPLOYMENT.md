# AstralCore - Deployment Guide

Complete deployment guide for the AstralCore Crypto Trading Platform supporting Netlify, Vercel, and containerized deployments.

## 🚀 Quick Deploy

### One-Click Deployments

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/astralcore)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/astralcore)

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- Git
- A GitHub account (for CI/CD)

## 🔧 Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/astralcore.git
   cd astralcore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🌐 Platform Deployments

### Vercel Deployment

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
npm run deploy:vercel

# Deploy to production
vercel --prod
```

#### GitHub Integration
1. Connect your GitHub repository to Vercel
2. Import project in Vercel dashboard
3. Configure environment variables
4. Enable automatic deployments

#### Environment Variables (Vercel)
Set these in your Vercel dashboard under Settings → Environment Variables:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-key
DATABASE_URL=your-database-url
# ... other variables from .env.example
```

### Netlify Deployment

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link site (first time)
netlify link

# Deploy
npm run deploy:netlify

# Deploy to production
netlify deploy --prod --dir=.next
```

#### GitHub Integration
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables

#### Environment Variables (Netlify)
Set these in your Netlify dashboard under Site Settings → Environment Variables:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-key
DATABASE_URL=your-database-url
# ... other variables from .env.example
```

### Both Platforms (Simultaneous)
```bash
npm run deploy:both
```

## 🐳 Docker Deployment

### Build and Run
```bash
# Build Docker image
docker build -t astralcore .

# Run container
docker run -p 3000:3000 astralcore
```

### Docker Compose (Full Stack)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ⚙️ Configuration Files

### Key Configuration Files Created:

1. **netlify.toml** - Complete Netlify configuration
2. **vercel.json** - Complete Vercel configuration  
3. **next.config.mjs** - Enhanced Next.js configuration
4. **Dockerfile** - Container configuration
5. **docker-compose.yml** - Multi-service setup
6. **.github/workflows/deploy.yml** - CI/CD pipeline

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:

- ✅ Runs quality checks (TypeScript, ESLint)
- ✅ Builds the application
- ✅ Deploys to both Vercel and Netlify
- ✅ Runs Lighthouse performance tests
- ✅ Performs security scans
- ✅ Sends deployment notifications

### Required GitHub Secrets:

```bash
# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID  
VERCEL_PROJECT_ID

# Netlify
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID

# Optional
SLACK_WEBHOOK_URL
SNYK_TOKEN
```

## 🎯 Environment-Specific Deployments

### Production
```bash
npm run deploy -- --environment production
```

### Staging
```bash
npm run deploy:staging
```

### Preview (Pull Requests)
Automatic preview deployments are created for all pull requests on both platforms.

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```
GET /api/health
```

Returns application status, dependencies, and performance metrics.

### Performance Monitoring
- Lighthouse CI integration
- Core Web Vitals tracking
- Performance budgets enforced

### Error Tracking
- Sentry integration (optional)
- Automatic error reporting
- Performance monitoring

## 🔒 Security Features

### Security Headers
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy

### Crypto Platform Security
- Rate limiting on API endpoints
- Secure cookie handling
- CSRF protection
- Input validation and sanitization

## 🏗️ Build Optimizations

### Performance Features
- Automatic code splitting
- Image optimization
- Font optimization
- Bundle analysis
- Tree shaking
- Dead code elimination

### Crypto-Specific Optimizations
- Trading chart library optimization
- Real-time data handling
- WebSocket connection management
- Efficient crypto calculation libraries

## 🌍 SEO & PWA

### SEO Features
- Automatic sitemap generation
- Meta tags optimization
- Open Graph tags
- Twitter Cards
- Structured data

### PWA Features
- Service worker
- Offline functionality
- App manifest
- Push notifications
- Install prompts

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify API keys are valid

3. **Performance Issues**
   ```bash
   # Analyze bundle
   npm run build:analyze
   
   # Run Lighthouse
   npm run lighthouse
   ```

4. **Docker Issues**
   ```bash
   # Rebuild without cache
   docker build --no-cache -t astralcore .
   
   # Check logs
   docker logs container-name
   ```

## 📞 Support

### Platform Support
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Netlify**: [Netlify Documentation](https://docs.netlify.com)
- **Docker**: [Docker Documentation](https://docs.docker.com)

### Application Support
- Check GitHub Issues
- Review deployment logs
- Use health check endpoint for diagnostics

## 🎉 Success Checklist

After deployment, verify:

- [ ] Application loads successfully
- [ ] All routes are accessible
- [ ] API endpoints respond correctly
- [ ] Real-time features work
- [ ] Performance scores are acceptable
- [ ] Security headers are present
- [ ] PWA features function
- [ ] Mobile responsiveness
- [ ] Electric theme displays correctly

## 🔄 Updates & Maintenance

### Regular Maintenance
- Monitor performance metrics
- Update dependencies monthly
- Review security advisories
- Check deployment logs
- Verify backup procedures

### Version Updates
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Run tests
npm test

# Deploy updates
npm run deploy
```

---

## 🎯 Platform-Specific URLs

After deployment, your AstralCore platform will be available at:

- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **Custom Domain**: Configure in platform settings

Remember to update your environment variables with the correct URLs once deployed!
