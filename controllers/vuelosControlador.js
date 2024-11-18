const mongoose = require('mongoose');
const axios = require('axios');
const Vuelos = require('../models/vuelosModelo');

const travelpayouts = process.env.API_KEY;
const rapidAPI = process.env.RapidAPI_Key;

function obtenerCodigoIATA() {
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
    return Object.values(lugaresArgentinos);
}

function mapearVuelos(data) {
    return data.map(vuelo => ({
        origin: vuelo.origin, // Código IATA de origen
        destination: vuelo.destination, // Código IATA de destino
        origin_airport: vuelo.origin_airport, // Aeropuerto de origen
        destination_airport: vuelo.destination_airport, // Aeropuerto de destino
        price: vuelo.price, // Precio del vuelo
        airline: vuelo.airline, // Aerolínea
        flight_number: vuelo.flight_number, // Número de vuelo
        departure_at: vuelo.departure_at, // Fecha y hora de salida
        return_at: vuelo.return_at, // Fecha y hora de regreso (si aplica)
        transfers: vuelo.transfers || 0, // Número de escalas
        duration: vuelo.duration, // Duración total
        link: vuelo.link, // Enlace al vuelo
        logo: `http://pics.avs.io/200/200/${vuelo.airline}.png` // Logo de la aerolínea
    }));
}


const obtenervuelos = async (req, res) => {
    try {
        // Definir los parámetros de la solicitud de manera estática dentro de la función
        const origin = 'COR'; // Código IATA del origen
        const destination = 'EZE'; // Código IATA del destino
        const departure_date = '2024-12-15'; // Fecha de salida en formato YYYY-MM-DD
        const return_date = '2024-12-30'; // Fecha de regreso en formato YYYY-MM-DD (opcional)

        // Verificar si los parámetros necesarios están definidos
        if (!origin || !destination || !departure_date) {
            return res.status(400).json({ message: 'Faltan parámetros necesarios: origen, destino, y fecha de salida' });
        }

        // Definir los parámetros de la solicitud con valores fijos
        const params = {
            origin: origin, // Código IATA del origen
            destination: destination, // Código IATA del destino
            departure_date: departure_date, // Fecha de salida
            return_date: return_date, // Fecha de regreso (opcional)
        };

        // Hacer la solicitud a la API de SkyScanner para obtener los vuelos
        const response = await axios.request({
            method: 'GET',
            url: 'https://sky-scanner3.p.rapidapi.com/flights/skyId-list',
            params: params,
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Asegúrate de que tu clave de API esté en el entorno
                'X-RapidAPI-Host': 'sky-scanner3.p.rapidapi.com',
            },
        });

        // Verificar la respuesta de la API
        if (!response.data || !response.data.data || response.data.data.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vuelos' });
        }

        // Filtrar los vuelos según los datos que necesitamos
        const vuelos = response.data.data.map((vuelo) => ({
            origen: vuelo.origin,
            destino: vuelo.destination,
            fecha_salida: vuelo.departure_date,
            fecha_llegada: vuelo.arrival_date,
            precio: vuelo.price, // Aquí asumimos que el precio está disponible
            aerolinea: vuelo.airline, // Nombre de la aerolínea
        }));

        // Devolver los vuelos filtrados en la respuesta
        return res.json(vuelos);

    } catch (error) {
        console.error('Error al obtener los vuelos:', error.response || error.message);

        // Capturar el error y devolver un mensaje más detallado
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
        const fecha = new Date(fechaSalida);

        // Verificar si la fecha es válida
        if (isNaN(fecha)) {
            return res.status(400).json({ error: 'Fecha de salida no válida.' });
        }

        // Hacer la solicitud a la API externa para obtener los vuelos
        const apiUrl = `https://api-de-vuelos.com/vuelos?origen=${origen}&destino=${destino}&fechaSalida=${fecha.toISOString()}`;

        const response = await axios.get(apiUrl);

        // Comprobar si la respuesta tiene los datos de vuelos
        if (response.data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos de ida.' });
        }

        // Responder con los datos de vuelos obtenidos de la API externa
        res.json({ vuelos: response.data });

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
