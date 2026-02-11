/**
 * Header Component
 * Debajo del AdBar. Logo centrado en desktop, nav dinámica (WordPress top-level categories),
 * búsqueda y tema a la derecha, hamburger en móvil. Sticky al hacer scroll.
 */

'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { PrefetchOnHover } from '@/components/news/prefetch-on-hover';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { getCategoryHref, isUncategorized } from '@/lib/utils';
import type { Category } from '@/types';
import { SocialIcons } from '@/components/layout/social-icons';
import { cn } from '@/lib/utils';

const SearchOverlay = dynamic(
  () => import('@/components/search/search-overlay').then((m) => ({ default: m.SearchOverlay })),
  { ssr: false }
);

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

interface HeaderProps {
  categories?: Category[];
}

function getCategoryDisplayName(cat: Category): string {
  return cat.name || cat.slug;
}

export function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchQueryFromUrl = searchParams.get('q') ?? '';

  const topLevelCategories = categories.filter(
    (c) => (!c.parent || c.parent === 0) && !isUncategorized(c)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const closeSearchOverlay = () => setIsSearchOpen(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isCategoryActive = (slug: string) => pathname === `/categoria/${slug}`;

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#0a2463] dark:bg-background shadow-sm transition-shadow duration-200"
      role="banner"
    >
      <div className="relative mx-auto w-full max-w-[1440px] min-w-0 px-3 sm:px-4 overflow-x-hidden">
        {/* Fila superior: redes + categorías alineadas a la línea roja inferior; logo a la derecha */}
        <div className="header-top-row flex min-h-14 md:min-h-16 pt-2 pb-0 md:pt-3 md:pb-0 items-end justify-between gap-4 overflow-visible border-b-2 border-[var(--primary-red)]">
          {/* Izquierda: redes + categorías — 300px más a la izquierda en desktop */}
          <div className="header-social-wrap flex flex-col md:flex-row md:items-end min-w-0 flex-1 gap-2 overflow-visible pb-2 md:pb-2">
            <div className="flex flex-col md:flex-row md:items-end gap-2 xl:relative xl:left-[-190px]">
              <div className="flex items-center gap-2">
                <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0a2463]"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
                aria-expanded={menuOpen}
                aria-controls="main-nav-mobile"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <SocialIcons className="hidden shrink-0 md:flex" />
              </div>
              {/* Categorías: Inicio, Actualidad... en la misma línea que las redes (línea horizontal roja) */}
              <nav
                id="main-nav-mobile"
              aria-label="Navegación principal"
                className={cn(
                  'border-t border-white/20 md:border-t-0',
                  'overflow-x-auto md:overflow-visible',
                  'absolute md:relative left-0 right-0 top-full z-40 md:top-0 md:left-auto md:right-auto',
                  'bg-[#0a2463] dark:bg-background',
                  menuOpen ? 'block' : 'hidden md:block'
                )}
              >
              <div className="flex items-center gap-1 py-3 md:py-0 md:min-h-0 flex-nowrap">
                <PrefetchOnHover href="/">
                  <Link
                    href="/"
                    className={cn(
                      'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40',
                      pathname === '/' ? 'bg-white/15 font-bold' : 'font-normal'
                    )}
                  >
                    Inicio
                  </Link>
                </PrefetchOnHover>
                {topLevelCategories.map((cat) => {
                  const href = getCategoryHref(cat);
                  const active = isCategoryActive(cat.slug);
                  return (
                    <PrefetchOnHover key={cat.id} href={href}>
                      <Link
                        href={href}
                        className={cn(
                          'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40',
                          active ? 'bg-white/15 font-bold' : 'font-normal'
                        )}
                        aria-current={active ? 'page' : undefined}
                      >
                        {getCategoryDisplayName(cat)}
                      </Link>
                    </PrefetchOnHover>
                  );
                })}
              </div>
            </nav>
            </div>
          </div>

          {/* Espaciador en desktop para empujar el logo a la derecha */}
          <div className="hidden md:block flex-1" aria-hidden />

          {/* Derecha: logo fijo; búsqueda y tema posicionados a la derecha sin afectar el logo */}
          <div className="header-logo-wrap flex items-center justify-end gap-1 sm:gap-2 md:gap-4 xl:-translate-x-[170px] overflow-visible shrink-0 min-w-0">
            <Link
              href="/"
              className="logo-link shrink-0 text-xl sm:text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white no-underline hover:opacity-90 dark:text-foreground block text-right overflow-visible min-w-0"
              aria-label={`${SITE_NAME} - Inicio`}
            >
              <span className="inline-block whitespace-nowrap md:-translate-x-[50px]">
                Las{'\u00A0'}
                {SITE_NAME.replace(/^Las\s+/i, '').trim() || 'cinco del día'}
              </span>
            </Link>
            <div className="absolute right-[calc(0.75rem-300px)] sm:right-[calc(1rem-300px)] top-1/2 -translate-y-1/2 md:top-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0a2463]"
                aria-label="Abrir búsqueda"
                aria-expanded={isSearchOpen}
              >
                <Search className="h-5 w-5" />
              </button>
              {mounted && createPortal(
                <SearchOverlay isOpen={isSearchOpen} onClose={closeSearchOverlay} initialQuery={searchQueryFromUrl} />,
                document.body
              )}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 text-white hover:bg-white/10 focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0a2463] dark:text-foreground"
                  onClick={toggleTheme}
                  aria-label={resolvedTheme === 'dark' ? 'Usar tema claro' : 'Usar tema oscuro'}
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
