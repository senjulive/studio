# AstralCore - Quantum Trading Platform

<div align="center">
  <img src="public/icons/icon-512x512.svg" alt="AstralCore Logo" width="100" height="100">
  
  **The Future of Quantum AI Trading**
  
  A sophisticated trading platform powered by quantum algorithms and neural networks.
  
  [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/astralcore)
</div>

## 🌟 Features

### 🚀 **Quantum AI Trading**
- Advanced neural network algorithms
- Real-time market analysis
- Automated trading strategies
- Risk management systems

### 👥 **Squad System**
- Team formation and management
- Clan chat functionality
- Referral rewards
- Collaborative trading

### 💰 **Comprehensive Wallet**
- Multi-cryptocurrency support (BTC, ETH, USDT)
- Secure deposits and withdrawals
- Real-time balance tracking
- Transaction history

### 🏆 **Achievements & Tiers**
- Dynamic ranking system
- Tier-based rewards
- Achievement badges
- Progress tracking

### 🎨 **Modern UI/UX**
- Glassmorphism design
- Dark/light theme support
- Responsive mobile design
- Smooth animations

### 🔐 **Security**
- Quantum-grade encryption
- Session management
- Role-based access control
- Secure authentication

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **AI**: Google Gemini + Genkit
- **Charts**: Recharts
- **Deployment**: Netlify

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/astralcore.git
   cd astralcore
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration values.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
astralcore/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── dashboard/          # User dashboard
│   │   ├── api/                # API routes
│   │   └── auth/               # Authentication pages
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── admin/              # Admin components
│   │   └── dashboard/          # Dashboard components
│   ├── lib/                    # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts
│   └── data/                   # Mock data files
├── public/                     # Static assets
├── docs/                       # Documentation
└── data/                       # JSON data files
```

## 🔐 Authentication

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@astralcore.io | admin |
| Moderator | moderator@astralcore.io | moderator |
| User | Any valid email | Any password |

### Features
- Session-based authentication
- Role-based access control
- Password reset functionality
- Remember me option
- Secure logout

## 📊 Dashboard Features

### User Dashboard
- **Wallet**: Balance tracking, transaction history
- **Trading**: AI trading interface with live charts
- **Market**: Real-time market data and analysis
- **Squad**: Team management and clan features
- **Achievements**: Progress tracking and rewards
- **Profile**: User settings and verification

### Admin Panel
- **User Management**: User accounts and verification
- **Financial Management**: Deposits, withdrawals, wallets
- **Communication**: Support chat, public chat
- **Content Management**: Promotions, announcements
- **System Management**: Settings, analytics, logs

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Purple gradient (#8B5CF6 to #EC4899)
- **Accent**: Cyan (#06B6D4)
- **Background**: Dark theme with glassmorphism

### Typography
- **Headings**: Inter font family
- **Body**: Inter font family
- **Code**: Monospace

### Components
- Consistent spacing and sizing
- Smooth animations and transitions
- Accessible design patterns
- Mobile-first responsive design

## 🌐 Deployment

### Netlify (Recommended)

1. **Connect your repository**
   - Link your GitHub repository to Netlify
   - Configure build settings

2. **Environment Variables**
   Set the following in Netlify dashboard:
   ```
   NODE_ENV=production
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.netlify.app
   ```

3. **Deploy**
   Netlify will automatically build and deploy your application.

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `.next` folder**
   Upload the generated files to your hosting provider.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `NEXTAUTH_SECRET` | Authentication secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `DATABASE_URL` | Database connection | No* |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini AI API key | No* |

*Required for production features

### Customization

- **Themes**: Modify `tailwind.config.ts` for custom colors
- **Components**: Extend UI components in `src/components/ui/`
- **Data**: Update mock data in `src/data/` and `data/` directories
- **AI**: Configure Gemini AI in `src/ai/` directory

## 📈 Features Overview

### Trading System
- **Quantum Algorithms**: Advanced AI-powered trading strategies
- **Real-time Data**: Live market data and price tracking
- **Risk Management**: Intelligent position sizing and stop-losses
- **Multi-asset**: Support for BTC, ETH, USDT, and more

### Social Features
- **Squad System**: Team formation and collaboration
- **Referral Program**: Earn rewards for inviting users
- **Chat System**: Real-time communication
- **Leaderboards**: Competitive ranking systems

### Security Features
- **Quantum Encryption**: Military-grade security protocols
- **Session Management**: Secure user sessions
- **Role-based Access**: Admin, moderator, and user roles
- **Audit Logs**: Comprehensive activity tracking

## 🧪 Development

### Scripts

```bash
# Development
npm run dev              # Start development server
npm run genkit:dev       # Start Genkit AI development
npm run genkit:watch     # Watch mode for AI development

# Building
npm run build           # Build for production
npm run start           # Start production server

# Quality
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking
```

### Testing

The application includes comprehensive mock data and simulated APIs for testing all features without external dependencies.

## 📚 Documentation

- [Project Blueprint](docs/blueprint.md) - Detailed project architecture
- [Getting Started Guide](getting-started.md) - Step-by-step setup
- [API Documentation](docs/api.md) - API endpoints reference
- [Component Library](docs/components.md) - UI component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the `/docs` directory
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: support@astralcore.io (demo)

## 🌟 Acknowledgments

- **Next.js Team** - Amazing framework
- **Vercel** - Hosting and deployment
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Google** - Gemini AI integration

---

<div align="center">
  <strong>Built with ❤️ by the AstralCore Team</strong>
  
  [Website](https://astralcore.netlify.app) • [Documentation](docs/) • [Support](mailto:support@astralcore.io)
</div>
