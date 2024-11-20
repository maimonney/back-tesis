const mongoose = require('mongoose');
const axios = require('axios');
const Vuelos = require('../models/vuelosModelo');

const apiVuelos = process.env.API_KEY;

function obtenerCodigoIATA() {
    const aeropuertosArgentinos = {
        'Buenos Aires - Aeropuerto Internacional Ministro Pistarini': 'EZE',
        'Buenos Aires - Aeroparque Jorge Newbery': 'AEP',
        'Córdoba - Aeropuerto Internacional Ingeniero Ambrosio Taravella': 'COR',
        'Mendoza - Aeropuerto Internacional Gobernador Francisco Gabrielli': 'MDZ',
        'Mar del Plata - Aeropuerto Internacional Astor Piazzolla': 'MDQ',
        'Ushuaia - Aeropuerto Internacional Malvinas Argentinas': 'USH',
        'Bariloche - Aeropuerto Internacional Teniente Luis Candelaria': 'BRC',
        'Salta - Aeropuerto Internacional Martín Miguel de Güemes': 'SLA',
        'Rosario - Aeropuerto Internacional Islas Malvinas': 'ROS',
        'Tucumán - Aeropuerto Internacional Teniente General Benjamín Matienzo': 'TUC',
        'Iguazú - Aeropuerto Internacional Cataratas del Iguazú': 'IGR',
        'Neuquén - Aeropuerto Internacional Presidente Perón': 'NQN',
        'Posadas - Aeropuerto Internacional Libertador General José de San Martín': 'PSS',
        'San Fernando del Valle de Catamarca - Aeropuerto Coronel Felipe Varela': 'CTC',
        'San Juan - Aeropuerto Domingo Faustino Sarmiento': 'UAQ',
        'Río Gallegos - Aeropuerto Internacional Piloto Civil Norberto Fernández': 'RGL',
        'Río Grande - Aeropuerto Internacional Gobernador Ramón Trejo Noel': 'RGA',
        'El Calafate - Aeropuerto Internacional Comandante Armando Tola': 'FTE',
        'San Luis - Aeropuerto Brigadier Mayor César Raúl Ojeda': 'LUQ',
        'Resistencia - Aeropuerto Internacional de Resistencia': 'RES',
    };
    return Object.values(aeropuertosArgentinos);
}


const obtenervuelos = async (req, res) => {
    try {
        // Parámetros de entrada desde la solicitud
        const origin = req.query.origen || 'COR'; // Origen: Córdoba (por defecto)
        const destination = req.query.destino || 'EZE'; // Destino: Buenos Aires (por defecto)
        const departure_date = req.query.fechaSalida || '2024-12-25'; // Fecha de salida (por defecto)
        const return_date = req.query.fechaRegreso || '2024-12-30'; // Fecha de regreso (por defecto)
        const travel_class = req.query.clase || 1; // Clase económica (por defecto)
        const currency = req.query.moneda || 'ARS'; // Moneda en pesos argentinos (por defecto)
        const hl = 'es'; // Idioma en español
        const gl = 'ar'; // País de búsqueda en Argentina
        const apiKey = apiVuelos; // Tu clave de API de SerpApi

        // Validación de parámetros obligatorios
        if (!origin || !destination || !departure_date) {
            return res.status(400).json({ message: 'Faltan parámetros necesarios: origen, destino, y fecha de salida' });
        }

        // Parámetros para la API
        const params = {
            departure_id: origin,  // Origen
            arrival_id: destination, // Destino
            outbound_date: departure_date, // Fecha de salida
            return_date: return_date, // Fecha de retorno
            travel_class: travel_class, // Clase de viaje
            currency: currency, // Moneda
            hl: hl, // Idioma
            gl: gl, // País
            type: 1, // Tipo de vuelo: Round trip (viaje de ida y vuelta)
            api_key: apiVuelos // Clave de la API
        };

        // Realizar la solicitud a SerpApi
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                engine: 'google_flights', // Motor de búsqueda de Google Flights
                ...params,
            },
        });

        // Comprobación de respuesta
        if (!response.data || !response.data.best_flights || response.data.best_flights.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vuelos' });
        }

        // Mapeo de vuelos obtenidos desde la API para adaptarlos a la estructura que necesitas
        const vuelos = response.data.best_flights.map(flight => ({
            numeroVuelo: flight.flights[0].flight_number,
            origen: flight.flights[0].departure_airport.name,
            destino: flight.flights[0].arrival_airport.name,
            fechaSalida: flight.flights[0].departure_airport.time,
            fechaLlegada: flight.flights[0].arrival_airport.time,
            aerolinea: flight.flights[0].airline,
            imgAerolinea: flight.flights[0].airline_logo,
            precio: flight.price,
            escala: flight.layovers && flight.layovers.length > 0,
        }));

        // Enviar respuesta con los vuelos obtenidos
        return res.json(vuelos);

    } catch (error) {
        console.error('Error al obtener los vuelos:', error.response || error.message);
        return res.status(500).json({ message: 'Error al obtener los datos de vuelos', error: error.message });
    }
};

