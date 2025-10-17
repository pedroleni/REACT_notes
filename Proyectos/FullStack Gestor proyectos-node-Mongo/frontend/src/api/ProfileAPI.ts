import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

/**
 * Actualiza el perfil del usuario autenticado
 * @param formData - Datos del formulario con la información del perfil a actualizar
 * @returns Mensaje de confirmación de la actualización
 * @throws Error si la petición falla o el usuario no está autenticado
 */
export const updateProfile = async (formData: UserProfileForm) => {
  try {
    // Realiza una petición PUT para actualizar el perfil del usuario
    const { data } = await api.put<string>("/auth/profile", formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

/**
 * Cambia la contraseña del usuario autenticado
 * @param formData - Datos del formulario con la contraseña actual y la nueva contraseña
 * @returns Mensaje de confirmación del cambio de contraseña
 * @throws Error si la petición falla, la contraseña actual es incorrecta o el usuario no está autenticado
 */
export const changePassword = async (
  formData: UpdateCurrentUserPasswordForm
) => {
  try {
    // Realiza una petición POST para actualizar la contraseña del usuario
    const { data } = await api.post<string>("/auth/update-password", formData);

    return data;
  } catch (error) {
    // Manejo de errores: verifica si es un error de Axios con respuesta del servidor
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
