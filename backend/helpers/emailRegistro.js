// Funcionalidad para enviar el email de registro
import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Destructuring de los datos recibidos
  const { email, nombre, token } = datos;

  // Enviar el email
  // - sendMail recibe un objeto con la configuración del mail a enviar
  const info = await transport.sendMail({
    from: "Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Comprueba tu cuenta",
    text: "Comprueba tu cuenta", // version sin html
    html: `<p> Hola ${nombre}, comprueba tu cuenta</p>
    <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>
    <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>`,
  });
  console.log(`Mensaje enviado: ${info.messageId}`);
};

export default emailRegistro;
