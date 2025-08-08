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
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (props.params.page?.join('/') || ''),
      },
    })
    .toPromise();

  return <RenderBuilderContent content={content} />;
}
