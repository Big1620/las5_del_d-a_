/**
 * SideRailAds - Anuncios en los costados de la página (skyscraper 160x600)
 * Solo visibles en pantallas muy anchas (≥1600px) para aprovechar el espacio lateral.
 *
 * Design decisions:
 * - Breakpoint min-[1600px] para no saturar móvil/tablet
 * - Sticky para mantener visibilidad al hacer scroll
 * - Usa AdSlot con lazy load
 * - Placeholder en test mode coherente con el resto del sistema
 */

'use client';

import dynamic from 'next/dynamic';
import { getAdSlot, ADS_FEATURE_FLAGS, isAdsEnabled } from '@/lib/ads/config';
import { cn } from '@/lib/utils';

const AdSlot = dynamic(
  () => import('@/components/ads/ad-slot').then((m) => ({ default: m.AdSlot })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center bg-bg-ad dark:bg-gray-800 w-full animate-pulse rounded"
        style={{ minHeight: 250 }}
        aria-hidden
      >
        <span className="text-xs text-text-muted">Cargando…</span>
      </div>
    ),
  }
);

type Side = 'left' | 'right';

interface SideRailAdProps {
  side: Side;
  className?: string;
}

export function SideRailAd({ side, className }: SideRailAdProps) {
  const layout = side === 'left' ? 'sidebar-left' : 'sidebar-right';
  const config = getAdSlot(layout);

  if (!isAdsEnabled()) return null;

  return (
    <aside
      className={cn(
        'hidden min-[1600px]:flex w-[160px] flex-shrink-0 justify-center pt-8 sticky top-24 self-start',
        'bg-white dark:bg-background',
        className
      )}
      role="complementary"
      aria-label={`Espacio publicitario ${side === 'left' ? 'izquierdo' : 'derecho'}`}
    >
      <div className="w-[160px]">
        <AdSlot
          adSlotId={config.slotId}
          format={config.format}
          size={config.size}
          minHeight={config.minHeight}
          lazy
          testMode={ADS_FEATURE_FLAGS.testMode}
          className="w-[160px] bg-bg-ad dark:bg-gray-800 min-h-[600px]"
        />
      </div>
    </aside>
  );
}
