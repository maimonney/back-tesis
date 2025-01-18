const express = require('express');
const router = express.Router();

const { 
    obtenerHotel,
} = require('../controllers/hotelControlador');

router.get('/', obtenerHotel);

module.exports = router;
