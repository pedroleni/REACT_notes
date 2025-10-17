import { isAxiosError } from "axios";
import api from "@/lib/axios";
import {
  Project,
  TeamMember,
  TeamMemberForm,
  teamMembersSchema,
} from "../types";

/**
 * Busca un usuario por su email para agregarlo al equipo del proyecto
 * @param projectId - ID del proyecto donde se buscará el usuario
 * @param formData - Datos del formulario con el email del usuario a buscar
 * @returns Información del usuario encontrado
 * @throws Error si la petición falla, el usuario no existe o ya es miembro del proyecto
 */
export const findUserByEmail = async ({
  projectId,
  formData,
}: {
  projectId: Project["_id"];
  formData: TeamMemberForm;
}) => {
  try {
    // Construye la URL para buscar usuario en el contexto del proyecto
    const url = `/projects/${projectId}/team/find`;

    // Realiza una petición POST para buscar el usuario por email
    const { data } = await api.post(url, formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Agrega un usuario al equipo del proyecto
 * @param projectId - ID del proyecto al que se agregará el usuario
 * @param id - ID del usuario a agregar al equipo
 * @returns Mensaje de confirmación de la incorporación al equipo
 * @throws Error si la petición falla, el usuario ya es miembro o no tiene permisos
 */
export const addUserToProject = async ({
  projectId,
  id,
}: {
  projectId: Project["_id"];
  id: TeamMember["_id"];
}) => {
  try {
    // Construye la URL para agregar un miembro al equipo del proyecto
    const url = `/projects/${projectId}/team`;

    // Realiza una petición POST enviando el ID del usuario a agregar
    const { data } = await api.post<string>(url, { id });

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Remueve un usuario del equipo del proyecto
 * @param projectId - ID del proyecto del que se removerá el usuario
 * @param userId - ID del usuario a remover del equipo
 * @returns Mensaje de confirmación de la remoción del equipo
 * @throws Error si la petición falla, el usuario no es miembro o no tiene permisos para remover
 */
export const removeUserFromProject = async ({
  projectId,
  userId,
}: {
  projectId: Project["_id"];
  userId: TeamMember["_id"];
}) => {
  try {
    // Construye la URL para remover un miembro específico del equipo
    const url = `/projects/${projectId}/team/${userId}`;

    // Realiza una petición DELETE para remover al usuario del equipo
    const { data } = await api.delete<string>(url);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Obtiene la lista completa de miembros del equipo de un proyecto
 * @param projectId - ID del proyecto del que se obtendrá el equipo
 * @returns Array de miembros del equipo validados con el schema
 * @throws Error si la petición falla, el proyecto no existe o los datos no cumplen con el schema
 */
export const getProjectTeam = async (projectId: Project["_id"]) => {
  try {
    // Construye la URL para obtener el equipo del proyecto
    const url = `/projects/${projectId}/team`;

    // Realiza una petición GET para obtener todos los miembros del equipo
    const { data } = await api(url);

    // Valida los datos recibidos contra el schema de miembros del equipo
    const response = teamMembersSchema.safeParse(data);

    // Si la validación es exitosa, retorna los datos validados
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
