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
router.post('/', autenticar, crearReservaTur);

// Obtener todas las reservas de tours
router.get('/', autenticar, obtenerReservasTur);

// Obtener una reserva de tour por su ID
router.get('/:id', autenticar, obtenerReservaTurPorId);

// Cancelar una reserva de tour
router.put('/:id/cancelar', autenticar, cancelarReservaTur);

module.exports = router;