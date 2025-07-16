'use client';

import * as React from 'react';
import {Loader2} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ModeratorProvider} from '@/contexts/ModeratorContext';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from 'next/navigation';
import {AdminLoginForm} from '../admin/admin-login-form';
import {getModeratorStatus} from '@/lib/moderator';

export function ModeratorAuth({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<
    'loading' | 'authed' | 'unauthed'
  >('loading');
  const [permissions, setPermissions] = React.useState(null);

  React.useEffect(() => {
    const checkModerator = async () => {
      const supabase = createClient();
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (user) {
        const modStatus = await getModeratorStatus(user.id);
        if (modStatus && modStatus.status === 'active') {
          setAuthStatus('authed');
          setPermissions(modStatus.permissions);
        } else {
          setAuthStatus('unauthed');
          router.push('/dashboard'); // Not a mod, or not active
        }
      } else {
        setAuthStatus('unauthed');
        router.push('/'); // Not logged in
      }
    };

    checkModerator();
  }, [router]);

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
