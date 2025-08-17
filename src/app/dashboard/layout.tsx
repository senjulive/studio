'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import dynamic from 'next/dynamic';

// Import only essential components
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';

// Dynamically import complex components to avoid build issues
const Avatar = dynamic(() => import('@/components/ui/avatar').then(mod => ({ default: mod.Avatar })), {
  loading: () => <div className="h-10 w-10 rounded-full bg-muted" />,
  ssr: false
});
const AvatarFallback = dynamic(() => import('@/components/ui/avatar').then(mod => ({ default: mod.AvatarFallback })), {
  loading: () => <div className="h-10 w-10 rounded-full bg-muted" />,
  ssr: false
});
const AvatarImage = dynamic(() => import('@/components/ui/avatar').then(mod => ({ default: mod.AvatarImage })), {
  loading: () => <div className="h-10 w-10 rounded-full bg-muted" />,
  ssr: false
});

const AstralLogo = dynamic(() => import('@/components/icons/astral-logo').then(mod => ({ default: mod.AstralLogo })), {
  loading: () => <div className="h-8 w-8 bg-primary rounded" />,
  ssr: false
});

// Mock user data
const mockUser = {
  id: 'mock-user-123',
  email: 'user@example.com',
};

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground">
      <div className="h-16 w-16 rounded-full bg-primary animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const initializeUser = async () => {
      try {
        const loggedInEmail = sessionStorage.getItem('loggedInEmail') || mockUser.email;
        const currentUser = { ...mockUser, email: loggedInEmail };
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
      await logout();
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
    return <DashboardLoading />;
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <React.Suspense fallback={<div className="h-6 w-6 bg-primary rounded" />}>
                <AstralLogo className="h-6 w-6" />
              </React.Suspense>
              <span className="font-bold">AstralCore</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {menuItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <h1 className="text-lg font-semibold md:hidden">
                {getPageTitle()}
              </h1>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <React.Suspense fallback={<div className="h-8 w-8 rounded-full bg-muted" />}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </React.Suspense>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:inline-flex"
              >
                Logout
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-background border-l p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  ×
                </Button>
              </div>
              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start"
                >
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container py-6 pb-20">
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
        </div>
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 text-xs transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="h-6 w-6 mb-1 bg-current rounded opacity-60" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
