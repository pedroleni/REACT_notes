import { isAxiosError } from "axios";
import { Note, NoteFormData, Project, Task } from "../types";
import api from "@/lib/axios";

// Tipo para definir los parámetros de las funciones de la API de notas
type NoteAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

/**
 * Elimina una nota específica de una tarea
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea que contiene la nota
 * @param noteId - ID de la nota a eliminar
 * @returns Mensaje de confirmación de la eliminación
 * @throws Error si la petición falla
 */
export const deleteNote = async ({
  projectId,
  taskId,
  noteId,
}: Pick<NoteAPIType, "projectId" | "taskId" | "noteId">) => {
  try {
    // Construye la URL para eliminar la nota específica
    const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`;

    // Realiza la petición DELETE al servidor
    const { data } = await api.delete<string>(url);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Crea una nueva nota en una tarea específica
 * @param projectId - ID del proyecto al que pertenece la tarea
 * @param taskId - ID de la tarea donde se creará la nota
 * @param formData - Datos del formulario con el contenido de la nota
 * @returns Mensaje de confirmación de la creación
 * @throws Error si la petición falla
 */
export const createNote = async ({
  projectId,
  taskId,
  formData,
}: Pick<NoteAPIType, "projectId" | "taskId" | "formData">) => {
  try {
    // Construye la URL para crear una nueva nota en la tarea
    const url = `/projects/${projectId}/tasks/${taskId}/notes`;

    // Realiza la petición POST enviando los datos del formulario
    const { data } = await api.post<string>(url, formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
