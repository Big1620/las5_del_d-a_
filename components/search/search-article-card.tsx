/**
 * Article card for search results with highlighted query terms
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getArticleUrl, stripHtml } from '@/lib/utils';
import { getHighlightedFragments } from '@/lib/search-utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { NewsArticle } from '@/types';

export interface SearchArticleCardProps {
  article: NewsArticle;
  query: string;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const parts = getHighlightedFragments(text, query);
  return (
    <>
      {parts.map((p, i) =>
        p.type === 'match' ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
            {p.value}
          </mark>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </>
  );
}

export function SearchArticleCard({ article, query }: SearchArticleCardProps) {
  const articleUrl = getArticleUrl(article.slug);
  const excerpt = stripHtml(article.excerpt);

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
            <Highlighted text={article.title} query={query} />
          </h3>
          {excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              <Highlighted text={excerpt} query={query} />
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(article.date)}</span>
          {article.author?.name && <span>{article.author.name}</span>}
        </CardFooter>
      </Card>
    </Link>
  );
}
