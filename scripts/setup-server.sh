#!/bin/bash
# ============================================================
# Las 5 del día - Setup Inicial del Servidor VPS
# ============================================================
# Ejecutar UNA SOLA VEZ en el servidor para preparar el entorno.
# Conectar primero: ssh -p 65002 u583022756@82.112.247.240
#
# Uso en el servidor:
#   curl -sSL https://raw.githubusercontent.com/TU_REPO/main/scripts/setup-server.sh | bash
#   # O copiar y pegar estos comandos manualmente
# ============================================================

set -e

REMOTE_DIR="/var/www/lascincodeldia"
REPO_URL="${REPO_URL:-}"  # Definir si usas git: REPO_URL=https://github.com/user/repo.git

echo "=== Setup servidor Las 5 del día ==="

# Detectar si tenemos sudo
if command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
else
  SUDO=""
fi

# 1. Instalar Docker si no existe
if ! command -v docker >/dev/null 2>&1; then
  echo "[1/5] Instalando Docker..."
  curl -fsSL https://get.docker.com | $SUDO sh
  $SUDO usermod -aG docker "$USER" 2>/dev/null || true
  echo "    Reinicia la sesión SSH para que el grupo docker surta efecto."
else
  echo "[1/5] Docker ya instalado."
fi

# 2. Instalar Docker Compose plugin
if ! docker compose version >/dev/null 2>&1; then
  echo "[2/5] Instalando Docker Compose..."
  $SUDO apt-get update -qq
  $SUDO apt-get install -y docker-compose-plugin
else
  echo "[2/5] Docker Compose ya instalado."
fi

# 3. Crear directorio del proyecto
echo "[3/5] Creando directorio $REMOTE_DIR..."
if [ -w /var 2>/dev/null ] || [ -w /var/www 2>/dev/null ]; then
  $SUDO mkdir -p /var/www
  $SUDO chown "$USER:$USER" /var/www 2>/dev/null || true
fi

# Si /var/www no es escribible, usar home
if [ ! -w /var/www 2>/dev/null ]; then
  REMOTE_DIR="$HOME/lascincodeldia"
  echo "    /var/www no disponible. Usando $REMOTE_DIR"
  echo "    IMPORTANTE: Actualiza REMOTE_DIR en deploy.sh a: $REMOTE_DIR"
fi

mkdir -p "$REMOTE_DIR"
cd "$REMOTE_DIR"

# 4. Clonar o preparar proyecto
if [ -n "$REPO_URL" ]; then
  echo "[4/5] Clonando repositorio..."
  if [ ! -d .git ]; then
    git clone "$REPO_URL" .
  else
    git pull
  fi
else
  echo "[4/5] Directorio creado. Sube el proyecto con: ./deploy.sh (desde tu máquina local)"
  echo "    O clona manualmente: cd $REMOTE_DIR && git clone https://github.com/TU_USUARIO/repo.git ."
fi

# 5. Crear .env si no existe
echo "[5/5] Configurando variables de entorno..."
if [ -f .env.docker.example ] && [ ! -f .env ]; then
  cp .env.docker.example .env
  echo "    Creado .env desde plantilla. EDÍTALO con tus contraseñas: nano .env"
fi
if [ -f .env.production.example ] && [ ! -f .env.production ]; then
  cp .env.production.example .env.production
  echo "    Creado .env.production"
fi

echo ""
echo "=== Setup completado ==="
echo "Directorio: $REMOTE_DIR"
echo "Siguiente paso: Editar .env con ACME_EMAIL, WP_DB_PASSWORD, MARIADB_ROOT_PASSWORD"
echo "Luego, desde tu máquina local: ./deploy.sh"
