/**
 * Root Layout
 * Main layout component for the entire application
 *
 * Design decisions:
 * - SEO metadata configured at root level
 * - Theme provider for dark mode
 * - Structured data for organization
 * - Font optimization (next/font with preload + display swap)
 * - Accessibility features
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Source_Serif_4 } from 'next/font/google';
import { ThemeProvider } from './providers';
import { AdBar } from '@/components/ads/ad-bar';
import { SideRailAd } from '@/components/ads/side-rail-ads';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnalyticsProvider } from '@/components/analytics';
import { generateBaseMetadata } from '@/lib/seo/metadata';

const AccessibilityToolbar = dynamic(
  () => import('@/components/accessibility/accessibility-toolbar').then((m) => ({ default: m.AccessibilityToolbar })),
  { ssr: false }
);
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data';
import { getCategories } from '@/lib/api/wordpress';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = generateBaseMetadata();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  // Categorías para el menú; si WordPress no responde, usamos array vacío para que la app arranque
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch (e) {
    console.warn('[Layout] No se pudieron cargar categorías:', e);
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect para fuentes Google (mejor LCP y preload implícito de next/font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${sourceSerif.variable} font-serif antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* WCAG 2.4.1: Enlace para saltar al contenido principal (bypass blocks) */}
          <a
            href="#main-content"
            className="skip-link"
          >
            Saltar al contenido principal
          </a>
          <div className="flex min-h-screen flex-col min-w-0 overflow-x-hidden">
            <AdBar />
            <Suspense fallback={<header className="sticky top-0 z-50 h-14 w-full bg-[#0a2463] md:h-16" aria-hidden />}>
              <Header categories={categories} />
            </Suspense>
            <div className="flex flex-1 min-w-0 w-full">
              <SideRailAd side="left" />
              <div className="flex flex-1 min-w-0 w-full flex-col">
                <main id="main-content" className="flex-1 min-w-0 w-full" role="main">
                  {children}
                </main>
                <Footer />
              </div>
              <SideRailAd side="right" />
            </div>
          </div>
        </ThemeProvider>
        <AccessibilityToolbar />
        <AnalyticsProvider
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          plausibleCustomDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN}
          webVitalsEndpoint={process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT}
          debug={process.env.NODE_ENV === 'development'}
        />
      </body>
    </html>
  );
}
