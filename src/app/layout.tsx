import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ContextMenuBlocker } from '@/components/context-menu-blocker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AstralCore',
  description: 'Modern UI/UX Crypto Management Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-body antialiased bg-background">
        <ContextMenuBlocker />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
