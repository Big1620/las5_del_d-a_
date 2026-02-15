/**
 * Sentry Edge Runtime
 * Para habilitar: npm install @sentry/nextjs y definir SENTRY_DSN
 */

// Stub: con output: 'export' no hay edge runtime; este archivo no se ejecuta
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  console.warn('[Sentry] DSN configurado pero @sentry/nextjs no instalado.');
}
export {};
