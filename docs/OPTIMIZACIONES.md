# Optimizaciones recomendadas – Las cinco del día

Documento de referencia con las optimizaciones que puedes aplicar al proyecto, ordenadas por impacto y esfuerzo.

---

## 1. Cache y revalidación

### Estado actual
- ISR con `revalidate = 60` en todas las páginas dinámicas.
- `fetchAPI` usa `force-cache` y `next.revalidate` (60 s por defecto).
- Una sola variable `REVALIDATE_TIME` para todo.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Revalidación por tipo de contenido** | Home y breaking: 30–60 s. Artículos individuales: 300 s (5 min). Categorías/etiquetas: 120 s. Listados de slugs para `generateStaticParams`: 3600 s (1 h). | Bajo |
| **Cache-Control en `next.config`** | Headers `Cache-Control` y `Stale-While-Revalidate` para rutas estáticas y API para que el CDN cachee más y sirva contenido “stale” mientras revalida. | Bajo |
| **Deduplicación de requests** | Next.js ya deduplica `fetch` en el mismo request. Revisar que no haya llamadas redundantes (ej. mismo post dos veces en la misma página). | Bajo |

**Ejemplo – Revalidación por ruta**

En `app/page.tsx`:
```ts
export const revalidate = 60; // Home: noticias frescas
```

En `app/noticias/[slug]/page.tsx`:
```ts
export const revalidate = 300; // Artículo: 5 min
```

En `lib/api/wordpress.ts` para `getCategorySlugs` / `getPostSlugs` (solo para `generateStaticParams`):
```ts
fetchAPI(url, { next: { revalidate: 3600 } }); // 1 hora
```

---

## 2. Prefetching y navegación

### Estado actual
- Uso de `<Link>` de Next.js (prefetch activo por defecto en producción).
- No hay prefetch explícito ni priorización.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Prefetch en links críticos** | En home, prefetch solo los 2–3 primeros artículos destacados: `<Link href={...} prefetch>`. El resto puede ir con `prefetch={false}` si hay muchas cards. | Bajo |
| **Prioridad de carga de imágenes** | En `ArticleCard` ya usas `priority` en variant `featured`. Revisar que solo 1–2 imágenes por vista tengan `priority`. | Ya aplicado en parte |
| **Preconnect a WordPress** | En `layout.tsx` o `_document`, añadir `<link rel="preconnect" href={WP_API_ORIGIN}>` para que el primer fetch a la API sea más rápido. | Bajo |

**Ejemplo – Preconnect en layout**

En `app/layout.tsx` (dentro de `<head>`):
```tsx
const wpOrigin = process.env.NEXT_PUBLIC_WP_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
{wpOrigin && (
  <link rel="preconnect" href={new URL(wpOrigin).origin} crossOrigin="anonymous" />
)}
```

---

## 3. Analytics

### Estado actual
- No hay integración de analytics.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Google Analytics (GA4)** | Script de GA4 en layout, respetando consentimiento (cookie banner). Cargar de forma asíncrona y no bloquear el render. | Medio |
| **Google Tag Manager** | Un solo script GTM y configurar eventos (vistas de página, clics en artículos, búsquedas) desde la interfaz. | Medio |
| **Vercel Analytics** | Si despliegas en Vercel, activar Vercel Analytics para métricas básicas sin código extra. | Bajo |
| **Eventos personalizados** | Registrar eventos como “clic en artículo”, “búsqueda”, “scroll hasta final” para analizar comportamiento. | Medio |

**Ejemplo – Componente Analytics (GA4)**

