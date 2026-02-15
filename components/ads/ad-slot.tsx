/**
 * AdSlot Component
 * Google AdSense compatible ad slot with CLS prevention
 * 
 * Design decisions:
 * - Uses min-height to prevent layout shift (CLS)
 * - Lazy loads ads below the fold
 * - Supports multiple ad sizes
 * - Accessible with proper ARIA labels
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ADS_FEATURE_FLAGS } from '@/lib/ads/config';

export interface AdSlotProps {
  /**
   * AdSense ad slot ID (e.g., '1234567890')
   */
  adSlotId?: string;
  
  /**
   * Ad format (e.g., 'auto', 'rectangle', 'horizontal')
   */
  format?: string;
  
  /**
   * Ad size (e.g., '728x90', '300x250')
   */
  size?: string;
  
  /**
   * Minimum height to prevent CLS
   */
  minHeight?: number;
  
  /**
   * Lazy load the ad (only load when in viewport)
   */
  lazy?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Test mode - shows placeholder instead of real ads
   */
  testMode?: boolean;
}

export function AdSlot({
  adSlotId,
  format = 'auto',
  size,
  minHeight = 250,
  lazy = true,
  className,
  testMode,
}: AdSlotProps) {
  const isTestMode = testMode ?? ADS_FEATURE_FLAGS.testMode;
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // Start loading 50px before entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  useEffect(() => {
    if (!isVisible || isTestMode || isLoaded) return;
    if (!adSlotId || !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;

    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined') {
      interface WindowWithAdSense extends Window {
        adsbygoogle?: unknown[];
      }
      const win = window as WindowWithAdSense;
      
      if (!win.adsbygoogle) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize ad
      try {
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }
  }, [isVisible, adSlotId, isTestMode, isLoaded]);

  // Test mode - show placeholder (fondo #F0F0F0, texto "Ad Slot 728x90" / "Ad Slot 300x600")
  if (isTestMode) {
    const label = size ? `Ad Slot ${size}` : `Ad Slot ${format}`;
    return (
      <div
        ref={containerRef}
        className={cn(
          'flex items-center justify-center bg-bg-ad dark:bg-gray-800 border border-border-news/50',
          className
        )}
        style={{ minHeight: `${minHeight}px` }}
        aria-label="Anuncio (modo prueba)"
      >
        <span className="text-sm text-text-muted">{label}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('ad-slot', className)}
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Anuncio"
    >
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={adSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(size && { 'data-ad-size': size })}
        />
      )}
    </div>
  );
}
