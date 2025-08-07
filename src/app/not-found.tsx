import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <AstralLogo className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-white/90">Page Not Found</h2>
          <p className="text-white/70 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-white/50 text-sm">
          Need help? Contact our{' '}
          <Link href="/dashboard/support" className="text-cyan-400 hover:text-cyan-300 underline">
            support team
          </Link>
        </p>
      </div>
    </div>
  );
}
