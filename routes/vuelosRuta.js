const express = require('express');
const router = express.Router();
const {
    buscarVuelosResultados
} = require('../controllers/vuelosControlador');

router.get('/buscar/resultados', buscarVuelosResultados);

module.exports = router;
