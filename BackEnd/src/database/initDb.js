require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de Supabase no configuradas');
  console.error('   Asegúrate de configurar SUPABASE_URL y SUPABASE_SERVICE_KEY en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function initDatabase() {
  console.log('🔧 Inicializando base de datos Supabase...\n');

  try {
    const schemaPath = path.join(__dirname, '../../supabase/schema.sql');
    const functionsPath = path.join(__dirname, '../../supabase/functions.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('📄 Ejecutando schema.sql...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      const { error: schemaError } = await supabase.rpc('exec', { sql: schema });
      if (schemaError) {
        console.log('⚠️  Nota: La función exec.rpc puede no estar disponible.');
        console.log('   Ejecuta el SQL manualmente en el SQL Editor de Supabase.');
      } else {
        console.log('✅ Schema creado exitosamente');
      }
    }

    if (fs.existsSync(functionsPath)) {
      console.log('📄 Ejecutando functions.sql...');
      const functions = fs.readFileSync(functionsPath, 'utf8');
      
      const statements = functions.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await supabase.rpc('pg_execute', { query: statement + ';' });
        }
      }
      console.log('✅ Funciones creadas exitosamente');
    }

    console.log('\n📊 Verificando tablas...');
    
    const { data: libros, error: errorLibros } = await supabase
      .from('libros')
      .select('id', { count: 'exact', head: true });

    if (!errorLibros) {
      console.log(`✅ Tabla 'libros': OK (${libros?.length || 0} registros)`);
    }

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true });

    if (!errorUsuarios) {
      console.log(`✅ Tabla 'usuarios': OK (${usuarios?.length || 0} registros)`);
    }

    const { data: ordenes, error: errorOrdenes } = await supabase
      .from('ordenes')
      .select('id', { count: 'exact', head: true });

    if (!errorOrdenes) {
      console.log(`✅ Tabla 'ordenes': OK (${ordenes?.length || 0} registros)`);
    }

    console.log('\n🎉 Base de datos inicializada correctamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecuta: npm start');
    console.log('   2. Abre: http://localhost:3000/api-docs');
    console.log('   3. Prueba los endpoints en Swagger UI');

  } catch (error) {
    console.error('\n❌ Error al inicializar la base de datos:');
    console.error(error.message);
    console.log('\n💡 Asegúrate de:');
    console.log('   1. Haber creado las tablas usando el SQL en supabase/schema.sql');
    console.log('   2. Tener permisos de administrador en Supabase');
  }
}

initDatabase();
