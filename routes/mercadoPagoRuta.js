const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const router = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  public_key: process.env.MERCADOPAGO_PUBLIC_KEY,
});

router.post('/mercado', async (req, res) => {
    const { items } = req.body;

    console.log('Cuerpo de la solicitud:', req.body);

    console.log('Token de acceso:', process.env.MERCADOPAGO_ACCESS_TOKEN);

    const preference = new Preference(client);
    preference.items = items.map(item => {
        console.log('Procesando item:', item);
        return {
            title: item.title,
            unit_price: item.price,
            quantity: item.quantity,
        };
    });

    preference.back_urls = {
        success: 'https://back-tesis-lovat.vercel.app/success',
        failure: 'https://back-tesis-lovat.vercel.app/failure',
        pending: 'https://back-tesis-lovat.vercel.app/pending',
    };
    
    preference.auto_return = 'approved';

    try {
        console.log('Creando preferencia...');
        const response = await preference.create();

        console.log('Respuesta de Mercado Pago:', response.body);

        res.json({
            init_point: response.body.init_point,
        });
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).json({ error: 'Error al crear la preferencia' });
    }
});

router.get('/success', (req, res) => {
    console.log('Pago realizado con éxito');
    res.send('Pago realizado con éxito');
});

router.get('/failure', (req, res) => {
    console.log('El pago ha fallado');
    res.send('El pago ha fallado');
});

router.get('/pending', (req, res) => {
    console.log('El pago está pendiente');
    res.send('El pago está pendiente');
});

module.exports = router;
