const axios = require("axios");

const obtenerProvincias = async (req, res) => {
    const { provincia } = req.query;

    if (!provincia) {
        return res.status(400).json({ error: "Se debe proporcionar el nombre de la provincia" });
    }

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key no configurada" });
    }

    const url = "https://serpapi.com/search";
    const params = {
        engine: "google_maps",
        q: `${provincia}, Argentina`,
        api_key: apiKey,
        hl: "es"
    };

    console.log("Realizando solicitud a SerpAPI con parámetros:", params);

    try {
        const response = await axios.get(url, { params });

        console.log("Respuesta completa de SerpAPI:", response.data);

        if (response.data && response.data.place_results && typeof response.data.place_results === 'object') {
            const place = response.data.place_results;

            console.log(`Title: ${place.title}`);
            console.log(`Photos Link: ${place.photos_link}`);
            if (place.description && place.description.snippet) {
                console.log(`Description: ${place.description.snippet}`);
            }

            if (Array.isArray(place.images)) {
                console.log(`Images: ${place.images.map(image => image.url).join(", ")}`);
            }

            if (Array.isArray(place.at_this_location)) {
                console.log(`At this location: ${place.at_this_location.length} places`);
            }

            return res.json(place);  
        } else {
            console.log("No se encontraron 'place_results' en la respuesta.");
            return res.status(404).json({ error: "No se encontraron lugares para esta provincia" });
        }

    } catch (error) {
        console.error("Error al hacer la solicitud a SerpAPI:", error.message);
        return res.status(error.response ? error.response.status : 500).json({
            error: "Hubo un problema al obtener los lugares",
            message: error.message,
            details: error.response ? error.response.data : "Sin detalles de respuesta",
        });
    }
};

const obtenerLugares = async (req, res) => {
    const { provincia } = req.query;

    console.log("Recibida solicitud para obtener destinos, provincia:", provincia);

    if (!provincia) {
        console.log("Error: No se proporcionó provincia.");
        return res.status(400).json({ error: "Se debe proporcionar el nombre de la provincia" });
    }

    try {
        const apiKey = process.env.SERP_API_KEY;
        if (!apiKey) {
            console.log("Error: La clave API no está configurada.");
            return res.status(500).json({ error: "API key no configurada" });
        }

        console.log("API Key:", apiKey);

        const response = await axios.get("https://serpapi.com/search", {
            params: {
                engine: "google",
                q: `${provincia} Destinations, Argentina`,
                location: "Argentina",
                api_key: apiKey,
                hl: "es",
            },
        });

        console.log("Respuesta completa de SerpAPI:", response.data);

        if (response.data && response.data.local_results && response.data.local_results.length > 0) {
            console.log("Información de destinos encontrada:", response.data.local_results);
            return res.json(response.data.local_results);
        } else {
            console.log("No se encontraron destinos para esta provincia.");
            return res.status(404).json({ error: "No se encontraron destinos para esta provincia" });
        }

    } catch (error) {
        console.error("Error al realizar la solicitud a SerpAPI para destinos:", error);
        console.error("Detalles del error:", error.response ? error.response.data : error.message);

        return res.status(500).json({
            error: "Hubo un problema al obtener los destinos turísticos",
            message: error.message,
            details: error.response ? error.response.data : "Sin detalles de respuesta",
        });
    }
};
  

module.exports = {
    obtenerProvincias,
    obtenerLugares,
};
