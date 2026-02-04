/**
 * Web Vitals Component
 * Captures Core Web Vitals and sends them to analytics
 * 
 * Metrics tracked:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay) / INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */

'use client';

import { useCallback } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

// Type definition for Metric (matching next/web-vitals)
interface Metric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  label: string;
  navigationType?: string;
}

interface WebVitalsProps {
  /**
   * Google Analytics Measurement ID (optional)
   * If provided, metrics will be sent to GA4
   */
  gaId?: string;
  
  /**
   * Custom endpoint to send metrics (optional)
   * If provided, metrics will be POSTed to this endpoint
   */
  endpoint?: string;
  
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

function sendToGoogleAnalytics(metric: Metric, gaId: string) {
  if (typeof window === 'undefined' || !(window as any).gtag) {
    return;
  }

  const { id, name, value, label, delta } = metric;

  // Send to Google Analytics
  (window as any).gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
    // Custom dimensions
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
    metric_label: label,
  });
}

async function sendToEndpoint(metric: Metric, endpoint: string) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        label: metric.label,
        rating: metric.rating,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        url: window.location.href,
      }),
      // Don't block page unload
      keepalive: true,
    });
  } catch (error) {
    console.error('Error sending Web Vital to endpoint:', error);
  }
}

function logMetric(metric: Metric, debug: boolean) {
  if (!debug) return;
  
  const { name, value, id, delta, rating, label } = metric;
  console.log(`[Web Vitals] ${name}:`, {
    value: Math.round(value),
    id,
    delta: Math.round(delta),
    rating,
    label,
  });
}

export function WebVitals({ gaId, endpoint, debug = false }: WebVitalsProps) {
  const handleMetric = useCallback(
    (metric: Metric) => {
      logMetric(metric, debug);
      if (gaId) sendToGoogleAnalytics(metric, gaId);
      if (endpoint) sendToEndpoint(metric, endpoint);
    },
    [gaId, endpoint, debug]
  );

  useReportWebVitals(handleMetric);

  return null; // This component doesn't render anything
}
