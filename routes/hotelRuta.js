const express = require('express');
const router = express.Router();

const { 
    crearHotel,
    obtenerHotel,
    obtenerHotelId,
    actualizarHotelId,
    eliminarHotel,
    hotelEconomico
} = require('../controllers/hotelControlador');

router.get('/', obtenerHotel);
router.post('/', crearHotel);
router.get('/:id', obtenerHotelId);
router.delete('/:id', eliminarHotel);
router.put('/:id', actualizarHotelId);
router.get('/precio/economico', hotelEconomico);

module.exports = router;
