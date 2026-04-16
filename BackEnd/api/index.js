require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { inicializarLibros, isSupabaseConfigured } = require('../src/config/supabase');

const librosRoutes = require('../src/routes/librosRoutes');
const authRoutes = require('../src/routes/authRoutes');
const ordenesRoutes = require('../src/routes/ordenesRoutes');
const detalleOrdenesRoutes = require('../src/routes/detalleOrdenesRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de la Librería Online',
    version: '1.0.0',
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
    supabase: isSupabaseConfigured() ? 'connected' : 'disconnected'
  });
});

app.use('/api/libros', librosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/detalle-ordenes', detalleOrdenesRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

inicializarLibros();

module.exports = app;
