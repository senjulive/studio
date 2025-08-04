# 🚀 AstralCore - Quantum Trading Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

A cutting-edge quantum trading platform built with Next.js 15, featuring advanced AI-powered trading algorithms, real-time market analysis, and comprehensive user management.

## ✨ Features

### 🎯 **Core Features**
- **Quantum AI Trading** - Advanced algorithms for autonomous trading
- **Multi-Tier System** - Recruit to Diamond tier progression
- **Real-time Dashboard** - Live trading data and analytics
- **Squad System** - Team collaboration and shared strategies
- **Admin Panel** - Complete platform management
- **Web Page Editor** - Dynamic content management system

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - User, Moderator, Admin roles
- **Email Verification** - Account verification system
- **Password Reset** - Secure password recovery

### 📱 **User Experience**
- **Responsive Design** - Mobile-first approach
- **Progressive Web App** - App-like experience
- **Dark Theme** - Quantum-inspired design system
- **Loading States** - Smooth user interactions
- **Error Handling** - Comprehensive error management

## 🚀 Quick Deploy to Netlify

### 1. **One-Click Deploy**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/astralcore)

### 2. **Manual Deploy**

#### Fork & Clone
```bash
git clone https://github.com/yourusername/astralcore.git
cd astralcore
npm install
```

#### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Required environment variables for Netlify:
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
NEXT_PUBLIC_APP_NAME=AstralCore
NEXT_PUBLIC_APP_VERSION=5.0
```

#### Deploy to Netlify
1. Push to GitHub
2. Connect to Netlify
3. Build settings:
   - **Build command**: `npm run build:production`
   - **Publish directory**: `.next`
   - **Node version**: `18`

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run deploy       # Build and deploy ready
```

## 📁 Project Structure

```
astralcore/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── admin/             # Admin panel
│   │   ├── dashboard/         # User dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   ├── auth/             # Auth components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── navigation/       # Navigation components
│   │   └── ui/               # UI primitives
│   ├── lib/                  # Utilities & helpers
│   ├── hooks/                # Custom React hooks
│   └── contexts/             # React contexts
├── data/                     # JSON database files
├── public/                   # Static assets
├── netlify.toml             # Netlify configuration
└── package.json             # Dependencies
```

## 🗄️ Database

AstralCore uses a file-based JSON database for simplicity and Netlify compatibility:

- `data/users.json` - User accounts and profiles
- `data/web-pages.json` - Dynamic page content
- `data/settings.json` - App configuration
- `data/wallets.json` - Wallet and transaction data
- `data/chats.json` - Chat messages

### Migration to Production Database
For production scale, consider migrating to:
- **PostgreSQL** (Supabase, Neon)
- **MongoDB** (MongoDB Atlas)
- **Firebase Firestore**

## 🔑 Admin Access

### Default Credentials
- **Admin**: `admin@astralcore.io` / `admin`
- **Moderator**: `moderator@astralcore.io` / `moderator`

**⚠️ Change these credentials in production!**

### Admin Features
- User management and verification
- Content management (Web Page Editor)
- Trading bot configuration
- Analytics and reporting
- System settings

## 🎨 Customization

### Theme Configuration
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        quantum: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4'
        }
      }
    }
  }
}
```

### Feature Flags
```bash
NEXT_PUBLIC_ENABLE_TRADING=true
NEXT_PUBLIC_ENABLE_DEPOSITS=true
NEXT_PUBLIC_ENABLE_WITHDRAWALS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/session` - Session validation

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/verify-user` - Verify user account

### Monitoring
- `GET /api/health` - Health check
- `GET /api/version` - App version info

## 🚨 Production Checklist

### Security
- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure HTTPS (automatic with Netlify)
- [ ] Review environment variables
- [ ] Enable security headers

### Performance
- [ ] Configure CDN (automatic with Netlify)
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up monitoring

### SEO
- [ ] Update sitemap.xml with your domain
- [ ] Configure robots.txt
- [ ] Set up analytics
- [ ] Add meta descriptions

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Environment Issues
```bash
# Verify environment variables in Netlify
# Dashboard > Site Settings > Environment Variables
```

### Database Issues
- Check JSON syntax in data files
- Ensure file permissions are correct
- Verify backup procedures

## 📞 Support

- **Documentation**: [View Docs](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/astralcore/issues)
- **Email**: support@astralcore.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎉 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide](https://lucide.dev/) - Icons
- [Netlify](https://netlify.com/) - Deployment

---

**Ready to launch your quantum trading platform?** 🚀

Deploy now and start trading across infinite market dimensions!
