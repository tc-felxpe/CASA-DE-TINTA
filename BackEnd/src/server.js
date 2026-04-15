require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { inicializarLibros, isSupabaseConfigured } = require('./config/supabase');

const librosRoutes = require('./routes/librosRoutes');
const authRoutes = require('./routes/authRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const detalleOrdenesRoutes = require('./routes/detalleOrdenesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { font-size: 32px !important; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; }
  `,
  customSiteTitle: 'API Librería - Documentación Swagger',
  customfavIcon: '/favicon.ico'
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de la Librería Online',
    version: '1.0.0',
    descripcion: 'Sistema completo de gestión de librería con Supabase',
    documentacion: '/api-docs',
    endpoints: {
      libros: '/api/libros',
      autenticacion: '/api/auth',
      ordenes: '/api/ordenes',
      detalleOrdenes: '/api/detalle-ordenes'
    },
    supabase: {
      configurado: isSupabaseConfigured(),
      modo: isSupabaseConfigured() ? 'Supabase (PostgreSQL)' : 'Memoria local (desarrollo)'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    supabase: isSupabaseConfigured() ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/libros', librosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/detalle-ordenes', detalleOrdenesRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    error: `La ruta ${req.method} ${req.originalUrl} no existe`
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

inicializarLibros();

app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                           ║');
  console.log('║   🚀  API Librería Online iniciada                                        ║');
  console.log('║                                                                           ║');
  console.log(`║   📖  Documentación Swagger:  http://localhost:${PORT}/api-docs                  ║`);
  console.log(`║   🏠  Página de inicio:       http://localhost:${PORT}                            ║`);
  console.log(`║   ❤️   Estado de salud:         http://localhost:${PORT}/health                     ║`);
  console.log('║                                                                           ║');
  if (isSupabaseConfigured()) {
    console.log('║   🗄️   Base de datos:           Supabase (PostgreSQL)                          ║');
  } else {
    console.log('║   🗄️   Base de datos:           Memoria local (modo desarrollo)                ║');
  }
  console.log('║                                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
