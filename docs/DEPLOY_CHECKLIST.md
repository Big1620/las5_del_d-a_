# ✅ Checklist de Deploy - Las 5 del día

Lista de verificación antes de desplegar a staging/producción.

**Nota:** Este proyecto usa `output: 'export'` (sitio estático). No hay API routes ni servidor Node en producción.

---

## 1. Variables de entorno

- [ ] `NEXT_PUBLIC_WP_API_URL` - URL de WordPress REST API (debe ser accesible durante el build)
- [ ] `NEXT_PUBLIC_SITE_URL` - URL canónica del sitio (https://www.lascincodeldia.com)
- [ ] `NEXT_PUBLIC_CONTACT_FORM_URL` (opcional) - Formspree: https://formspree.io/f/xxxxx
- [ ] `NEXT_PUBLIC_NEWSLETTER_FORM_URL` (opcional) - Formspree o similar para newsletter
- [ ] `WP_SKIP_AUTHORS=true` - Si WordPress `/users` devuelve 401 durante el build
- [ ] `WP_FETCH_TIMEOUT_MS=60000` - Aumentar si WordPress responde lento (default: 30000)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional) - Google Analytics
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (opcional) - Plausible Analytics
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (opcional) - Search Console
- [ ] `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (opcional) - Error logging (cliente)
- [ ] Newsletter backend: `BREVO_API_KEY` + `BREVO_LIST_ID` o `MAILCHIMP_*`

Ver `.env.production.example` como referencia.

---

## 2. Build

```bash
npm run build
```

- [ ] WordPress debe ser **accesible** durante el build (genera páginas estáticas)
- [ ] Build termina sin errores críticos
- [ ] Si hay 401 en `/users`: añadir `WP_SKIP_AUTHORS=true` a `.env`

---

## 3. Pruebas pre-deploy

```bash
# Verificación de entorno y conexión WordPress
npm run seed

# Servir sitio estático localmente
npm run serve
# En otra terminal:
npm run smoke:local
```

- [ ] `npm run seed` pasa
- [ ] Smoke tests pasan

---

## 4. Post-deploy (staging/producción)

```bash
BASE_URL=https://www.lascincodeldia.com node scripts/smoke-tests.mjs
```

- [ ] `/` responde 200
- [ ] `/sitemap.xml` responde 200
- [ ] `/robots.txt` responde 200
- [ ] Páginas estáticas (buscar, contacto, privacidad) responden 200

---

## 5. Integraciones

- [ ] **Formspree (contacto)**: Crear formulario en formspree.io y configurar `NEXT_PUBLIC_CONTACT_FORM_URL`
- [ ] **Newsletter**: Configurar Formspree o Brevo/Mailchimp
- [ ] **Google Search Console**: Verificar propiedad con meta tag
- [ ] **Google Analytics / Plausible**: Datos en tiempo real
- [ ] **Sentry**: Añadir DSN para captura de errores en cliente

---

## 6. SEO y crawling

- [ ] `https://www.lascincodeldia.com/sitemap.xml` accesible
- [ ] `https://www.lascincodeldia.com/robots.txt` accesible
- [ ] URLs canónicas correctas
- [ ] Open Graph y Twitter Cards funcionan

---

## 7. Seguridad

- [ ] No exponer secrets en cliente (`NEXT_PUBLIC_*` solo para valores públicos)
- [ ] HTTPS en producción

---

## 8. Monitoreo

- [ ] Health check en Docker: verifica `/` (200)
- [ ] Alertas configuradas (Sentry, uptime)
- [ ] Logs accesibles

---

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run seed` | Verificar variables y conexión WordPress |
| `npm run serve` | Servir sitio estático (carpeta out/) en localhost:3000 |
| `npm run smoke` | Smoke tests (variable BASE_URL) |
| `npm run smoke:local` | Smoke tests contra localhost:3000 |
| `npm run wp:test` | Test conexión WordPress detallado |

---

## Docker

El Dockerfile sirve la carpeta `out/` con `serve` (sitio estático). El healthcheck verifica `/`.

```bash
# Build (WordPress debe ser accesible durante el build)
docker build -t las5deldia \
  --build-arg NEXT_PUBLIC_WP_API_URL=https://cms.lascincodeldia.com/wp-json \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.lascincodeldia.com .

# Run
docker run -p 3000:3000 las5deldia

# O con docker-compose
docker compose up -d
```
