'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'moderator' | 'user')[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export function RouteGuard({ 
  children, 
  allowedRoles = ['user'], 
  redirectTo,
  requireAuth = true 
}: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    setIsChecking(true);

    // If auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const destination = redirectTo || '/login';
      router.push(`${destination}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // If user is authenticated but doesn't have required role
    if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      let destination = redirectTo;
      
      if (!destination) {
        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            destination = '/admin';
            break;
          case 'moderator':
            destination = '/moderator';
            break;
          default:
            destination = '/dashboard';
            break;
        }
      }
      
      router.push(destination);
      return;
    }

    setIsChecking(false);
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, requireAuth, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're here, user has proper access
  return <>{children}</>;
}
