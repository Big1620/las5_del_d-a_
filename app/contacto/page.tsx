/**
 * Contact page: /contacto
 * Static page with contact form placeholder
 */

import { Metadata } from 'next';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { absolute } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: 'Contacto',
  description: `Ponte en contacto con ${SITE_NAME}. Envía tus preguntas, sugerencias o colaboraciones.`,
  alternates: {
    canonical: absolute('/contacto'),
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Contacto</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          ¿Tienes una pregunta, sugerencia o quieres colaborar con nosotros? 
          Estamos aquí para escucharte.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>Email:</strong> contacto@{process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || 'ejemplo.com'}
              </p>
              <p>
                <strong>Redes Sociales:</strong> Síguenos en nuestras redes sociales para las últimas actualizaciones.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Formulario de Contacto</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar Mensaje
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              Nota: Este formulario es un placeholder. En producción, deberías integrar 
              un servicio de email o un sistema de gestión de contactos.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
