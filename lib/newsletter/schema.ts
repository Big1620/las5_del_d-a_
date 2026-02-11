import { z } from 'zod';

/** Mensajes en español para errores de validación */
const messages = {
  email: 'Introduce un email válido.',
  required: 'Este campo es obligatorio.',
  consent: 'Debes aceptar la política de privacidad para suscribirte.',
};

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, messages.required)
    .email(messages.email)
    .toLowerCase()
    .trim(),
  consent: z.literal(true, {
    errorMap: () => ({ message: messages.consent }),
  }),
  source: z.string().optional(), // origen: 'footer' | 'banner' | 'exit_intent'
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export type NewsletterConsent = {
  email: string;
  consent: true;
  source?: string;
  timestamp: string;
};
