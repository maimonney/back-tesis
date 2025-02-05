const express = require('express');
const router = express.Router();

const {
    obtenerProvincias,
    obtenerProvinciasPopulares,
    obtenerLugares,
} = require('../controllers/lugarControlador');

router.get('/provincia', obtenerProvincias);
router.get('/populares', obtenerProvinciasPopulares);

router.get('/lugar',  obtenerLugares);

module.exports = router;