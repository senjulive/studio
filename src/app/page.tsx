
import { redirect } from 'next/navigation';
import { LoginForm } from "@/components/auth/login-form";
import { createClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return redirect('/dashboard');
  }

  return (
    <main
      className="flex min-h-dvh items-center justify-center p-4"
    >
      <LoginForm />
    </main>
  );
}
