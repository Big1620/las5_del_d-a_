/**
 * Hero Article - Noticia principal
 * Layout 60% texto / 40% imagen, min-height 400-500px, etiqueta pill, tipografía especificada
 */

import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getArticleUrl, stripHtml } from '@/lib/utils';
import { CategoryLabel } from './category-label';
import type { NewsArticle } from '@/types';

export interface HeroArticleProps {
  article: NewsArticle;
}

export function HeroArticle({ article }: HeroArticleProps) {
  const url = getArticleUrl(article.slug);
  const excerpt = stripHtml(article.excerpt);
  const category = article.categories?.[0];

  return (
    <article className="group bg-white dark:bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 sm:gap-6 lg:gap-8 min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] min-w-0">
        {/* Izquierda 60%: categoría, titular, descripción, timestamp */}
        <div className="flex flex-col justify-center order-2 lg:order-1 min-w-0 overflow-hidden">
          {category && (
            <div className="mb-3">
              <CategoryLabel category={category} />
            </div>
          )}
          <Link href={url} className="block mt-3 lg:mt-0 cursor-pointer">
            <h1
              className="font-serif font-bold text-[#000000] dark:text-white leading-[1.2]
                text-2xl sm:text-3xl md:text-[36px] lg:text-[42px]
                hover:text-category transition-colors duration-200"
            >
              {article.title}
            </h1>
          </Link>
          {excerpt && (
            <p className="font-sans text-base md:text-lg text-[#333333] dark:text-gray-300 leading-[1.6] mt-4 line-clamp-3 max-w-full">
              {excerpt}
            </p>
          )}
          <time
            dateTime={article.date}
            className="font-sans text-[13px] text-[#767676] dark:text-gray-500 mt-5 block"
          >
            {formatRelativeTime(article.date)}
          </time>
        </div>
        {/* Derecha 40%: imagen */}
        {article.featuredImage && (
          <Link
            href={url}
            className="relative w-full min-h-[220px] sm:min-h-[280px] lg:min-h-[400px] overflow-hidden rounded-sm order-1 lg:order-2 cursor-pointer aspect-[4/3] lg:aspect-[5/4] min-w-0"
          >
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              className="object-cover w-full h-full group-hover:opacity-90 transition-opacity duration-300 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              priority
              fetchPriority="high"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALnT9RvbO0igt7ueKKNQqIkhCqB0AKKKKk2bMZJj/9k="
            />
            {article.isBreaking && (
              <span className="absolute top-3 left-3 bg-category text-white py-1 px-3 rounded-sm text-xs font-bold uppercase">
                Última hora
              </span>
            )}
          </Link>
        )}
      </div>
    </article>
  );
}
