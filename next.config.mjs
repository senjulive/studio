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
    // Silence handlebars require.extensions warning by aliasing to a browser-safe build
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      handlebars: false, // prevent bundling handlebars on client; dotprompt will not use it in our environment
    };
    return config;
  },
};

export default nextConfig;
