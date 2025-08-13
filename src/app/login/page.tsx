import { LoginForm } from '@/components/auth/login-form';
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="relative z-10 flex flex-col min-h-dvh">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2">
            <AstralLogo className="h-8 w-8" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AstralCore
            </span>
          </Link>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            {/* Welcome section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your AstralCore account</p>
            </div>

            {/* Login form */}
            <LoginForm />

            {/* Footer links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
