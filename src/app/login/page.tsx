import { LoginForm } from "@/components/auth/login-form";
import { AstralLogo } from '@/components/icons/astral-logo';

export default function LoginPage() {
  return (
    <div className="container">
      <header className="qn-header">
        <div className="qn-logo">
          <AstralLogo className="h-8 w-8 mr-2" />
          AstralCore
        </div>
        <div className="auth-buttons">
          <span style={{color: 'var(--qn-light)'}}>Don't have an account?</span>
          <a href="/register" className="qn-btn qn-btn-primary">Register</a>
        </div>
      </header>

      <main className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="qn-main-content" style={{maxWidth: '400px', width: '100%'}}>
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '32px', fontWeight: '700', marginBottom: '10px'}}>
              Welcome Back
            </h1>
            <p style={{color: 'var(--qn-secondary)'}}>
              Sign in to your Quantum Ninja account
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
