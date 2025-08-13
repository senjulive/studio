import type { Metadata, Viewport } from 'next';

const APP_NAME = 'AstralCore';
const APP_DESCRIPTION = 'Advanced crypto trading platform with AI-powered automation and real-time analytics';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';

export const defaultMetadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'crypto',
    'trading',
    'cryptocurrency',
    'bitcoin',
    'ethereum',
    'AI trading',
    'automated trading',
    'portfolio management',
    'blockchain',
    'DeFi',
    'crypto bot',
    'trading platform',
  ],
  authors: [
    {
      name: 'AstralCore Team',
      url: APP_URL,
    },
  ],
  creator: 'AstralCore',
  publisher: 'AstralCore',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [
      {
        url: '/icons/icon-512x512.svg',
        width: 512,
        height: 512,
        alt: `${APP_NAME} Logo`,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@astralcore',
    creator: '@astralcore',
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    images: ['/icons/icon-512x512.svg'],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
    startupImage: [
      {
        url: '/icons/apple-touch-icon.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Finance',
  classification: 'Finance',
  referrer: 'origin-when-cross-origin',
};

export const defaultViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// Page-specific metadata generators
export function generatePageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description = APP_DESCRIPTION, path = '', image, noIndex = false } = options;
  
  const url = `${APP_URL}${path}`;
  const fullTitle = `${title} - ${APP_NAME}`;
  
  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      images: image ? [image] : ['/icons/icon-512x512.svg'],
    },
    twitter: {
      title: fullTitle,
      description,
      images: image ? [image] : ['/icons/icon-512x512.svg'],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  };
}

// Dashboard metadata
export const dashboardMetadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Manage your crypto portfolio, view trading performance, and monitor market trends.',
  path: '/dashboard',
  noIndex: true, // Private page
});

// Trading metadata
export const tradingMetadata = generatePageMetadata({
  title: 'Trading',
  description: 'Advanced crypto trading with AI-powered bots and real-time market analysis.',
  path: '/dashboard/trading',
  noIndex: true, // Private page
});

// Market metadata
export const marketMetadata = generatePageMetadata({
  title: 'Market',
  description: 'Real-time cryptocurrency market data, charts, and analysis tools.',
  path: '/dashboard/market',
  noIndex: true, // Private page
});

// Login metadata
export const loginMetadata = generatePageMetadata({
  title: 'Login',
  description: 'Sign in to your AstralCore account and access advanced crypto trading features.',
  path: '/login',
});

// Register metadata
export const registerMetadata = generatePageMetadata({
  title: 'Register',
  description: 'Create your AstralCore account and start automated crypto trading today.',
  path: '/register',
});
