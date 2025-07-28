import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: "Privacy Policy - AstralCore",
  description: "AstralCore Privacy Policy - How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
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
            <Link href="/terms">
              <Button variant="ghost">Terms of Service</Button>
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
            <Shield className="h-8 w-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 1, 2024</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Privacy Matters</p>
                <p className="text-blue-700 dark:text-blue-300">
                  We are committed to protecting your privacy and being transparent about how we collect, 
                  use, and protect your personal information.
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
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AstralCore Inc. ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency trading platform.
                </p>
                <p>
                  This policy applies to all users of our services, including our website, mobile applications, and API services.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>2. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Personal Information</h4>
                <p>When you register for an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Phone number (optional)</li>
                  <li>Country of residence</li>
                  <li>Identity verification documents (for compliance purposes)</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                </ul>

                <h4 className="font-semibold">Trading Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Exchange API keys and trading permissions</li>
                  <li>Trading history and performance data</li>
                  <li>Portfolio information and balances</li>
                  <li>Trading bot configurations and strategies</li>
                </ul>

                <h4 className="font-semibold">Technical Information</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and geolocation data</li>
                  <li>Device information and browser type</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Error logs and performance metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>3. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use your personal information for the following purposes:</p>
                
                <h4 className="font-semibold">Service Provision</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Creating and managing your account</li>
                  <li>Executing automated trading strategies</li>
                  <li>Providing customer support and assistance</li>
                  <li>Processing payments and managing subscriptions</li>
                </ul>

                <h4 className="font-semibold">Security and Compliance</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verifying your identity and preventing fraud</li>
                  <li>Complying with legal and regulatory requirements</li>
                  <li>Monitoring for suspicious activities</li>
                  <li>Protecting against security threats</li>
                </ul>

                <h4 className="font-semibold">Communication and Marketing</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sending important service notifications</li>
                  <li>Providing trading updates and market insights</li>
                  <li>Marketing communications (with your consent)</li>
                  <li>Responding to your inquiries and feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>4. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                
                <h4 className="font-semibold">Service Providers</h4>
                <p>We work with trusted third-party providers who assist us in:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processing and billing</li>
                  <li>Identity verification services</li>
                  <li>Cloud hosting and data storage</li>
                  <li>Customer support and communication</li>
                </ul>

                <h4 className="font-semibold">Legal Requirements</h4>
                <p>We may disclose your information when required by law or to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with legal processes and court orders</li>
                  <li>Respond to government requests and investigations</li>
                  <li>Protect our rights and property</li>
                  <li>Ensure user safety and prevent fraud</li>
                </ul>

                <h4 className="font-semibold">Business Transfers</h4>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>5. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We implement industry-standard security measures to protect your information:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-primary" />
                      Encryption
                    </h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>256-bit SSL/TLS encryption</li>
                      <li>End-to-end data encryption</li>
                      <li>Encrypted data storage</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      Access Controls
                    </h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Multi-factor authentication</li>
                      <li>Role-based access controls</li>
                      <li>Regular access reviews</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-primary" />
                      Monitoring
                    </h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>24/7 security monitoring</li>
                      <li>Intrusion detection systems</li>
                      <li>Regular security audits</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-primary" />
                      Compliance
                    </h4>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>SOC 2 Type II certified</li>
                      <li>GDPR compliant</li>
                      <li>Regular penetration testing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>6. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                
                <h4 className="font-semibold">Access and Portability</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access to your personal data</li>
                  <li>Receive a copy of your data in a portable format</li>
                  <li>Request information about how we process your data</li>
                </ul>

                <h4 className="font-semibold">Correction and Deletion</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Restrict processing of your data</li>
                </ul>

                <h4 className="font-semibold">Marketing and Communications</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Object to automated decision-making</li>
                </ul>

                <p className="text-sm text-muted-foreground">
                  To exercise these rights, please contact us at privacy@astralcore.io. 
                  We will respond to your request within 30 days.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We retain your personal information only as long as necessary for the purposes outlined in this policy:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Retained while your account is active and for 7 years after closure for compliance purposes</li>
                  <li><strong>Trading Data:</strong> Retained for 7 years for regulatory compliance and tax reporting</li>
                  <li><strong>Communication Records:</strong> Retained for 3 years for support and legal purposes</li>
                  <li><strong>Technical Logs:</strong> Retained for 1 year for security and performance monitoring</li>
                </ul>

                <p>
                  When data is no longer needed, we securely delete or anonymize it to prevent unauthorized access.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>8. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AstralCore operates globally, and your information may be transferred to and processed in countries other than your own. We ensure that all international transfers comply with applicable data protection laws through:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions for countries with sufficient data protection</li>
                  <li>Binding Corporate Rules for transfers within our organization</li>
                  <li>Your explicit consent where required</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>9. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use cookies and similar technologies to enhance your experience:</p>
                
                <h4 className="font-semibold">Essential Cookies</h4>
                <p>Required for the basic functionality of our platform, including authentication and security.</p>

                <h4 className="font-semibold">Analytics Cookies</h4>
                <p>Help us understand how you use our platform to improve performance and user experience.</p>

                <h4 className="font-semibold">Marketing Cookies</h4>
                <p>Used to deliver relevant advertisements and track marketing campaign effectiveness.</p>

                <p className="text-sm text-muted-foreground">
                  You can manage your cookie preferences through your browser settings or our cookie consent manager.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>10. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>11. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending you an email notification</li>
                  <li>Displaying a prominent notice on our platform</li>
                </ul>

                <p>
                  Your continued use of our services after the effective date of the revised policy constitutes acceptance of the changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">General Inquiries</h4>
                    <ul className="list-none space-y-1 text-sm">
                      <li>Email: privacy@astralcore.io</li>
                      <li>Phone: +1 (555) 123-4567</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                    <ul className="list-none space-y-1 text-sm">
                      <li>Email: dpo@astralcore.io</li>
                      <li>Address: 123 Wall Street, Floor 15</li>
                      <li>New York, NY 10005</li>
                    </ul>
                  </div>
                </div>
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
