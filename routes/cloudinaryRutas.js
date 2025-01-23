const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
    subirImagen,
    eliminarImagen,
    eliminarPortada,
    actualizarPerfil,
    actualizarPortada,
} = require('../controllers/cloudinaryControlador');

router.post('/upload/:id', upload.single('file'), subirImagen);
router.delete('/eliminarImagen/:id', eliminarImagen);
router.delete('/eliminarPortada/:id', eliminarPortada);
router.put('/updatePerfil/:id', upload.single('file'), actualizarPerfil);
router.put('/updatePortada/:id', upload.single('file'), actualizarPortada);

module.exports = router;