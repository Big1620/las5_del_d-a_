#!/usr/bin/env node
/**
 * Inicia el servidor estático, ejecuta smoke tests y termina.
 * Uso: node scripts/serve-and-smoke.mjs
 * Requiere: npm run build previo (carpeta out/ existente)
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..');
const outDir = join(projectRoot, 'out');

if (!existsSync(outDir)) {
  console.error('❌ Carpeta out/ no existe. Ejecuta: npm run build');
  process.exit(1);
}

console.log('📦 Iniciando servidor en http://localhost:3000 ...\n');

const serve = spawn('npx', ['serve', 'out', '-p', '3000'], {
  cwd: projectRoot,
  stdio: ['ignore', 'pipe', 'pipe'],
});

serve.on('error', (err) => {
  console.error('❌ No se pudo iniciar serve:', err.message);
  process.exit(1);
});

// Los smoke tests tienen waitForServer(), esperamos un poco y ejecutamos
const smoke = spawn('node', ['scripts/smoke-tests.mjs'], {
  cwd: projectRoot,
  env: { ...process.env, BASE_URL: 'http://localhost:3000' },
  stdio: 'inherit',
});

smoke.on('close', (code) => {
  serve.kill();
  process.exit(code ?? 0);
});
