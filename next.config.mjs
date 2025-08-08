/** @type {import('next').NextConfig} */
const nextConfig = {
  // React settings
  reactStrictMode: true,
  swcMinify: true,
  
  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'astralcore.app'],
    },
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
<<<<<<< HEAD
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for security and performance
=======
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
>>>>>>> 9c0dc93ce72204eaa05223df50eccbb00523820a
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
<<<<<<< HEAD
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Performance headers
          {
            key: 'X-Powered-By',
            value: 'AstralCore'
          },
        ],
      },
      // PWA manifest headers
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      // Service worker headers
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript'
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
        ],
      },
      // API headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://astralcore.app' 
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
=======
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
>>>>>>> 9c0dc93ce72204eaa05223df50eccbb00523820a
          },
        ],
      },
    ];
  },
<<<<<<< HEAD
  
  // Redirects for SEO and UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/app',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
      };
    }
    
    // Bundle analyzer (development only)
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }
    
    // Optimize imports
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            ['import', { libraryName: 'framer-motion', style: false }, 'framer-motion'],
            ['import', { libraryName: 'lucide-react', style: false }, 'lucide-react'],
          ]
        }
      }]
    });
    
    return config;
  },
  
  // Environment variables
  env: {
    APP_VERSION: process.env.npm_package_version || '1.0.0',
    BUILD_TIME: new Date().toISOString(),
  },
  
  // Compression
  compress: true,
  
  // PoweredBy header
  poweredByHeader: false,
  
  // Generate etags
  generateEtags: true,
  
  // Trailing slash handling
  trailingSlash: false,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? process.env.CDN_URL || '' 
    : '',
=======
>>>>>>> 9c0dc93ce72204eaa05223df50eccbb00523820a
};

export default nextConfig;
