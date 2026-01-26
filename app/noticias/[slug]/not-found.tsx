import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Artículo no encontrado</h1>
      <p className="text-muted-foreground mb-6">
        La noticia que buscas no existe o ha sido eliminada.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
