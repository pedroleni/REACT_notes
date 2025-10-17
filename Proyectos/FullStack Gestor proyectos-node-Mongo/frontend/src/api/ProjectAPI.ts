import api from "@/lib/axios";
import {
  Project,
  ProjectFormData,
  dashboardProjectSchema,
  editProjectSchema,
  projectSchema,
} from "../types";
import { isAxiosError } from "axios";

/**
 * Crea un nuevo proyecto
 * @param formData - Datos del formulario con la información del proyecto a crear
 * @returns Mensaje de confirmación de la creación
 * @throws Error si la petición falla o los datos son inválidos
 */
export const createProject = async (formData: ProjectFormData) => {
  try {
    // Realiza una petición POST para crear un nuevo proyecto
    const { data } = await api.post("/projects", formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Obtiene la lista de todos los proyectos del usuario autenticado
 * @returns Array de proyectos validados con el schema del dashboard
 * @throws Error si la petición falla o los datos no cumplen con el schema
 */
export const getProjects = async () => {
  try {
    // Realiza una petición GET para obtener todos los proyectos
    const { data } = await api("/projects");

    // Valida los datos recibidos contra el schema del dashboard
    const response = dashboardProjectSchema.safeParse(data);

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

/**
 * Obtiene un proyecto específico por su ID (versión para edición)
 * @param id - ID único del proyecto a obtener
 * @returns Datos del proyecto validados con el schema de edición
 * @throws Error si la petición falla, el proyecto no existe o los datos no cumplen con el schema
 */
export const getProjectById = async (id: Project["_id"]) => {
  try {
    // Realiza una petición GET para obtener el proyecto por ID
    const { data } = await api(`/projects/${id}`);

    // Valida los datos recibidos contra el schema de edición
    const response = editProjectSchema.safeParse(data);

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

/**
 * Obtiene un proyecto completo con toda su información (incluye tareas, equipo, etc.)
 * @param id - ID único del proyecto a obtener
 * @returns Datos completos del proyecto validados con el schema completo
 * @throws Error si la petición falla, el proyecto no existe o los datos no cumplen con el schema
 */
export const getFullProject = async (id: Project["_id"]) => {
  try {
    // Realiza una petición GET para obtener el proyecto completo por ID
    const { data } = await api(`/projects/${id}`);

    // Valida los datos recibidos contra el schema completo del proyecto
    const response = projectSchema.safeParse(data);

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

// Tipo para definir los parámetros de las funciones de actualización de proyectos
type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

/**
 * Actualiza un proyecto existente
 * @param formData - Datos del formulario con la información actualizada del proyecto
 * @param projectId - ID del proyecto a actualizar
 * @returns Mensaje de confirmación de la actualización
 * @throws Error si la petición falla, el proyecto no existe o los datos son inválidos
 */
export const updateProject = async ({
  formData,
  projectId,
}: ProjectAPIType) => {
  try {
    // Realiza una petición PUT para actualizar el proyecto
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Elimina un proyecto de forma permanente
 * @param id - ID del proyecto a eliminar
 * @returns Mensaje de confirmación de la eliminación
 * @throws Error si la petición falla, el proyecto no existe o el usuario no tiene permisos
 */
export const deleteProject = async (id: Project["_id"]) => {
  try {
    // Construye la URL para eliminar el proyecto específico
    const url = `/projects/${id}`;

    // Realiza una petición DELETE para eliminar el proyecto
    const { data } = await api.delete<string>(url);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
