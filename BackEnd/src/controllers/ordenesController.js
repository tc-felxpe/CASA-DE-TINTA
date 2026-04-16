const { v4: uuidv4 } = require('uuid');
const { supabase, supabaseAdmin, isSupabaseConfigured } = require('../config/supabase');
const { db, buscarLibroPorId, actualizarStockLibro, buscarOrdenesPorUsuario, getOrdenPorId } = require('../data/database');

const crearNuevaOrden = async (req, res) => {
  try {
    const { libros } = req.body;
    const usuarioId = req.usuario.id;

    if (!libros || !Array.isArray(libros) || libros.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Carrito vacío',
        error: 'Debe incluir al menos un libro en la orden'
      });
    }

    if (isSupabaseConfigured() && supabaseAdmin) {
      const libroIds = libros.map(libro => libro.id);
      const { data: librosDb, error: errorLibros } = await supabase
        .from('libros')
        .select('*')
        .in('id', libroIds);

      if (errorLibros) throw errorLibros;

      if (!librosDb || librosDb.length !== libros.length) {
        const librosEncontrados = librosDb ? librosDb.map(l => l.id) : [];
        const noEncontrados = libros.filter(libro => !librosEncontrados.includes(libro.id));
        return res.status(400).json({
          success: false,
          message: 'Libro no encontrado',
          error: `No existen libros con los IDs: ${noEncontrados.map(l => l.id).join(', ')}`
        });
      }

      for (const libroCarrito of libros) {
        const libro = librosDb.find(l => l.id === libroCarrito.id);
        if (!libroCarrito.cantidad || libroCarrito.cantidad < 1) {
          return res.status(400).json({
            success: false,
            message: 'Cantidad inválida',
            error: `La cantidad para "${libro.titulo}" debe ser al menos 1`
          });
        }
        if (libro.stock < libroCarrito.cantidad) {
          return res.status(400).json({
            success: false,
            message: 'Stock insuficiente',
            error: `Solo hay ${libro.stock} copias disponibles de "${libro.titulo}"`
          });
        }
      }

      let total = 0;
      const detallesOrden = [];
      for (const libroCarrito of libros) {
        const libro = librosDb.find(l => l.id === libroCarrito.id);
        const subtotal = libro.precio * libroCarrito.cantidad;
        total += subtotal;
        detallesOrden.push({
          libro_id: libro.id,
          cantidad: libroCarrito.cantidad,
          precio_unitario: libro.precio
        });
      }

      const { data: orden, error: errorOrden } = await supabaseAdmin
        .from('orden_compra')
        .insert({ usuario_id: usuarioId, total: total, estado: 'pendiente' })
        .select()
        .single();

      if (errorOrden) throw errorOrden;

      if (detallesOrden.length > 0) {
        const detallesConOrdenId = detallesOrden.map(detalle => ({ ...detalle, orden_id: orden.id }));
        const { error: errorDetalles } = await supabaseAdmin.from('detalle_orden').insert(detallesConOrdenId);
        if (errorDetalles) throw errorDetalles;

        for (const detalle of detallesOrden) {
          await supabaseAdmin
            .from('libros')
            .update({ stock: librosDb.find(l => l.id === detalle.libro_id).stock - detalle.cantidad })
            .eq('id', detalle.libro_id);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Orden creada exitosamente',
        data: { id: orden.id, usuario_id: orden.usuario_id, fecha: orden.fecha, total: orden.total, estado: orden.estado }
      });
    } else {
      // Modo memoria
      for (const libroCarrito of libros) {
        const libro = buscarLibroPorId(libroCarrito.id);
        if (!libro) {
          return res.status(400).json({
            success: false,
            message: 'Libro no encontrado',
            error: `No existe un libro con el ID: ${libroCarrito.id}`
          });
        }
        if (!libroCarrito.cantidad || libroCarrito.cantidad < 1) {
          return res.status(400).json({
            success: false,
            message: 'Cantidad inválida',
            error: `La cantidad para "${libro.titulo}" debe ser al menos 1`
          });
        }
        if (libro.stock < libroCarrito.cantidad) {
          return res.status(400).json({
            success: false,
            message: 'Stock insuficiente',
            error: `Solo hay ${libro.stock} copias disponibles de "${libro.titulo}"`
          });
        }
      }

      let total = 0;
      const detallesOrden = [];
      for (const libroCarrito of libros) {
        const libro = buscarLibroPorId(libroCarrito.id);
        const subtotal = libro.precio * libroCarrito.cantidad;
        total += subtotal;
        detallesOrden.push({
          libro_id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          cantidad: libroCarrito.cantidad,
          precio_unitario: libro.precio,
          subtotal: subtotal
        });
        actualizarStockLibro(libro.id, libroCarrito.cantidad);
      }

      const orden = {
        id: uuidv4(),
        usuario_id: usuarioId,
        total: total,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        detalle_orden: detallesOrden
      };

      db.ordenes.push(orden);

      return res.status(201).json({
        success: true,
        message: 'Orden creada exitosamente (modo memoria)',
        data: {
          id: orden.id,
          usuario_id: orden.usuario_id,
          fecha: orden.fecha_creacion,
          total: orden.total,
          estado: orden.estado
        }
      });
    }
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la orden',
      error: error.message
    });
  }
};

