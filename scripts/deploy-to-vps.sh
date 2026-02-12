#!/bin/bash
# Despliega Las 5 del día al VPS vía rsync + docker compose
# Uso: ./scripts/deploy-to-vps.sh [usuario@82.112.247.240]
#       SSH_PORT=65002 ./scripts/deploy-to-vps.sh   # si SSH usa puerto distinto al 22
#
# Requisitos: rsync, acceso SSH al VPS sin contraseña (clave pública)

set -e
VPS="${1:-root@82.112.247.240}"
SSH_PORT="${SSH_PORT:-65002}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_DIR="/opt/las5deldia"
SSH_OPTS="-p $SSH_PORT"

echo "=== Desplegando a $VPS (puerto $SSH_PORT) ==="
echo "Origen: $PROJECT_DIR"
echo "Destino: $REMOTE_DIR"
echo ""

# 1. Sincronizar archivos (excluir node_modules, .next, .git)
echo ">>> Sincronizando archivos..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'Noticias_prueba' \
  "$PROJECT_DIR/" "$VPS:$REMOTE_DIR/"

# 2. Asegurar que .env y .env.production existan en el VPS
echo ""
echo ">>> Comprobando variables de entorno en el VPS..."
ssh $SSH_OPTS "$VPS" "cd $REMOTE_DIR && \
  (test -f .env || { cp .env.docker.example .env && echo 'Creado .env desde plantilla - EDÍTALO con tus contraseñas'; }) && \
  (test -f .env.production || { cp .env.production.example .env.production && echo 'Creado .env.production'; })"

# 3. Levantar el stack
echo ""
echo ">>> Ejecutando docker compose up -d..."
ssh $SSH_OPTS "$VPS" "cd $REMOTE_DIR && docker compose up -d --build"

echo ""
echo "=== Despliegue completado ==="
echo "Frontend: https://www.lascincodeldia.com"
echo "CMS:      https://cms.lascincodeldia.com"
echo ""
echo "Si es la primera vez, completa la instalación de WordPress en:"
echo "  https://cms.lascincodeldia.com"
