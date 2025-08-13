// Bundle analyzer configuration
// Use this file with: ANALYZE=true npm run build

import withBundleAnalyzer from '@next/bundle-analyzer';
import nextConfig from './next.config.mjs';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
