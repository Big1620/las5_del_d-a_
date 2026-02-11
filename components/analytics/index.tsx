/**
 * Analytics Provider
 * Combines Google Analytics, Plausible and Web Vitals tracking
 */

'use client';

import { GoogleAnalytics } from './google-analytics';
import { Plausible } from './plausible';
import { WebVitals } from './web-vitals';

interface AnalyticsProviderProps {
  /** Google Analytics Measurement ID (NEXT_PUBLIC_GA_MEASUREMENT_ID) */
  gaId?: string;
  /** Plausible domain (NEXT_PUBLIC_PLAUSIBLE_DOMAIN) */
  plausibleDomain?: string;
  /** Plausible custom domain (NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN) */
  plausibleCustomDomain?: string;
  /** Web Vitals endpoint (NEXT_PUBLIC_WEB_VITALS_ENDPOINT) */
  webVitalsEndpoint?: string;
  debug?: boolean;
}

export function AnalyticsProvider({
  gaId,
  plausibleDomain,
  plausibleCustomDomain,
  webVitalsEndpoint,
  debug = false,
}: AnalyticsProviderProps) {
  const hasAnalytics = gaId || plausibleDomain || webVitalsEndpoint || debug;
  if (!hasAnalytics) return null;

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} debug={debug} />}
      {plausibleDomain && (
        <Plausible
          domain={plausibleDomain}
          customDomain={plausibleCustomDomain}
          trackOutbound
        />
      )}
      <WebVitals gaId={gaId} endpoint={webVitalsEndpoint} debug={debug} />
    </>
  );
}
