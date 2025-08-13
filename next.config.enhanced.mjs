/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Server components optimization
    serverComponentsExternalPackages: ['@builder.io/react'],
    // Optimize bundle size
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization
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
    ],
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // PWA Configuration
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
          value: 'camera=(), microphone=(), geolocation=()',
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
      ],
    },
  ],

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle analyzer
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './src',
      };
    }

    // Optimize for mobile
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
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Output configuration for optimal performance
  output: 'standalone',
  
  // Compression and optimization
  compress: true,
  
  // Enable static optimization
  swcMinify: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize for mobile devices
  poweredByHeader: false,
  
  // Enable TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Redirects for SEO and UX
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
  ],

  // Rewrites for clean URLs
  rewrites: async () => [
    {
      source: '/api/health',
      destination: '/api/healthcheck',
    },
  ],

  // Environment variables
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
    APP_VERSION: process.env.npm_package_version || '1.0.0',
  },

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Enable detailed error overlay
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Generate source maps for debugging
    productionBrowserSourceMaps: false,
    
    // Optimize for performance
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
  }),
};

export default nextConfig;
