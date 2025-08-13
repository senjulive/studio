/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  generateIndexSitemap: true,
  
  // Exclude sensitive and dynamic pages
  exclude: [
    '/admin',
    '/admin/*',
    '/moderator',
    '/moderator/*',
    '/dashboard/security',
    '/dashboard/withdraw',
    '/dashboard/deposit',
    '/dashboard/profile/verify',
    '/dashboard/inbox',
    '/dashboard/support',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
  ],
  
  // Additional paths to include
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/'),
      await config.transform(config, '/login'),
      await config.transform(config, '/register'),
      await config.transform(config, '/forgot-password'),
      await config.transform(config, '/dashboard'),
      await config.transform(config, '/dashboard/trading'),
      await config.transform(config, '/dashboard/market'),
      await config.transform(config, '/dashboard/about'),
    ];
  },
  
  // Custom transformation for dynamic pages
  transform: async (config, path) => {
    // Default priority and changefreq
    let priority = 0.7;
    let changefreq = 'weekly';
    
    // Adjust based on page importance
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/dashboard')) {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path === '/login' || path === '/register') {
      priority = 0.9;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'en',
        },
      ],
    };
  },
  
  // Robot.txt additional settings (if generateRobotsTxt was true)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/moderator/', '/api/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app'}/sitemap.xml`,
    ],
  },
};
