const express = require('express');
const axios = require('axios');
// const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routerAPI = require('./routes/index.js');

const api = express();

const corsOptions = {
    origin: '*', // Permite todos los orígenes (ideal para desarrollo)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

// Usa CORS con las opciones definidas
api.use(cors(corsOptions));

const port = process.env.PORT || 3000; 
const travelpayouts = process.env.API_KEY;

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Conexión a MongoDB correcta');
// })
// .catch(err => {
//     console.error('Error al conectar con MongoDB:', err);
// });

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
