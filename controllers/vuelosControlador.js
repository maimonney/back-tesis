const mongoose = require('mongoose');
const Vuelos = require('../models/vuelosModelo');
const express = require("express");
const axios = require("axios");
const router = express.Router();

function obtenerCodigoIATA(nombre) {
    const lugaresArgentinos = {
        'Buenos Aires - Aeropuerto Internacional Ministro Pistarini': 'EZE',
        'Buenos Aires - Aeroparque Jorge Newbery': 'AEP',
        'Córdoba': 'COR',
        'Mendoza': 'MDZ',
        'Mar del Plata': 'MDQ',
        'Ushuaia': 'USH',
        'Bariloche': 'BRC',
        'Salta': 'SLA',
        'Rosario': 'ROS',
        'Tucumán': 'TUC',
        'Iguazú': 'IGR',
        'Neuquén': 'NQN',
        'Misiones': 'MIR',
        'Posadas': 'PSS',
        'San Fernando del Valle de Catamarca': 'CTC',
        'San Juan': 'UAQ',
        'Río Gallegos': 'RGL',
        'Río Grande': 'RGA',
        'El Calafate': 'FTE',
        'San Luis': 'LUQ',
        'Resistencia': 'RES',
    };

    return lugaresArgentinos[nombre] || nombre;
}

const obtenervuelos = async (req, res) => {
    try {
        const vuelos = await Vuelos.find();
        res.json({ vuelos });
    } catch (error) {
        console.error("Error al obtener los vuelos:", error);
        res.status(500).json({ message: "Error al obtener los datos de vuelos", error: error.message });
    }
};

const buscarVueloPorId = async (req, res) => {
    const { id } = req.params;
    console.log('ID recibido:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('ID no válido');
        return res.status(400).json({ error: 'ID no válido.' });
    }

    try {
        const vuelo = await Vuelos.findById(id);
        console.log('Vuelo encontrado:', vuelo);

        if (!vuelo) {
            console.log('Vuelo no encontrado');
            return res.status(404).json({ error: 'Vuelo no encontrado.' });
        }

        res.json(vuelo);
    } catch (error) {
        console.error('Error al buscar el vuelo por ID:', error);
        res.status(500).json({ error: 'Error al buscar el vuelo por ID.' });
    }
};

const buscarVuelosIda = async (req, res) => {
    let { origen, destino, fechaSalida } = req.params;
    console.log('Consulta recibida:', { origen, destino, fechaSalida });

    origen = obtenerCodigoIATA(origen);
    destino = obtenerCodigoIATA(destino);
    console.log('Códigos IATA:', { origen, destino });

    if (!origen || !destino || !fechaSalida) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaSalida.' });
    }

    try {
        const fecha = new Date(fechaSalida);

        if (isNaN(fecha)) {
            return res.status(400).json({ error: 'Fecha de salida no válida.' });
        }

        const vuelos = await Vuelos.find({
            origen: origen,
            destino: destino,
            fechaSalida: {
                $gte: fecha,
                $lt: new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        console.log('Vuelos encontrados:', vuelos);

        if (vuelos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos de ida.' });
        }

        res.json({ vuelos });
    } catch (error) {
        console.error('Error al buscar vuelos de ida:', error);
        res.status(500).json({ error: 'Error al buscar vuelos de ida.' });
    }
};

const buscarVuelosVuelta = async (req, res) => {
    let { origen, destino, fechaSalida } = req.params;
    console.log('Consulta recibida:', { origen, destino, fechaSalida });

    origen = obtenerCodigoIATA(origen);  
    destino = obtenerCodigoIATA(destino); 
    console.log('Códigos IATA:', { origen, destino });

    if (!origen || !destino || !fechaSalida) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaSalida.' });
    }

    try {
        const fecha = new Date(fechaSalida);

        if (isNaN(fecha)) {
            return res.status(400).json({ error: 'Fecha de salida no válida.' });
        }

        const vuelos = await Vuelos.find({
            origen: origen,
            destino: destino,
            fechaSalida: {
                $gte: fecha,
                $lt: new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        console.log('Vuelos encontrados:', vuelos);

        if (vuelos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos de vuelta.' });
        }

        res.json({ vuelos });
    } catch (error) {
        console.error('Error al buscar vuelos de vuelta:', error);
        res.status(500).json({ error: 'Error al buscar vuelos de vuelta.' });
    }
};

const buscarVuelosResultados = async (req, res) => {
    let { origen, destino, fechaSalida, fechaVuelta } = req.query;

    console.log('Consulta recibida:', { origen, destino, fechaSalida, fechaVuelta });

    if (!origen || !destino || !fechaSalida || !fechaVuelta) {
        return res.status(400).json({
            error: 'Faltan parámetros requeridos: origen, destino, fechaSalida y fechaVuelta.'
        });
    }

    const fechaSalidaObj = new Date(fechaSalida);
    const fechaVueltaObj = new Date(fechaVuelta);

    if (isNaN(fechaSalidaObj) || isNaN(fechaVueltaObj)) {
        return res.status(400).json({ error: 'Fecha de salida o vuelta no válidas.' });
    }

    try {
        const apiKey = process.env.SERP_API_KEY;

        if (!apiKey) {
            console.error('Error: La clave API no está configurada.');
            return res.status(500).json({ error: 'API key no configurada' });
        }

        console.log("Clave API utilizada:", apiKey);

        // Realizando la consulta a SerpAPI
        const response = await axios.get("https://serpapi.com/search", {
            params: {
                engine: "google_flights",
                departure_id: origen.toUpperCase(),
                arrival_id: destino.toUpperCase(),
                outbound_date: fechaSalida,  // Se pasa fecha de salida
                return_date: fechaVuelta,    // Se pasa fecha de vuelta
                currency: "ARS",
                hl: "es",
                api_key: apiKey
            },
        });

        console.log("Respuesta completa de SerpAPI:", response.data);

        if (response.data && response.data.flights_results) {
            console.log("Resultados de vuelos encontrados:", response.data.flights_results);
            return res.json(response.data.flights_results);
        } else {
            console.log("No se encontraron resultados para los vuelos.");
            return res.status(404).json({ error: 'No se encontraron resultados para los criterios solicitados.' });
        }
    } catch (error) {
        console.error('Error al buscar vuelos en SerpAPI:', error);
        return res.status(500).json({
            error: 'Error al buscar vuelos en SerpAPI.',
            message: error.message,
            details: error.response?.data || "Sin detalles adicionales"
        });
    }
};


module.exports = {
    obtenervuelos,
    buscarVuelosIda,
    buscarVueloPorId,
    buscarVuelosVuelta,
    buscarVuelosResultados
};