import { AstralLogo } from '@/components/icons/astral-logo';

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
          <AstralLogo className="relative h-16 w-16 sm:h-20 sm:w-20 drop-shadow-2xl animate-pulse" />
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Loading AstralCore</h2>
          <p className="text-sm text-muted-foreground">Preparing your trading dashboard...</p>
        </div>
        
        {/* Loading spinner */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
