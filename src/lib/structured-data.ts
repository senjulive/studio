export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateWebsiteStructuredData(): StructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AstralCore',
    alternateName: 'AstralCore Crypto Platform',
    url: baseUrl,
    description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'AstralCore',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.svg`,
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/astralcore',
      'https://t.me/astralcore',
      'https://github.com/astralcore',
    ],
  };
}

export function generateOrganizationStructuredData(): StructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AstralCore',
    alternateName: 'AstralCore Crypto Platform',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icons/icon-512x512.svg`,
      width: 512,
      height: 512,
    },
    description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
    founder: {
      '@type': 'Organization',
      name: 'AstralCore Team',
    },
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@astralcore.app',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/astralcore',
      'https://t.me/astralcore',
      'https://github.com/astralcore',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  };
}

export function generateWebApplicationStructuredData(): StructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AstralCore',
    alternateName: 'AstralCore Crypto Platform',
    url: baseUrl,
    description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'Free',
      availability: 'https://schema.org/InStock',
    },
    screenshot: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/screenshot.jpg`,
      caption: 'AstralCore Dashboard Screenshot',
    },
    featureList: [
      'Cryptocurrency Portfolio Management',
      'Automated Trading Bots',
      'Real-time Market Analytics',
      'Secure Wallet Integration',
      'Advanced Charting Tools',
      'Risk Management Features',
    ],
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQStructuredData(faqs: { question: string; answer: string }[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateSoftwareApplicationStructuredData(): StructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AstralCore',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    description: 'Professional cryptocurrency trading and management platform with advanced analytics, automated trading bots, and comprehensive portfolio management tools.',
    url: baseUrl,
    downloadUrl: baseUrl,
    softwareVersion: '1.0.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'AstralCore Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AstralCore',
      url: baseUrl,
    },
    screenshot: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/screenshot.jpg`,
    },
    featureList: [
      'Cryptocurrency Portfolio Management',
      'Automated Trading Bots',
      'Real-time Market Analytics',
      'Secure Wallet Integration',
      'Advanced Charting Tools',
      'Risk Management Features',
    ],
    requirements: 'Modern web browser with JavaScript enabled',
    memoryRequirements: '2GB RAM',
    storageRequirements: '100MB',
    processorRequirements: 'Dual-core processor',
  };
}

// Helper function to inject structured data into page head
export function injectStructuredData(data: StructuredData | StructuredData[]) {
  const structuredDataArray = Array.isArray(data) ? data : [data];
  
  return structuredDataArray.map((item, index) => (
    <script
      key={`structured-data-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(item),
      }}
    />
  ));
}