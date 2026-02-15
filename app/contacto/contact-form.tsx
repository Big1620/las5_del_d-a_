'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CONTACT_FORM_URL = process.env.NEXT_PUBLIC_CONTACT_FORM_URL || '';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!CONTACT_FORM_URL) {
      setStatus('error');
      setErrorMessage('Formulario no configurado. Añade NEXT_PUBLIC_CONTACT_FORM_URL.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      _subject: `Contacto: ${formData.get('subject')}`,
    };

    setStatus('loading');
    setErrorMessage(null);

    try {
      const res = await fetch(CONTACT_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(json.error || json.errors?.[0]?.message || 'Error al enviar. Inténtalo más tarde.');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage('Error de conexión. Inténtalo más tarde.');
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de contacto"
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
          Nombre
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          autoComplete="email"
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">
          Asunto
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          required
          autoComplete="off"
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          disabled={status === 'loading'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {status === 'success' && (
        <p
          className="text-sm text-green-700 dark:text-green-400 font-medium rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-3"
          role="status"
          aria-live="polite"
        >
          Gracias. Tu mensaje ha sido enviado correctamente.
        </p>
      )}

      {status === 'error' && errorMessage && (
        <p
          className="text-sm text-red-700 dark:text-red-400 font-medium rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {!CONTACT_FORM_URL && status === 'idle' && (
        <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-md p-3 border border-amber-200 dark:border-amber-800">
          Formulario en modo demo. Configura <code className="px-1 bg-amber-100 dark:bg-amber-900 rounded">NEXT_PUBLIC_CONTACT_FORM_URL</code> (ej: Formspree) para enviar mensajes.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
    </form>
  );
}
