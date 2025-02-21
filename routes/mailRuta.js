const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const reserva = require('../models/reservaTourModelo'); // Reserva de tour
const usuarios = require('../models/usuarioModelo'); // Información de los usuarios y guías
const itinerario = require('../models/itinerarioModelo'); // Itinerario del viaje

const router = express.Router();
const passMail = process.env.CLAVE_MAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mailen.monney@davinci.edu.ar",
    pass: passMail,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/reserva", async (req, res) => {
  try {
    // Log para ver los datos recibidos
    console.log('Datos recibidos:', req.body);

    // Acceder a los datos dentro de 'reserva'
    const { userId, tourId, cantidadPersonas, fechaTour, destino } = req.body.reserva;

    // Verificar si faltan datos
    if (!userId || !tourId || !cantidadPersonas || !fechaTour || !destino) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Buscar usuario, tour y guía
    const usuario = await usuarios.findById(userId);
    const tour = await itinerario.findById(tourId);
    const guia = await usuarios.findById(tour.guiaId); 

    // Verificación de existencia de usuario, tour y guía
    if (!usuario || !tour || !guia) {
      console.error('Datos no encontrados:', { usuario, tour, guia });
      return res.status(400).json({ message: "Datos no válidos" });
    }

    // Crear nueva reserva
    const nuevaReserva = new reserva({
      usuarioId: usuario._id,
      tourId: tour._id,
      cantidad: cantidadPersonas,
      fecha: fechaTour,
      destino: destino,
    });
    await nuevaReserva.save();

    // Log para confirmar que la reserva se ha guardado
    console.log('Reserva guardada:', nuevaReserva);

    // Preparar los correos
    const mailOptionsUsuario = {
      from: 'mailen.monney@davinci.edu.ar',
      to: usuarioEmail,
      subject: 'Confirmación de Reserva',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
              <img src="img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
              <h1 style="margin: 0; font-size: 24px;">Confirmación de reserva</h1>
            </div>
            <div style="margin-top: 20px;">
              <p style="text-align: center; font-size: 20px;">Hola <strong>${usuario.nombre}</strong></p>
              <h2 style="color: #A86A36;">Tu reserva ha sido registrada:</h2>
              <p><strong>Tour:</strong> ${tour.titulo}</p>
              <h2 style="color: #A86A36;">Información del guía</h2>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Nombre del guía:</strong> ${guia.nombre}</li>
                <li style="margin-bottom: 10px;"><strong>Email:</strong> ${guia.email}</li>
                <li style="margin-bottom: 10px;"><strong>Teléfono:</strong> ${guia.telefono}</li>
              </ul>
              <p><strong>Precio:</strong> $ ${tour.precio}</p>
              <p style="color: red; font-size: 12px;">*Cuestiones de pago y cancelaciones, hablar directamente con el guía.</p>
            </div>
            <div style="text-align: center; margin-top: 100px; font-size: 12px; color: #777;">
              <hr style="margin-left: 50px; margin-right: 50px;">
              <img src="img/logo_arcana.png" style="width: 150px; height: auto;">
              <p>Gracias por reservar con nosotros.</p>
            </div>
          </div>
        </div>
      `,
    };

    const mailOptionsGuia = {
      from: 'mailen.monney@davinci.edu.ar',
      to: guiaEmail,
      subject: 'Nueva Reserva',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
              <img src="img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
              <h1 style="margin: 0; font-size: 24px;">Nueva reserva</h1>
            </div>
            <div style="margin-top: 20px;">
              <h2 style="color: #A86A36;">Datos de la reserva</h2>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Nombre del usuario:</strong> ${usuario.nombre}</li>
                <li style="margin-bottom: 10px;"><strong>Título del tour:</strong> ${tour.titulo}</li>
                <li style="margin-bottom: 10px;"><strong>Cantidad de personas:</strong> ${cantidadPersonas}</li>
                <li style="margin-bottom: 10px;"><strong>Fecha:</strong> ${fechaTour}</li>
                <li style="margin-bottom: 10px;"><strong>Precio:</strong> $${tour.precio}</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 100px; font-size: 12px; color: #777; width: 80%; max-width: 300px; margin-left: auto; margin-right: auto;">
              <hr style="margin-left: 50px; margin-right: 50px;">
              <img src="img/logo_arcana.png" style="width: 150px; height: auto;">
              <p>El pago y cualquier otra consulta deberán coordinarse directamente con el usuario que realizó la reserva.</p>
            </div>
          </div>
        </div>
      `,
    };

    // Log para confirmar los correos antes de enviarlos
    console.log('Enviando correo al usuario:', mailOptionsUsuario);
    console.log('Enviando correo al guía:', mailOptionsGuia);

    // Enviar los correos
    await transporter.sendMail(mailOptionsUsuario);
    await transporter.sendMail(mailOptionsGuia);

    // Responder al cliente
    res.status(200).json({ message: "Reserva realizada y correos enviados." });

  } catch (error) {
    console.error('Error al procesar la reserva:', error);
    res.status(500).json({ message: "Hubo un error al realizar la reserva.", error: error.message });
  }
});


module.exports = router;
