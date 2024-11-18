const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
require('dotenv').config();

const routerAPI = require('./routes/index.js');

const api = express();

const port = process.env.PORT || 3000; 
const travelpayouts = process.env.API_KEY;
const rapidAPI = process.env.RapidAPI_Key;

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
};;

api.use(cors(corsOptions));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

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