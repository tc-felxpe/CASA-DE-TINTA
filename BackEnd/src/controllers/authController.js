const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin, isSupabaseConfigured } = require('../config/supabase');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos',
        error: 'El nombre, email y password son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña muy corta',
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (isSupabaseConfigured() && supabaseAdmin) {
      const { data: usuarioExistente, error: errorBusqueda } = await supabaseAdmin
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();

      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: 'Usuario ya existe',
          error: 'Ya existe un usuario registrado con este email'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const { data: nuevoUsuario, error: errorCreacion } = await supabaseAdmin
        .from('usuarios')
        .insert({
          nombre,
          email,
          password_hash: passwordHash
        })
        .select()
        .single();

      if (errorCreacion) throw errorCreacion;

      const token = jwt.sign(
        { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol || 'usuario' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const usuarioSinPassword = {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        fecha_registro: nuevoUsuario.fecha_registro
      };

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          token,
          usuario: usuarioSinPassword
        }
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase para registrar usuarios'
      });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario',
      error: error.message
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos',
        error: 'El email y password son obligatorios'
      });
    }

    if (isSupabaseConfigured() && supabaseAdmin) {
      const { data: usuario, error } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
          error: 'El email o contraseña son incorrectos'
        });
      }

      const passwordValido = await bcrypt.compare(password, usuario.password_hash);
      if (!passwordValido) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
          error: 'El email o contraseña son incorrectos'
        });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol || 'usuario' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const usuarioSinPassword = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        fecha_registro: usuario.fecha_registro
      };

      return res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          usuario: usuarioSinPassword
        }
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase para iniciar sesión'
      });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    if (isSupabaseConfigured()) {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, fecha_registro')
        .eq('id', usuarioId)
        .single();

      if (error || !usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          error: 'No se encontró el usuario'
        });
      }

      return res.json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: usuario
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: error.message
    });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombre } = req.body;

    if (isSupabaseConfigured()) {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .update({ nombre })
        .eq('id', usuarioId)
        .select('id, nombre, email, fecha_registro')
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: usuario
      });
    } else {
      return res.status(501).json({
        success: false,
        message: 'Función no disponible',
        error: 'Configure Supabase'
      });
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil
};
