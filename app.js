const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const cloudinaryRouter = require('./routes/cloudinaryRuta');  // Asegúrate de que la ruta esté correcta
const routerAPI = require('./routes/index.js');

const api = express();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], 
    credentials: true,
};

api.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('Conexión a MongoDB Atlas correcta');
  })
  .catch(err => {
      console.error('Error al conectar a MongoDB Atlas:', err);
  });

api.use(express.json());
api.use(express.static('public'));

// Aquí se agregan las rutas de Cloudinary
api.use('/arcana', cloudinaryRouter);  // Esto permite que las rutas de Cloudinary estén disponibles bajo /arcana

routerAPI(api);

api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = api;
