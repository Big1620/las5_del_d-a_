# Las cinco del día - Frontend de Noticias

Frontend profesional de alto tráfico para plataforma de noticias conectado a WordPress Headless.

## 🚀 Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **WordPress REST API**
- **SEO-first architecture**
- **Google AdSense ready**
- **Cloudflare CDN compatible**
- **ISR / Revalidation**
- **Image optimization**
- **Lazy loading**
- **Edge ready**
- **Accessibility (WCAG 2.2)**

## 📁 Estructura del Proyecto

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   ├── globals.css        # Estilos globales
│   ├── providers.tsx      # Theme provider
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # sitemap.xml
├── components/
│   ├── ads/              # Componentes de anuncios
│   │   └── ad-slot.tsx
│   ├── layout/           # Componentes de layout
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── news/             # Componentes de noticias
│   │   ├── article-card.tsx
│   │   ├── breaking-news.tsx
│   │   └── trending-sidebar.tsx
│   └── ui/               # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── separator.tsx
│       └── switch.tsx
├── lib/
│   ├── api/              # API clients
│   │   └── wordpress.ts
│   ├── seo/              # Utilidades SEO
│   │   ├── metadata.ts
│   │   └── structured-data.ts
│   └── utils.ts          # Utilidades generales
├── types/                # TypeScript types
│   └── index.ts
└── public/               # Archivos estáticos
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
# Para producción: cp .env.production.example .env.production
```

Editar `.env.local` con tus valores (ver `.env.production.example` para producción):
```env
NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json
NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
npm start
```

## 🎨 Características

### SEO
- Metadata optimizado para cada página
- Structured Data (JSON-LD) para NewsArticle
- Sitemap dinámico
- robots.txt configurado
- Open Graph y Twitter Cards

### Rendimiento
- ISR (Incremental Static Regeneration)
- Revalidación cada 60 segundos
- Optimización de imágenes con Next.js Image
- Lazy loading de componentes y anuncios
- CDN compatible

### Anuncios
- Componente AdSlot con prevención de CLS
- Lazy loading de anuncios
- Soporte para múltiples formatos
- Modo de prueba incluido

### Accesibilidad
- WCAG 2.2 compliant
- Navegación por teclado
- ARIA labels
- Contraste adecuado
- Focus visible

### Modo Oscuro
- Implementado con next-themes
- Persistencia de preferencias
- Transiciones suaves

## 🚀 Producción / Staging

El proyecto incluye todo lo necesario para staging y producción:

| Recurso | Ubicación |
|---------|-----------|
| Variables ENV | `.env.production.example` |
| Health check | (solo con servidor Node; estático: N/A) |
| Analytics | GA4 + Plausible (opcional) |
| Search Console | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |
| Error logging | Sentry (`npm i @sentry/nextjs`) |
| robots.txt | `/robots.txt` |
| Sitemap | `/sitemap.xml` |
| Docker | `Dockerfile` + `docker-compose.yml` |
| Checklist deploy | `docs/DEPLOY_CHECKLIST.md` |
| Backups | `docs/BACKUPS.md` |

### Scripts de producción

```bash
npm run seed          # Verificar entorno y WordPress
npm run smoke         # Smoke tests (BASE_URL requerido)
npm run smoke:local   # Smoke tests contra localhost
npm run wp:test       # Probar conexión a WordPress API (posts, categories, users)
npm run wp:curl       # Prueba rápida con curl (status + tiempo por endpoint)
```

### Build estático (output: export)

El sitio genera HTML estático en `out/`. **WordPress debe ser accesible durante el build**:

1. Verificar conectividad: `npm run wp:test` o `npm run wp:curl`
2. Si `/users` da 401: añadir `WP_SKIP_AUTHORS=true` a `.env`
3. Si hay timeouts: aumentar `WP_FETCH_TIMEOUT_MS=60000` en `.env`
4. Ejecutar `npm run build` desde una red con acceso a tu WordPress
5. Servir la carpeta `out/` con `npm run serve` o subir a hosting estático

### Docker

```bash
docker build -t las5deldia .
docker run -p 3000:3000 --env-file .env.production las5deldia
# .env.production con NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json y NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
# o: docker-compose up -d
```

### Sentry (opcional)

```bash
npm install @sentry/nextjs
```

Configurar `SENTRY_DSN` en variables de entorno. Ver `instrumentation.ts` y `sentry.*.config.ts`.

---

## ✅ Funcionalidades implementadas

- **Búsqueda** – Página `/buscar` con debounce, highlight de términos y tracking
- **Páginas de categoría** – `/categoria/[slug]` con paginación e infinite scroll
- **Páginas de etiqueta** – `/etiqueta/[slug]` con paginación
- **Páginas de autor** – `/autor/[slug]` con paginación
- **Newsletter** – Integración configurable (Formspree, Brevo, etc.)

## 📝 Próximos Pasos (opcionales)

1. **Configurar WordPress API**: Conectar con tu instancia de WordPress (si aún no lo hiciste)
2. **Configurar AdSense**: Añadir `NEXT_PUBLIC_ADSENSE_CLIENT_ID` y IDs de slots reales en `.env.production` (en desarrollo `testMode` es automático)
3. **Optimizar imágenes**: Configurar `NEXT_PUBLIC_WP_IMAGES_HOSTNAME` si las imágenes están en otro dominio
4. **Infinite scroll**: El `ArchiveFeed` ya soporta carga de más páginas; opcional: infinite scroll automático sin botón

## 🔧 Configuración Avanzada

### ISR Revalidation
Ajustar tiempos de revalidación en:
- `next.config.js`: Revalidación global
- `app/page.tsx`: Revalidación por página
- `lib/api/wordpress.ts`: Revalidación por fetch

### Cloudflare
El proyecto está preparado para Cloudflare CDN. Configurar:
- Cache rules en Cloudflare
- Headers de cache en `next.config.js`

### Edge Runtime
Para habilitar Edge Runtime en rutas específicas:
```typescript
export const runtime = 'edge';
```

## 📄 Licencia

MIT
