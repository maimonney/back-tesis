const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/lugares", async (req, res) => {
  const { provincia } = req.query;

  console.log("Recibida solicitud para obtener lugares, provincia:", provincia);

  if (!provincia) {
    console.log("Error: No se proporcionó provincia.");
    return res
      .status(400)
      .json({ error: "Se debe proporcionar el nombre de la provincia" });
  }

  try {
    const apiKey = process.env.SERP_API_KEY;

    console.log("API Key:", apiKey);

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_maps",
        q: `${provincia}, Argentina`,
        location: "Argentina",
        api_key: apiKey,
        hl: "es"
      },
    });

    console.log("Respuesta de SerpAPI recibida:", response.data);

    if (response.data && response.data.place_results) {
      console.log("Información encontrada:", response.data.place_results);
      return res.json(response.data);
    } else {
      console.log("No se encontraron resultados para esta provincia.");
      return res
        .status(404)
        .json({ error: "No se encontraron lugares para esta provincia" });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud a SerpAPI:", error);
    console.error("Detalles del error:", error.response?.data);
    return res.status(500).json({
      error: "Hubo un problema al obtener los lugares",
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
});

router.get("/destinos", async (req, res) => {
  const { provincia } = req.query;

  console.log("Recibida solicitud para obtener destinos, provincia:", provincia);

  if (!provincia) {
    console.log("Error: No se proporcionó provincia.");
    return res
      .status(400)
      .json({ error: "Se debe proporcionar el nombre de la provincia" });
  }

  try {
    const apiKey = process.env.SERP_API_KEY;

    console.log("API Key:", apiKey);

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google",
        q: `${provincia} Destinations, Argentina`,
        location: "Argentina",
        api_key: apiKey,
        hl: "es"
      },
    });

    console.log("Respuesta de SerpAPI para destinos recibida:", response.data);

    if (response.data && response.data.local_results) {
      console.log("Información de destinos encontrada:", response.data.local_results);
      return res.json(response.data.local_results); 
    } else {
      console.log("No se encontraron destinos para esta provincia.");
      return res
        .status(404)
        .json({ error: "No se encontraron destinos para esta provincia" });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud a SerpAPI para destinos:", error);
    console.error("Detalles del error:", error.response?.data);
    return res.status(500).json({
      error: "Hubo un problema al obtener los destinos turísticos",
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
});

module.exports = router;
