const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const reservaTourRutas = require('./routes/reservaTourRuta.js');

const routerAPI = require('./routes/index.js');

const api = express();
const port = process.env.PORT || 3000;


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

api.use(cors(corsOptions));
api.use('/arcana/reservas-tours', reservaTourRutas);

api.use(express.json({ limit: '50mb' })); 
api.use(express.urlencoded({ limit: '50mb', extended: true })); 
api.use(express.raw({ limit: '50mb' })); 

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conexión a MongoDB Atlas correcta');
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB Atlas:', err);
    });

api.use(express.static('public'));


routerAPI(api);


api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = api;