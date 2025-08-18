import { RegisterForm } from '@/components/auth/register-form';
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - AstralCore',
  description: 'Join AstralCore and start your crypto trading journey',
};

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border/50">
        <Link href="/" className="flex items-center space-x-3">
          <AstralLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold text-foreground">AstralCore</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Welcome section */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-foreground">Join AstralCore</h1>
            <p className="text-muted-foreground text-sm">
              Create your account and start trading crypto
            </p>
          </div>

          {/* Register form card */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <RegisterForm />
          </div>

          {/* Benefits section */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Why choose AstralCore?</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>AI-powered trading bots</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span>Real-time market analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>Secure portfolio management</span>
              </li>
            </ul>
          </div>

          {/* Footer links */}
          <div className="text-center space-y-4">
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </footer>
    </div>
  );
}
