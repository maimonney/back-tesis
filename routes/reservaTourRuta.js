const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/autenticar'); // Middleware de autenticación (opcional)

const {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
} = require('../controllers/reservasTourControlador');

// Crear una reserva de tour
router.post('/reservas/tours', crearReservaTur);

// Obtener todas las reservas de tours
router.get('/reservas/tours', obtenerReservasTur);

// Obtener una reserva de tour por su ID
router.get('/reservas/tours/:id', obtenerReservaTurPorId);

// Cancelar una reserva de tour
router.put('/reservas/tours/:id/cancelar', cancelarReservaTur);

module.exports = router;