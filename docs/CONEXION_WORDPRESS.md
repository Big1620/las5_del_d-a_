# Guía de Conexión con WordPress

Este documento explica cómo está configurada la conexión con WordPress y cómo verificar que funcione correctamente.

---

## 🔧 Configuración Actual

### Variables de Entorno

El archivo `.env.local` ha sido configurado con:

```env
NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
NEXT_PUBLIC_SITE_NAME=Las cinco del día
```

### URL de la API

La URL base de la API de WordPress es:
- **Base**: `https://lascincodeldia.com/wp-json/wp/v2`
- **Posts**: `https://lascincodeldia.com/wp-json/wp/v2/posts`
- **Categorías**: `https://lascincodeldia.com/wp-json/wp/v2/categories`
- **Etiquetas**: `https://lascincodeldia.com/wp-json/wp/v2/tags`
- **Autores**: `https://lascincodeldia.com/wp-json/wp/v2/users`
- **Media**: `https://lascincodeldia.com/wp-json/wp/v2/media`

---

## ✅ Verificar la Conexión

### Método 1: Script de Prueba

Ejecuta el script de prueba incluido:

```bash
node scripts/test-wordpress-connection.js
```

Este script verificará:
- ✅ Conexión con la API de WordPress
- ✅ Disponibilidad de posts
- ✅ Disponibilidad de categorías
- ✅ Configuración de imágenes

### Método 2: Probar Manualmente

1. **Verificar endpoint raíz**:
   ```bash
   curl https://lascincodeldia.com/wp-json/wp/v2
   ```

2. **Verificar posts**:
   ```bash
   curl https://lascincodeldia.com/wp-json/wp/v2/posts?per_page=1
   ```

3. **Verificar categorías**:
   ```bash
   curl https://lascincodeldia.com/wp-json/wp/v2/categories
   ```

### Método 3: Probar en el Navegador

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Visita `http://localhost:3000`

3. Si ves contenido de WordPress, la conexión está funcionando.

4. Si ves el mensaje de "WordPress no está conectado", revisa:
   - Que el archivo `.env.local` exista y tenga las variables correctas
   - Que el servidor de desarrollo se haya reiniciado después de crear `.env.local`
   - Que la URL de WordPress sea accesible públicamente

---

## 🔍 Solución de Problemas

### Error: "WordPress API URL is not configured"

**Causa**: El archivo `.env.local` no existe o no tiene la variable `NEXT_PUBLIC_WP_API_URL`.

**Solución**:
1. Verifica que el archivo `.env.local` exista en la raíz del proyecto
2. Verifica que contenga: `NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "WordPress API error: 404"

**Causa**: La URL de la API no es correcta o WordPress no tiene la REST API habilitada.

**Solución**:
1. Verifica que la URL termine en `/wp-json/wp/v2`
2. Prueba acceder a `https://lascincodeldia.com/wp-json/wp/v2` en el navegador
3. Si ves un JSON con información, la API está funcionando
4. Si ves un 404, verifica que WordPress tenga la REST API habilitada

### Error: "WordPress API error: 401" o "403"

**Causa**: La API está bloqueada o requiere autenticación.

**Solución**:
1. Verifica que la REST API de WordPress esté habilitada
2. Revisa si hay plugins de seguridad que bloqueen la API
3. Verifica la configuración de `.htaccess` si usas Apache
4. Algunos plugins como "Disable REST API" pueden bloquear el acceso

### Error: "fetch failed" o "ENOTFOUND"

**Causa**: El dominio no es accesible o no existe.

**Solución**:
1. Verifica que el dominio `lascincodeldia.com` sea correcto
2. Prueba acceder al dominio en el navegador
3. Verifica que WordPress esté accesible públicamente
4. Si WordPress está en un subdirectorio, ajusta la URL (ej: `/blog/wp-json/wp/v2`)

### Las imágenes no se cargan

**Causa**: El hostname de las imágenes no está configurado en `next.config.js`.

**Solución**:
1. El proyecto detecta automáticamente el hostname desde `NEXT_PUBLIC_WP_API_URL`
2. Si las imágenes están en un CDN diferente, agrega:
   ```env
   NEXT_PUBLIC_WP_IMAGES_HOSTNAME=cdn.lascincodeldia.com
   ```
3. Reinicia el servidor de desarrollo

---

## 📋 Checklist de Verificación

Antes de hacer deploy, verifica:

- [ ] El archivo `.env.local` existe y tiene `NEXT_PUBLIC_WP_API_URL`
- [ ] La URL de WordPress es accesible públicamente
- [ ] La REST API de WordPress está habilitada
- [ ] Hay posts publicados en WordPress
- [ ] Las categorías están configuradas
- [ ] Las imágenes se cargan correctamente
- [ ] El script de prueba pasa todas las verificaciones

---

## 🚀 Próximos Pasos

1. **Ejecutar script de prueba**:
   ```bash
   node scripts/test-wordpress-connection.js
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Verificar en el navegador**:
   - Visita `http://localhost:3000`
   - Verifica que se muestre contenido de WordPress
   - Navega por diferentes páginas (categorías, artículos, etc.)

4. **Configurar producción**:
   - Asegúrate de que las variables de entorno estén configuradas en tu plataforma de hosting
   - Para Vercel: Configura las variables en el dashboard
   - Para otros hosts: Configura las variables según su documentación

---

## 📝 Notas Importantes

- **`.env.local` no se sube a Git**: Está en `.gitignore` por seguridad
- **Reiniciar servidor**: Después de cambiar `.env.local`, reinicia el servidor
- **Variables públicas**: Las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente
- **Cache**: Next.js cachea las respuestas de WordPress según la configuración de revalidación

---

## 🔗 Recursos Útiles

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
