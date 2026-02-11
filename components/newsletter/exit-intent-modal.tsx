'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { NewsletterForm } from './newsletter-form';
import { trackExitIntentModalShown } from '@/lib/analytics-events';

const SHOWN_KEY = 'newsletter_exit_intent_shown';

function hasShownRecently(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = sessionStorage.getItem(SHOWN_KEY);
    if (!raw) return false;
    const t = parseInt(raw, 10);
    return Date.now() - t < 24 * 60 * 60 * 1000; // 24h
  } catch {
    return false;
  }
}

function markShown(): void {
  try {
    sessionStorage.setItem(SHOWN_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Mostrar solo cuando el cursor sale por la parte superior (exit intent típico)
    if (e.clientY <= 5 && !hasShownRecently()) {
      setOpen(true);
      markShown();
      trackExitIntentModalShown();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mouseout', handleExitIntent, { passive: true });
    return () => window.removeEventListener('mouseout', handleExitIntent);
  }, [handleExitIntent]);

  const handleSuccess = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={true}
        closeLabel="Cerrar"
        className="max-w-md"
        aria-labelledby="exit-intent-title"
        aria-describedby="exit-intent-desc"
      >
        <DialogHeader>
          <DialogTitle id="exit-intent-title">
            ¿Te vas tan pronto?
          </DialogTitle>
          <DialogDescription id="exit-intent-desc">
            Recibe las 5 noticias del día en tu correo. Sin spam, solo lo importante.
          </DialogDescription>
        </DialogHeader>
        <NewsletterForm
          source="exit_intent"
          variant="stacked"
          submitLabel="Suscribirme"
          showGdprText={true}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
