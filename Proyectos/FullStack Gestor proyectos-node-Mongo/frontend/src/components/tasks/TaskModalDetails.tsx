import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { formatDate } from "@/utils/utils";
import { TaskStatus } from "@/types/index";
import { statusTranslations } from "@/locales/es";
import NotesPanel from "../notes/NotesPanel";

/**
 * Modal de detalles completos de una tarea
 * Muestra información detallada incluyendo:
 * - Fechas de creación y última actualización
 * - Nombre y descripción
 * - Historial de cambios de estado con usuarios que los realizaron
 * - Select para cambiar el estado actual
 * - Panel de notas asociadas a la tarea
 * Se activa con el query param '?viewTask=taskId'
 */
export default function TaskModalDetails() {
  // Obtiene el projectId desde los parámetros de la ruta
  const params = useParams();
  const projectId = params.projectId!;

  // Hook para navegar y cerrar el modal
  const navigate = useNavigate();

  // Hook para obtener la ubicación actual y leer query params
  const location = useLocation();

  // Extrae los query params de la URL
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID de la tarea desde el query param (?viewTask=123)
  const taskId = queryParams.get("viewTask")!;

  // El modal se muestra si existe el query param viewTask
  const show = taskId ? true : false;

  // Query de React Query para obtener los datos completos de la tarea
  const { data, isError, error } = useQuery({
    // Key única para identificar esta query en la cache
    queryKey: ["task", taskId],
    // Función que obtiene los datos de la tarea desde la API
    queryFn: () => getTaskById({ projectId, taskId }),
    // Solo ejecuta la query si taskId existe
    enabled: !!taskId,
    // No reintenta si falla (para manejar errores 404 directamente)
    retry: false,
  });

  // Cliente de React Query para invalidar la cache después de actualizar
  const queryClient = useQueryClient();

  // Mutación para actualizar el estado de la tarea
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    // Se ejecuta cuando hay un error al actualizar el estado
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el estado se actualiza exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la query del proyecto para refrescar el tablero kanban
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // Invalida la query de la tarea específica para actualizar los detalles
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  /**
   * Maneja el cambio de estado desde el select
   * Se ejecuta cada vez que el usuario selecciona un nuevo estado
   * @param e - Evento del select con el nuevo valor del estado
   */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Obtiene el nuevo estado seleccionado
    const status = e.target.value as TaskStatus;
    // Prepara los datos para la mutación
    const data = { projectId, taskId, status };
    // Ejecuta la mutación para actualizar el estado
    mutate(data);
  };

  // Si hay error al cargar la tarea (no existe, sin permisos, etc.)
  // Muestra un toast de error y redirige al proyecto
  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  // Si los datos se cargaron exitosamente, renderiza el modal con los detalles
  if (data)
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
                    {/* Fechas de creación y última actualización */}
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>

                    {/* Nombre de la tarea como título principal */}
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </Dialog.Title>

                    {/* Descripción de la tarea */}
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>

                    {/* Historial de cambios de estado (solo si existe) */}
                    {data.completedBy.length ? (
                      <>
                        <p className="font-bold text-2xl text-slate-600 my-5">
                          Historial de Cambios
                        </p>

                        {/* Lista de todos los cambios de estado con el usuario que los realizó */}
                        <ul className=" list-decimal">
                          {data.completedBy.map((activityLog) => (
                            <li key={activityLog._id}>
                              <span className="font-bold text-slate-600">
                                {/* Muestra el estado traducido al español */}
                                {statusTranslations[activityLog.status]}
                              </span>{" "}
                              por: {activityLog.user.name}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {/* Select para cambiar el estado actual de la tarea */}
                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual:</label>
                      <select
                        className="w-full p-3 bg-white border border-gray-300"
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {/* Genera opciones para cada estado disponible */}
                        {Object.entries(statusTranslations).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Panel de notas asociadas a la tarea */}
                    <NotesPanel notes={data.notes} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
