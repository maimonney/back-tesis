const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); 

// const cloudinaryUpload = require('./middleware/cloudinary');
const routerAPI = require('./routes/index.js');

const api = express();

const port = process.env.PORT || 3000; 
const apiVuelos = process.env.API_KEY;

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
};

api.use(cors(corsOptions));

// Actualización: Elimina las opciones obsoletas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('Conexión a MongoDB Atlas correcta');
  })
  .catch(err => {
      console.error('Error al conectar a MongoDB Atlas:', err);
  });

api.use(express.json());
api.use(express.static('public'));
// api.use('/upload', cloudinaryUpload.array('imagen')); 

routerAPI(api);

api.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = api; 
