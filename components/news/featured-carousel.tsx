/**
 * Featured Carousel - Carrusel de noticias destacadas
 * Horizontal strip: circular thumbnail + category/author + title
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { NewsArticle } from '@/types';
import { getArticleUrl, getCategoryDisplayName } from '@/lib/utils';

export interface FeaturedCarouselProps {
  articles: NewsArticle[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % articles.length), 5000);
    return () => clearInterval(t);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const show = 3;
  const slice = articles.slice(0, show);

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {slice.map((article) => {
            const cat = article.categories?.[0];
            const author = article.author;
            return (
              <div
                key={article.id}
                className="flex items-center gap-3 min-w-0 flex-1 flex-shrink-0"
              >
                {article.featuredImage && (
                  <Link href={getArticleUrl(article.slug)} className="flex-shrink-0">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden">
                      <Image
                        src={article.featuredImage.url}
                        alt={article.featuredImage.alt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  {(cat || author) && (
                    <div className="text-xs text-gray-600 font-medium mb-0.5">
                      {cat ? getCategoryDisplayName(cat) : author?.name}
                    </div>
                  )}
                  <Link
                    href={getArticleUrl(article.slug)}
                    className="text-sm md:text-base font-semibold text-black hover:text-[#052962] transition-colors line-clamp-2"
                  >
                    {article.title}
                  </Link>
                </div>
              </div>
            );
          })}
          {articles.length > show && (
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % articles.length)}
              className="flex-shrink-0 text-gray-400 hover:text-[#052962] p-2"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
