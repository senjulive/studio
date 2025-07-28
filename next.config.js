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
      allowedOrigins: ['*.fly.dev'],
    },
  },
  allowedDevOrigins: ['f3b0d8b9a44d4670b1cbf7e715a3e7c7-693eadd430704d0f9243a65cf.fly.dev'],
};

export default nextConfig;
