const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const reservas = require("../models/reservaTourModelo.js");
const usuarios = require("../models/usuarioModelo.js");

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
    console.log("Datos recibidos:", req.body);

    const { usuarioEmail, guiaEmail, reserva } = req.body;
    const { userId, tourId, cantidadPersonas, fechaTour, destino, precio } =
      reserva;

    if (
      !usuarioEmail ||
      !guiaEmail ||
      !userId ||
      !tourId ||
      !cantidadPersonas ||
      !fechaTour ||
      !destino ||
      !precio
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos requeridos para enviar el correo." });
    }

    const usuario = await usuarios.findById(userId);
    const nombreUsuario = usuario ? usuario.nombre : "Usuario desconocido";

    const tour = await reservas.findById(tourId);

    console.log(tour);

    const tourTitulo = tour ? tour.titulo : "Tour desconocido";

    const fechaFormateada = new Date(fechaTour).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mailOptionsUsuario = {
      from: "mailen.monney@davinci.edu.ar",
      to: usuarioEmail,
      subject: "Confirmación de Reserva",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
              <img src="img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
              <h1 style="margin: 0; font-size: 24px;">Confirmación de reserva</h1>
            </div>
            <div style="margin-top: 20px;">
              <p style="text-align: center; font-size: 20px;">Hola <strong>${nombreUsuario}</strong></p>
              <h2 style="color: #A86A36;">Tu reserva ha sido registrada:</h2>
              <p><strong>Tour:</strong> ${reserva.tourTitulo}</p>
              <p><strong>Fecha:</strong> ${fechaFormateada}</p>
              <p><strong>Destino:</strong> ${destino}</p>
              <p><strong>Cantidad de personas:</strong> ${cantidadPersonas}</p>
              <p><strong>Precio:</strong> $${precio}</p>
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
      from: "mailen.monney@davinci.edu.ar",
      to: guiaEmail,
      subject: "Nueva Reserva",
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
                <li style="margin-bottom: 10px;"><strong>Usuario:</strong> ${nombreUsuario}</li>
                <li style="margin-bottom: 10px;"><strong>Tour:</strong> ${reserva.tourTitulo}</li>
                <li style="margin-bottom: 10px;"><strong>Cantidad de personas:</strong> ${cantidadPersonas}</li>
                <li style="margin-bottom: 10px;"><strong>Fecha:</strong> ${fechaFormateada}</li>
                <li style="margin-bottom: 10px;"><strong>Destino:</strong> ${destino}</li>
                <li style="margin-bottom: 10px;"><strong>Precio:</strong> $${precio}</li>
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

    await transporter.sendMail(mailOptionsUsuario);
    await transporter.sendMail(mailOptionsGuia);

    res.status(200).json({ message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({
      message: "Hubo un error al enviar el correo.",
      error: error.message,
    });
  }
});

router.post("/reservaViaje", async (req, res) => {
  try {
    let {
      email, name, destino, salida, aerolineaIda, aerolineaVuelta, fechaIda, fechaVuelta, precioIda, precioVuelta, hotel, precioHotel, total,
    } = req.body;

    if (
      !email || !name || !destino || !salida || !aerolineaVuelta || !fechaIda || !fechaVuelta || !precioIda || !precioVuelta || !hotel || !aerolineaIda || !precioHotel || !total
    ) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Confirmación de reserva de viaje</h1>
      </div>
      <div style="margin-top: 20px;">
        <p style="text-align: center; font-size: 20px;">Hola <strong>${name}</strong></p>
        <h2 style="color: #A86A36;">Tu reserva ha sido registrada:</h2>
        <p><strong>Destino:</strong> ${destino}</p>
        
        <h2 style="color: #A86A36;">Detalles de la reserva</h2>

        <h3 style="color: #788a68;">Información de ida</h3>
        <ul>
          <li><strong>Salida:</strong> ${salida}</li>
          <li><strong>Aerolínea:</strong> ${aerolineaIda}</li>
          <li><strong>Fecha:</strong> ${fechaIda}</li>
          <li><strong>Precio:</strong> $${precioIda}</li>
        </ul>

        <h3 style="color: #788a68;">Información de vuelta</h3>
        <ul>
          <li><strong>Regreso desde:</strong> ${destino}</li>
          <li><strong>Aerolínea:</strong> ${aerolineaVuelta}</li>
          <li><strong>Fecha:</strong> ${fechaVuelta}</li>
          <li><strong>Precio:</strong> $${precioVuelta}</li>
        </ul>

        <h3 style="color: #788a68;">Información del hotel</h3>
        <ul>
          <li><strong>Nombre:</strong> ${hotel}</li>
          <li><strong>Precio:</strong> $${precioHotel}</li>
        </ul>

        <h3 style="color: #788a68;">Total pagado</h3>
        <p><strong>Total:</strong> $${total}</p>

        <p style="color: red; font-size: 12px;">*Para pagos y cancelaciones, contacta a la aerolínea o al hotel reservado.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
        <hr>
        <p>Gracias por reservar con nosotros.</p>
      </div>
    </div>
  </div>
`;

    const mailOptions = {
      from: "Arcana",
      to: email,
      subject: "Confirmación de reserva de viaje",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado:", info.response);

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ error: "Error al enviar el correo", detalle: error.message });
  }
});


module.exports = router;
