const Reserva = require('../models/itinerarioModelo');
const mongoose = require('mongoose');

const crearReserva = async (req, res) => {
    const { userId, vueloIda, vueloVuelta, hotel, checklist, destino } = req.body;
    console.log('Datos recibidos:', req.body);

    if (!vueloIda || !vueloVuelta) {
        console.log(`Datos de vuelo incompletos - vueloIda: ${vueloIda}, vueloVuelta: ${vueloVuelta}`);
        return res.status(400).json({ msg: 'Los datos de vuelo son obligatorios' });
    }

    try {
        console.log('Datos recibidos:', { userId, vueloIda, vueloVuelta, hotel, destino, checklist });

        const nuevaReserva = new Reserva({
            userId,
            vueloIda,
            vueloVuelta,
            hotel: hotel || null,
            destino,
            checklist: checklist || [] 
        });

        console.log('Nueva reserva:', nuevaReserva);

        const reservaGuardada = await nuevaReserva.save();

        console.log('Reserva guardada:', reservaGuardada); 

        res.status(200).json({ msg: 'Reserva creada exitosamente', data: reservaGuardada });
    } catch (error) {
        console.log('Error al crear la reserva:', error.message); 
        res.status(500).json({ msg: 'Error al crear la reserva', error: error.message });
    }
};

const actualizarReserva = async (req, res) => {
    const { id } = req.params;
    const { vueloIda, vueloVuelta, hotel, checklist } = req.body;

    try {
        const reserva = await Reserva.findByIdAndUpdate(
            id,
            { vueloIda, vueloVuelta, hotel: hotel || null, checklist },
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

const actualizarChecklist = async (req, res) => {
    const { id } = req.params;
    const { itemId, accion } = req.body;  
    try {
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        if (accion === 'agregar') {
            reserva.checklist.push(itemId); 
        } else if (accion === 'eliminar') {
            reserva.checklist = reserva.checklist.filter(item => item._id.toString() !== itemId); // Eliminar item
        } else {
            return res.status(400).json({ msg: 'Acción no válida' });
        }

        await reserva.save();
        res.status(200).json({ msg: 'Checklist actualizada', data: reserva });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la checklist', error: error.message });
    }
};

const obtenerTodosItinerarios = async (req, res) => {
    try {
        const reservas = await Reserva.find(); 

        if (reservas.length === 0) {
            return res.status(404).json({ msg: 'No hay reservas disponibles' });
        }

        res.status(200).json({ msg: 'Reservas obtenidas', data: reservas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las reservas', error: error.message });
    }
};

const obtenerReservaId = async (req, res) => {
    const { userId } = req.params; 

    console.log('Solicitud recibida para obtener reserva con ID:', userId);

    if (!userId) {
        console.log('❌ Error: ID no proporcionado');
        return res.status(400).json({ msg: 'ID no proporcionado' });
    }

    try {
        console.log('🔍 Buscando reserva en la base de datos...');
        const reserva = await Reserva.findById(userId);

        if (!reserva) {
            console.log(`⚠️ Reserva con ID ${userId} no encontrada`);
            return res.status(404).json({ msg: 'Reserva no encontrada' });
        }

        console.log('✅ Reserva encontrada:', reserva);
        res.status(200).json({ msg: 'Reserva obtenida', data: reserva });
    } catch (error) {
        console.error('❌ Error al obtener la reserva:', error);
        res.status(500).json({ msg: 'Error al obtener la reserva', error: error.message });
    }
};

const obtenerReservaDestino = async (req, res) => {
    const { destino } = req.query;  

    if (!destino) {
        return res.status(400).json({ msg: 'Destino no proporcionado' });
    }
 
    try {
        const reservas = await Reserva.find({ destino });

        if (reservas.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron reservas para este destino' });
        }

        res.status(200).json({ msg: 'Reservas obtenidas', data: reservas });
    } catch (error) {
        console.error(error);
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
    obtenerTodosItinerarios,
    obtenerReservaDestino,
    obtenerReservaId,
    borrarReserva,
    actualizarReserva,
    actualizarChecklist,  
};
