import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TagNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Etiqueta no encontrada</h1>
      <p className="text-muted-foreground mb-6">
        La etiqueta que buscas no existe.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
