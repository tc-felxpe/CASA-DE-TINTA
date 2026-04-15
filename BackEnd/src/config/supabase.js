const { createClient } = require('@supabase/supabase-js');
const { inicializarLibros: initLibros } = require('../data/database');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️  Error: Variables de Supabase no configuradas');
  console.error('   Asegúrate de configurar SUPABASE_URL y SUPABASE_ANON_KEY en el archivo .env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
            supabaseUrl !== 'https://your-project-id.supabase.co' &&
            supabaseUrl.includes('supabase.co'));
};

module.exports = {
  supabase,
  supabaseAdmin,
  isSupabaseConfigured,
  inicializarLibros: initLibros
};
