# 🔍 Cómo Verificar la Conexión con WordPress

Esta guía te muestra diferentes formas de verificar que tu proyecto Next.js está conectado correctamente con WordPress.

---

## ✅ Método 1: Script de Prueba Automático (Recomendado)

### Ejecutar el script incluido

```bash
node scripts/test-wordpress-connection.js
```

Este script verificará automáticamente:
- ✅ Conexión con la API de WordPress
- ✅ Disponibilidad de posts
- ✅ Disponibilidad de categorías
- ✅ Configuración de imágenes

**Salida esperada:**
```
🔍 Probando conexión con WordPress...
📍 URL: https://lascincodeldia.com/wp-json/wp/v2

1. Probando endpoint raíz...
✅ Conexión exitosa con WordPress API
   Namespace: wp/v2
   Routes disponibles: 108

2. Probando endpoint de posts...
✅ Posts disponibles: Sí
   Último post: "Hello world!"

3. Probando endpoint de categorías...
✅ Categorías disponibles: 5
   Ejemplos: Actualidad, Educación, Empleo

4. Verificando configuración de imágenes...
✅ Endpoint de media accesible

✅✅✅ Todas las pruebas pasaron exitosamente!
```

---

## ✅ Método 2: Verificar en el Navegador (Más Visual)

### Paso 1: Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Paso 2: Abrir el sitio

Visita `http://localhost:3000` en tu navegador.

### Paso 3: Verificar que se muestre contenido

**Si la conexión funciona correctamente, deberías ver:**
- ✅ Contenido de WordPress en la página principal
- ✅ Posts/artículos visibles
- ✅ Categorías en el header (menú de navegación)
- ✅ Sin mensaje de "WordPress no está conectado"

**Si NO funciona, verás:**
- ❌ Mensaje: "WordPress no está conectado actualmente"
- ❌ Instrucciones para configurar la conexión

---

## ✅ Método 3: Verificar Variables de Entorno

### Verificar que el archivo existe

```bash
cat .env.local
```

**Deberías ver:**
```env
NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
NEXT_PUBLIC_SITE_NAME=Las cinco del día
```

### Verificar que las variables están cargadas

En el código, puedes agregar temporalmente un `console.log` en `lib/api/wordpress.ts`:

```typescript
console.log('WordPress API URL:', WP_API_URL);
```

O verificar en la consola del navegador (F12) si las variables públicas están disponibles.

---

## ✅ Método 4: Probar la API de WordPress Directamente

### Usando curl (Terminal)

```bash
# Probar endpoint raíz
curl https://lascincodeldia.com/wp-json/wp/v2

# Probar posts
curl https://lascincodeldia.com/wp-json/wp/v2/posts?per_page=1

# Probar categorías
curl https://lascincodeldia.com/wp-json/wp/v2/categories
```

### Usando el navegador

Abre directamente en tu navegador:
- `https://lascincodeldia.com/wp-json/wp/v2` - Debería mostrar un JSON con información
- `https://lascincodeldia.com/wp-json/wp/v2/posts` - Debería mostrar los posts en JSON

**Si ves JSON válido, la API está funcionando.**

---

## ✅ Método 5: Verificar en la Consola del Navegador

### Paso 1: Abrir DevTools

1. Abre `http://localhost:3000`
2. Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux) o `Cmd+Option+I` (Mac)
3. Ve a la pestaña **Console**

### Paso 2: Verificar errores

**Si hay errores de conexión, verás:**
- `WordPress API error: 404`
- `WordPress API error: 401`
- `fetch failed`
- `WordPress API URL is not configured`

**Si todo funciona, NO deberías ver errores relacionados con WordPress.**

### Paso 3: Verificar Network (Red)

1. Ve a la pestaña **Network** en DevTools
2. Recarga la página (`F5`)
3. Busca requests a `lascincodeldia.com` o `wp-json`
4. Verifica que los requests sean exitosos (status 200)

---

## ✅ Método 6: Verificar en el Código

### Crear una página de prueba temporal

Crea `app/test-wordpress/page.tsx`:

```tsx
import { getPosts, getCategories } from '@/lib/api/wordpress';

export default async function TestWordPress() {
  try {
    const [postsData, categories] = await Promise.all([
      getPosts(1, 5),
      getCategories(),
    ]);

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Test de Conexión WordPress</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Posts</h2>
            <p>Total: {postsData.posts.length}</p>
            {postsData.posts.length > 0 && (
              <ul className="list-disc ml-6">
                {postsData.posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Categorías</h2>
            <p>Total: {categories.length}</p>
            {categories.length > 0 && (
              <ul className="list-disc ml-6">
                {categories.map((cat) => (
                  <li key={cat.id}>{cat.name} ({cat.count} posts)</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error de Conexión</h1>
        <pre className="bg-red-50 p-4 rounded">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
```

Luego visita `http://localhost:3000/test-wordpress` para ver el estado de la conexión.

---

## 🔧 Solución de Problemas Comunes

### Error: "WordPress API URL is not configured"

**Causa**: El archivo `.env.local` no existe o no tiene la variable correcta.

**Solución**:
1. Verifica que `.env.local` exista en la raíz del proyecto
2. Verifica que contenga: `NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2`
3. Reinicia el servidor de desarrollo

### Error: "WordPress API error: 404"

**Causa**: La URL de la API no es correcta.

**Solución**:
1. Verifica que la URL termine en `/wp-json/wp/v2`
2. Prueba acceder a `https://lascincodeldia.com/wp-json/wp/v2` en el navegador
3. Si ves un JSON, la API está funcionando

### Error: "fetch failed" o "ENOTFOUND"

**Causa**: El dominio no es accesible.

**Solución**:
1. Verifica que el dominio sea correcto
2. Prueba acceder al dominio en el navegador
3. Verifica tu conexión a internet

### No se muestran posts en la página

**Causa**: Puede haber posts pero no se están mostrando correctamente.

**Solución**:
1. Verifica en WordPress que haya posts publicados
2. Verifica que los posts tengan estado "Publicado"
3. Revisa la consola del navegador para errores

---

## 📋 Checklist de Verificación

Usa este checklist para verificar que todo esté funcionando:

- [ ] El archivo `.env.local` existe y tiene `NEXT_PUBLIC_WP_API_URL`
- [ ] El script de prueba pasa todas las verificaciones
- [ ] El servidor de desarrollo inicia sin errores
- [ ] La página principal muestra contenido de WordPress
- [ ] Las categorías aparecen en el header
- [ ] Los posts se muestran correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Los requests a WordPress son exitosos (Network tab)

---

## 🎯 Método Rápido (Recomendado para empezar)

**La forma más rápida de verificar:**

1. Ejecuta: `node scripts/test-wordpress-connection.js`
2. Si todas las pruebas pasan ✅, la conexión está funcionando
3. Si hay errores ❌, revisa la sección de "Solución de Problemas"

---

## 💡 Tips Adicionales

- **Reiniciar servidor**: Después de cambiar `.env.local`, siempre reinicia el servidor
- **Verificar en producción**: Las variables de entorno deben estar configuradas también en tu plataforma de hosting
- **Cache**: Next.js cachea las respuestas, los cambios pueden tardar unos segundos en aparecer
- **Logs**: Revisa los logs del servidor (`npm run dev`) para ver errores detallados

---

¿Necesitas ayuda con algún método específico? ¡Dime cuál quieres probar!
