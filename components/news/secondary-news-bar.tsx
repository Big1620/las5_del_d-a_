/**
 * Barra de noticias secundarias
 * Grid 4 columnas, gap 20-30px, separadores verticales 1px #E5E5E5, sin imágenes, sin timestamp
 */

import Link from 'next/link';
import { getArticleUrl } from '@/lib/utils';
import { CategoryLabel } from './category-label';
import type { NewsArticle } from '@/types';

export interface SecondaryNewsBarProps {
  articles: NewsArticle[];
}

export function SecondaryNewsBar({ articles }: SecondaryNewsBarProps) {
  if (articles.length === 0) return null;

  return (
    <div className="py-0 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 lg:gap-x-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5] dark:divide-gray-600">
        {articles.slice(0, 4).map((article) => {
          const category = article.categories?.[0];
          const url = getArticleUrl(article.slug);
          return (
            <article key={article.id} className="group py-3 sm:py-0 sm:px-4 lg:px-5 first:sm:pl-0 last:sm:pr-0 min-w-0">
              {category && (
                <div className="mb-2">
                  <CategoryLabel category={category} />
                </div>
              )}
              <Link
                href={url}
                className="block font-sans text-[15px] sm:text-base font-bold text-[#000000] dark:text-white leading-[1.3] line-clamp-2 lg:line-clamp-3 hover:text-category hover:underline transition-colors duration-200 cursor-pointer"
              >
                {article.title}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