//!Hay que cambiar porque sale de mongoose y ya no se usa
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
    const { origen, destino, fechaSalida } = req.params; // O si es un POST, usa req.body

    // Verificar si faltan parámetros
    if (!origen || !destino || !fechaSalida) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaSalida.' });
    }

    try {
        // Validar y convertir la fecha de salida
        const fecha = new Date(fechaSalida);
        if (isNaN(fecha)) {
            return res.status(400).json({ error: 'Fecha de salida no válida.' });
        }

        // Configurar parámetros para la API de SerpApi (Google Flights)
        const apiKey = apiVuelos; // Asegúrate de tener tu clave de API válida
        const hl = 'es'; // Idioma en español
        const gl = 'ar'; // País de búsqueda en Argentina (puedes cambiarlo si es necesario)

        // URL de la API con parámetros dinámicos
        const apiUrl = `https://serpapi.com/search?engine=google_flights&departure_id=${origen}&arrival_id=${destino}&outbound_date=${new Date(fechaSalida).toISOString().split('T')[0]}&api_key=${apiKey}&hl=${hl}&gl=${gl}`;

        // Realizar la solicitud a la API de SerpApi
        const response = await axios.get(apiUrl);

        // Comprobar si la respuesta tiene datos de vuelos
        if (!response.data || !response.data.flights_results || response.data.flights_results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos de ida para la fecha seleccionada.' });
        }

        // Procesar los datos de vuelos obtenidos
        const vuelos = response.data.flights_results.map(flight => ({
            numeroVuelo: flight.flights[0].flight_number,
            origen: flight.flights[0].departure_airport.id,
            destino: flight.flights[0].arrival_airport.id,
            fechaSalida: flight.flights[0].departure_airport.time,
            fechaLlegada: flight.flights[0].arrival_airport.time,
            aerolinea: flight.flights[0].airline,
            precio: flight.price,
            escala: flight.layovers.length > 0,
        }));

        // Enviar la respuesta con los vuelos encontrados
        res.json({ vuelos });

    } catch (error) {
        console.error('Error al buscar vuelos de ida:', error);
        res.status(500).json({ error: 'Error al buscar vuelos de ida.' });
    }
};


const buscarVuelosVuelta = async (req, res) => {
    const { origen, destino, fechaSalida } = req.query; // Puedes cambiar a req.params si usas parámetros en la URL

    // Verificar si faltan parámetros
    if (!origen || !destino || !fechaSalida) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino y fechaSalida.' });
    }

    console.log('Consulta recibida:', { origen, destino, fechaSalida });

    // Obtener los códigos IATA de los aeropuertos
    const codigoOrigen = obtenerCodigoIATA(origen); 
    const codigoDestino = obtenerCodigoIATA(destino); 
    console.log('Códigos IATA:', { codigoOrigen, codigoDestino });

    try {
        const fecha = new Date(fechaSalida);

        // Verificar si la fecha es válida
        if (isNaN(fecha)) {
            return res.status(400).json({ error: 'Fecha de salida no válida.' });
        }

        // Hacer la solicitud a la API externa para obtener los vuelos de vuelta
        const apiUrl = `https://api-de-vuelos.com/vuelos?origen=${destino}&destino=${origen}&fechaSalida=${fecha.toISOString()}`;

        // Realizar la solicitud a la API
        const response = await axios.get(apiUrl);

        // Comprobar si la respuesta tiene vuelos de vuelta
        if (response.data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos de vuelta.' });
        }

        // Responder con los vuelos encontrados
        res.json({ vuelos: response.data });

    } catch (error) {
        console.error('Error al buscar vuelos de vuelta:', error);
        res.status(500).json({ error: 'Error al buscar vuelos de vuelta.' });
    }
};

const buscarVuelosResultados = async (req, res) => {
    const { origen, destino, fechaSalida, fechaVuelta } = req.params; 

    console.log('Consulta recibida:', { origen, destino, fechaSalida, fechaVuelta });

    if (!origen || !destino || !fechaSalida || !fechaVuelta) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos: origen, destino, fechaSalida y fechaVuelta.' });
    }

    const fechaSalidaObj = new Date(fechaSalida);
    const fechaVueltaObj = new Date(fechaVuelta);

    if (isNaN(fechaSalidaObj) || isNaN(fechaVueltaObj)) {
        return res.status(400).json({ error: 'Fecha de salida o vuelta no válidas.' });
    }

    try {
        const vuelosIda = await Vuelos.find({
            origen: origen,
            destino: destino,
            fechaSalida: {
                $gte: fechaSalidaObj,
                $lt: fechaVueltaObj 
            }
        });

        const vuelosVuelta = await Vuelos.find({
            origen: destino,
            destino: origen,
            fechaSalida: {
                $gte: fechaVueltaObj 
            }
        });

        console.log('Vuelos de ida:', vuelosIda);
        console.log('Vuelos de vuelta:', vuelosVuelta);

        if (vuelosIda.length === 0 && vuelosVuelta.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos para los criterios solicitados.' });
        }

        res.json({ vuelosIda, vuelosVuelta });

    } catch (error) {
        console.error('Error al buscar vuelos:', error);
        res.status(500).json({ error: 'Error al buscar vuelos.' });
    }
};


module.exports = {
    obtenervuelos,
    buscarVuelosIda,
    buscarVueloPorId,
    buscarVuelosVuelta,
    buscarVuelosResultados
};
