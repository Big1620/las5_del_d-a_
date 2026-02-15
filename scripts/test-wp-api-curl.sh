#!/usr/bin/env bash
# Prueba rápida de la API de WordPress con curl
# Uso: ./scripts/test-wp-api-curl.sh [URL_BASE]
# Ejemplo: ./scripts/test-wp-api-curl.sh https://cms.lascincodeldia.com/wp-json/wp/v2

BASE="${1:-${NEXT_PUBLIC_WP_API_URL:-https://cms.lascincodeldia.com/wp-json/wp/v2}}"

echo "🔍 Probando WordPress API: $BASE"
echo ""

echo "1. GET /posts?per_page=1"
curl -s -o /dev/null -w "   Status: %{http_code} | Tiempo: %{time_total}s\n" "${BASE}/posts?per_page=1"

echo "2. GET /categories?per_page=1"
curl -s -o /dev/null -w "   Status: %{http_code} | Tiempo: %{time_total}s\n" "${BASE}/categories?per_page=1"

echo "3. GET /tags?per_page=1"
curl -s -o /dev/null -w "   Status: %{http_code} | Tiempo: %{time_total}s\n" "${BASE}/tags?per_page=1"

echo "4. GET /users (suele dar 401 sin auth)"
curl -s -o /dev/null -w "   Status: %{http_code} | Tiempo: %{time_total}s\n" "${BASE}/users?per_page=1"

echo ""
echo "Si status 200 en posts/categories/tags → build debería funcionar."
echo "Si /users da 401 → añade WP_SKIP_AUTHORS=true a .env"
