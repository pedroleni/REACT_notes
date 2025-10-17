// Importaciones necesarias de Express
import type { Request, Response, NextFunction } from "express";
// Importación de express-validator para validar datos de entrada
import { validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación de entrada
 *
 * Este middleware trabaja en conjunto con express-validator
 * Recopila y procesa los errores de validación acumulados por las
 * reglas de validación definidas previamente en la cadena de middlewares
 *
 * Si hay errores de validación:
 *   - Devuelve un error 400 con la lista de errores
 *   - Detiene la ejecución (no llama a next())
 *
 * Si NO hay errores:
 *   - Continúa al siguiente middleware o controlador
 *
 * IMPORTANTE: Este middleware debe colocarse DESPUÉS de las reglas
 * de validación en la cadena de middlewares
 *
 * @param req - Request de Express (contiene los datos validados)
 * @param res - Response para enviar el error si hay validaciones fallidas
 * @param next - Función para continuar si no hay errores
 */
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extrae los resultados de validación del request
  // validationResult() recopila todos los errores generados por
  // las reglas de validación (body(), param(), query(), etc.)
  let errors = validationResult(req);

  // Verifica si hay errores de validación
  // isEmpty() devuelve true si NO hay errores
  if (!errors.isEmpty()) {
    // Si hay errores, devuelve respuesta con código 400 Bad Request
    // errors.array() convierte los errores a un array de objetos
    // Cada error contiene: field, message, value, location
    return res.status(400).json({ errors: errors.array() });
  }

  // Si no hay errores, continúa al siguiente middleware o controlador
  next();
};
