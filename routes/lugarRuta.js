const express = require('express');
const router = express.Router();

const {
    crearLugar,
    obtenerLugares,
    obtenerLugarId,
    actualizarLugarId,
    eliminarLugarId
} = require('../controllers/lugarControlador');

router.get('/', obtenerLugares);
router.post('/', crearLugar);
router.get('/:id', obtenerLugarId);
router.delete('/:id', eliminarLugarId);
router.put('/:id', actualizarLugarId);

module.exports = router;