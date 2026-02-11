/**
 * Utilidades para búsqueda editorial: resaltar términos y debounce
 */

/**
 * Escapa caracteres especiales de regex en el término de búsqueda
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Resalta las coincidencias del término de búsqueda en el texto.
 * Insensible a mayúsculas; devuelve nodos React (string | JSX) para usar con dangerouslySetInnerHTML
 * o un componente que renderice los fragmentos.
 */
export function highlightSearchTerm(text: string, query: string): string {
  if (!text || typeof text !== 'string') return '';
  const q = query?.trim();
  if (!q) return text;

  const escaped = escapeRegex(q);
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-primary/20 text-foreground rounded px-0.5">$1</mark>');
}

/**
 * Versión que devuelve fragmentos para renderizado seguro (evitar XSS si query viene de usuario).
 * Para uso con React: pasar query ya sanitizado o usar solo en contexto controlado.
 */
export function getHighlightedFragments(
  text: string,
  query: string
): Array<{ type: 'text' | 'match'; value: string }> {
  if (!text || typeof text !== 'string') return [];
  const q = query?.trim();
  if (!q) return [{ type: 'text', value: text }];

  const escaped = escapeRegex(q);
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts: Array<{ type: 'text' | 'match'; value: string }> = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(escaped, 'gi');
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, m.index) });
    }
    parts.push({ type: 'match', value: m[0] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return parts.length ? parts : [{ type: 'text', value: text }];
}

/**
 * Debounce: ejecuta fn después de wait ms sin nuevas llamadas.
 * Acepta callbacks que devuelvan void o Promise<void> (el debounce no espera la promesa).
 */
export function debounce<A extends unknown[], R>(
  fn: (...args: A) => R,
  wait: number
): (...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, wait);
  };
}
