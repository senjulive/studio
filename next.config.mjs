/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core configuration
  reactStrictMode: true,
  swcMinify: true,
  serverExternalPackages: ['@builder.io/react'],
  
  // Performance optimizations
  experimental: {
    // Enable modern JavaScript features
    esmExternals: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
    // Enable server actions
    serverActions: true,
    // Optimize CSS
    optimizeCss: true,
  },

  // Image optimization for crypto assets and charts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coincap.io',
        port: '',
        pathname: '/assets/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable modern formats
    formats: ['image/webp', 'image/avif'],
    // Optimize for different screen sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimization
    minimumCacheTTL: 31536000, // 1 year
  },

  // Security headers for crypto platform
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ],
    },
    {
      source: '/manifest.webmanifest',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/manifest+json',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // Redirects for clean URLs
  redirects: async () => [
    {
      source: '/dashboard/home',
      destination: '/dashboard',
      permanent: true,
    },
    {
      source: '/dashboard/wallet',
      destination: '/dashboard',
      permanent: true,
    },
    {
      source: '/dashboard/bot',
      destination: '/dashboard/trading',
      permanent: true,
    },
    {
      source: '/admin/home',
      destination: '/admin',
      permanent: true,
    },
    {
      source: '/moderator/home', 
      destination: '/moderator',
      permanent: true,
    },
  ],

  // API rewrites
  rewrites: async () => [
    {
      source: '/api/health',
      destination: '/api/healthcheck',
    },
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap',
    },
    {
      source: '/robots.txt',
      destination: '/api/robots',
    },
  ],

  // Webpack optimizations for crypto platform
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle for crypto libraries
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './src',
      };
    }

    // Optimize for trading chart libraries
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          crypto: {
            test: /[\\/]node_modules[\\/](recharts|three|framer-motion)[\\/]/,
            name: 'crypto-libs',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
          },
        },
      },
    };

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Output configuration for deployment
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Enable compression
  compress: true,
  
  // Disable powered by header for security
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Environment variables for builds
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
    APP_VERSION: process.env.npm_package_version || '1.0.0',
    DEPLOYMENT_PLATFORM: process.env.VERCEL ? 'vercel' : process.env.NETLIFY ? 'netlify' : 'other',
  },

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Remove console logs except errors
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
    
    // Enable source maps for debugging
    productionBrowserSourceMaps: false,
  }),
};

export default nextConfig;
