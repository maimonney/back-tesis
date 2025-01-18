const express = require('express');
const router = express.Router();

const {
    obtenerProvincias,
    obtenerLugares,
} = require('../controllers/lugarControlador');

router.get('/provincia', obtenerProvincias);

router.get('/lugar',  obtenerLugares);

module.exports = router;