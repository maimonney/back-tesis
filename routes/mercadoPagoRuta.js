const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const router = express.Router();

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.error("Error: MERCADOPAGO_ACCESS_TOKEN no está definido");
  process.exit(1);
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  public_key: process.env.MERCADOPAGO_PUBLIC_KEY,
});

router.post("/mercado", async (req, res) => {
  const { items } = req.body;

  console.log("Cuerpo de la solicitud:", req.body);

  const preference = new Preference(client);

  const preferenceData = {
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
  };

  preference.body = preferenceData;

  try {
    console.log("Creando preferencia con datos:", preference.body);
    
    const response = await preference.create();
    
    console.log("Respuesta completa de Mercado Pago:", response);
    
    res.json({
      init_point: response.body.init_point,
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error.message);
    
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    } else {
      console.error("Detalles del error sin response:", error);
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
