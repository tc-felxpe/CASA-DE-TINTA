const { createClient } = require('@supabase/supabase-js');
const { inicializarLibros: initLibros } = require('../data/database');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
            supabaseUrl !== 'https://your-project-id.supabase.co' &&
            supabaseUrl.includes('supabase.co'));
};

let supabase = null;
let supabaseAdmin = null;

if (isSupabaseConfigured()) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
} else {
  console.log('⚠️  Supabase no configurado. Usando modo memoria.');
}

module.exports = {
  supabase,
  supabaseAdmin,
  isSupabaseConfigured,
  inicializarLibros: initLibros
};
