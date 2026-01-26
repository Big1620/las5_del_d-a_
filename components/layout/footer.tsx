/**
 * Footer Component
 * Site footer with links, newsletter, and social media
 */

import Link from 'next/link';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las 5 del Día';
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const footerLinks = {
    noticias: [
      { label: 'Política', href: '/categoria/politica' },
      { label: 'Economía', href: '/categoria/economia' },
      { label: 'Deportes', href: '/categoria/deportes' },
      { label: 'Tecnología', href: '/categoria/tecnologia' },
    ],
    empresa: [
      { label: 'Sobre nosotros', href: '/sobre-nosotros' },
      { label: 'Contacto', href: '/contacto' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Términos de uso', href: '/terminos' },
    ],
  };

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              Noticias de última hora, análisis y reportajes de actualidad.
            </p>
          </div>

          {/* Noticias */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Noticias</h4>
            <ul className="space-y-2">
              {footerLinks.noticias.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter placeholder */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir las últimas noticias.
            </p>
            {/* Newsletter form would go here */}
          </div>
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
