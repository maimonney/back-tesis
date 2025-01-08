const express = require('express');
const { autenticar } = require('../middleware/autenticar'); 
const router = express.Router();

const { 
    obtenerTurs,
    obtenerTursPorGuia,
    TurId,
    crearTur,
    actualizarTur,
    deleteTur
} = require('../controllers/turControlador');

router.get('/', obtenerTurs);         
router.get('/segunGuia/:id', obtenerTursPorGuia);         
router.get('/:id', TurId);  
router.post('/', crearTur);   
router.delete('/:id', deleteTur);   
router.put('/:id', actualizarTur); 

module.exports = router;