const obtenerMisOrdenes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    if (isSupabaseConfigured()) {
      const { data: ordenes, error } = await supabase
        .from('orden_compra')
        .select(`*, detalle_orden (*)`)
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: false });

      if (error) throw error;

      if (!ordenes || ordenes.length === 0) {
        return res.json({ success: true, message: 'No hay órdenes', data: [] });
      }

      const libroIds = [...new Set(ordenes.flatMap(o => (o.detalle_orden || []).map(d => d.libro_id)))];
      let librosMap = {};
      if (libroIds.length > 0) {
        const { data: libros } = await supabase.from('libros').select('*').in('id', libroIds);
        if (libros) libros.forEach(libro => { librosMap[libro.id] = libro; });
      }

      const ordenesFormateadas = (ordenes || []).map(orden => ({
        id: orden.id,
        usuario_id: orden.usuario_id,
        fecha_creacion: orden.fecha,
        total: orden.total,
        estado: orden.estado,
        libros: (orden.detalle_orden || []).map(d => {
          const libro = librosMap[d.libro_id] || {};
          return {
            id: d.libro_id,
            titulo: libro.titulo || d.titulo || 'Libro',
            autor: libro.autor || d.autor || '',
            imagen: libro.imagen_url || libro.imagen || '',
            cantidad: d.cantidad,
            precio: d.precio_unitario
          };
        })
      }));

      return res.json({
        success: true,
        message: 'Órdenes obtenidas exitosamente',
        data: ordenesFormateadas
      });
    } else {
      // Modo memoria
      const ordenes = buscarOrdenesPorUsuario(usuarioId);
      const ordenesFormateadas = ordenes.map(orden => ({
        id: orden.id,
        usuario_id: orden.usuario_id,
        fecha_creacion: orden.fecha_creacion,
        total: orden.total,
        estado: orden.estado,
        libros: (orden.detalle_orden || []).map(d => ({
          id: d.libro_id,
          titulo: d.titulo || 'Libro',
          autor: d.autor || '',
          imagen: buscarLibroPorId(d.libro_id)?.imagen || '',
          cantidad: d.cantidad,
          precio: d.precio_unitario
        }))
      }));

      return res.json({
        success: true,
        message: 'Órdenes obtenidas exitosamente (modo memoria)',
        data: ordenesFormateadas
      });
    }
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las órdenes',
      error: error.message
    });
  }
};

const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    if (isSupabaseConfigured()) {
      const { data: orden, error } = await supabase
        .from('orden_compra')
        .select(`*, detalle_orden (*)`)
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .single();

      if (error || !orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada',
          error: `No existe una orden con el ID: ${id}`
        });
      }

      return res.json({
        success: true,
        message: 'Orden obtenida exitosamente',
        data: {
          id: orden.id,
          usuario_id: orden.usuario_id,
          fecha_creacion: orden.fecha,
          total: orden.total,
          estado: orden.estado,
          libros: (orden.detalle_orden || []).map(d => ({
            libro_id: d.libro_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario
          }))
        }
      });
    } else {
      // Modo memoria
      const orden = getOrdenPorId(id);
      if (!orden || orden.usuario_id !== usuarioId) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada',
          error: `No existe una orden con el ID: ${id}`
        });
      }

      return res.json({
        success: true,
        message: 'Orden obtenida exitosamente (modo memoria)',
        data: {
          id: orden.id,
          usuario_id: orden.usuario_id,
          fecha_creacion: orden.fecha_creacion,
          total: orden.total,
          estado: orden.estado,
          libros: (orden.detalle_orden || []).map(d => ({
            libro_id: d.libro_id,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario
          }))
        }
      });
    }
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la orden',
      error: error.message
    });
  }
};

const cancelarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    if (isSupabaseConfigured()) {
      const { data: ordenExistente, error: errorBusqueda } = await supabase
        .from('orden_compra')
        .select('*')
        .eq('id', id)
        .eq('usuario_id', usuarioId)
        .single();

      if (errorBusqueda || !ordenExistente) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada',
          error: `No existe una orden con el ID: ${id}`
        });
      }

      if (!['pendiente', 'procesando'].includes(ordenExistente.estado)) {
        return res.status(400).json({
          success: false,
          message: 'No se puede cancelar',
          error: 'Solo se pueden cancelar órdenes pendientes o en procesamiento'
        });
      }

      const { data: detalles, error: errorDetalles } = await supabase
        .from('detalle_orden')
        .select('libro_id, cantidad')
        .eq('orden_id', id);

      if (errorDetalles) throw errorDetalles;

      const { data: orden, error } = await supabase
        .from('orden_compra')
        .update({ estado: 'cancelado' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { data: libro } = await supabase.from('libros').select('stock').eq('id', detalle.libro_id).single();
          if (libro) {
            await supabase.from('libros').update({ stock: libro.stock + detalle.cantidad }).eq('id', detalle.libro_id);
          }
        }
      }

      return res.json({ success: true, message: 'Orden cancelada exitosamente', data: orden });
    } else {
      // Modo memoria
      const orden = getOrdenPorId(id);
      if (!orden || orden.usuario_id !== usuarioId) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada',
          error: `No existe una orden con el ID: ${id}`
        });
      }

      if (!['pendiente', 'procesando'].includes(orden.estado)) {
        return res.status(400).json({
          success: false,
          message: 'No se puede cancelar',
          error: 'Solo se pueden cancelar órdenes pendientes o en procesamiento'
        });
      }

      orden.estado = 'cancelado';

      // Restaurar stock
      (orden.detalle_orden || []).forEach(detalle => {
        const libro = buscarLibroPorId(detalle.libro_id);
        if (libro) {
          libro.stock += detalle.cantidad;
        }
      });

      return res.json({
        success: true,
        message: 'Orden cancelada exitosamente (modo memoria)',
        data: orden
      });
    }
  } catch (error) {
    console.error('Error al cancelar orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la orden',
      error: error.message
    });
  }
};

module.exports = {
  crearNuevaOrden,
  obtenerMisOrdenes,
  obtenerOrdenPorId,
  cancelarOrden
};
