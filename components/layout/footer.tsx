/**
 * Footer Component
 * Site footer with brand and copyright.
 */

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 w-full min-w-0" role="contentinfo">
      <div className="container mx-auto w-full max-w-[1440px] min-w-0 px-3 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">{SITE_NAME}</h3>
          <p className="text-sm text-muted-foreground">
            Noticias de última hora, análisis y reportajes de actualidad.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {CURRENT_YEAR} {SITE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
