// src/components/builder/render-builder-content.tsx
'use client';

import { BuilderComponent, useIsPreviewing } from '@builder.io/react';

// Replace with your public API key
const BUILDER_API_KEY = 'your-builder-io-api-key-here';

interface RenderBuilderContentProps {
  content?: any;
}

export function RenderBuilderContent({ content }: RenderBuilderContentProps) {
  const isPreviewing = useIsPreviewing();

  if (content || isPreviewing) {
    return <BuilderComponent model="page" content={content} apiKey={BUILDER_API_KEY} />;
  }

  // If no content is found, you can render a 404 page or a default component
  return <div>Page not found</div>;
}
