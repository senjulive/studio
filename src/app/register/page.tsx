import { RegisterForm } from "@/components/auth/register-form";
import { AstralLogo } from '@/components/icons/astral-logo';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - AstralCore",
    description: "Create your AstralCore account.",
};

export default function RegisterPage() {
  return (
    <div className="container">
      <header className="qn-header">
        <div className="qn-logo">
          <AstralLogo className="h-8 w-8 mr-2" />
          AstralCore
        </div>
        <div className="auth-buttons">
          <span style={{color: 'var(--qn-light)'}}>Already have an account?</span>
          <a href="/login" className="qn-btn qn-btn-outline">Login</a>
        </div>
      </header>

      <main className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="qn-main-content" style={{maxWidth: '400px', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '32px', fontWeight: '700', marginBottom: '10px'}}>
              Join AstralCore
            </h1>
            <p style={{color: 'var(--qn-secondary)'}}>
              Start your crypto trading journey today
            </p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
