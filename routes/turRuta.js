const express = require('express');
const { autenticar } = require('../middleware/autenticar'); 
const router = express.Router();

const { 
    obtenerTurs,
    TurId,
    crearTur,
    actualizarTur,
    deleteTur
} = require('../controllers/turControlador');

router.get('/', obtenerTurs);         
router.get('/:id', TurId);  
router.post('/',autenticar , crearTur);   
router.delete('/:id', autenticar, deleteTur);   
router.put('/:id', autenticar, actualizarTur); 

module.exports = router;
