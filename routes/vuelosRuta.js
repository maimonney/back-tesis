const express = require('express');
const router = express.Router();
const {
    buscarVuelosResultados,
    buscarVuelosDeVuelta
} = require('../controllers/vuelosControlador');

router.get('/buscar/resultados', buscarVuelosResultados);
router.get('/buscar/vuelta', buscarVuelosDeVuelta);

module.exports = router;
