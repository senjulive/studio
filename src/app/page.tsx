import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'AstralCore - Advanced Crypto Trading Platform',
  description: 'Professional cryptocurrency trading platform with AI-powered bots, real-time analytics, and comprehensive portfolio management.',
  keywords: 'crypto, trading, bitcoin, cryptocurrency, AI trading, portfolio management',
  openGraph: {
    title: 'AstralCore - Advanced Crypto Trading Platform',
    description: 'Professional cryptocurrency trading platform with AI-powered bots, real-time analytics, and comprehensive portfolio management.',
    images: ['/icons/icon-512x512.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstralCore - Advanced Crypto Trading Platform',
    description: 'Professional cryptocurrency trading platform with AI-powered bots',
  },
};

/**
 * Root page - redirects authenticated users to dashboard
 * New users see the Builder.io managed marketing page
 */
export default function RootPage() {
  // Check if user is logged in (simple session check)
  const isLoggedIn = false; // This will be enhanced with real auth later

  if (isLoggedIn) {
    redirect('/dashboard');
  }

  // For now, redirect to login since we don't have Builder.io configured
  // In production, this would show the marketing page
  redirect('/login');
}
