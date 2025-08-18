'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { loginSchema } from '@/lib/validators';
import { login } from '@/lib/auth';

type LoginFormValues = z.infer<typeof loginSchema>;

const REMEMBERED_EMAIL_KEY = 'astralcore_remembered_email';

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (rememberedEmail) {
        form.setValue('email', rememberedEmail);
        form.setValue('rememberMe', true);
      }
    }
  }, [form]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    if (typeof window !== 'undefined') {
      if (values.rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      // Store email in session storage to determine role in dashboard layout
      sessionStorage.setItem('loggedInEmail', values.email);
    }

    const { error } = await login(values);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error,
        variant: 'destructive',
      });
    } else {
      // Set authentication cookie for middleware
      if (typeof window !== 'undefined') {
        document.cookie = `logged-in-email=${values.email}; path=/; max-age=86400; secure; samesite=strict`;
        document.cookie = `auth-token=mock-token-${Date.now()}; path=/; max-age=86400; secure; samesite=strict`;
      }

      toast({
        title: 'Login Successful',
        description: 'Welcome to AstralCore!',
      });

      // Small delay to ensure cookies are set
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  className="h-12 bg-background border-border focus:border-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-12 bg-background border-border focus:border-primary transition-colors pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
