/**
 * Privacy Policy page: /privacidad
 * Static page with privacy policy content
 */

import { Metadata } from 'next';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { absolute } from '@/lib/utils';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: 'Política de Privacidad',
  description: `Política de privacidad de ${SITE_NAME}. Conoce cómo protegemos y utilizamos tu información personal.`,
  alternates: {
    canonical: absolute('/privacidad'),
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Política de Privacidad</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
          <p className="text-muted-foreground mb-4">
            En {SITE_NAME}, nos comprometemos a proteger tu privacidad. Esta Política de 
            Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos tu 
            información personal cuando utilizas nuestro sitio web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Información que Recopilamos</h2>
          <p className="text-muted-foreground mb-4">
            Recopilamos información que nos proporcionas directamente, así como información 
            que se recopila automáticamente cuando utilizas nuestro sitio:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Información de contacto (nombre, email) cuando te suscribes o nos contactas</li>
            <li>Datos de uso y navegación (dirección IP, tipo de navegador, páginas visitadas)</li>
            <li>Cookies y tecnologías similares para mejorar tu experiencia</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Uso de la Información</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Personalizar tu experiencia en el sitio</li>
            <li>Enviar comunicaciones relacionadas con el servicio (si te has suscrito)</li>
            <li>Analizar el uso del sitio para mejorar nuestros contenidos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Cookies y Tecnologías de Seguimiento</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar 
            el tráfico del sitio y personalizar el contenido. Puedes gestionar tus preferencias 
            de cookies a través de la configuración de tu navegador.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Compartir Información</h2>
          <p className="text-muted-foreground mb-4">
            No vendemos tu información personal. Podemos compartir información con:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Proveedores de servicios que nos ayudan a operar el sitio</li>
            <li>Autoridades legales cuando sea requerido por ley</li>
            <li>En caso de fusión, adquisición o venta de activos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Seguridad</h2>
          <p className="text-muted-foreground mb-4">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu 
            información personal. Sin embargo, ningún método de transmisión por Internet 
            es 100% seguro.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Tus Derechos</h2>
          <p className="text-muted-foreground mb-4">
            Tienes derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Acceder a tu información personal</li>
            <li>Rectificar información incorrecta</li>
            <li>Solicitar la eliminación de tu información</li>
            <li>Oponerte al procesamiento de tu información</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Cambios a esta Política</h2>
          <p className="text-muted-foreground mb-4">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos 
            de cualquier cambio publicando la nueva política en esta página y actualizando 
            la fecha de &quot;Última actualización&quot;.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Contacto</h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre esta Política de Privacidad, puedes 
            <a href="/contacto" className="text-primary hover:underline"> contactarnos</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
