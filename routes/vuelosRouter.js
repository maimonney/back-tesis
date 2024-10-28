const express = require('express');
const router = express.Router();
const { obtenerVuelos, buscarVuelosIda, obtenerVuelosId, filtrarDestino, filtrarFechaSalida } = require('../controllers/vuelosControllers');

router.get('/', obtenerVuelos);
router.get('/ida', buscarVuelosIda);
router.get('/:id', obtenerVuelosId);
router.get('/filtrar/destino/:destino', filtrarDestino); 
router.get('/filtrar/salida/:fechaSalida', filtrarFechaSalida); 

module.exports = router;
