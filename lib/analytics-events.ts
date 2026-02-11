/**
 * Eventos de analytics (GA4). Usar desde cliente.
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function trackSearchEvent(searchTerm: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'search', {
    search_term: searchTerm,
  });
}

export function trackNewsletterSignup(source: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'newsletter_signup', {
    method: source,
  });
}

export function trackNewsletterError(source: string, reason?: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'newsletter_error', {
    method: source,
    ...(reason && { error_message: reason }),
  });
}

export function trackExitIntentModalShown(): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'newsletter_exit_intent_shown', {});
}
