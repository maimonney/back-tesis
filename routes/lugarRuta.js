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
<<<<<<< HEAD
=======
router.post('/',  crearLugar);
>>>>>>> af89e0012e0481f4e138b7b22371d7e7699ebe23
router.get('/:id', obtenerLugarId);
router.delete('/:id', eliminarLugarId);
router.put('/:id', actualizarLugarId);
router.get('/cat/categoria', obtenerCategoria);
router.get('/categoria/:categoria', obtenerPorCategoria);

module.exports = router;