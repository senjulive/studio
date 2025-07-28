import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  ArrowRight, 
  Bot, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Lock, 
  Globe, 
  Users, 
  Settings, 
  Clock, 
  DollarSign,
  Smartphone,
  PieChart,
  AlertTriangle,
  Target,
  Layers,
  Activity
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Features - AstralCore",
  description: "Discover AstralCore's powerful trading features including grid trading bots, advanced analytics, portfolio management, and enterprise-grade security.",
};

const coreFeatures = [
  {
    icon: Bot,
    title: "AI-Powered Grid Trading",
    description: "Advanced algorithms that profit from market volatility using sophisticated grid trading strategies.",
    features: ["24/7 automated trading", "Dynamic grid adjustment", "Multi-timeframe analysis", "Risk-adjusted position sizing"]
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive market analysis and portfolio tracking with institutional-grade data visualization.",
    features: ["Live market data", "Performance metrics", "Risk analytics", "Custom dashboards"]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security protocols protecting your assets with multi-layer authentication and encryption.",
    features: ["2FA authentication", "Cold storage", "Insurance coverage", "Audit trails"]
  },
  {
    icon: Smartphone,
    title: "Mobile Trading",
    description: "Full-featured mobile app for iOS and Android with all desktop features optimized for mobile.",
    features: ["Native mobile apps", "Push notifications", "Biometric authentication", "Offline mode"]
  }
];

const tradingFeatures = [
  {
    icon: Target,
    title: "Smart Order Types",
    description: "Advanced order types including stop-loss, take-profit, and trailing stops with smart execution.",
  },
  {
    icon: Activity,
    title: "Market Making",
    description: "Automated market making strategies that provide liquidity and capture spread profits.",
  },
  {
    icon: PieChart,
    title: "Portfolio Rebalancing",
    description: "Automatic portfolio rebalancing based on your risk preferences and market conditions.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    description: "Sophisticated risk controls including position limits, drawdown protection, and volatility filters.",
  }
];

const analyticsFeatures = [
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Detailed performance analysis with Sharpe ratio, maximum drawdown, and win rate metrics.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "Advanced market analysis including order book depth, sentiment analysis, and price predictions.",
  },
  {
    icon: Layers,
    title: "Multi-Exchange Data",
    description: "Aggregated data from 50+ exchanges providing comprehensive market coverage.",
  },
  {
    icon: Clock,
    title: "Historical Backtesting",
    description: "Test your strategies against historical data with walk-forward analysis and Monte Carlo simulations.",
  }
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for beginners",
    features: [
      "1 trading bot",
      "Basic analytics",
      "Email support",
      "Standard execution"
    ]
  },
  {
    name: "Pro",
    price: "$49/mo",
    description: "For serious traders",
    features: [
      "5 trading bots",
      "Advanced analytics",
      "Priority support",
      "Fast execution",
      "Custom strategies"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199/mo",
    description: "For institutions",
    features: [
      "Unlimited bots",
      "Full analytics suite",
      "24/7 phone support",
      "Ultra-fast execution",
      "Custom development",
      "Dedicated account manager"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <AstralLogo className="h-6 w-6" />
            <span className="font-bold">AstralCore</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Platform Features
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Everything You Need to
            <span className="text-primary"> Trade Smarter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional-grade trading tools, advanced analytics, and automated strategies 
            designed to maximize your crypto trading success in any market condition.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Capabilities</h2>
          <Tabs defaultValue="trading" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="trading">Trading Tools</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trading">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tradingFeatures.map((feature, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsFeatures.map((feature, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Security First
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Bank-Level Security for Your Digital Assets
              </h2>
              <p className="text-muted-foreground mb-6">
                Your security is our top priority. We employ multiple layers of protection 
                including cold storage, encryption, and regular security audits to ensure 
                your assets are always safe.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm">256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Cold Storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Multi-Signature</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="text-sm">Regular Audits</span>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-6">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">99.99%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$2B+</div>
                  <div className="text-sm text-muted-foreground">Secured</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Breaches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold">{tier.price}</div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={tier.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Trading?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using AstralCore's advanced features 
            to maximize their cryptocurrency trading profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 AstralCore. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
