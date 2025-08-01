import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Bot } from 'lucide-react';
import { GlassCard, FeatureCard, StatCard } from '@/components/ui/glass-card';

export default function WelcomePage() {
  const features = [
    {
      icon: Bot,
      title: "AI Trading Bot",
      description: "Advanced quantum algorithms for automated trading",
      variant: "crypto" as const,
    },
    {
      icon: Shield,
      title: "Quantum Security",
      description: "Military-grade encryption protecting your assets",
      variant: "gradient" as const,
    },
    {
      icon: TrendingUp,
      title: "Live Analytics",
      description: "Real-time market data and trading insights",
      variant: "gaming" as const,
    },
    {
      icon: Users,
      title: "Squad System",
      description: "Join trading communities and earn rewards",
      variant: "success" as const,
    },
  ];

  const stats = [
    { label: "Active Traders", value: "10K+", trend: "up", trendValue: "+23%" },
    { label: "Success Rate", value: "94.7%", trend: "up", trendValue: "+2.1%" },
    { label: "Total Volume", value: "$2.4M", trend: "up", trendValue: "+15%" },
    { label: "Avg Profit", value: "12.3%", trend: "up", trendValue: "+0.8%" },
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl animate-pulse delay-1500" />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 lg:py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo and Title */}
            <div className="space-y-6">
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                <AstralLogo className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 animate-float mx-auto" />
              </div>
              
              <div className="space-y-4">
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-4 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Next-Gen Trading Platform
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    AstralCore
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-muted-foreground">
                  Quantum Trading Platform
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Experience the future of cryptocurrency trading with our AI-powered platform. 
              Advanced quantum algorithms and Grid Trading strategies turn market volatility 
              into consistent, automated profits.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-xl shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/login">
                  Launch Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 border-primary/30 hover:bg-primary/10 backdrop-blur-sm"
              >
                <Link href="/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                title={stat.label}
                value={stat.value}
                trend={stat.trend as any}
                trendValue={stat.trendValue}
                variant="gradient"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div />
              </StatCard>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 lg:py-20">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                <Zap className="h-3 w-3 mr-1" />
                Platform Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Why Choose AstralCore
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Advanced technology meets intuitive design in our comprehensive trading ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  variant={feature.variant}
                  className="animate-fade-in hover:scale-[1.02] transition-transform duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div />
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 lg:py-20">
          <GlassCard variant="gradient" className="max-w-4xl mx-auto text-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Ready to Start Trading?
                </h3>
                <p className="text-muted-foreground text-lg">
                  Join thousands of traders already using AstralCore to maximize their crypto investments
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="h-12 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Link href="/register">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="ghost" size="lg" className="h-12 px-8">
                  <Link href="/login">
                    Already have an account?
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-center gap-2">
              <AstralLogo className="h-4 w-4" />
              <span>© 2024 AstralCore. Quantum-powered trading platform.</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-3 w-3" />
              <span>Secured by military-grade encryption</span>
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
