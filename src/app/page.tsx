import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Bot, Star, Award, Target, Smartphone, Download, Play } from 'lucide-react';
import { GlassCard, FeatureCard, StatCard } from '@/components/ui/glass-card';

export default function WelcomePage() {
  const features = [
    {
      icon: Bot,
      title: "AI Trading Bot",
      description: "Advanced quantum algorithms for automated trading with 94.7% success rate",
      variant: "crypto" as const,
      highlight: "Most Popular"
    },
    {
      icon: Shield,
      title: "Quantum Security",
      description: "Military-grade encryption protecting your digital assets 24/7",
      variant: "gradient" as const,
      highlight: "Bank Level"
    },
    {
      icon: TrendingUp,
      title: "Live Analytics",
      description: "Real-time market data and AI-powered trading insights",
      variant: "gaming" as const,
      highlight: "Real-time"
    },
    {
      icon: Users,
      title: "Squad System",
      description: "Join trading communities and earn passive income rewards",
      variant: "success" as const,
      highlight: "Community"
    },
  ];

  const stats = [
    { label: "Active Traders", value: "10K+", trend: "up", trendValue: "+23%", icon: Users },
    { label: "Success Rate", value: "94.7%", trend: "up", trendValue: "+2.1%", icon: Target },
    { label: "Total Volume", value: "$2.4M", trend: "up", trendValue: "+15%", icon: TrendingUp },
    { label: "Avg Profit", value: "12.3%", trend: "up", trendValue: "+0.8%", icon: Award },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Crypto Investor",
      content: "AstralCore's AI bot has consistently delivered profits. The interface is intuitive and perfect for mobile trading.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Day Trader",
      content: "Best trading platform I've used. The squad system creates amazing community vibes while earning.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Tech Analyst",
      content: "Security is top-notch and the quantum algorithms actually work. Impressed by the consistent returns.",
      rating: 5,
      avatar: "ET"
    }
  ];

  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl animate-pulse delay-1500" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="mobile-padding py-12 lg:py-20">
          <div className="mobile-container text-center space-y-8 max-w-4xl">
            {/* Logo and Title */}
            <div className="space-y-6 animate-fade-in">
              <div className="relative mx-auto w-fit floating-element">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
                <AstralLogo className="relative h-20 w-20 sm:h-28 sm:w-28 lg:h-36 lg:w-36 animate-float mx-auto" />
              </div>
              
              <div className="space-y-4">
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-6 py-2 text-sm rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Next-Gen Trading Platform
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
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
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-slide-up">
              Experience the future of cryptocurrency trading with our AI-powered platform. 
              Advanced quantum algorithms and Grid Trading strategies turn market volatility 
              into consistent, automated profits.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-scale-in">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 btn-primary text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/login">
                  <Play className="mr-2 h-5 w-5" />
                  Launch Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 btn-secondary text-lg"
              >
                <Link href="/register">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span>Instant Trading</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mobile-padding py-12">
          <div className="mobile-container max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary mb-4">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live Platform Stats
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Trusted by Traders Worldwide
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  title={stat.label}
                  value={stat.value}
                  trend={stat.trend as any}
                  trendValue={stat.trendValue}
                  variant="gradient"
                  className="animate-fade-in card-modern"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <stat.icon className="h-6 w-6 text-primary" />
                </StatCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mobile-padding py-12 lg:py-20">
          <div className="mobile-container max-w-6xl">
            <div className="text-center space-y-4 mb-12">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={feature.title} className="relative">
                  {feature.highlight && (
                    <Badge className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground">
                      {feature.highlight}
                    </Badge>
                  )}
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    variant={feature.variant}
                    className="animate-fade-in card-feature h-full"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div />
                  </FeatureCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mobile-padding py-12">
          <div className="mobile-container max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary mb-4">
                <Users className="h-3 w-3 mr-1" />
                User Reviews
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                What Our Traders Say
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <GlassCard key={testimonial.name} variant="gradient" className="p-6 card-modern animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{testimonial.content}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="mobile-padding py-12">
          <div className="mobile-container max-w-4xl">
            <GlassCard variant="gradient" className="text-center p-8 card-modern">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    <Smartphone className="h-3 w-3 mr-1" />
                    Mobile Optimized
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Trade Anywhere, Anytime
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Our platform is designed mobile-first for seamless trading on any device
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full sm:w-auto btn-primary"
                  >
                    <Link href="/register">
                      <Download className="mr-2 h-4 w-4" />
                      Get Started
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
                    <Link href="/login">
                      Already have an account?
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mobile-padding py-12 lg:py-20">
          <div className="mobile-container max-w-4xl">
            <GlassCard variant="gradient" className="text-center p-8 card-modern floating-element">
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
                    className="w-full sm:w-auto btn-primary text-lg"
                  >
                    <Link href="/register">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-lg">
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 text-xs text-muted-foreground space-y-1">
                  <p>✓ No hidden fees • ✓ Bank-level security • ✓ 24/7 support</p>
                  <p>Start with just $10 • Mobile optimized • Instant withdrawals</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 mobile-padding safe-bottom">
        <div className="mobile-container py-8 max-w-6xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <AstralLogo className="h-6 w-6" />
              <span className="text-lg font-semibold">AstralCore</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                Legal
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span>© 2024 AstralCore. Quantum-powered trading platform.</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Secured by military-grade encryption</span>
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
