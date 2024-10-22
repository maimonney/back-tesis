const axios = require('axios');
const Vuelos = require('../models/vuelosModels');
const travelpayouts = process.env.API_KEY; 

const obtenerVuelos = async (req, res) => {
    try {
        //Implementacion de API
        const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
            params: {
                //!Esto son solo vuelos que salen de Buenos Aires
                origin: 'BUE', 
                currency: 'ARS',
                token: travelpayouts 
            }
        });

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
            logo: `http://pics.avs.io/200/200/${vuelo.airline}.png`
        }));

        //Para que se muestren los de mongo y APis
        const vuelosCombinados = {
            vuelosMongoDB,
            vuelosAPI
        };

        res.json(vuelosCombinados);
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ message: 'Error al obtener los datos de vuelos', error: error.message });
    }
};

const obtenerVuelosId = async (req, res) => {
    const { id } = req.params;

    try {
        const vuelo = await Vuelos.findById(id);

        if (!vuelo) {
            return res.status(404).json({ msg: 'Vuelo no encontrado' });
        }

        res.status(200).json({ msg: 'Éxito en la obtención de vuelo por ID', vuelo });
    } catch (error) {
        res.status(500).json({ msg: 'Error en la obtención de vuelos por id', error: error.message });
    }
};

const filtrarDestino = async (req, res) => {
    const { destino } = req.params;

    if (!esArgentino(destino)) {
        return res.status(400).json({ msg: 'El destino debe estar dentro de Argentina' });
    }

    try {
        // Obtener vuelos de MongoDB
        const vuelosMongoDB = await Vuelos.find({ destino });

        // Obtener vuelos de la API
        const response = await axios.get('https://api.travelpayouts.com/v2/prices/latest', {
            params: {
                origin: 'BUE',
                currency: 'ARS',
                token: travelpayouts
            }
        });
        const vuelosAPI = response.data.data.filter(vuelo => vuelo.destination === destino);

        // Combinar resultados
        const vuelosCombinados = [...vuelosMongoDB, ...vuelosAPI];

        if (vuelosCombinados.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron vuelos en ese destino' });
        }

        res.status(200).json({ msg: 'Vuelos encontrados', vuelos: vuelosCombinados });
    } catch (error) {
        res.status(500).json({ msg: 'Error en obtener los datos', error: error.message });
    }
};


//Aerolineas
const airlinesMap = {
    FO: 'Flybondi',
    IB: 'Iberia',
    AR: 'Aerolíneas Argentinas',
    LA: 'LATAM Airlines',
    AA: 'American Airlines',
    JA: 'Japan Airlines',
    WJ: 'WebJet Linhas Aéreas',
};

// Solo destinos en ARG
function esArgentino(lugar) {
    const lugaresArgentinos = [
    'BUE', // Buenos Aires
    'AEP', // Aeroparque
    'EZE', // Aeropuerto 
    'USH', // Ushuaia
    'COR', // Córdoba
    'MDQ', // Mar del Plata
    'FTE', // El Calafate
    'BRC', // San Carlos de Bariloche
    'SLA', // Salta
    'ROS', // Rosario
    'TUC', // Tucumán
    'IGR', // Iguazú
    'NQN', // Neuquén
    'MIR', // Misiones
    'PSS', // Posadas
    'SDE', // Santiago del Estero
    'CRD', // Comodoro Rivadavia
    'SJZ', // San Juan
    'RGL', // Río Gallegos
    'RGA', // Río Grande
    'AFA', // Malargüe
    'HOS', // Hoshino
    'RUA', // San Luis
    'RES', // Resistencia
    'TMD', // Trelew
    'EHL', // El Chaltén
    ]; 

    return lugaresArgentinos.includes(lugar.toUpperCase());
}

module.exports = {
    obtenerVuelos,
    obtenerVuelosId,
    filtrarDestino,
};

