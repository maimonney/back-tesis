const express = require('express');
const router = express.Router();
const {
    buscarVuelosIda,
    buscarVuelosVuelta,
} = require('../controllers/vuelosControllers');

router.get('/ida', buscarVuelosIda);
router.get('/vuelta', buscarVuelosVuelta);

module.exports = router;
