const axios = require("axios");
const jwt = require("jsonwebtoken");

const buscarVuelosResultados = async (req, res) => {
    let { departure_id, arrival_id, outbound_date, return_date, departure_token } = req.query;

    console.log('Consulta recibida:', { departure_id, arrival_id, outbound_date, return_date, departure_token });

    if (!departure_id || !arrival_id || !outbound_date || !return_date) {
        console.log('Faltan parámetros requeridos.');
        return res.status(400).json({
            error: 'Faltan parámetros requeridos: departure_id, arrival_id, outbound_date y return_date.'
        });
    }

    const fechaSalidaObj = new Date(outbound_date);
    const fechaVueltaObj = new Date(return_date);

    if (isNaN(fechaSalidaObj) || isNaN(fechaVueltaObj)) {
        console.log('Fechas no válidas:', { fechaSalidaObj, fechaVueltaObj });
        return res.status(400).json({ error: 'Fecha de salida o vuelta no válidas.' });
    }

    console.log("Fechas convertidas:", { fechaSalidaObj, fechaVueltaObj });

    try {
        const apiKey = process.env.SERP_API_KEY;

        if (!apiKey) {
            console.error('Error: La clave API no está configurada.');
            return res.status(500).json({ error: 'API key no configurada' });
        }

        console.log("Clave API utilizada:", apiKey);

        if (!/^[A-Za-z]{3}$/.test(departure_id) || !/^[A-Za-z]{3}$/.test(arrival_id)) {
            console.log('Los códigos de aeropuerto no son válidos:', { departure_id, arrival_id });
            return res.status(400).json({ error: 'Los códigos de aeropuerto deben ser de 3 letras (IATA).' });
        }

        const response = await axios.get("https://serpapi.com/search", {
            params: {
                engine: "google_flights",
                departure_id: departure_id.toUpperCase(),
                arrival_id: arrival_id.toUpperCase(),
                outbound_date: outbound_date,
                return_date: return_date,
                departure_token: departure_token,
                currency: "ARS",
                hl: "es",
                api_key: apiKey,
                deep_search: true 
            },
        });

        const vuelosEncontrados = [];

        if (response.data && response.data.best_flights && Array.isArray(response.data.best_flights)) {
            vuelosEncontrados.push(...response.data.best_flights);
        }

        if (response.data && response.data.other_flights && Array.isArray(response.data.other_flights)) {
            vuelosEncontrados.push(...response.data.other_flights);
        }

        if (vuelosEncontrados.length > 0) {
            return res.json(vuelosEncontrados);
        } else {
            return res.status(404).json({ error: 'No se encontraron resultados para los criterios solicitados.' });
        }

    } catch (error) {
        console.error('Error al buscar vuelos en SerpAPI:', error);
        return res.status(500).json({
            error: 'Error al buscar vuelos en SerpAPI.',
            message: error.message,
            details: error.response ? error.response.data : "Sin detalles adicionales"
        });
    }
};

module.exports = {
    buscarVuelosResultados
};
