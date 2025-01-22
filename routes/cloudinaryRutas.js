const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuración de Multer para almacenar imágenes en memoria
const storage = multer.memoryStorage();
const imageUpload = multer({ storage }).single('file'); // Definición del middleware de Multer

const {
    subirImagen,
    eliminarImagen,
    actualizarPortada,
    actualizarPerfil,
} = require('../controllers/cloudinaryControlador');

router.post('/upload/:id', imageUpload, subirImagen);
router.delete('/delete', eliminarImagen);
router.put('/updatePerfil/:id', imageUpload, actualizarPerfil);
router.put('/updatePortada/:id', imageUpload, actualizarPortada);

module.exports = router;
