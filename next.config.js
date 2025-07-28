/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coincap.io',
      },
       {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.fly.dev'],
    },
  },
};

export default nextConfig;
