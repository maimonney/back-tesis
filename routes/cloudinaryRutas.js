const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

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
router.put('/updateTourPortada/:id', upload.single('file'), subirFotoTour);

module.exports = router;