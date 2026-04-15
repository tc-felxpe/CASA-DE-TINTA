const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Librería Online',
      version: '1.0.0',
      description: 'API REST completa para el sistema de librería online con Supabase (PostgreSQL). Incluye gestión de libros, usuarios, autenticación JWT y órdenes de compra.',
      contact: {
        name: 'API Support',
        email: 'soporte@libreria.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    tags: [
      {
        name: 'Libros',
        description: 'Endpoints para la gestión del catálogo de libros (CRUD)'
      },
      {
        name: 'Autenticación',
        description: 'Endpoints para registro, login y gestión de perfil de usuarios'
      },
      {
        name: 'Órdenes',
        description: 'Endpoints para la gestión de órdenes de compra'
      },
      {
        name: 'Detalle de Órdenes',
        description: 'Endpoints para gestionar los items de cada orden (carrito de compras)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido al iniciar sesión'
        }
      },
      schemas: {
        Libro: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único del libro' },
            titulo: { type: 'string', description: 'Título del libro' },
            autor: { type: 'string', description: 'Autor del libro' },
            descripcion: { type: 'string', description: 'Descripción del libro' },
            precio: { type: 'number', format: 'decimal', description: 'Precio del libro' },
            imagen: { type: 'string', format: 'uri', description: 'URL de la imagen del libro' },
            categoria: { type: 'string', description: 'Categoría del libro' },
            stock: { type: 'integer', description: 'Cantidad disponible en inventario' },
            isbn: { type: 'string', description: 'ISBN del libro' },
            editorial: { type: 'string', description: 'Editorial del libro' },
            anio_publicacion: { type: 'integer', description: 'Año de publicación' },
            paginas: { type: 'integer', description: 'Número de páginas' },
            rating: { type: 'number', format: 'decimal', description: 'Calificación promedio (0-5)' },
            vendidos: { type: 'integer', description: 'Cantidad de ventas' },
            destacado: { type: 'boolean', description: 'Si está marcado como destacado' },
            activo: { type: 'boolean', description: 'Si está activo en el catálogo' },
            fecha_creacion: { type: 'string', format: 'date-time' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único del usuario' },
            nombre: { type: 'string', description: 'Nombre completo' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            telefono: { type: 'string', description: 'Número de teléfono' },
            direccion: { type: 'string', description: 'Dirección de envío' },
            rol: { type: 'string', enum: ['usuario', 'admin'], description: 'Rol del usuario' },
            fecha_registro: { type: 'string', format: 'date-time' }
          }
        },
        Orden: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID único de la orden' },
            usuario_id: { type: 'string', format: 'uuid', description: 'ID del usuario' },
            total: { type: 'number', description: 'Monto total de la orden' },
            estado: { type: 'string', enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'] },
            direccion_envio: { type: 'string', description: 'Dirección de envío' },
            metodo_pago: { type: 'string', enum: ['tarjeta', 'paypal', 'transferencia'] },
            notas: { type: 'string', description: 'Notas adicionales' },
            detalle_ordenes: {
              type: 'array',
              items: { $ref: '#/components/schemas/DetalleOrden' }
            },
            fecha_creacion: { type: 'string', format: 'date-time' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        },
        DetalleOrden: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            orden_id: { type: 'string', format: 'uuid' },
            libro_id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            autor: { type: 'string' },
            cantidad: { type: 'integer' },
            precio_unitario: { type: 'number' },
            subtotal: { type: 'number' }
          }
        },
        CarritoItem: {
          type: 'object',
          required: ['libroId', 'cantidad'],
          properties: {
            libroId: { type: 'string', format: 'uuid', description: 'ID del libro' },
            cantidad: { type: 'integer', minimum: 1, description: 'Cantidad a comprar' }
          }
        },
        RegistroRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: { type: 'string', minLength: 2, description: 'Nombre completo' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password', minLength: 6 },
            telefono: { type: 'string' },
            direccion: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                usuario: { $ref: '#/components/schemas/Usuario' }
              }
            }
          }
        },
        CrearOrdenRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CarritoItem' },
              minItems: 1
            },
            direccionEnvio: { type: 'string' },
            metodoPago: { type: 'string', enum: ['tarjeta', 'paypal', 'transferencia'] },
            notas: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    totalPages: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    },
    paths: {
      '/api/libros': {
        get: {
          tags: ['Libros'],
          summary: 'Obtener lista de libros',
          description: 'Devuelve todos los libros activos. Soporta búsqueda, filtros y paginación.',
          operationId: 'getLibros',
          parameters: [
            { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Búsqueda en título, autor o descripción' },
            { name: 'categoria', in: 'query', schema: { type: 'string' } },
            { name: 'autor', in: 'query', schema: { type: 'string' } },
            { name: 'minPrecio', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrecio', in: 'query', schema: { type: 'number' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 24 } }
          ],
          responses: {
            '200': {
              description: 'Lista de libros',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/PaginatedResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              libros: { type: 'array', items: { $ref: '#/components/schemas/Libro' } }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Libros'],
          summary: 'Crear nuevo libro',
          description: 'Crea un nuevo libro en el catálogo. Requiere autenticación de administrador.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['titulo', 'autor', 'precio'],
                  properties: {
                    titulo: { type: 'string' },
                    autor: { type: 'string' },
                    descripcion: { type: 'string' },
                    precio: { type: 'number' },
                    imagen: { type: 'string' },
                    categoria: { type: 'string' },
                    stock: { type: 'integer' },
                    isbn: { type: 'string' },
                    editorial: { type: 'string' },
                    anio_publicacion: { type: 'integer' },
                    paginas: { type: 'integer' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Libro creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } } },
            '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'No autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Acceso denegado (no es admin)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/libros/{id}': {
        get: {
          tags: ['Libros'],
          summary: 'Obtener libro por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Libro encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } } },
            '404': { description: 'Libro no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        put: {
          tags: ['Libros'],
          summary: 'Actualizar libro',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Libro' } } } },
          responses: {
            '200': { description: 'Libro actualizado' },
            '403': { description: 'Acceso denegado' }
          }
        },
        delete: {
          tags: ['Libros'],
          summary: 'Eliminar libro (soft delete)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Libro eliminado' },
            '403': { description: 'Acceso denegado' }
          }
        }
      },
      '/api/auth/registro': {
        post: {
          tags: ['Autenticación'],
          summary: 'Registrar nuevo usuario',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegistroRequest' } } } },
          responses: {
            '201': { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '400': { description: 'Datos inválidos o usuario existe' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
          responses: {
            '200': { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '401': { description: 'Credenciales inválidas' }
          }
        }
      },
      '/api/auth/perfil': {
        get: {
          tags: ['Autenticación'],
          summary: 'Obtener perfil del usuario',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Perfil obtenido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
            '401': { description: 'No autorizado' }
          }
        },
        put: {
          tags: ['Autenticación'],
          summary: 'Actualizar perfil',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { nombre: { type: 'string' }, telefono: { type: 'string' }, direccion: { type: 'string' } } }
              }
            }
          },
          responses: {
            '200': { description: 'Perfil actualizado' },
            '401': { description: 'No autorizado' }
          }
        }
      },
      '/api/ordenes': {
        post: {
          tags: ['Órdenes'],
          summary: 'Crear nueva orden',
          description: 'Crea una orden, verifica stock, descuenta inventario y genera detalles.',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CrearOrdenRequest' } } } },
          responses: {
            '201': { description: 'Orden creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Orden' } } } },
            '400': { description: 'Stock insuficiente o carrito vacío' },
            '401': { description: 'No autorizado' }
          }
        }
      },
      '/api/ordenes/mis-ordenes': {
        get: {
          tags: ['Órdenes'],
          summary: 'Obtener historial de compras',
          description: 'Devuelve todas las órdenes del usuario autenticado.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'estado', in: 'query', schema: { type: 'string', enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'] } }
          ],
          responses: {
            '200': { description: 'Historial obtenido' },
            '401': { description: 'No autorizado' }
          }
        }
      },
      '/api/ordenes/{id}': {
        get: {
          tags: ['Órdenes'],
          summary: 'Obtener detalle de orden',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Orden encontrada' },
            '404': { description: 'Orden no encontrada' }
          }
        }
      },
      '/api/ordenes/{id}/cancelar': {
        patch: {
          tags: ['Órdenes'],
          summary: 'Cancelar orden',
          description: 'Cancela una orden y restaura el stock. Solo órdenes pendientes o en procesamiento.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Orden cancelada' },
            '400': { description: 'No se puede cancelar' },
            '404': { description: 'Orden no encontrada' }
          }
        }
      },
      '/api/detalle-ordenes/carrito': {
        get: {
          tags: ['Detalle de Órdenes'],
          summary: 'Obtener carrito de compras',
          description: 'Devuelve todas las órdenes pendientes del usuario (carrito de compras).',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Carrito obtenido' },
            '401': { description: 'No autorizado' }
          }
        }
      },
      '/api/detalle-ordenes/{ordenId}': {
        get: {
          tags: ['Detalle de Órdenes'],
          summary: 'Obtener detalles de una orden',
          description: 'Devuelve todos los libros de una orden específica.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'ordenId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Detalles obtenidos' },
            '403': { description: 'Acceso denegado' },
            '404': { description: 'Orden no encontrada' }
          }
        }
      },
      '/api/detalle-ordenes/{ordenId}': {
        post: {
          tags: ['Detalle de Órdenes'],
          summary: 'Agregar libro a la orden',
          description: 'Agrega un libro a una orden existente (carrito). Verifica stock automáticamente.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'ordenId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['libro_id', 'cantidad'],
                  properties: {
                    libro_id: { type: 'string', format: 'uuid', description: 'ID del libro' },
                    cantidad: { type: 'integer', minimum: 1, description: 'Cantidad a agregar' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Libro agregado al carrito' },
            '400': { description: 'Stock insuficiente' },
            '403': { description: 'Acceso denegado' },
            '404': { description: 'Libro u orden no encontrada' }
          }
        }
      },
      '/api/detalle-ordenes/{ordenId}/{detalleId}': {
        put: {
          tags: ['Detalle de Órdenes'],
          summary: 'Actualizar cantidad de un item',
          description: 'Modifica la cantidad de un libro en la orden. Verifica stock.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'ordenId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
            { name: 'detalleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['cantidad'],
                  properties: {
                    cantidad: { type: 'integer', minimum: 1, description: 'Nueva cantidad' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Cantidad actualizada' },
            '400': { description: 'Stock insuficiente' },
            '404': { description: 'Detalle no encontrado' }
          }
        }
      },
      '/api/detalle-ordenes/{ordenId}/{detalleId}': {
        delete: {
          tags: ['Detalle de Órdenes'],
          summary: 'Eliminar item de la orden',
          description: 'Elimina un libro de la orden y recalcula el total.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'ordenId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
            { name: 'detalleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
          ],
          responses: {
            '200': { description: 'Item eliminado' },
            '403': { description: 'No se puede modificar' },
            '404': { description: 'Detalle no encontrado' }
          }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
