'use client';

import { ExitIntentModal } from './exit-intent-modal';
import { NewsletterBanner } from './newsletter-banner';

/**
 * Agrupa modal de exit intent y banner sticky.
 * Montar una sola vez en el layout (dentro de body o main).
 */
export function NewsletterCapture() {
  return (
    <>
      <ExitIntentModal />
      <NewsletterBanner />
    </>
  );
}
