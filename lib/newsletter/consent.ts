import type { NewsletterConsent } from './schema';

const STORAGE_KEY = 'newsletter_consent';

/**
 * Guarda el consentimiento de newsletter en localStorage (auditoría / GDPR).
 * Solo se usa en cliente.
 */
export function saveNewsletterConsent(data: Omit<NewsletterConsent, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const record: NewsletterConsent = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    const existing = getStoredConsents();
    const updated = [record, ...existing].slice(0, 10);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage full o no disponible
  }
}

/**
 * Lee los últimos consentimientos guardados (solo cliente).
 */
export function getStoredConsents(): NewsletterConsent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
