/**
 * Root Layout
 * Main layout component for the entire application
 * 
 * Design decisions:
 * - SEO metadata configured at root level
 * - Theme provider for dark mode
 * - Structured data for organization
 * - Font optimization
 * - Accessibility features
 */

import type { Metadata } from 'next';
import { ThemeProvider } from './providers';
import { AdBar } from '@/components/ads/ad-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnalyticsProvider } from '@/components/analytics';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data';
import { getCategories } from '@/lib/api/wordpress';
import './globals.css';

export const metadata: Metadata = generateBaseMetadata();

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
      <body className="font-serif antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <AdBar />
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <AnalyticsProvider
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          webVitalsEndpoint={process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT}
          debug={process.env.NODE_ENV === 'development'}
        />
      </body>
    </html>
  );
}
