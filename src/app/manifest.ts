import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AstralCore - Advanced Crypto Trading Platform',
    short_name: 'AstralCore',
    description: 'Professional cryptocurrency trading platform with AI-powered bots, real-time analytics, and comprehensive portfolio management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#8b5cf6',
    orientation: 'portrait',
    scope: '/',
    lang: 'en-US',
    categories: ['finance', 'business', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
    screenshots: [
      {
        src: '/icons/icon-512x512.svg',
        type: 'image/svg+xml',
        sizes: '512x512',
        form_factor: 'narrow',
      },
      {
        src: '/icons/icon-512x512.svg',
        type: 'image/svg+xml',
        sizes: '512x512',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Trading Dashboard',
        short_name: 'Trade',
        description: 'Access your trading dashboard',
        url: '/dashboard/trading',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Market Analysis',
        short_name: 'Market',
        description: 'View market data and analytics',
        url: '/dashboard/market',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Portfolio',
        short_name: 'Portfolio',
        description: 'Manage your crypto portfolio',
        url: '/dashboard',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    ],
    protocol_handlers: [
      {
        protocol: 'bitcoin',
        url: '/dashboard/deposit?address=%s',
      },
      {
        protocol: 'ethereum',
        url: '/dashboard/deposit?address=%s',
      },
    ],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 480,
    },
  };
}
