
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Newspaper, ArrowLeft } from "lucide-react";
import { allMockNews, type NewsItem } from "@/lib/news";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function NewsArticleView({ articleId }: { articleId: string }) {
  const [article, setArticle] = React.useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const foundArticle = allMockNews.find(a => a.id === articleId);
    setArticle(foundArticle || null);
    setIsLoading(false);
  }, [articleId]);

  if (isLoading) {
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-4 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full mb-6" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    );
  }

  if (!article) {
    return (
        <Card className="w-full max-w-4xl mx-auto text-center py-12">
            <CardHeader>
                <CardTitle>Article Not Found</CardTitle>
                <CardDescription>The news article you are looking for does not exist or has been moved.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/dashboard/market">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Market
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
            <Button asChild variant="ghost" className="self-start mb-4 -ml-4">
                <Link href="/dashboard/market">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Market
                </Link>
            </Button>
            <CardTitle className="text-3xl font-bold leading-tight">{article.title}</CardTitle>
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    <span>{article.source}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {article.author}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {article.imageUrl && (
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                        data-ai-hint={article['data-ai-hint']}
                    />
                </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
                {article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
