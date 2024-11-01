const axios = require('axios');
const Vuelos = require('../models/vuelosModels');
const travelpayouts = process.env.API_KEY;

// Función para obtener el código IATA a partir del nombre del aeropuerto o ciudad
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

    return lugaresArgentinos[nombre] || nombre; // Retorna el nombre original si no está en el mapeo
}

const buscarVuelosIda = async (req, res) => {
    let { origen, destino, fechaSalida } = req.query;

    // Convierte nombres de ciudades a códigos IATA si es necesario
    origen = obtenerCodigoIATA(origen);
    destino = obtenerCodigoIATA(destino);

    if (!origen || !destino || !fechaSalida) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaSalida.' });
    }

    try {
        const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', { 
            params: {
                origin: origen, 
                destination: destino, 
                date: fechaSalida,
                token: travelpayouts 
            }
        });

        if (!response.data || !response.data.data) {
            return res.status(404).json({ error: 'No se encontraron vuelos.' });
        }

        const vuelosAPI = response.data.data.map(vuelo => ({
            origin: vuelo.origin,
            destination: vuelo.destination,
            origin_airport: vuelo.origin_airport,
            destination_airport: vuelo.destination_airport,
            price: vuelo.price, 
            airline: airlinesMap[vuelo.airline] || vuelo.airline,
            flight_number: vuelo.flight_number, 
            departure_at: vuelo.departure_at, 
            return_at: vuelo.return_at, 
            return_transfers: vuelo.return_transfers || 0, 
            duration: vuelo.duration, 
            duration_to: vuelo.duration_to,
            duration_back: vuelo.duration_back, 
            link: vuelo.link,
            logo: vuelo.airline ? `http://pics.avs.io/200/200/${vuelo.airline}.png` : null,
        }));

        res.json({ vuelosAPI });
    } catch (error) {
        if (error.response) {
            console.error('Error al obtener vuelos:', error.response.data, error.response.status);
        } else if (error.request) {
            console.error('No hay respuesta de la API:', error.request);
        } else {
            console.error('Error en la configuración de la solicitud:', error.message);
        }
        res.status(500).json({ error: 'Error al obtener vuelos.' });
    }
};

const buscarVuelosVuelta = async (req, res) => {
    let { origen, destino, fechaVuelta } = req.query;

    // Convierte nombres de ciudades a códigos IATA si es necesario
    origen = obtenerCodigoIATA(origen);
    destino = obtenerCodigoIATA(destino);

    if (!origen || !destino || !fechaVuelta) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaVuelta.' });
    }

    try {
        const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', { 
            params: {
                origin: destino,  
                destination: origen,
                date: fechaVuelta,  
                token: travelpayouts 
            }
        });

        if (!response.data || !response.data.data) {
            return res.status(404).json({ error: 'No se encontraron vuelos de vuelta.' });
        }

        const vuelosAPI = response.data.data.map(vuelo => ({
            origin: vuelo.origin,
            destination: vuelo.destination,
            origin_airport: vuelo.origin_airport,
            destination_airport: vuelo.destination_airport,
            price: vuelo.price, 
            airline: airlinesMap[vuelo.airline] || vuelo.airline,
            flight_number: vuelo.flight_number, 
            departure_at: vuelo.departure_at, 
            return_at: vuelo.return_at, 
            transfers: vuelo.transfers || 0, 
            return_transfers: vuelo.return_transfers || 0, 
            duration: vuelo.duration, 
            duration_to: vuelo.duration_to,
            duration_back: vuelo.duration_back, 
            link: vuelo.link,
            logo: vuelo.airline ? `http://pics.avs.io/200/200/${vuelo.airline}.png` : null
        }));

        res.json({ vuelosAPI });
    } catch (error) {
        if (error.response) {
            console.error('Error al obtener vuelos de vuelta:', error.response.data, error.response.status);
        } else if (error.request) {
            console.error('No hay respuesta de la API para vuelos de vuelta:', error.request);
        } else {
            console.error('Error en la configuración de la solicitud para vuelos de vuelta:', error.message);
        }
        res.status(500).json({ error: 'Error al obtener vuelos de vuelta.' });
    }
};

// Aerolíneas
const airlinesMap = {
    FO: 'Flybondi',
    IB: 'Iberia',
    AR: 'Aerolíneas Argentinas',
    LA: 'LATAM Airlines',
    AA: 'American Airlines',
    JA: 'Japan Airlines',
    WJ: 'WebJet Linhas Aéreas',
};

module.exports = {
    buscarVuelosIda,
    buscarVuelosVuelta
};
