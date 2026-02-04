/**
 * Analytics Provider
 * Combines Google Analytics and Web Vitals tracking
 * 
 * Usage:
 * Add to your layout.tsx:
 * <AnalyticsProvider gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
 */

'use client';

import { GoogleAnalytics } from './google-analytics';
import { WebVitals } from './web-vitals';

interface AnalyticsProviderProps {
  /**
   * Google Analytics Measurement ID (optional)
   * Set via NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable
   */
  gaId?: string;
  
  /**
   * Custom endpoint for Web Vitals (optional)
   * If provided, Web Vitals will be sent to this endpoint
   */
  webVitalsEndpoint?: string;
  
  /**
   * Enable debug mode
   */
  debug?: boolean;
}

export function AnalyticsProvider({
  gaId,
  webVitalsEndpoint,
  debug = false,
}: AnalyticsProviderProps) {
  // Only render if GA ID is provided or endpoint is configured
  if (!gaId && !webVitalsEndpoint && !debug) {
    return null;
  }

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} debug={debug} />}
      <WebVitals
        gaId={gaId}
        endpoint={webVitalsEndpoint}
        debug={debug}
      />
    </>
  );
}
