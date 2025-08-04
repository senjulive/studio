# AstralCore Deployment Guide

## 🚀 Quick Deployment to Netlify

### Prerequisites
- GitHub account
- Netlify account
- Node.js 18+ locally (for development)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AstralCore Quantum Trading Platform"
git branch -M main
git remote add origin https://github.com/yourusername/astralcore.git
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Netlify Web Interface
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build:production`
   - **Publish directory**: `.next`
   - **Node version**: `18`

#### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --build
netlify deploy --prod
```

### 3. Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

#### Required Variables
```bash
JWT_SECRET=your-super-secure-jwt-secret-here-minimum-32-characters
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_APP_NAME=AstralCore
NEXT_PUBLIC_APP_VERSION=5.0
```

#### Optional Variables
```bash
NEXT_PUBLIC_ENABLE_TRADING=true
NEXT_PUBLIC_ENABLE_DEPOSITS=true
NEXT_PUBLIC_ENABLE_WITHDRAWALS=true
NEXT_PUBLIC_ENABLE_CHAT=true
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 4. Custom Domain (Optional)
1. In Netlify Dashboard → Domain management
2. Add custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## 🔧 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/astralcore.git
cd astralcore
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your local configuration
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📊 Features Included

### ✅ Fully Functional
- **Authentication System**: Registration, login, password reset
- **Admin Panel**: Complete web page editor, user management
- **Dynamic Pages**: About, Contact, Privacy, Terms, FAQ, Help
- **Navigation**: Responsive navigation with mobile support
- **Database**: File-based JSON database (production-ready)
- **API Routes**: Complete REST API for all functionality
- **Form Validation**: Comprehensive validation with Zod
- **Security**: JWT authentication, secure headers
- **Responsive Design**: Mobile-first design approach

### 🎨 Design System
- **Quantum Theme**: Advanced gradients and animations
- **Dark Mode**: Sleek dark interface
- **Component Library**: Reusable UI components
- **Icons**: Lucide React icons throughout
- **Typography**: Modern font system

### 🛡️ Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **Security Headers**: XSS, CSRF protection
- **Rate Limiting**: Built-in protection

## 🗃️ Database Structure

### Users
```json
{
  "id": "usr_xxxxx",
  "email": "user@example.com",
  "fullName": "John Doe",
  "tier": "recruit",
  "balance": 0,
  "isVerified": false,
  "role": "user"
}
```

### Web Pages
```json
{
  "id": "welcome",
  "route": "/",
  "title": "AstralCore - Quantum Trading",
  "content": [...]
}
```

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: `admin@astralcore.io`
- **Password**: `admin`

### Default Moderator Credentials
- **Email**: `moderator@astralcore.io`
- **Password**: `moderator`

**⚠️ Important**: Change these credentials in production!

## 🚨 Production Checklist

### Security
- [ ] Change default admin/moderator passwords
- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS (automatic with Netlify)
- [ ] Review environment variables
- [ ] Update CORS settings if needed

### Performance
- [ ] Enable image optimization
- [ ] Configure CDN (automatic with Netlify)
- [ ] Set up monitoring
- [ ] Configure analytics

### Database
- [ ] Consider migrating to PostgreSQL for production
- [ ] Set up automated backups
- [ ] Implement database migrations

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
# Verify environment variables
netlify env:list
```

### API Issues
- Check Netlify Functions logs
- Verify API routes are working
- Check network requests in browser dev tools

## 📞 Support

For technical support:
- Check the [Help Center](/help)
- Contact: [support@astralcore.com](mailto:support@astralcore.com)
- Documentation: [docs.astralcore.com](https://docs.astralcore.com)

## 🔄 Updates

To update the deployment:
```bash
git add .
git commit -m "Update description"
git push origin main
```

Netlify will automatically redeploy!

---

**🎉 Congratulations!** Your AstralCore Quantum Trading Platform is now ready for production deployment on Netlify!
