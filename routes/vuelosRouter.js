const express = require('express');
const router = express.Router();

const {
    obtenerVuelos,
    obtenerVuelosId,
    filtrarDestino,
} = require('../controllers/vuelosControllers');

router.get('/', obtenerVuelos);
router.get('/:id', obtenerVuelosId);

//filtros 
router.get('/filtrar/destino/:destino', filtrarDestino); 

module.exports = router;