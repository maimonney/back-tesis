const express = require('express');
const axios = require('axios');
// const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routerAPI = require('./routes/index.js');

const api = express();

const corsOptions = (req, callback) => {
    const allowedOrigins = ['http://localhost:5173', /.*\.vercel\.app$/]; // permite cualquier subdominio de vercel.app
    const origin = req.headers.origin;
    if (allowedOrigins.some(pattern => typeof pattern === 'string' ? pattern === origin : pattern.test(origin))) {
        callback(null, true); 
    } else {
        callback(new Error('No permitido por CORS'));
    }
};

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
