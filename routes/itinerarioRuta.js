const express = require('express');
const router = express.Router();

const {
    crearReserva,
    obtenerReservaDestino,
    obtenerReservaUserId,
    obtenerItinerarioId,
    borrarReserva,
    actualizarReserva,
    agregarItem,
    actualizarItem,
    eliminarItem,
} = require('../controllers/itinerarioControlador');

router.get('/usuario/:userId', obtenerReservaUserId);
router.get('/destino', obtenerReservaDestino);
router.get('/:id', obtenerItinerarioId);

router.post('/crear', crearReserva);
router.delete('/:id', borrarReserva);
router.put('/:id', actualizarReserva);

router.post('/:id/checklist/agregar', agregarItem); 
router.put('/:id/checklist/actualizar', actualizarItem); 
router.delete('/:id/checklist/eliminar', eliminarItem); 

module.exports = router;
