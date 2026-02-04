# 🚀 Guía de Deploy a Producción

Esta guía te explica cómo desplegar tu proyecto Next.js para que esté disponible en el dominio real.

---

## 📋 Estado Actual

**Tu proyecto actualmente está:**
- ✅ Funcionando en desarrollo local (`localhost:3000`)
- ❌ **NO está desplegado en producción** (por eso no lo ves en el dominio real)

**Para verlo en `lascincodeldia.com`, necesitas hacer deploy.**

---

## 🎯 Opciones de Deploy

### Opción 1: Vercel (Recomendado para Next.js)

Vercel es la plataforma creada por el equipo de Next.js y es la más fácil de usar.

#### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con GitHub, GitLab o Bitbucket

2. **Conectar tu repositorio**
   - Si tienes el código en Git, conéctalo a Vercel
   - O sube el proyecto manualmente

3. **Configurar variables de entorno**
   En el dashboard de Vercel, ve a Settings → Environment Variables y agrega:
   ```
   NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2
   NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
   NEXT_PUBLIC_SITE_NAME=Las cinco del día
   ```

4. **Deploy automático**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - Hará el build y deploy automáticamente
   - Te dará una URL temporal (ej: `tu-proyecto.vercel.app`)

5. **Configurar dominio personalizado** (opcional)
   - En Settings → Domains
   - Agrega `lascincodeldia.com`
   - Configura los DNS según las instrucciones de Vercel

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Deploy automático desde Git
- ✅ SSL automático
- ✅ Optimizado para Next.js
- ✅ CDN global incluido

---

### Opción 2: Netlify

Netlify es otra excelente opción para proyectos Next.js.

#### Pasos:

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Regístrate con GitHub o email

2. **Conectar repositorio o subir proyecto**
   - Conecta tu repositorio Git
   - O arrastra la carpeta del proyecto

3. **Configurar build**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Configurar variables de entorno**
   En Site settings → Environment variables:
   ```
   NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2
   NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
   NEXT_PUBLIC_SITE_NAME=Las cinco del día
   ```

5. **Deploy**
   - Netlify hará el build y deploy automáticamente

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Deploy automático
- ✅ SSL automático
- ✅ Fácil de usar

---

### Opción 3: Servidor propio (VPS/Cloud)

Si tienes un servidor propio o VPS (DigitalOcean, AWS, etc.)

#### Pasos:

1. **Preparar el servidor**
   ```bash
   # Instalar Node.js y npm
   sudo apt update
   sudo apt install nodejs npm
   
   # Instalar PM2 para mantener el proceso corriendo
   npm install -g pm2
   ```

2. **Subir el proyecto**
   ```bash
   # Clonar o subir el proyecto
   git clone tu-repositorio
   cd Las_5_del_día
   ```

3. **Instalar dependencias y build**
   ```bash
   npm install
   npm run build
   ```

4. **Configurar variables de entorno**
   ```bash
   # Crear .env.local en el servidor
   nano .env.local
   ```
   Agregar las mismas variables que en desarrollo.

5. **Iniciar con PM2**
   ```bash
   pm2 start npm --name "las-5-del-dia" -- start
   pm2 save
   pm2 startup
   ```

6. **Configurar Nginx como reverse proxy** (recomendado)
   ```nginx
   server {
       listen 80;
       server_name lascincodeldia.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Configurar SSL con Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d lascincodeldia.com
   ```

---

## 🔧 Configuración Necesaria para Producción

### Variables de Entorno

Asegúrate de configurar estas variables en tu plataforma de hosting:

```env
NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://lascincodeldia.com
NEXT_PUBLIC_SITE_NAME=Las cinco del día

# Opcionales:
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### Build del Proyecto

Antes de hacer deploy, verifica que el build funcione:

```bash
npm run build
```

Si hay errores, corrígelos antes de hacer deploy.

---

## 📝 Checklist Pre-Deploy

Antes de hacer deploy, verifica:

- [ ] El proyecto funciona correctamente en `localhost:3000`
- [ ] El build funciona sin errores (`npm run build`)
- [ ] Las variables de entorno están configuradas
- [ ] El código está en un repositorio Git (si usas deploy automático)
- [ ] Has probado la conexión con WordPress (`node scripts/test-wordpress-connection.js`)

---

## 🌐 Configurar Dominio Personalizado

### Si usas Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega `lascincodeldia.com`
4. Configura los DNS según las instrucciones:
   - Agrega un registro CNAME apuntando a `cname.vercel-dns.com`
   - O agrega registros A según las instrucciones

### Si usas Netlify:

1. Ve a Site settings → Domain management
2. Agrega custom domain: `lascincodeldia.com`
3. Configura los DNS según las instrucciones de Netlify

### Si usas servidor propio:

1. Configura los DNS de tu dominio para apuntar a la IP de tu servidor
2. Configura Nginx/Apache como reverse proxy
3. Configura SSL con Let's Encrypt

---

## 🔍 Verificar el Deploy

Después de hacer deploy:

1. **Verifica que el sitio carga**
   - Visita la URL de producción
   - Verifica que se muestre contenido

2. **Verifica la conexión con WordPress**
   - El sitio debería mostrar posts de WordPress
   - Las categorías deberían aparecer en el header

3. **Verifica que no haya errores**
   - Abre la consola del navegador (F12)
   - Verifica que no haya errores

4. **Prueba diferentes páginas**
   - Home
   - Categorías
   - Artículos individuales
   - Búsqueda

---

## ⚠️ Problemas Comunes

### El sitio carga pero no muestra contenido de WordPress

**Solución:**
- Verifica que las variables de entorno estén configuradas en producción
- Verifica que `NEXT_PUBLIC_WP_API_URL` sea correcta
- Reinicia el deploy después de cambiar variables de entorno

### Error 404 en todas las rutas

**Solución:**
- En Vercel/Netlify, verifica que el proyecto esté configurado como Next.js
- Verifica que el build haya sido exitoso

### Las imágenes no se cargan

**Solución:**
- Verifica que `next.config.js` tenga configurado el hostname de WordPress
- El proyecto detecta automáticamente el hostname desde `NEXT_PUBLIC_WP_API_URL`
- Si las imágenes están en un CDN diferente, agrega `NEXT_PUBLIC_WP_IMAGES_HOSTNAME`

---

## 🚀 Recomendación

**Para empezar rápido, usa Vercel:**

1. Es gratis
2. Optimizado para Next.js
3. Deploy automático desde Git
4. SSL automático
5. Muy fácil de configurar

**Pasos rápidos con Vercel:**
1. Sube tu código a GitHub (si no lo has hecho)
2. Ve a vercel.com y conéctalo con GitHub
3. Configura las variables de entorno
4. ¡Deploy automático!

---

## 📚 Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

¿Necesitas ayuda con algún paso específico del deploy? ¡Dime qué plataforma quieres usar!
