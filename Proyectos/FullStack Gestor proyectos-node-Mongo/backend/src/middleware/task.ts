// Importaciones necesarias de Express
import type { Request, Response, NextFunction } from "express";
// Importación del modelo de Tarea y su interface TypeScript
import Task, { ITask } from "../models/Task";

/**
 * Declaración global para extender los tipos de Express
 * Permite añadir la propiedad 'task' al objeto Request
 */
declare global {
  namespace Express {
    interface Request {
      // Añade la propiedad 'task' al Request (no opcional)
      // Disponible después de ejecutar el middleware taskExists
      task: ITask;
    }
  }
}

/**
 * Middleware para verificar la existencia de una tarea
 * Busca una tarea por su ID en la base de datos
 * Si existe, la adjunta a req.task para uso posterior
 * Si no existe, devuelve un error 404
 *
 * IMPORTANTE: Este middleware NO verifica permisos ni relaciones
 * Solo confirma que la tarea existe en la base de datos
 *
 * @param req - Request de Express (debe contener taskId en params)
 * @param res - Response de Express para enviar respuestas de error
 * @param next - Función para continuar al siguiente middleware o controlador
 */
export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extrae el taskId de los parámetros de la URL
    // Ejemplo: /api/projects/:projectId/tasks/:taskId
    const { taskId } = req.params;

    // Busca la tarea en la base de datos por su ID
    const task = await Task.findById(taskId);

    // Verifica si la tarea existe
    if (!task) {
      // Crea un error descriptivo
      const error = new Error("Tarea no encontrada");
      // 404 Not Found - el recurso solicitado no existe
      return res.status(404).json({ error: error.message });
    }

    // Si la tarea existe, la adjunta al objeto request
    // Ahora req.task estará disponible en los siguientes middlewares
    req.task = task;

    // Continúa al siguiente middleware o controlador
    next();
  } catch (error) {
    // Captura errores como: error de BD, ID inválido (CastError), etc.
    // 500 Internal Server Error
    res.status(500).json({ error: "Hubo un error" });
  }
}

/**
 * Middleware para verificar que una tarea pertenece a un proyecto específico
 * Valida la relación entre la tarea y el proyecto
 *
 * PREREQUISITOS:
 * - req.task debe existir (ejecutar taskExists antes)
 * - req.project debe existir (ejecutar projectExists antes)
 *
 * Este middleware previene que usuarios manipulen tareas de proyectos
 * a los que no pertenecen mediante IDs arbitrarios
 *
 * @param req - Request con task y project ya cargados
 * @param res - Response para enviar error si la validación falla
 * @param next - Función para continuar si la validación es exitosa
 */
export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Compara el ID del proyecto de la tarea con el ID del proyecto en la URL
  // Convierte ambos a string para comparación segura (ObjectId vs string)
  if (req.task.project.toString() !== req.project.id.toString()) {
    // Si no coinciden, significa que intentan manipular una tarea
    // que no pertenece al proyecto especificado en la URL
    const error = new Error("Acción no válida");
    // 400 Bad Request - petición incorrecta/maliciosa
    return res.status(400).json({ error: error.message });
  }

  // Si la tarea pertenece al proyecto, continúa
  next();
}

/**
 * Middleware para verificar que el usuario tiene autorización
 * Valida que el usuario autenticado sea el manager/creador del proyecto
 *
 * PREREQUISITOS:
 * - req.user debe existir (ejecutar authenticate antes)
 * - req.project debe existir (ejecutar projectExists antes)
 *
 * Este middleware se usa para proteger operaciones sensibles como:
 * - Eliminar el proyecto
 * - Modificar configuración del proyecto
 * - Gestionar miembros del equipo
 * - Otras acciones que solo el manager debería realizar
 *
 * @param req - Request con user y project ya cargados
 * @param res - Response para enviar error si no está autorizado
 * @param next - Función para continuar si tiene autorización
 */
export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Compara el ID del usuario autenticado con el ID del manager del proyecto
  // Convierte ambos a string para comparación segura
  if (req.user.id.toString() !== req.project.manager.toString()) {
    // Si no es el manager, no tiene autorización para esta acción
    const error = new Error("Acción no válida");
    // 400 Bad Request (podría ser 403 Forbidden para ser más semántico)
    return res.status(400).json({ error: error.message });
  }

  // Si es el manager, continúa con la operación
  next();
}
