const express = require('express');
const { registrarUsuario, iniciarSesion, obtenerPerfil, actualizarPerfil } = require('../controllers/authController');
const { autenticarToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.get('/perfil', autenticarToken, obtenerPerfil);
router.put('/perfil', autenticarToken, actualizarPerfil);

module.exports = router;
