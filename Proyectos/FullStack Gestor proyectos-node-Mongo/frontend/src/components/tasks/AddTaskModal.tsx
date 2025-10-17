import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskForm from "./TaskForm";
import { TaskFormData } from "@/types/index";
import { createTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";

/**
 * Modal para crear una nueva tarea en un proyecto
 * Se muestra cuando existe el query param '?newTask' en la URL
 * Después de crear la tarea, actualiza la lista del proyecto y cierra el modal
 */
export default function AddTaskModal() {
  // Hook para navegar y cerrar el modal
  const navigate = useNavigate();

  // Hook para obtener la ubicación actual y leer query params
  const location = useLocation();

  // Extrae los query params de la URL
  const queryParams = new URLSearchParams(location.search);

  // Verifica si existe el query param 'newTask' para mostrar el modal
  const modalTask = queryParams.get("newTask");

  // El modal se muestra si existe el query param newTask
  const show = modalTask ? true : false;

  // Obtiene el projectId desde los parámetros de la ruta (/projects/:projectId)
  const params = useParams();
  const projectId = params.projectId!;

  // Valores iniciales del formulario (campos vacíos)
  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos del formulario
  // handleSubmit: maneja el envío del formulario
  // reset: limpia el formulario después de crear la tarea
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Cliente de React Query para invalidar la cache después de crear
  const queryClient = useQueryClient();

  // Mutación para crear una nueva tarea
  const { mutate } = useMutation({
    mutationFn: createTask,
    // Se ejecuta cuando hay un error al crear la tarea
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando la tarea se crea exitosamente
    onSuccess: (data) => {
      // Invalida la query del proyecto para refrescar y mostrar la nueva tarea
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data); // Muestra mensaje de éxito
      reset(); // Limpia el formulario
      // Cierra el modal navegando a la misma ruta sin query params
      navigate(location.pathname, { replace: true });
    },
  });

  /**
   * Maneja el envío del formulario para crear una nueva tarea
   * Combina los datos del formulario con el ID del proyecto
   * @param formData - Datos del formulario con nombre y descripción de la tarea
   */
  const handleCreateTask = (formData: TaskFormData) => {
    // Prepara los datos combinando formData y projectId
    const data = {
      formData,
      projectId,
    };

    // Ejecuta la mutación para crear la tarea
    mutate(data);
  };

  return (
    <>
      {/* Transition de Headless UI para animaciones suaves */}
      <Transition appear show={show} as={Fragment}>
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
                    Nueva Tarea
                  </Dialog.Title>

                  {/* Descripción del propósito del formulario */}
                  <p className="text-xl font-bold">
                    Llena el formulario y crea {""}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  {/* Formulario para crear la tarea */}
                  <form
                    className="mt-10 space-y-3"
                    onSubmit={handleSubmit(handleCreateTask)}
                    noValidate
                  >
                    {/* 
                                            Componente reutilizable TaskForm que contiene:
                                            - Campo de nombre de la tarea
                                            - Campo de descripción de la tarea
                                            Se pasan register y errors para manejar validaciones
                                        */}
                    <TaskForm register={register} errors={errors} />

                    {/* Botón para guardar la nueva tarea */}
                    <input
                      type="submit"
                      className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                      value="Guardar Tarea"
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
