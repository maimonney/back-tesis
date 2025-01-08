const express = require('express');
const axios = require('axios');
const router = express.Router();

const serpApiClient = axios.create({
  baseURL: 'https://serpapi.com',
  timeout: 10000,
});

router.get('/lugares', async (req, res) => {
  const { provincia } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 

  if (!provincia) {
    return res.status(400).json({ error: 'Se debe proporcionar el nombre de la provincia' });
  }

  try {
    const response = await serpApiClient.get('/search', {
      params: {
        engine: 'google_maps',  
        q: provincia,         
        api_key: process.env.SERP_API_KEY, 
      }
    });

    if (response.data && response.data.organic_results) {
      const lugares = response.data.organic_results.map(lugar => ({
        nombre: lugar.title,
        url: lugar.link,
        descripcion: lugar.snippet
      }));
      res.json(lugares);
    } else {
      res.status(404).json({ error: 'No se encontraron lugares para esta provincia' });
    }

  } catch (error) {
    console.error('Error al obtener lugares:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener los lugares' });
  }
});

module.exports = router;