Crear `components/analytics/GoogleAnalytics.tsx`:
- Leer `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Inyectar el script de gtag.js de forma asíncrona.
- Opcional: solo inyectar si el usuario acepta cookies (con un provider de consentimiento).

---

## 4. Performance monitoring (métricas)

### Estado actual
- No hay métricas de rendimiento en producción.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Web Vitals (Core Web Vitals)** | Usar `next/web-vitals` y enviar LCP, FID, CLS, INP a tu analytics o a un endpoint. | Bajo |
| **Reporte a GA4** | Enviar los Web Vitals como eventos a GA4 para dashboards de rendimiento. | Bajo |
| **Sentry / similares** | Captura de errores en cliente y servidor, con contexto (página, usuario). | Medio |
| **Lighthouse CI** | En CI/CD, ejecutar Lighthouse en build o en deploy preview y fallar si las métricas bajan de un umbral. | Medio |

**Ejemplo – Web Vitals con `next/web-vitals`**

En `app/layout.tsx` (dentro del body, en un Client Component o usando un script):
- Importar `onCLS`, `onFID`, `onLCP`, `onINP`, `onFCP` desde `next/web-vitals`.
- En cada callback, enviar el evento a `gtag('event', ...)` o a un endpoint propio.

---

## 5. Bundling y carga de JS

### Estado actual
- Uso normal de Next.js (code splitting por ruta).
- Componentes como `ArticleCard`, `AdSlot` en client.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Dynamic import de componentes pesados** | Cargar con `next/dynamic` componentes que no sean críticos para el primer render (ej. sidebar de tendencias, newsletter, algún widget). | Bajo |
| **Lazy de AdSlot** | AdSlot ya usa lazy por vista; asegurar que no se importe nada pesado de más en el bundle inicial. | Bajo |
| **Revisar dependencias** | Revisar que Radix/shadcn solo importen lo necesario (tree-shaking). No suele requerir cambios. | Bajo |

**Ejemplo – Dynamic import del sidebar**

En `app/page.tsx`:
```ts
import dynamic from 'next/dynamic';
const TrendingSidebar = dynamic(
  () => import('@/components/news/trending-sidebar').then((m) => m.TrendingSidebar),
  { loading: () => <CategorySkeleton /> }
);
```

---

## 6. Imágenes

### Estado actual
- Next.js Image con AVIF/WebP.
- `remotePatterns` según WordPress.
- `priority` en artículos destacados.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Tamaños y `sizes`** | Revisar el atributo `sizes` en cada uso de `Image` para que coincida con el layout real y no se descarguen imágenes más grandes de lo necesario. | Bajo |
| **Placeholder blur** | Usar `placeholder="blur"` con `blurDataURL` para imágenes de WordPress (generar blur en build o con API). | Medio |
| **Límite de `deviceSizes`** | En `next.config.js` ya tienes buenos valores; en móvil no hace falta 3840px; se puede ajustar si el bundle de config crece. | Bajo |

---

## 7. Headers HTTP y CDN

### Estado actual
- Headers en `next.config.js`: `X-DNS-Prefetch-Control`, `X-Content-Type-Options`, `Referrer-Policy`.
- No hay headers de cache explícitos por ruta.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Cache-Control por tipo** | Rutas estáticas (`/contacto`, `/privacidad`): `public, max-age=86400, s-maxage=86400`. Rutas dinámicas: dejar que Next.js/ISR controle o añadir `stale-while-revalidate`. | Medio |
| **Security headers** | Añadir `X-Frame-Options`, `Permissions-Policy`, `Content-Security-Policy` (empezar en report-only si quieres ser conservador). | Medio |

**Ejemplo – Headers en `next.config.js`**

```js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        // ... los actuales ...
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
        },
      ],
    },
    {
      source: '/contacto',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=86400',
        },
      ],
    },
  ];
}
```

(Ajustar valores según tu estrategia de cache.)

---

## 8. API y datos

### Estado actual
- Una sola llamada a `getHomePageData()` que hace varias peticiones en paralelo (`Promise.all`).
- Layout hace `getCategories()` en cada request.

### Optimizaciones propuestas

| Optimización | Descripción | Esfuerzo |
|-------------|-------------|----------|
| **Cache de categorías en layout** | Las categorías cambian poco. Usar `revalidate: 300` o 600 en la llamada a `getCategories()` del layout para reducir carga en WordPress. | Bajo |
| **Streaming / Suspense** | En home, envolver secciones (destacados, últimas, sidebar) en `<Suspense>` con distintos fallbacks para que el usuario vea contenido progresivamente. | Medio |
| **Búsqueda** | La ruta `/api/search` llama a WordPress. Valorar cachear resultados de búsqueda por query (por ejemplo 1–5 min) para búsquedas repetidas. | Medio |

---

## Resumen por prioridad

| Prioridad | Optimización | Impacto | Esfuerzo |
|-----------|--------------|---------|----------|
| Alta | Revalidación por tipo de contenido | Alto | Bajo |
| Alta | Web Vitals + envío a analytics | Alto | Bajo |
| Alta | Preconnect a WordPress | Medio | Bajo |
| Media | Cache-Control y headers CDN | Alto | Medio |
| Media | Google Analytics / GTM | Alto | Medio |
| Media | Dynamic import de sidebar/widgets | Medio | Bajo |
| Media | Cache de categorías en layout | Medio | Bajo |
| Baja | Placeholder blur en imágenes | UX | Medio |
| Baja | Sentry (errores) | Estabilidad | Medio |
| Baja | Lighthouse CI | Calidad continua | Medio |

---

## Cómo aplicar

1. Empezar por las de **esfuerzo bajo** (revalidación por ruta, preconnect, Web Vitals, cache de categorías).
2. Seguir con **analytics** y **headers de cache** cuando definas CDN y dominio.
3. Dejar para una segunda fase: **Sentry**, **Lighthouse CI**, **CSP** y **streaming/Suspense** más fino.

Si indicas por cuál quieres empezar (cache, analytics, prefetch o monitoring), se puede bajar al código concreto de tu repo (archivos y líneas) en el siguiente paso.
