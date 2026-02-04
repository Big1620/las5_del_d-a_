/**
 * Search page: /buscar
 * Client-side search with query parameter support
 */

'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/news/article-card';
import { CardSkeleton } from '@/components/news/card-skeleton';
import type { NewsArticle } from '@/types';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.posts || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = query.trim();
    router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    performSearch(searchQuery);
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [searchParams, performSearch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Buscar</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar noticias..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>
      </header>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && hasSearched && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">
                No se encontraron resultados para &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Se encontraron {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para &quot;{query}&quot;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Ingresa un término de búsqueda para comenzar
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
