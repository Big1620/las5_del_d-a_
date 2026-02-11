'use client';

import { useState } from 'react';
import Link from 'next/link';
import { newsletterSchema, type NewsletterFormData } from '@/lib/newsletter/schema';
import { Button } from '@/components/ui/button';
import { trackNewsletterSignup, trackNewsletterError } from '@/lib/analytics-events';
import { saveNewsletterConsent } from '@/lib/newsletter/consent';
import { cn } from '@/lib/utils';

const API_URL = '/api/newsletter';

const GDPR_TEXT = (
  <>
    Al suscribirte aceptas nuestra{' '}
    <Link href="/privacidad" className="underline focus:outline-none focus:ring-2 focus:ring-ring rounded">
      política de privacidad
    </Link>
    . Puedes darte de baja en cualquier momento.
  </>
);

export type NewsletterFormVariant = 'inline' | 'stacked' | 'minimal';

export interface NewsletterFormProps {
  source?: string;
  variant?: NewsletterFormVariant;
  emailPlaceholder?: string;
  submitLabel?: string;
  showGdprText?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function NewsletterForm({
  source = 'website',
  variant = 'inline',
  emailPlaceholder = 'tu@email.com',
  submitLabel = 'Suscribirme',
  showGdprText = true,
  className,
  onSuccess,
}: NewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; consent?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const result = newsletterSchema.safeParse({ email, consent, source });

    if (!result.success) {
      const err = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: err.email?.[0],
        consent: err.consent?.[0],
      });
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(json.error || 'Error al suscribirse.');
        trackNewsletterError(source, json.error);
        return;
      }

      setStatus('success');
      saveNewsletterConsent({ email: result.data.email, consent: true, source });
      trackNewsletterSignup(source);
      onSuccess?.();
    } catch {
      setStatus('error');
      setErrorMessage('Error de conexión. Inténtalo más tarde.');
      trackNewsletterError(source, 'network_error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-md border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          ¡Gracias! Revisa tu correo para confirmar la suscripción.
        </p>
      </div>
    );
  }

  const isStacked = variant === 'stacked';
  const isMinimal = variant === 'minimal';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('space-y-3', className)}
      aria-label="Formulario de suscripción a la newsletter"
    >
      <div className={cn(isStacked && 'space-y-3', !isStacked && 'flex flex-wrap items-end gap-2')}>
        <div className={cn('flex-1 min-w-[200px]', isMinimal && 'min-w-0')}>
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'newsletter-email-error' : undefined}
            className={cn(
              'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
              fieldErrors.email && 'border-destructive'
            )}
          />
          {fieldErrors.email && (
            <p id="newsletter-email-error" className="mt-1 text-xs text-destructive" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {!isMinimal && (
          <div className="flex items-center gap-2">
            <input
              id="newsletter-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={status === 'loading'}
              aria-invalid={!!fieldErrors.consent}
              aria-describedby={fieldErrors.consent ? 'newsletter-consent-error' : 'newsletter-consent-desc'}
              className="h-4 w-4 rounded border-input focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="newsletter-consent" className="text-sm text-muted-foreground cursor-pointer">
              Acepto la política de privacidad
            </label>
          </div>
        )}

        <Button type="submit" disabled={status === 'loading'} className={isStacked ? 'w-full' : ''}>
          {status === 'loading' ? 'Enviando…' : submitLabel}
        </Button>
      </div>

      {isMinimal && (
        <div className="flex items-start gap-2">
          <input
            id="newsletter-consent-minimal"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === 'loading'}
            aria-invalid={!!fieldErrors.consent}
            className="mt-1 h-4 w-4 rounded border-input focus:ring-2 focus:ring-ring flex-shrink-0"
          />
          <label htmlFor="newsletter-consent-minimal" className="text-xs text-muted-foreground cursor-pointer">
            {GDPR_TEXT}
          </label>
        </div>
      )}

      {showGdprText && !isMinimal && (
        <p id="newsletter-consent-desc" className="text-xs text-muted-foreground">
          {GDPR_TEXT}
        </p>
      )}
      {fieldErrors.consent && (
        <p id="newsletter-consent-error" className="text-xs text-destructive" role="alert">
          {fieldErrors.consent}
        </p>
      )}

      {status === 'error' && errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
