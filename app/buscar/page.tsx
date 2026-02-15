/**
 * Search page: /buscar
 * Query param ?q=, debounce, WP search, skeleton, no-results UX, noindex (layout), highlight, tracking
 */

'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/news/card-skeleton';
import { SearchArticleCard } from '@/components/search/search-article-card';
import { debounce } from '@/lib/search-utils';
import { trackSearchEvent } from '@/lib/analytics-events';
import type { NewsArticle } from '@/types';

const DEBOUNCE_MS = 300;

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
      const { searchPosts } = await import('@/lib/api/wordpress-client');
      const posts = await searchPosts(searchQuery);
      setResults(posts);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useRef(debounce((q: string) => performSearch(q), DEBOUNCE_MS)).current;
  /** True solo cuando la query actual se acaba de cargar desde la URL (evita doble fetch) */
  const queryFromUrlRef = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      trackSearchEvent(q);
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
      // performSearch lo dispara el efecto al cambiar searchParams
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery != null) {
      setQuery(initialQuery);
      if (initialQuery.trim()) {
        queryFromUrlRef.current = true;
        performSearch(initialQuery.trim());
      }
    }
  }, [searchParams, performSearch]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      if (hasSearched) setResults([]);
      queryFromUrlRef.current = false;
      return;
    }
    if (queryFromUrlRef.current && q === searchParams.get('q')?.trim()) {
      queryFromUrlRef.current = false;
      return;
    }
    queryFromUrlRef.current = false;
    debouncedSearch(q);
  }, [query, debouncedSearch, hasSearched, searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-1 text-foreground">Buscar</h1>
        <p className="text-muted-foreground text-sm mb-6">Encuentra noticias por palabra clave</p>
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 max-w-2xl"
          role="search"
          aria-label="Buscar noticias en el sitio"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden />
            <label htmlFor="search-query" className="sr-only">
              Buscar noticias
            </label>
            <input
              id="search-query"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: economía, portada, titular..."
              className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Buscar noticias"
              autoComplete="off"
            />
          </div>
          <Button type="submit" disabled={loading} aria-busy={loading} className="px-6">
            {loading ? 'Buscando…' : 'Buscar'}
          </Button>
        </form>
      </header>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Cargando resultados">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && hasSearched && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-xl border border-border bg-muted/20 shadow-sm">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" aria-hidden />
              <p className="text-xl font-semibold text-foreground">
                No encontramos nada para «{query}»
              </p>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                Prueba con otras palabras, menos términos o expresiones más generales.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/">
                  <Button variant="outline" size="sm">Ir al inicio</Button>
                </Link>
                <Link href="/buscar">
                  <Button variant="outline" size="sm">Nueva búsqueda</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-medium text-foreground">{results.length}</span>{' '}
                {results.length === 1 ? 'resultado' : 'resultados'} para «{query}»
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <SearchArticleCard
                    key={article.id}
                    article={article}
                    query={query.trim()}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/10">
          <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" aria-hidden />
          <p className="text-muted-foreground text-sm">
            Escribe un término y pulsa <strong className="text-foreground">Buscar</strong> o <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> para ver resultados.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
