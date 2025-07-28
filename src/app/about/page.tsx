import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Shield, Zap, Users, Globe, TrendingUp, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: "About - AstralCore",
  description: "Learn about AstralCore's mission to democratize crypto trading through advanced AI technology and automated grid trading systems.",
};

const stats = [
  { label: "Active Users", value: "50,000+", icon: Users },
  { label: "Trading Volume", value: "$2.5B+", icon: TrendingUp },
  { label: "Countries", value: "150+", icon: Globe },
  { label: "Uptime", value: "99.99%", icon: Zap },
];

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Military-grade encryption and multi-layer security protocols protect your assets 24/7.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-millisecond execution speeds ensure you never miss profitable trading opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "Our AI algorithms have generated consistent profits across all market conditions since 2019.",
  },
  {
    icon: Lock,
    title: "Regulatory Compliant",
    description: "Fully licensed and compliant with international financial regulations and standards.",
  },
];

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    background: "Former Goldman Sachs quant with 15+ years in algorithmic trading",
  },
  {
    name: "Sarah Rodriguez",
    role: "CTO",
    background: "Ex-Google AI researcher specializing in financial machine learning",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Security",
    background: "Former NSA cybersecurity expert with blockchain expertise",
  },
  {
    name: "Lisa Wong",
    role: "Head of Compliance",
    background: "Former SEC regulator with deep crypto regulatory knowledge",
  },
];

export default function AboutPage() {
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
            About AstralCore
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Democratizing Crypto Trading with
            <span className="text-primary"> Advanced AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Founded in 2019, AstralCore has revolutionized cryptocurrency trading by making 
            institutional-grade algorithms accessible to everyone. Our mission is to level 
            the playing field in crypto markets through cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">The Problem We Solved</h3>
              <p className="text-muted-foreground mb-6">
                In 2019, cryptocurrency trading was dominated by institutional players with 
                access to sophisticated algorithms and unlimited resources. Retail traders 
                were left to compete with basic tools against AI-powered trading bots.
              </p>
              <p className="text-muted-foreground">
                We believed this was fundamentally unfair. Everyone deserves access to the 
                same advanced trading technology that generates consistent profits regardless 
                of market conditions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>
              <p className="text-muted-foreground mb-6">
                AstralCore democratizes algorithmic trading by providing retail investors 
                with institutional-grade grid trading algorithms, advanced risk management, 
                and 24/7 automated execution.
              </p>
              <p className="text-muted-foreground">
                Our platform has generated over $500M in profits for our users while 
                maintaining industry-leading security and regulatory compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AstralCore</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4"></div>
                  <CardTitle className="text-lg text-center">{member.name}</CardTitle>
                  <CardDescription className="text-center font-medium text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {member.background}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using AstralCore to generate 
            consistent profits in the cryptocurrency markets.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Start Trading Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
