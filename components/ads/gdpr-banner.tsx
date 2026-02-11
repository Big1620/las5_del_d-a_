/**
 * GDPR Cookie Consent Banner
 * Compatible con Consent Mode v2 - actualiza gtag al aceptar/rechazar
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'las5_consent';

export type ConsentChoice = 'accepted' | 'rejected' | null;

interface GdprBannerProps {
  onConsentUpdate?: (choice: ConsentChoice) => void;
  /** Mostrar siempre (ej. en dev) o solo si no hay consentimiento guardado */
  forceShow?: boolean;
}

export function GdprBanner({ onConsentUpdate, forceShow = false }: GdprBannerProps) {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    if (!stored || forceShow) {
      setVisible(true);
    } else {
      setChoice(stored);
    }
  }, [forceShow]);

  const persistAndClose = (value: ConsentChoice) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CONSENT_KEY, value!);
    setChoice(value);
    setVisible(false);
    onConsentUpdate?.(value);
  };

  const accept = () => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (cmd: string, action: string, opts: object) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (cmd: string, action: string, opts: object) => void }).gtag;
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    }
    persistAndClose('accepted');
  };

  const reject = () => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (cmd: string, action: string, opts: object) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (cmd: string, action: string, opts: object) => void }).gtag;
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    persistAndClose('rejected');
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Configuración de cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted-foreground mb-4">
          Utilizamos cookies para ofrecerte la mejor experiencia, personalizar anuncios y analizar el tráfico.
          Puedes aceptar todas, solo las necesarias o rechazarlas.{' '}
          <Link href="/privacidad" className="underline hover:no-underline">
            Política de privacidad
          </Link>
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
          >
            Aceptar todas
          </button>
          <button
            type="button"
            onClick={reject}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-muted"
          >
            Solo necesarias
          </button>
        </div>
      </div>
    </div>
  );
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
}
