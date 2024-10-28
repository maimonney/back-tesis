const express = require('express');
const vuelosController = require('../controllers/vuelosController'); // Ajusta la ruta según tu estructura

const router = express.Router();

router.get('/vuelos', vuelosController.obtenerVuelos);
router.get('/vuelos/buscar', vuelosController.buscarVuelosIda);
router.get('/vuelos/:id', vuelosController.obtenerVuelosId);
router.get('/vuelos/destino/:destino', vuelosController.filtrarDestino);
router.get('/vuelos/fecha/:fechaSalida', vuelosController.filtrarFechaSalida);

module.exports = (app) => {
    app.use('/arcana', router); // Asegúrate de que esto coincida con tus rutas
};
