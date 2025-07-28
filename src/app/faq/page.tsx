'use client';

'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  Search, 
  MessageCircle, 
  Book, 
  Shield, 
  DollarSign, 
  Bot, 
  Settings,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

const faqCategories = [
  {
    id: 'general',
    title: 'General',
    icon: Book,
    questions: [
      {
        question: "What is AstralCore?",
        answer: "AstralCore is an advanced cryptocurrency trading platform that uses AI-powered grid trading algorithms to help users generate consistent profits from market volatility. Our platform makes institutional-grade trading strategies accessible to retail investors."
      },
      {
        question: "How does grid trading work?",
        answer: "Grid trading is a systematic trading strategy that places buy and sell orders at predetermined intervals above and below a set price. As the market fluctuates, the bot automatically buys low and sells high, capturing profits from price volatility regardless of overall market direction."
      },
      {
        question: "Is AstralCore suitable for beginners?",
        answer: "Yes! AstralCore is designed for traders of all experience levels. Our platform includes educational resources, preset strategies, and an intuitive interface that makes it easy for beginners to start automated trading while offering advanced features for experienced traders."
      },
      {
        question: "What cryptocurrencies are supported?",
        answer: "We support over 100 major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Cardano (ADA), Solana (SOL), and many more. Our platform integrates with multiple exchanges to provide comprehensive market coverage."
      },
      {
        question: "Can I use AstralCore on mobile?",
        answer: "Yes, AstralCore offers full-featured mobile apps for both iOS and Android. You can monitor your bots, adjust strategies, and manage your portfolio from anywhere with the same features available on desktop."
      }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    questions: [
      {
        question: "How secure is my money on AstralCore?",
        answer: "Security is our top priority. We use bank-level security measures including 256-bit encryption, cold storage for the majority of funds, multi-signature wallets, regular security audits, and insurance coverage. We've never had a security breach since our founding."
      },
      {
        question: "Do you store my private keys?",
        answer: "No, we use API connections to exchanges, which means we never have access to your private keys or the ability to withdraw your funds. You maintain full control of your assets while our bots execute trades on your behalf through secure API connections."
      },
      {
        question: "What is two-factor authentication (2FA)?",
        answer: "Two-factor authentication adds an extra layer of security to your account by requiring both your password and a unique code from your mobile device to log in. We strongly recommend enabling 2FA and support both SMS and authenticator app methods."
      },
      {
        question: "Are my funds insured?",
        answer: "Yes, we provide insurance coverage for funds held on our platform through leading cryptocurrency insurance providers. This protects against theft, hacking, and other security breaches. However, funds held on external exchanges are subject to those exchanges' insurance policies."
      },
      {
        question: "How do you protect against market manipulation?",
        answer: "Our algorithms include sophisticated filters to detect and avoid unusual market conditions, wash trading, and potential manipulation. We also use data from multiple exchanges to ensure accurate pricing and prevent single-point failures."
      }
    ]
  },
  {
    id: 'trading',
    title: 'Trading',
    icon: Bot,
    questions: [
      {
        question: "How much money do I need to start?",
        answer: "You can start with as little as $10, but we recommend starting with at least $100 for better performance. Higher amounts allow for more sophisticated strategies and better risk management. There's no maximum limit - our platform scales to accommodate any portfolio size."
      },
      {
        question: "What returns can I expect?",
        answer: "Returns vary based on market conditions, strategy selection, and risk settings. Our users typically see annual returns between 20-60%, but past performance doesn't guarantee future results. We provide detailed backtesting data and performance analytics to help you make informed decisions."
      },
      {
        question: "Can I lose money with AstralCore?",
        answer: "Yes, all trading involves risk and it's possible to lose money. However, our risk management features help minimize losses through stop-loss orders, position sizing, and diversification. We recommend starting small and gradually increasing your investment as you become more comfortable."
      },
      {
        question: "How often should I check my bots?",
        answer: "Our bots are designed to run autonomously 24/7, but we recommend checking your portfolio at least once a week. You'll receive notifications for important events, and our mobile app makes it easy to monitor performance on the go."
      },
      {
        question: "Can I customize trading strategies?",
        answer: "Yes, our Pro and Enterprise plans offer extensive customization options including custom grid parameters, risk levels, stop-loss settings, and advanced strategies. You can also backtest your custom strategies before deploying them with real funds."
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing & Plans',
    icon: DollarSign,
    questions: [
      {
        question: "Is there a free plan?",
        answer: "Yes, our Starter plan is completely free and includes access to basic grid trading with one bot, email support, and mobile app access. It's perfect for getting started and learning how our platform works."
      },
      {
        question: "What's included in paid plans?",
        answer: "Paid plans include more trading bots, advanced strategies, priority support, real-time market data, API access, and advanced analytics. The Pro plan ($49/month) is perfect for serious traders, while Enterprise ($199/month) offers unlimited features for institutions."
      },
      {
        question: "Can I change my plan anytime?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle. We'll prorate any billing differences fairly."
      },
      {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with AstralCore for any reason, contact support within 30 days for a full refund."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No, our pricing is completely transparent. The only fees are your monthly subscription and standard exchange trading fees (which go to the exchange, not us). We don't charge deposit, withdrawal, or performance fees."
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical',
    icon: Settings,
    questions: [
      {
        question: "Which exchanges do you support?",
        answer: "We support over 20 major exchanges including Binance, Coinbase Pro, Kraken, KuCoin, FTX, and more. You can connect multiple exchange accounts to diversify your trading across different platforms."
      },
      {
        question: "Do you have an API?",
        answer: "Yes, our Pro and Enterprise plans include API access for developers and institutional clients. Our REST API allows you to integrate AstralCore functionality into your own applications or trading systems."
      },
      {
        question: "What happens if the platform goes down?",
        answer: "We maintain 99.99% uptime with redundant systems and global infrastructure. In the rare event of downtime, your bots continue running on exchange servers, and we provide real-time status updates through our status page."
      },
      {
        question: "Can I import my existing trading history?",
        answer: "Yes, you can import trading history from supported exchanges to get a complete view of your performance. This helps with tax reporting and performance analysis across all your trading activities."
      },
      {
        question: "Do you support algorithmic trading?",
        answer: "Yes, our Enterprise plan includes support for custom algorithmic trading strategies. You can deploy your own algorithms or work with our team to develop custom solutions for your specific needs."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  const filteredQuestions = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
            <Link href="/features">
              <Button variant="ghost">Features</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
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
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Frequently Asked
            <span className="text-primary"> Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to common questions about AstralCore, our trading strategies, 
            security measures, and platform features.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {searchTerm ? (
            /* Search Results */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                Search Results for "{searchTerm}"
                <Badge variant="secondary" className="ml-2">
                  {filteredQuestions.reduce((total, cat) => total + cat.questions.length, 0)} results
                </Badge>
              </h2>
              {filteredQuestions.map(category => (
                <div key={category.id}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <category.icon className="h-5 w-5 mr-2 text-primary" />
                    {category.title}
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Category Tabs */
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-5 mb-8">
                {faqCategories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center space-x-2"
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {faqCategories.map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <category.icon className="h-6 w-6 mr-2 text-primary" />
                        {category.title}
                      </CardTitle>
                      <CardDescription>
                        Common questions about {category.title.toLowerCase()} topics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.questions.map((faq, index) => (
                          <AccordionItem key={index} value={index.toString()} className="border rounded-lg px-4">
                            <AccordionTrigger className="text-left hover:no-underline">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <MessageCircle className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is available 24/7 
            to help you with any questions or issues you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Support <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/support">
                Open Support Ticket
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
