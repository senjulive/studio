'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  Shield,
  Headphones
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@astralcore.io",
    availability: "24/7"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Enterprise customers only",
    contact: "+1 (555) 123-4567",
    availability: "Mon-Fri 9AM-6PM EST"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Instant help",
    contact: "Available in app",
    availability: "24/7"
  }
];

const offices = [
  {
    city: "New York",
    address: "123 Wall Street, Floor 15\nNew York, NY 10005",
    phone: "+1 (555) 123-4567"
  },
  {
    city: "London",
    address: "45 Finsbury Square\nLondon EC2A 1PX, UK",
    phone: "+44 20 7123 4567"
  },
  {
    city: "Singapore",
    address: "1 Raffles Place, Level 20\nSingapore 048616",
    phone: "+65 6123 4567"
  }
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
      inquiryType: ''
    });

    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Have questions about AstralCore? Need help with your account? 
            Our team is here to help you succeed with your crypto trading journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <method.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{method.contact}</p>
                  <p className="text-sm text-muted-foreground">{method.availability}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select 
                      value={formData.inquiryType} 
                      onValueChange={(value) => handleInputChange('inquiryType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales Inquiry</SelectItem>
                        <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="press">Press & Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-primary" />
                    Our Offices
                  </CardTitle>
                  <CardDescription>
                    We have offices around the world to serve you better.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <h3 className="font-semibold text-lg">{office.city}</h3>
                      <p className="text-muted-foreground whitespace-pre-line mb-2">
                        {office.address}
                      </p>
                      <p className="text-sm font-medium">{office.phone}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Email Support</span>
                      <span className="text-muted-foreground">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Chat</span>
                      <span className="text-muted-foreground">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone Support</span>
                      <span className="text-muted-foreground">Mon-Fri 9AM-6PM EST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Need a custom solution for your organization? Our enterprise team can help 
              you build the perfect crypto trading infrastructure for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/enterprise">
                  Learn More About Enterprise
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
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
