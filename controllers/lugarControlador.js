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
        hl: "es",
        image_size: "large",
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

            const dataId = place.data_id || null;
            console.log(`Data ID: ${dataId}`);

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

const obtenerProvinciasPopulares = async (req, res) => {
  const provinciasPopulares = ['Buenos Aires', 'Misiones', 'Salta', 'Córdoba', 'Mendoza', 'Tucumán'];
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
      return res.status(500).json({ error: "API key no configurada" });
  }

  const url = "https://serpapi.com/search";
  
  const promises = provinciasPopulares.map((provincia) => {
      const params = {
          engine: "google_maps",
          q: `${provincia}, Argentina`,
          api_key: apiKey,
          hl: "es",
          image_size: "large",
      };

      return axios.get(url, { params })
          .then(response => {
              if (response.data && response.data.place_results) {
                  const place = response.data.place_results;
                  return {
                      provincia: provincia,
                      title: place.title,
                      description: place.description?.snippet || "No description available",
                      images: place.images?.map(image => image.url) || [],
                      photosLink: place.photos_link || null
                  };
              }
          })
          .catch(error => {
              console.error(`Error al obtener provincia ${provincia}:`, error.message);
              return null; 
          });
  });

  try {
      const results = await Promise.all(promises); 

      const filteredResults = results.filter(result => result !== null);
      return res.json(filteredResults);
  } catch (error) {
      console.error("Error en la obtención de provincias:", error.message);
      return res.status(500).json({ error: "Hubo un problema al obtener las provincias populares" });
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
          q: `Lugares para visitar en ${provincia}, Argentina`,
          location: "Argentina",
          api_key: apiKey,  
          hl: "es",  
          image_size: "large",
        },
      });
  
      console.log("Respuesta completa de SerpAPI:", response.data);
  
    if (response.data && response.data.top_sights && response.data.top_sights.sights && response.data.top_sights.sights.length > 0) {
        console.log("Información de lugares turísticos encontrada:", response.data.top_sights.sights);
  
        const lugares = response.data.top_sights.sights.map(lugar => {
          return {
            title: lugar.title,
            description: lugar.description,
            rating: lugar.rating,
            reviews: lugar.reviews,
            price: lugar.price || 'Gratis',
            thumbnail: lugar.thumbnail,
          };
        });
  
        return res.json(lugares);  
      } else {
        console.log("No se encontraron lugares turísticos para esta provincia.");
        return res.status(404).json({ error: "No se encontraron lugares turísticos para esta provincia" });
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

  const obtenerInfoLugar = (req, res) => {
    const { provincia } = req.query;

    search.json({
        engine: "google_maps",
        q: provincia,
        hl: "es",
        type: "search"
    }, (data) => {
        if (!data.place_results) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        const lugar = {
            nombre: data.place_results.title,
            direccion: data.place_results.address,
            telefono: data.place_results.phone || "No disponible",
            sitio_web: data.place_results.website || "No disponible",
            imagen: data.place_results.thumbnail || "No disponible",
            rating: data.place_results.rating || "No disponible",
            opiniones: data.place_results.reviews || []
        };

        res.json(lugar);
    });
};

const obtenerImagenLugar = async (req, res) => {
    const { data_id } = req.query;

    if (!data_id) {
        return res.status(400).json({ error: "Se debe proporcionar el data_id" });
    }

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key no configurada" });
    }

    const url = "https://serpapi.com/search";
    const params = {
        engine: "google_maps_photos",
        data_id: data_id,
        api_key: apiKey,
    };

    console.log("Realizando solicitud a SerpAPI con parámetros:", params);

    try {
        const response = await axios.get(url, { params });

        console.log("Respuesta completa de imágenes:", response.data);

        if (response.data && Array.isArray(response.data.photos) && response.data.photos.length > 0) {
            console.log("Imágenes encontradas:", response.data.photos.map(photo => photo.image).join(", "));
            return res.json({ images: response.data.photos.map(photo => photo.image) });
        } else {
            return res.status(404).json({ error: "No se encontraron imágenes para este lugar" });
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

module.exports = {
    obtenerProvincias,
    obtenerProvinciasPopulares,
    obtenerLugares,
    obtenerImagenLugar,
    obtenerInfoLugar,
};
