import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AstralLogo } from '@/components/icons/astral-logo';
import { FileText, AlertTriangle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: "Terms of Service - AstralCore",
  description: "AstralCore Terms of Service - Legal terms and conditions for using our cryptocurrency trading platform.",
};

export default function TermsPage() {
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
            <Link href="/privacy">
              <Button variant="ghost">Privacy Policy</Button>
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

      {/* Header */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <Scale className="h-8 w-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: January 1, 2024</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Important Notice</p>
                <p className="text-amber-700 dark:text-amber-300">
                  Please read these terms carefully before using AstralCore. By accessing our platform, 
                  you agree to be bound by these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  By accessing and using AstralCore ("the Platform," "our Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our cryptocurrency trading platform operated by AstralCore Inc. ("we," "us," or "our").
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AstralCore provides an automated cryptocurrency trading platform that utilizes algorithmic trading strategies, including but not limited to grid trading, to execute trades on behalf of users. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automated trading bot services</li>
                  <li>Portfolio management tools</li>
                  <li>Market analysis and reporting</li>
                  <li>API access for advanced users</li>
                  <li>Educational resources and support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>3. User Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To use our services, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into this agreement</li>
                  <li>Not be prohibited from using our services under applicable laws</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Not be located in a jurisdiction where our services are prohibited</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>4. Account Registration and Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for keeping your account information up to date.
                </p>
                <p>
                  You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use strong, unique passwords for your account</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Keep your login credentials confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>5. Trading Risks and Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
                  <p className="font-medium text-red-800 dark:text-red-200 mb-2">High Risk Warning</p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. 
                    Past performance does not guarantee future results.
                  </p>
                </div>
                <p>
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All trading involves risk and you may lose some or all of your investment</li>
                  <li>Cryptocurrency markets are highly volatile and unpredictable</li>
                  <li>Our algorithms do not guarantee profits or prevent losses</li>
                  <li>You should only invest funds you can afford to lose</li>
                  <li>Past performance is not indicative of future results</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>6. Fees and Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our fee structure is transparent and clearly displayed on our pricing page. Fees may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Monthly or annual subscription fees</li>
                  <li>Exchange trading fees (charged by exchanges, not us)</li>
                  <li>Network transaction fees for cryptocurrency transfers</li>
                </ul>
                <p>
                  We reserve the right to change our fees with 30 days' notice. Continued use of our services after fee changes constitutes acceptance of the new fees.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>7. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of AstralCore Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
                <p>
                  You may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Copy, modify, or create derivative works of our platform</li>
                  <li>Reverse engineer or attempt to extract our algorithms</li>
                  <li>Use our trademarks without written permission</li>
                  <li>Distribute or commercially exploit our content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>8. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Using the service for any illegal purposes or to violate any laws</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting our services</li>
                  <li>Creating false or misleading accounts</li>
                  <li>Engaging in market manipulation or fraudulent activities</li>
                  <li>Using automated systems to access our platform (except our API)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>9. Data Protection and Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>10. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To the maximum extent permitted by law, AstralCore Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  Our total liability to you for all damages shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>11. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  You may terminate your account at any time by contacting our support team. Upon termination, your right to use the Service will cease immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>12. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  These Terms shall be interpreted and governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>13. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                <p>
                  Your continued use of our Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>Email: legal@astralcore.io</li>
                  <li>Address: 123 Wall Street, Floor 15, New York, NY 10005</li>
                  <li>Phone: +1 (555) 123-4567</li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; 2024 AstralCore. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
