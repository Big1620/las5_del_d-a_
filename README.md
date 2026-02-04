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
```

Editar `.env.local` con tus valores:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://tu-wordpress.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://tu-sitio.com
NEXT_PUBLIC_SITE_NAME=Las cinco del día
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REVALIDATE_TIME=60
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

## 📝 Próximos Pasos

1. **Configurar WordPress API**: Conectar con tu instancia de WordPress
2. **Personalizar diseño**: Ajustar colores, tipografías y layout
3. **Agregar funcionalidades**:
   - Búsqueda
   - Páginas de categoría/tag/autor
   - Infinite scroll
   - Newsletter integration
4. **Configurar AdSense**: Reemplazar `testMode` con IDs reales
5. **Optimizar imágenes**: Configurar dominio de WordPress en `next.config.js`

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
