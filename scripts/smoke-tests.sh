#!/bin/bash
# Smoke tests - verificación rápida post-deploy
# Uso: BASE_URL=http://localhost:3000 ./scripts/smoke-tests.sh
#      BASE_URL=https://lascincodeldia.com ./scripts/smoke-tests.sh

set -e
BASE_URL="${BASE_URL:-http://localhost:3000}"
FAIL=0

log() { echo "  $1"; }
ok()  { echo "✅ $1"; }
fail(){ echo "❌ $1"; FAIL=1; }

echo ""
echo "🧪 Smoke tests - $BASE_URL"
echo ""

# 1. Home
log "1. GET / (200)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
[ "$STATUS" = "200" ] && ok "Home: $STATUS" || fail "Home: esperado 200, got $STATUS"

# 2. Sitemap
log "2. GET /sitemap.xml (200)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap.xml")
[ "$STATUS" = "200" ] && ok "Sitemap: $STATUS" || fail "Sitemap: esperado 200, got $STATUS"

# 3. Robots
log "3. GET /robots.txt (200)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/robots.txt")
[ "$STATUS" = "200" ] && ok "Robots: $STATUS" || fail "Robots: esperado 200, got $STATUS"

# 4. Páginas estáticas
for path in "/buscar" "/contacto" "/privacidad"; do
  log "4. GET $path (200)"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  [ "$STATUS" = "200" ] && ok "$path: $STATUS" || fail "$path: esperado 200, got $STATUS"
done

echo ""
if [ $FAIL -eq 0 ]; then
  echo "✅ Smoke tests OK"
  exit 0
else
  echo "❌ Algunos smoke tests fallaron"
  exit 1
fi
