/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable optimizations
  experimental: {
    optimizeCss: true,
  },

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
        hostname: 'i.pravatar.cc',
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
  },

  // Fix cross-origin requests from Fly.dev
  allowedDevOrigins: [
    '671c6c4de455457b9c50e4ec2b409e8f-35098d46dde94f41bef22b611.fly.dev',
    'localhost:3000',
  ],

  // Optimize for deployment
  poweredByHeader: false,
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  generateEtags: true,

  // Ensure we're using App Router only
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
