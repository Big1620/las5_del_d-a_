/**
 * Sentry Server (Node.js)
 * Para habilitar: npm install @sentry/nextjs y definir SENTRY_DSN
 */

// Stub: con output: 'export' no hay servidor Node; este archivo no se ejecuta en build estático
const dsn = process.env.SENTRY_DSN;
if (dsn) {
  console.warn('[Sentry] DSN configurado pero @sentry/nextjs no instalado.');
}
export {};
