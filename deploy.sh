#!/bin/bash
# ============================================================
# Las 5 del día - Script de Deploy Automatizado
# ============================================================
# Despliega a VPS Hostinger vía rsync o git pull
# Dominio: www.lascincodeldia.com
#
# Uso:
#   ./deploy.sh                    # rsync (por defecto)
#   ./deploy.sh --git              # usa git pull en el servidor
#   ./deploy.sh --dry-run          # simulación sin cambios
#
# Requisitos: rsync, acceso SSH con clave pública
# ============================================================

set -e

# --- Configuración (ajustar si cambia el servidor) ---
SSH_USER="u583022756"
SSH_HOST="82.112.247.240"
SSH_PORT="65002"
# Hostinger: /var/www suele requerir root. Usa home del usuario:
REMOTE_DIR="/home/u583022756/lascincodeldia"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_METHOD="rsync"

# --- Colores para output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- Parsear argumentos ---
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --git)      DEPLOY_METHOD="git"; shift ;;
    --dry-run)  DRY_RUN=true; shift ;;
    -h|--help)
      echo "Uso: $0 [--git] [--dry-run]"
      echo "  --git     Usar git pull en el servidor (en lugar de rsync)"
      echo "  --dry-run Simular deploy sin ejecutar cambios"
      exit 0
      ;;
  esac
done

VPS="${SSH_USER}@${SSH_HOST}"
SSH_OPTS="-p $SSH_PORT -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"

# --- Preflight checks ---
info "Verificando requisitos locales..."
command -v rsync >/dev/null 2>&1 || { error "rsync no instalado. Instala: apt install rsync"; exit 1; }

info "Probando conexión SSH..."
if ! ssh $SSH_OPTS "$VPS" "exit" 2>/dev/null; then
  error "No se puede conectar por SSH. Revisa: ssh -p $SSH_PORT $VPS"
  exit 1
fi

echo ""
info "=== Deploy Las 5 del día → ${VPS} ==="
info "Origen:  $PROJECT_DIR"
info "Destino: $REMOTE_DIR"
info "Método:  $DEPLOY_METHOD"
if $DRY_RUN; then warn "MODO DRY-RUN (simulación)"; fi
echo ""

# --- Paso 1: Sincronizar código ---
if [ "$DEPLOY_METHOD" = "rsync" ]; then
  info "[1/5] Sincronizando archivos con rsync..."
  if $DRY_RUN; then
    rsync -avzn --delete -e "ssh $SSH_OPTS" \
      --exclude 'node_modules' \
      --exclude '.next' \
      --exclude '.git' \
      --exclude 'Noticias_prueba' \
      --exclude '*.log' \
      --exclude '.env' \
      --exclude '.env.production' \
      "$PROJECT_DIR/" "$VPS:$REMOTE_DIR/" || true
  else
    rsync -avz --delete -e "ssh $SSH_OPTS" \
      --exclude 'node_modules' \
      --exclude '.next' \
      --exclude '.git' \
      --exclude 'Noticias_prueba' \
      --exclude '*.log' \
      --exclude '.env' \
      --exclude '.env.production' \
      "$PROJECT_DIR/" "$VPS:$REMOTE_DIR/"
  fi
else
  info "[1/5] Pull desde repositorio remoto..."
  if ! $DRY_RUN; then
    ssh $SSH_OPTS "$VPS" "cd $REMOTE_DIR && git pull --rebase"
  fi
fi

# --- Paso 2-5: Ejecutar en el servidor ---
info "[2/5] Ejecutando deploy en el servidor..."
if $DRY_RUN; then
  info "Comandos que se ejecutarían:"
  echo "  cd $REMOTE_DIR"
  echo "  docker compose down"
  echo "  docker compose up -d --build"
  echo "  docker image prune -f"
  exit 0
fi

ssh $SSH_OPTS "$VPS" "cd $REMOTE_DIR && \
  echo '[2/5] Bajando contenedores...' && \
  docker compose down && \
  echo '[3/5] Levantando stack con rebuild...' && \
  docker compose up -d --build && \
  echo '[4/5] Esperando inicio de servicios...' && \
  sleep 5 && \
  echo '[5/5] Limpiando imágenes antiguas...' && \
  docker image prune -f && \
  echo '' && echo '=== Deploy completado ===' && \
  docker compose ps"

echo ""
info "=== Deploy finalizado correctamente ==="
info "Frontend: https://www.lascincodeldia.com"
info "CMS:      https://cms.lascincodeldia.com"
echo ""
