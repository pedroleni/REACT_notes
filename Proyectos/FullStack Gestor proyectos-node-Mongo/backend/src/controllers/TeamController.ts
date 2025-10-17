// Importación de tipos de Express para tipar Request y Response
import type { Request, Response } from "express";
// Importación de modelos de Mongoose
import User from "../models/User";
import Project from "../models/Project";

/**
 * Controlador para gestionar los miembros del equipo de un proyecto
 * Permite buscar usuarios, añadirlos o removerlos del equipo
 */
export class TeamMemberController {
  /**
   * Busca un usuario por su email
   * Útil para verificar si existe antes de añadirlo al equipo
   * @param req - Request que debe contener el email en body
   * @param res - Response con los datos del usuario (id, email, name)
   */
  static findMemberByEmail = async (req: Request, res: Response) => {
    // Extrae el email del body de la petición
    const { email } = req.body;

    // Busca al usuario por email
    // select('id email name') solo devuelve estos campos específicos
    const user = await User.findOne({ email }).select("id email name");

    // Si no existe el usuario, devuelve error 404
    if (!user) {
      const error = new Error("Usuario No Encontrado");
      return res.status(404).json({ error: error.message });
    }

    // Devuelve los datos del usuario encontrado
    res.json(user);
  };

  /**
   * Obtiene todos los miembros del equipo de un proyecto
   * @param req - Request que debe contener el proyecto en req.project
   * @param res - Response con el array de miembros del equipo
   */
  static getProjecTeam = async (req: Request, res: Response) => {
    // Busca el proyecto por ID y hace populate del campo team
    // populate trae los datos completos de cada miembro (no solo sus IDs)
    // select especifica que solo queremos id, email y name de cada miembro
    const project = await Project.findById(req.project.id).populate({
      path: "team",
      select: "id email name",
    });

    // Devuelve solo el array de miembros del equipo
    res.json(project.team);
  };

  /**
   * Añade un miembro al equipo del proyecto por su ID
   * Valida que el usuario existe y no está ya en el equipo
   * @param req - Request con el ID del usuario en body y proyecto en req.project
   * @param res - Response confirmando la operación
   */
  static addMemberById = async (req: Request, res: Response) => {
    // Extrae el ID del usuario del body
    const { id } = req.body;

    // Busca al usuario por ID
    // Solo necesitamos el id para añadirlo al equipo
    const user = await User.findById(id).select("id");

    // Si el usuario no existe, devuelve error 404
    if (!user) {
      const error = new Error("Usuario No Encontrado");
      return res.status(404).json({ error: error.message });
    }

    // Verifica si el usuario ya está en el equipo
    // some() devuelve true si encuentra al menos un elemento que cumple la condición
    // Convierte ambos IDs a string para comparación segura
    if (
      req.project.team.some((team) => team.toString() === user.id.toString())
    ) {
      const error = new Error("El usuario ya existe en el proyecto");
      // 409 Conflict - el recurso ya existe
      return res.status(409).json({ error: error.message });
    }

    // Añade el ID del usuario al array de team del proyecto
    req.project.team.push(user.id);

    // Guarda los cambios en la base de datos
    await req.project.save();

    // Confirma que el usuario fue agregado exitosamente
    res.send("Usuario agregado correctamente");
  };

  /**
   * Remueve un miembro del equipo del proyecto
   * Valida que el usuario existe en el equipo antes de eliminarlo
   * @param req - Request con userId en params y proyecto en req.project
   * @param res - Response confirmando la eliminación
   */
  static removeMemberById = async (req: Request, res: Response) => {
    // Extrae el userId de los parámetros de la URL
    const { userId } = req.params;

    // Verifica que el usuario existe en el equipo
    // Si NO existe (!some), devuelve error
    if (!req.project.team.some((team) => team.toString() === userId)) {
      const error = new Error("El usuario no existe en el proyecto");
      // 409 Conflict - operación no válida en el estado actual
      return res.status(409).json({ error: error.message });
    }

    // Filtra el array de team removiendo el usuario especificado
    // Mantiene todos los miembros excepto el que coincide con userId
    req.project.team = req.project.team.filter(
      (teamMember) => teamMember.toString() !== userId
    );

    // Guarda los cambios en la base de datos
    await req.project.save();

    // Confirma que el usuario fue eliminado exitosamente
    res.send("Usuario eliminado correctamente");
  };
}
