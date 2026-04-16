require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { inicializarLibros, isSupabaseConfigured } = require('./config/supabase');

const librosRoutes = require('./routes/librosRoutes');
const authRoutes = require('./routes/authRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const detalleOrdenesRoutes = require('./routes/detalleOrdenesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger solo en local, no en Vercel
if (process.env.VERCEL !== '1') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de la Librería Online',
    version: '1.0.0',
    descripcion: 'Sistema completo de gestión de librería',
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
  console.error('Error:', err.stack || err.message || err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? (err.message || 'Error desconocido') : 'Algo salió mal'
  });
});

inicializarLibros();

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
