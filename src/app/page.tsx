import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AstralLogo } from '@/components/icons/astral-logo';
import { HeroSection } from '@/components/landing/hero-section';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Globe, 
  Lock,
  Bot,
  DollarSign,
  Star,
  CheckCircle,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <AstralLogo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">AstralCore</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#trading" className="text-muted-foreground hover:text-foreground transition-colors">
                Trading
              </Link>
              <Link href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Trade</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful tools and features designed for both beginners and professional traders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI Trading Bots</CardTitle>
                <CardDescription>
                  Advanced grid trading algorithms that work 24/7 to maximize your profits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Automated grid trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Risk management tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Customizable strategies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive market data and portfolio analytics in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Live market data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Advanced charting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Bank-Grade Security</CardTitle>
                <CardDescription>
                  Military-grade encryption and multi-layer security protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    2FA authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Cold storage wallets
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle>Squad System</CardTitle>
                <CardDescription>
                  Join trading squads, share strategies, and earn referral rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Community trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Referral rewards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Strategy sharing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Multi-Asset Support</CardTitle>
                <CardDescription>
                  Trade Bitcoin, Ethereum, USDT and 100+ cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    100+ cryptocurrencies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Spot & futures trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Cross-margin support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Sub-millisecond execution with 99.9% uptime guarantee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ultra-low latency
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    99.9% uptime SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Global infrastructure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trading Section */}
      <section id="trading" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Trading
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Professional Trading Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access institutional-grade trading tools designed for maximum profitability
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Grid Trading Revolution</h3>
                <p className="text-muted-foreground">
                  Our advanced grid trading algorithm automatically places buy and sell orders at predetermined intervals, 
                  profiting from market volatility while you sleep.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Automated Profit Taking</h4>
                    <p className="text-sm text-muted-foreground">
                      Set your parameters and let our AI handle the rest. Maximize profits in both bull and bear markets.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Smart Risk Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Built-in stop-loss and take-profit mechanisms protect your capital while maximizing returns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Real-time Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Our system continuously optimizes your trading strategy based on market conditions and performance.
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="group" asChild>
                <Link href="/register">
                  Start Trading Now
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <Bot className="w-16 h-16 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">AI Trading Bot</div>
                      <div className="text-muted-foreground">Working 24/7 for You</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Security First
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Your Security is Our Priority</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multi-layered security infrastructure protecting over $2.4B in digital assets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle>End-to-End Encryption</CardTitle>
                <CardDescription>
                  All data is encrypted using AES-256 encryption, the same standard used by banks and governments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle>Cold Storage</CardTitle>
                <CardDescription>
                  95% of funds stored in offline cold wallets, protected from online threats and hacking attempts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <CardTitle>24/7 Monitoring</CardTitle>
                <CardDescription>
                  Round-the-clock security monitoring with real-time threat detection and response
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of traders who trust AstralCore for their cryptocurrency trading needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3 text-lg group" asChild>
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AstralLogo className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">AstralCore</span>
              </div>
              <p className="text-muted-foreground">
                Next-generation cryptocurrency trading platform powered by AI and advanced algorithms.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/trading" className="hover:text-foreground transition-colors">Trading</Link></li>
                <li><Link href="/market" className="hover:text-foreground transition-colors">Market</Link></li>
                <li><Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/support" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">System Status</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-foreground transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 AstralCore. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              {/* Social links would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
