import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  ArrowRight, 
  Check, 
  X, 
  Zap, 
  Crown, 
  Shield,
  Users,
  Bot,
  BarChart3,
  Headphones,
  Clock,
  Star
} from 'lucide-react';
import { useState } from 'react';

export const metadata: Metadata = {
  title: "Pricing - AstralCore",
  description: "Choose the perfect AstralCore plan for your trading needs. From free starter plans to enterprise solutions with unlimited features.",
};

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin, Ethereum, and USDT."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full."
  },
  {
    question: "Is there enterprise pricing?",
    answer: "Yes, we offer custom enterprise pricing for teams with special requirements. Contact our sales team for a personalized quote."
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for crypto newcomers",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Zap,
      features: [
        "1 trading bot",
        "Basic grid trading",
        "Email support",
        "Mobile app access",
        "Basic analytics",
        "Standard execution speed"
      ],
      limitations: [
        "No advanced strategies",
        "Limited market data",
        "No API access"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      description: "For serious crypto traders",
      monthlyPrice: 49,
      yearlyPrice: 39,
      icon: Crown,
      features: [
        "5 trading bots",
        "Advanced grid strategies",
        "Priority email support",
        "Real-time market data",
        "Advanced analytics",
        "Fast execution speed",
        "API access",
        "Portfolio tracking",
        "Risk management tools",
        "Custom indicators"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For institutions and teams",
      monthlyPrice: 199,
      yearlyPrice: 159,
      icon: Shield,
      features: [
        "Unlimited trading bots",
        "All trading strategies",
        "24/7 phone support",
        "Dedicated account manager",
        "Ultra-fast execution",
        "Full analytics suite",
        "Advanced API access",
        "White-label options",
        "Custom integrations",
        "Priority feature requests",
        "Multi-user management",
        "Advanced reporting"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const allFeatures = [
    {
      feature: "Trading Bots",
      starter: "1",
      pro: "5",
      enterprise: "Unlimited"
    },
    {
      feature: "Grid Trading Strategies",
      starter: "Basic",
      pro: "Advanced",
      enterprise: "All Strategies"
    },
    {
      feature: "Market Data",
      starter: "Delayed",
      pro: "Real-time",
      enterprise: "Real-time + Premium"
    },
    {
      feature: "Execution Speed",
      starter: "Standard",
      pro: "Fast",
      enterprise: "Ultra-fast"
    },
    {
      feature: "API Access",
      starter: false,
      pro: true,
      enterprise: true
    },
    {
      feature: "Portfolio Analytics",
      starter: "Basic",
      pro: "Advanced",
      enterprise: "Full Suite"
    },
    {
      feature: "Support",
      starter: "Email",
      pro: "Priority Email",
      enterprise: "24/7 Phone + Dedicated Manager"
    },
    {
      feature: "Custom Integrations",
      starter: false,
      pro: false,
      enterprise: true
    },
    {
      feature: "Multi-user Access",
      starter: false,
      pro: false,
      enterprise: true
    },
    {
      feature: "White-label Options",
      starter: false,
      pro: false,
      enterprise: true
    }
  ];

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
            Pricing Plans
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Choose Your
            <span className="text-primary"> Trading Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale up as you grow. All plans include our core features 
            with no hidden fees or setup costs.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch 
              checked={isYearly} 
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <plan.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    {isYearly && plan.yearlyPrice !== plan.monthlyPrice && (
                      <div className="text-sm text-muted-foreground">
                        Billed annually (${plan.yearlyPrice * 12}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full mb-6" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                      {plan.cta}
                      {plan.name !== "Enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide">Included Features</h4>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-sm uppercase tracking-wide pt-4">Limitations</h4>
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-center text-sm text-muted-foreground">
                            <X className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Starter</th>
                  <th className="text-center py-3 px-4 font-semibold">Pro</th>
                  <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.starter === 'boolean' ? 
                        (row.starter ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />) :
                        row.starter
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.pro === 'boolean' ? 
                        (row.pro ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />) :
                        row.pro
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? 
                        (row.enterprise ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-500 mx-auto" />) :
                        row.enterprise
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust AstralCore with their cryptocurrency investments. 
            Start with our free plan and upgrade as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Sales
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
