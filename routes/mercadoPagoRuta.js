const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const router = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  public_key: process.env.MERCADOPAGO_PUBLIC_KEY,
});

router.post('/mercado', async (req, res) => {
    const { items } = req.body;

    const preference = new Preference(client);
    preference.items = items.map(item => ({
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
    }));
    preference.back_urls = {
        success: 'https://back-tesis-lovat.vercel.app/success',
        failure: 'https://back-tesis-lovat.vercel.app/failure',
        pending: 'https://back-tesis-lovat.vercel.app/pending',
    };
    preference.auto_return = 'approved';

    try {
        const response = await preference.create();
        res.json({
            init_point: response.body.init_point,
        });
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).json({ error: 'Error al crear la preferencia' });
    }
});

// Ruta de éxito
router.get('/success', (req, res) => {
    res.send('Pago realizado con éxito');
});

// Ruta de falla
router.get('/failure', (req, res) => {
    res.send('El pago ha fallado');
});

// Ruta pendiente
router.get('/pending', (req, res) => {
    res.send('El pago está pendiente');
});

module.exports = router;
