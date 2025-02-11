const Reserva = require('../models/reservasModelo');
const mongoose = require('mongoose');

const crearReserva = async (req, res) => {
    const { userId, vueloIda, vueloVuelta, hotel } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'ID de usuario no válido' });
    }

    if (!vueloIda || !vueloVuelta) {
        return res.status(400).json({ msg: 'Los datos de vuelo son obligatorios' });
    }

    try {
        const nuevaReserva = new Reserva({ userId, vueloIda, vueloVuelta, hotel: hotel || null });

        await nuevaReserva.save();
        res.status(201).json({ msg: 'Reserva creada exitosamente', data: nuevaReserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la reserva', error: error.message });
    }
};

const actualizarReserva = async (req, res) => {
    const { id } = req.params;
    const { vueloIda, vueloVuelta, hotel } = req.body;

    try {
        const reserva = await Reserva.findByIdAndUpdate(
            id,
            { vueloIda, vueloVuelta, hotel: hotel || null },
            { new: true, runValidators: true }
        );

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        res.status(200).json({ msg: 'Reserva actualizada', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la reserva', error: error.message });
    }
};

const obtenerReservaId = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'ID de usuario no válido' });
    }

    try {
        const reservas = await Reserva.find({ userId }).populate('userId');

        if (reservas.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron reservas para este usuario' });
        }

        res.status(200).json({ msg: 'Reservas obtenidas', data: reservas });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas', error: error.message });
    }
};

const borrarReserva = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID de reserva no válido' });
    }

    try {
        const reservaEliminada = await Reserva.findByIdAndDelete(id);

        if (!reservaEliminada) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        res.status(200).json({ msg: 'Reserva eliminada correctamente', data: reservaEliminada });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la reserva', error: error.message });
    }
};

module.exports = {
    crearReserva, 
    obtenerReservaId,
    borrarReserva,
    actualizarReserva,
};
