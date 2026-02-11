# Sistema de captación de leads (Newsletter)

Sistema listo para marketing: formulario de newsletter con validación, GDPR, analytics e integración **Brevo** o **Mailchimp**.

## Dónde aparece el formulario

1. **Footer** – Formulario fijo en todas las páginas (`source=footer`).
2. **Banner sticky** – Barra inferior que aparece tras ~3 s; se puede cerrar y no vuelve en la misma sesión.
3. **Modal exit intent** – Al detectar intención de salida (cursor hacia arriba); se muestra como máximo una vez cada 24 h por sesión.

## Configuración (Brevo o Mailchimp)

En `.env.local` (o variables de entorno en producción). **Usa uno de los dos**; si defines ambos, se usa Brevo.

### Opción A: Brevo

```env
BREVO_API_KEY=tu_api_key
BREVO_LIST_ID=2
```

- **API key**: [Brevo → Configuración → API](https://app.brevo.com/settings/keys/api).
- **List ID**: en Brevo, lista de contactos → ID en la URL o en configuración.

### Opción B: Mailchimp

```env
MAILCHIMP_API_KEY=tu_api_key
MAILCHIMP_LIST_ID=abc123def4
```

- **API key**: en Mailchimp incluye el datacenter (ej. `xxxxx-us21`). [Mailchimp → Account → Extras → API keys](https://mailchimp.com/developer/marketing/guides/quick-start/).
- **List ID**: en Mailchimp, Audience → Settings → Audience name and defaults → “Audience ID”.

### Común (opcional)

```env
NEWSLETTER_STORE_CONSENT=true
```

Para auditoría GDPR (consentimiento guardado en backend si lo implementas).

Sin ninguna API key configurada, la API responde 503 y el formulario muestra error al usuario.

## Analytics (GA4)

Si tienes `NEXT_PUBLIC_GA_MEASUREMENT_ID` configurado, se envían:

- `newsletter_signup` – método: `footer`, `banner`, `exit_intent`.
- `newsletter_error` – método + mensaje de error.
- `newsletter_exit_intent_shown` – cuando se muestra el modal de exit intent.

## Consentimiento y GDPR

- Checkbox obligatorio “Acepto la política de privacidad” con enlace a `/privacidad`.
- Texto: “Puedes darte de baja en cualquier momento.”
- Opcional: `saveNewsletterConsent()` guarda en `localStorage` los últimos consentimientos (auditoría); no se envía a servidor salvo que implementes un endpoint de almacenamiento y actives `NEWSLETTER_STORE_CONSENT`.

## Uso del formulario reutilizable

```tsx
import { NewsletterForm } from '@/components/newsletter';

<NewsletterForm
  source="landing"
  variant="stacked"   // 'inline' | 'stacked' | 'minimal'
  submitLabel="Suscribirme"
  showGdprText={true}
  onSuccess={() => setModalOpen(false)}
/>
```

## API propia

- **POST** `/api/newsletter`
- **Body**: `{ email: string, consent: true, source?: string }`
- **Respuestas**: 200 OK, 400 (validación), 502 (error Brevo), 503 (Brevo no configurado).

Validación con Zod; mensajes de error en español.
