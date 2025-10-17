import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";

// Tipo para definir los parámetros de las funciones de la API de tareas
type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
};

/**
 * Crea una nueva tarea dentro de un proyecto específico
 * @param formData - Datos del formulario con la información de la tarea a crear
 * @param projectId - ID del proyecto al que pertenecerá la tarea
 * @returns Mensaje de confirmación de la creación
 * @throws Error si la petición falla, el proyecto no existe o los datos son inválidos
 */
export const createTask = async ({
  formData,
  projectId,
}: Pick<TaskAPI, "formData" | "projectId">) => {
  try {
    // Construye la URL para crear una tarea en el proyecto específico
    const url = `/projects/${projectId}/tasks`;

    // Realiza una petición POST para crear la nueva tarea
    const { data } = await api.post<string>(url, formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Obtiene una tarea específica por su ID dentro de un proyecto
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea a obtener
 * @returns Datos de la tarea validados con el schema
 * @throws Error si la petición falla, la tarea no existe o los datos no cumplen con el schema
 */
export const getTaskById = async ({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) => {
  try {
    // Construye la URL para obtener la tarea específica
    const url = `/projects/${projectId}/tasks/${taskId}`;

    // Realiza una petición GET para obtener los datos de la tarea
    const { data } = await api(url);

    // Valida los datos recibidos contra el schema de tareas
    const response = taskSchema.safeParse(data);

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
 * Actualiza una tarea existente con nueva información
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea a actualizar
 * @param formData - Datos del formulario con la información actualizada de la tarea
 * @returns Mensaje de confirmación de la actualización
 * @throws Error si la petición falla, la tarea no existe o los datos son inválidos
 */
export const updateTask = async ({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPI, "projectId" | "taskId" | "formData">) => {
  try {
    // Construye la URL para actualizar la tarea específica
    const url = `/projects/${projectId}/tasks/${taskId}`;

    // Realiza una petición PUT para actualizar la tarea
    const { data } = await api.put<string>(url, formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Elimina una tarea de forma permanente
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea a eliminar
 * @returns Mensaje de confirmación de la eliminación
 * @throws Error si la petición falla, la tarea no existe o el usuario no tiene permisos
 */
export const deleteTask = async ({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) => {
  try {
    // Construye la URL para eliminar la tarea específica
    const url = `/projects/${projectId}/tasks/${taskId}`;

    // Realiza una petición DELETE para eliminar la tarea
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
 * Actualiza el estado/status de una tarea (ej: pendiente, en progreso, completada)
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea a actualizar
 * @param status - Nuevo estado a asignar a la tarea
 * @returns Mensaje de confirmación del cambio de estado
 * @throws Error si la petición falla, la tarea no existe o el estado es inválido
 */
export const updateStatus = async ({
  projectId,
  taskId,
  status,
}: Pick<TaskAPI, "projectId" | "taskId" | "status">) => {
  try {
    // Construye la URL para actualizar el estado de la tarea
    const url = `/projects/${projectId}/tasks/${taskId}/status`;

    // Realiza una petición POST enviando el nuevo estado
    const { data } = await api.post<string>(url, { status });

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
