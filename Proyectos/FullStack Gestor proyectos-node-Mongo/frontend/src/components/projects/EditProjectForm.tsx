import ProjectForm from "./ProjectForm";
import { Link, useNavigate } from "react-router-dom";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

// Props del componente
type EditProjectFormProps = {
  data: ProjectFormData; // Datos actuales del proyecto para prellenar el formulario
  projectId: Project["_id"]; // ID del proyecto que se está editando
};

/**
 * Componente de formulario para editar un proyecto existente
 * Prellenar el formulario con los datos actuales del proyecto
 * Al guardar, actualiza el proyecto y redirige al dashboard
 * @param data - Datos actuales del proyecto (nombre, cliente, descripción)
 * @param projectId - ID único del proyecto a editar
 */
export default function EditProjectForm({
  data,
  projectId,
}: EditProjectFormProps) {
  // Hook para navegar de regreso al dashboard después de guardar
  const navigate = useNavigate();

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos del formulario
  // handleSubmit: maneja el envío del formulario
  // formState.errors: contiene los errores de validación
  // defaultValues: prellenar el formulario con los datos actuales del proyecto
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  // Cliente de React Query para invalidar la cache después de actualizar
  const queryClient = useQueryClient();

  // Mutación para actualizar el proyecto
  const { mutate } = useMutation({
    mutationFn: updateProject,
    // Se ejecuta cuando hay un error al actualizar
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el proyecto se actualiza exitosamente
    onSuccess: (data) => {
      // Invalida la cache de la lista de proyectos para refrescar el dashboard
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Invalida la cache del proyecto específico por si se vuelve a editar
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      toast.success(data); // Muestra mensaje de éxito
      navigate("/"); // Redirige al dashboard de proyectos
    },
  });

  /**
   * Maneja el envío del formulario para actualizar el proyecto
   * Combina los datos del formulario con el ID del proyecto
   * @param formData - Datos del formulario con la información actualizada
   */
  const handleForm = (formData: ProjectFormData) => {
    // Prepara los datos combinando formData y projectId
    const data = {
      formData,
      projectId,
    };

    // Ejecuta la mutación para actualizar el proyecto
    mutate(data);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* Encabezado de la página */}
        <h1 className="text-5xl font-black">Editar Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Llena el siguiente formulario para editar el proyecto
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

        {/* Formulario de edición */}
        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          {/* 
                        Componente reutilizable ProjectForm que contiene los campos:
                        - Nombre del Proyecto
                        - Nombre del Cliente
                        - Descripción
                        Se pasan register y errors para manejar validaciones
                    */}
          <ProjectForm register={register} errors={errors} />

          {/* Botón para guardar los cambios */}
          <input
            type="submit"
            value="Guardar Cambios"
            className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
