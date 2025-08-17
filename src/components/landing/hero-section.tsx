'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        {/* Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Advanced AI-Powered Trading
          </Badge>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <AstralLogo className="w-24 h-24 text-primary animate-pulse" />
            <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-ping" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              AstralCore
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground max-w-3xl mx-auto">
            Next-Generation Cryptocurrency Trading Platform
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Experience the future of crypto trading with our AI-powered platform featuring automated grid trading, 
          real-time analytics, and comprehensive portfolio management.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Advanced Trading Bots</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-blue-500" />
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Real-time Analytics</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button size="lg" className="px-8 py-3 text-lg font-semibold group" asChild>
            <Link href="/register">
              Start Trading Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">$2.4B+</div>
            <div className="text-sm text-muted-foreground">Trading Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
