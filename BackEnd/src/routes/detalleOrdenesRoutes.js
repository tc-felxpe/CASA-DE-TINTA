const express = require('express');
const {
  obtenerDetallesPorOrden,
  agregarDetalleOrden,
  actualizarDetalleOrden,
  eliminarDetalleOrden,
  obtenerResumenCarrito
} = require('../controllers/detalleOrdenesController');
const { autenticarToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/carrito', autenticarToken, obtenerResumenCarrito);
router.get('/:ordenId', autenticarToken, obtenerDetallesPorOrden);
router.post('/:ordenId', autenticarToken, agregarDetalleOrden);
router.put('/:ordenId/:detalleId', autenticarToken, actualizarDetalleOrden);
router.delete('/:ordenId/:detalleId', autenticarToken, eliminarDetalleOrden);

module.exports = router;
