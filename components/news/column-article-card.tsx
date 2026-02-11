/**
 * ColumnArticleCard - Noticia del grid principal
 * Siempre layout horizontal: imagen izquierda 40% (16:9 o 4:3) + contenido 60%
 * Excerpt 14-15px #555555, hover rojo en titulares, opacity 0.9 en imagen
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getArticleUrl, stripHtml } from '@/lib/utils';
import { CategoryLabel } from './category-label';
import type { NewsArticle } from '@/types';

export interface ColumnArticleCardProps {
  article: NewsArticle;
  showExcerpt?: boolean;
}

export function ColumnArticleCard({ article, showExcerpt = true }: ColumnArticleCardProps) {
  const url = getArticleUrl(article.slug);
  const excerpt = stripHtml(article.excerpt);
  const category = article.categories?.[0];
  const hasImage = !!article.featuredImage?.url;

  return (
    <article className="group flex flex-col sm:flex-row gap-3 sm:gap-6 min-w-0">
      {/* Imagen: 40% en sm+, full width en móvil */}
      <Link
        href={url}
        className="relative w-full sm:w-[40%] sm:min-w-[140px] sm:max-w-[250px] flex-shrink-0 overflow-hidden rounded-sm aspect-video sm:aspect-[4/3] bg-[#F0F0F0] dark:bg-gray-800 cursor-pointer min-w-0"
      >
        {hasImage ? (
          <Image
            src={article.featuredImage!.url}
            alt={article.featuredImage!.alt || article.title}
            fill
            className="object-cover w-full h-full group-hover:opacity-90 transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 250px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#999] dark:text-gray-500 text-sm">
            Sin imagen
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {category && (
          <div className="mb-2">
            <CategoryLabel category={category} />
          </div>
        )}
        <Link href={url} className="block cursor-pointer">
          <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#000000] dark:text-white leading-[1.3] line-clamp-3 lg:line-clamp-4 hover:text-category hover:underline transition-colors duration-200">
            {article.title}
          </h2>
        </Link>
        {showExcerpt && excerpt && (
          <p className="font-sans text-[14px] sm:text-[15px] text-[#555555] dark:text-gray-400 leading-snug mt-2 line-clamp-2">
            {excerpt}
          </p>
        )}
        <time
          dateTime={article.date}
          className="font-sans text-xs sm:text-[13px] text-[#767676] dark:text-gray-500 mt-3 block"
        >
          {formatRelativeTime(article.date)}
        </time>
      </div>
    </article>
  );
}
