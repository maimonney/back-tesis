const express = require('express');
const router = express.Router();


const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
} = require('../controllers/reservasTourControlador');

// Crear una reserva de tour
router.post('/tours', crearReservaTur);

// Obtener todas las reservas de tours
router.get('/tours', obtenerReservasTur);

// Obtener una reserva de tour por su ID
router.get('/tours/:id', obtenerReservaTurPorId);

// Cancelar una reserva de tour
router.put('/tours/:id/cancelar', cancelarReservaTur);

module.exports = router;