import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

/**
 * Tipo para los parámetros de URL que incluyen noteId
 * Se usa en rutas como /projects/:projectId/tasks/:taskId/notes/:noteId
 */
type NoteParams = {
  noteId: Types.ObjectId;
};

/**
 * Controlador de notas asociadas a tareas
 * Las notas permiten agregar comentarios o información adicional a las tareas
 *
 * Funcionalidades:
 * - Crear notas en una tarea
 * - Obtener todas las notas de una tarea
 * - Eliminar notas (solo el creador)
 *
 * Seguridad:
 * - req.task es inyectado por middleware que valida acceso al proyecto
 * - req.user es inyectado por middleware de autenticación
 * - Solo el creador de una nota puede eliminarla
 */
export class NoteController {
  /**
   * Crea una nueva nota en una tarea
   * La nota se asocia automáticamente al usuario que la crea y a la tarea
   *
   * Flujo:
   * 1. Crea la nota con el contenido del body
   * 2. Asocia la nota al usuario autenticado (createdBy)
   * 3. Asocia la nota a la tarea actual
   * 4. Agrega el ID de la nota al array de notas de la tarea
   * 5. Guarda ambos documentos en paralelo
   *
   * @route POST /api/projects/:projectId/tasks/:taskId/notes
   * @requires JWT en header Authorization
   * @requires Acceso al proyecto (manager o miembro del equipo)
   * @body { content: string } - Contenido de la nota
   * @returns 200 - Nota creada
   * @returns 500 - Error del servidor
   */
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;

    // Crea una nueva instancia de nota
    const note = new Note();
    note.content = content;

    // Asocia la nota al usuario que la está creando
    // req.user viene del middleware de autenticación
    note.createdBy = req.user.id;

    // Asocia la nota a la tarea actual
    // req.task viene del middleware que valida acceso a la tarea
    note.task = req.task.id;

    // Agrega el ID de la nota al array de notas de la tarea
    // Esto mantiene la relación bidireccional Task <-> Note
    req.task.notes.push(note.id);

    try {
      // Guarda la tarea actualizada y la nueva nota en paralelo
      // Promise.allSettled espera ambas operaciones pero no falla si una falla
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send("Nota Creada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Obtiene todas las notas de una tarea específica
   * Las notas se retornan con información del usuario que las creó
   * (populate se hace en el modelo)
   *
   * @route GET /api/projects/:projectId/tasks/:taskId/notes
   * @requires JWT en header Authorization
   * @requires Acceso al proyecto
   * @returns 200 - Array de notas con información de usuarios
   * @returns 500 - Error del servidor
   */
  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      // Busca todas las notas que pertenecen a la tarea actual
      // req.task viene del middleware que valida acceso
      const notes = await Note.find({ task: req.task.id });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Elimina una nota específica
   * Solo el creador de la nota puede eliminarla
   *
   * Flujo:
   * 1. Valida que la nota exista
   * 2. Valida que el usuario actual sea el creador
   * 3. Elimina la referencia de la nota del array de la tarea
   * 4. Elimina la nota de la BD
   * 5. Guarda la tarea actualizada
   *
   * @route DELETE /api/projects/:projectId/tasks/:taskId/notes/:noteId
   * @requires JWT en header Authorization
   * @requires Ser el creador de la nota
   * @params noteId - ID de la nota a eliminar
   * @returns 200 - Nota eliminada
   * @returns 404 - Nota no encontrada
   * @returns 401 - No autorizado (no es el creador)
   * @returns 500 - Error del servidor
   */
  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const { noteId } = req.params;

    // Busca la nota por ID
    const note = await Note.findById(noteId);

    // Valida que la nota exista
    if (!note) {
      const error = new Error("Nota no encontrada");
      return res.status(404).json({ error: error.message });
    }

    /**
     * Validación de permisos: Solo el creador puede eliminar
     * Compara el ID del creador de la nota con el ID del usuario autenticado
     * .toString() es necesario porque son ObjectId de Mongoose
     */
    if (note.createdBy.toString() !== req.user.id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(401).json({ error: error.message });
    }

    /**
     * Elimina la referencia de la nota del array de notas de la tarea
     * Filtra el array manteniendo solo las notas que NO son la que se está eliminando
     * Esto mantiene la consistencia de la relación Task <-> Note
     */
    req.task.notes = req.task.notes.filter(
      (note) => note.toString() !== noteId.toString()
    );

    try {
      // Guarda la tarea actualizada y elimina la nota en paralelo
      await Promise.allSettled([req.task.save(), note.deleteOne()]);
      res.send("Nota Eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
