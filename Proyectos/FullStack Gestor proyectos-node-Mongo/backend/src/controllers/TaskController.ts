// Importación de tipos de Express para tipar Request y Response
import type { Request, Response } from "express";
// Importación del modelo de Mongoose para las tareas
import Task from "../models/Task";

/**
 * Controlador para gestionar todas las operaciones CRUD de tareas
 * Todos los métodos son estáticos para poder llamarlos sin instanciar la clase
 */
export class TaskController {
  /**
   * Crea una nueva tarea y la asocia a un proyecto
   * @param req - Request que debe contener los datos de la tarea en body y el proyecto en req.project
   * @param res - Response para enviar la respuesta al cliente
   */
  static createTask = async (req: Request, res: Response) => {
    try {
      // Crea una nueva instancia de Task con los datos del body
      const task = new Task(req.body);

      // Asigna el ID del proyecto a la tarea (relaciónMany-to-One)
      task.project = req.project.id;

      // Añade el ID de la tarea al array de tareas del proyecto (relación One-to-Many)
      req.project.tasks.push(task.id);

      // Guarda ambos documentos en paralelo
      // Promise.allSettled ejecuta todas las promesas aunque alguna falle
      await Promise.allSettled([task.save(), req.project.save()]);

      // Envía mensaje de éxito
      res.send("Tarea creada correctamente");
    } catch (error) {
      // Maneja cualquier error y devuelve status 500
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Obtiene todas las tareas asociadas a un proyecto específico
   * @param req - Request que debe contener el proyecto en req.project
   * @param res - Response con el array de tareas
   */
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      // Busca todas las tareas que pertenecen al proyecto
      // populate('project') trae los datos completos del proyecto relacionado
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );

      // Devuelve las tareas en formato JSON
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Obtiene una tarea específica por su ID con información detallada
   * Incluye datos de usuarios que la completaron y notas asociadas
   * @param req - Request que debe contener la tarea en req.task
   * @param res - Response con los datos completos de la tarea
   */
  static getTaskById = async (req: Request, res: Response) => {
    try {
      // Busca la tarea por ID y hace populate de relaciones anidadas
      const task = await Task.findById(req.task.id)
        // Trae los datos del usuario en cada registro de completedBy
        // solo trae los campos: id, name y email
        .populate({ path: "completedBy.user", select: "id name email" })
        // Trae todas las notas de la tarea
        // y dentro de cada nota, trae los datos del creador
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "id name email" },
        });

      // Devuelve la tarea con toda su información relacionada
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Actualiza el nombre y descripción de una tarea existente
   * @param req - Request con la tarea en req.task y nuevos datos en body
   * @param res - Response confirmando la actualización
   */
  static updateTask = async (req: Request, res: Response) => {
    try {
      // Actualiza solo el nombre de la tarea
      req.task.name = req.body.name;

      // Actualiza solo la descripción de la tarea
      req.task.description = req.body.description;

      // Guarda los cambios en la base de datos
      await req.task.save();

      // Confirma la actualización exitosa
      res.send("Tarea Actualizada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Elimina una tarea y la desvincula del proyecto
   * @param req - Request con la tarea en req.task y el proyecto en req.project
   * @param res - Response confirmando la eliminación
   */
  static deleteTask = async (req: Request, res: Response) => {
    try {
      // Filtra el array de tareas del proyecto para remover la referencia
      // Compara los IDs como string para asegurar igualdad exacta
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );

      // Ejecuta en paralelo la eliminación de la tarea y el guardado del proyecto
      // Promise.allSettled asegura que ambas operaciones se intenten
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      // Confirma la eliminación exitosa
      res.send("Tarea Eliminada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Actualiza el estado de una tarea y registra quién hizo el cambio
   * Mantiene un historial de cambios de estado
   * @param req - Request con el nuevo status en body, la tarea en req.task y usuario en req.user
   * @param res - Response confirmando la actualización
   */
  static updateStatus = async (req: Request, res: Response) => {
    try {
      // Extrae el nuevo estado del body
      const { status } = req.body;

      // Actualiza el estado actual de la tarea
      req.task.status = status;

      // Crea un objeto con los datos del cambio de estado
      const data = {
        user: req.user.id, // ID del usuario que hizo el cambio
        status, // Nuevo estado de la tarea
      };

      // Añade el registro al historial de cambios de estado
      req.task.completedBy.push(data);

      // Guarda la tarea con el nuevo estado y el historial actualizado
      await req.task.save();

      // Confirma la actualización
      res.send("Tarea Actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
