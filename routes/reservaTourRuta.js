const express = require('express');
const router = express.Router();


const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
    obtenerReservasPorGuia,
    obtenerReservasPorProvincia,
} = require('../controllers/reservasTourControlador');

router.post('/tours', crearReservaTur);
router.get('/tours', obtenerReservasTur);
router.get('/tours/:id', obtenerReservaTurPorId);
router.put('/tours/:id/cancelar', cancelarReservaTur);

// Obtiene reservas de tours por guía, provincia
router.get('/tours/guia/:guiaId', obtenerReservasPorGuia);
router.get('/tours/provincia', obtenerReservasPorProvincia);

module.exports = router;