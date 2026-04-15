const { supabase, isSupabaseConfigured } = require('../config/supabase');

const obtenerDetallesPorOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const usuarioId = req.usuario.id;

    if (!isSupabaseConfigured()) {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }

    const { data: orden, error: errorOrden } = await supabase
      .from('orden_compra')
      .select('id, usuario_id')
      .eq('id', ordenId)
      .single();

    if (errorOrden || !orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
        error: `No existe una orden con el ID: ${ordenId}`
      });
    }

    if (orden.usuario_id !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        error: 'No tienes permiso para ver esta orden'
      });
    }

    const { data: detalles, error } = await supabase
      .from('detalle_orden')
      .select(`
        *,
        libros (
          id,
          titulo,
          autor,
          imagen,
          categoria
        )
      `)
      .eq('orden_id', ordenId)
      .order('fecha_creacion', { ascending: true });

    if (error) throw error;

    const subtotalGeneral = detalles.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const totalLibros = detalles.reduce((sum, item) => sum + item.cantidad, 0);

    res.json({
      success: true,
      message: 'Detalles obtenidos exitosamente',
      data: {
        orden_id: ordenId,
        detalles: detalles || [],
        resumen: {
          total_libros: totalLibros,
          subtotal: subtotalGeneral.toFixed(2),
          cantidad_items: detalles?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles',
      error: error.message
    });
  }
};

const agregarDetalleOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const { libro_id, cantidad } = req.body;
    const usuarioId = req.usuario.id;

    if (!libro_id || !cantidad || cantidad < 1) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos',
        error: 'libro_id y cantidad son obligatorios'
      });
    }

    if (!isSupabaseConfigured()) {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }

    const { data: orden, error: errorOrden } = await supabase
      .from('orden_compra')
      .select('id, usuario_id, estado')
      .eq('id', ordenId)
      .single();

    if (errorOrden || !orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada',
        error: `No existe una orden con el ID: ${ordenId}`
      });
    }

    if (orden.usuario_id !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        error: 'No tienes permiso para modificar esta orden'
      });
    }

    if (!['pendiente', 'procesando'].includes(orden.estado)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar',
        error: 'Solo se pueden agregar items a órdenes pendientes o en procesamiento'
      });
    }

    const { data: libro, error: errorLibro } = await supabase
      .from('libros')
      .select('*')
      .eq('id', libro_id)
      .eq('activo', true)
      .single();

    if (errorLibro || !libro) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado',
        error: `No existe un libro con el ID: ${libro_id}`
      });
    }

    if (libro.stock < cantidad) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        error: `Solo hay ${libro.stock} copias disponibles`
      });
    }

    const { data: detalleExistente } = await supabase
      .from('detalle_orden')
      .select('id, cantidad, precio_unitario')
      .eq('orden_id', ordenId)
      .eq('libro_id', libro_id)
      .single();

    if (detalleExistente) {
      const nuevaCantidad = detalleExistente.cantidad + cantidad;
      if (nuevaCantidad > libro.stock + detalleExistente.cantidad) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuficiente',
          error: `Stock máximo disponible: ${libro.stock + detalleExistente.cantidad}`
        });
      }

      const { data: detalle, error } = await supabase
        .from('detalle_orden')
        .update({
          cantidad: nuevaCantidad,
          subtotal: (nuevaCantidad * detalleExistente.precio_unitario).toFixed(2)
        })
        .eq('id', detalleExistente.id)
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('actualizar_total_orden', { orden_id: ordenId });

      return res.json({
        success: true,
        message: 'Cantidad actualizada en el carrito',
        data: detalle
      });
    }

    const subtotal = libro.precio * cantidad;

    const { data: detalle, error } = await supabase
      .from('detalle_orden')
      .insert({
        orden_id: ordenId,
        libro_id: libro_id,
        titulo: libro.titulo,
        autor: libro.autor,
        cantidad: cantidad,
        precio_unitario: libro.precio,
        subtotal: subtotal.toFixed(2)
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc('actualizar_total_orden', { orden_id: ordenId });

    res.status(201).json({
      success: true,
      message: 'Item agregado al carrito',
      data: detalle
    });
  } catch (error) {
    console.error('Error al agregar detalle:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar el item',
      error: error.message
    });
  }
};

