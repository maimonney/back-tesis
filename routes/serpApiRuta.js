// serpApiRuta.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Ruta para obtener los lugares de una provincia
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

    // Verifica que la API Key esté correctamente configurada
    console.log("API Key:", apiKey);

    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_maps",
        q: provincia,
        api_key: apiKey,
      },
    });

    console.log("Respuesta de SerpAPI recibida:", response.data);

    if (response.data && response.data.organic_results) {
      console.log("Lugares encontrados:", response.data.organic_results);
      const lugares = response.data.organic_results.map((lugar) => ({
        nombre: lugar.title,
        url: lugar.link,
        descripcion: lugar.snippet,
      }));
      return res.json(lugares);
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

module.exports = router;
