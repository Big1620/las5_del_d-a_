'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArticleCard } from '@/components/news/article-card';
import { CardSkeleton } from '@/components/news/card-skeleton';
import { AdSlot } from '@/components/ads/ad-slot';
import { Pagination } from '@/components/ui/pagination';
import { PrefetchOnHover } from '@/components/news/prefetch-on-hover';
import { getArticleUrl } from '@/lib/utils';
import type { NewsArticle } from '@/types';

const AD_EVERY = 6;

export interface ArchiveFeedFilter {
  categoryId?: number;
  tagId?: number;
  authorId?: number;
}

export interface ArchiveFeedProps {
  initialPosts: NewsArticle[];
  totalPages: number;
  total: number;
  filter: ArchiveFeedFilter;
  basePath: string;
  perPage: number;
  initialPage: number;
}

type FeedNode =
  | { type: 'article'; article: NewsArticle }
  | { type: 'ad'; key: string };

function buildNodes(posts: NewsArticle[]): FeedNode[] {
  const nodes: FeedNode[] = [];
  posts.forEach((article, i) => {
    if (i > 0 && i % AD_EVERY === 0) {
      nodes.push({ type: 'ad', key: `ad-${i / AD_EVERY}` });
    }
    nodes.push({ type: 'article', article });
  });
  return nodes;
}

function buildQuery(filter: ArchiveFeedFilter, page: number, perPage: number): string {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('perPage', String(perPage));
  if (filter.categoryId != null) params.set('categoryId', String(filter.categoryId));
  if (filter.tagId != null) params.set('tagId', String(filter.tagId));
  if (filter.authorId != null) params.set('authorId', String(filter.authorId));
  return params.toString();
}

export function ArchiveFeed({
  initialPosts,
  totalPages,
  total,
  filter,
  basePath,
  perPage,
  initialPage,
}: ArchiveFeedProps) {
  const [posts, setPosts] = useState<NewsArticle[]>(initialPosts);
  const [nextPage, setNextPage] = useState(initialPage + 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const q = buildQuery(filter, nextPage, perPage);
      const res = await fetch(`/api/archive-posts?${q}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setNextPage((p) => p + 1);
      setHasMore(data.totalPages != null && nextPage < data.totalPages);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filter, nextPage, perPage, hasMore, loading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading]);

  const nodes = buildNodes(posts);
  const showEmpty = posts.length === 0 && !loading;

  return (
    <div className="space-y-8">
      {showEmpty ? null : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300"
          style={{ minHeight: 200 }}
        >
          {nodes.map((node) => {
            if (node.type === 'ad') {
              return (
                <div
                  key={node.key}
                  className="col-span-1 md:col-span-2 lg:col-span-3 w-full"
                >
                  <AdSlot
                    adSlotId="1234567890"
                    format="horizontal"
                    size="728x90"
                    minHeight={90}
                    lazy
                    testMode
                  />
                </div>
              );
            }
            return (
              <div
                key={node.article.id}
                className="transition-all duration-300 ease-out"
              >
                <PrefetchOnHover href={getArticleUrl(node.article.slug)}>
                  <ArticleCard
                    article={node.article}
                    variant="default"
                  />
                </PrefetchOnHover>
              </div>
            );
          })}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={`sk-${i}`} variant="default" />
            ))}
        </div>
      )}

      <div ref={sentinelRef} aria-hidden className="h-4 w-full" />

      {totalPages > 1 && (
        <Pagination
          basePath={basePath}
          currentPage={initialPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
