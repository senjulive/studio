/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'AstralCore - Modern Crypto Management Platform',
  description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
  canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app',
    siteName: 'AstralCore',
    title: 'AstralCore - Modern Crypto Management Platform',
    description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app'}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'AstralCore - Crypto Management Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@astralcore',
    site: '@astralcore',
    cardType: 'summary_large_image',
    creator: '@astralcore',
  },
  additionalMetaTags: [
    {
      property: 'dc:creator',
      content: 'AstralCore Team',
    },
    {
      name: 'application-name',
      content: 'AstralCore',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'AstralCore',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#7C3AED',
    },
    {
      name: 'keywords',
      content: 'cryptocurrency, trading, bitcoin, ethereum, crypto management, portfolio, blockchain, defi, trading bot, crypto analytics',
    },
    {
      name: 'author',
      content: 'AstralCore Team',
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
    {
      name: 'googlebot',
      content: 'index,follow',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/icons/icon-192x192.svg',
      sizes: '192x192',
    },
    {
      rel: 'manifest',
      href: '/manifest.webmanifest',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.builder.io',
    },
    {
      rel: 'dns-prefetch',
      href: 'https://api.builder.io',
    },
    {
      rel: 'dns-prefetch',
      href: 'https://assets.coincap.io',
    },
  ],
};

export default defaultSEOConfig;
