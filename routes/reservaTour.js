const express = require('express');
const router = express.Router();
const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
} = require('../controllers/reservaTurControlador');

router.post('/', crearReservaTur);
router.get('/', obtenerReservasTur);
router.get('/:id', obtenerReservaTurPorId);
router.put('/:id/cancelar', cancelarReservaTur);

module.exports = router;