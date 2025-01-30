const express = require('express');
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
router.get('/', obtenerUsuario);
router.get('/guia', obtenerGuia);         
router.get('/:id', obtenerUsuarioId);     
router.delete('/:id', borrarUsuarioId);   
router.put('/:id', actualizarUsuarioId); 

module.exports = router;
