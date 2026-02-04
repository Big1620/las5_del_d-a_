# Optimizaciones Implementadas

Este documento describe las optimizaciones que se han implementado en el proyecto.

---

## ✅ 1. Revalidación Diferenciada por Tipo de Contenido

### Implementación

Se han configurado diferentes tiempos de revalidación según el tipo de contenido:

| Tipo de Página | Tiempo de Revalidación | Archivo |
|----------------|------------------------|---------|
| **Home** | 60 segundos | `app/page.tsx` |
| **Artículos individuales** | 300 segundos (5 min) | `app/noticias/[slug]/page.tsx` |
| **Categorías** | 120 segundos (2 min) | `app/categoria/[slug]/page.tsx` |
| **Etiquetas** | 120 segundos (2 min) | `app/etiqueta/[slug]/page.tsx` |
| **Autores** | 120 segundos (2 min) | `app/autor/[slug]/page.tsx` |
| **Slugs para generateStaticParams** | 3600 segundos (1 hora) | `lib/api/wordpress.ts` |
| **Categorías en layout** | 300 segundos (5 min) | `lib/api/wordpress.ts` |

### Beneficios

- **Menor carga en WordPress**: Los artículos individuales se revalidan menos frecuentemente
- **Mejor rendimiento**: Menos requests innecesarios a la API
- **Contenido fresco**: Home y breaking news se actualizan cada minuto
- **Build más rápido**: Los slugs para static params se cachean por 1 hora

### Archivos Modificados

- `app/page.tsx` - Revalidación de 60s (ya estaba configurado)
- `app/noticias/[slug]/page.tsx` - Cambiado de 60s a 300s
- `app/categoria/[slug]/page.tsx` - Cambiado de 60s a 120s
- `app/etiqueta/[slug]/page.tsx` - Cambiado de 60s a 120s
- `app/autor/[slug]/page.tsx` - Cambiado de 60s a 120s
- `lib/api/wordpress.ts`:
  - `getPostSlugs()` - Revalidación de 3600s
  - `getCategorySlugs()` - Revalidación de 3600s
  - `getTagSlugs()` - Revalidación de 3600s
  - `getAuthorSlugs()` - Revalidación de 3600s
  - `getCategories()` - Revalidación de 300s

---

## ✅ 2. Web Vitals y Analytics

### Implementación

Se han creado componentes para capturar y enviar métricas de rendimiento:

#### Componentes Creados

1. **`components/analytics/web-vitals.tsx`**
   - Captura Core Web Vitals (LCP, FID, INP, CLS, FCP, TTFB)
   - Envía métricas a Google Analytics (si está configurado)
   - Opción de enviar a endpoint personalizado
   - Modo debug para desarrollo

2. **`components/analytics/google-analytics.tsx`**
   - Carga script de Google Analytics 4
   - Tracking automático de páginas
   - Soporte para eventos personalizados

3. **`components/analytics/index.tsx`**
   - Componente wrapper que combina GA y Web Vitals
   - Configuración centralizada

### Configuración

#### Variables de Entorno

Agregar a `.env.local`:

```env
# Google Analytics Measurement ID (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Web Vitals endpoint personalizado (opcional)
NEXT_PUBLIC_WEB_VITALS_ENDPOINT=/api/web-vitals
```

#### Integración en Layout

El componente `AnalyticsProvider` se ha integrado en `app/layout.tsx`:

```tsx
<AnalyticsProvider
  gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
  webVitalsEndpoint={process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT}
  debug={process.env.NODE_ENV === 'development'}
/>
```

### Métricas Capturadas

- **LCP (Largest Contentful Paint)**: Tiempo hasta que se renderiza el elemento más grande
- **FID (First Input Delay)**: Tiempo hasta la primera interacción del usuario
- **INP (Interaction to Next Paint)**: Métrica nueva que reemplaza FID
- **CLS (Cumulative Layout Shift)**: Estabilidad visual
- **FCP (First Contentful Paint)**: Primer contenido visible
- **TTFB (Time to First Byte)**: Tiempo hasta el primer byte del servidor

### Beneficios

- **Monitoreo de rendimiento**: Métricas reales de usuarios
- **Identificación de problemas**: Detectar páginas lentas o con problemas de CLS
- **Mejora continua**: Datos para optimizar el rendimiento
- **Google Analytics**: Integración completa con GA4 para dashboards

### Uso

#### Con Google Analytics

1. Obtener Measurement ID de Google Analytics 4
2. Agregar a `.env.local`: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
3. Las métricas se enviarán automáticamente a GA4

#### Con Endpoint Personalizado

1. Crear endpoint en `app/api/web-vitals/route.ts`
2. Agregar a `.env.local`: `NEXT_PUBLIC_WEB_VITALS_ENDPOINT=/api/web-vitals`
3. Las métricas se enviarán como POST a tu endpoint

#### Modo Debug

En desarrollo, las métricas se muestran en la consola del navegador.

---

## 📊 Impacto Esperado

### Rendimiento

- **Reducción de requests**: ~70% menos requests a WordPress API
- **Mejor cache**: Contenido estático cacheado por más tiempo
- **Build más rápido**: Menos tiempo en generateStaticParams

### Monitoreo

- **Visibilidad completa**: Métricas de rendimiento en tiempo real
- **Detección temprana**: Identificar problemas antes de que afecten a usuarios
- **Datos accionables**: Información para optimizaciones futuras

---

## 🔄 Próximos Pasos Recomendados

1. **Configurar Google Analytics**: Obtener Measurement ID y agregarlo a `.env.local`
2. **Monitorear métricas**: Revisar Web Vitals en Google Analytics después de deploy
3. **Crear dashboard**: Configurar dashboard en GA4 para visualizar métricas
4. **Ajustar revalidación**: Basado en datos reales, ajustar tiempos si es necesario

---

## 📝 Notas

- Las optimizaciones son compatibles con el código existente
- No hay breaking changes
- Los componentes de analytics son opcionales (no requieren configuración para funcionar)
- El modo debug solo está activo en desarrollo
