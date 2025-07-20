
'use client';

import * as React from 'react';
import {Loader2} from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ModeratorProvider} from '@/contexts/ModeratorContext';
import {useRouter} from 'next/navigation';
import { ModeratorLoginForm } from './moderator-login-form';

export function ModeratorAuth({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<
    'loading' | 'authed' | 'unauthed'
  >('unauthed');

  React.useEffect(() => {
    setAuthStatus('unauthed');
  }, []);
  
  const handleLoginSuccess = () => {
    setAuthStatus('authed');
    router.refresh();
  };

  if (authStatus === 'loading') {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <CardTitle>Verifying Access</CardTitle>
          <CardDescription>
            Please wait while we check your moderator permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (authStatus === 'authed') {
    return (
      <ModeratorProvider permissions={{ customer_support: true, user_verification: true, deposit_approval: true }}>{children}</ModeratorProvider>
    );
  }

  return <ModeratorLoginForm onLoginSuccess={handleLoginSuccess} />;
}
