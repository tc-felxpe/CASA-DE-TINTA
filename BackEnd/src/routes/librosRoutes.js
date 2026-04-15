const express = require('express');
const { obtenerLibros, obtenerLibroPorId, crearLibro, actualizarLibro, eliminarLibro } = require('../controllers/librosController');
const { autenticarToken, esAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', obtenerLibros);
router.get('/:id', obtenerLibroPorId);

router.post('/', autenticarToken, esAdmin, crearLibro);
router.put('/:id', autenticarToken, esAdmin, actualizarLibro);
router.delete('/:id', autenticarToken, esAdmin, eliminarLibro);

module.exports = router;
