# Informe de optimización Next.js para Lighthouse y Web Vitals

**Objetivo:** Lighthouse >90 en Performance, optimización para medios (LCP, CLS, JS, cache, ISR).

**Fecha:** Febrero 2025

---

## 1. Resumen de cambios aplicados

| Área | Cambio | Archivo(s) |
|------|--------|------------|
| **Fuentes** | Preconnect a Google Fonts para reducir latencia y mejorar LCP | `app/layout.tsx` |
| **next/image** | Hero y artículo: `priority` + `placeholder="blur"` + `blurDataURL` para evitar CLS | `hero-article.tsx`, `app/noticias/[slug]/page.tsx` |
| **Hero** | Imagen hero con `priority`, `fetchPriority="high"` y blur placeholder | `components/news/hero-article.tsx` |
| **Dynamic imports** | AdSlot en noticias, categoría, etiqueta y autor; NewsletterCapture en layout | `app/noticias/[slug]/page.tsx`, `app/categoria/[slug]/page.tsx`, `app/etiqueta/[slug]/page.tsx`, `app/autor/[slug]/page.tsx`, `app/layout.tsx` |
| **Bundle analyzer** | Ya configurado: `ANALYZE=true npm run build` o `npm run build:analyze` | `next.config.js`, `package.json` |
| **Reducir JS** | `optimizePackageImports` para lucide-react y todos los @radix-ui/* | `next.config.js` |
| **Cache headers** | Cache largo para `/_next/image`; estático ya con immutable | `next.config.js` |
| **CLS** | `contain: layout` en `.ad-slot`; aspect-ratio y blur en imágenes críticas | `globals.css`, hero/article |
| **Lazy Ads** | AdSlot con IntersectionObserver + dynamic import; `lazy` por defecto | `ad-slot.tsx`, páginas |
| **Prefetch rutas** | Prefetch en hover para Inicio y categorías en el header | `header.tsx`, `prefetch-on-hover.tsx` |
| **HTTP caching** | Headers para `/_next/static`, `/_next/image`, .ico, .png, .jpg, .webp | `next.config.js` |
| **ISR** | Revalidación ya afinada: Home 60s, artículos 300s, categorías/etiquetas/autores 60–120s | `app/page.tsx`, `app/noticias/[slug]/page.tsx`, etc. |
| **Web Vitals** | Componente existente: LCP, FID/INP, CLS, FCP, TTFB; envío a GA y/o endpoint | `components/analytics/web-vitals.tsx` |

---

## 2. Detalle por objetivo

### 2.1 Lighthouse >90

- **LCP:** Preconnect fuentes, hero con `priority` + `fetchPriority="high"`, blur placeholder para reservar espacio.
- **FID/INP:** Menos JS en carga inicial gracias a dynamic imports (AdSlot, NewsletterCapture, TrendingSidebar, SearchOverlay).
- **CLS:** Reserva de espacio en ads (min-height + `contain: layout`), imágenes con aspect-ratio y blur.
- **TBT:** Tree-shaking con `optimizePackageImports` (lucide-react, @radix-ui/*).

### 2.2 Preload / preconnect fuentes

- En `app/layout.tsx` se añadieron:
  - `<link rel="preconnect" href="https://fonts.googleapis.com" />`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />`
- `next/font` (Source_Serif_4) ya inyecta preload; el preconnect reduce la latencia de la conexión.

### 2.3 next/image optimizado

- **Hero:** `priority`, `fetchPriority="high"`, `sizes` correctos, `placeholder="blur"` + `blurDataURL`.
- **Artículo:** Imagen destacada con `priority`, `sizes="(max-width: 1024px) 100vw, 66vw"`, blur placeholder.
- **Resto:** Column cards y secondary usan `sizes` adecuados y lazy por defecto.
- **Config:** `formats: ['image/avif', 'image/webp']`, `deviceSizes` y `imageSizes` en `next.config.js`.

### 2.4 Priority en hero

- En `HeroArticle`: `priority` y `fetchPriority="high"` en la imagen principal.

### 2.5 Dynamic imports

- **AdSlot:** Dynamic con `ssr: false` en home, noticias, categoría, etiqueta, autor y AdBar.
- **TrendingSidebar:** Dynamic en home.
- **SearchOverlay:** Dynamic en header.
- **NewsletterCapture:** Dynamic en layout (`ssr: false`).

### 2.6 Bundle analyzer

- Uso: `npm run build:analyze` o `ANALYZE=true next build`.
- Configuración en `next.config.js` con `@next/bundle-analyzer`.

### 2.7 Reducir JS

- `experimental.optimizePackageImports`: `lucide-react` y todos los paquetes `@radix-ui/*` usados en el proyecto.
- Carga diferida de anuncios y newsletter para reducir el bundle inicial.

### 2.8 Cache headers

- `/_next/static/*`: `public, max-age=31536000, immutable`
- `/_next/image`: `public, max-age=31536000, immutable`
- `.ico`, `.png`, `.jpg`, `.webp`: `public, max-age=86400`
- Headers de seguridad: X-Content-Type-Options, Referrer-Policy, X-DNS-Prefetch-Control.

### 2.9 CLS controlado

- **Ads:** `.ad-slot` con `min-height` y `contain: layout`.
- **Imágenes:** Hero y artículo con contenedor con aspect-ratio y blur para evitar saltos.
- **Skeleton:** Placeholders con altura mínima en loading de AdSlot y TrendingSidebar.

### 2.10 Lazy Ads

- AdSlot con prop `lazy` (por defecto `true`) e IntersectionObserver (`rootMargin: 50px`).
- AdSlot cargado con dynamic import y `ssr: false` para no bloquear el primer render.

### 2.11 Prefetch rutas

- Componente `PrefetchOnHover`: al hacer hover en un enlace se llama a `router.prefetch(href)`.
- En el header se usa en “Inicio” y en cada enlace de categoría para prefetch al pasar el ratón.

### 2.12 HTTP caching

- Descrito en 2.8; todos los activos estáticos y optimización de imágenes con Cache-Control adecuado.

### 2.13 ISR tuning

- **Home:** `revalidate = 60`
- **Artículos:** `revalidate = 300`
- **Categorías:** `revalidate = 120`
- **Etiquetas / Autores:** `revalidate = 60`
- Slugs en `generateStaticParams` apoyados por cache en `lib/api/wordpress.ts` (según docs existentes).

### 2.14 Web Vitals

- `WebVitals` en `AnalyticsProvider` (layout) envía LCP, FID/INP, CLS, FCP, TTFB.
- Opcional: GA (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) y/o endpoint (`NEXT_PUBLIC_WEB_VITALS_ENDPOINT`).
- Modo debug en desarrollo para inspeccionar métricas en consola.

---

## 3. Cómo verificar

1. **Lighthouse (Chrome DevTools):**
   - Modo incógnito, “Performance”, ejecutar Lighthouse en la home y en una noticia.
   - Objetivo: Performance >90, sin regresiones en Best Practices / SEO / Accessibility.

2. **Bundle:**
   - `npm run build:analyze` y revisar tamaño de chunks y dependencias pesadas.

3. **Web Vitals en producción:**
   - Configurar GA y/o endpoint y revisar LCP, INP, CLS en informes o dashboards.

4. **Cache:**
   - En Network, comprobar que `_next/static` e `_next/image` devuelven `Cache-Control` con `immutable` o `max-age` alto.

---

## 4. Archivos modificados (resumen)

- `app/layout.tsx` – Preconnect fuentes, dynamic NewsletterCapture
- `next.config.js` – Cache `/_next/image`, optimizePackageImports (radix)
- `app/globals.css` – `contain: layout` en `.ad-slot`
- `components/news/hero-article.tsx` – placeholder blur + blurDataURL
- `app/noticias/[slug]/page.tsx` – dynamic AdSlot, blur en imagen destacada, limpieza import
- `app/categoria/[slug]/page.tsx` – dynamic AdSlot
- `app/etiqueta/[slug]/page.tsx` – dynamic AdSlot
- `app/autor/[slug]/page.tsx` – dynamic AdSlot
- `components/layout/header.tsx` – PrefetchOnHover en Inicio y categorías

---

## 5. Recomendaciones posteriores

- Medir en producción con RUM (GA4, Vercel Analytics o endpoint propio) y ajustar revalidate si hace falta.
- Si algún reporte de Lighthouse sigue por debajo de 90, revisar terceros (ads, analytics) y considerar cargar scripts después de LCP o con `requestIdleCallback`.
- Mantener `npm run build:analyze` en cada cambio relevante para evitar crecimientos de JS.
