/**
 * Header Component
 * Debajo del AdBar. Logo centrado en desktop, nav dinámica (WordPress top-level categories),
 * búsqueda y tema a la derecha, hamburger en móvil. Sticky al hacer scroll.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { getCategoryHref, isUncategorized } from '@/lib/utils';
import type { Category } from '@/types';
import { SocialIcons } from '@/components/layout/social-icons';
import { cn } from '@/lib/utils';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

interface HeaderProps {
  categories?: Category[];
}

function getCategoryDisplayName(cat: Category): string {
  return cat.name || cat.slug;
}

export function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const topLevelCategories = categories.filter(
    (c) => (!c.parent || c.parent === 0) && !isUncategorized(c)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isCategoryActive = (slug: string) => pathname === `/categoria/${slug}`;

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#0a2463] dark:bg-background shadow-sm transition-shadow duration-200"
      role="banner"
    >
      <div className="mx-auto max-w-[1440px] px-4">
        {/* Fila superior: redes/hamburger a la izquierda, logo grande a la derecha con búsqueda y tema */}
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          {/* Izquierda: hamburger en móvil, redes en desktop */}
          <div className="flex min-w-0 flex-1 items-center justify-start gap-2">
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

          {/* Espaciador en desktop para empujar el logo a la derecha */}
          <div className="hidden md:block flex-1" aria-hidden />

          {/* Derecha: logo (más grande y alineado a la derecha), búsqueda y tema */}
          <div className="flex items-center justify-end gap-2 md:gap-4">
            <Link
              href="/"
              className="shrink-0 text-3xl md:text-5xl font-bold leading-none tracking-tight text-white no-underline hover:opacity-90 dark:text-foreground"
              aria-label={`${SITE_NAME} - Inicio`}
            >
              {SITE_NAME}
            </Link>
            <div className="flex items-center gap-1">
            {isSearchOpen ? (
              <>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex animate-in fade-in slide-in-from-right-4 duration-200 items-center gap-2 rounded-full border border-[#E0E0E0] bg-[#F8F8F8] py-2 pl-4 pr-1.5 shadow-md dark:border-border dark:bg-muted"
                  role="search"
                  aria-label="Buscar en el sitio"
                >
                  <Search className="h-4 w-4 shrink-0 text-neutral-500 dark:text-muted-foreground" aria-hidden />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                    placeholder="Buscar titulares, noticias..."
                    className="min-w-[140px] max-w-[200px] border-0 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-0 dark:text-foreground dark:placeholder:text-muted-foreground sm:min-w-[180px] sm:max-w-[280px]"
                    aria-label="Buscar"
                  />
                  <button
                    type="submit"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 dark:bg-primary dark:text-primary-foreground"
                    aria-label="Enviar búsqueda"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Cerrar búsqueda"
                >
                  <Search className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0a2463]"
                aria-label="Abrir búsqueda"
              >
                <Search className="h-5 w-5" />
              </button>
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

        {/* Navegación: categorías (desktop debajo del logo, móvil en drawer) */}
        <nav
          id="main-nav-mobile"
          aria-label="Navegación principal"
          className={cn(
            'border-t border-white/20 md:border-t-0',
            'overflow-x-auto md:overflow-visible',
            'absolute md:relative left-0 right-0 top-full z-40 md:top-0',
            'bg-[#0a2463] dark:bg-background',
            menuOpen ? 'block' : 'hidden md:block'
          )}
        >
          <div className="flex items-center gap-1 py-3 md:py-2 md:min-h-0">
            <Link
              href="/"
              className={cn(
                'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40',
                pathname === '/' ? 'bg-white/15 font-bold' : 'font-normal'
              )}
            >
              Inicio
            </Link>
            {topLevelCategories.map((cat) => {
              const href = getCategoryHref(cat);
              const active = isCategoryActive(cat.slug);
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={cn(
                    'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40',
                    active ? 'bg-white/15 font-bold' : 'font-normal'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {getCategoryDisplayName(cat)}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
