const express = require('express');
const router = express.Router();

const {
    obtenerVuelos,
    obtenerVuelosId,
    filtrarDestino,
    filtrarFechaSalida
} = require('../controllers/vuelosControllers');

router.get('/', obtenerVuelos);
router.get('/:id', obtenerVuelosId);

//filtros 
router.get('/filtrar/destino/:destino', filtrarDestino); 
router.get('/filtrar/salida/:fechaSalida', filtrarFechaSalida); 

module.exports = router;