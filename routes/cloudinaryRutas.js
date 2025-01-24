const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, 
});

const {
    subirImagen,
    eliminarImagen,
    eliminarPortada,
    actualizarPerfil,
    actualizarPortada,
    subirFotoTour, 
} = require('../controllers/cloudinaryControlador');

// Rutas
router.post('/upload/:id', upload.single('file'), subirImagen);
router.delete('/eliminarImagen/:id', eliminarImagen);
router.delete('/eliminarPortada/:id', eliminarPortada);
router.put('/updatePerfil/:id', upload.single('file'), actualizarPerfil);
router.put('/updatePortada/:id', upload.single('file'), actualizarPortada);
router.post('/uploadTourPortada/:id', upload.single('file'), subirFotoTour); 




module.exports = router;