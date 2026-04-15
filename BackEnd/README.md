# Backend API - Librería Online

API REST completa para el sistema de librería online con **Supabase** (PostgreSQL) y documentación **Swagger**.

## Características

- **Gestión de Libros**: CRUD completo con búsqueda y filtros
- **Autenticación**: Registro, login y gestión de usuarios con JWT
- **Órdenes de Compra**: Carrito, verificación de stock, historial
- **Base de Datos**: Supabase (PostgreSQL) con Row Level Security
- **Documentación**: Swagger UI interactivo

## Requisitos

- Node.js v18+
- npm o yarn
- Cuenta de Supabase (gratuita en https://supabase.com)

## Instalación

```bash
cd BackEnd
npm install
```

## Configuración de Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de Supabase:

```env
# Puerto del servidor
PORT=3000
NODE_ENV=development

# JWT (genera una clave segura)
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
JWT_EXPIRES_IN=24h

# Supabase (OBLIGATORIO para producción)
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-publica
SUPABASE_SERVICE_KEY=tu-service-role-key-secreta
```

### ¿Dónde encontrar las credenciales de Supabase?

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta/proyecto
2. Ve a **Project Settings > API**
3. Copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_KEY`

⚠️ **IMPORTANTE**: La `SUPABASE_SERVICE_KEY` es secreta, **nunca** la compartas ni la expongas al cliente.

## Configuración de la Base de Datos

### Opción 1: Ejecutar SQL manualmente (Recomendado)

1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `supabase/schema.sql`
4. Ejecuta el script

### Opción 2: Usar el script de inicialización

```bash
npm run db:init
```

## Uso

### Iniciar el servidor en desarrollo
```bash
npm run dev
```

### Iniciar el servidor en producción
```bash
npm start
```

### Inicializar base de datos
```bash
npm run db:init
```

## Estructura del Proyecto

```
BackEnd/
├── src/
│   ├── config/
│   │   ├── supabase.js      # Cliente de Supabase
│   │   └── swagger.js        # Documentación OpenAPI
│   ├── controllers/
│   │   ├── authController.js        # Auth (registro, login, perfil)
│   │   ├── librosController.js      # CRUD libros
│   │   ├── ordenesController.js     # Órdenes
│   │   └── detalleOrdenesController.js # Detalle de órdenes
│   ├── database/
│   │   └── initDb.js        # Script de inicialización
│   ├── data/
│   │   └── database.js      # Base de datos en memoria (fallback)
│   ├── middleware/
│   │   └── authMiddleware.js # JWT y roles
│   ├── routes/
│   │   ├── authRoutes.js          # Rutas de autenticación
│   │   ├── librosRoutes.js        # Rutas de libros
│   │   ├── ordenesRoutes.js        # Rutas de órdenes
│   │   └── detalleOrdenesRoutes.js # Rutas de detalle de órdenes
│   └── server.js            # Punto de entrada
├── supabase/
│   ├── schema.sql           # Esquema de BD completo
│   └── functions.sql        # Funciones SQL adicionales
├── .env                     # Variables de entorno (no commitear)
├── .env.example             # Template de variables
└── package.json
```

## Endpoints API

### Libros

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/libros` | Lista de libros (con filtros) | No |
| GET | `/api/libros/:id` | Detalle de libro | No |
| POST | `/api/libros` | Crear libro | Admin |
| PUT | `/api/libros/:id` | Actualizar libro | Admin |
| DELETE | `/api/libros/:id` | Eliminar libro (soft delete) | Admin |

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/registro` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/perfil` | Obtener perfil | Sí |
| PUT | `/api/auth/perfil` | Actualizar perfil | Sí |

### Órdenes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/ordenes` | Crear orden | Sí |
| GET | `/api/ordenes/mis-ordenes` | Historial de compras | Sí |
| GET | `/api/ordenes/:id` | Detalle de orden | Sí |
| PATCH | `/api/ordenes/:id/cancelar` | Cancelar orden | Sí |

### Detalle de Órdenes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/detalle-ordenes/carrito` | Obtener carrito de compras | Sí |
| GET | `/api/detalle-ordenes/:ordenId` | Ver libros de una orden | Sí |
| POST | `/api/detalle-ordenes/:ordenId` | Agregar libro a la orden | Sí |
| PUT | `/api/detalle-ordenes/:ordenId/:detalleId` | Actualizar cantidad | Sí |
| DELETE | `/api/detalle-ordenes/:ordenId/:detalleId` | Eliminar libro de orden | Sí |

## Documentación API

Accede a Swagger UI: **http://localhost:3000/api-docs**

## Ejemplos con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "123456",
    "telefono": "+1234567890",
    "direccion": "Calle Principal 123"
  }'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "123456"
  }'
```

### Crear orden (con JWT)
```bash
curl -X POST http://localhost:3000/api/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "items": [
      {"libroId": "uuid-del-libro-1", "cantidad": 2},
      {"libroId": "uuid-del-libro-2", "cantidad": 1}
    ],
    "direccionEnvio": "Calle Secundaria 456",
    "metodoPago": "tarjeta"
  }'
```

### Buscar libros
```bash
curl "http://localhost:3000/api/libros?query=harry&categoria=Fantasía&minPrecio=10&maxPrecio=30"
```

## Modo de Desarrollo (sin Supabase)

Si no configuras Supabase, la API funcionará en **modo memoria** usando datos locales de prueba.

```bash
# No configures .env y la API usará datos de prueba en memoria
npm start
```

## Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Row Level Security (RLS) en Supabase
- Validación de inputs
- Rate limiting recomendado para producción

## Licencia

ISC
