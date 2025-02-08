const express = require('express');
const router = express.Router();

const {
    obtenerProvincias,
    obtenerProvinciasPopulares,
    obtenerLugares,
    obtenerImagenLugar,
    obtenerInfoLugar,
} = require('../controllers/lugarControlador');

router.get('/provincia', obtenerProvincias);
router.get('/populares', obtenerProvinciasPopulares);

router.get('/lugar',  obtenerLugares);
router.get('/lugarImagen',  obtenerImagenLugar);
router.get('/infoImagen',  obtenerInfoLugar);

module.exports = router;