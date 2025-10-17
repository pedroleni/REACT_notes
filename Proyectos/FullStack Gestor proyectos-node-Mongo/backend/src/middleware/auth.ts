// Importaciones necesarias de Express y JSON Web Token
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// Importación del modelo de usuario y su interface
import User, { IUser } from "../models/User";

/**
 * Declaración global para extender los tipos de Express
 * Esto permite añadir propiedades personalizadas al objeto Request
 */
declare global {
  namespace Express {
    interface Request {
      // Añade la propiedad 'user' opcional al Request
      // Esto permitirá acceder a req.user en otros controladores
      user?: IUser;
    }
  }
}

/**
 * Middleware de autenticación para proteger rutas
 * Verifica que la petición incluya un token JWT válido
 * Si el token es válido, adjunta los datos del usuario a req.user
 *
 * @param req - Request de Express (puede contener Authorization header)
 * @param res - Response de Express para enviar respuestas de error
 * @param next - Función para continuar al siguiente middleware o controlador
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extrae el header Authorization de la petición
  // Formato esperado: "Bearer <token>"
  const bearer = req.headers.authorization;

  // Verifica si existe el header Authorization
  if (!bearer) {
    const error = new Error("No Autorizado");
    // 401 Unauthorized - falta autenticación
    return res.status(401).json({ error: error.message });
  }

  // Divide el string "Bearer token" y extrae solo el token
  // [0] = "Bearer", [1] = token
  const [, token] = bearer.split(" ");

  try {
    // Verifica y decodifica el token JWT
    // process.env.JWT_SECRET debe ser la misma clave usada para firmar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica que el payload decodificado sea un objeto y contenga el id
    // JWT puede devolver un string o un objeto
    if (typeof decoded === "object" && decoded.id) {
      // Busca al usuario en la base de datos usando el id del token
      // select() especifica qué campos traer: _id, name y email
      // Esto evita cargar campos sensibles como password
      const user = await User.findById(decoded.id).select("_id name email");

      // Si el usuario existe en la base de datos
      if (user) {
        // Adjunta el usuario al objeto request
        // Ahora req.user estará disponible en los siguientes middlewares/controladores
        req.user = user;

        // Continúa al siguiente middleware o controlador
        next();
      } else {
        // El token es válido pero el usuario ya no existe en la BD
        // Esto puede pasar si el usuario fue eliminado después de generar el token
        res.status(500).json({ error: "Token No Válido" });
      }
    }
  } catch (error) {
    // Captura errores como:
    // - Token expirado (TokenExpiredError)
    // - Token malformado (JsonWebTokenError)
    // - Firma inválida (JsonWebTokenError)
    // - Cualquier otro error de verificación
    res.status(500).json({ error: "Token No Válido" });
  }
};
