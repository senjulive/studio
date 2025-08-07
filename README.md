# 🚀 AstralCore - AI-Powered Crypto Trading Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/astralcore-platform)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/astralcore-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.19.4-brightgreen)](https://nodejs.org/)

> Advanced cryptocurrency trading platform with AI-powered algorithms, real-time market analysis, and comprehensive portfolio management.

## ✨ Features

- 🤖 **AI Trading Bot** - Quantum algorithms for optimal trading strategies
- 📊 **Real-time Analytics** - Live market data and portfolio tracking
- 🔐 **Secure Authentication** - Multi-level user verification system
- 📱 **Mobile-first Design** - Responsive UI optimized for all devices
- 🌙 **Dark/Light Themes** - Advanced theme switching with system preferences
- 🏆 **Rewards System** - Gamified user engagement with tier progression
- 👥 **Squad System** - Referral and team management features
- 🛡️ **Admin Panel** - Comprehensive management and analytics dashboard
- ⚡ **High Performance** - Optimized for Core Web Vitals and fast loading

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **CMS**: [Builder.io](https://www.builder.io/) integration ready

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19.4 or higher
- npm, yarn, or pnpm

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/astralcore-platform.git
cd astralcore-platform
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Environment Setup

Copy the environment variables template:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure your environment variables in \`.env.local\`:

\`\`\`env
# Required for production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key

# Builder.io (optional)
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_api_key
BUILDER_PRIVATE_KEY=your_builder_private_key

# Database (optional)
DATABASE_URL=postgresql://username:password@host:port/database

# Add other variables as needed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **One-click deploy**: Click the "Deploy with Vercel" button above
2. **Manual deploy**:
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`
3. **Environment Variables**: Set up your environment variables in Vercel dashboard
4. **Domain**: Configure your custom domain in Vercel settings

### Deploy to Netlify

1. **One-click deploy**: Click the "Deploy to Netlify" button above
2. **Manual deploy**:
   \`\`\`bash
   npm run build
   \`\`\`
   Then drag the \`.next\` folder to Netlify
3. **Environment Variables**: Set up your environment variables in Netlify dashboard

### Deploy with Docker

\`\`\`bash
# Build the Docker image
docker build -t astralcore .

# Run the container
docker run -p 3000:3000 astralcore
\`\`\`

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| \`NEXT_PUBLIC_APP_URL\` | Public URL of your app | Yes | - |
| \`NEXTAUTH_SECRET\` | Secret for authentication | Yes | - |
| \`NEXT_PUBLIC_BUILDER_API_KEY\` | Builder.io API key | No | - |
| \`DATABASE_URL\` | Database connection string | No | - |
| \`SMTP_HOST\` | Email SMTP host | No | - |
| \`NEXT_PUBLIC_GA_ID\` | Google Analytics ID | No | - |

See \`.env.example\` for complete list.

## 🏗️ Project Structure

\`\`\`
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
��   ├── ui/                # Base UI components
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Dashboard components
│   └── icons/             # Custom icons
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
└── providers/             # Provider components

data/                      # Mock data (JSON files)
docs/                      # Documentation
public/                    # Static assets
\`\`\`

## 🎨 Customization

### Themes

The app supports dark/light themes with system preference detection:

\`\`\`tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  )
}
\`\`\`

### Adding New Pages

1. Create a new file in \`src/app/\`
2. Export a default React component
3. Add metadata for SEO:

\`\`\`tsx
export const metadata = {
  title: 'Your Page Title',
  description: 'Your page description',
}

export default function YourPage() {
  return <div>Your content</div>
}
\`\`\`

### API Routes

Create API endpoints in \`src/app/api/\`:

\`\`\`tsx
// src/app/api/example/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}
\`\`\`

## 🔧 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
npm run test         # Run tests
npm run build:analyze # Analyze bundle size
\`\`\`

### Code Quality

The project includes:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD
- **Pre-commit hooks** for code quality

### Testing

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:coverage
\`\`\`

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: < 500KB gzipped
- **Build Time**: < 2 minutes
- **Image Optimization**: Next.js Image component with WebP/AVIF

## 🔒 Security

- **HTTPS Only**: All connections encrypted
- **Security Headers**: CSP, HSTS, XSS protection
- **Input Validation**: Zod schemas for all forms
- **Rate Limiting**: API endpoint protection
- **Environment Variables**: Secure secret management

## 🌍 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized interfaces
- PWA capabilities with offline support
- iOS and Android tested

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit changes: \`git commit -m 'Add amazing feature'\`
4. Push to branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](./docs/) folder
- **Issues**: [GitHub Issues](https://github.com/your-username/astralcore-platform/issues)
- **Discord**: [Join our community](https://discord.gg/astralcore)
- **Email**: support@astralcore.io

## 🎯 Roadmap

- [ ] Multi-language support (i18n)
- [ ] Advanced trading algorithms
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] API marketplace
- [ ] Institutional features

## 📈 Analytics

The project includes:

- **Vercel Analytics** for performance monitoring
- **Speed Insights** for Core Web Vitals
- **Error Tracking** with Sentry (optional)
- **User Analytics** with Google Analytics (optional)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Builder.io](https://www.builder.io/) for CMS integration

---

Built with ❤️ by the AstralCore Team
