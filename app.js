const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routerAPI = require('./routes/index.js');

const api = express();
const corsOptions = {
    origin: ['http://localhost:5173', 'https://back-tesis-two.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
};

app.use(cors(corsOptions));
const port = process.env.PORT;
const travelpayouts = process.env.API_KEY;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', () => console.error('Error al conectar con MongoDB'));
db.once('open', () => {
    console.log('Conexión a MongoDB correcta');
});

api.use(express.json());
api.use(express.static('public'));

routerAPI(api);

api.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
