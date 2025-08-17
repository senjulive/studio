import { LoginForm } from '@/components/auth/login-form';
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - AstralCore',
  description: 'Sign in to your AstralCore crypto trading account',
};

export default function LoginPage() {
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
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access your trading dashboard
            </p>
          </div>

          {/* Login form card */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <LoginForm />
          </div>

          {/* Footer links */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                Forgot Password?
              </Link>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                New to AstralCore?{' '}
                <Link href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 AstralCore. Advanced Crypto Trading Platform.
        </p>
      </footer>
    </div>
  );
}
