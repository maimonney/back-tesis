const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const router = express.Router();

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.error("ERROR: MERCADOPAGO_ACCESS_TOKEN no está definido.");
}

const client = new MercadoPagoConfig({ accessToken });

router.post("/mercado", async (req, res) => {
  const { items } = req.body;

  console.log("Cuerpo de la solicitud:", req.body);

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Formato de datos incorrecto, se esperaba un array de items." });
  }

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "ARS",
        })),
        back_urls: {
          success: "https://back-tesis-lovat.vercel.app/success",
          failure: "https://back-tesis-lovat.vercel.app/failure",
          pending: "https://back-tesis-lovat.vercel.app/pending",
        },
        auto_return: "approved",
      },
    });

    console.log("Respuesta de Mercado Pago:", JSON.stringify(response, null, 2)); 
    console.log("init_point:", response.init_point); 

    const initPoint = response?.body?.init_point;
    
    if (initPoint) {
      res.json({ init_point: initPoint });
    } else {
      console.error("Error: No se recibió un init_point en la respuesta.");
      res.status(500).json({ error: "No se obtuvo un init_point de Mercado Pago", response: response.body });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    if (error.response) {
      console.error("Detalles del error de Mercado Pago:", error.response.data);
    }
    res.status(500).json({ error: "Error al crear la preferencia", details: error.message });
  }
});


router.get("/success", (req, res) => {
  console.log("Pago realizado con éxito");
  res.send("Pago realizado con éxito");
});

router.get("/failure", (req, res) => {
  console.log("El pago ha fallado");
  res.send("El pago ha fallado");
});

router.get("/pending", (req, res) => {
  console.log("El pago está pendiente");
  res.send("El pago está pendiente");
});

module.exports = router;
