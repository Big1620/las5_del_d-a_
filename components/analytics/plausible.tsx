/**
 * Plausible Analytics - Privacy-first analytics
 * https://plausible.io/docs
 *
 * Uso: configurar NEXT_PUBLIC_PLAUSIBLE_DOMAIN en .env
 */

'use client';

import Script from 'next/script';

interface PlausibleProps {
  /** Dominio configurado en Plausible (ej: lascincodeldia.com) */
  domain: string;
  /** Custom domain para el script (opcional) */
  customDomain?: string;
  /** Habilitar tracking de outbound links */
  trackOutbound?: boolean;
}

export function Plausible({ domain, customDomain, trackOutbound }: PlausibleProps) {
  if (!domain?.trim()) return null;

  const src = customDomain
    ? `https://${customDomain}/js/script.js`
    : 'https://plausible.io/js/script.js';

  const dataDomain = domain.trim();

  return (
    <Script
      defer
      data-domain={dataDomain}
      data-track-outbound-links={trackOutbound ? 'true' : undefined}
      src={src}
      strategy="afterInteractive"
    />
  );
}
