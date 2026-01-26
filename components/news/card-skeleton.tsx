/**
 * Article card skeleton for lists and grids.
 */

import { cn } from '@/lib/utils';

export interface CardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function CardSkeleton({ variant = 'default', className }: CardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex gap-4', className)}>
        <div className="w-24 h-24 flex-shrink-0 rounded bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={cn('rounded-lg overflow-hidden border bg-card', className)}>
        <div className="aspect-video w-full bg-muted animate-pulse" />
        <div className="p-6 space-y-3">
          <div className="h-7 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          <div className="flex gap-4 pt-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg overflow-hidden border bg-card', className)}>
      <div className="aspect-video w-full bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
