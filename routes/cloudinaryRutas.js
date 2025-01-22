const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuración de Multer para almacenar imágenes en memoria
const storage = multer.memoryStorage();
const imageUpload = multer({ storage }).single('file'); // Definición del middleware de Multer

const {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
} = require('../controllers/cloudinaryControlador');

// Rutas para subir, eliminar y actualizar imágenes
router.post('/upload/:id', imageUpload, subirImagen);
router.delete('/delete', eliminarImagen);
router.put('/update/:id', imageUpload, actualizarImagen);

module.exports = router;
