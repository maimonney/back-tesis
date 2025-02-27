const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const reservas = require("../models/reservaTourModelo.js");
const usuarios = require("../models/usuarioModelo.js");
const tur = require("../models/turModelo.js");

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
              <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
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
              <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
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
              <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
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
              <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
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
      email,
      name,
      destino,
      salida,
      aerolineaIda,
      aerolineaVuelta,
      fechaIda,
      fechaVuelta,
      precioIda,
      precioVuelta,
      hotel,
      precioHotel,
      total,
    } = req.body;

    if (
      !email ||
      !name ||
      !destino ||
      !salida ||
      !aerolineaVuelta ||
      !fechaIda ||
      !fechaVuelta ||
      !precioIda ||
      !precioVuelta ||
      !hotel ||
      !aerolineaIda ||
      !precioHotel ||
      !total
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

        <h3 style="color: #222725;"><strong>Total pagado:</strong> $${total}</h3>

        <p style="color: red; font-size: 12px;">*Para pagos y cancelaciones, contacta a la aerolínea o al hotel reservado.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
        <hr>
        <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
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

router.post("/cancelacion", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    const { usuarioEmail, guiaEmailValue, reserva } = req.body;
    const { userId, tourId, cantidadPersonas, fechaTour, destino, precio } =
      reserva;

    if (
      !usuarioEmail ||
      !guiaEmailValue ||
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

    const tour = await tur.findById(tourId);

    console.log("Reserva", tourId);
    console.log("Titulo", tour.titulo);

    const tourTitulo = tour.titulo;

    const fechaFormateada = new Date(fechaTour).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mailOptionsUsuario = {
      from: "mailen.monney@davinci.edu.ar",
      to: usuarioEmail,
      subject: "Cancelación de Reserva",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222725; background-color: #f9fafb; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #7E2323; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
            <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
            <h1 style="margin: 0; font-size: 24px;">Cancelación de reserva</h1>
        </div>
        <div style="margin-top: 20px;">
            <p style="text-align: center; font-size: 20px;">Hola <strong>${nombreUsuario}</strong></p>
            <h2 style="color: #A86A36;">Has cancelado tu reserva:</h2>
            <p><strong>Tour:</strong> ${tourTitulo}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Destino:</strong> ${destino}</p>
            <p><strong>Cantidad de personas:</strong> ${cantidadPersonas}</p>
            <p><strong>Precio:</strong> $${precio}</p>
        </div>
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #777;">
            <hr style="margin-left: 50px; margin-right: 50px;">
            <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
            <p style="color: #7E2323;">Para cancelaciones, comuníquese con el guía.</p>
        </div>
    </div>
</div>
      `,
    };

    const mailOptionsGuia = {
      from: "mailen.monney@davinci.edu.ar",
      to: guiaEmailValue,
      subject: "Cancelación de Reserva",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #7E2323; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
            <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
            <h1 style="margin: 0; font-size: 24px;">Cancelación de reserva</h1>
        </div>
        <div style="margin-top: 20px;">
            <h2 style="color: #A86A36;">Datos de la reserva</h2>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Usuario:</strong> ${nombreUsuario}</li>
                <li style="margin-bottom: 10px;"><strong>Tour:</strong> ${tourTitulo}</li>
                <li style="margin-bottom: 10px;"><strong>Cantidad de personas:</strong> ${cantidadPersonas}</li>
                <li style="margin-bottom: 10px;"><strong>Fecha:</strong> ${fechaFormateada}</li>
                <li style="margin-bottom: 10px;"><strong>Destino:</strong> ${destino}</li>
                <li style="margin-bottom: 10px;"><strong>Precio:</strong> $${precio}</li>
            </ul>
        </div>
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #777; width: 80%; max-width: 300px; margin-left: auto; margin-right: auto;">
            <hr style="margin-left: 50px; margin-right: 50px;">
            <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
            <p style="color: #7E2323;">Para cancelaciones, comuníquese directamente con el usuario que realizó la reserva.</p>
        </div>
    </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptionsUsuario);
    await transporter.sendMail(mailOptionsGuia);

    res
      .status(200)
      .json({ message: "Correo de cancelación enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar el correo de cancelación:", error);
    res.status(500).json({
      message: "Hubo un error al enviar el correo de cancelación.",
      error: error.message,
    });
  }
});

router.post("/contact", (req, res) => {
  console.log(req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log("Faltan campos requeridos");
    return res.status(400).send("Por favor, completa todos los campos.");
  }

  const mailToYou = {
    from: email,
    to: "mailen.monney@davinci.edu.ar",
    subject: `Nuevo mensaje de ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
            <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
            <h1 style="margin: 0; font-size: 24px;">Nuevo mensaje de ${name}</h1>
        </div>

        <div style="margin-top: 20px;">
            <p style="font-size: 16px;">Tienes un nuevo mensaje de <strong>${name}</strong> con los siguientes detalles:</p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</li>
                <li style="margin-bottom: 10px;"><strong>Correo:</strong> ${email}</li>
                <li style="margin-bottom: 10px;"><strong>Mensaje:</strong> ${message}</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 100px; font-size: 12px; color: #777;">
            <hr style="margin-left: 50px; margin-right: 50px;">
            <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
            <p>Mensaje enviado desde la landing page.</p>
        </div>
    </div>
</body>`,
  };

  const mailToUser = {
    from: "mailen.monney@davinci.edu.ar",
    to: email,
    subject: "Confirmación de envío de mensaje",
    text: `Hola ${name},\n\nTu mensaje ha sido recibido correctamente. A continuación, te mostramos la información que enviaste:\n\nNombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    html: `
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #788a68; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-around;">
            <img src="https://arcanatur.ar/img/iso_arcana.png" style="width: 50px; height: auto; margin-right: 10px;">
            <h1 style="margin: 0; font-size: 24px;">Confirmación de mensaje</h1>
        </div>

        <div style="margin-top: 20px;">
            <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">Tu mensaje ha sido recibido correctamente. A continuación, te mostramos la información que enviaste:</p>
            <ul style="list-style-type: none; padding: 0; font-size: 16px;">
                <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</li>
                <li style="margin-bottom: 10px;"><strong>Correo:</strong> ${email}</li>
                <li style="margin-bottom: 10px;"><strong>Mensaje:</strong> ${message}</li>
            </ul>
            <div style="text-align: center; margin-top: 60px;">
                <a href="http://arcanatur.ar" style="background-color: #788a68; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; text-align: center; display: inline-block; font-weight: bold; margin-top: 20px;">Visita nuestro sitio</a>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
            <hr style="margin-left: 50px; margin-right: 50px;">
            <img src="https://arcanatur.ar/img/logo_arcana.png" style="width: 150px; height: auto;">
            <p>Gracias por contactarnos.</p>
            <p>Si no has realizado esta solicitud, por favor ignora este correo.</p>
        </div>
    </div>
</body>`,
  };

  transporter.sendMail(mailToYou, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo a ti:", error);
      return res
        .status(500)
        .send("Error al enviar el correo. Por favor, inténtalo nuevamente.");
    }
    console.log("Correo enviado a ti: " + info.response);

    transporter.sendMail(mailToUser, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo al usuario:", error);
        return res
          .status(500)
          .send(
            "Error al enviar el correo de confirmación. Por favor, inténtalo nuevamente."
          );
      }
      console.log("Correo enviado al usuario: " + info.response);
      res
        .status(200)
        .json({ success: true, message: "Correo enviado exitosamente" });
    });
  });
});

module.exports = router;
