/**
 * Sidebar "Lo más leído"
 * 5-7 noticias, numeración (1, 2, 3...), separadores sutiles, borde superior rojo 2-3px
 */

import Link from 'next/link';
import { formatRelativeTime, getArticleUrl } from '@/lib/utils';
import type { NewsArticle } from '@/types';

export interface TrendingSidebarProps {
  articles: NewsArticle[];
  title?: string;
}

export function TrendingSidebar({ articles, title = 'Lo más leído' }: TrendingSidebarProps) {
  if (articles.length === 0) return null;

  const list = articles.slice(0, 7);

  return (
    <aside className="border-t-[3px] border-category pt-4">
      <h2 className="text-lg sm:text-xl font-bold text-[#000000] dark:text-white border-b-2 border-category pb-2.5 mb-4">
        {title}
      </h2>
      <ul className="space-y-0 divide-y divide-[#E5E5E5] dark:divide-gray-600">
        {list.map((article, index) => (
          <li key={article.id} className="py-4 first:pt-0">
            <Link
              href={getArticleUrl(article.slug)}
              className="flex gap-3 font-sans text-[14px] sm:text-[15px] font-semibold text-[#000000] dark:text-white leading-snug hover:text-category hover:underline transition-colors duration-200 cursor-pointer"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[12px] font-bold text-category">
                {index + 1}
              </span>
              <span className="flex-1 min-w-0">{article.title}</span>
            </Link>
            <time
              dateTime={article.date}
              className="block font-sans text-xs text-[#767676] dark:text-gray-500 mt-1 ml-9"
            >
              {formatRelativeTime(article.date)}
            </time>
          </li>
        ))}
      </ul>
    </aside>
  );
}
