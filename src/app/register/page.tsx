import { RegisterForm } from "@/components/auth/register-form";
import { AstralLogo } from '@/components/icons/astral-logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - AstralCore",
    description: "Create your AstralCore account.",
};

export default function RegisterPage() {
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
              Join AstralCore
            </h1>
            <p className="text-white/80 text-sm">
              Start your AI-powered crypto trading journey
            </p>
          </div>
        </div>

        {/* Registration Form Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
          <RegisterForm />
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-2">
          <p className="text-white/70 text-xs">
            Join thousands of traders using quantum AI technology
          </p>
          <p className="text-white/60 text-xs">
            Secured with military-grade encryption
          </p>
        </div>
      </div>
    </main>
  );
}
