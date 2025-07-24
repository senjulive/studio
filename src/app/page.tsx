
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background animate-in fade-in-50 duration-1000 overflow-hidden">
      <div className="relative">
        <div className="absolute -bottom-1/4 -left-1/4 w-[150px] h-[150px] z-0 hidden md:block opacity-50 blur-sm">
            <dotlottie-wc 
                src="https://lottie.host/d510a415-f962-4b02-9335-747023e45903/RLAi1VFiEq.lottie" 
                style={{width: '150px', height: '150px'}} 
                speed="1" 
                autoplay 
                loop>
            </dotlottie-wc>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
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
      </div>
    </main>
  );
}
