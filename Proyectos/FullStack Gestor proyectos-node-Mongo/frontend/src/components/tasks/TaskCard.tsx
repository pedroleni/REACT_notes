import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskProject } from "@/types/index";
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useDraggable } from "@dnd-kit/core";

// Props del componente
type TaskCardProps = {
  task: TaskProject; // Datos de la tarea a mostrar
  canEdit: boolean; // Indica si el usuario actual puede editar/eliminar la tarea
};

/**
 * Componente de tarjeta de tarea con funcionalidad de drag and drop
 * Muestra información de la tarea y un menú de opciones (ver, editar, eliminar)
 * Solo muestra opciones de edición/eliminación si el usuario tiene permisos
 * Permite arrastrar la tarea para cambiar su estado usando @dnd-kit
 * @param task - Objeto con los datos de la tarea (nombre, descripción, estado, etc.)
 * @param canEdit - Boolean que indica si el usuario puede editar/eliminar la tarea
 */
export default function TaskCard({ task, canEdit }: TaskCardProps) {
  // Hook de @dnd-kit para hacer esta tarjeta arrastrable
  // attributes: atributos de accesibilidad para el elemento arrastrable
  // listeners: event handlers para detectar el arrastre (mousedown, touchstart, etc.)
  // setNodeRef: ref que se debe asignar al elemento DOM arrastrable
  // transform: objeto con las coordenadas x,y del movimiento del arrastre
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    // ID único del elemento arrastrable, usa el ID de la tarea
    id: task._id,
  });

  // Hook para navegar a diferentes rutas (ver/editar tarea)
  const navigate = useNavigate();

  // Obtiene el projectId desde los parámetros de la ruta
  const params = useParams();
  const projectId = params.projectId!;

  // Cliente de React Query para invalidar la cache después de eliminar
  const queryClient = useQueryClient();

  // Mutación para eliminar la tarea
  const { mutate } = useMutation({
    mutationFn: deleteTask,
    // Se ejecuta cuando hay un error al eliminar
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando la tarea se elimina exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la query del proyecto para refrescar la lista de tareas
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  // Estilo dinámico aplicado mientras la tarea está siendo arrastrada
  // Si transform existe (está siendo arrastrada), aplica estilos de arrastre
  // Si transform es undefined (no se está arrastrando), no aplica estilos adicionales
  const style = transform
    ? {
        // Transforma la posición de la tarjeta según las coordenadas del arrastre
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        padding: "1.25rem",
        backgroundColor: "#FFF",
        width: "300px",
        display: "flex",
        borderWidth: "1px",
        borderColor: "rgb(203 213 225 / var(--tw-border-opacity))",
      }
    : undefined;

  return (
    <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
      {/* Contenedor arrastrable de la tarea */}
      <div
        {...listeners} // Event handlers para detectar inicio del arrastre
        {...attributes} // Atributos de accesibilidad
        ref={setNodeRef} // Ref necesaria para el drag and drop
        style={style} // Estilos dinámicos durante el arrastre
        className=" min-w-0 flex flex-col gap-y-4"
      >
        {/* Nombre de la tarea */}
        <p className="text-xl font-bold text-slate-600 text-left">
          {task.name}
        </p>

        {/* Descripción de la tarea */}
        <p className="text-slate-500">{task.description}</p>
      </div>

      {/* Contenedor del menú de opciones */}
      <div className="flex shrink-0  gap-x-6">
        {/* Menú dropdown de Headless UI */}
        <Menu as="div" className="relative flex-none">
          {/* Botón para abrir el menú (tres puntos verticales) */}
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>

          {/* Animación de transición para el menú */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* Lista de opciones del menú */}
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {/* Opción: Ver Tarea (siempre visible para todos) */}
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>

              {/* Opciones de Editar y Eliminar (solo visibles si canEdit es true) */}
              {canEdit && (
                <>
                  {/* Opción: Editar Tarea */}
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900"
                      onClick={() =>
                        navigate(location.pathname + `?editTask=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </Menu.Item>

                  {/* Opción: Eliminar Tarea (en rojo para indicar acción destructiva) */}
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-red-500"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      Eliminar Tarea
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
