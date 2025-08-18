import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
