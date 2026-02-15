/** @type {import('next').NextConfig} */

// Bundle analyzer (opcional): npm i -D @next/bundle-analyzer && ANALYZE=true npm run build
let withBundleAnalyzer = (config) => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (_) {
  // @next/bundle-analyzer no instalado; build sin análisis
}

// Sentry (opcional): npm i @sentry/nextjs && SENTRY_DSN=... npm run build
let withSentry = (config) => config;
if (process.env.SENTRY_DSN) {
  try {
    withSentry = require('@sentry/nextjs').withSentryConfig;
  } catch (_) {
    // @sentry/nextjs no instalado
  }
}

// WordPress media hostname: explicit env or derived from API URL
function getWpImageHostnames() {
  const explicit = process.env.NEXT_PUBLIC_WP_IMAGES_HOSTNAME;
  if (explicit && explicit.trim()) {
    return explicit.trim().split(',').map((h) => h.trim()).filter(Boolean);
  }
  const api = process.env.NEXT_PUBLIC_WP_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  if (!api) return [];
  try {
    const u = new URL(api);
    return [u.hostname];
  } catch {
    return [];
  }
}

const wpHosts = getWpImageHostnames();
const remotePatterns = [
  ...wpHosts.flatMap((hostname) => [
    { protocol: 'https', hostname, pathname: '/**' },
    { protocol: 'http', hostname, pathname: '/**' },
  ]),
];

const nextConfig = {
  output: 'export', // Sitio estático (sin servidor Node)
  images: {
    unoptimized: true, // Requerido para static export (sin optimización server-side)
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers: security + HTTP cache for static assets (Core Web Vitals, cache hits)
  async headers() {
    const securityHeaders = [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
    const cacheHeaders = [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/:path*.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/:path*.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
    return [...securityHeaders, ...cacheHeaders];
  },

  compress: true,
  poweredByHeader: false,

  // Split chunks + tree-shaking de barrels (reduce JS)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
    ],
  },
};

let config = withBundleAnalyzer(nextConfig);
if (typeof withSentry === 'function') {
  config = withSentry(config, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
  });
}
module.exports = config;
