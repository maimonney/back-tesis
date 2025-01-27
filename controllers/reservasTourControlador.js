const ReservaTur = require('../models/reservaTurModelo');
const mongoose = require('mongoose');

const crearReservaTur = async (req, res) => {
    const { userId, tourId, cantidadPersonas, fechaTour } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tourId)) {
        return res.status(400).json({ msg: 'IDs no válidos' });
    }

    try {
        const nuevaReserva = new ReservaTur({ userId, tourId, cantidadPersonas, fechaTour });
        await nuevaReserva.save();
        res.status(201).json({ msg: 'Reserva de tour creada', data: nuevaReserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la reserva', error: error.message });
    }
};

const obtenerReservasTur = async (req, res) => {
    try {
        const reservas = await ReservaTur.find().populate('userId').populate('tourId');
        res.status(200).json({ msg: 'Reservas de tours obtenidas', data: reservas });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas', error: error.message });
    }
};

const obtenerReservaTurPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await ReservaTur.findById(id).populate('userId').populate('tourId');
        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }
        res.status(200).json({ msg: 'Reserva obtenida', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la reserva', error: error.message });
    }
};

const cancelarReservaTur = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await ReservaTur.findByIdAndUpdate(
            id,
            { estado: 'cancelada' },
            { new: true }
        );
        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }
        res.status(200).json({ msg: 'Reserva cancelada', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al cancelar la reserva', error: error.message });
    }
};

module.exports = {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
};