/**
 * ArticleCard Component
 * Displays a news article in card format
 * 
 * Design decisions:
 * - Responsive image with lazy loading
 * - Accessible markup
 * - Multiple size variants for different layouts
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getArticleUrl, stripHtml } from '@/lib/utils';
import type { NewsArticle } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface ArticleCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
  showExcerpt?: boolean;
  showAuthor?: boolean;
}

export function ArticleCard({
  article,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
}: ArticleCardProps) {
  const articleUrl = getArticleUrl(article.slug);
  const excerpt = stripHtml(article.excerpt);

  if (variant === 'compact') {
    return (
      <Link href={articleUrl} className="block group transition-all duration-300 ease-out">
        <div className="flex gap-4">
          {article.featuredImage && (
            <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="96px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatRelativeTime(article.date)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={articleUrl} className="block group">
        <Card className="overflow-hidden h-full transition-all duration-300 ease-out hover:shadow-md">
          {article.featuredImage && (
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {article.isBreaking && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                  URGENTE
                </div>
              )}
            </div>
          )}
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            {showExcerpt && (
              <p className="text-muted-foreground line-clamp-3">
                {excerpt}
              </p>
            )}
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatRelativeTime(article.date)}</span>
            {showAuthor && (
              <span>{article.author.name}</span>
            )}
          </CardFooter>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={articleUrl} className="block group">
      <Card className="overflow-hidden h-full transition-all duration-300 ease-out hover:shadow-md">
        {article.featuredImage && (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {showExcerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(article.date)}</span>
          {showAuthor && (
            <span>{article.author.name}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
