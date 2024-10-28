const axios = require('axios');
const Vuelos = require('../models/vuelosModels');
const travelpayouts = process.env.API_KEY; 

const obtenerVuelos = async (req, res) => {
    try {
        // Implementación de API
        const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
            params: {
                origin: 'BUE', 
                currency: 'ARS',
                token: travelpayouts 
            }
        });

        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Error al obtener datos de la API' });
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
            logo: `http://pics.avs.io/200/200/${vuelo.airline}.png`
        }));

        res.json({ vuelosAPI });
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ message: 'Error al obtener los datos de vuelos', error: error.message });
    }
};

// const buscarVuelosIda = async (req, res) => {
//     try {
//         const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', { 
//             params: {
//                 origin: req.query.origen, 
//                 destination: req.query.destino, 
//                 date: req.query.fechaSalida,
//                 token: travelpayouts 
//             }
//         });
//         res.json({ vuelosAPI: response.data.data });
//     } catch (error) {
//         if (error.response) {
//             // El servidor respondió con un código de error fuera del rango 2xx
//             console.error('Error al obtener vuelos:', error.response.data, error.response.status);
//         } else if (error.request) {
//             // La solicitud se realizó, pero no hubo respuesta
//             console.error('No hay respuesta de la API:', error.request);
//         } else {
//             // Error al configurar la solicitud
//             console.error('Error en la configuración de la solicitud:', error.message);
//         }
//         res.status(500).json({ error: 'Error al obtener vuelos.' });
//     }
// };



// const obtenerVuelosId = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const vuelo = await Vuelos.findById(id);

//         if (!vuelo) {
//             return res.status(404).json({ msg: 'Vuelo no encontrado' });
//         }

//         res.status(200).json({ msg: 'Éxito en la obtención de vuelo por ID', vuelo });
//     } catch (error) {
//         res.status(500).json({ msg: 'Error en la obtención de vuelos por id', error: error.message });
//     }
// };

// const filtrarDestino = async (req, res) => {
//     const { destino } = req.params;

//     if (!esArgentino(destino)) {
//         return res.status(400).json({ msg: 'El destino debe estar dentro de Argentina' });
//     }

//     try {
//         const response = await axios.get('https://api.travelpayouts.com/v2/prices/latest', {
//             params: {
//                 origin: 'BUE',
//                 currency: 'ARS',
//                 token: travelpayouts
//             }
//         });
//         const vuelosAPI = response.data.data.filter(vuelo => vuelo.destination === destino);

//         if (vuelosAPI.length === 0) {
//             return res.status(404).json({ msg: 'No se encontraron vuelos en ese destino' });
//         }

//         res.status(200).json({ msg: 'Vuelos encontrados', vuelos: vuelosAPI });
//     } catch (error) {
//         res.status(500).json({ msg: 'Error en obtener los datos', error: error.message });
//     }
// };

// const filtrarFechaSalida= async (req, res) => {
//     const { fechaSalida } = req.params;

//     try {
//         const response = await axios.get('https://api.travelpayouts.com/v2/prices/latest', {
//             params: {
//                 origin: 'BUE',
//                 departure_at: fechaSalida, 
//                 currency: 'ARS',
//                 token: travelpayouts
//             }
//         });
//         const vuelosAPI = response.data.data;

//         if (vuelosAPI.length === 0) {
//             return res.status(404).json({ msg: 'No se encontraron vuelos en esa fecha' });
//         }

//         res.status(200).json({ msg: 'Vuelos encontrados', vuelos: vuelosAPI });
//     } catch (error) {
//         res.status(500).json({ msg: 'Error al obtener los datos', error: error.message });
//     }
// };

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

// Solo destinos en ARG
function esArgentino(lugar) {
    const lugaresArgentinos = [
        'BUE', 'AEP', 'EZE', 'USH', 'COR', 'MDQ', 'FTE', 'BRC', 
        'SLA', 'ROS', 'TUC', 'IGR', 'NQN', 'MIR', 'PSS', 'SDE', 
        'CRD', 'SJZ', 'RGL', 'RGA', 'AFA', 'HOS', 'RUA', 'RES', 
        'TMD', 'EHL', 
    ]; 

    return lugaresArgentinos.includes(lugar.toUpperCase());
}

module.exports = {
    obtenerVuelos,
    // buscarVuelosIda,
    // obtenerVuelosId,
    // filtrarDestino,
    // filtrarFechaSalida
};
