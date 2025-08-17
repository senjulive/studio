import { RenderBuilderContent } from '@/components/builder/render-builder-content';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    page?: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const urlPath = '/' + (params.page?.join('/') || '');

  // Temporarily disable Builder.io content fetching
  const content = null;

  // If no content found and not the root path, show 404
  if (!content && urlPath !== '/') {
    notFound();
  }

  return <RenderBuilderContent content={content} urlPath={urlPath} />;
}
