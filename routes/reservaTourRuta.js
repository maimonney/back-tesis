const express = require('express');
const router = express.Router();


const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
    obtenerReservasPorGuia,
} = require('../controllers/reservasTourControlador');

// Crear una reserva de tour
router.post('/tours', crearReservaTur);

// Obtener todas las reservas de tours
router.get('/tours', obtenerReservasTur);

// Obtener una reserva de tour por su ID
router.get('/tours/:id', obtenerReservaTurPorId);

// Cancelar una reserva de tour
router.put('/tours/:id/cancelar', cancelarReservaTur);

// Obtener reservas de tours por guía
router.get('/tours/guia/:guiaId', obtenerReservasPorGuia);

module.exports = router;