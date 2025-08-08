# 🚀 AstralCore - Modern Crypto Management Platform

[![CI/CD Pipeline](https://github.com/astralcore/crypto-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/astralcore/crypto-platform/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/astralcore/crypto-platform/branch/main/graph/badge.svg)](https://codecov.io/gh/astralcore/crypto-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools. Built with Next.js 15.3.3, TypeScript, and Builder.io integration.

## ✨ Features

- 🎯 **Modern UI/UX** - Glassmorphism design with dark/light themes
- 📱 **Mobile-First** - Responsive design optimized for all devices
- 🤖 **Trading Bots** - Automated trading with grid strategies
- 📊 **Real-time Analytics** - Live market data and portfolio tracking
- 🔐 **Enterprise Security** - Multi-layer security with encryption
- 🚀 **High Performance** - Optimized for speed and scalability
- 🌐 **Builder.io Integration** - Dynamic content management
- 🔄 **Real-time Updates** - Live data synchronization
- 💰 **Multi-Currency Support** - Bitcoin, Ethereum, USDT, and more
- 📈 **Advanced Charting** - Interactive trading charts
- 🛡️ **Risk Management** - Built-in risk assessment tools
- 📱 **PWA Ready** - Installable progressive web app

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3.3](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Content Management**: [Builder.io](https://builder.io/)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) with [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Testing**: [Jest](https://jestjs.io/) with [Testing Library](https://testing-library.com/)
- **Deployment**: [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.19.4 or later
- **npm**: 10.0.0 or later
- **Git**: Latest version

### 1. Clone the Repository

```bash
git clone https://github.com/astralcore/crypto-platform.git
cd crypto-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

**Required Environment Variables:**

```env
# Builder.io (Get from https://builder.io/account/organization)
BUILDER_PUBLIC_KEY=your_builder_public_key_here
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_public_key_here

# Google AI (Get from https://aistudio.google.com/app/apikey)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Security Keys (Generate random 32+ character strings)
NEXTAUTH_SECRET=your_super_secret_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key_here
API_SECRET_KEY=your_api_secret_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbopack (faster)
npm run genkit:dev       # Start AI development server

# Building
npm run build            # Build for production
npm run start            # Start production server
npm run export           # Export static files

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run typecheck        # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report

# Utilities
npm run clean            # Clean build files
npm run analyze          # Bundle analyzer
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fastralcore%2Fcrypto-platform)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add BUILDER_PUBLIC_KEY
   vercel env add GOOGLE_GENAI_API_KEY
   vercel env add NEXTAUTH_SECRET
   vercel env add ENCRYPTION_KEY
   vercel env add API_SECRET_KEY
   ```

### Deploy to Netlify

#### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/astralcore/crypto-platform)

#### Manual Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

4. **Set Environment Variables**
   Go to Site settings → Environment variables in Netlify dashboard and add:
   - `BUILDER_PUBLIC_KEY`
   - `GOOGLE_GENAI_API_KEY`
   - `NEXTAUTH_SECRET`
   - `ENCRYPTION_KEY`
   - `API_SECRET_KEY`

### Deploy with Docker

1. **Build Docker Image**
   ```bash
   docker build -t astralcore-app .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e BUILDER_PUBLIC_KEY=your_key \
     -e GOOGLE_GENAI_API_KEY=your_key \
     astralcore-app
   ```

3. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Builder.io Setup

1. Create a [Builder.io account](https://builder.io/signup)
2. Get your Public API Key from the [Account page](https://builder.io/account/organization)
3. Add the key to your environment variables:
   ```env
   BUILDER_PUBLIC_KEY=your_key_here
   NEXT_PUBLIC_BUILDER_API_KEY=your_key_here
   ```

### Google AI Setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to environment variables:
   ```env
   GOOGLE_GENAI_API_KEY=your_key_here
   ```

### Security Configuration

Generate secure keys for your environment:

```bash
# Generate 32-character encryption key
node -p "crypto.randomBytes(32).toString('hex')"

# Generate JWT secret
node -p "crypto.randomBytes(64).toString('hex')"
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           └── button.test.tsx
├── app/
│   └── api/
│       └── __tests__/
│           └── ping.test.ts
└── lib/
    └── __tests__/
        └── utils.test.ts
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build
```

### Performance Monitoring

The app includes built-in performance monitoring:

- **Web Vitals** tracking
- **Bundle size** optimization
- **Image optimization** with Next.js
- **Lazy loading** for components
- **Code splitting** automatic

### Lighthouse Scores

Target scores for production:
- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

## 🔒 Security

### Security Features

- **CSP Headers** - Content Security Policy
- **CSRF Protection** - Cross-Site Request Forgery
- **Rate Limiting** - API endpoint protection
- **Input Validation** - Zod schema validation
- **Data Encryption** - AES-256-GCM encryption
- **Secure Headers** - OWASP recommended headers

### Security Audit

```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm run security-check
```

## 📱 PWA Features

- **Offline Support** - Service worker caching
- **Install Prompt** - Add to home screen
- **Push Notifications** - Real-time updates
- **Background Sync** - Data synchronization
- **Responsive Design** - Mobile-first approach

## 🌐 SEO Optimization

### Built-in SEO Features

- **Meta Tags** - Dynamic Open Graph tags
- **Structured Data** - JSON-LD schema markup
- **Sitemap.xml** - Auto-generated sitemap
- **Robots.txt** - Search engine directives
- **Canonical URLs** - Duplicate content prevention

### SEO Configuration

```typescript
// next-seo.config.js
export default {
  title: 'AstralCore - Modern Crypto Management Platform',
  description: 'Professional cryptocurrency trading platform...',
  canonical: 'https://astralcore.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astralcore.app',
    siteName: 'AstralCore',
  },
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards

- **TypeScript** strict mode enabled
- **ESLint** with Next.js configuration
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Unit Tests** for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Builder.io](https://builder.io/) - Visual development platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

- **Documentation**: [https://docs.astralcore.app](https://docs.astralcore.app)
- **Issues**: [GitHub Issues](https://github.com/astralcore/crypto-platform/issues)
- **Email**: support@astralcore.app
- **Discord**: [Join our community](https://discord.gg/astralcore)

## 🔗 Links

- **Live Demo**: [https://astralcore.app](https://astralcore.app)
- **Documentation**: [https://docs.astralcore.app](https://docs.astralcore.app)
- **GitHub**: [https://github.com/astralcore/crypto-platform](https://github.com/astralcore/crypto-platform)
- **Twitter**: [@astralcore](https://twitter.com/astralcore)

---

<p align="center">
  Made with ❤️ by the AstralCore Team
</p>
