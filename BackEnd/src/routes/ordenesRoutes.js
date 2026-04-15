const express = require('express');
const { crearNuevaOrden, obtenerMisOrdenes, obtenerOrdenPorId, cancelarOrden } = require('../controllers/ordenesController');
const { autenticarToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', autenticarToken, crearNuevaOrden);
router.get('/mis-ordenes', autenticarToken, obtenerMisOrdenes);
router.get('/:id', autenticarToken, obtenerOrdenPorId);
router.patch('/:id/cancelar', autenticarToken, cancelarOrden);

module.exports = router;
