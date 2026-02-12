# Deploy a Producción - Las 5 del día

Guía completa para desplegar en VPS Hostinger con Docker y dominio www.lascincodeldia.com.

## Datos del servidor

| Parámetro | Valor |
|-----------|-------|
| Usuario SSH | `u583022756` |
| Host | `82.112.247.240` |
| Puerto SSH | `65002` |
| Dominio | `www.lascincodeldia.com` |
| Carpeta remota | `/var/www/lascincodeldia` |

---

## Parte 1: Preparación inicial (una sola vez)

### 1.1 Conectar por SSH

```bash
ssh -p 65002 u583022756@82.112.247.240
```

### 1.2 Crear carpeta y preparar entorno

```bash
# Crear directorio (puede requerir permisos especiales en Hostinger)
sudo mkdir -p /var/www
sudo chown u583022756:u583022756 /var/www
mkdir -p /var/www/lascincodeldia
cd /var/www/lascincodeldia
```

**Nota Hostinger:** Si no tienes permisos en `/var/www`, usa tu home:
```bash
mkdir -p ~/lascincodeldia
cd ~/lascincodeldia
# Luego edita deploy.sh y cambia REMOTE_DIR="/home/u583022756/lascincodeldia"
```

### 1.3 Instalar Docker y Docker Compose

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker u583022756

# Docker Compose (plugin)
sudo apt update && sudo apt install -y docker-compose-plugin

# Verificar
docker --version
docker compose version
```

**Importante:** Cierra sesión SSH y vuelve a conectar para que el grupo `docker` se aplique.

### 1.4 Subir proyecto (primera vez)

**Opción A - Desde tu máquina local con rsync:**
```bash
cd /home/bigp/Escritorio/Las_5_del_día
rsync -avz -e "ssh -p 65002" \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  --exclude 'Noticias_prueba' \
  ./ u583022756@82.112.247.240:/var/www/lascincodeldia/
```

**Opción B - Clonar con Git (si el repo está en GitHub/GitLab):**
```bash
# En el servidor
cd /var/www/lascincodeldia
git clone https://github.com/TU_USUARIO/Las_5_del_dia.git .
```

### 1.5 Configurar variables de entorno

```bash
# En el servidor
cd /var/www/lascincodeldia

# Copiar plantillas
cp .env.docker.example .env
cp .env.production.example .env.production

# Editar .env (OBLIGATORIO)
nano .env
```

Configura al menos:
```
DOMAIN=lascincodeldia.com
ACME_EMAIL=tu-email@ejemplo.com
WP_DB_PASSWORD=contraseña_segura_wordpress
MARIADB_ROOT_PASSWORD=contraseña_segura_mariadb
```

Genera contraseñas fuertes:
```bash
openssl rand -base64 24
```

---

## Parte 2: Verificar puertos 80 y 443

### En el servidor

```bash
# Ver si algo escucha en 80 y 443
sudo ss -tlnp | grep -E ':80|:443'

# Abrir en firewall (UFW) si lo usas
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 65002/tcp   # SSH
sudo ufw status
sudo ufw enable
```

### En el panel de Hostinger

- VPS → Firewall: asegúrate de que los puertos 80 y 443 estén permitidos.
- El puerto 65002 es el SSH (no el 22 estándar).

---

## Parte 3: Reverse Proxy y SSL (ya configurado)

El proyecto usa **Traefik** (no Nginx) como reverse proxy con:
- SSL automático vía Let's Encrypt
- Redirección HTTP → HTTPS
- Dominios: `www.lascincodeldia.com`, `lascincodeldia.com`, `cms.lascincodeldia.com`

Configuración en `config/traefik/`:
- `traefik.yml` - configuración principal
- `dynamic/redirect-https.yml` - redirección permanente a HTTPS

**Antes del primer deploy:** Asegúrate de que el DNS apunte al VPS:
```
www.lascincodeldia.com    A    82.112.247.240
lascincodeldia.com        A    82.112.247.240
cms.lascincodeldia.com    A    82.112.247.240
```

---

## Parte 4: Deploy

### Deploy normal (rsync)

```bash
cd /home/bigp/Escritorio/Las_5_del_día
chmod +x deploy.sh
./deploy.sh
```

### Deploy con Git

Si el código está en un repositorio y ya clonaste en el servidor:

```bash
./deploy.sh --git
```

### Simulación (sin cambios)

```bash
./deploy.sh --dry-run
```

---

## Parte 5: Comandos útiles post-deploy

### Ver estado

```bash
ssh -p 65002 u583022756@82.112.247.240 "cd /var/www/lascincodeldia && docker compose ps"
```

### Ver logs

```bash
ssh -p 65002 u583022756@82.112.247.240 "cd /var/www/lascincodeldia && docker compose logs -f"
```

### Reiniciar solo Next.js

```bash
ssh -p 65002 u583022756@82.112.247.240 "cd /var/www/lascincodeldia && docker compose up -d --build nextjs"
```

### Completar instalación WordPress

1. Abre https://cms.lascincodeldia.com
2. Asistente: idioma, título, usuario admin, email
3. Ajustes → Enlaces permanentes → "Nombre de la entrada" → Guardar

---

## Buenas prácticas de seguridad

### 1. SSH

- Usa autenticación por clave (deshabilita contraseña si es posible).
- Puerto no estándar (65002) ya en uso ✓
- Considera `fail2ban` para limitar intentos de conexión.

### 2. Variables de entorno

- Nunca subas `.env` con contraseñas a Git.
- `.env` y `.env.production` deben estar en `.gitignore` ✓
- Usa contraseñas de 24+ caracteres para DB.

### 3. Docker

- Los contenedores corren con usuario no-root (Next.js) ✓
- Traefik con `no-new-privileges:true` ✓
- Volúmenes nombrados para datos persistentes ✓

### 4. Firewall

```bash
# Recomendado en el VPS
sudo ufw default deny incoming
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 65002/tcp
sudo ufw enable
```

### 5. Actualizaciones

- Mantén el sistema actualizado: `sudo apt update && sudo apt upgrade -y`
- Actualiza imágenes Docker periódicamente.

### 6. Backups

- WordPress: volumen `wp-data` - haz backup regular.
- MariaDB: `docker exec las5-mariadb mysqldump -u root -p wordpress > backup.sql`
- Configuración: los archivos en `config/` están versionados en Git ✓

---

## Estructura esperada en el servidor

```
/var/www/lascincodeldia/
├── .env                    # Variables Docker (NO en Git)
├── .env.production         # Variables Next.js (NO en Git)
├── config/
│   └── traefik/
├── docker-compose.yml
├── Dockerfile
└── ... (resto del proyecto)
```

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Let's Encrypt no obtiene certificados | DNS correcto, puertos 80/443 abiertos |
| Permission denied al crear /var/www | Usa `~/lascincodeldia` y actualiza deploy.sh |
| docker: permission denied | `usermod -aG docker $USER` + cerrar sesión |
| Next.js no muestra contenido | Verifica .env.production y WordPress instalado |
| Connection refused SSH | Verifica puerto 65002 en Hostinger |
