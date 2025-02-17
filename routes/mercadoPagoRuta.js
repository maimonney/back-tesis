const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const router = express.Router();

// Configuración de Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

if (!accessToken) {
  console.error("ERROR: MERCADOPAGO_ACCESS_TOKEN no está definido.");
}

const client = new MercadoPagoConfig({
  accessToken: accessToken,
  public_key: publicKey,
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

  console.log("Creando preferencia con datos:", preferenceData);

  try {
    const response = await preference.create(preferenceData);

    if (response && response.body) {
      res.json({
        init_point: response.body.init_point,
      });
    } else {
      console.error("La respuesta de Mercado Pago es inválida:", response);
      res.status(500).json({ error: "Error en la respuesta de Mercado Pago" });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error.message);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
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
