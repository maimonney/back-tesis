const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const routerAPI = require('./routes/index.js');

const api = express();

const port = process.env.PORT || 3000; 
const apiVuelos = process.env.API_KEY;

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
};;

api.use(cors(corsOptions));

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lugares',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    },
  });
  
  const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
      console.log('Conexión a MongoDB Atlas correcta');
  })
  .catch(err => {
      console.error('Error al conectar a MongoDB Atlas:', err);
  });


api.use(express.json());
api.use(express.static('public'));

routerAPI(api);

api.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = api;