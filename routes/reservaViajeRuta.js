const express = require('express');
const mongoose = require('mongoose');
const Reserva = require('../models/itinerarioModelo'); 
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, vueloIda, vueloVuelta, hotel } = req.body;

  try {
    const nuevaReserva = new Reserva({
      userId: userId,
      vueloIda: vueloIda,
      vueloVuelta: vueloVuelta,
      hotel: hotel,
    });

    await nuevaReserva.save();
    res.status(201).send({ message: 'Reserva guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    res.status(500).send({ message: 'Error al guardar la reserva' });
  }
});

module.exports = router;
