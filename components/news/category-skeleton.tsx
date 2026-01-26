/**
 * Category archive skeleton loader.
 * Grid of cards + sidebar layout.
 */

import { cn } from '@/lib/utils';

export function CategorySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="h-10 w-64 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden border bg-card">
                <div className="aspect-video w-full bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4 space-y-4">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </aside>
      </div>
    </div>
  );
}
