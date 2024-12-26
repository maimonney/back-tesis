const express = require('express');
const { autenticar } = require('../middleware/autenticar'); 
const router = express.Router();

const { 
    crearUsuario,
    crearGuias,
    inicio,
    obtenerUsuario,
    obtenerGuia,
    obtenerUsuarioId,
    borrarUsuarioId,
    actualizarUsuarioId
} = require('../controllers/usuariosControlador');

// Rutas públicas
router.post('/usuarios', crearUsuario);
router.post('/guias', crearGuias);
router.post('/login', inicio);  

// Rutas protegidas
router.get('/', autenticar, obtenerUsuario);          
router.get('/guia', autenticar, obtenerGuia);          
router.get('/:id', autenticar, obtenerUsuarioId);     
router.delete('/:id', autenticar, borrarUsuarioId);   
router.put('/:id', autenticar, actualizarUsuarioId); 

module.exports = router;
