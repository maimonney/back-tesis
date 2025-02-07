const express = require('express');
const router = express.Router();


const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
    obtenerReservasPorGuia,
} = require('../controllers/reservasTourControlador');

router.post('/tours', crearReservaTur);
router.get('/tours', obtenerReservasTur);
router.get('/tours/:id', obtenerReservaTurPorId);
router.put('/tours/:id/cancelar', cancelarReservaTur);

// Obtiene reservas de tours por guía
router.get('/tours/guia/:guiaId', obtenerReservasPorGuia);

module.exports = router;