#!/usr/bin/env node
/**
 * Smoke tests (Node.js) - verificación post-deploy
 * Uso: BASE_URL=http://localhost:3000 node scripts/smoke-tests.mjs
 *      BASE_URL=https://lascincodeldia.com node scripts/smoke-tests.mjs
 *
 * Con localhost: espera hasta 30s a que el servidor esté listo antes de ejecutar.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MAX_WAIT_MS = 30_000;
const RETRY_INTERVAL_MS = 500;

const tests = [
  { name: 'Home', path: '/', expect: 200 },
  { name: 'Sitemap', path: '/sitemap.xml', expect: 200 },
  { name: 'Robots', path: '/robots.txt', expect: 200 },
  { name: 'Buscar', path: '/buscar', expect: 200 },
  { name: 'Contacto', path: '/contacto', expect: 200 },
  { name: 'Privacidad', path: '/privacidad', expect: 200 },
];

function expectOk(status, expected) {
  const arr = Array.isArray(expected) ? expected : [expected];
  return arr.includes(status);
}

async function waitForServer() {
  const isLocal = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');
  if (!isLocal) return;

  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) return;
    } catch {
      // Servidor no listo, seguir esperando
    }
    await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
  }
  throw new Error(`Servidor no respondió en ${MAX_WAIT_MS / 1000}s. ¿Ejecutaste npm run serve?`);
}

async function run() {
  console.log('\n🧪 Smoke tests -', BASE_URL, '\n');
  let fail = 0;

  await waitForServer();

  for (const { name, path, expect } of tests) {
    try {
      const res = await fetch(`${BASE_URL}${path}`);
      const ok = expectOk(res.status, expect);
      if (ok) {
        console.log('✅', name, res.status);
      } else {
        console.log('❌', name, '- esperado', expect, ', got', res.status);
        fail++;
      }
    } catch (e) {
      console.log('❌', name, '-', e.message);
      fail++;
    }
  }

  console.log('');
  if (fail > 0) {
    console.log('❌', fail, 'test(s) fallaron');
    process.exit(1);
  }
  console.log('✅ Smoke tests OK\n');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