const actualizarDetalleOrden = async (req, res) => {
  try {
    const { ordenId, detalleId } = req.params;
    const { cantidad } = req.body;
    const usuarioId = req.usuario.id;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad inválida',
        error: 'La cantidad debe ser al menos 1'
      });
    }

    if (!isSupabaseConfigured()) {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }

    const { data: orden, error: errorOrden } = await supabase
      .from('orden_compra')
      .select('id, usuario_id, estado')
      .eq('id', ordenId)
      .single();

    if (errorOrden || !orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (orden.usuario_id !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    if (!['pendiente', 'procesando'].includes(orden.estado)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar',
        error: 'Solo se pueden modificar órdenes pendientes o en procesamiento'
      });
    }

    const { data: detalle, error: errorDetalle } = await supabase
      .from('detalle_orden')
      .select('*, libros!inner(stock)')
      .eq('id', detalleId)
      .eq('orden_id', ordenId)
      .single();

    if (errorDetalle || !detalle) {
      return res.status(404).json({
        success: false,
        message: 'Detalle no encontrado'
      });
    }

    const stockDisponible = detalle.libros?.stock + detalle.cantidad;
    if (cantidad > stockDisponible) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        error: `Stock máximo disponible: ${stockDisponible}`
      });
    }

    const subtotal = detalle.precio_unitario * cantidad;

    const { data: detalleActualizado, error } = await supabase
      .from('detalle_orden')
      .update({
        cantidad: cantidad,
        subtotal: subtotal.toFixed(2)
      })
      .eq('id', detalleId)
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc('actualizar_total_orden', { orden_id: ordenId });

    res.json({
      success: true,
      message: 'Cantidad actualizada',
      data: detalleActualizado
    });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar',
      error: error.message
    });
  }
};

const eliminarDetalleOrden = async (req, res) => {
  try {
    const { ordenId, detalleId } = req.params;
    const usuarioId = req.usuario.id;

    if (!isSupabaseConfigured()) {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }

    const { data: orden, error: errorOrden } = await supabase
      .from('orden_compra')
      .select('id, usuario_id, estado')
      .eq('id', ordenId)
      .single();

    if (errorOrden || !orden) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (orden.usuario_id !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    if (!['pendiente', 'procesando'].includes(orden.estado)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar',
        error: 'Solo se pueden modificar órdenes pendientes o en procesamiento'
      });
    }

    const { error } = await supabase
      .from('detalle_orden')
      .delete()
      .eq('id', detalleId)
      .eq('orden_id', ordenId);

    if (error) throw error;

    await supabase.rpc('actualizar_total_orden', { orden_id: ordenId });

    res.json({
      success: true,
      message: 'Item eliminado del carrito',
      data: { id: detalleId }
    });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar',
      error: error.message
    });
  }
};

const obtenerResumenCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    if (!isSupabaseConfigured()) {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }

    const { data: ordenesPendientes, error } = await supabase
      .from('orden_compra')
      .select(`
        *,
        detalle_orden (
          *,
          libros (
            titulo,
            imagen,
            precio
          )
        )
      `)
      .eq('usuario_id', usuarioId)
      .eq('estado', 'pendiente')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const carrito = ordenesPendientes.map(orden => ({
      orden_id: orden.id,
      items: orden.detalle_orden,
      total: orden.total,
      cantidad_items: orden.detalle_orden.reduce((sum, item) => sum + item.cantidad, 0),
      fecha_creacion: orden.fecha_creacion
    }));

    res.json({
      success: true,
      message: 'Carrito obtenido',
      data: {
        carrito,
        total_general: carrito.reduce((sum, c) => sum + parseFloat(c.total), 0),
        cantidad_ordenes: carrito.length
      }
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el carrito',
      error: error.message
    });
  }
};

module.exports = {
  obtenerDetallesPorOrden,
  agregarDetalleOrden,
  actualizarDetalleOrden,
  eliminarDetalleOrden,
  obtenerResumenCarrito
};
