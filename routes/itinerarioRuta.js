const express = require('express');
const router = express.Router();

const {
    crearReserva, 
    obtenerReservaDestino,
    obtenerReservaUserId,
    obtenerItinerarioId,
    borrarReserva,
    actualizarReserva,
    actualizarChecklist, 
} = require('../controllers/itinerarioControlador');

router.get('/usuario/:userId', obtenerReservaUserId);
router.get('/destino', obtenerReservaDestino);
router.get('/:id', obtenerItinerarioId);
router.post('/crear', crearReserva);
router.delete('/:id', borrarReserva);
router.put('/:id', actualizarReserva);
router.put('/:id', actualizarChecklist);

module.exports = router;