/**
 * Secondary Article - Artículo secundario en listado
 * Category (red), title, subtitle, timestamp; optional image
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getArticleUrl, stripHtml, getCategoryDisplayName, getCategoryHref } from '@/lib/utils';
import type { NewsArticle } from '@/types';

export interface SecondaryArticleProps {
  article: NewsArticle;
  showImage?: boolean;
}

export function SecondaryArticle({ article, showImage = true }: SecondaryArticleProps) {
  const url = getArticleUrl(article.slug);
  const excerpt = stripHtml(article.excerpt);
  const category = article.categories?.[0];

  return (
    <article className="group border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <div className="flex gap-4">
        {showImage && article.featuredImage && (
          <Link href={url} className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              className="object-cover group-hover:opacity-95 transition-opacity"
              sizes="112px"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {category && (
            <Link href={getCategoryHref(category)} className="inline-block mb-1">
              <span className="text-[#C70000] font-semibold text-xs uppercase tracking-wide hover:underline">
                {getCategoryDisplayName(category)}
              </span>
            </Link>
          )}
          <Link href={url} className="block">
            <h2 className="text-lg md:text-xl font-bold text-black group-hover:text-[#052962] transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h2>
          </Link>
          {excerpt && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {excerpt}
            </p>
          )}
          <time dateTime={article.date} className="text-xs text-gray-500 mt-1 block">
            {formatRelativeTime(article.date)}
          </time>
        </div>
      </div>
    </article>
  );
}
