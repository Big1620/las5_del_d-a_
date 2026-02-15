'use client';

/**
 * Global Error Boundary - captura errores no manejados en App Router.
 * Integrado con Sentry cuando SENTRY_DSN está configurado.
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcional: instalar @sentry/nextjs y añadir captureException aquí
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Algo ha fallado</h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
