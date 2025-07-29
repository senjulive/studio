import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center p-8 text-center overflow-hidden animate-in fade-in-50 duration-1000">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F547bea7077f3495ea179349fa01e8526?format=webp&width=1920')`
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <AstralLogo className="h-40 w-40 animate-pulse drop-shadow-2xl" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
          Welcome to AstralCore
        </h1>
        <p className="max-w-2xl text-lg text-gray-200 drop-shadow-md">
          Your intelligent crypto management platform. Our sophisticated trading bot employs Grid Trading to turn market volatility into consistent, automated profits for you.
        </p>
        <Button asChild size="lg" className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl">
          <Link href="/login">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
