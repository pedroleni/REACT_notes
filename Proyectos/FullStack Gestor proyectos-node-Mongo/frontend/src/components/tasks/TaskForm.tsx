import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

// Props del componente
type TaskFormProps = {
  errors: FieldErrors<TaskFormData>; // Objeto con errores de validación de React Hook Form
  register: UseFormRegister<TaskFormData>; // Función de React Hook Form para registrar campos
};

/**
 * Componente de formulario reutilizable para tareas
 * Contiene los campos necesarios para crear o editar una tarea:
 * - Nombre de la tarea
 * - Descripción de la tarea
 * Se utiliza tanto en AddTaskModal como en EditTaskModal
 * @param errors - Objeto con los errores de validación para mostrar mensajes al usuario
 * @param register - Función de React Hook Form para registrar y validar los campos
 */
export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      {/* Campo: Nombre de la tarea */}
      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="name">
          Nombre de la tarea
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nombre de la tarea"
          className="w-full p-3  border-gray-300 border"
          {...register("name", {
            // Validación: campo obligatorio
            required: "El nombre de la tarea es obligatorio",
          })}
        />

        {/* Muestra mensaje de error si el campo está vacío o es inválido */}
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      {/* Campo: Descripción de la tarea */}
      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="description">
          Descripción de la tarea
        </label>
        <textarea
          id="description"
          placeholder="Descripción de la tarea"
          className="w-full p-3  border-gray-300 border"
          {...register("description", {
            // Validación: campo obligatorio
            required: "La descripción de la tarea es obligatoria",
          })}
        />

        {/* Muestra mensaje de error si el campo está vacío o es inválido */}
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    </>
  );
}
