const axios = require("axios");

const obtenerHotel = async (req, res) => {
    try {
        const { q, check_in_date, check_out_date, adults } = req.query;
        console.log("Parámetros recibidos:", { q, check_in_date, check_out_date, adults });

        if (!q || !check_in_date || !check_out_date) {
            console.log("Faltan parámetros requeridos");
            return res.status(400).json({ mensaje: "Faltan parámetros requeridos" });
        }

        const apiKey = process.env.SERP_API_KEY;
        console.log("Clave API:", apiKey ? "Presente" : "No presente");

        if (!apiKey) {
            return res.status(500).json({ mensaje: "Clave API no configurada correctamente" });
        }

        const response = await axios.get("https://serpapi.com/search.json", {
            params: {
                engine: "google_hotels",
                q: q,
                check_in_date: check_in_date,
                check_out_date: check_out_date,
                adults: adults,
                currency: "ARS",  
                hl: "es",  
                gl: "ar",
                api_key: apiKey,
                deep_search: true,
            },
        });

        console.log("Respuesta completa de la API recibida:", response.data);

        const hoteles = response.data.properties || [];
        console.log("Hoteles encontrados:", hoteles);

        if (hoteles.length === 0) {
            console.log("No se encontraron hoteles para los parámetros especificados");
            return res.status(404).json({ mensaje: "No se encontraron hoteles para los parámetros especificados" });
        }

        res.status(200).json({ hoteles });

    } catch (error) {
        console.error("Error al obtener los hoteles:", error);

        if (error.response) {
            console.error("Detalles del error de la API:", error.response.data);
            return res.status(error.response.status).json({
                mensaje: "Error al comunicarse con la API",
                detalles: error.response.data,
            });
        }

        if (error.request) {
            console.error("Error de solicitud:", error.request);
            return res.status(500).json({
                mensaje: "Error de comunicación con la API (posible problema de red)",
                detalles: error.request,
            });
        }

        console.error("Error inesperado:", error.message);
        res.status(500).json({
            mensaje: "Error al obtener los hoteles",
            error: error.message,
        });
    }
};

module.exports = { obtenerHotel };
