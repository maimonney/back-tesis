const mongoose = require('mongoose');
const Reserva = require('../models/reservasModelo');
const Excursion = require('../models/excursionModelo'); // Importar el modelo de excursión

const crearReserva = async (req, res) => {
    const { userId, vueloIda, vueloVuelta, hotel, excursionId } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'ID de usuario no válido' });
    }
    if (excursionId && !mongoose.Types.ObjectId.isValid(excursionId)) {
        return res.status(400).json({ msg: 'ID de excursión no válido' });
    }

    try {
        // Verificar si la excursión existe (si se proporciona)
        if (excursionId) {
            const excursion = await Excursion.findById(excursionId);
            if (!excursion) {
                return res.status(404).json({ msg: 'Excursión no encontrada' });
            }
        }

        // Crear la reserva
        const nuevaReserva = new Reserva({
            userId,
            vueloIda,
            vueloVuelta,
            hotel,
            excursionId // Este campo es opcional
        });

        await nuevaReserva.save();
        res.status(201).json({ msg: 'Reserva creada', data: nuevaReserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la reserva', error: error.message });
    }
};

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('userId')
            .populate('excursionId'); // Poblar la excursión si existe

        res.status(200).json({ msg: 'Reservas obtenidas', data: reservas });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas', error: error.message });
    }
};

const obtenerReservaId = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await Reserva.findById(id)
            .populate('userId')
            .populate('excursionId'); // Poblar la excursión si existe

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        res.status(200).json({ msg: 'Reserva obtenida', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la reserva', error: error.message });
    }
};

const borrarReserva = async (req, res) => {
    const { id } = req.params;

    try {
        const reserva = await Reserva.findByIdAndDelete(id);
        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }
        res.status(200).json({ msg: 'Reserva borrada', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al borrar la reserva', error: error.message });
    }
};

const actualizarReserva = async (req, res) => {
    const { id } = req.params;
    const { userId, vueloIda, vueloVuelta, hotel, excursionId } = req.body;

    try {
        // Verificar si la excursión existe (si se proporciona)
        if (excursionId) {
            const excursion = await Excursion.findById(excursionId);
            if (!excursion) {
                return res.status(404).json({ msg: 'Excursión no encontrada' });
            }
        }

        const reserva = await Reserva.findByIdAndUpdate(
            id,
            { userId, vueloIda, vueloVuelta, hotel, excursionId },
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

module.exports = {
    crearReserva,
    obtenerReservas,
    obtenerReservaId,
    borrarReserva,
    actualizarReserva,
};