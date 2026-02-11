/**
 * Layout para /buscar: noindex para resultados de búsqueda (SEO)
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function BuscarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
