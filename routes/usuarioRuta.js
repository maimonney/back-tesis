const express = require('express');
const { autenticar } = require('../middleware/autenticar');
const router = express.Router();

const { 
    crearUsuario,
    inicio,
    obtenerUsuario,
    obtenerUsuarioId,
    borrarUsuarioId,
    actualizarUsuarioId } = require('../controllers/usuariosControlador');


router.get('/', obtenerUsuario );
router.post('/', crearUsuario);
router.post('/login', inicio);
router.get('/:id', obtenerUsuarioId);
router.delete('/:id', borrarUsuarioId);
router.put('/:id', actualizarUsuarioId);

module.exports = router;