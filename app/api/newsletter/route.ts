import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { newsletterSchema } from '@/lib/newsletter/schema';

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const CONSENT_STORAGE_ENABLED = process.env.NEWSLETTER_STORE_CONSENT === 'true';

type BrevoContact = {
  email: string;
  listIds?: number[];
  updateEnabled?: boolean;
  attributes?: Record<string, string | boolean>;
};

/** Obtiene el proveedor a usar: 'brevo' | 'mailchimp'. Si ambos están configurados, Brevo tiene prioridad. */
function getProvider(): 'brevo' | 'mailchimp' | null {
  if (process.env.BREVO_API_KEY) return 'brevo';
  if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) return 'mailchimp';
  return null;
}

async function addToBrevo(email: string, source?: string): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[Newsletter] BREVO_API_KEY no configurada');
    return { ok: false, status: 503 };
  }

  const listIdStr = process.env.BREVO_LIST_ID;
  const listIds = listIdStr ? listIdStr.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean) : undefined;

  const body: BrevoContact = {
    email,
    updateEnabled: true,
    listIds,
    attributes: {
      NEWSLETTER_SOURCE: source || 'website',
      NEWSLETTER_CONSENT: true,
    },
  };

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, status: res.status };
}

/** Mailchimp: datacenter está en la API key (ej. xxxxx-us21 → us21). */
function getMailchimpBaseUrl(): string | null {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) return null;
  const dc = key.split('-').pop();
  return dc ? `https://${dc}.api.mailchimp.com/3.0` : null;
}

async function addToMailchimp(email: string, source?: string): Promise<{ ok: boolean; status: number }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID?.trim();
  const baseUrl = getMailchimpBaseUrl();

  if (!apiKey || !listId || !baseUrl) {
    console.warn('[Newsletter] MAILCHIMP_API_KEY o MAILCHIMP_LIST_ID no configurados');
    return { ok: false, status: 503 };
  }

  const subscriberHash = createHash('md5').update(email.toLowerCase()).digest('hex');
  const url = `${baseUrl}/lists/${listId}/members/${subscriberHash}`;

  const body = {
    email_address: email.toLowerCase(),
    status: 'subscribed' as const,
    merge_fields: {},
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return { ok: res.ok, status: res.status };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const message = first.email?.[0] ?? first.consent?.[0] ?? 'Datos inválidos.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, consent, source } = parsed.data;
    if (!consent) {
      return NextResponse.json({ error: 'Debes aceptar la política de privacidad.' }, { status: 400 });
    }

    const provider = getProvider();
    if (!provider) {
      return NextResponse.json(
        { error: 'No hemos podido completar la suscripción. Inténtalo más tarde.' },
        { status: 503 }
      );
    }

    const { ok, status } =
      provider === 'brevo' ? await addToBrevo(email, source) : await addToMailchimp(email, source);

    if (!ok) {
      if (status === 400) {
        return NextResponse.json(
          { error: 'Este correo ya está registrado o no es válido.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'No hemos podido completar la suscripción. Inténtalo más tarde.' },
        { status: 502 }
      );
    }

    if (CONSENT_STORAGE_ENABLED) {
      // Opcional: guardar en DB o log para auditoría GDPR
      // await saveConsentRecord({ email, source, timestamp: new Date().toISOString() });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[Newsletter API]', e);
    return NextResponse.json(
      { error: 'Error interno. Inténtalo más tarde.' },
      { status: 500 }
    );
  }
}
