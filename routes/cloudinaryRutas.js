const express = require('express');
const router = express.Router();

const {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
    imageUploader, // Ajustado
} = require('../controllers/cloudinaryControlador');

router.post('/upload/:id', imageUploader.single('image'), subirImagen);
router.delete('/delete', eliminarImagen);
router.put('/update/:id', imageUploader.single('image'), actualizarImagen);

module.exports = router;
