import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-blue-950/20 to-purple-950/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      
      <Card className="relative z-10 w-full max-w-lg text-center border-border/50 bg-background/80 backdrop-blur-sm">
        <CardHeader className="space-y-6">
          {/* Logo and Error Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-4 rounded-lg border border-primary/20">
                <AstralLogo className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                404
              </h1>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
            </div>
          </div>
          
          <CardDescription className="text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different location.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          
          {/* Search Suggestion */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>
                Try searching for what you need or navigate back to the{' '}
                <Link href="/" className="text-primary hover:underline font-medium">
                  home page
                </Link>
              </span>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <AstralLogo className="h-4 w-4" />
              <span>AstralCore Quantum Nexus v3.76</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
