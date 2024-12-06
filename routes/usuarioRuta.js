const express = require('express');
const { autenticar } = require('../middleware/autenticar'); 
const router = express.Router();

const { 
    crearUsuario,
    inicio,
    obtenerUsuario,
    obtenerUsuarioId,
    borrarUsuarioId,
    actualizarUsuarioId
} = require('../controllers/usuariosControlador');

// Rutas públicas
router.post('/', crearUsuario);
router.post('/login', inicio);  

// Rutas protegidas
router.get('/', autenticar, obtenerUsuario);          
router.get('/:id', obtenerUsuarioId);     
router.delete('/:id', autenticar, borrarUsuarioId);   
router.put('/:id', actualizarUsuarioId); 

module.exports = router;
