#!/usr/bin/env node
/**
 * Script seed - validación de entorno y datos
 * Uso: node scripts/seed.js
 *
 * Verifica variables de entorno, conexión WordPress y estado listo para build.
 */

try {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config({ path: '.env.production' });
} catch (_) {
  // dotenv opcional
}

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lascincodeldia.com';

let hasErrors = false;

function log(msg, type = 'info') {
  const icons = { info: 'ℹ️', ok: '✅', warn: '⚠️', error: '❌' };
  console.log(`${icons[type] || icons.info} ${msg}`);
}

async function main() {
  console.log('\n🔧 Las 5 del día - Verificación de entorno (seed)\n');

  // 1. Variables requeridas
  log('1. Variables de entorno');
  if (!WP_API_URL?.trim()) {
    log('NEXT_PUBLIC_WP_API_URL no definido', 'error');
    hasErrors = true;
  } else {
    log(`   WP_API_URL: ${WP_API_URL}`, 'ok');
  }
  if (!SITE_URL || SITE_URL.includes('example.com')) {
    log('NEXT_PUBLIC_SITE_URL no definido o por defecto', 'warn');
  } else {
    log(`   SITE_URL: ${SITE_URL}`, 'ok');
  }

  // 2. Conexión WordPress
  if (WP_API_URL) {
    log('\n2. Conexión WordPress');
    try {
      const res = await fetch(`${WP_API_URL.replace(/\/$/, '')}/posts?per_page=1`);
      if (res.ok) {
        const posts = await res.json();
        log(`   Posts disponibles: ${Array.isArray(posts) && posts.length ? 'Sí' : 'No'}`, 'ok');
      } else {
        log(`   HTTP ${res.status}`, 'warn');
      }
    } catch (e) {
      log(`   Error: ${e.message}`, 'error');
      hasErrors = true;
    }
  }

  // 3. Opcionales
  log('\n3. Opcionales');
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) log('   GA configurado', 'ok');
  else log('   GA no configurado', 'info');
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) log('   Plausible configurado', 'ok');
  else log('   Plausible no configurado', 'info');
  if (process.env.SENTRY_DSN) log('   Sentry configurado', 'ok');
  else log('   Sentry no configurado', 'info');

  console.log('');
  if (hasErrors) {
    console.log('❌ Hay errores. Corrige las variables de entorno antes de hacer build.\n');
    process.exit(1);
  }
  console.log('✅ Entorno listo para build/staging.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
