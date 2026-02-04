# 🚀 Conexión con WordPress Configurada

El proyecto ha sido configurado para conectarse con WordPress en **lascincodeldia.com**.

---

## ✅ Configuración Completada

### Archivos Creados/Modificados

1. **`.env.local`** - Variables de entorno configuradas:
   - `NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2`
   - `NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com`
   - `NEXT_PUBLIC_SITE_NAME=Las cinco del día`

2. **`scripts/test-wordpress-connection.js`** - Script para probar la conexión

3. **`docs/CONEXION_WORDPRESS.md`** - Documentación completa

---

## 🧪 Probar la Conexión

### Opción 1: Script de Prueba (Recomendado)

```bash
node scripts/test-wordpress-connection.js
```

Este script verificará:
- ✅ Conexión con WordPress API
- ✅ Disponibilidad de posts
- ✅ Disponibilidad de categorías
- ✅ Configuración de imágenes

### Opción 2: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Luego visita `http://localhost:3000` y verifica que se muestre contenido de WordPress.

---

## 📋 Verificación Rápida

1. **Verifica que `.env.local` existe**:
   ```bash
   cat .env.local
   ```

2. **Prueba la API de WordPress manualmente**:
   ```bash
   curl https://lascincodeldia.com/wp-json/wp/v2/posts?per_page=1
   ```

3. **Inicia el servidor**:
   ```bash
   npm run dev
   ```

4. **Visita la página**:
   - Abre `http://localhost:3000`
   - Si ves contenido de WordPress, ¡todo está funcionando!

---

## ⚠️ Solución de Problemas Comunes

### "WordPress no está conectado"

**Solución**:
1. Verifica que `.env.local` exista en la raíz del proyecto
2. Reinicia el servidor de desarrollo (`Ctrl+C` y luego `npm run dev`)
3. Verifica que la URL sea correcta: `https://lascincodeldia.com/wp-json/wp/v2`

### Error 404 al acceder a la API

**Solución**:
1. Verifica que WordPress tenga la REST API habilitada
2. Prueba acceder a `https://lascincodeldia.com/wp-json/wp/v2` en el navegador
3. Si ves un JSON, la API está funcionando

### Las imágenes no se cargan

**Solución**:
- El proyecto detecta automáticamente el hostname desde la URL de WordPress
- Si las imágenes están en un CDN diferente, agrega `NEXT_PUBLIC_WP_IMAGES_HOSTNAME` en `.env.local`

---

## 📚 Documentación

Para más detalles, consulta:
- **`docs/CONEXION_WORDPRESS.md`** - Guía completa de conexión y solución de problemas

---

## 🎯 Próximos Pasos

1. ✅ Ejecutar script de prueba
2. ✅ Iniciar servidor de desarrollo
3. ✅ Verificar que el contenido se muestre correctamente
4. ✅ Configurar Google Analytics (opcional)
5. ✅ Configurar AdSense (opcional)

---

## 💡 Notas Importantes

- **`.env.local` no se sube a Git** - Está en `.gitignore` por seguridad
- **Reiniciar servidor** - Después de cambiar `.env.local`, reinicia el servidor
- **Variables públicas** - Las variables `NEXT_PUBLIC_*` son accesibles en el cliente

¡Listo para empezar! 🎉
