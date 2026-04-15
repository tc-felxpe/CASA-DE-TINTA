require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { inicializarLibros, db } = require('./database');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de Supabase no configuradas');
  console.error('   Asegúrate de configurar SUPABASE_URL y SUPABASE_SERVICE_KEY (o SUPABASE_ANON_KEY) en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const seedSupabase = async () => {
  try {
    console.log('🌱 Inicializando datos en Supabase...');

    inicializarLibros();

    const librosParaInsertar = db.libros.map(libro => ({
      titulo: libro.titulo,
      autor: libro.autor,
      sinopsis: libro.descripcion || null,
      descripcion: libro.descripcion || null,
      descripcion_extendida: libro.descripcion_extendida || null,
      bibliografia: libro.bibliografia || null,
      precio: libro.precio,
      imagen_url: libro.imagen || null,
      categoria: libro.categoria || null,
      stock: libro.stock || 0,
      isbn: libro.isbn || null,
      editorial: libro.editorial || null,
      anio_publicacion: libro.anioPublicacion || null,
      paginas: libro.paginas || null,
      activo: true
    }));

    console.log(`📚 Preparando ${librosParaInsertar.length} libros para insertar en Supabase...`);

    // Verificar cuántos libros ya existen para no duplicar
    const { data: librosExistentes, error: errorExistentes } = await supabase
      .from('libros')
      .select('titulo, isbn');

    if (errorExistentes) {
      console.error('⚠️  Error al verificar libros existentes:', errorExistentes.message);
    }

    const titulosExistentes = new Set((librosExistentes || []).map(l => l.titulo?.toLowerCase().trim()));
    const isbnsExistentes = new Set((librosExistentes || []).map(l => l.isbn?.toLowerCase().trim()).filter(Boolean));

    const librosNuevos = librosParaInsertar.filter(libro => {
      const tituloExiste = titulosExistentes.has(libro.titulo?.toLowerCase().trim());
      const isbnExiste = libro.isbn ? isbnsExistentes.has(libro.isbn.toLowerCase().trim()) : false;
      return !tituloExiste && !isbnExiste;
    });

    const librosOmitidos = librosParaInsertar.length - librosNuevos.length;

    if (librosNuevos.length === 0) {
      console.log('✅ Todos los libros ya existen en Supabase. No se insertó nada nuevo.');
      if (librosOmitidos > 0) {
        console.log(`   (${librosOmitidos} libros omitidos por duplicado)`);
      }
      return;
    }

    const { data, error } = await supabase
      .from('libros')
      .insert(librosNuevos)
      .select();

    if (error) {
      console.error('❌ Error al insertar libros en Supabase:', error.message);
      process.exit(1);
    }

    console.log(`✅ ${data.length} libros insertados correctamente en Supabase!`);
    if (librosOmitidos > 0) {
      console.log(`   (${librosOmitidos} libros ya existían y fueron omitidos)`);
    }
    console.log('');
    console.log('💡 Para ver los libros:');
    console.log('   1. Reinicia el backend: npm run dev');
    console.log('   2. Abre el frontend: npm run dev (en la carpeta FrontEnd)');
    console.log('   3. Visita: http://localhost:5173');
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
};

seedSupabase();
