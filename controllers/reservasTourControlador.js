const ReservaTur = require('../models/reservaTourModelo');
const Tur = require('../models/turModelo');
const mongoose = require('mongoose');

// Crear una reserva de tour
const crearReservaTur = async (req, res) => {
    const { userId, tourId, fechaTour, cantidadPersonas } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tourId)) {
        return res.status(400).json({ message: 'IDs no válidos' });
    }

    // Verificar si el tour existe
    const tour = await Tur.findById(tourId);
    if (!tour) {
        return res.status(404).json({ message: 'Tour no encontrado' });
    }

    try {
        const nuevaReserva = new ReservaTur({ userId, tourId, fechaTour, cantidadPersonas });
        await nuevaReserva.save();
        res.status(201).json({ message: 'Reserva de tour creada', data: nuevaReserva });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
};

// Obtener todas las reservas de tours
const obtenerReservasTur = async (req, res) => {
    try {
        const reservas = await ReservaTur.find()
            .populate('userId', 'nombre email') // Popula los datos del usuario
            .populate('tourId', 'titulo descripcion precio'); // Popula los datos del tour

        res.status(200).json({ message: 'Reservas de tours obtenidas', data: reservas });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};

// Obtener una reserva de tour por su ID
const obtenerReservaTurPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await ReservaTur.findById(id)
            .populate('userId', 'nombre email')
            .populate('tourId', 'titulo descripcion precio');

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.status(200).json({ message: 'Reserva obtenida', data: reserva });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
    }
};

// Cancelar una reserva de tour
const cancelarReservaTur = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await ReservaTur.findByIdAndUpdate(
            id,
            { estado: 'cancelada' },
            { new: true }
        );

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        res.status(200).json({ message: 'Reserva cancelada', data: reserva });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
    }
};

module.exports = {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
};