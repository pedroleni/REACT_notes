import { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteAPI";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

/**
 * Componente de formulario para agregar notas a una tarea específica
 * Obtiene el projectId de los parámetros de la ruta y el taskId de los query params
 * Las notas permiten agregar comentarios o información adicional a las tareas
 */
export default function AddNoteForm() {
  // Hook para obtener parámetros de la URL (ej: /projects/:projectId)
  const params = useParams();

  // Hook para obtener información de la ubicación actual (incluye query params)
  const location = useLocation();

  // Crea un objeto URLSearchParams para facilitar el acceso a los query params
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID del proyecto desde los parámetros de la ruta
  // El operador ! indica que estamos seguros de que existe el valor
  const projectId = params.projectId!;

  // Obtiene el ID de la tarea desde los query params (ej: ?viewTask=123)
  const taskId = queryParams.get("viewTask")!;

  // Valores iniciales del formulario (campo de contenido vacío)
  const initialValues: NoteFormData = {
    content: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los inputs
  // handleSubmit: maneja el envío
  // reset: limpia el formulario después de crear la nota
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Cliente de React Query para invalidar queries y actualizar la cache
  const queryClient = useQueryClient();

  // Mutación para crear una nueva nota
  const { mutate } = useMutation({
    mutationFn: createNote,
    // Se ejecuta cuando hay un error al crear la nota
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando la nota se crea exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la query de la tarea para refrescar los datos y mostrar la nueva nota
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  /**
   * Maneja el envío del formulario para crear una nueva nota
   * @param formData - Datos del formulario con el contenido de la nota
   */
  const handleAddNote = (formData: NoteFormData) => {
    // Ejecuta la mutación enviando el projectId, taskId y los datos del formulario
    mutate({ projectId, taskId, formData });

    // Limpia el formulario después de enviar (permite agregar otra nota inmediatamente)
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      {/* Campo de entrada para el contenido de la nota */}
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>

        <input
          id="content"
          type="text"
          placeholder="Contenido de la nota"
          className="w-full p-3 border border-gray-300"
          {...register("content", {
            required: "El Contenido de la nota es obligatorio",
          })}
        />

        {/* Muestra mensaje de error si el campo está vacío */}
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>

      {/* Botón de envío */}
      <input
        type="submit"
        value="Crear Nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
      />
    </form>
  );
}
