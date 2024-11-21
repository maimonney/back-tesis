const mongoose = require('mongoose');
const Vuelos = require('../models/vuelosModelo');

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
    let { origen, destino, fechaSalida, fechaVuelta } = req.params;
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
;
        console.log('Vuelos de ida:', vuelosIda);
        console.log('Vuelos de vuelta:', vuelosVuelta);
        if (vuelosIda.length === 0 && vuelosVuelta.length === 0 && vuelosEntreFechas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron vuelos para los criterios solicitados.' });
        }
        // Responder con los vuelos encontrados
        res.json({ vuelosIda, vuelosVuelta});
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