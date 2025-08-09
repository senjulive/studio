import Link from 'next/link';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
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
            <Link href="/login" className="qn-btn qn-btn-outline">Login</Link>
            <Link href="/register" className="qn-btn qn-btn-primary">Register</Link>
          </div>
        </header>

        <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center gap-8 max-w-4xl">
            <div className="relative">
              <AstralLogo className="h-40 w-40 animate-pulse" />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '160px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(110, 0, 255, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
                zIndex: -1
              }}></div>
            </div>
            
            <div className="space-y-4">
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '700',
                lineHeight: '1.1',
                background: 'linear-gradient(90deg, var(--qn-primary), var(--qn-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px'
              }}>
                Welcome to AstralCore
              </h1>
              
              <p style={{
                fontSize: '1.25rem',
                color: 'var(--qn-light)',
                opacity: '0.9',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Your intelligent crypto management platform. Our sophisticated trading bot employs 
                <span style={{color: 'var(--qn-secondary)', fontWeight: '600'}}> Grid Trading </span>
                to turn market volatility into consistent, automated profits for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                href="/login" 
                className="qn-btn qn-btn-primary"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minWidth: '200px'
                }}
              >
                Get Started <ArrowRight style={{width: '20px', height: '20px'}} />
              </Link>
              
              <Link 
                href="/about" 
                className="qn-btn qn-btn-outline"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  minWidth: '200px'
                }}
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
              <div className="qn-stat-card" style={{textAlign: 'center', padding: '24px'}}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '12px'
                }}>🤖</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--qn-secondary)'
                }}>AI-Powered Trading</h3>
                <p style={{color: 'var(--qn-light)', opacity: '0.8'}}>
                  Advanced algorithms optimize your trading strategies automatically
                </p>
              </div>

              <div className="qn-stat-card" style={{textAlign: 'center', padding: '24px'}}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '12px'
                }}>⚡</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--qn-secondary)'
                }}>Lightning Fast</h3>
                <p style={{color: 'var(--qn-light)', opacity: '0.8'}}>
                  Execute trades in milliseconds with our high-performance infrastructure
                </p>
              </div>

              <div className="qn-stat-card" style={{textAlign: 'center', padding: '24px'}}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '12px'
                }}>🔒</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--qn-secondary)'
                }}>Secure & Safe</h3>
                <p style={{color: 'var(--qn-light)', opacity: '0.8'}}>
                  Bank-level security protocols protect your assets and data
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
