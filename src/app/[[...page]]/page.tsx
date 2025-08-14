// src/app/[[...page]]/page.tsx
import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/render-builder-content';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight } from 'lucide-react';

// Replace with your public API key
builder.init('your-builder-io-api-key-here');

interface PageProps {
  params: {
    page?: string[];
  };
}

function WelcomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background animate-in fade-in-50 duration-1000">
      <div className="flex flex-col items-center gap-6">
        <AstralLogo className="h-40 w-40 animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Welcome to AstralCore
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Your intelligent crypto management platform. Our sophisticated trading bot employs Grid Trading to turn market volatility into consistent, automated profits for you.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/login">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default async function Page(props: PageProps) {
  const urlPath = '/' + (props.params.page?.join('/') || '');

  // Handle root route specifically
  if (urlPath === '/') {
    return <WelcomePage />;
  }

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
    })
    .toPromise();

  return <RenderBuilderContent content={content} />;
}
