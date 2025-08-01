import { LoginForm } from "@/components/auth/login-form";
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <AstralLogo className="h-16 w-16 mx-auto text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm">
              Access your AstralCore trading platform
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
          <LoginForm />
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-white/70 text-xs">
            Secured by quantum encryption technology
          </p>
        </div>
      </div>
    </main>
  );
}
