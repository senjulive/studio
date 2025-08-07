// src/app/[[...page]]/page.tsx
import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/render-builder-content';

// Replace with your public API key
builder.init('your-builder-io-api-key-here');

interface PageProps {
  params: {
    page?: string[];
  };
}

export default async function Page(props: PageProps) {
  // Skip if this is the root path (let the main page.tsx handle it)
  if (!props.params.page || props.params.page.length === 0) {
    return null;
  }

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + props.params.page.join('/'),
      },
    })
    .toPromise();

  return <RenderBuilderContent content={content} />;
}
