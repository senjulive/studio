// Global type declarations for AstralCore

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_BUILDER_API_KEY?: string;
      DATABASE_URL?: string;
      REDIS_URL?: string;
      JWT_SECRET?: string;
      ADMIN_EMAIL?: string;
      ADMIN_PASSWORD?: string;
      VERCEL?: string;
      VERCEL_URL?: string;
      NETLIFY?: string;
      DEPLOY_PRIME_URL?: string;
      CUSTOM_BUILD_TIME?: string;
      APP_VERSION?: string;
      CRON_SECRET?: string;
    }
  }

  interface Window {
    // Add any global window properties here
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Module declarations
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

// Extend existing types
declare module 'next' {
  interface NextConfig {
    experimental?: {
      serverActions?: boolean;
      optimizeCss?: boolean;
      optimizePackageImports?: string[];
      esmExternals?: boolean;
    };
  }
}

// Builder.io types
declare module '@builder.io/react' {
  export interface BuilderContent {
    id: string;
    name?: string;
    data?: Record<string, any>;
    variations?: Record<string, any>;
    testRatio?: number;
    lastUpdated?: number;
    firstPublished?: number;
    published?: 'draft' | 'published' | 'archived';
  }
}

export {};
