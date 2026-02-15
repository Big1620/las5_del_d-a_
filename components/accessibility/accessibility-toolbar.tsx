'use client';

/**
 * Barra de Accesibilidad WCAG 2.0
 *
 * Implementa criterios de éxito WCAG 2.0 Level A y AA:
 * - 1.4.4 Resize Text (AA): Aumentar/Disminuir tamaño de texto
 * - 1.4.3 Contrast Minimum (AA): Modo alto contraste
 * - 2.2.2 Pause, Stop, Hide (A): Reducir movimiento
 * - 1.4.1 Use of Color (A): Subrayar enlaces (no depender solo del color)
 * - 2.4.7 Focus Visible (AA): Resaltar foco visible
 * - 2.1.1 Keyboard (A): Control total por teclado
 * - 4.1.2 Name, Role, Value (A): Atributos ARIA correctos
 */

import { useEffect, useState } from 'react';
import {
  Type,
  Contrast,
  Move,
  Underline as UnderlineIcon,
  Focus,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'a11y-preferences';

interface A11yPreferences {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
  emphasisFocus: boolean;
}

const DEFAULT_PREFS: A11yPreferences = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
  emphasisFocus: false,
};

function loadPreferences(): A11yPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<A11yPreferences>;
      return { ...DEFAULT_PREFS, ...parsed };
    }
    // Sin preferencias guardadas: respetar preferencia del sistema (prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return { ...DEFAULT_PREFS, reduceMotion: prefersReducedMotion };
  } catch {
    /* ignore */
  }
  return DEFAULT_PREFS;
}

function savePreferences(prefs: A11yPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function applyPreferences(prefs: A11yPreferences) {
  const root = document.documentElement;
  root.style.fontSize = `${prefs.fontSize}%`;
  root.dataset.a11yHighContrast = String(prefs.highContrast);
  root.dataset.a11yReduceMotion = String(prefs.reduceMotion);
  root.dataset.a11yUnderlineLinks = String(prefs.underlineLinks);
  root.dataset.a11yEmphasisFocus = String(prefs.emphasisFocus);
}

export function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    applyPreferences(loaded);
  }, []);

  useEffect(() => {
    applyPreferences(prefs);
    savePreferences(prefs);
  }, [prefs]);

  const updatePref = <K extends keyof A11yPreferences>(
    key: K,
    value: A11yPreferences[K]
  ) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const resetAll = () => {
    setPrefs(DEFAULT_PREFS);
  };

  const toggle = (key: keyof Omit<A11yPreferences, 'fontSize'>) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const handleToggle = () => setOpen((o) => !o);

  return (
    <div
      className="fixed bottom-0 right-0 z-[9998] flex flex-col items-end gap-2 p-3"
      role="complementary"
      aria-label="Opciones de accesibilidad"
    >
      {/* Panel desplegable - se muestra/oculta al hacer click en el botón */}
      <div
        id="a11y-panel"
        className={cn(
          'overflow-hidden rounded-lg border bg-background shadow-lg transition-[max-height,opacity] duration-300 ease-in-out',
          open
            ? 'max-h-[450px] opacity-100 visible'
            : 'max-h-0 opacity-0 invisible pointer-events-none'
        )}
        onKeyDown={handleKeyDown}
      >
        <div
          className="w-72 space-y-4 p-4"
          role="group"
          aria-labelledby="a11y-panel-title"
        >
          <h2
            id="a11y-panel-title"
            className="text-base font-semibold"
          >
            Accesibilidad
          </h2>

          {/* 1.4.4 Tamaño de texto */}
          <div role="group" aria-labelledby="a11y-font-label">
            <span
              id="a11y-font-label"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <Type className="h-4 w-4" aria-hidden />
              Tamaño del texto
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  updatePref('fontSize', Math.max(90, prefs.fontSize - 10))
                }
                aria-label="Disminuir tamaño de texto"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                A−
              </button>
              <span className="min-w-[3rem] text-center text-sm">
                {prefs.fontSize}%
              </span>
              <button
                type="button"
                onClick={() =>
                  updatePref('fontSize', Math.min(150, prefs.fontSize + 10))
                }
                aria-label="Aumentar tamaño de texto"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                A+
              </button>
            </div>
          </div>

          {/* 1.4.3 Alto contraste */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Contrast className="h-4 w-4" aria-hidden />
              Alto contraste
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.highContrast}
              aria-label="Activar modo alto contraste"
              onClick={() => toggle('highContrast')}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                prefs.highContrast ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition',
                  prefs.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* 2.2.2 Reducir movimiento */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Move className="h-4 w-4" aria-hidden />
              Reducir movimiento
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.reduceMotion}
              aria-label="Reducir animaciones y transiciones"
              onClick={() => toggle('reduceMotion')}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                prefs.reduceMotion ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition',
                  prefs.reduceMotion ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* 1.4.1 Subrayar enlaces */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium">
              <UnderlineIcon className="h-4 w-4" aria-hidden />
              Subrayar enlaces
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.underlineLinks}
              aria-label="Subrayar todos los enlaces para mejor visibilidad"
              onClick={() => toggle('underlineLinks')}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                prefs.underlineLinks ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition',
                  prefs.underlineLinks ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* 2.4.7 Resaltar foco */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Focus className="h-4 w-4" aria-hidden />
              Resaltar foco
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.emphasisFocus}
              aria-label="Resaltar elemento enfocado de forma más visible"
              onClick={() => toggle('emphasisFocus')}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                prefs.emphasisFocus ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition',
                  prefs.emphasisFocus ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          {/* Restablecer */}
          <button
            type="button"
            onClick={resetAll}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Restablecer todas las opciones de accesibilidad"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restablecer
          </button>
        </div>
      </div>

      {/* Botón flotante - Símbolo de accesibilidad */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-haspopup="true"
        aria-label={open ? 'Cerrar opciones de accesibilidad' : 'Abrir opciones de accesibilidad'}
        id="a11y-trigger"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95">
          <img
            src="/images/accessibility-icon.png"
            alt=""
            className="h-6 w-6 object-contain"
            aria-hidden
            width={24}
            height={24}
          />
        </span>
      </button>
    </div>
  );
}
