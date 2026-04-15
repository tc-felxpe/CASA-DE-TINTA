const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { db, buscarLibroPorId: buscarLibroMemoria } = require('../data/database');

const obtenerLibros = async (req, res) => {
  try {
    const { query, autor, categoria, minPrecio, maxPrecio, page = 1, limit = 24 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 24;
    const startIndex = (pageNum - 1) * limitNum;

    if (isSupabaseConfigured()) {
      let supabaseQuery = supabase
        .from('libros')
        .select('*', { count: 'exact' })
        .range(startIndex, startIndex + limitNum - 1);

      if (query) {
        const busqueda = `%${query}%`;
        supabaseQuery = supabaseQuery.or(`titulo.ilike.${busqueda},autor.ilike.${busqueda},sinopsis.ilike.${busqueda}`);
      }

      if (autor) {
        supabaseQuery = supabaseQuery.ilike('autor', `%${autor}%`);
      }

      if (categoria) {
        supabaseQuery = supabaseQuery.ilike('categoria', `%${categoria}%`);
      }

      if (minPrecio) {
        supabaseQuery = supabaseQuery.gte('precio', parseFloat(minPrecio));
      }

      if (maxPrecio) {
        supabaseQuery = supabaseQuery.lte('precio', parseFloat(maxPrecio));
      }

      const { data: libros, error, count } = await supabaseQuery;

      if (error) throw error;

      return res.json({
        success: true,
        message: 'Libros obtenidos exitosamente',
        data: {
          libros: libros || [],
          pagination: {
            total: count || 0,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil((count || 0) / limitNum)
          }
        }
      });
    } else {
      let libros = [...db.libros];

      if (query) {
        const busqueda = query.toLowerCase();
        libros = libros.filter(libro =>
          libro.titulo.toLowerCase().includes(busqueda) ||
          libro.autor.toLowerCase().includes(busqueda) ||
          libro.sinopsis.toLowerCase().includes(busqueda)
        );
      }

      if (autor) {
        libros = libros.filter(libro =>
          libro.autor.toLowerCase().includes(autor.toLowerCase())
        );
      }

      if (categoria) {
        libros = libros.filter(libro =>
          libro.categoria.toLowerCase().includes(categoria.toLowerCase())
        );
      }

      if (minPrecio) {
        libros = libros.filter(libro => libro.precio >= parseFloat(minPrecio));
      }

      if (maxPrecio) {
        libros = libros.filter(libro => libro.precio <= parseFloat(maxPrecio));
      }

      const librosPaginados = libros.slice(startIndex, startIndex + limitNum);
      const totalPages = Math.ceil(libros.length / limitNum);

      return res.json({
        success: true,
        message: 'Libros obtenidos exitosamente (modo memoria)',
        data: {
          libros: librosPaginados,
          pagination: {
            total: libros.length,
            page: pageNum,
            limit: limitNum,
            totalPages
          }
        }
      });
    }
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los libros',
      error: error.message
    });
  }
};

const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const { data: libro, error } = await supabase
        .from('libros')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !libro) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado',
          error: `No existe un libro con el ID: ${id}`
        });
      }

      return res.json({
        success: true,
        message: 'Libro obtenido exitosamente',
        data: libro
      });
    } else {
      const libro = buscarLibroMemoria(id);

      if (!libro) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado',
          error: `No existe un libro con el ID: ${id}`
        });
      }

      return res.json({
        success: true,
        message: 'Libro obtenido exitosamente',
        data: libro
      });
    }
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el libro',
      error: error.message
    });
  }
};

const crearLibro = async (req, res) => {
  try {
    const { titulo, autor, sinopsis, precio, imagen, imagen_url, stock } = req.body;

    if (!titulo || !autor || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos',
        error: 'El título, autor y precio son obligatorios'
      });
    }

    const imagenFinal = imagen || imagen_url;

    if (isSupabaseConfigured()) {
      const { data: libro, error } = await supabase
        .from('libros')
        .insert({
          titulo,
          autor,
          sinopsis: sinopsis || null,
          precio,
          imagen_url: imagenFinal || null,
          stock: stock || 0
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Libro creado exitosamente',
        data: libro
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase para crear libros'
      });
    }
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el libro',
      error: error.message
    });
  }
};

const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, sinopsis, precio, imagen_url, stock } = req.body;

    if (isSupabaseConfigured()) {
      const updates = {};
      if (titulo !== undefined) updates.titulo = titulo;
      if (autor !== undefined) updates.autor = autor;
      if (sinopsis !== undefined) updates.sinopsis = sinopsis;
      if (precio !== undefined) updates.precio = precio;
      if (imagen_url !== undefined) updates.imagen_url = imagen_url;
      if (stock !== undefined) updates.stock = stock;

      const { data: libro, error } = await supabase
        .from('libros')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!libro) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado',
          error: `No existe un libro con el ID: ${id}`
        });
      }

      return res.json({
        success: true,
        message: 'Libro actualizado exitosamente',
        data: libro
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase para actualizar libros'
      });
    }
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el libro',
      error: error.message
    });
  }
};

const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('libros')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.json({
        success: true,
        message: 'Libro eliminado exitosamente',
        data: { id }
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase para eliminar libros'
      });
    }
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el libro',
      error: error.message
    });
  }
};

module.exports = {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro
};
