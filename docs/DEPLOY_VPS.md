# Despliegue en VPS - Las 5 del día

Guía paso a paso para desplegar en tu VPS (82.112.247.240).

**Nota:** Si SSH usa el puerto 65002 (y no el 22), el script de deploy lo usa por defecto.

---

## Despliegue rápido (script automático)

Si ya tienes SSH configurado con clave y el VPS preparado:

```bash
cd /home/bigp/Escritorio/Las_5_del_día
./scripts/deploy-to-vps.sh
```

El script usa el puerto **65002** por defecto. Si tu SSH está en otro puerto:

```bash
SSH_PORT=22 ./scripts/deploy-to-vps.sh
```

---

## Requisitos en el VPS

- Ubuntu 22.04 / Debian 12 (o similar)
- Usuario con sudo o root
- Puertos 80 y 443 libres

---

## Parte 1: Preparar el VPS (una sola vez)

### 1.1 Conectarte por SSH

```bash
ssh root@82.112.247.240
# Si SSH usa otro puerto (ej. 65002):
ssh -p 65002 root@82.112.247.240
# O si usas otro usuario: ssh -p 65002 tu_usuario@82.112.247.240
```

### 1.2 Instalar Docker y Docker Compose

```bash
# Docker
curl -fsSL https://get.docker.com | sh
# Añadir tu usuario al grupo docker (evita usar sudo)
usermod -aG docker $USER

# Docker Compose v2 (plugin)
apt update && apt install -y docker-compose-plugin

# Verificar
docker --version
docker compose version
```

**Importante:** Cierra sesión y vuelve a conectarte para que el grupo `docker` tenga efecto.

### 1.3 Crear directorio del proyecto

```bash
mkdir -p /opt/las5deldia
cd /opt/las5deldia
```

---

## Parte 2: Subir el proyecto al VPS

### Opción A: Con rsync (desde tu máquina local)

```bash
# En tu máquina local
cd /home/bigp/Escritorio/Las_5_del_día

# Puerto 22 (por defecto):
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  -e "ssh" ./ root@82.112.247.240:/opt/las5deldia/

# Si SSH usa puerto 65002:
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  -e "ssh -p 65002" ./ root@82.112.247.240:/opt/las5deldia/
```

### Opción B: Con Git (si el proyecto está en un repositorio)

```bash
# En el VPS
cd /opt
git clone https://github.com/TU_USUARIO/Las_5_del_dia.git las5deldia
cd las5deldia
```

### Opción C: Con SCP

```bash
# En tu máquina local
cd /home/bigp/Escritorio
scp -r Las_5_del_día root@82.112.247.240:/opt/las5deldia/
# Luego en el VPS elimina node_modules y .next si se copiaron
```

---

## Parte 3: Configurar variables en el VPS

### 3.1 Crear .env en el VPS

```bash
ssh root@82.112.247.240
cd /opt/las5deldia

# Copiar plantilla
cp .env.docker.example .env

# Editar con tus valores reales
nano .env
```

Modifica al menos:
- `ACME_EMAIL` → tu email real
- `WP_DB_PASSWORD` → contraseña segura
- `MARIADB_ROOT_PASSWORD` → otra contraseña segura

### 3.2 Crear .env.production

```bash
cp .env.production.example .env.production
nano .env.production
```

Comprueba que tenga:
```
NEXT_PUBLIC_WP_API_URL=https://cms.lascincodeldia.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://www.lascincodeldia.com
```

---

## Parte 4: Levantar el stack

```bash
cd /opt/las5deldia
docker compose up -d
```

El primer arranque puede tardar 5-10 minutos (descarga de imágenes y build de Next.js).

### Ver logs

```bash
docker compose logs -f
# Ctrl+C para salir
```

### Verificar que todo esté corriendo

```bash
docker compose ps
```

Deberías ver `running` en traefik, nextjs, wordpress y mariadb.

---

## Parte 5: Completar instalación de WordPress

1. Abre en el navegador: **https://cms.lascincodeldia.com**
2. Sigue el asistente:
   - Idioma: Español
   - Título: Las 5 del día
   - Usuario admin y contraseña
   - Email de administrador
3. **Ajustes → Enlaces permanentes** → selecciona "Nombre de la entrada" → Guardar
4. Publica algún post de prueba para que Next.js pueda mostrarlo

---

## Parte 6: Verificar

- **Frontend:** https://www.lascincodeldia.com
- **CMS:** https://cms.lascincodeldia.com
- **Redirección:** http → https debe funcionar automáticamente

---

## Comandos útiles después del despliegue

```bash
# Ver logs de un servicio
docker compose logs -f nextjs
docker compose logs -f traefik

# Reiniciar solo Next.js (tras cambios)
docker compose build nextjs --no-cache
docker compose up -d nextjs

# Parar todo
docker compose down

# Parar y eliminar volúmenes (¡borra la BD de WordPress!)
docker compose down -v
```

---

## Solución de problemas

### Let's Encrypt no obtiene certificados

- Comprueba que los puertos 80 y 443 estén abiertos en el firewall
- Revisa que DNS apunte correctamente: `host cms.lascincodeldia.com`

### Next.js no muestra contenido de WordPress

- Verifica que WordPress esté instalado y tenga posts
- Comprueba `.env.production`: `NEXT_PUBLIC_WP_API_URL` debe ser `https://cms.lascincodeldia.com/wp-json/wp/v2`

### Error de permisos con Docker

```bash
sudo usermod -aG docker $USER
# Cerrar sesión y volver a conectar
```
