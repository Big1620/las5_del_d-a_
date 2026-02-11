'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface PrefetchOnHoverProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Prefetches the route on hover to speed up navigation.
 */
export function PrefetchOnHover({ href, children, className }: PrefetchOnHoverProps) {
  const router = useRouter();
  const onMouseEnter = useCallback(() => {
    router.prefetch(href);
  }, [router, href]);

  return (
    <div onMouseEnter={onMouseEnter} className={className}>
      {children}
    </div>
  );
}
