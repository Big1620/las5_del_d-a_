/**
 * Health check endpoint para monitoreo (load balancers, uptime, k8s)
 * GET /api/health
 *
 * Returns:
 * - 200: ok, version, timestamp
 * - 503: si WordPress no responde (opcional, configurable)
 */

import { NextResponse } from 'next/server';

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type HealthStatus = 'ok' | 'degraded';

interface HealthResponse {
  status: HealthStatus;
  version: string;
  timestamp: string;
  uptime: number;
  checks?: {
    wordpress?: 'ok' | 'error' | 'skipped';
  };
}

export async function GET() {
  const start = Date.now();
  const checks: HealthResponse['checks'] = {};

  // Check WordPress API (opcional: solo si está configurado)
  if (WP_API_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${WP_API_URL.replace(/\/$/, '')}/`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);
      checks.wordpress = res.ok ? 'ok' : 'error';
    } catch {
      checks.wordpress = 'error';
    }
  } else {
    checks.wordpress = 'skipped';
  }

  const allOk = !checks.wordpress || checks.wordpress !== 'error';
  const status: HealthStatus = allOk ? 'ok' : 'degraded';

  const body: HealthResponse = {
    status,
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime ? process.uptime() : (Date.now() - start) / 1000),
    checks,
  };

  const httpStatus = status === 'ok' ? 200 : 503;
  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
