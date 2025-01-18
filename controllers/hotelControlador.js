const axios = require("axios");

const obtenerHotel = async (req, res) => {
    try {
        const { location, checkInDate, checkOutDate, adults } = req.query;

        if (!location || !checkInDate || !checkOutDate || !adults) {
            return res.status(400).json({ mensaje: "Faltan parámetros requeridos" });
        }

        const apiKey = process.env.SERP_API_KEY;

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

        const hoteles = response.data.hotels_results || [];

        if (hoteles.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron hoteles para los parámetros especificados" });
        }

        res.status(200).json({ hoteles });

    } catch (error) {
        console.error("Error al obtener los hoteles:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                mensaje: "Error al comunicarse con la API",
                detalles: error.response.data,
            });
        }

        res.status(500).json({ mensaje: "Error al obtener los hoteles", error: error.message });
    }
};

module.exports = { obtenerHotel };
