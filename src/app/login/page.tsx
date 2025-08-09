import { LoginForm } from "@/components/auth/login-form";
import { AstralLogo } from '@/components/icons/astral-logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen" style={{
      background: 'var(--qn-darker)',
      color: 'var(--qn-light)',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(110, 0, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 20%)
      `
    }}>
      <div className="container">
        <header className="qn-header">
          <div className="qn-logo">
            <AstralLogo className="h-8 w-8 mr-2" />
            AstralCore
          </div>
          <div className="auth-buttons">
            <span style={{color: 'var(--qn-light)', fontSize: '14px'}}>Don't have an account?</span>
            <a href="/register" className="qn-btn qn-btn-primary">Register</a>
          </div>
        </header>
        
        <main className="flex min-h-[80vh] items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
              <AstralLogo className="h-20 w-20 mx-auto mb-4 animate-pulse" />
              <h1 style={{
                fontSize: '28px', 
                fontWeight: '700', 
                marginBottom: '8px',
                background: 'linear-gradient(90deg, var(--qn-primary), var(--qn-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome Back
              </h1>
              <p style={{color: 'var(--qn-secondary)', fontSize: '16px'}}>
                Sign in to your AstralCore account
              </p>
            </div>
            
            <div className="qn-main-content" style={{
              background: 'linear-gradient(135deg, rgba(110, 0, 255, 0.1), rgba(0, 247, 255, 0.05))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                content: '',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(to bottom right, rgba(0, 255, 255, 0) 0%, rgba(0, 255, 255, 0) 30%, rgba(0, 255, 255, 0.05) 45%, rgba(0, 255, 255, 0) 60%, rgba(0, 255, 255, 0) 100%)',
                transform: 'rotate(30deg)',
                animation: 'shine 6s infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={{position: 'relative', zIndex: 1}}>
                <LoginForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
