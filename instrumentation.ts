/**
 * Next.js Instrumentation
 * Registra Sentry para servidor y edge cuando SENTRY_DSN está definido.
 * Requiere: npm install @sentry/nextjs
 */

export async function register() {
  if (!process.env.SENTRY_DSN) return;

  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config');
    }
  } catch {
    // @sentry/nextjs no instalado; ignorar
  }
}
