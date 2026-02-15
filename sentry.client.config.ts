/**
 * Sentry Client (browser)
 * Captura errores en el navegador. Con output: 'export' solo se ejecuta el cliente.
 * Requiere: SENTRY_DSN o NEXT_PUBLIC_SENTRY_DSN en variables de entorno.
 */

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.1,
    environment: process.env.NODE_ENV || 'production',
  });
}
