const express = require('express');
const router = express.Router();

// const { upload } = require('../config/cloudinary');  

// const { upload } = require('../config/cloudinary');


const {
    crearLugar,
    obtenerLugares,
    obtenerLugarId,
    actualizarLugarId,
    eliminarLugarId,
    obtenerCategoria,
    obtenerPorCategoria
} = require('../controllers/lugarControlador');

router.get('/', obtenerLugares);
// router.post('/', upload.array('imagen'),  crearLugar);

router.post('/',  crearLugar);

router.get('/:id', obtenerLugarId);
router.delete('/:id', eliminarLugarId);
router.put('/:id', actualizarLugarId);
router.get('/cat/categoria', obtenerCategoria);
router.get('/categoria/:categoria', obtenerPorCategoria);

module.exports = router;