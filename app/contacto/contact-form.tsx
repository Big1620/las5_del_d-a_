'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
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
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {submitted && (
        <p
          className="text-sm text-primary font-medium"
          role="status"
          aria-live="polite"
        >
          Gracias. Este formulario es un placeholder; el mensaje no se envía aún.
        </p>
      )}

      <Button type="submit" className="w-full">
        Enviar Mensaje
      </Button>
    </form>
  );
}
