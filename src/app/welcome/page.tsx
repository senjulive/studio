import { AstralLogo } from '@/components/icons/astral-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { TrendingUp, Shield, Zap, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Welcome to AstralCore',
  description: 'Advanced cryptocurrency trading platform with AI-powered tools',
};

export default function WelcomePage() {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center p-6">
        <div className="flex items-center space-x-3">
          <AstralLogo className="h-10 w-10 text-primary" />
          <span className="text-xl font-bold text-foreground">AstralCore</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        {/* Hero section */}
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Advanced Crypto Trading Platform
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Trade cryptocurrencies with AI-powered bots, real-time analytics, and professional tools designed for modern traders.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-card border border-border rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Smart Trading</h3>
              <p className="text-xs text-muted-foreground">AI-powered bots</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Secure</h3>
              <p className="text-xs text-muted-foreground">Bank-grade security</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Fast</h3>
              <p className="text-xs text-muted-foreground">Real-time execution</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Community</h3>
              <p className="text-xs text-muted-foreground">Trading squads</p>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-muted/30 rounded-xl p-6 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">50K+</div>
              <div className="text-xs text-muted-foreground">Active Traders</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">$2.1B</div>
              <div className="text-xs text-muted-foreground">Volume Traded</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA section */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-base font-medium">
            <Link href="/register">Get Started</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full h-12 text-base">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Free to start • No hidden fees • Professional support
          </p>
        </div>
      </div>
    </div>
  );
}
