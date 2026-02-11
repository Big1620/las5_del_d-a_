/**
 * Configuración centralizada de publicidad
 * AdSense / GAM - Slots por layout, tamaños responsive, feature flags
 *
 * Ver docs/ADS_SLOTS.md para documentación completa.
 */

export type AdSlotId =
  | 'header'
  | 'leaderboard'
  | 'in-article'
  | 'sidebar'
  | 'footer'
  | 'archive';

export interface AdSlotConfig {
  /** ID del slot en AdSense/GAM (ej: "1234567890") */
  slotId: string;
  /** Layout donde aparece */
  layout: AdSlotId;
  /** Tamaño en desktop */
  size: string;
  /** Tamaño en mobile (opcional) */
  sizeMobile?: string;
  /** Altura mínima para CLS (px) */
  minHeight: number;
  /** Altura mínima en mobile */
  minHeightMobile?: number;
  /** Formato AdSense: auto, rectangle, horizontal, vertical */
  format: string;
}

/** Mapa de slots por layout - reemplazar IDs con valores reales */
export const AD_SLOTS: Record<AdSlotId, AdSlotConfig> = {
  header: {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_HEADER || 'header-leaderboard',
    layout: 'header',
    size: '728x90',
    sizeMobile: '320x50',
    minHeight: 90,
    minHeightMobile: 50,
    format: 'horizontal',
  },
  leaderboard: {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_LEADERBOARD || '1234567890',
    layout: 'leaderboard',
    size: '728x90',
    sizeMobile: '320x50',
    minHeight: 90,
    minHeightMobile: 50,
    format: 'horizontal',
  },
  'in-article': {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_IN_ARTICLE || '1234567890',
    layout: 'in-article',
    size: '300x250',
    sizeMobile: '300x250',
    minHeight: 250,
    format: 'rectangle',
  },
  sidebar: {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_SIDEBAR || '1122334455',
    layout: 'sidebar',
    size: '300x600',
    sizeMobile: '300x250',
    minHeight: 600,
    minHeightMobile: 250,
    format: 'vertical',
  },
  footer: {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_FOOTER || '0987654321',
    layout: 'footer',
    size: '728x90',
    sizeMobile: '320x50',
    minHeight: 90,
    minHeightMobile: 50,
    format: 'horizontal',
  },
  archive: {
    slotId: process.env.NEXT_PUBLIC_ADS_SLOT_ARCHIVE || '1234567890',
    layout: 'archive',
    size: '728x90',
    sizeMobile: '320x50',
    minHeight: 90,
    minHeightMobile: 50,
    format: 'horizontal',
  },
};

/** Feature flags por entorno */
export const ADS_FEATURE_FLAGS = {
  /** Habilitar anuncios (desactivar en dev si no hay cliente) */
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== 'false',
  /** Modo prueba: placeholders en lugar de anuncios reales */
  testMode:
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ADS_TEST_MODE === 'true',
  /** Consent Mode v2 (GDPR) */
  consentMode: process.env.NEXT_PUBLIC_ADS_CONSENT_MODE !== 'false',
  /** Refresco en scroll (cada N px) - 0 = desactivado */
  refreshOnScroll: parseInt(process.env.NEXT_PUBLIC_ADS_REFRESH_SCROLL || '0', 10),
  /** Intervalo máximo de refresco (ms) - 0 = sin límite por tiempo */
  refreshInterval: parseInt(process.env.NEXT_PUBLIC_ADS_REFRESH_INTERVAL || '30000', 10),
};

export function getAdSlot(layout: AdSlotId): AdSlotConfig {
  return AD_SLOTS[layout];
}

export function isAdsEnabled(): boolean {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID;
  return ADS_FEATURE_FLAGS.enabled && !!clientId;
}
