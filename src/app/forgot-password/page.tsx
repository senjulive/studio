import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Forgot Password - AstralCore",
    description: "Reset your AstralCore account password securely with quantum-encrypted recovery.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-dvh bg-background overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-yellow-500/10 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-red-500/10 rounded-full blur-2xl animate-pulse delay-1500" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-orange-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content with improved mobile layout */}
      <div className="flex min-h-dvh items-center justify-center mobile-padding py-8">
        <div className="w-full max-w-md animate-fade-in">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
