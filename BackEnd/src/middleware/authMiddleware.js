const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido',
      error: 'No se proporcionó un token de autenticación'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido',
      error: 'El token de autenticación no es válido o ha expirado'
    });
  }
};

const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado',
      error: 'Se requiere rol de administrador'
    });
  }
};

module.exports = {
  autenticarToken,
  esAdmin
};
