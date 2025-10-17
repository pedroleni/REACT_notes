import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";

/**
 * Vista para crear un nuevo proyecto
 * Permite al usuario ingresar información básica del proyecto:
 * - Nombre del proyecto
 * - Nombre del cliente
 * - Descripción del proyecto
 *
 * Después de crear el proyecto exitosamente:
 * - Se muestra una notificación de éxito
 * - El usuario es redirigido al dashboard (/) donde verá el nuevo proyecto en la lista
 *
 * Componente relacionado:
 * - ProjectForm: Formulario reutilizable usado tanto aquí como en EditProjectView
 * - Los mismos campos se usan para crear y editar proyectos
 */
export default function CreateProjectView() {
  // Hook para navegar de regreso al dashboard después de crear el proyecto
  const navigate = useNavigate();

  // Valores iniciales del formulario (todos los campos vacíos)
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos del formulario (manejado por ProjectForm)
  // handleSubmit: maneja el envío del formulario
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mutación para crear un nuevo proyecto
  const { mutate } = useMutation({
    mutationFn: createProject,
    // Se ejecuta cuando hay un error al crear el proyecto
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el proyecto se crea exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      navigate("/"); // Redirige al dashboard donde aparecerá el nuevo proyecto
    },
  });

  /**
   * Maneja el envío del formulario para crear el proyecto
   * @param formData - Datos del formulario (projectName, clientName, description)
   */
  const handleForm = (formData: ProjectFormData) => mutate(formData);

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Título principal de la vista */}
        <h1 className="text-5xl font-black">Crear Proyecto</h1>

        {/* Descripción de la acción */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Llena el siguiente formulario para crear un proyecto
        </p>

        {/* Navegación para volver al dashboard */}
        <nav className="my-5 ">
          <Link
            className=" bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/"
          >
            Volver a Proyectos
          </Link>
        </nav>

        {/* Formulario de creación de proyecto */}
        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          {/* 
                        Componente reutilizable ProjectForm que contiene los campos:
                        - Nombre del Proyecto (obligatorio)
                        - Nombre del Cliente (obligatorio)
                        - Descripción (obligatoria)
                        Se pasan register y errors para manejar validaciones
                        El mismo componente se usa en EditProjectView pero con defaultValues prellenados
                    */}
          <ProjectForm register={register} errors={errors} />

          {/* Botón para crear el proyecto */}
          <input
            type="submit"
            value="Crear Proyecto"
            className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
