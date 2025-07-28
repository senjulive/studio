'use client';

'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Download,
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Zap,
  Shield,
  Bot,
  BarChart3,
  Settings,
  Users,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    description: 'Everything you need to know to begin trading',
    articles: [
      { title: 'How to Create Your First Account', time: '3 min read', type: 'article' },
      { title: 'Setting Up Your First Trading Bot', time: '5 min read', type: 'article' },
      { title: 'Understanding Grid Trading Basics', time: '8 min read', type: 'article' },
      { title: 'Making Your First Deposit', time: '4 min read', type: 'article' },
    ]
  },
  {
    id: 'trading-strategies',
    title: 'Trading Strategies',
    icon: Bot,
    description: 'Learn about different trading approaches',
    articles: [
      { title: 'Grid Trading Strategy Guide', time: '12 min read', type: 'guide' },
      { title: 'DCA (Dollar Cost Averaging) Explained', time: '10 min read', type: 'guide' },
      { title: 'Risk Management Best Practices', time: '15 min read', type: 'guide' },
      { title: 'Advanced Trading Techniques', time: '20 min read', type: 'guide' },
    ]
  },
  {
    id: 'security',
    title: 'Security & Safety',
    icon: Shield,
    description: 'Keep your account and funds secure',
    articles: [
      { title: 'Setting Up Two-Factor Authentication', time: '5 min read', type: 'tutorial' },
      { title: 'API Key Security Best Practices', time: '7 min read', type: 'article' },
      { title: 'Recognizing and Avoiding Scams', time: '6 min read', type: 'article' },
      { title: 'What to Do If Your Account Is Compromised', time: '4 min read', type: 'article' },
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    icon: BarChart3,
    description: 'Understanding your trading performance',
    articles: [
      { title: 'Reading Your Performance Dashboard', time: '8 min read', type: 'tutorial' },
      { title: 'Understanding Trading Metrics', time: '12 min read', type: 'guide' },
      { title: 'Tax Reporting for Crypto Trades', time: '10 min read', type: 'article' },
      { title: 'Exporting Your Trading Data', time: '3 min read', type: 'tutorial' },
    ]
  }
];

const quickLinks = [
  { title: 'Account Settings', href: '/dashboard/profile', icon: Settings },
  { title: 'Trading Dashboard', href: '/dashboard/trading', icon: Bot },
  { title: 'Contact Support', href: '/contact', icon: MessageCircle },
  { title: 'FAQ', href: '/faq', icon: HelpCircle },
];

const videoTutorials = [
  {
    title: 'AstralCore Platform Overview',
    duration: '12:34',
    thumbnail: 'https://placehold.co/400x225/1f2937/ffffff?text=Platform+Overview',
    description: 'Complete walkthrough of the AstralCore trading platform'
  },
  {
    title: 'Setting Up Your First Grid Bot',
    duration: '8:15',
    thumbnail: 'https://placehold.co/400x225/1f2937/ffffff?text=Grid+Bot+Setup',
    description: 'Step-by-step guide to creating your first automated trading bot'
  },
  {
    title: 'Advanced Risk Management',
    duration: '15:22',
    thumbnail: 'https://placehold.co/400x225/1f2937/ffffff?text=Risk+Management',
    description: 'Learn how to protect your investments with proper risk controls'
  },
  {
    title: 'Reading Trading Analytics',
    duration: '10:45',
    thumbnail: 'https://placehold.co/400x225/1f2937/ffffff?text=Analytics+Guide',
    description: 'Understanding your performance metrics and trading statistics'
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
            <Link href="/faq">
              <Button variant="ghost">FAQ</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
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
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Help & <span className="text-primary">Documentation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find guides, tutorials, and answers to help you make the most of AstralCore's 
            powerful trading features and maximize your crypto investments.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <link.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <Link href={link.href} className="font-medium hover:text-primary">
                    {link.title}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Documentation</h2>
          
          {searchTerm && (
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {filteredCategories.reduce((total, cat) => total + cat.articles.length, 0)} results for "{searchTerm}"
              </Badge>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <category.icon className="h-6 w-6 mr-3 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.articles.map((article, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{article.title}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{article.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {article.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All {category.title} Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Video Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-gray-800" />
                    </div>
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              <Video className="mr-2 h-5 w-5" />
              View All Video Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">API Documentation</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Integrate AstralCore's powerful trading algorithms into your own applications 
            with our comprehensive REST API documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/docs/api">
                View API Docs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Download className="mr-2 h-5 w-5" />
              Download SDK
            </Button>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our support team is available 24/7 to help you with any questions. 
            Join our community for tips, strategies, and discussions with other traders.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other traders and experts
                </p>
                <Button variant="outline" size="sm">Join Forum</Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Trade on the go with our mobile app
                </p>
                <Button variant="outline" size="sm">Download App</Button>
              </CardContent>
            </Card>
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
