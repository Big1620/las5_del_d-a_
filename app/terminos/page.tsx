/**
 * Terms of Service page: /terminos
 * Static page with terms of service content
 */

import { Metadata } from 'next';
import { generateBaseMetadata } from '@/lib/seo/metadata';
import { absolute } from '@/lib/utils';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Las cinco del día';

export const metadata: Metadata = {
  ...generateBaseMetadata(),
  title: 'Términos de Uso',
  description: `Términos de uso de ${SITE_NAME}. Conoce las condiciones para utilizar nuestro sitio web.`,
  alternates: {
    canonical: absolute('/terminos'),
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Términos de Uso</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
          <p className="text-muted-foreground mb-4">
            Al acceder y utilizar {SITE_NAME}, aceptas cumplir con estos Términos de Uso y 
            todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de 
            estos términos, no debes utilizar nuestro sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Uso del Sitio</h2>
          <p className="text-muted-foreground mb-4">
            Puedes utilizar nuestro sitio web para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Leer y acceder a nuestros contenidos de noticias</li>
            <li>Compartir nuestros artículos en redes sociales</li>
            <li>Contactarnos con preguntas o comentarios</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            No puedes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Reproducir, copiar o redistribuir nuestros contenidos sin autorización</li>
            <li>Utilizar el sitio para fines ilegales o no autorizados</li>
            <li>Intentar acceder a áreas restringidas del sitio</li>
            <li>Interferir con el funcionamiento del sitio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Propiedad Intelectual</h2>
          <p className="text-muted-foreground mb-4">
            Todo el contenido de este sitio, incluyendo textos, imágenes, logotipos, gráficos 
            y software, es propiedad de {SITE_NAME} o de sus licenciantes y está protegido por 
            leyes de derechos de autor y otras leyes de propiedad intelectual.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Contenido de Terceros</h2>
          <p className="text-muted-foreground mb-4">
            Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables 
            del contenido, políticas de privacidad o prácticas de estos sitios externos. El 
            acceso a estos enlaces es bajo tu propio riesgo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground mb-4">
            {SITE_NAME} se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. No garantizamos 
            que el sitio esté libre de errores, virus u otros componentes dañinos. No seremos 
            responsables de ningún daño directo, indirecto, incidental o consecuente derivado 
            del uso o la imposibilidad de usar nuestro sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Modificaciones del Servicio</h2>
          <p className="text-muted-foreground mb-4">
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
            del sitio en cualquier momento, con o sin previo aviso. No seremos responsables 
            ante ti o cualquier tercero por cualquier modificación, suspensión o discontinuación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Indemnización</h2>
          <p className="text-muted-foreground mb-4">
            Aceptas indemnizar y eximir de responsabilidad a {SITE_NAME}, sus empleados, 
            directores y agentes de cualquier reclamo, daño, obligación, pérdida, responsabilidad, 
            costo o deuda, y gastos (incluyendo honorarios de abogados) que surjan de tu uso 
            del sitio o violación de estos términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Ley Aplicable</h2>
          <p className="text-muted-foreground mb-4">
            Estos Términos de Uso se regirán e interpretarán de acuerdo con las leyes del país 
            donde opera {SITE_NAME}, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Cambios a los Términos</h2>
          <p className="text-muted-foreground mb-4">
            Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio. 
            Tu uso continuado del sitio después de cualquier cambio constituye tu aceptación 
            de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre estos Términos de Uso, puedes 
            <a href="/contacto" className="text-primary hover:underline"> contactarnos</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
