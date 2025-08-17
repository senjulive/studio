import { AstralLogo } from '@/components/icons/astral-logo';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6">
      {/* Logo section */}
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <AstralLogo className="h-20 w-20 text-primary" />
        </div>

        {/* Loading content */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-xl font-semibold text-foreground">AstralCore</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Preparing your crypto trading platform...
          </p>
        </div>

        {/* Loading animation */}
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-secondary rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-accent rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
