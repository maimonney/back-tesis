const express = require('express');
const router = express.Router();
const {obtenervuelos,
    buscarVuelosIda,
    buscarVueloPorId,
    buscarVuelosVuelta,
    buscarVuelosResultados
} = require('../controllers/vuelosControlador');

router.get('/', obtenervuelos);
router.get('/:id', buscarVueloPorId);
router.get('/ida/:origen/:destino/:fechaSalida', buscarVuelosIda);
router.get('/vuelta/:origen/:destino/:fechaSalida', buscarVuelosVuelta);
router.get('/resultados/:origen/:destino/:fechaSalida/:fechaVuelta', buscarVuelosResultados);

module.exports = router;
