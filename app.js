const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

<<<<<<< HEAD
require('dotenv').config(); 

=======
>>>>>>> af89e0012e0481f4e138b7b22371d7e7699ebe23
// const cloudinaryUpload = require('./middleware/cloudinary');
const routerAPI = require('./routes/index.js');

const api = express();

const port = process.env.PORT || 3000;
const apiVuelos = process.env.API_KEY;

const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
<<<<<<< HEAD
    credentials: true 
=======
    credentials: true,
>>>>>>> af89e0012e0481f4e138b7b22371d7e7699ebe23
};

// Middleware
api.use(cors(corsOptions));
<<<<<<< HEAD

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
=======
api.use(express.json());
api.use(express.static('public'));
// api.use('/upload', cloudinaryUpload.array('imagen'));
>>>>>>> af89e0012e0481f4e138b7b22371d7e7699ebe23

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conexión a MongoDB Atlas correcta');
        
        // Inicia el servidor solo después de conectar a la base de datos
        api.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB Atlas:', error.message);
    });

// Rutas
routerAPI(api);

// Manejo de errores
api.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

<<<<<<< HEAD
api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = api; 
=======
module.exports = api;
>>>>>>> af89e0012e0481f4e138b7b22371d7e7699ebe23
