// src/app/[...page]/page.tsx
import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/builder/render-builder-content';

// Replace with your public API key
builder.init('your-builder-io-api-key-here');

interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Page(props: PageProps) {
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + props.params.page.join('/'),
      },
    })
    .toPromise();

  return (
    <div className="min-h-screen" style={{
      background: 'var(--qn-darker)',
      color: 'var(--qn-light)',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(110, 0, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 20%)
      `
    }}>
      <div className="container mx-auto p-4">
        <RenderBuilderContent content={content} />
      </div>
    </div>
  );
}
