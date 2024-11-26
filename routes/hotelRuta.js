const express = require('express');
const router = express.Router();

const { 
    crearHotel,
    obtenerHotel,
    obtenerHotelId,
    habitacionesDestino,
    actualizarHotelId,
    eliminarHotel,
    hotelEconomico,
    obtenerHabitacion,
    obtenerHabitacionId
} = require('../controllers/hotelControlador');

router.get('/', obtenerHotel);
router.post('/', crearHotel);
router.get('/:id', obtenerHotelId);
router.get('/destino', habitacionesDestino);
router.delete('/:id', eliminarHotel);
router.put('/:id', actualizarHotelId);
router.get('/precio/economico', hotelEconomico);
router.get('/buscar/habitaciones', obtenerHabitacion);
router.get('/:id/habitaciones', obtenerHabitacionId);

module.exports = router;
