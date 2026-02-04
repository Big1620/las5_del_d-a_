/**
 * About Us page: /sobre-nosotros
 * Static page with SEO metadata
 */

import { Metadata } from 'next';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { absolute } from '@/lib/utils';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: 'Sobre Nosotros',
  description: `Conoce más sobre ${SITE_NAME}, tu fuente de noticias de última hora, análisis y reportajes de actualidad.`,
  alternates: {
    canonical: absolute('/sobre-nosotros'),
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Sobre Nosotros</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Bienvenido a {SITE_NAME}, tu fuente confiable de noticias de última hora, análisis 
          profundos y reportajes de actualidad.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
          <p className="text-muted-foreground mb-4">
            Nuestra misión es proporcionar información precisa, imparcial y oportuna a nuestros 
            lectores. Creemos en el periodismo de calidad que informa, educa y empodera a la 
            comunidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nuestros Valores</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Integridad:</strong> Nos comprometemos con la verdad y la transparencia en cada historia.</li>
            <li><strong>Excelencia:</strong> Buscamos la excelencia en cada artículo que publicamos.</li>
            <li><strong>Responsabilidad:</strong> Asumimos la responsabilidad de informar con precisión y ética.</li>
            <li><strong>Innovación:</strong> Utilizamos las últimas tecnologías para mejorar la experiencia de nuestros lectores.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nuestro Equipo</h2>
          <p className="text-muted-foreground mb-4">
            Contamos con un equipo de periodistas experimentados y apasionados que trabajan 
            incansablemente para traerte las noticias más importantes del día. Nuestros 
            reporteros están comprometidos con la investigación profunda y el análisis 
            objetivo de los acontecimientos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
          <p className="text-muted-foreground">
            Si tienes alguna pregunta, sugerencia o quieres colaborar con nosotros, 
            no dudes en <a href="/contacto" className="text-primary hover:underline">contactarnos</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
