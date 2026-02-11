# ✅ Checklist de Deploy - Las 5 del día

Lista de verificación antes de desplegar a staging/producción.

---

## 1. Variables de entorno

- [ ] `NEXT_PUBLIC_WP_API_URL` - URL de WordPress REST API
- [ ] `NEXT_PUBLIC_SITE_URL` - URL canónica del sitio (https://lascincodeldia.com)
- [ ] `REVALIDATE_TIME` (opcional) - Segundos ISR (default: 60)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional) - Google Analytics
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (opcional) - Plausible Analytics
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (opcional) - Search Console
- [ ] `SENTRY_DSN` (opcional) - Error logging
- [ ] Newsletter: `BREVO_API_KEY` + `BREVO_LIST_ID` o `MAILCHIMP_*`

Ver `.env.production.example` como referencia.

---

## 2. Build

```bash
npm run build
```

- [ ] Build termina sin errores
- [ ] No hay warnings críticos

---

## 3. Pruebas pre-deploy

```bash
# Verificación de entorno
npm run seed
# o: node scripts/seed.js

# Con servidor local corriendo:
npm run smoke:local
# o: BASE_URL=http://localhost:3000 node scripts/smoke-tests.mjs
```

- [ ] `npm run seed` pasa
- [ ] Smoke tests pasan tras `npm start`

---

## 4. Post-deploy (staging/producción)

```bash
BASE_URL=https://lascincodeldia.com node scripts/smoke-tests.mjs
```

- [ ] `/` responde 200
- [ ] `/api/health` responde 200 o 503
- [ ] `/sitemap.xml` responde 200
- [ ] `/robots.txt` responde 200
- [ ] Páginas estáticas (buscar, contacto, privacidad) responden 200

---

## 5. Integraciones

- [ ] **Google Search Console**: Verificar propiedad con meta tag
- [ ] **Google Analytics / Plausible**: Datos en tiempo real
- [ ] **Sentry**: Probar `captureException` si está configurado

---

## 6. SEO y crawling

- [ ] `https://lascincodeldia.com/sitemap.xml` accesible
- [ ] `https://lascincodeldia.com/robots.txt` accesible
- [ ] URLs canónicas correctas
- [ ] Open Graph y Twitter Cards funcionan

---

## 7. Seguridad

- [ ] No exponer secrets en cliente (`NEXT_PUBLIC_*` solo para valores públicos)
- [ ] Headers de seguridad activos (X-Content-Type-Options, etc.)
- [ ] HTTPS en producción

---

## 8. Monitoreo

- [ ] Health check configurado en load balancer/orquestador: `/api/health`
- [ ] Alertas configuradas (Sentry, uptime)
- [ ] Logs accesibles

---

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run seed` | Verificar variables y conexión WordPress |
| `npm run smoke` | Smoke tests (variable BASE_URL) |
| `npm run smoke:local` | Smoke tests contra localhost:3000 |
| `node scripts/test-wordpress-connection.js` | Test conexión WordPress detallado |

---

## Docker (opcional)

```bash
# Build
docker build -t las5deldia .

# Run con .env.production
docker run -p 3000:3000 --env-file .env.production las5deldia

# O con docker-compose
docker-compose up -d
```
