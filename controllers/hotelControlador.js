const mongoose = require('mongoose');
const Hotel = require('../models/hotelModelo');

const crearHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json({ mensaje: 'Hotel creado exitosamente', hotel });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el hotel', error });
    }
};

const obtenerHotel = async (req, res) => {
    try {
        const hoteles = await Hotel.find();
        res.status(200).json(hoteles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los hoteles', error });
    }
};

const obtenerHotelId = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ mensaje: 'Hotel no encontrado' });
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el hotel', error });
    }
};

const actualizarHotelId = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hotel) return res.status(404).json({ mensaje: 'Hotel no encontrado' });
        res.status(200).json({ mensaje: 'Hotel actualizado exitosamente', hotel });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el hotel', error });
    }
};

const eliminarHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ mensaje: 'Hotel no encontrado' });
        res.status(200).json({ mensaje: 'Hotel eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el hotel', error });
    }
};

const hotelEconomico = async (req, res) => {
    try {
        const hoteles = await Hotel.find();
        
        let hotelMasEconomico = null;
        let precioMinimo = Infinity;

        hoteles.forEach(hotel => {
            hotel.habitaciones.forEach(habitacion => {
                if (habitacion.precioPorNoche < precioMinimo) {
                    precioMinimo = habitacion.precioPorNoche;
                    hotelMasEconomico = hotel;
                }
            });
        });

        if (!hotelMasEconomico) {
            return res.status(404).json({ mensaje: 'No se encontraron hoteles' });
        }

        res.status(200).json(hotelMasEconomico); 
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el hotel más económico', error });
    }
};

module.exports = {
    crearHotel,
    obtenerHotel,
    obtenerHotelId,
    actualizarHotelId,
    eliminarHotel,
    hotelEconomico
};
