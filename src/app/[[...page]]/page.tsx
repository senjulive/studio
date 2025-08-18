import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/render-builder-content';
import { notFound } from 'next/navigation';

// Initialize Builder with your public API key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'demo-key');

interface PageProps {
  params: {
    page?: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const urlPath = '/' + (params.page?.join('/') || '');

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
    })
    .toPromise();

  // If no content found and not the root path, show 404
  if (!content && urlPath !== '/') {
    notFound();
  }

  return <RenderBuilderContent content={content} urlPath={urlPath} />;
}
