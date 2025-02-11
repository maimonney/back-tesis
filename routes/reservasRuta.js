const express = require('express');
const router = express.Router();

const {
    crearReserva,
    obtenerReservaId,
    borrarReserva,
    actualizarReserva,
} = require('../controllers/reservasControlador');

router.get('/:id', obtenerReservaId);
router.post('/', crearReserva);
router.delete('/:id', borrarReserva);
router.put('/:id', actualizarReserva);

module.exports = router;