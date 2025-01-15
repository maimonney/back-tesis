// serpApiRuta.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ruta para obtener los lugares de una provincia
router.get('/lugares', async (req, res) => {
  const { provincia } = req.query;

  if (!provincia) {
    return res.status(400).json({ error: 'Se debe proporcionar el nombre de la provincia' });
  }

  try {
    const response = await axios.get('https://api.serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: provincia,
        api_key: process.env.SERP_API_KEY,
      },
    });

    if (response.data && response.data.organic_results) {
      const lugares = response.data.organic_results.map(lugar => ({
        nombre: lugar.title,
        url: lugar.link,
        descripcion: lugar.snippet,
      }));
      res.json(lugares);
    } else {
      res.status(404).json({ error: 'No se encontraron lugares para esta provincia' });
    }
  } catch (error) {
    console.error('Error al obtener lugares:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Hubo un problema al obtener los lugares',
      detalle: error.response?.data || error.message,
    });
  }
});


module.exports = router;
