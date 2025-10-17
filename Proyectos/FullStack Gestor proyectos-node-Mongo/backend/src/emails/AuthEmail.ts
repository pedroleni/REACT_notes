// Importación del transportador de Nodemailer configurado previamente
import { transporter } from "../config/nodemailer";

/**
 * Interface que define la estructura de datos del usuario para enviar emails
 * @property email - Dirección de email del destinatario
 * @property name - Nombre del usuario para personalizar el mensaje
 * @property token - Token de verificación/autenticación generado
 */
interface IEmail {
  email: string;
  name: string;
  token: string;
}

/**
 * Clase que gestiona el envío de emails de autenticación
 * Utiliza Nodemailer para enviar correos transaccionales
 * Todos los métodos son estáticos para no requerir instanciación
 */
export class AuthEmail {
  /**
   * Envía un email de confirmación de cuenta al usuario registrado
   * Incluye un token que el usuario debe ingresar para verificar su cuenta
   * @param user - Objeto con los datos del usuario (email, nombre y token)
   * @returns Promise que se resuelve cuando el email es enviado
   */
  static sendConfirmationEmail = async (user: IEmail) => {
    // Envía el email usando el transportador de Nodemailer
    const info = await transporter.sendMail({
      // Remitente del email (nombre y dirección)
      from: "Nexus Pro <admin@NexusPro.com>",

      // Destinatario (email del usuario)
      to: user.email,

      // Asunto del email
      subject: "Nexus Pro - Confirma tu cuenta",

      // Versión texto plano (para clientes que no soportan HTML)
      text: "Nexus Pro - Confirma tu cuenta",

      // Contenido HTML del email
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Nexus Pro, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `,
    });

    // Log en consola para debugging (ID único del mensaje enviado)
    console.log("Mensaje enviado", info.messageId);
  };

  /**
   * Envía un email con token para restablecer la contraseña
   * Se activa cuando el usuario solicita recuperar su contraseña
   * @param user - Objeto con los datos del usuario (email, nombre y token)
   * @returns Promise que se resuelve cuando el email es enviado
   */
  static sendPasswordResetToken = async (user: IEmail) => {
    // Envía el email usando el transportador de Nodemailer
    const info = await transporter.sendMail({
      // Remitente del email
      from: "Nexus Pro <admin@NexusPro.com>",

      // Destinatario
      to: user.email,

      // Asunto específico para reset de password
      subject: "NexusPro - Reestablece tu password",

      // Versión texto plano
      text: "NexusPro - Reestablece tu password",

      // Contenido HTML del email
      // Incluye enlace al formulario de nueva contraseña y el token
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `,
    });

    // Log del ID del mensaje para seguimiento
    console.log("Mensaje enviado", info.messageId);
  };
}
