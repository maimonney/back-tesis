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
    eliminarItem,
} = require('../controllers/itinerarioControlador');

// Rutas para obtener información
router.get('/usuario/:userId', obtenerReservaUserId);
router.get('/destino', obtenerReservaDestino);
router.get('/:id', obtenerItinerarioId);

// Rutas para crear, actualizar y borrar
router.post('/crear', crearReserva);
router.delete('/:id', borrarReserva);
router.put('/:id', actualizarReserva);

// Rutas para manejar los ítems del checklist
router.post('/:id/checklist/agregar', agregarItem); 
router.delete('/:id/checklist/eliminar', eliminarItem); 

module.exports = router;
