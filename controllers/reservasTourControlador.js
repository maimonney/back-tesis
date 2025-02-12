const ReservaTur = require('../models/reservaTourModelo');
const Tur = require('../models/turModelo');
const mongoose = require('mongoose');

const crearReservaTur = async (req, res) => {
    const { userId, tourId, fechaTour, cantidadPersonas, destino } = req.body;

    console.log('Datos recibidos en la solicitud:', { userId, tourId, fechaTour, cantidadPersonas, destino });

    
    if (!destino) {
        return res.status(400).json({ message: 'El destino es obligatorio.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tourId)) {
        console.log('IDs no válidos:', { userId, tourId });
        return res.status(400).json({ message: 'IDs no válidos' });
    }

    const tour = await Tur.findById(tourId);
    if (!tour) {
        console.log('Tour no encontrado con ID:', tourId);
        return res.status(404).json({ message: 'Tour no encontrado' });
    }

    console.log('Tour encontrado:', tour);

    const fechaTourObj = new Date(fechaTour);
    const fechaTourISO = fechaTourObj.toISOString().split('T')[0];

    const fechaDisponible = tour.fechasDisponibles.some(fecha => {
        const fechaDisponibleISO = new Date(fecha).toISOString().split('T')[0]; 
        return fechaDisponibleISO === fechaTourISO;
    });

    if (!fechaDisponible) {
        console.log('Fecha no disponible para el tour:', fechaTour);
        return res.status(400).json({ message: 'Fecha no disponible para este tour' });
    }

    console.log('Fecha del tour válida:', fechaTour);

    if (cantidadPersonas > 10) {
        console.log('Cantidad de personas excede el límite:', cantidadPersonas);
        return res.status(400).json({ message: 'La cantidad de personas no puede exceder 10' });
    }

    console.log('Cantidad de personas válida:', cantidadPersonas);

    try {
       
        const nuevaReserva = new ReservaTur({ 
            userId, 
            tourId, 
            fechaTour, 
            cantidadPersonas, 
            destino, 
            fechaReserva: new Date() 
        });
        
        await nuevaReserva.save();
        console.log('Reserva creada exitosamente:', nuevaReserva);
        res.status(201).json({ message: 'Reserva de tour creada', data: nuevaReserva });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
};


const obtenerReservasTur = async (req, res) => {
    try {
        console.log('Obteniendo todas las reservas de tours...');
        const reservas = await ReservaTur.find()
            .populate('userId', 'nombre email') 
            .populate('tourId', 'titulo descripcion precio');

        console.log('Reservas encontradas:', reservas);
        res.status(200).json({ message: 'Reservas de tours obtenidas', data: reservas });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};


const obtenerReservaTurPorId = async (req, res) => {
    const { id } = req.params;
    console.log('Buscando reserva con ID:', id);

    try {
        const reserva = await ReservaTur.findById(id)
            .populate('userId', 'nombre email')
            .populate('tourId', 'titulo descripcion precio');

        if (!reserva) {
            console.log('Reserva no encontrada con ID:', id);
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        console.log('Reserva encontrada:', reserva);
        res.status(200).json({ message: 'Reserva obtenida', data: reserva });
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
    }
};


const cancelarReservaTur = async (req, res) => {
    const { id } = req.params;
    console.log('Cancelando reserva con ID:', id);

    try {
        const reserva = await ReservaTur.findByIdAndUpdate(
            id,
            { estado: 'cancelada' },
            { new: true }
        );

        if (!reserva) {
            console.log('Reserva no encontrada con ID:', id);
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        console.log('Reserva cancelada:', reserva);
        res.status(200).json({ message: 'Reserva cancelada', data: reserva });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
    }
};

const obtenerReservasPorGuia = async (req, res) => {
    const { guiaId } = req.params;

    console.log('ID del guía recibido:', guiaId); 

    try {
        
        console.log('Buscando tours del guía...');
        const toursDelGuia = await Tur.find({ guia: guiaId });

        console.log('Tours encontrados:', toursDelGuia);

        if (toursDelGuia.length === 0) {
            console.log('No se encontraron tours para este guía.');
            return res.status(404).json({ message: 'No se encontraron tours para este guía' });
        }

        
        console.log('Buscando reservas para los tours del guía...');
        const reservas = await ReservaTur.find({ tourId: { $in: toursDelGuia.map(tour => tour._id) } })
            .populate('userId', 'nombre email') 
            .populate('tourId', 'titulo descripcion precio');

        console.log('Reservas encontradas:', reservas); 

        if (reservas.length === 0) {
            console.log('No hay reservas para los tours de este guía.');
            return res.status(404).json({ message: 'No hay reservas para los tours de este guía' });
        }

        
        console.log('Reservas obtenidas exitosamente.');
        res.status(200).json({ message: 'Reservas obtenidas', data: reservas });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas', error: error.message });
    }
};

module.exports = {
    crearReservaTur,
    obtenerReservasTur,
    obtenerReservaTurPorId,
    cancelarReservaTur,
    obtenerReservasPorGuia,
};