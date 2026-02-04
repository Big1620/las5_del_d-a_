/**
 * Script para probar la conexión con WordPress
 * Ejecutar con: node scripts/test-wordpress-connection.js
 * 
 * Nota: Si no tienes dotenv instalado, puedes instalar con:
 * npm install --save-dev dotenv
 * O simplemente ejecutar: NEXT_PUBLIC_WP_API_URL=https://lascincodeldia.com/wp-json/wp/v2 node scripts/test-wordpress-connection.js
 */

// Intentar cargar dotenv si está disponible
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv no está instalado, usar variables de entorno del sistema
  console.log('ℹ️  dotenv no está instalado, usando variables de entorno del sistema\n');
}

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WP_API_URL) {
  console.error('❌ Error: NEXT_PUBLIC_WP_API_URL no está configurado en .env.local');
  process.exit(1);
}

console.log('🔍 Probando conexión con WordPress...');
console.log(`📍 URL: ${WP_API_URL}\n`);

async function testConnection() {
  try {
    // Probar endpoint raíz de la API
    console.log('1. Probando endpoint raíz...');
    const rootResponse = await fetch(`${WP_API_URL}`);
    if (!rootResponse.ok) {
      throw new Error(`HTTP ${rootResponse.status}: ${rootResponse.statusText}`);
    }
    const rootData = await rootResponse.json();
    console.log('✅ Conexión exitosa con WordPress API');
    console.log(`   Namespace: ${rootData.namespace || 'N/A'}`);
    console.log(`   Routes disponibles: ${Object.keys(rootData.routes || {}).length}\n`);

    // Probar endpoint de posts
    console.log('2. Probando endpoint de posts...');
    const postsResponse = await fetch(`${WP_API_URL}/posts?per_page=1`);
    if (!postsResponse.ok) {
      throw new Error(`HTTP ${postsResponse.status}: ${postsResponse.statusText}`);
    }
    const posts = await postsResponse.json();
    console.log(`✅ Posts disponibles: ${posts.length > 0 ? 'Sí' : 'No'}`);
    if (posts.length > 0) {
      console.log(`   Último post: "${posts[0].title?.rendered || 'N/A'}"`);
    }
    console.log('');

    // Probar endpoint de categorías
    console.log('3. Probando endpoint de categorías...');
    const categoriesResponse = await fetch(`${WP_API_URL}/categories?per_page=5`);
    if (!categoriesResponse.ok) {
      throw new Error(`HTTP ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
    }
    const categories = await categoriesResponse.json();
    console.log(`✅ Categorías disponibles: ${categories.length}`);
    if (categories.length > 0) {
      console.log(`   Ejemplos: ${categories.slice(0, 3).map(c => c.name).join(', ')}`);
    }
    console.log('');

    // Probar endpoint de media/images
    console.log('4. Verificando configuración de imágenes...');
    const mediaResponse = await fetch(`${WP_API_URL}/media?per_page=1`);
    if (mediaResponse.ok) {
      const media = await mediaResponse.json();
      console.log(`✅ Endpoint de media accesible`);
      if (media.length > 0 && media[0].source_url) {
        const imageUrl = new URL(media[0].source_url);
        console.log(`   Hostname de imágenes: ${imageUrl.hostname}`);
      }
    } else {
      console.log('⚠️  Endpoint de media no accesible (puede ser normal si no hay imágenes)');
    }
    console.log('');

    console.log('✅✅✅ Todas las pruebas pasaron exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecuta "npm run dev" para iniciar el servidor de desarrollo');
    console.log('   2. Visita http://localhost:3000 para ver tu sitio');
    console.log('   3. Si ves contenido de WordPress, la conexión está funcionando correctamente');

  } catch (error) {
    console.error('\n❌ Error al conectar con WordPress:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      console.log('💡 Posibles soluciones:');
      console.log('   1. Verifica que el dominio "lascincodeldia.com" sea correcto');
      console.log('   2. Verifica que WordPress esté accesible públicamente');
      console.log('   3. Verifica que la URL de la API sea correcta (debe terminar en /wp-json/wp/v2)');
      console.log('   4. Si WordPress está en un subdirectorio, ajusta la URL');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log('💡 Posibles soluciones:');
      console.log('   1. Verifica que la REST API de WordPress esté habilitada');
      console.log('   2. Algunos plugins pueden bloquear el acceso a la API');
      console.log('   3. Verifica la configuración de seguridad de WordPress');
    }
    
    process.exit(1);
  }
}

testConnection();
