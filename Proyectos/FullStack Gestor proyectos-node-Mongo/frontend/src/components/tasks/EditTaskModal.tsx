import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { updateTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";

// Props del componente
type EditTaskModalProps = {
  data: Task; // Datos actuales de la tarea para prellenar el formulario
  taskId: Task["_id"]; // ID de la tarea que se está editando
};

/**
 * Modal para editar una tarea existente
 * Prellenar el formulario con los datos actuales de la tarea
 * Al guardar, actualiza la tarea, invalida la cache y cierra el modal
 * Se renderiza cuando el componente EditTaskData carga los datos exitosamente
 * @param data - Objeto con los datos actuales de la tarea (nombre, descripción, estado, etc.)
 * @param taskId - ID único de la tarea a editar
 */
export default function EditTaskModal({ data, taskId }: EditTaskModalProps) {
  // Hook para navegar y cerrar el modal después de guardar
  const navigate = useNavigate();

  // Obtiene el projectId desde los parámetros de la ruta (/projects/:projectId)
  const params = useParams();
  const projectId = params.projectId!;

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos del formulario
  // handleSubmit: maneja el envío del formulario
  // reset: limpia el formulario después de actualizar
  // formState.errors: contiene los errores de validación
  // defaultValues: prellenar el formulario con los datos actuales de la tarea
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      name: data.name,
      description: data.description,
    },
  });

  // Cliente de React Query para invalidar la cache después de actualizar
  const queryClient = useQueryClient();

  // Mutación para actualizar la tarea
  const { mutate } = useMutation({
    mutationFn: updateTask,
    // Se ejecuta cuando hay un error al actualizar la tarea
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando la tarea se actualiza exitosamente
    onSuccess: (data) => {
      // Invalida la query del proyecto para refrescar la lista de tareas
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // Invalida la query de la tarea específica para actualizar su cache
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success(data); // Muestra mensaje de éxito
      reset(); // Limpia el formulario
      // Cierra el modal navegando a la misma ruta sin query params
      navigate(location.pathname, { replace: true });
    },
  });

  /**
   * Maneja el envío del formulario para actualizar la tarea
   * Combina projectId, taskId y los datos del formulario
   * @param formData - Datos del formulario con el nombre y descripción actualizados
   */
  const handleEditTask = (formData: TaskFormData) => {
    // Prepara los datos combinando projectId, taskId y formData
    const data = { projectId, taskId, formData };

    // Ejecuta la mutación para actualizar la tarea
    mutate(data);
  };

  return (
    // Transition de Headless UI para animaciones suaves
    // show={true} porque este componente solo se renderiza cuando hay datos
    <Transition appear show={true} as={Fragment}>
      {/* Dialog modal que se cierra al hacer clic en el overlay */}
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        {/* Overlay oscuro del fondo con animación de fade */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* Contenedor del modal centrado en la pantalla */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Panel del modal con animación de escala */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                {/* Título del modal */}
                <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                  Editar Tarea
                </Dialog.Title>

                {/* Descripción del propósito del formulario */}
                <p className="text-xl font-bold">
                  Realiza cambios a una tarea en {""}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>

                {/* Formulario para editar la tarea */}
                <form
                  className="mt-10 space-y-3"
                  onSubmit={handleSubmit(handleEditTask)}
                  noValidate
                >
                  {/* 
                                        Componente reutilizable TaskForm que contiene:
                                        - Campo de nombre de la tarea
                                        - Campo de descripción de la tarea
                                        Los campos están prellenados con los datos actuales
                                    */}
                  <TaskForm register={register} errors={errors} />

                  {/* Botón para guardar los cambios */}
                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Guardar Tarea"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
