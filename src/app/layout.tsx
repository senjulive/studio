import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { appConfig } from '@/config/app';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Enhanced metadata for SEO and PWA
export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
  authors: [{ name: appConfig.author }],
  generator: 'Next.js',
  keywords: [
    'crypto trading',
    'cryptocurrency',
    'bitcoin',
    'ethereum',
    'trading bot',
    'grid trading',
    'DeFi',
    'blockchain',
    'portfolio management',
    'mobile app',
  ],
  referrer: 'origin-when-cross-origin',
  creator: appConfig.author,
  publisher: appConfig.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appConfig.url,
    siteName: appConfig.name,
    title: appConfig.name,
    description: appConfig.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${appConfig.name} - Crypto Trading Platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@astralcore',
    creator: '@astralcore',
    title: appConfig.name,
    description: appConfig.description,
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  category: 'finance',
  classification: 'Business',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': appConfig.name,
    'application-name': appConfig.name,
    'msapplication-TileColor': appConfig.theme.colors.primary,
    'msapplication-config': '/browserconfig.xml',
  },
};

// Optimized viewport for mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: appConfig.theme.colors.darker },
  ],
  colorScheme: 'dark light',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href={appConfig.apiUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Apple-specific meta tags */}
        <meta name="apple-itunes-app" content="app-id=123456789" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
        
        {/* Favicon and icons */}
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/icons/ms-icon-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/icons/ms-icon-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/ms-icon-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/icons/ms-icon-310x310.png" />
        
        {/* Security headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/splash/launch-2048x2732.png" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1668x2224.png" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1536x2048.png" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1125x2436.png" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/splash/launch-1242x2208.png" sizes="1242x2208" />
        <link rel="apple-touch-startup-image" href="/splash/launch-750x1334.png" sizes="750x1334" />
        <link rel="apple-touch-startup-image" href="/splash/launch-640x1136.png" sizes="640x1136" />
        
        {/* Google Analytics (production only) */}
        {appConfig.analytics.enabled && appConfig.analytics.trackingId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${appConfig.analytics.trackingId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${appConfig.analytics.trackingId}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Skip to content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-md z-50 font-medium"
          >
            Skip to main content
          </a>
          
          {/* Main content */}
          <div id="main-content" className="min-h-screen">
            {children}
          </div>
          
          {/* Global toast notifications */}
          <Toaster />
          
          {/* Service Worker Registration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' === 'production') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
