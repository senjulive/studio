'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

// Completely self-contained layout with no external imports
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const initializeUser = async () => {
      try {
        const loggedInEmail = sessionStorage.getItem('loggedInEmail') || 'user@example.com';
        const currentUser = { id: 'mock-user-123', email: loggedInEmail };
        setUser(currentUser);
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setIsInitializing(false);
      }
    };
    initializeUser();
  }, []);

  const menuItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/market', label: 'Market' },
    { href: '/dashboard/trading', label: 'Trading' },
    { href: '/dashboard/deposit', label: 'Deposit' },
    { href: '/dashboard/withdraw', label: 'Withdraw' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/support', label: 'Support' },
  ];

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('loggedInEmail');
      // Clear authentication cookies
      document.cookie = 'logged-in-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const getPageTitle = () => {
    const currentPath = pathname || '/dashboard';
    if (currentPath === '/dashboard') return 'Home';
    const pathParts = currentPath.split('/');
    return pathParts[pathParts.length - 1]?.replace('-', ' ') || 'Dashboard';
  };

  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0a',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            animation: 'pulse 2s infinite',
          }}
        />
        <p style={{ marginTop: '16px', fontSize: '18px', fontWeight: '600' }}>
          Loading Your Dashboard
        </p>
        <p style={{ color: '#888', fontSize: '14px' }}>Please wait a moment...</p>
      </div>
    );
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          borderBottom: '1px solid #333',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            height: '56px',
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <div style={{ marginRight: '16px', display: 'flex' }}>
            <Link
              href="/dashboard"
              style={{
                marginRight: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>AstralCore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            className="desktop-nav"
          >
            {menuItems.slice(0, 5).map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: pathname === item.href ? '#ffffff' : '#888',
                  transition: 'color 0.2s',
                  padding: '8px 0',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e =>
                  (e.currentTarget.style.color = pathname === item.href ? '#ffffff' : '#888')
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div style={{ width: '100%', flex: 1 }}>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  display: 'block',
                }}
                className="mobile-title"
              >
                {getPageTitle()}
              </h1>
            </div>

            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {userInitial}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'none',
                }}
                className="desktop-button"
                onMouseEnter={e => (e.currentTarget.style.background = '#333')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Logout
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'block',
                }}
                className="mobile-button"
                onMouseEnter={e => (e.currentTarget.style.background = '#333')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} className="mobile-overlay">
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100%',
              width: '300px',
              background: '#111',
              borderLeft: '1px solid #333',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ fontWeight: '600' }}>Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      background: pathname === item.href ? '#8b5cf6' : 'transparent',
                      color: pathname === item.href ? '#ffffff' : '#888',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (pathname !== item.href) {
                        e.currentTarget.style.background = '#333';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (pathname !== item.href) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#888';
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    background: 'transparent',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#333';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }}
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px' }}>
        <div style={{ marginBottom: '24px' }} className="desktop-title">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.02em' }}>
            {getPageTitle()}
          </h1>
        </div>
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: '#111',
          borderTop: '1px solid #333',
        }}
        className="mobile-nav"
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px' }}>
          {menuItems.slice(0, 5).map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px',
                fontSize: '11px',
                textDecoration: 'none',
                color: pathname === item.href ? '#8b5cf6' : '#888',
                transition: 'color 0.2s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  marginBottom: '4px',
                  borderRadius: '4px',
                  background: pathname === item.href ? '#8b5cf6' : '#333',
                  opacity: 0.6,
                }}
              />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* CSS for responsive behavior */}
      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-button {
            display: inline-flex !important;
          }
          .desktop-title {
            display: block !important;
          }
          .mobile-title {
            display: none !important;
          }
          .mobile-button {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
          .mobile-overlay {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-button {
            display: none !important;
          }
          .desktop-title {
            display: none !important;
          }
          .mobile-title {
            display: block !important;
          }
          .mobile-button {
            display: block !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
