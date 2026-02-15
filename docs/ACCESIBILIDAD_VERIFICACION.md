# Verificación de Opciones de Accesibilidad

Barra de accesibilidad (botón flotante esquina inferior derecha) – WCAG 2.0.

## Opciones y verificación

| Opción | WCAG | Verificación |
|--------|------|--------------|
| **Tamaño del texto** | 1.4.4 AA | A−/A+ ajusta `font-size` del root (90–150%). El contenido escala con rem/em. |
| **Alto contraste** | 1.4.3 AA | Header, footer, cards y elementos principales pasan a blanco/negro o negro/blanco. Enlaces azules con subrayado. |
| **Reducir movimiento** | 2.2.2 A | Animaciones y transiciones ≈0ms. Se respeta `prefers-reduced-motion` si no hay preferencias guardadas. |
| **Subrayar enlaces** | 1.4.1 A | Todos los enlaces muestran subrayado para no depender solo del color. |
| **Resaltar foco** | 2.4.7 AA | `outline` más visible al navegar con Tab. |
| **Restablecer** | — | Vuelve todas las opciones a sus valores por defecto. |

## Cómo probar

1. Inicia el sitio: `npm run serve` o `npm run dev`
2. Haz clic en el botón de accesibilidad (icono en la esquina inferior derecha)
3. Activa cada opción y comprueba cambios visuales
4. Navega con Tab y verifica el foco (especialmente con “Resaltar foco” activo)
5. Pulsa Escape para cerrar el panel

## Otros elementos de accesibilidad

- **Enlace “Saltar al contenido”**: Visible al enfocar (Tab) al cargar la página; salta a `#main-content`.
- **Preferencia de movimiento del sistema**: Si el SO tiene “reducir movimiento”, se aplica por defecto.
- **Focus visible**: Todos los elementos interactivos tienen `:focus-visible`.
