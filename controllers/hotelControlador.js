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
        const { location, checkInDate, checkOutDate, adults } = req.query;

        if (!location || !checkInDate || !checkOutDate || !adults) {
            return res.status(400).json({ mensaje: 'Faltan parámetros requeridos' });
        }

        const apiKey = process.env.SERP_API_KEY;

        const response = await axios.get("https://serpapi.com/search", {
            params: {
                engine: "google_hotels",
                q: location,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                currency: "ARS",
                hl: "es",
                gl: "ar",
                api_key: apiKey,
                deep_search: true,
            },
        });

        const hoteles = response.data.hotels_results || [];
        res.status(200).json({ hoteles });

    } catch (error) {
        console.error("Error al obtener los hoteles:", error.message);
        res.status(500).json({ mensaje: 'Error al obtener los hoteles', error: error.message });
    }
};

const obtenerHabitacion = async (req, res) => {
    try {
        const hoteles = await Hotel.find({}, 'habitaciones');
        
        const todasLasHabitaciones = hoteles.reduce((acumulador, hotel) => {
            return acumulador.concat(hotel.habitaciones);
        }, []);

        if (todasLasHabitaciones.length === 0) {
            return res.status(404).json({ mensaje: 'No hay habitaciones disponibles' });
        }

        res.status(200).json({ habitaciones: todasLasHabitaciones });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las habitaciones', error });
    }
};

const obtenerHabitacionId = async (req, res) => {
    const { id } = req.params; 

    try {
        const hotel = await Hotel.findById(id, 'habitaciones');

        if (!hotel) {
            return res.status(404).json({ mensaje: 'Hotel no encontrado' });
        }

        if (hotel.habitaciones.length === 0) {
            return res.status(404).json({ mensaje: 'No hay habitaciones disponibles para este hotel' });
        }

        res.status(200).json({ habitaciones: hotel.habitaciones });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las habitaciones del hotel', error });
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

const habitacionesDestino = async (req, res) => {
    try {
        const { destino } = req.query; 

        const hoteles = await Hotel.find({
            'ubicacion.ciudad': destino 
        });
        
        if (hoteles.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron hoteles en el destino especificado' });
        }

        let habitacionesDestino = [];

        hoteles.forEach(hotel => {
            hotel.habitaciones.forEach(habitacion => {
                habitacionesDestino.push({
                    hotel: hotel.nombre, 
                    ciudad: hotel.ubicacion.ciudad,
                    tipo: habitacion.tipo, 
                    descripcion: habitacion.descripcion, 
                    capacidad: habitacion.capacidad, 
                    precioPorNoche: habitacion.precioPorNoche, 
                    imgHabitacion: habitacion.imgHabitacion 
                });
            });
        });

        if (habitacionesDestino.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron habitaciones disponibles en el destino especificado' });
        }

        res.status(200).json(habitacionesDestino); 
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las habitaciones', error });
    }
};


module.exports = {
    crearHotel,
    obtenerHotel,
    obtenerHotelId,
    habitacionesDestino,
    actualizarHotelId,
    eliminarHotel,
    hotelEconomico,
    obtenerHabitacion,
    obtenerHabitacionId
};
