/**
 * Article page skeleton loader.
 * Preserves layout (hero image, title, body, sidebar) to avoid CLS.
 */

import { cn } from '@/lib/utils';

export function ArticleSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8 space-y-6">
          <div className="aspect-video w-full bg-muted animate-pulse rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
            <div className="h-8 w-4/5 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-4 text-sm">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2 pt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-4 bg-muted animate-pulse rounded',
                  i % 4 === 0 ? 'w-3/4' : 'w-full'
                )}
              />
            ))}
          </div>
        </article>
        <aside className="lg:col-span-4 space-y-6">
          <div className="h-10 w-2/3 bg-muted animate-pulse rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-20 w-28 flex-shrink-0 bg-muted animate-pulse rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
