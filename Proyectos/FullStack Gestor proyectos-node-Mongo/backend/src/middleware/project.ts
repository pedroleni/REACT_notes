// Importaciones necesarias de Express
import type { Request, Response, NextFunction } from "express";
// Importación del modelo de Proyecto y su interface TypeScript
import Project, { IProject } from "../models/Project";

/**
 * Declaración global para extender los tipos de Express
 * Esto permite añadir propiedades personalizadas al objeto Request
 */
declare global {
  namespace Express {
    interface Request {
      // Añade la propiedad 'project' al Request (no opcional)
      // Esto permitirá acceder a req.project en controladores posteriores
      // con la garantía de que existe si este middleware se ejecutó exitosamente
      project: IProject;
    }
  }
}

/**
 * Middleware para verificar la existencia de un proyecto
 * Busca un proyecto por su ID en la base de datos
 * Si existe, lo adjunta a req.project para uso posterior
 * Si no existe, devuelve un error 404
 *
 * Este middleware debe ejecutarse ANTES de cualquier controlador
 * que necesite trabajar con un proyecto específico
 *
 * @param req - Request de Express (debe contener projectId en params)
 * @param res - Response de Express para enviar respuestas de error
 * @param next - Función para continuar al siguiente middleware o controlador
 */
export async function projectExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extrae el projectId de los parámetros de la URL
    // Ejemplo: /api/projects/:projectId/tasks
    const { projectId } = req.params;

    // Busca el proyecto en la base de datos por su ID
    // findById es un método de Mongoose que busca por _id
    const project = await Project.findById(projectId);

    // Verifica si el proyecto existe
    if (!project) {
      // Crea un error descriptivo
      const error = new Error("Proyecto no encontrado");
      // 404 Not Found - el recurso solicitado no existe
      return res.status(404).json({ error: error.message });
    }

    // Si el proyecto existe, lo adjunta al objeto request
    // Ahora req.project estará disponible en los siguientes middlewares/controladores
    req.project = project;

    // Continúa al siguiente middleware o controlador
    next();
  } catch (error) {
    // Captura cualquier error durante la búsqueda del proyecto
    // Puede ser un error de base de datos, ID inválido (cast error), etc.
    // 500 Internal Server Error - error del servidor
    res.status(500).json({ error: "Hubo un error" });
  }
}
