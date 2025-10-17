import type { Request, Response } from "express";
import Project from "../models/Project";

/**
 * Controlador de proyectos
 * Maneja todas las operaciones CRUD de proyectos
 *
 * Funcionalidades:
 * - Crear proyectos (usuario autenticado se vuelve manager)
 * - Listar proyectos donde el usuario es manager o colaborador
 * - Obtener detalles de un proyecto específico con validación de acceso
 * - Actualizar información del proyecto (solo manager)
 * - Eliminar proyecto (solo manager)
 *
 * Permisos:
 * - Manager: Acceso completo (CRUD + gestión de equipo)
 * - Miembros del equipo: Solo lectura y gestión de tareas
 *
 * Middlewares utilizados:
 * - authenticate: Inyecta req.user con datos del usuario autenticado
 * - projectExists: Valida existencia del proyecto y lo inyecta en req.project
 * - hasAuthorization: Valida que el usuario sea manager del proyecto
 */
export class ProjectController {
  /**
   * Crea un nuevo proyecto
   * El usuario autenticado se asigna automáticamente como manager
   *
   * Flujo:
   * 1. Crea instancia del proyecto con datos del body
   * 2. Asigna al usuario actual como manager
   * 3. Guarda el proyecto en la base de datos
   *
   * @route POST /api/projects
   * @requires JWT en header Authorization
   * @body { projectName, clientName, description }
   * @returns 200 - Proyecto creado exitosamente
   * @returns 500 - Error del servidor
   */
  static createProject = async (req: Request, res: Response) => {
    // Crea una nueva instancia de proyecto con los datos del body
    const project = new Project(req.body);

    /**
     * Asigna automáticamente al usuario autenticado como manager del proyecto
     * req.user viene del middleware de autenticación que valida el JWT
     * El manager tiene todos los permisos sobre el proyecto:
     * - Editar información del proyecto
     * - Eliminar el proyecto
     * - Agregar/remover miembros del equipo
     * - Gestionar todas las tareas
     */
    project.manager = req.user.id;

    try {
      await project.save();
      res.send("Proyecto Creando Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Obtiene todos los proyectos donde el usuario tiene acceso
   * Incluye proyectos donde es manager Y proyectos donde es miembro del equipo
   *
   * Query con $or:
   * - manager: Usuario es el manager del proyecto
   * - team: Usuario está en el array de miembros del equipo
   *
   * @route GET /api/projects
   * @requires JWT en header Authorization
   * @returns 200 - Array de proyectos (sin tareas populadas)
   * @returns 500 - Error del servidor
   */
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      /**
       * Query con operador $or de MongoDB
       * Busca proyectos donde el usuario cumple AL MENOS UNA de estas condiciones:
       *
       * 1. manager: {$in: req.user.id}
       *    - El usuario es el manager del proyecto
       *    - $in permite buscar en arrays, aunque manager es un solo valor
       *
       * 2. team: {$in: req.user.id}
       *    - El usuario está en el array de miembros del equipo
       *    - team es un array de ObjectIds
       *
       * Resultado: Retorna todos los proyectos donde el usuario participa
       */
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });

      res.json(projects);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Obtiene un proyecto específico con todas sus tareas
   * Valida que el usuario tenga acceso (manager o miembro del equipo)
   *
   * Flujo:
   * 1. Busca el proyecto por ID y popula las tareas
   * 2. Valida que el proyecto exista
   * 3. Valida que el usuario sea manager O miembro del equipo
   * 4. Retorna el proyecto completo
   *
   * @route GET /api/projects/:id
   * @requires JWT en header Authorization
   * @params id - ID del proyecto
   * @returns 200 - Proyecto con tareas populadas
   * @returns 404 - Proyecto no encontrado o sin acceso
   * @returns 500 - Error del servidor
   */
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      /**
       * Busca el proyecto por ID y popula (carga) todas sus tareas
       * populate('tasks') reemplaza los IDs de tareas con los documentos completos
       * Sin populate solo tendríamos un array de ObjectIds
       */
      const project = await Project.findById(id).populate("tasks");

      // Valida que el proyecto exista
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      /**
       * Validación de permisos de acceso al proyecto
       * El usuario puede acceder SI:
       * 1. Es el manager del proyecto, O
       * 2. Es miembro del equipo (está en el array team)
       *
       * .toString() es necesario porque son ObjectIds de Mongoose
       * includes() verifica si el ID del usuario está en el array team
       */
      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Actualiza la información de un proyecto
   * Solo el manager puede actualizar el proyecto
   *
   * Flujo:
   * 1. Actualiza los campos del proyecto (req.project viene de middleware)
   * 2. Guarda los cambios en la base de datos
   *
   * @route PUT /api/projects/:projectId
   * @requires JWT en header Authorization
   * @requires Ser el manager del proyecto (validado por middleware hasAuthorization)
   * @body { projectName, clientName, description }
   * @returns 200 - Proyecto actualizado
   * @returns 500 - Error del servidor
   *
   * Nota: req.project es inyectado por el middleware projectExists
   * que valida la existencia del proyecto antes de llegar aquí
   */
  static updateProject = async (req: Request, res: Response) => {
    try {
      /**
       * Actualiza los campos del proyecto
       * req.project viene del middleware que ya validó:
       * - Que el proyecto existe
       * - Que el usuario es el manager (hasAuthorization middleware)
       */
      req.project.clientName = req.body.clientName;
      req.project.projectName = req.body.projectName;
      req.project.description = req.body.description;

      // Guarda los cambios en la base de datos
      await req.project.save();
      res.send("Proyecto Actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Elimina un proyecto permanentemente
   * Solo el manager puede eliminar el proyecto
   * Elimina también todas las tareas asociadas (cascade delete en el modelo)
   *
   * @route DELETE /api/projects/:projectId
   * @requires JWT en header Authorization
   * @requires Ser el manager del proyecto (validado por middleware hasAuthorization)
   * @requires Contraseña del usuario (validado por middleware anterior)
   * @returns 200 - Proyecto eliminado
   * @returns 500 - Error del servidor
   *
   * Nota: req.project es inyectado por el middleware projectExists
   * El middleware hasAuthorization valida que el usuario sea el manager
   */
  static deleteProject = async (req: Request, res: Response) => {
    try {
      /**
       * Elimina el proyecto de la base de datos
       * req.project viene del middleware que ya validó permisos
       *
       * El modelo tiene un hook pre('deleteOne') que elimina:
       * - Todas las tareas asociadas
       * - Todos los tokens asociados
       * - Referencias en otros documentos
       */
      await req.project.deleteOne();
      res.send("Proyecto Eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
