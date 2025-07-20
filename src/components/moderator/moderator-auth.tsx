
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
import {getModeratorStatus} from '@/lib/moderator';
import { useUser } from '@/contexts/UserContext';

export function ModeratorAuth({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const { user } = useUser();
  const [authStatus, setAuthStatus] = React.useState<
    'loading' | 'authed' | 'unauthed'
  >('loading');
  const [permissions, setPermissions] = React.useState(null);

  React.useEffect(() => {
    const checkModerator = async () => {
      if (user) {
        // Since Supabase auth is gone, we can't get a real user object from server
        // This is a placeholder for where you would check moderator status
        // For now, let's assume the mock user is NOT a moderator
        const modStatus = await getModeratorStatus(user.id);
        if (modStatus && modStatus.status === 'active') {
          setAuthStatus('authed');
          setPermissions(modStatus.permissions);
        } else {
          setAuthStatus('unauthed');
          router.push('/dashboard'); // Not a mod, or not active
        }
      } else {
        // If no user, definitely unauthed.
        setAuthStatus('unauthed');
        router.push('/');
      }
    };

    checkModerator();
  }, [router, user]);

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
      <ModeratorProvider permissions={permissions}>{children}</ModeratorProvider>
    );
  }

  // Fallback, should be redirected
  return null;
}
