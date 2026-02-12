# Arquitectura Docker DevOps - Las 5 del día

Arquitectura para desplegar el frontend Next.js y el CMS WordPress en un VPS con Docker, SSL automático (Let's Encrypt) y reverse proxy.

---

## Esquema General

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │  Puertos 80/443 │
              │    (Traefik)    │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
   www.lascincodeldia.com    cms.lascincodeldia.com
         │             │             │
         ▼             │             ▼
   ┌──────────┐        │      ┌────────────┐
   │ Next.js  │        │      │ WordPress  │
   │ (App)    │        │      │ (CMS)      │
   │ :3000    │        │      │ :80        │
   └──────────┘        │      └─────┬──────┘
         │             │            │
         │    consume   │            │
         └──────────────┘            │
              REST API               ▼
                              ┌────────────┐
                              │ MariaDB    │
                              │ (wp_*)     │
                              └────────────┘
```

- **www.lascincodeldia.com** → Frontend público (Next.js)
- **cms.lascincodeldia.com** → CMS WordPress (solo editores)
- **SSL** → Let's Encrypt vía Traefik
- Next.js consume `/wp-json/wp/v2` de WordPress

---

## Estructura de Archivos

```
.
├── docker-compose.yml              # Stack completo (Next.js + WP + MariaDB + Traefik)
├── docker-compose.frontend-only.yml # Solo Next.js + Traefik (WP externo)
├── Dockerfile
├── .env                            # Variables (crear desde .env.docker.example)
├── .env.production                 # Variables Next.js
├── config/
│   ├── traefik/
│   │   ├── traefik.yml             # Config estática Traefik
│   │   └── dynamic/
│   │       └── redirect-https.yml  # Middleware HTTP→HTTPS
│   └── wordpress/
│       └── uploads.ini             # PHP upload limits
└── docs/
    └── ARQUITECTURA_DOCKER_DEVOPS.md
```

---

## Requisitos Previos

- VPS Linux (Ubuntu 22.04+, Debian 12+)
- Docker Engine + Docker Compose v2
- Dominio apuntando al VPS: `www.lascincodeldia.com`, `lascincodeldia.com`, `cms.lascincodeldia.com`
- Puertos 80 y 443 libres

---

## Despliegue (Stack Completo)

### 1. Configurar variables de entorno

```bash
cp .env.docker.example .env
cp .env.production.example .env.production

# Editar .env con valores reales
nano .env
```

Variables obligatorias en `.env`:
- `DOMAIN=lascincodeldia.com`
- `ACME_EMAIL=tu-email@ejemplo.com`
- `WP_DB_PASSWORD=...`
- `MARIADB_ROOT_PASSWORD=...`

En `.env.production`:
- `NEXT_PUBLIC_WP_API_URL=https://cms.lascincodeldia.com/wp-json/wp/v2`
- `NEXT_PUBLIC_SITE_URL=https://www.lascincodeldia.com`

### 2. Levantar servicios

```bash
docker compose up -d
```

### 3. Completar instalación de WordPress

1. Ir a https://cms.lascincodeldia.com
2. Completar el asistente de instalación (idioma, usuario admin, etc.)
3. En Ajustes → Enlaces permanentes: usar "Nombre de la entrada"
4. Añadir `https://cms.lascincodeldia.com` a la CORS si Next.js está en otro dominio (plugin o código)

### 4. Verificar

- Frontend: https://www.lascincodeldia.com
- CMS: https://cms.lascincodeldia.com
- HTTP → HTTPS: debe redirigir automáticamente

---

## Despliegue (Solo Frontend - WordPress externo)

Si WordPress está en otro servidor (por ejemplo en un hosting compartido):

```bash
# .env con NEXT_PUBLIC_WP_API_URL apuntando al WordPress externo
NEXT_PUBLIC_WP_API_URL=https://cms.otro-servidor.com/wp-json/wp/v2

docker compose -f docker-compose.frontend-only.yml up -d
```

---

## DNS Requeridos

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | lascincodeldia.com | IP_VPS |
| A | www.lascincodeldia.com | IP_VPS |
| A | cms.lascincodeldia.com | IP_VPS |

---

## Servicios del docker-compose

| Servicio | Imagen | Puerto interno | Descripción |
|----------|--------|-----------------|-------------|
| traefik | traefik:v3.2 | 80, 443 | Reverse proxy + Let's Encrypt |
| nextjs | build local | 3000 | Frontend Next.js (standalone) |
| wordpress | wordpress:6.7-php8.2-apache | 80 | CMS (solo en stack completo) |
| mariadb | mariadb:11.2 | 3306 | Base de datos WordPress |

---

## Certificados SSL

- Proveedor: Let's Encrypt (ACME HTTP-01)
- Almacenamiento: volumen `traefik-certificates` → `/letsencrypt/acme.json`
- Renovación automática
- El puerto 80 debe estar accesible desde internet para el reto HTTP

---

## Seguridad del CMS

- WordPress en `cms.lascincodeldia.com` es accesible por red (necesario para la API REST)
- Recomendaciones:
  - Usar contraseñas fuertes para admin
  - Plugin de límite de intentos de login (ej. Limit Login Attempts)
  - Mantener WordPress y plugins actualizados
  - Opcional: restringir `/wp-admin` por IP con Traefik si los editores tienen IP fija

---

## Alternativa: Caddy

Si prefieres Caddy en lugar de Traefik, puedes usar un `Caddyfile`:

```
www.lascincodeldia.com, lascincodeldia.com {
    reverse_proxy nextjs:3000
}

cms.lascincodeldia.com {
    reverse_proxy wordpress:80
}
```

Caddy obtiene certificados Let's Encrypt automáticamente. Habría que crear un `docker-compose.caddy.yml` sustituyendo Traefik por Caddy.

---

## Comandos Útiles

```bash
# Ver logs
docker compose logs -f nextjs
docker compose logs -f traefik

# Reconstruir solo Next.js
docker compose build nextjs --no-cache
docker compose up -d nextjs

# Parar y eliminar volúmenes (¡cuidado! borra BD WordPress)
docker compose down -v
```
