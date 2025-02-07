const express = require('express');
const router = express.Router();

const {
    obtenerProvincias,
    obtenerProvinciasPopulares,
    obtenerLugares,
    obtenerImagenLugar,
} = require('../controllers/lugarControlador');

router.get('/provincia', obtenerProvincias);
router.get('/populares', obtenerProvinciasPopulares);

router.get('/lugar',  obtenerLugares);
router.get('/lugarImagen',  obtenerImagenLugar);

module.exports = router;