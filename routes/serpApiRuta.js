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
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: provincia,
        api_key: 'fce2e8159dbdd9b9bbfec98bffc70e1c891f67e2845890afb96636a2aa59fa6c',
      },
    });

    if (response.data && response.data.organic_results) {
      const lugares = response.data.organic_results.map((lugar) => ({
        nombre: lugar.title,
        url: lugar.link,
        descripcion: lugar.snippet,
      }));
      res.json(lugares);
    } else {
      res.status(404).json({ error: 'No se encontraron lugares para esta provincia' });
    }
  } catch (error) {
    console.error('Error al realizar la solicitud a SerpAPI:', error);
    
    if (error.response) {
      // Si la respuesta está presente, mostrar la información completa
      console.error('Detalles de la respuesta del error:', error.response.data);
      return res.status(error.response.status || 500).json({
        error: 'Hubo un problema al obtener los lugares',
        message: error.message,
        response: error.response.data,
        status: error.response.status,
      });
    }

    // Si no hay respuesta del servidor, simplemente imprime el error
    console.error('Error sin respuesta:', error.message);
    return res.status(500).json({
      error: 'Hubo un problema al obtener los lugares',
      message: error.message,
    });
  }
});




module.exports = router;
