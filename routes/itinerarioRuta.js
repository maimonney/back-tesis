const express = require('express');
const router = express.Router();

const {
    crearReserva, 
    obtenerReservaId,
    borrarReserva,
    actualizarReserva,
    actualizarChecklist, 
} = require('../controllers/itinerarioControlador');

router.get('/:id', obtenerReservaId);
router.post('/crear', crearReserva);
router.delete('/:id', borrarReserva);
router.put('/:id', actualizarReserva);
router.put('/:id', actualizarChecklist);

module.exports = router;