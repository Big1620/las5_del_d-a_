/** @type {import('next').NextConfig} */

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
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for CDN and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  // Compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,
};

module.exports = nextConfig;
