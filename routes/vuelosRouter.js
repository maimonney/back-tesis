const express = require('express');
const router = express.Router();
const {obtenervuelos,
    buscarVuelosIda,
    buscarVuelosVuelta,
} = require('../controllers/vuelosControllers');

router.get('/', obtenervuelos);
router.get('/ida', buscarVuelosIda);
router.get('/vuelta', buscarVuelosVuelta);

module.exports = router;
