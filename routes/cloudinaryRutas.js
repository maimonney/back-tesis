const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); 
const {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
} = require('../controllers/cloudinaryControlador');

router.post('/upload/:id', upload.single('image'), subirImagen);
router.delete('/delete', eliminarImagen);
router.put('/update/:id', upload.single('image'), actualizarImagen);

module.exports = router;
