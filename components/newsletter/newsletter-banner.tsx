'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NewsletterForm } from './newsletter-form';
import { cn } from '@/lib/utils';

const BANNER_DISMISSED_KEY = 'newsletter_banner_dismissed';
const BANNER_DELAY_MS = 3000; // Mostrar tras 3s de scroll/tiempo en página

export function NewsletterBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(BANNER_DISMISSED_KEY) === '1') return;
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, BANNER_DELAY_MS);

    return () => clearTimeout(timer);
  }, [mounted]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(BANNER_DISMISSED_KEY, '1');
    } catch {
      // ignore
    }
  };

  const handleSuccess = () => {
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80',
        'animate-in slide-in-from-bottom duration-300'
      )}
      aria-label="Suscripción a la newsletter"
    >
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-3 px-3 sm:px-4 py-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            Recibe las 5 noticias del día en tu correo.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sin spam. Puedes darte de baja cuando quieras.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto min-w-0">
          <div className="flex-1 min-w-0 w-full sm:min-w-[180px] sm:max-w-[280px]">
            <NewsletterForm
              source="banner"
              variant="minimal"
              emailPlaceholder="tu@email.com"
              submitLabel="Suscribirme"
              showGdprText={false}
              onSuccess={handleSuccess}
            />
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Cerrar banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
