/**
 * Ad Provider - Carga gtag + Consent Mode v2 antes de cualquier anuncio/analytics
 * Debe estar en el layout antes de AnalyticsProvider y AdSlot
 */

'use client';

import Script from 'next/script';
import { GdprBanner } from './gdpr-banner';
import { ADS_FEATURE_FLAGS } from '@/lib/ads/config';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID;

// Consent Mode v2 defaults - denied hasta que el usuario interactúe
const CONSENT_DEFAULT = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500, // ms para que el banner actualice antes de enviar
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: 'set' | 'config' | 'event' | 'js', targetId: string | Date, config?: Record<string, unknown>) => void;
  }
}

export function AdProvider({ children }: { children: React.ReactNode }) {
  const showConsentBanner = ADS_FEATURE_FLAGS.consentMode && (!!GA_ID || !!ADS_CLIENT);

  return (
    <>
      {(GA_ID || ADS_CLIENT) && (
        <Script
          id="gtag-consent"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', ${JSON.stringify(CONSENT_DEFAULT)});
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
              ${ADS_CLIENT ? `gtag('config', '${ADS_CLIENT}');` : ''}
            `,
          }}
        />
      )}

      {GA_ID && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      )}

      {children}
      {showConsentBanner && <GdprBanner />}
    </>
  );
}
