// src/app/cms/[[...page]]/page.tsx
import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/render-builder-content';

// Replace with your public API key (or use env NEXT_PUBLIC_BUILDER_API_KEY)
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'your-builder-io-api-key-here');

// Avoid strict typing here to be compatible with Next.js generated types on Vercel
export default async function Page({ params }: any) {
  const pageSegments: string[] | undefined = params?.page;

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (pageSegments?.join('/') || ''),
      },
    })
    .toPromise();

  return <RenderBuilderContent content={content} />;
}