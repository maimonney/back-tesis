const nodemailer = require('nodemailer');
require('dotenv').config();
const passMail = process.env.CLAVE_MAIL;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mailen.monney@davinci.edu.ar',
    pass: passMail,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/');
});

app.post('/contact', (req, res) => {
  console.log(req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('Faltan campos requeridos');
    return res.status(400).send('Por favor, completa todos los campos.');
  }

  const mailToYou = {
    from: email,
    to: 'mailen.monney@davinci.edu.ar',
    subject: `Nuevo mensaje de ${name}`,
    text: `Mensaje de ${name} (${email}):\n\n${message}`,
    html: `
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #222725; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Logo Arcana" style="width: 150px; height: auto;">
                <h1>Nuevo mensaje de ${name}</h1>
            </div>
            <div style="margin-top: 20px;">
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</li>
                    <li style="margin-bottom: 10px;"><strong>Correo:</strong> ${email}</li>
                    <li style="margin-bottom: 10px;"><strong>Mensaje:</strong> ${message}</li>
                </ul>
            </div>
        </div>
    </body>`
  };

  const mailToUser = {
    from: 'mailen.monney@davinci.edu.ar',
    to: email,
    subject: 'Confirmación de envío de mensaje',
    text: `Hola ${name},\n\nTu mensaje ha sido recibido correctamente. A continuación, te mostramos la información que enviaste:\n\nNombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    html: `
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #222725; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Logo Arcana" style="width: 150px; height: auto;">
                <h1>Confirmación de mensaje</h1>
            </div>
            <div style="margin-top: 20px;">
                <p>Hola <strong>${name}</strong>,</p>
                <p>Tu mensaje ha sido recibido correctamente. A continuación, te mostramos la información que enviaste:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</li>
                    <li style="margin-bottom: 10px;"><strong>Correo:</strong> ${email}</li>
                    <li style="margin-bottom: 10px;"><strong>Mensaje:</strong> ${message}</li>
                </ul>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://tusitio.com" style="background-color: #222725; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; text-align: center; display: inline-block; font-weight: bold; margin-top: 20px;">Visita nuestro sitio</a>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
                <p>Gracias por contactarnos. Si no has realizado esta solicitud, por favor ignora este correo.</p>
            </div>
        </div>
    </body>`
  };

  transporter.sendMail(mailToYou, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo a ti:', error);
      return res.status(500).send('Error al enviar el correo. Por favor, inténtalo nuevamente.');
    }
    console.log('Correo enviado a ti: ' + info.response);

    transporter.sendMail(mailToUser, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo al usuario:', error);
        return res.status(500).send('Error al enviar el correo de confirmación. Por favor, inténtalo nuevamente.');
      }
      console.log('Correo enviado al usuario: ' + info.response);
      res.redirect('/?success=true');  
    });
  });
});