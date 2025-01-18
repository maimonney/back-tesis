const axios = require("axios");

const obtenerHotel = async (req, res) => {
    try {
        const { location, checkInDate, checkOutDate, adults } = req.query;
        console.log("Parámetros recibidos:", { location, checkInDate, checkOutDate, adults });

        if (!location || !checkInDate || !checkOutDate || !adults) {
            console.log("Faltan parámetros requeridos");
            return res.status(400).json({ mensaje: "Faltan parámetros requeridos" });
        }

        const apiKey = process.env.SERP_API_KEY;
        console.log("Clave API:", apiKey ? "Presente" : "No presente");

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

        console.log("Respuesta de la API recibida:", response.data);

        const hoteles = response.data.hotels_results || [];
        console.log("Hoteles encontrados:", hoteles);

        if (hoteles.length === 0) {
            console.log("No se encontraron hoteles");
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
