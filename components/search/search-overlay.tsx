'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { getArticleUrl, formatRelativeTime } from '@/lib/utils';
import { debounce } from '@/lib/search-utils';
import { getHighlightedFragments } from '@/lib/search-utils';
import { trackSearchEvent } from '@/lib/analytics-events';
import type { NewsArticle } from '@/types';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 300;
// Búsqueda directa a WordPress (sitio estático)

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

function SearchResultSkeleton() {
  return (
    <div className="space-y-3 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-14 w-20 flex-shrink-0 rounded bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const parts = getHighlightedFragments(title, query);
  return (
    <span>
      {parts.map((p, i) =>
        p.type === 'match' ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
            {p.value}
          </mark>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </span>
  );
}

export function SearchOverlay({ isOpen, onClose, initialQuery = '' }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { searchPosts } = await import('@/lib/api/wordpress-client');
      const posts = await searchPosts(q.trim());
      setResults(posts);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setFocusedIndex(-1);
    }
  }, []);

  const debouncedSearch = useRef(
    debounce((q: string) => runSearch(q), DEBOUNCE_MS)
  ).current;

  useEffect(() => {
    if (query.trim()) debouncedSearch(query.trim());
    else setResults([]);
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      inputRef.current?.focus();
      setFocusedIndex(-1);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuery]);

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((i) => (i < results.length - 1 ? i + 1 : i));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((i) => (i > 0 ? i - 1 : -1));
        return;
      }
      if (e.key === 'Enter' && focusedIndex >= 0 && results[focusedIndex]) {
        e.preventDefault();
        const article = results[focusedIndex];
        trackSearchEvent(query.trim());
        router.push(getArticleUrl(article.slug));
        onClose();
      }
      // WCAG 2.1.2: Trampa de foco dentro del diálogo modal
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusable);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, focusedIndex, query, router]);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${focusedIndex}"]`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      trackSearchEvent(q);
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  const handleResultClick = (article: NewsArticle) => {
    trackSearchEvent(query.trim());
    router.push(getArticleUrl(article.slug));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/20"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar en el sitio"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        className="fixed left-1/2 top-[5vh] -translate-x-1/2 max-h-[calc(100vh-10vh)] max-w-2xl w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] rounded-xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex min-w-0 shrink-0 items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: economía, portada..."
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
            aria-label="Buscar"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors [&_svg]:h-5 [&_svg]:w-5"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </form>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {loading && <SearchResultSkeleton />}

          {!loading && query.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" aria-hidden />
              <p className="font-semibold text-foreground">No encontramos nada para «{query}»</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Prueba con otras palabras o revisa la página de búsqueda.
              </p>
              <Link
                href={`/buscar?q=${encodeURIComponent(query.trim())}`}
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                onClick={onClose}
              >
                Ver todos los resultados en la página de búsqueda →
              </Link>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2" role="list">
              {results.map((article, index) => (
                <li key={article.id} role="listitem">
                  <Link
                    href={getArticleUrl(article.slug)}
                    data-index={index}
                    className={cn(
                      'flex gap-3 px-4 py-3 text-left transition-colors rounded-lg mx-2 hover:bg-muted',
                      focusedIndex === index && 'bg-muted'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handleResultClick(article);
                    }}
                    onFocus={() => setFocusedIndex(index)}
                  >
                    {article.featuredImage && (
                      <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
                        <img
                          src={article.featuredImage.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium line-clamp-2">
                        <HighlightedTitle title={article.title} query={query.trim()} />
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeTime(article.date)}
                        {article.author?.name && ` · ${article.author.name}`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && !query.trim() && (
            <div className="p-8 text-center">
              <Search className="mx-auto h-9 w-9 text-muted-foreground/40 mb-2" aria-hidden />
              <p className="text-sm text-muted-foreground">
                Escribe un término. Con <kbd className="px-1 rounded bg-muted font-mono text-xs">Enter</kbd> irás a la página completa de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
