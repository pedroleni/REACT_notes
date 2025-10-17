import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// Props del componente
type TaskListProps = {
  tasks: TaskProject[]; // Array de todas las tareas del proyecto
  canEdit: boolean; // Indica si el usuario puede editar/eliminar tareas
};

// Tipo para agrupar tareas por estado
type GroupedTasks = {
  [key: string]: TaskProject[]; // Clave: estado, Valor: array de tareas con ese estado
};

// Estados iniciales vacíos para el tablero kanban
// Cada estado comienza con un array vacío de tareas
const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

// Estilos de color para el borde superior de cada columna del kanban
// Cada estado tiene un color único para identificación visual
const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-500", // Gris - Pendiente
  onHold: "border-t-red-500", // Rojo - En espera
  inProgress: "border-t-blue-500", // Azul - En progreso
  underReview: "border-t-amber-500", // Ámbar - En revisión
  completed: "border-t-emerald-500", // Verde - Completada
};

/**
 * Componente de tablero kanban con drag and drop para gestionar tareas
 * Agrupa las tareas por estado y permite cambiar el estado arrastrando entre columnas
 * Implementa actualización optimista de la UI antes de confirmar con el servidor
 * @param tasks - Array de todas las tareas del proyecto
 * @param canEdit - Boolean que indica si el usuario puede editar las tareas
 */
export default function TaskList({ tasks, canEdit }: TaskListProps) {
  // Obtiene el projectId desde los parámetros de la ruta
  const params = useParams();
  const projectId = params.projectId!;

  // Cliente de React Query para actualización optimista y invalidación de cache
  const queryClient = useQueryClient();

  // Mutación para actualizar el estado de una tarea
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    // Se ejecuta cuando hay un error al actualizar el estado
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el estado se actualiza exitosamente
    onSuccess: (data) => {
      toast.success(data);
      // Invalida la query del proyecto para sincronizar con los datos del servidor
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  /**
   * Agrupa las tareas por estado usando reduce
   * Itera sobre todas las tareas y las organiza en un objeto donde:
   * - La clave es el estado (pending, inProgress, etc.)
   * - El valor es un array de tareas con ese estado
   */
  const groupedTasks = tasks.reduce((acc, task) => {
    // Obtiene el grupo actual de tareas para este estado (o array vacío si no existe)
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // Agrega la tarea actual al grupo
    currentGroup = [...currentGroup, task];
    // Retorna el acumulador actualizado con el nuevo grupo
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  /**
   * Maneja el evento cuando se suelta una tarea en una nueva columna
   * Implementa actualización optimista: actualiza la UI inmediatamente antes de confirmar con el servidor
   * @param e - Evento de DragEndEvent que contiene información sobre el arrastre
   */
  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    // Si se soltó sobre una zona droppable válida
    if (over && over.id) {
      // Obtiene el ID de la tarea que se arrastró
      const taskId = active.id.toString();
      // Obtiene el nuevo estado (ID de la zona droppable donde se soltó)
      const status = over.id as TaskStatus;

      // Ejecuta la mutación para actualizar el estado en el servidor
      mutate({ projectId, taskId, status });

      /**
       * Actualización optimista de la UI
       * Actualiza inmediatamente los datos en la cache de React Query
       * sin esperar la respuesta del servidor para mejor UX
       */
      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        // Mapea todas las tareas y actualiza solo la que se arrastró
        const updatedTasks = prevData.tasks.map((task) => {
          // Si es la tarea que se arrastró, actualiza su estado
          if (task._id === taskId) {
            return {
              ...task,
              status,
            };
          }
          // Si no, retorna la tarea sin cambios
          return task;
        });

        // Retorna los datos del proyecto actualizados con las nuevas tareas
        return {
          ...prevData,
          tasks: updatedTasks,
        };
      });
    }
  };

  return (
    <>
      {/* Título de la sección */}
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      {/* Contenedor del tablero kanban con scroll horizontal */}
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        {/* Contexto de drag and drop de @dnd-kit */}
        <DndContext onDragEnd={handleDragEnd}>
          {/* Itera sobre cada estado y sus tareas */}
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              {/* Encabezado de la columna con color según el estado */}
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]} `}
              >
                {/* Muestra el nombre del estado traducido al español */}
                {statusTranslations[status]}
              </h3>

              {/* Zona droppable para soltar tareas y cambiar su estado */}
              <DropTask status={status} />

              {/* Lista de tareas en esta columna */}
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  // Mensaje cuando no hay tareas en este estado
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  // Renderiza cada tarea como una tarjeta arrastrable
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
