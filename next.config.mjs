/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  webpack: (config, { isServer }) => {
    // Silence handlebars require.extensions warning only on the client build.
    // Server bundles or optional dynamic chunks can still resolve it if needed.
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        handlebars: false,
      };
    }
    return config;
  },
};

export default nextConfig;
