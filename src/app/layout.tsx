import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

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
      <body className="font-body antialiased bg-gradient-to-b from-purple-200 via-blue-200 to-white flex items-center justify-center p-0 sm:p-4">
        <div className="relative w-full max-w-sm bg-transparent shadow-2xl h-dvh sm:h-[calc(100dvh-2rem)] sm:max-h-[900px] sm:rounded-2xl overflow-hidden">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
            <Toaster />
        </div>
      </body>
    </html>
  );
}
