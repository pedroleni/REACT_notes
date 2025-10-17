import { UseFormRegister, FieldErrors } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ProjectFormData } from "types";

// Props del componente
type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>; // Función de React Hook Form para registrar campos
  errors: FieldErrors<ProjectFormData>; // Objeto con errores de validación de React Hook Form
};

/**
 * Componente de formulario reutilizable para proyectos
 * Contiene los campos necesarios para crear o editar un proyecto:
 * - Nombre del Proyecto
 * - Nombre del Cliente
 * - Descripción
 * Se utiliza tanto en CreateProject como en EditProject
 * @param register - Función de React Hook Form para registrar y validar los campos
 * @param errors - Objeto con los errores de validación para mostrar mensajes al usuario
 */
export default function ProjectForm({ errors, register }: ProjectFormProps) {
  return (
    <>
      {/* Campo: Nombre del Proyecto */}
      <div className="mb-5 space-y-3">
        <label htmlFor="projectName" className="text-sm uppercase font-bold">
          Nombre del Proyecto
        </label>
        <input
          id="projectName"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Nombre del Proyecto"
          {...register("projectName", {
            // Validación: campo obligatorio
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />

        {/* Muestra mensaje de error si el campo está vacío o es inválido */}
        {errors.projectName && (
          <ErrorMessage>{errors.projectName.message}</ErrorMessage>
        )}
      </div>

      {/* Campo: Nombre del Cliente */}
      <div className="mb-5 space-y-3">
        <label htmlFor="clientName" className="text-sm uppercase font-bold">
          Nombre Cliente
        </label>
        <input
          id="clientName"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Nombre del Cliente"
          {...register("clientName", {
            // Validación: campo obligatorio
            required: "El Nombre del Cliente es obligatorio",
          })}
        />

        {/* Muestra mensaje de error si el campo está vacío o es inválido */}
        {errors.clientName && (
          <ErrorMessage>{errors.clientName.message}</ErrorMessage>
        )}
      </div>

      {/* Campo: Descripción del Proyecto */}
      <div className="mb-5 space-y-3">
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full p-3  border border-gray-200"
          placeholder="Descripción del Proyecto"
          {...register("description", {
            // Validación: campo obligatorio
            required: "Una descripción del proyecto es obligatoria",
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
