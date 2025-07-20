import { NewsArticleView } from '@/components/dashboard/news-article-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Market News - AstralCore",
    description: "Read the latest news from the financial world.",
};

interface NewsArticlePageProps {
  params: { articleId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  return (
    <NewsArticleView articleId={params.articleId} />
  );
}
