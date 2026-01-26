/**
 * BreakingNews Component
 * Displays breaking news banner/ticker
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { NewsArticle } from '@/types';
import { getArticleUrl } from '@/lib/utils';

export interface BreakingNewsProps {
  articles: NewsArticle[];
}

export function BreakingNews({ articles }: BreakingNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div className="bg-red-600 text-white py-2 px-4">
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="h-5 w-5 animate-pulse" />
          <span className="font-bold text-sm uppercase">Última hora</span>
        </div>
        <Link
          href={getArticleUrl(currentArticle.slug)}
          className="flex-1 hover:underline line-clamp-1"
        >
          {currentArticle.title}
        </Link>
        {articles.length > 1 && (
          <div className="flex gap-1 flex-shrink-0">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Noticia ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
