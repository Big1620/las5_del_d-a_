/**
 * AdBar - Barra horizontal de anuncio sobre el header
 * Full width, fondo blanco, altura reservada para evitar CLS.
 * AdSlot cargado con dynamic import (SSR-friendly, sin hydration mismatch).
 */

'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const AdSlot = dynamic(
  () => import('@/components/ads/ad-slot').then((m) => ({ default: m.AdSlot })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center bg-bg-ad dark:bg-gray-800 w-full h-full min-h-[60px] md:min-h-[90px]"
        aria-hidden
      >
        <span className="text-xs text-text-muted">Cargando…</span>
      </div>
    ),
  }
);

export function AdBar() {
  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 border-b border-[#E5E5E5] dark:border-gray-700',
        'min-h-[60px] md:min-h-[90px]',
        'hidden min-[420px]:block'
      )}
      role="complementary"
      aria-label="Espacio publicitario"
    >
      <div className="mx-auto flex w-full max-w-[1440px] min-w-0 items-center justify-center px-3 sm:px-4 py-2">
        <div className="w-full flex items-center justify-center" style={{ minHeight: 60 }}>
          <AdSlot
            adSlotId="header-leaderboard"
            format="horizontal"
            size="728x90"
            minHeight={90}
            lazy
            testMode
            className="w-full max-w-[728px] min-h-[60px] md:min-h-[90px] bg-bg-ad dark:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
