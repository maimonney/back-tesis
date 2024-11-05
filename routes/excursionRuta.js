const express = require('express');
const router = express.Router();

const { 
    crearExcursion,
    obtenerExcursiones,
    obtenerExcursionId,
    actualizarExcursionId,
    eliminarExcursionId 
} = require('../controllers/excursionControlador');

router.get('/', obtenerExcursiones);
router.post('/', crearExcursion);
router.get('/:id', obtenerExcursionId);
router.delete('/:id', eliminarExcursionId);
router.put('/:id', actualizarExcursionId);

module.exports = router;
