const express = require('express');
const userRouter = require('./userRouter');
const vuelosRouter = require('./vuelosRouter');
const reservasRouter = require('./reservasRouter');

const router = express.Router(); // Asegúrate de crear una instancia de Router
const { obtenerVuelos } = require('../controllers/vuelosControllers');

router.get('/', obtenerVuelos); // Esta ruta se encargará de obtener los vuelos

// Configuración de las rutas
function routerAPI(app) {
    app.use('/arcana/users', userRouter);
    app.use('/arcana/vuelos', vuelosRouter); // Esta ruta usa el vuelosRouter
    app.use('/arcana/reservas', reservasRouter);
}

module.exports = routerAPI;
